'use client'

import { motion } from 'framer-motion'
import { DESKTOP_APPS } from './DesktopOS'
import type { WindowState } from '@/types/desktop'
import { cn } from '@/lib/utils'
import { User, Cpu, FolderOpen, Briefcase, Trophy, Mail, CircleUser } from 'lucide-react'

const ICON_MAP: Record<string, any> = {
  CircleUser,
  Cpu,
  FolderOpen,
  Briefcase,
  Trophy,
  Mail,
}

interface TaskbarProps {
  apps: typeof DESKTOP_APPS
  windows: WindowState[]
  onOpen: (id: string) => void
  onFocus: (id: string) => void
  activeWindowId: string | null
}

export function Taskbar({
  apps, windows, onOpen, onFocus, activeWindowId,
}: TaskbarProps) {
  const handleClick = (id: string) => {
    const win = windows.find((w) => w.id === id)
    if (win) {
      onFocus(id)
    } else {
      onOpen(id)
    }
  }

  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[100]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, type: 'spring', bounce: 0.3 }}
        className="flex items-center gap-2 px-3 py-2.5 rounded-[24px]"
        style={{
          background: 'rgba(15, 15, 20, 0.35)',
          backdropFilter: 'blur(60px) saturate(180%)',
          border: '1px solid rgba(255,255,255,0.12)',
          boxShadow: '0 25px 60px -15px rgba(0,0,0,0.7)',
        }}
      >
        {apps.map((app) => {
          const isOpen = windows.some((w) => w.id === app.id)
          const isActive = activeWindowId === app.id
          const IconComponent = ICON_MAP[app.icon] || User
          
          return (
            <motion.button
              key={app.id}
              onClick={() => (isOpen ? onFocus(app.id) : onOpen(app.id))}
              whileHover={{ scale: 1.2, y: -6 }}
              whileTap={{ scale: 0.9 }}
              className={cn(
                "relative w-12 h-12 flex items-center justify-center rounded-[14px] transition-all duration-300 group",
                isActive ? "bg-white/10" : "hover:bg-white/5"
              )}
            >
              <div className="text-white/90 drop-shadow-lg z-10 transition-all duration-300 group-hover:scale-110 group-hover:text-white">
                <IconComponent size={22} strokeWidth={1.5} />
              </div>
              
              {/* Active Indicator Dot (Subtle white dot) */}
              {isOpen && (
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-white shadow-[0_0_8px_white]" />
              )}

              {/* Tooltip (Clean macOS style) */}
              <div className="absolute -top-12 px-3 py-1.5 bg-black/50 backdrop-blur-xl rounded-lg border border-white/10 text-white text-[10px] font-semibold opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap translate-y-2 group-hover:translate-y-0 shadow-2xl">
                {app.label.replace(/[/.]\w*$/, '')}
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-black/50 border-b border-r border-white/10 transform rotate-45" />
              </div>
            </motion.button>
          )
        })}
      </motion.div>
    </div>
  )
}
