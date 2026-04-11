'use client'

import { useRef, Suspense } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { PerspectiveCamera, Environment, OrbitControls, Text3D, Html, Center, Float, useFont } from '@react-three/drei'
import * as THREE from 'three'

// ─── MATERIALS ────────────────────────────────────────────
const DESK_COLOR     = '#111115'
const DESK_TOP_COLOR = '#18181b'
const MONITOR_COLOR  = '#0f0f12'
const BEZEL_COLOR    = '#09090b'
const WALL_COLOR     = '#09090c'
const FLOOR_COLOR    = '#050505'
const SHELF_COLOR    = '#121215'
const PLANT_GREEN    = '#1f8b4c'
const MUG_COLOR      = '#8b5cf6'
const BOOK_COLORS    = ['#6366f1','#8b5cf6','#06b6d4','#10b981','#3b82f6','#4f46e5']

const FONT_URL = 'https://cdn.jsdelivr.net/npm/three@0.160.0/examples/fonts/helvetiker_bold.typeface.json'

// Preload the font to prevent flickering and improve load times
useFont.preload(FONT_URL)

function Floor() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.5, 0]} receiveShadow>
      <planeGeometry args={[20, 20]} />
      <meshStandardMaterial color={FLOOR_COLOR} roughness={0.9} />
    </mesh>
  )
}

function BackWall() {
  return (
    <mesh position={[0, 3, -6]} receiveShadow>
      <planeGeometry args={[20, 10]} />
      <meshStandardMaterial color={WALL_COLOR} roughness={1} />
    </mesh>
  )
}

