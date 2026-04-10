'use client'

import { Play, SkipBack, SkipForward } from 'lucide-react'

export function NowPlayingWidget() {
  return (
    <div className="w-[300px] h-[160px] p-5 rounded-[2rem] bg-black/20 backdrop-blur-3xl border border-white/5 shadow-2xl flex flex-col justify-between hover:bg-black/30 transition-all hover:scale-105 select-none cursor-default group">
      <div className="flex gap-4">
        {/* Album Art Placeholder */}
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-xl flex-shrink-0 flex items-center justify-center overflow-hidden">
          <div className="w-6 h-6 rounded-full bg-white/20 backdrop-blur-md" />
        </div>
        <div className="flex flex-col justify-center overflow-hidden">
          <div className="text-white font-bold text-base truncate">Lofi Study Beats</div>
          <div className="text-white/50 text-xs font-medium truncate mt-0.5">Focus Room</div>
        </div>
      </div>
      
      <div className="flex items-center justify-center gap-6 mt-2">
        <button className="text-white/40 hover:text-white transition-colors">
          <SkipBack className="w-5 h-5 fill-current" />
        </button>
        <button className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
          <Play className="w-4 h-4 fill-current ml-0.5" />
        </button>
        <button className="text-white/40 hover:text-white transition-colors">
          <SkipForward className="w-5 h-5 fill-current" />
        </button>
      </div>
    </div>
  )
}
