'use client'

import { useState, useEffect } from 'react'

export function ClockWidget() {
  const [time, setTime] = useState<Date | null>(null)

  useEffect(() => {
    setTime(new Date())
    const interval = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(interval)
  }, [])

  if (!time) return null

  return (
    <div className="w-[300px] h-[160px] p-6 rounded-[2.5rem] bg-[#0a0f24]/60 backdrop-blur-2xl border border-blue-500/20 shadow-[0_20px_50px_rgba(0,0,0,0.5),inset_0_0_20px_rgba(59,130,246,0.05)] flex flex-col justify-between hover:bg-[#0c1433]/80 transition-all hover:scale-[1.02] select-none cursor-default">
      <div className="flex items-start justify-between">
        <div>
          <h4 className="text-white/40 text-xs font-semibold tracking-widest uppercase mb-1">Local Time</h4>
          <div className="text-white text-5xl font-light tracking-tighter drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">
            {time.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: false })}
          </div>
        </div>
        <div className="w-2 h-2 rounded-full bg-blue-400 shadow-[0_0_12px_rgba(96,165,250,0.8)] animate-pulse" />
      </div>
      <div>
        <div className="text-white/60 font-medium text-sm tracking-wide">
          {time.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
        </div>
      </div>
    </div>
  )
}