function LeftWall() {
  return (
    <mesh position={[-8, 3, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
      <planeGeometry args={[12, 10]} />
      <meshStandardMaterial color={WALL_COLOR} roughness={1} />
    </mesh>
  )
}

function Desk() {
  return (
    <group position={[0, -0.5, 0]}>
      {/* Desk top surface */}
      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[5, 0.1, 2.2]} />
        <meshStandardMaterial color={DESK_TOP_COLOR} roughness={0.6} />
      </mesh>
      {/* Left front leg */}
      <mesh position={[-2.3, -0.75, 0.9]} castShadow>
        <boxGeometry args={[0.1, 1.5, 0.1]} />
        <meshStandardMaterial color={DESK_COLOR} roughness={0.8} />
      </mesh>
      {/* Right front leg */}
      <mesh position={[2.3, -0.75, 0.9]} castShadow>
        <boxGeometry args={[0.1, 1.5, 0.1]} />
        <meshStandardMaterial color={DESK_COLOR} roughness={0.8} />
      </mesh>
      {/* Left back leg */}
      <mesh position={[-2.3, -0.75, -0.9]} castShadow>
        <boxGeometry args={[0.1, 1.5, 0.1]} />
        <meshStandardMaterial color={DESK_COLOR} roughness={0.8} />
      </mesh>
      {/* Right back leg */}
      <mesh position={[2.3, -0.75, -0.9]} castShadow>
        <boxGeometry args={[0.1, 1.5, 0.1]} />
        <meshStandardMaterial color={DESK_COLOR} roughness={0.8} />
      </mesh>
    </group>
  )
}

function DesktopScreenMaterial({ isZoomedIn }: { isZoomedIn: boolean }) {
  const texture = useRef<THREE.CanvasTexture | null>(null)
  
  if (!texture.current && typeof window !== 'undefined') {
    const canvas = document.createElement('canvas')
    canvas.width = 1600
    canvas.height = 960
    const ctx = canvas.getContext('2d')
    if (ctx) {
      // Base Blue-Onyx Atmosphere
      ctx.fillStyle = '#02040a'
      ctx.fillRect(0, 0, 1600, 960)

      // Sapphire Radial Highlight
      const rad = ctx.createRadialGradient(240, 150, 0, 240, 150, 800)
      rad.addColorStop(0, 'hsla(230, 60%, 15%, 1)')
      rad.addColorStop(1, 'transparent')
      ctx.fillStyle = rad
      ctx.fillRect(0, 0, 1600, 960)

      // Mock Code-Rain Substratum (Top-Weighted)
      ctx.font = '14px monospace'
      ctx.fillStyle = 'rgba(59, 130, 246, 0.15)'
      for (let i = 0; i < 15; i++) {
        const y = 80 + i * 25
        const opacity = 1 - (i / 15)
        ctx.globalAlpha = opacity * 0.4
        ctx.fillText('class Trainer: def __init__(self, model): model.fit(x, y)', 80, y)
        ctx.fillText('func main() { router := gin.Default(); router.Run() }', 600, y)
        ctx.fillText('export function App() { return <main className="p-4">', 1100, y)
      }
      ctx.globalAlpha = 1.0

      // Top Menu Bar
      ctx.fillStyle = 'rgba(255,255,255,0.03)'
      ctx.fillRect(0, 0, 1600, 50)
      ctx.strokeStyle = 'rgba(255,255,255,0.05)'
      ctx.beginPath(); ctx.moveTo(0, 50); ctx.lineTo(1600, 50); ctx.stroke()

      // Right-side Widgets (Sapphire-Onyx theme)
      // Clock Widget
      ctx.fillStyle = '#0a0f24'
      ctx.strokeStyle = 'rgba(59, 130, 246, 0.2)'
      ctx.lineWidth = 2
      ctx.beginPath(); ctx.roundRect(1600 - 450, 100, 380, 210, 40); ctx.fill(); ctx.stroke()
      
      const dotGrad = ctx.createRadialGradient(1600 - 120, 140, 0, 1600 - 120, 140, 10)
      dotGrad.addColorStop(0, '#60a5fa'); dotGrad.addColorStop(1, 'transparent')
      ctx.fillStyle = dotGrad
      ctx.beginPath(); ctx.arc(1600 - 120, 140, 6, 0, Math.PI * 2); ctx.fill()
      
      ctx.fillStyle = 'rgba(255,255,255,0.9)'
      ctx.font = 'light 90px sans-serif'
      ctx.fillText('18:38', 1600 - 400, 220)

      // Music Widget
      ctx.fillStyle = '#0a0f24'
      ctx.beginPath(); ctx.roundRect(1600 - 450, 340, 380, 210, 40); ctx.fill(); ctx.stroke()
      
      // Album Art
      const artGrad = ctx.createLinearGradient(1600 - 410, 380, 1600 - 320, 470)
      artGrad.addColorStop(0, '#3b82f6'); artGrad.addColorStop(1, '#4f46e5')
      ctx.fillStyle = artGrad
      ctx.beginPath(); ctx.roundRect(1600 - 410, 380, 90, 90, 20); ctx.fill()
      
      // Icons and Taskbar Mock
      ctx.fillStyle = 'rgba(255,255,255,0.05)'
      ctx.beginPath(); ctx.roundRect(500, 960 - 120, 600, 80, 30); ctx.fill()
    }
    texture.current = new THREE.CanvasTexture(canvas)
    texture.current.colorSpace = THREE.SRGBColorSpace
  }

  // Turn monitor screen black when OS covers it (isZoomedIn)
  return <meshBasicMaterial map={isZoomedIn ? undefined : texture.current} color={isZoomedIn ? "#000" : "#fff"} />
}

function Monitor({ isZoomedIn }: { isZoomedIn: boolean }) {
  return (
    <group position={[0, 0.6, -0.3]}>
      {/* Screen bezel */}
      <mesh castShadow>
        <boxGeometry args={[3.2, 2.0, 0.08]} />
        <meshStandardMaterial color={BEZEL_COLOR} roughness={0.4} metalness={0.6} />
      </mesh>
      {/* Screen face — rendering a Baked Texture */}
      <mesh position={[0, 0, 0.041]}>
        <planeGeometry args={[2.94, 1.74]} />
        {/* Draw a real WebGL CanvasTexture mirroring the UI layout completely avoiding buggy HTML layers */}
        <DesktopScreenMaterial isZoomedIn={isZoomedIn} />
      </mesh>
      {/* Monitor stand neck */}
      <mesh position={[0, -1.1, 0.1]} castShadow>
        <boxGeometry args={[0.15, 0.3, 0.15]} />
        <meshStandardMaterial color={BEZEL_COLOR} roughness={0.4} metalness={0.6} />
      </mesh>
      {/* Monitor stand base */}
      <mesh position={[0, -1.28, 0.2]} castShadow>
        <boxGeometry args={[0.8, 0.06, 0.5]} />
        <meshStandardMaterial color={BEZEL_COLOR} roughness={0.4} metalness={0.6} />
      </mesh>
    </group>
  )
}

function Keyboard() {
  return (
    <group position={[0, -0.43, 0.6]}>
      <mesh castShadow>
        <boxGeometry args={[1.8, 0.05, 0.6]} />
        <meshStandardMaterial color="#1a1a2e" roughness={0.7} />
      </mesh>
    </group>
  )
}

function Mouse() {
  return (
    <group position={[1.1, -0.44, 0.6]}>
      <mesh castShadow>
        <boxGeometry args={[0.2, 0.04, 0.3]} />
        <meshStandardMaterial color="#1a1a2e" roughness={0.5} metalness={0.3} />
      </mesh>
    </group>
  )
}

function CoffeeMug() {
  const mugRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (mugRef.current) {
      // Custom subtle float without invoking deprecated THREE.Clock via Drei's Float
      const t = state.clock.elapsedTime
      mugRef.current.position.y = -0.3 + Math.sin(t * 1) * 0.01
      mugRef.current.rotation.x = Math.sin(t * 0.5) * 0.02
      mugRef.current.rotation.y = Math.sin(t * 0.4) * 0.02
    }
  })

  return (
    <group ref={mugRef} position={[2.1, -0.3, 0.2]}>
      {/* Mug body */}
      <mesh castShadow>
        <cylinderGeometry args={[0.12, 0.1, 0.28, 16]} />
        <meshStandardMaterial color={MUG_COLOR} roughness={0.6} />
      </mesh>
      {/* Handle — approximate with a torus segment */}
      <mesh position={[0.14, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <torusGeometry args={[0.07, 0.018, 8, 12, Math.PI]} />
        <meshStandardMaterial color={MUG_COLOR} roughness={0.6} />
      </mesh>
    </group>
  )
}

function Plant() {
  return (
    <group position={[-2.1, -0.28, 0.1]}>
      {/* Pot */}
      <mesh castShadow>
        <cylinderGeometry args={[0.14, 0.1, 0.22, 12]} />
        <meshStandardMaterial color="#5c3d2e" roughness={0.8} />
      </mesh>
      {/* Soil */}
      <mesh position={[0, 0.12, 0]}>
        <cylinderGeometry args={[0.13, 0.13, 0.03, 12]} />
        <meshStandardMaterial color="#2d1a0e" roughness={1} />
      </mesh>
      {/* Stems + leaves — three billboard quads */}
      {[
        { pos: [0, 0.38, 0] as [number,number,number],   rot: [0, 0, 0.3] as [number,number,number] },
        { pos: [0.1, 0.42, 0] as [number,number,number], rot: [0, 0.5, -0.3] as [number,number,number] },
        { pos: [-0.1, 0.35, 0] as [number,number,number],rot: [0, -0.4, 0.4] as [number,number,number] },
      ].map((leaf, i) => (
        <mesh key={i} position={leaf.pos} rotation={leaf.rot} castShadow>
          <boxGeometry args={[0.22, 0.3, 0.015]} />
          <meshStandardMaterial
            color={PLANT_GREEN}
            roughness={0.8}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </group>
  )
}

function Bookshelf() {
  return (
    <group position={[-5.5, 0.5, -3]}>
      {/* Shelf back */}
      <mesh position={[0, 0, -0.25]}>
        <boxGeometry args={[2.5, 3, 0.05]} />
        <meshStandardMaterial color={SHELF_COLOR} roughness={0.9} />
      </mesh>
      {/* Shelf boards */}
      {[-1.0, 0, 1.0].map((y, i) => (
        <mesh key={i} position={[0, y, 0]}>
          <boxGeometry args={[2.5, 0.06, 0.5]} />
          <meshStandardMaterial color={SHELF_COLOR} roughness={0.8} />
        </mesh>
      ))}
      {/* Books on shelves */}
      {[
        { shelf: -1.0, books: 6 },
        { shelf:  0.0, books: 5 },
        { shelf:  1.0, books: 7 },
      ].map(({ shelf, books }) =>
        Array.from({ length: books }).map((_, bi) => (
          <mesh
            key={`${shelf}-${bi}`}
            position={[
              -1.0 + bi * (2.0 / books),
              shelf + 0.2,
              0,
            ]}
            castShadow
          >
            <boxGeometry args={[
              0.12 + Math.random() * 0.06,
              0.3 + Math.random() * 0.1,
              0.38,
            ]} />
            <meshStandardMaterial
              color={BOOK_COLORS[bi % BOOK_COLORS.length]}
              roughness={0.9}
            />
          </mesh>
        ))
      )}
    </group>
  )
}

function WallSign() {
  return (
    <group position={[0, 2.3, -5.95]}>
      <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.2}>
        <Center top position={[0, 0.4, 0]}>
          <Text3D
            font={FONT_URL}
            size={0.42}
            height={0.12}
            curveSegments={12}
            bevelEnabled
            bevelThickness={0.02}
            bevelSize={0.02}
            bevelOffset={0}
            bevelSegments={5}
          >
            ARNAV JOSHI
            <meshStandardMaterial 
              color="#6366f1" 
              emissive="#6366f1" 
              emissiveIntensity={8} 
              toneMapped={false} 
            />
          </Text3D>
        </Center>

        <Center top position={[0, -0.2, 0]}>
          <Text3D
            font={FONT_URL}
            size={0.14}
            height={0.05}
            curveSegments={12}
            bevelEnabled
            bevelThickness={0.01}
            bevelSize={0.01}
            bevelOffset={0}
            bevelSegments={3}
          >
            AI/ML  •  FULL STACK  •  MLOPS
            <meshStandardMaterial 
              color="#8b5cf6" 
              emissive="#8b5cf6" 
              emissiveIntensity={4} 
              toneMapped={false} 
            />
          </Text3D>
        </Center>
      </Float>

      {/* Ambient glow around the sign */}
      <pointLight color="#8b5cf6" intensity={35} distance={12} position={[0, 0, 0.5]} />
    </group>
  )
}

function Lighting() {
  return (
    <>
      <ambientLight intensity={0.6} color="#4F4F6F" />
      {/* Main desk lamp light — cool crisp white */}
      <pointLight
        position={[0, 3, 1]}
        intensity={180}
        color="#e0e7ff"
        castShadow
        shadow-bias={-0.001}
        shadow-mapSize={[2048, 2048]}
      />
      {/* Monitor screen glow */}
      <rectAreaLight
        width={3}
        height={2}
        color="#6366f1"
        intensity={6}
        position={[0, 1.5, 0.5]}
        lookAt={[0, 1.5, 2]}
      />
      {/* Purple rim light from the side */}
      <pointLight position={[-4, 4, -3]} intensity={110} color="#a855f7" />
      {/* Deep blue fill light */}
      <pointLight position={[5, 3, 2]} intensity={90} color="#3b82f6" />
    </>
  )
}

function CameraRig({ isZoomedIn }: { isZoomedIn: boolean }) {
  useFrame((state) => {
    // When zoomed out: standard room view
    // When zoomed in: perfectly framed on the monitor screen (Z=0.9)
    const targetZ = isZoomedIn ? 1.05 : 5.5
    const targetY = isZoomedIn ? 0.6 : 1.8
    const fov = isZoomedIn ? 45 : 52

    state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, targetZ, 0.06)
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, targetY, 0.06)
    state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, 0, 0.06)
    
    if (state.camera instanceof THREE.PerspectiveCamera) {
      state.camera.fov = THREE.MathUtils.lerp(state.camera.fov, fov, 0.06)
      state.camera.updateProjectionMatrix()
    }
  })
  return null
}

