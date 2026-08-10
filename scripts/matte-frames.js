// Isolates the machine from its studio backdrop across all 150 source
// frames, in one deterministic pass: sharpen + contrast, then background
// removal, then watermark masking. Output is RGBA WebP with the backdrop
// and the machine's own cast shadow both fully transparent — grounding is
// handled separately by a constant CSS shadow in the app (see
// PinnedCanvasSpine.tsx), specifically so nothing about the shadow can vary
// frame to frame.
//
// Approach: the backdrop is a smooth, non-uniform studio gradient (not a
// flat color), so rather than keying against one background color, we
// reconstruct the actual gradient as a "clean plate" — harmonic (Laplace)
// inpainting from the outer border of frame 1, where every pixel is
// confirmed background — then key each frame by per-pixel distance from
// that plate. Distances were sampled extensively during development:
// background/shadow tops out around ~95, real machine material (chassis
// plastic, the wine accent strip, metal edges) sits at 150+, so a
// low/high band of 16/100 cleanly separates the two with no observed
// bleed into the casing.
//
// Run: node scripts/matte-frames.js [frameNumber]   (omit to process all 150)
const sharp = require('sharp')
const fs = require('fs')
const path = require('path')

const SRC_DIR = path.join(__dirname, '..', 'frames')
const OUT_DIR = path.join(__dirname, '..', 'public', 'frames-matted')
const W = 1280
const H = 720
const FRAME_COUNT = 150
const GRID_W = 160
const GRID_H = 90

// The assembled machine (frame 1, used to derive the background plate) is
// tall and nearly centered — measured extent x:[424,1216] y:[106,636] — so
// the safe "known background" region is asymmetric, not a uniform ring.
const MARGIN_LEFT = 360
const MARGIN_RIGHT = 260
const MARGIN_TOP = 85
const MARGIN_BOTTOM = 55
const INPAINT_ITERATIONS = 600

// Single clean ramp, no partial-opacity "soft shadow" tier: the frame's own
// cast shadow fades all the way to transparent along with the backdrop.
const THRESH_LOW = 16
const THRESH_HIGH = 100

// Two things live in the bottom-right corner that the distance-based key
// alone doesn't fully clear: a small two-diamond "sparkle" watermark baked
// into every frame (~x:[1130,1220] y:[565,650]), and a patch where the
// harmonic-inpainted plate is slightly less accurate at the frame's extreme
// corner (extrapolation is weakest furthest from the sampled border),
// leaving a faint residual instead of full transparency. Rather than chase
// the plate's precision further, this whole region is forced toward the
// plate color and toward zero alpha directly. y0 is held at >=560
// specifically because real geometry (the right exploded tower's bottom
// edge) reaches down to y≈555 in that x-range at the most exploded frames —
// verified by direct pixel sampling — everything below that line, across
// this width, was confirmed background/shadow at every sampled frame.
const WATERMARK_RECT = { x0: 850, y0: 560, x1: 1280, y1: 720 }
const WATERMARK_FEATHER = 40

function watermarkSuppression(x, y) {
  const { x0, y0, x1, y1 } = WATERMARK_RECT
  const dx = x < x0 ? x0 - x : x > x1 ? x - x1 : 0
  const dy = y < y0 ? y0 - y : y > y1 ? y - y1 : 0
  const d = Math.sqrt(dx * dx + dy * dy)
  if (d >= WATERMARK_FEATHER) return 1
  return d / WATERMARK_FEATHER
}

async function readRawEnhanced(file) {
  // Sharpen + a small contrast lift before matting, so edge-distance
  // measurements are taken on the same crisp image that ends up on screen.
  const { data, info } = await sharp(file)
    .sharpen({ sigma: 1.0, m1: 1.0, m2: 0.6 })
    .linear(1.04, -6)
    .raw()
    .toBuffer({ resolveWithObject: true })
  return { data, info }
}

async function readRaw(file) {
  const { data, info } = await sharp(file).raw().toBuffer({ resolveWithObject: true })
  return { data, info }
}

/** Harmonic-inpaint a single channel at grid resolution: border cells are
 * fixed to the downsampled frame1 values, interior cells relax to the
 * average of their 4 neighbors (Gauss-Seidel), which converges to the
 * smooth, boundary-matching solution of Laplace's equation. */
function inpaintChannel(border, gw, gh, marginCellsLeft, marginCellsRight, marginCellsTop, marginCellsBottom) {
  const known = new Uint8Array(gw * gh)
  const values = new Float64Array(gw * gh)
  for (let y = 0; y < gh; y++) {
    for (let x = 0; x < gw; x++) {
      const isKnown = x < marginCellsLeft || x >= gw - marginCellsRight || y < marginCellsTop || y >= gh - marginCellsBottom
      const i = y * gw + x
      known[i] = isKnown ? 1 : 0
      values[i] = isKnown ? border[i] : 200 // neutral seed for unknowns
    }
  }
  for (let iter = 0; iter < INPAINT_ITERATIONS; iter++) {
    for (let y = 0; y < gh; y++) {
      for (let x = 0; x < gw; x++) {
        const i = y * gw + x
        if (known[i]) continue
        const xm = x > 0 ? values[i - 1] : values[i]
        const xp = x < gw - 1 ? values[i + 1] : values[i]
        const ym = y > 0 ? values[i - gw] : values[i]
        const yp = y < gh - 1 ? values[i + gw] : values[i]
        values[i] = (xm + xp + ym + yp) / 4
      }
    }
  }
  return values
}

