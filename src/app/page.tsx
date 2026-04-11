'use client'

import dynamic from 'next/dynamic'
import { useState, useEffect, useRef } from 'react'
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

  const scrollAccumulator = useRef(0)
  const scrollTimeout = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      // Reset accumulation if scrolling stops for 200ms
      if (scrollTimeout.current) clearTimeout(scrollTimeout.current)
      scrollTimeout.current = setTimeout(() => {
        scrollAccumulator.current = 0
      }, 200)

      scrollAccumulator.current += e.deltaY
      const threshold = 120

      // User preference: Scroll DOWN to enter (positive deltaY)
      if (scrollAccumulator.current > threshold) {
        setIsZoomedIn(true)
        scrollAccumulator.current = 0
      } 
      // Scroll UP to exit (negative deltaY)
      else if (scrollAccumulator.current < -threshold) {
        if (!document.querySelector('[data-windows-open="true"]')) {
          setIsZoomedIn(false)
          scrollAccumulator.current = 0
        }
      }
    }
    // Bind in capture phase so OrbitControls doesn't eat the event
    window.addEventListener('wheel', handleWheel, { capture: true })
    return () => {
      if (scrollTimeout.current) clearTimeout(scrollTimeout.current)
      window.removeEventListener('wheel', handleWheel, { capture: true })
    }
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

      {/* Top-right Interaction Header — Premium "3D" indicator */}
      <motion.div 
        className="absolute top-8 right-8 flex flex-col items-end gap-2 z-30 pointer-events-none"
        animate={{ opacity: isZoomedIn ? 0 : 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="px-5 py-2 rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] shadow-[0_10px_30px_rgba(0,0,0,0.5)] flex items-center justify-center group">
          <span className="text-xl font-black tracking-tighter text-white/90 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)] select-none">3D</span>
          <div className="ml-2 w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.8)]" />
        </div>
        <span className="text-white/20 text-[10px] tracking-[0.4em] uppercase font-mono mr-1">
          Click & Drag to explore
        </span>
      </motion.div>

      {/* Top-left name badge — Ambient UI */}
      <motion.div 
        className="absolute top-8 left-8 pointer-events-none z-30"
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
        className="absolute top-8 left-8 z-[100] px-5 py-2.5 rounded-full bg-black/20 hover:bg-black/40 backdrop-blur-md border border-white/10 text-white/90 shadow-2xl tracking-wide text-sm font-medium transition-all group flex items-center gap-2"
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
