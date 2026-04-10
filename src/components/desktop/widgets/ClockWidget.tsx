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
    <div className="w-[300px] h-[160px] p-6 rounded-[2rem] bg-black/20 backdrop-blur-3xl border border-white/5 shadow-2xl flex flex-col justify-between hover:bg-black/30 transition-all hover:scale-105 select-none cursor-default">
      <div className="flex items-start justify-between">
        <div>
          <h4 className="text-white/40 text-xs font-semibold tracking-widest uppercase mb-1">Local Time</h4>
          <div className="text-white text-5xl font-light tracking-tighter">
            {time.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: false })}
          </div>
        </div>
        <div className="w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.8)] animate-pulse" />
      </div>
      <div>
        <div className="text-white/60 font-medium text-sm tracking-wide">
          {time.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
        </div>
      </div>
    </div>
  )
}
