'use client'
import { achievements } from '@/data/achievements'
import { Trophy, Star, Award, Rocket } from 'lucide-react'

const ICONS: Record<string, any> = {
  trophy: Trophy, star: Star, certificate: Award, rocket: Rocket,
}
const COLORS = ['#f59e0b','#6366f1','#06b6d4','#10b981']

export function AchievementsWindow() {
  return (
    <div className="flex flex-col h-full overflow-y-auto p-4 sm:p-6 custom-scrollbar text-sm sm:text-base space-y-5">
      <div className="font-mono text-xs sm:text-sm text-green-400/80 mb-2">
        <p><span className="text-indigo-400">~</span> cat awards.json</p>
      </div>
      {achievements.map((a, i) => {
        const Icon = ICONS[a.icon || 'star'] || Star
        const color = COLORS[i % COLORS.length]
        return (
          <div key={a.title} className="p-4 sm:p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all flex gap-4 shadow-sm hover:shadow-lg">
            <div className="p-3 bg-opacity-20 rounded-xl flex-shrink-0 mt-1 flex items-center justify-center self-start"
              style={{ background: `${color}18`, border: `1px solid ${color}33`, boxShadow: `inset 0 0 10px ${color}10` }}>
              <Icon className="w-5 h-5 sm:w-6 sm:h-6" style={{ color }} />
            </div>
            <div>
              <div className="flex items-center gap-3 flex-wrap">
                <span className="font-bold text-white/95 text-base sm:text-lg tracking-wide">{a.title}</span>
                {a.year && (
                  <span className="text-xs px-2 py-0.5 rounded-md font-mono font-medium tracking-wide"
                    style={{ background: `${color}25`, color }}>
                    {a.year}
                  </span>
                )}
              </div>
              <p className="text-white/60 text-sm sm:text-base font-medium leading-relaxed mt-2">{a.description}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
