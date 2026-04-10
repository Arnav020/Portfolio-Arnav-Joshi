'use client'

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { DesktopIcon } from './DesktopIcon'
import { WindowManager } from './WindowManager'
import { Taskbar } from './Taskbar'
import { ClockWidget } from './widgets/ClockWidget'
import { NowPlayingWidget } from './widgets/NowPlayingWidget'
import type { WindowState } from '@/types/desktop'

export const DESKTOP_APPS = [
  {
    id: 'about',
    label: 'about.txt',
    icon: '👤',
    color: '#6366f1',
  },
  {
    id: 'skills',
    label: 'skills/',
    icon: '⚡',
    color: '#8b5cf6',
  },
  {
    id: 'projects',
    label: 'projects/',
    icon: '📁',
    color: '#06b6d4',
  },
  {
    id: 'experience',
    label: 'experience.md',
    icon: '💼',
    color: '#10b981',
  },
  {
    id: 'achievements',
    label: 'awards.json',
    icon: '🏆',
    color: '#f59e0b',
  },
  {
    id: 'contact',
    label: 'contact.sh',
    icon: '✉️',
    color: '#ec4899',
  },
]

export function DesktopOS() {
  const [windows, setWindows] = useState<WindowState[]>([])
  const [activeWindowId, setActiveWindowId] = useState<string | null>(null)
  const [zCounter, setZCounter] = useState(100)

  const openWindow = useCallback((appId: string) => {
    const existing = windows.find((w) => w.id === appId)
    if (existing) {
      // Bring to front if already open
      const newZ = zCounter + 1
      setZCounter(newZ)
      setWindows((ws) =>
        ws.map((w) =>
          w.id === appId ? { ...w, zIndex: newZ, minimised: false } : w
        )
      )
      setActiveWindowId(appId)
      return
    }

    const app = DESKTOP_APPS.find((a) => a.id === appId)
    if (!app) return

    const newZ = zCounter + 1
    setZCounter(newZ)

    // Cascade position for new windows
    const offset = windows.length * 28
    setWindows((ws) => [
      ...ws,
      {
        id: appId,
        title: app.label,
        icon: app.icon,
        color: app.color,
        zIndex: newZ,
        minimised: false,
        position: { x: 80 + offset, y: 60 + offset },
        size: { width: 840, height: 600 },
      },
    ])
    setActiveWindowId(appId)
  }, [windows, zCounter])

  const closeWindow = useCallback((id: string) => {
    setWindows((ws) => ws.filter((w) => w.id !== id))
    setActiveWindowId(null)
  }, [])

  const minimiseWindow = useCallback((id: string) => {
    setWindows((ws) =>
      ws.map((w) => (w.id === id ? { ...w, minimised: true } : w))
    )
  }, [])

  const bringToFront = useCallback((id: string) => {
    const newZ = zCounter + 1
    setZCounter(newZ)
    setWindows((ws) =>
      ws.map((w) => (w.id === id ? { ...w, zIndex: newZ, minimised: false } : w))
    )
    setActiveWindowId(id)
  }, [zCounter])

  const updateWindow = useCallback(
    (id: string, updates: Partial<WindowState>) => {
      setWindows((ws) =>
        ws.map((w) => (w.id === id ? { ...w, ...updates } : w))
      )
    },
    []
  )

  return (
    <div 
      className="absolute inset-0 overflow-hidden select-none bg-gradient-to-br from-[#0f172a] via-[#1e1b4b] to-[#09090b] font-sans shadow-[inset_0_0_150px_rgba(0,0,0,0.6)]"
      data-windows-open={windows.length > 0}
    >
      
      {/* Top Menu Bar — Frosted Glass Look */}
      <div className="absolute top-0 left-0 right-0 h-9 z-50 bg-black/40 backdrop-blur-2xl border-b border-white/5 flex items-center px-6 justify-between text-xs text-white/80 shadow-md">
        <div className="flex items-center gap-6 font-medium tracking-wide">
          <div className="w-5 h-5 bg-white/10 rounded flex items-center justify-center text-[10px] font-bold shadow-inner border border-white/10 text-white/90">W</div>
          <span className="cursor-pointer hover:text-white transition-colors cursor-default">Portfolio.</span>
          <span className="cursor-pointer hover:text-white transition-colors cursor-default">File</span>
          <span className="cursor-pointer hover:text-white transition-colors cursor-default">View</span>
          <span className="cursor-pointer hover:text-white transition-colors cursor-default">Go</span>
        </div>
        <div className="flex items-center gap-4 text-[11px] font-mono font-medium opacity-80">
          <span suppressHydrationWarning>{new Date().toLocaleDateString('en-US', { weekday: 'short', day: '2-digit', month: 'short', hour: 'numeric', minute: '2-digit' })}</span>
        </div>
      </div>

      <div className="absolute top-20 left-10 grid grid-cols-1 gap-8 z-40">
        {DESKTOP_APPS.map((app, i) => (
          <DesktopIcon
            key={app.id}
            app={app}
            isOpen={windows.some((w) => w.id === app.id && !w.minimised)}
            onOpen={() => openWindow(app.id)}
            index={i}
          />
        ))}
      </div>

      {/* Widgets Platform Layer — Placed on the right side of the screen */}
      <div className="absolute top-20 right-10 flex flex-col gap-6 z-20 hidden md:flex">
        <ClockWidget />
        <NowPlayingWidget />
      </div>

      {/* Decorative Background Glows (Optimized: No CSS blur, pure GPU radial gradients) */}
      <div className="absolute top-[-20%] right-[-10%] w-[1000px] h-[1000px] bg-[radial-gradient(circle,_rgba(79,70,229,0.15)_0%,_transparent_60%)] pointer-events-none mix-blend-screen transform-gpu" />
      <div className="absolute bottom-[-20%] left-[-10%] w-[800px] h-[800px] bg-[radial-gradient(circle,_rgba(217,70,239,0.1)_0%,_transparent_60%)] pointer-events-none mix-blend-screen transform-gpu" />
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] transform-gpu" style={{ backgroundImage: 'linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)', backgroundSize: '64px 64px' }} />

      {/* Welcome hint — fades out after first interaction */}
      {windows.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-32 left-1/2 -translate-x-1/2 text-center pointer-events-none"
        >
          <p className="text-white/30 text-sm tracking-widest uppercase font-semibold">
            Double-click an icon to open
          </p>
        </motion.div>
      )}

      {/* Windows */}
      <WindowManager
        windows={windows}
        activeWindowId={activeWindowId}
        onClose={closeWindow}
        onMinimise={minimiseWindow}
        onFocus={bringToFront}
        onUpdate={updateWindow}
      />

      {/* Taskbar */}
      <Taskbar
        apps={DESKTOP_APPS}
        windows={windows}
        onOpen={openWindow}
        onFocus={bringToFront}
        activeWindowId={activeWindowId}
      />
    </div>
  )
}
