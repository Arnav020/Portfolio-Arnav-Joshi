// Shared progress-band config for the deconstruction spine. Each chapter
// fades in over [inStart, inEnd] and (except the last) fades out over
// [outStart, outEnd] — all expressed as fractions of the spine's total
// scroll progress (0 → 1). Kept in one place so the canvas frame mapping,
// the chapter crossfade math, and the left-rail chapter index all agree on
// the same boundaries instead of drifting out of sync.
export const CHAPTER_BANDS = [
  { key: 'intro', inStart: 0, inEnd: 0, outStart: 0.15, outEnd: 0.185 },
  { key: 'education', inStart: 0.13, inEnd: 0.165, outStart: 0.35, outEnd: 0.385 },
  { key: 'experience', inStart: 0.335, inEnd: 0.37, outStart: 0.6, outEnd: 0.635 },
  { key: 'projects', inStart: 0.585, inEnd: 0.62, outStart: 1, outEnd: 1 },
] as const

export const CHAPTER_INDEX_BOUNDARIES = [0.15, 0.35, 0.6]

export function chapterIndexForProgress(progress: number) {
  if (progress < CHAPTER_INDEX_BOUNDARIES[0]) return 0
  if (progress < CHAPTER_INDEX_BOUNDARIES[1]) return 1
  if (progress < CHAPTER_INDEX_BOUNDARIES[2]) return 2
  return 3
}

/** A piecewise-linear "trapezoid": 0 → 1 over the in-band, holds at 1, then
 * 1 → 0 over the out-band. An in-band or out-band of zero width is treated
 * as instant (no ramp) rather than divide-by-zero. */
export function trapezoidOpacity(
  progress: number,
  band: { inStart: number; inEnd: number; outStart: number; outEnd: number }
) {
  const { inStart, inEnd, outStart, outEnd } = band
  let o: number
  if (inEnd <= inStart) {
    o = progress < inStart ? 0 : 1
  } else if (progress <= inStart) {
    o = 0
  } else if (progress < inEnd) {
    o = (progress - inStart) / (inEnd - inStart)
  } else {
    o = 1
  }

  if (outEnd > outStart) {
    if (progress > outEnd) o = 0
    else if (progress > outStart) o = Math.min(o, 1 - (progress - outStart) / (outEnd - outStart))
  }

  return Math.max(0, Math.min(1, o))
}

export const FRAME_COUNT = 150
// Background-removed (real alpha), sharpened, and contrast-lifted — see
// scripts/matte-frames.js. The studio backdrop and the machine's own cast
// shadow are both fully transparent; grounding is handled separately by a
// constant CSS shadow (PinnedCanvasSpine's stage), which by construction
// can never vary with frame content the way a shadow baked into the alpha
// channel did in an earlier version of this pipeline.
export const FRAME_PATH = (n: number) => `/frames-matted/ezgif-frame-${String(n).padStart(3, '0')}.webp`

// The source sequence isn't evenly "exploded" across its 150 frames — frames
// ~1-25 are visually almost identical (assembled), and most of the real
// separation only shows up from ~90 onward. Mapping progress → frame index
// linearly means the Education/Experience chapters (which only span
// progress .15-.6) land on the least dramatic part of the sequence. Warping
// frame selection by progress^FRAME_WARP_EXPONENT (<1, so it front-loads
// the curve) instead means low-to-mid progress reaches deeper into the
// frame range, giving every chapter — not just the last one — a visibly
// exploding machine, while chapter *timing* (crossfades, the index rail)
// stays on the unwarped, linear progress value.
const FRAME_WARP_EXPONENT = 0.6

/** Continuous (unrounded) frame position — lets the canvas cross-fade
 * between the two nearest frames instead of hard-cutting at whichever one
 * Math.round happens to land on, which is what actually reads as a
 * "slideshow" with only 150 source frames to work with. */
export function frameFloatForProgress(progress: number) {
  const clamped = Math.max(0, Math.min(1, progress))
  const warped = Math.pow(clamped, FRAME_WARP_EXPONENT)
  return warped * (FRAME_COUNT - 1)
}

export function frameIndexForProgress(progress: number) {
  return Math.round(frameFloatForProgress(progress))
}

// Independent of CHAPTER_BANDS on purpose: the crossfade timing between
// chapters and the machine's scale boost don't need to move in lockstep,
// and tuning one shouldn't risk nudging the other. Boosted from the very
// start (Intro gets the same presence as a "first impression"), holds
// across Education and most of Experience, and is fully back to baseline
// before Projects starts fading in — so the "significantly exploded"
// Build-section machine (sized by the stage grid track, not this) is never
// touched by it.
const MACHINE_SCALE_BAND = { inStart: 0, inEnd: 0, outStart: 0.55, outEnd: 0.6 }
const MACHINE_SCALE_BOOST = 0.13

export function machineScaleForProgress(progress: number) {
  return 1 + trapezoidOpacity(progress, MACHINE_SCALE_BAND) * MACHINE_SCALE_BOOST
}

export const CHAPTER_LABELS = ['Intro', 'Education', 'Experience', 'Projects', 'Skills', 'Achievements', 'Contact']

export const CHAPTER_SECTION_IDS = ['spine-intro', 'spine-education', 'spine-experience', 'spine-projects']

/** One progress value per spine chapter, chosen inside that chapter's fully
 * "settled" plateau (well past its fade-in, well before its fade-out) —
 * where the header's nav should land the user when they click a spine
 * chapter link, regardless of which renderer (pinned canvas vs stacked
 * fallback) is currently mounted. */
export const CHAPTER_TARGET_PROGRESS = [0.06, 0.26, 0.48, 0.8]

/** One representative frame per chapter for the static (mobile / reduced-motion)
 * fallback, which doesn't scrub — derived from the same warp + target
 * progress as the pinned renderer, so the fallback shows the same "how
 * exploded should this chapter look" as the scrubbed version. 1-indexed,
 * matches FRAME_PATH. */
export const MOBILE_CHAPTER_FRAMES = CHAPTER_TARGET_PROGRESS.map((p) => frameIndexForProgress(p) + 1)

/** Window-level event bus connecting the header nav to whichever spine
 * renderer is mounted, without either needing to import or prop-drill
 * through the other. PinnedCanvasSpine/StackedChapters dispatch CHAPTER on
 * every active-chapter change (consumed by Header + ScrollProgressRail) and
 * listen for GOTO (dispatched by Header on a nav click) to scroll there. */
export const SPINE_CHAPTER_EVENT = 'spine:chapter'
export const SPINE_GOTO_EVENT = 'spine:goto'

export interface SpineChapterDetail {
  chapter: number
}
