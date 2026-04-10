'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'

interface DesktopIconProps {
  app: { id: string; label: string; icon: string; color: string }
  isOpen: boolean
  onOpen: () => void
  index: number
}

export function DesktopIcon({ app, isOpen, onOpen, index }: DesktopIconProps) {
  const [clicks, setClicks] = useState(0)
  const [clickTimer, setClickTimer] = useState<ReturnType<typeof setTimeout> | null>(null)

  // Double-click detection
  const handleClick = () => {
    setClicks((c) => c + 1)
    if (clicks === 0) {
      const t = setTimeout(() => setClicks(0), 400)
      setClickTimer(t)
    } else {
      if (clickTimer) clearTimeout(clickTimer)
      setClicks(0)
      onOpen()
    }
  }

  return (
    <motion.button
      initial={{ opacity: 0, x: -20, filter: 'blur(10px)' }}
      animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
      transition={{ delay: index * 0.1 + 0.3, type: 'spring', stiffness: 120, damping: 14 }}
      onClick={handleClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="flex flex-col items-center gap-3 p-3 rounded-2xl hover:bg-white/10 border border-transparent hover:border-white/20 hover:shadow-2xl hover:backdrop-blur-sm transition-all duration-300 w-[100px] group relative"
    >
      {/* High-End OS Folder Icon */}
      <div className="w-16 h-14 relative drop-shadow-[0_8px_16px_rgba(0,0,0,0.15)] group-hover:drop-shadow-[0_12px_24px_rgba(0,0,0,0.25)] transition-all">
        {/* Back flap */}
        <div className="absolute bottom-0 w-full h-[50px] bg-white rounded-lg shadow-sm overflow-hidden flex items-start justify-center pt-2">
          <span className="text-2xl drop-shadow-sm opacity-90">{app.icon}</span>
        </div>
        {/* Top Tab */}
        <div className="absolute top-0 left-1 w-1/3 h-3 bg-white/90 rounded-t-lg" />
        
        {/* Front flap (frosted acrylic glass) */}
        <div className="absolute bottom-0 w-full h-[40px] bg-gradient-to-tr from-white/[0.85] to-white/[0.95] backdrop-blur-md rounded-lg border border-white/50 shadow-[0_-2px_10px_rgba(0,0,0,0.05)] origin-bottom transform transition-transform duration-300 group-hover:rotate-x-12" />
        
        {/* Open Indicator Dot */}
        {isOpen && (
          <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,1)]" />
        )}
      </div>

      <span className="text-white font-medium text-xs tracking-wide drop-shadow-md px-2 py-0.5 rounded backdrop-blur-none group-hover:bg-black/20 transition-colors">
        {app.label}
      </span>
    </motion.button>
  )
}
