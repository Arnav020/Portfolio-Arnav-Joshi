import { memo, useRef } from 'react'
import { motion, AnimatePresence, useDragControls } from 'framer-motion'
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

const DraggableWindow = memo(function DraggableWindow({
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
  const dragControls = useDragControls()

  return (
    <motion.div
      drag
      dragControls={dragControls}
      dragListener={false}
      dragMomentum={false}
      dragElastic={0}
      onDragEnd={(_, info) => {
        onUpdate({
          position: {
            x: win.position.x + info.offset.x,
            y: win.position.y + info.offset.y,
          },
        })
      }}
      initial={{ opacity: 0, scale: 0.95, y: win.position.y + 20, x: win.position.x }}
      animate={{ opacity: 1, scale: 1, y: win.position.y, x: win.position.x }}
      exit={{ opacity: 0, scale: 0.9, y: win.position.y + 30 }}
      transition={{ type: 'spring', damping: 25, stiffness: 350 }}
      style={{
        position: 'absolute',
        width: win.size.width,
        height: win.size.height,
        zIndex: win.zIndex,
        minWidth: 480,
        minHeight: 380,
      }}
      onMouseDown={onFocus}
      className="transform-gpu will-change-[transform,opacity]"
    >
      <div
        className={`flex flex-col w-full h-full rounded-xl overflow-hidden transition-[background,border,box-shadow] duration-300 ${
          isActive 
            ? 'shadow-[0_40px_80px_-15px_rgba(0,0,0,0.8),0_0_0_1px_rgba(59,130,246,0.2)] border-blue-500/30' 
            : 'shadow-[0_15px_30px_rgba(0,0,0,0.6)] border-white/5'
        } border`}
        style={{
          background: isActive ? '#0d0d12' : '#08080a',
          boxShadow: isActive
            ? `0 0 0 1px rgba(255,255,255,0.02) inset`
            : 'none',
          isolation: 'isolate',
        }}
      >
        {/* Title bar - Native Drag Control */}
        <div
          className={`flex items-center gap-3 px-4 h-11 flex-shrink-0 cursor-grab active:cursor-grabbing select-none transition-colors duration-300 ${
            isActive ? 'bg-blue-500/[0.06]' : 'bg-white/[0.02]'
          }`}
          style={{
            borderBottom: isActive ? '1px solid rgba(59, 130, 246, 0.2)' : '1px solid rgba(0,0,0,0.4)',
          }}
          onPointerDown={(e) => {
            onFocus()
            dragControls.start(e)
          }}
        >
          {/* Traffic lights */}
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
            <span className="text-sm opacity-80">{win.icon}</span>
            <span className="text-xs text-white/50 font-bold tracking-tight uppercase">{win.title}</span>
          </div>
 
          {/* Color accent */}
          <div
            className="w-2 h-2 rounded-full border border-white/20"
            style={{ backgroundColor: win.color }}
          />
        </div>
 
        {/* Window content area - High Performance Scroll */}
        <div className="flex-1 min-h-0 bg-black/10 custom-scrollbar translate-z-0">
          <WindowContent id={win.id} />
        </div>
      </div>
    </motion.div>
  )
})
