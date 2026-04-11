'use client'

import { Play, SkipBack, SkipForward } from 'lucide-react'

export function NowPlayingWidget() {
  return (
    <div className="w-[300px] h-[180px] p-6 rounded-[2.5rem] bg-[#0a0f24]/60 backdrop-blur-2xl border border-blue-500/20 shadow-[0_20px_50px_rgba(0,0,0,0.5),inset_0_0_20px_rgba(59,130,246,0.05)] flex flex-col justify-between hover:bg-[#0c1433]/80 transition-all hover:scale-[1.02] select-none cursor-default group">
      <div className="flex gap-4">
        {/* Album Art Placeholder */}
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-xl flex-shrink-0 flex items-center justify-center overflow-hidden">
          <div className="w-6 h-6 rounded-full bg-white/20 backdrop-blur-md" />
        </div>
        <div className="flex flex-col justify-center overflow-hidden">
          <div className="text-white font-bold text-base truncate drop-shadow-[0_0_8px_rgba(255,255,255,0.1)]">Lofi Study Beats</div>
          <div className="text-white/50 text-xs font-medium truncate mt-0.5">Focus Room</div>
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
          <div className="h-full w-1/3 bg-blue-500 shadow-[0_0_12px_rgba(59,130,246,0.6)]" />
        </div>
        <div className="flex items-center justify-center gap-8">
          <button className="text-white/40 hover:text-white transition-colors">
            <SkipBack className="w-5 h-5 fill-current" />
          </button>
          <button className="w-11 h-11 rounded-full bg-white/90 text-black flex items-center justify-center shadow-lg hover:scale-105 transition-transform active:scale-95">
            <Play className="w-4 h-4 fill-current ml-0.5" />
          </button>
          <button className="text-white/40 hover:text-white transition-colors">
            <SkipForward className="w-5 h-5 fill-current" />
          </button>
        </div>
      </div>
    </div>
  )
}