async function buildBackgroundPlate() {
  // The plate is built from the same enhanced (sharpened/contrast-lifted)
  // frame 1 that every other frame will be compared against.
  const { data, info } = await readRawEnhanced(path.join(SRC_DIR, 'ezgif-frame-001.jpg'))
  const channels = [new Float64Array(GRID_W * GRID_H), new Float64Array(GRID_W * GRID_H), new Float64Array(GRID_W * GRID_H)]
  const counts = new Float64Array(GRID_W * GRID_H)
  for (let y = 0; y < H; y++) {
    const gy = Math.min(GRID_H - 1, Math.floor((y / H) * GRID_H))
    for (let x = 0; x < W; x++) {
      const gx = Math.min(GRID_W - 1, Math.floor((x / W) * GRID_W))
      const gi = gy * GRID_W + gx
      const si = (y * info.width + x) * info.channels
      channels[0][gi] += data[si]
      channels[1][gi] += data[si + 1]
      channels[2][gi] += data[si + 2]
      counts[gi]++
    }
  }
  for (let i = 0; i < GRID_W * GRID_H; i++) {
    channels[0][i] /= counts[i]
    channels[1][i] /= counts[i]
    channels[2][i] /= counts[i]
  }

  const mLeft = Math.round(GRID_W * (MARGIN_LEFT / W))
  const mRight = Math.round(GRID_W * (MARGIN_RIGHT / W))
  const mTop = Math.round(GRID_H * (MARGIN_TOP / H))
  const mBottom = Math.round(GRID_H * (MARGIN_BOTTOM / H))
  const inpainted = channels.map((ch) => inpaintChannel(ch, GRID_W, GRID_H, mLeft, mRight, mTop, mBottom))

  const plate = new Uint8Array(W * H * 3)
  const rgbaGrid = Buffer.alloc(GRID_W * GRID_H * 3)
  for (let i = 0; i < GRID_W * GRID_H; i++) {
    rgbaGrid[i * 3] = Math.round(inpainted[0][i])
    rgbaGrid[i * 3 + 1] = Math.round(inpainted[1][i])
    rgbaGrid[i * 3 + 2] = Math.round(inpainted[2][i])
  }
  const upsampled = await sharp(rgbaGrid, { raw: { width: GRID_W, height: GRID_H, channels: 3 } })
    .resize(W, H, { kernel: 'cubic' })
    .raw()
    .toBuffer()
  upsampled.copy(plate)
  return plate
}

function matteFrame(data, info, plate) {
  const out = Buffer.alloc(W * H * 4)
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const si = (y * info.width + x) * info.channels
      const pi = (y * W + x) * 3
      const r = data[si], g = data[si + 1], b = data[si + 2]
      const br = plate[pi], bg = plate[pi + 1], bb = plate[pi + 2]
      const dist = Math.sqrt((r - br) ** 2 + (g - bg) ** 2 + (b - bb) ** 2)

      let alpha
      if (dist <= THRESH_LOW) alpha = 0
      else if (dist >= THRESH_HIGH) alpha = 255
      else alpha = Math.round(((dist - THRESH_LOW) / (THRESH_HIGH - THRESH_LOW)) * 255)

      // Inside the watermark mask, blend color toward the plate too, not
      // just alpha — fading alpha alone leaves the glyph's own bright pixel
      // values in the output at partial opacity, which composites as a
      // faint smear rather than disappearing cleanly.
      const supp = watermarkSuppression(x, y)
      let outR = r, outG = g, outB = b
      if (supp < 1) {
        outR = Math.round(r * supp + br * (1 - supp))
        outG = Math.round(g * supp + bg * (1 - supp))
        outB = Math.round(b * supp + bb * (1 - supp))
      }
      alpha = Math.round(alpha * supp)

      const di = (y * W + x) * 4
      out[di] = outR
      out[di + 1] = outG
      out[di + 2] = outB
      out[di + 3] = alpha
    }
  }
  return out
}

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true })
  console.log('Reconstructing background plate via harmonic inpainting...')
  const plate = await buildBackgroundPlate()

  if (process.argv[3] === '--preview-plate') {
    await sharp(plate, { raw: { width: W, height: H, channels: 3 } }).jpeg({ quality: 90 }).toFile(path.join(__dirname, 'plate-preview.jpg'))
    console.log('Wrote plate preview to scripts/plate-preview.jpg')
  }

  const only = process.argv[2] ? [parseInt(process.argv[2], 10)] : Array.from({ length: FRAME_COUNT }, (_, i) => i + 1)

  for (const n of only) {
    const name = `ezgif-frame-${String(n).padStart(3, '0')}`
    const { data, info } = await readRawEnhanced(path.join(SRC_DIR, name + '.jpg'))
    const rgba = matteFrame(data, info, plate)
    await sharp(rgba, { raw: { width: W, height: H, channels: 4 } })
      .webp({ quality: 92, alphaQuality: 95, effort: 5 })
      .toFile(path.join(OUT_DIR, name + '.webp'))
    if (n % 25 === 0 || only.length < 5) console.log('done', name)
  }
  console.log('Wrote', only.length, 'frames to', OUT_DIR)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