export function RoomScene({ isZoomedIn = false }: { isZoomedIn?: boolean }) {
  return (
    <div className="absolute inset-0 w-full h-full">
      <Canvas
        shadows={{ type: THREE.PCFShadowMap }}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: 'high-performance',
        }}
        dpr={[1, 1.5]}
      >
        <PerspectiveCamera
          makeDefault
          position={[0, 1.8, 5.5]}
          fov={52}
          near={0.1}
          far={50}
        />
        
        {/* Enable free-orbit interaction only when zoomed out */}
        <OrbitControls 
          enabled={!isZoomedIn} 
          enablePan={false} 
          minAzimuthAngle={-Math.PI / 4} 
          maxAzimuthAngle={Math.PI / 4} 
          minPolarAngle={Math.PI / 4} 
          maxPolarAngle={Math.PI / 2} 
          enableZoom={false}
          makeDefault
        />

        <CameraRig isZoomedIn={isZoomedIn} />
        
        <Suspense fallback={null}>
          <Lighting />
          <WallSign />
          <Floor />
          <BackWall />
          <LeftWall />
          <Desk />
          <Monitor isZoomedIn={isZoomedIn} />
          <Keyboard />
          <Mouse />
          <CoffeeMug />
          <Plant />
          <Bookshelf />
        </Suspense>
      </Canvas>
    </div>
  )
}
