'use client'

import { motion } from 'framer-motion'
import { DESKTOP_APPS } from './DesktopOS'
import type { WindowState } from '@/types/desktop'
import { cn } from '@/lib/utils'

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
        transition={{ delay: 1, type: 'spring', bounce: 0.3 }}
        className="flex items-center gap-1 px-3 py-2 rounded-2xl"
        style={{
          background: 'rgba(12, 12, 22, 0.85)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.1)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
        }}
      >
        {apps.map((app) => {
          const win = windows.find((w) => w.id === app.id)
          const isOpen = windows.some((w) => w.id === app.id && !w.minimised)
          const isActive = activeWindowId === app.id
          
          return (
            <motion.button
              key={app.id}
              onClick={() => (isOpen ? onFocus(app.id) : onOpen(app.id))}
              whileHover={{ scale: 1.15, y: -4 }}
              whileTap={{ scale: 0.95 }}
              className={`relative w-12 h-12 flex items-center justify-center rounded-full transition-all duration-300 group ${isOpen ? 'bg-white/20 shadow-inner' : 'hover:bg-white/10'}`}
              style={{
                boxShadow: isActive ? `0 0 20px ${app.color}40, inset 0 0 10px ${app.color}20` : 'none',
              }}
            >
              <span className="text-2xl drop-shadow-md z-10 group-hover:scale-110 transition-transform">{app.icon}</span>
              
              {/* App indicator dot */}
              {isOpen && (
                <motion.div 
                  layoutId={`indicator-${app.id}`}
                  className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: app.color, boxShadow: `0 0 8px ${app.color}` }}
                />
              )}

              {/* Tooltip */}
              <div className="absolute -top-10 px-2.5 py-1 bg-black/60 backdrop-blur-md rounded border border-white/10 text-white text-[10px] font-medium opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                {app.label.replace(/[/.]\w*$/, '')}
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-black/60 border-b border-r border-white/10 transform rotate-45" />
              </div>
            </motion.button>
          )
        })}
      </motion.div>
    </div>
  )
}
