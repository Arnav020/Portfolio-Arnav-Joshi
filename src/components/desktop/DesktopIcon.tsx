'use client'

import { memo, useState } from 'react'
import { motion } from 'framer-motion'
import { CircleUser, Cpu, FolderOpen, Briefcase, Trophy, Mail, FileText } from 'lucide-react'

const ICON_MAP: Record<string, any> = {
  CircleUser,
  Cpu,
  FolderOpen,
  Briefcase,
  Trophy,
  Mail,
  FileText,
}

interface DesktopIconProps {
  app: { id: string; label: string; icon: string; color: string }
  isOpen: boolean
  onOpen: () => void
  index: number
}

export const DesktopIcon = memo(function DesktopIcon({ app, isOpen, onOpen, index }: DesktopIconProps) {
  const [clicks, setClicks] = useState(0)
  const [clickTimer, setClickTimer] = useState<ReturnType<typeof setTimeout> | null>(null)

  const IconComponent = ICON_MAP[app.icon] || CircleUser

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
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 + 0.3, type: 'spring', stiffness: 100, damping: 15 }}
      onClick={handleClick}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.95 }}
      className="flex flex-col items-center gap-2 group w-[90px] p-1.5 transform-gpu"
    >
      <div className="relative w-14 h-14 flex items-center justify-center">
        {/* Premium Glass Squircle Base with Depth Gradient */}
        <div className="absolute inset-0 bg-white/[0.04] backdrop-blur-2xl rounded-[15px] border border-white/[0.08] shadow-[0_10px_30px_-5px_rgba(0,0,0,0.6)] transition-all duration-300 group-hover:bg-white/[0.08]" />
        
        {/* Surface Shine Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.08] to-transparent rounded-[15px] pointer-events-none" />

        {/* Subtle Inner Highlight Border */}
        <div className="absolute inset-[1px] rounded-[14px] border-t border-white/[0.05] pointer-events-none" />

        {/* Icon with Ambient Glow */}
        <div 
          className="z-10 transition-all duration-300 group-hover:scale-110 drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]"
          style={{ 
            color: 'rgba(255,255,255,0.9)',
            filter: `drop-shadow(0 0 12px ${app.color}20)` 
          }}
        >
          <IconComponent size={26} strokeWidth={1.5} />
        </div>
        
        {/* Open Indicator (Floating Glass Dot) */}
        {isOpen && (
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_12px_rgba(255,255,255,0.9)] z-20" />
        )}
      </div>

      <span className="text-white/60 font-medium text-[10px] tracking-tight px-2 py-0.5 rounded-full transition-all group-hover:bg-white/5 group-hover:text-white group-hover:backdrop-blur-sm truncate max-w-full">
        {app.label}
      </span>
    </motion.button>
  )
})
