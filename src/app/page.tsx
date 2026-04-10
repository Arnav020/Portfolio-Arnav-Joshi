'use client'

import dynamic from 'next/dynamic'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

import { DesktopOS } from '@/components/desktop/DesktopOS'

const RoomScene = dynamic(
  () => import('@/components/three/RoomScene').then((m) => m.RoomScene),
  { ssr: false, loading: () => null }
)

export default function Home() {
  const [isZoomedIn, setIsZoomedIn] = useState(false)

  // Globally suppress the THREE.Clock deprecation warning caused by @react-three/fiber core
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const originalWarn = console.warn
      console.warn = (...args) => {
        if (typeof args[0] === 'string' && args[0].includes('THREE.Clock')) return
        if (typeof args[0] === 'string' && args[0].includes('PCFSoftShadowMap')) return
        originalWarn(...args)
      }
    }
  }, [])

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      // Scroll down transports you IN
      if (e.deltaY > 50) setIsZoomedIn(true)
      // Scroll up transports you OUT, ONLY if no windows are currently open.
      else if (e.deltaY < -50) {
        if (!document.querySelector('[data-windows-open="true"]')) {
          setIsZoomedIn(false)
        }
      }
    }
    // Bind in capture phase so OrbitControls doesn't eat the event
    window.addEventListener('wheel', handleWheel, { capture: true })
    return () => window.removeEventListener('wheel', handleWheel, { capture: true })
  }, [])

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-[#0a0a0f]">

      {/* Layer 1 — 3D room. Passes isZoomedIn to animate the camera */}
      <RoomScene isZoomedIn={isZoomedIn} />

      {/* Layer 2 — Desktop OS overlay with smooth fade-in */}
      {isZoomedIn && (
        <div className="absolute inset-0 z-[99] pointer-events-auto animate-fade-in duration-700 ease-out">
          <DesktopOS />
        </div>
      )}

      {/* Helper text overlay when NOT zoomed in */}
      <motion.div 
        className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 z-30 pointer-events-none"
        animate={{ opacity: isZoomedIn ? 0 : 1 }}
        transition={{ duration: 0.5 }}
      >
        <span className="text-white/40 text-xs tracking-[0.3em] uppercase font-mono">
          Scroll down to enter
        </span>
        <div className="w-5 h-8 border-[1.5px] border-white/20 rounded-full flex justify-center p-1">
          <motion.div 
            className="w-1 h-2 bg-white/50 rounded-full"
            animate={{ y: [0, 12, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
          />
        </div>
      </motion.div>

      {/* Top-left name badge — Ambient UI */}
      <motion.div 
        className="absolute top-5 left-5 pointer-events-none z-30"
        animate={{ opacity: isZoomedIn ? 0 : 1 }}
      >
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center">
            <span className="text-xs font-bold text-indigo-400">AJ</span>
          </div>
          <span className="text-xs text-white/30 font-mono">arnav@portfolio:~$</span>
        </div>
      </motion.div>

      {/* Back button when zoomed in */}
      <motion.button
        className="absolute top-6 left-6 z-[100] px-5 py-2.5 rounded-full bg-black/20 hover:bg-black/40 backdrop-blur-md border border-white/10 text-white/90 shadow-2xl tracking-wide text-sm font-medium transition-all group flex items-center gap-2"
        initial={{ opacity: 0, y: -20 }}
        animate={{ 
          opacity: isZoomedIn ? 1 : 0,
          y: isZoomedIn ? 0 : -20,
          pointerEvents: isZoomedIn ? 'auto' : 'none'
        }}
        onClick={() => setIsZoomedIn(false)}
      >
        <span className="group-hover:-translate-x-1 transition-transform">←</span> Exit OS
      </motion.button>

    </main>
  )
}
