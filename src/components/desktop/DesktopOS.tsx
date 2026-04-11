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
    icon: 'CircleUser',
    color: '#6366f1',
  },
  {
    id: 'skills',
    label: 'skills/',
    icon: 'Cpu',
    color: '#8b5cf6',
  },
  {
    id: 'projects',
    label: 'projects/',
    icon: 'FolderOpen',
    color: '#06b6d4',
  },
  {
    id: 'experience',
    label: 'experience.md',
    icon: 'Briefcase',
    color: '#10b981',
  },
  {
    id: 'achievements',
    label: 'awards.json',
    icon: 'Trophy',
    color: '#f59e0b',
  },
  {
    id: 'contact',
    label: 'contact.sh',
    icon: 'Mail',
    color: '#ec4899',
  },
]

const DESKTOP_FILES = [
  {
    id: 'resume-ml',
    label: 'Resume_ML.pdf',
    icon: 'FileText',
    color: '#ef4444',
    url: '/resume-ml.pdf',
  },
  {
    id: 'resume-sde',
    label: 'Resume_SDE.pdf',
    icon: 'FileText',
    color: '#3b82f6',
    url: '/resume-sde.pdf',
  },
]

const CODE_SNIPPETS = [
  `class Trainer:\n  def __init__(self, model, optimizer):\n    self.model = model.to(device)\n    self.optimizer = optimizer\n  \n  def step(self, batch):\n    x, y = batch\n    self.optimizer.zero_grad()\n    loss = self.model(x).loss(y)\n    loss.backward()\n    self.optimizer.step()\n    return loss.item()`,
  `func StartServer() {\n  lis, err := net.Listen("tcp", port)\n  if err != nil {\n    log.Fatalf("failed to listen: %v", err)\n  }\n  s := grpc.NewServer()\n  pb.RegisterUserServiceServer(s, &server{})\n  if err := s.Serve(lis); err != nil {\n    log.Fatalf("failed to serve: %v", err)\n  }\n}`,
  `export function useIntersectionObserver(ref, options) {\n  const [entry, setEntry] = useState(null)\n  useEffect(() => {\n    const observer = new IntersectionObserver(([e]) => setEntry(e), options)\n    if (ref.current) observer.observe(ref.current)\n    return () => observer.disconnect()\n  }, [ref, options])\n  return entry\n}`,
  `export async function POST(req: Request) {\n  const { data } = await req.json()\n  const validated = schema.safeParse(data)\n  if (!validated.success) return Response.json({ error: "Invalid" }, { status: 400 })\n  const result = await db.insert(table).values(validated.data)\n  return Response.json(result)\n}`,
  `interface WindowState {\n  id: string\n  label: string\n  isOpen: boolean\n  position: { x: number; y: number }\n  size: { width: number; height: number }\n  zIndex: number\n}`,
  `@app.route("/stream")\ndef stream():\n    def generate():\n        for chunk in agent.run():\n            yield f"data: {chunk}\\n\\n"\n    return Response(generate(), mimetype="text/event-stream")`
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
  }, [zCounter, windows])

  const handleOpenFile = (url: string) => {
    window.open(url, '_blank')
  }

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
      className="absolute inset-0 overflow-hidden select-none font-sans shadow-[inset_0_0_150px_rgba(0,0,0,0.5)] transition-all duration-1000"
      style={{
        backgroundColor: '#02040a',
        backgroundImage: `radial-gradient(circle at 15% 15%, hsla(230, 60%, 15%, 1) 0%, transparent 60%)`,
        backgroundSize: '100% 100%',
      }}
      data-windows-open={windows.length > 0}
    >
      {/* Code substratum — High-Density Top-Weighted Texture */}
      <div 
        className="absolute inset-x-0 top-0 h-[60%] pointer-events-none opacity-[0.07] overflow-hidden select-none"
        style={{
          maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 40%, rgba(0,0,0,0) 100%)',
        }}
      >
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-16 gap-y-12 p-8 pt-16">
          {CODE_SNIPPETS.map((code, i) => (
            <pre key={i} className="font-mono text-[9px] leading-relaxed text-blue-300 whitespace-pre mix-blend-screen opacity-90 filter blur-[0.3px]">
              {code}
            </pre>
          ))}
          {/* High-density fill for top region */}
          {CODE_SNIPPETS.slice(0, 3).map((code, i) => (
            <pre key={`top-${i}`} className="font-mono text-[9px] leading-relaxed text-indigo-400 whitespace-pre mix-blend-screen opacity-40 translate-x-12 translate-y-4">
              {code}
            </pre>
          ))}
        </div>
      </div>
      
      {/* Top Menu Bar — Refined macOS look */}
      <div className="absolute top-0 left-0 right-0 h-8 z-50 bg-white/[0.03] backdrop-blur-3xl border-b border-white/[0.05] flex items-center px-5 justify-between text-[11px] text-white/70 shadow-sm">
        <div className="flex items-center gap-5 font-semibold tracking-tight">
          <div className="w-4 h-4 rounded-full flex items-center justify-center text-[10px] text-white overflow-hidden">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full opacity-90"><path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zM12 20c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z" /></svg>
          </div>
          <span className="cursor-default font-bold text-white/90">Portfolio</span>
          <span className="cursor-default hover:text-white transition-colors">File</span>
          <span className="cursor-default hover:text-white transition-colors">Edit</span>
          <span className="cursor-default hover:text-white transition-colors">View</span>
          <span className="cursor-default hover:text-white transition-colors">Window</span>
        </div>
        <div className="flex items-center gap-4 font-medium opacity-80">
          <span suppressHydrationWarning>{new Date().toLocaleDateString('en-US', { weekday: 'short', day: '2-digit', month: 'short', hour: 'numeric', minute: '2-digit' }).replace(',', '')}</span>
        </div>
      </div>

      <div className="absolute top-20 left-12 grid grid-cols-1 gap-4 z-40">
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

      {/* Desktop Files (Resumes) — Placed left of widgets */}
      <div className="absolute top-20 right-[350px] grid grid-cols-1 gap-4 z-40 hidden md:grid">
        {DESKTOP_FILES.map((file, i) => (
          <DesktopIcon
            key={file.id}
            app={file}
            isOpen={false}
            onOpen={() => handleOpenFile(file.url)}
            index={i + DESKTOP_APPS.length}
          />
        ))}
      </div>

      {/* Widgets Platform Layer — Placed on the right side of the screen */}
      <div className="absolute top-20 right-10 flex flex-col gap-6 z-20 hidden md:flex">
        <ClockWidget />
        <NowPlayingWidget />
      </div>

      {/* Optimized Background Atmosphere (Subtle overlay for depth) */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_50%,_rgba(255,255,255,0.02),_transparent)]" />
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]" 
           style={{ backgroundImage: 'radial-gradient(circle, white 0.5px, transparent 0.5px)', backgroundSize: '48px 48px' }} />

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
