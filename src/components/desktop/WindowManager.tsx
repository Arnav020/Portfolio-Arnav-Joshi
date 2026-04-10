'use client'

import { useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { WindowState } from '@/types/desktop'
import { WindowContent } from './WindowContent'

interface WindowManagerProps {
  windows: WindowState[]
  activeWindowId: string | null
  onClose: (id: string) => void
  onMinimise: (id: string) => void
  onFocus: (id: string) => void
  onUpdate: (id: string, updates: Partial<WindowState>) => void
}

export function WindowManager({
  windows,
  activeWindowId,
  onClose,
  onMinimise,
  onFocus,
  onUpdate,
}: WindowManagerProps) {
  return (
    <AnimatePresence>
      {windows
        .filter((w) => !w.minimised)
        .map((win) => (
          <DraggableWindow
            key={win.id}
            win={win}
            isActive={activeWindowId === win.id}
            onClose={() => onClose(win.id)}
            onMinimise={() => onMinimise(win.id)}
            onFocus={() => onFocus(win.id)}
            onUpdate={(updates) => onUpdate(win.id, updates)}
          />
        ))}
    </AnimatePresence>
  )
}

function DraggableWindow({
  win,
  isActive,
  onClose,
  onMinimise,
  onFocus,
  onUpdate,
}: {
  win: WindowState
  isActive: boolean
  onClose: () => void
  onMinimise: () => void
  onFocus: () => void
  onUpdate: (updates: Partial<WindowState>) => void
}) {
  const isDragging = useRef(false)
  const dragStart = useRef({ mouseX: 0, mouseY: 0, winX: 0, winY: 0 })

  const handleTitleBarMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if ((e.target as HTMLElement).closest('button')) return
      e.preventDefault()
      onFocus()
      isDragging.current = true
      dragStart.current = {
        mouseX: e.clientX,
        mouseY: e.clientY,
        winX: win.position.x,
        winY: win.position.y,
      }

      const handleMouseMove = (e: MouseEvent) => {
        if (!isDragging.current) return
        const dx = e.clientX - dragStart.current.mouseX
        const dy = e.clientY - dragStart.current.mouseY
        onUpdate({
          position: {
            x: Math.max(0, dragStart.current.winX + dx),
            y: Math.max(0, dragStart.current.winY + dy),
          },
        })
      }

      const handleMouseUp = () => {
        isDragging.current = false
        window.removeEventListener('mousemove', handleMouseMove)
        window.removeEventListener('mouseup', handleMouseUp)
      }

      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('mouseup', handleMouseUp)
    },
    [win.position, onFocus, onUpdate]
  )

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92, y: -10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.88, y: 10 }}
      transition={{ type: 'spring', damping: 28, stiffness: 320 }}
      style={{
        position: 'absolute',
        left: win.position.x,
        top: win.position.y,
        width: win.size.width,
        height: win.size.height,
        zIndex: win.zIndex,
        minWidth: 480,
        minHeight: 380,
      }}
      onMouseDown={onFocus}
    >
      <div
        className={`flex flex-col w-full h-full rounded-xl overflow-hidden transition-shadow duration-300 ${isActive ? 'shadow-[0_40px_80px_rgba(0,0,0,0.6)]' : 'shadow-[0_20px_40px_rgba(0,0,0,0.4)]'}`}
        style={{
          background: 'rgba(15, 15, 18, 0.85)',
          backdropFilter: 'blur(40px) saturate(150%)',
          border: isActive
            ? `1px solid rgba(255,255,255,0.15)`
            : '1px solid rgba(255,255,255,0.06)',
          boxShadow: isActive
            ? `0 0 0 1px rgba(255,255,255,0.05) inset, 0 0 0 2px ${win.color}40`
            : '0 0 0 1px rgba(255,255,255,0.02) inset',
        }}
      >
        {/* Title bar - Premium Obsidian Styling */}
        <div
          className="flex items-center gap-3 px-4 h-11 flex-shrink-0 cursor-move select-none"
          style={{
            background: 'rgba(255,255,255,0.03)',
            borderBottom: '1px solid rgba(0,0,0,0.5)',
            boxShadow: '0 1px 0 rgba(255,255,255,0.05) inset'
          }}
          onMouseDown={handleTitleBarMouseDown}
        >
          {/* Traffic lights (Sleek macOS inspired) */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={onClose}
              className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-400 transition-colors flex items-center justify-center group"
            >
              <span className="opacity-0 group-hover:opacity-100 text-[8px] text-red-900 font-bold leading-none">×</span>
            </button>
            <button
              onClick={onMinimise}
              className="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-400 transition-colors flex items-center justify-center group"
            >
              <span className="opacity-0 group-hover:opacity-100 text-[8px] text-yellow-900 font-bold leading-none">−</span>
            </button>
            <div className="w-3 h-3 rounded-full bg-green-500/40 cursor-default" />
          </div>

          {/* Window title */}
          <div className="flex-1 flex items-center justify-center gap-2">
            <span className="text-sm opacity-80 drop-shadow-sm">{win.icon}</span>
            <span className="text-xs text-white/50 font-semibold tracking-wide drop-shadow-md">{win.title}</span>
          </div>

          {/* Color accent line indicator */}
          <div
            className="w-2.5 h-2.5 rounded-full shadow-[0_0_8px_rgba(255,255,255,0.2)] border border-white/20"
            style={{ backgroundColor: win.color }}
          />
        </div>

        {/* Window content area */}
        <div className="flex-1 overflow-auto">
          <WindowContent id={win.id} />
        </div>
      </div>
    </motion.div>
  )
}
