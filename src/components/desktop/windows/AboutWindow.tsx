'use client'
import { education } from '@/data/experience'
import { stats } from '@/data/achievements'
import { GraduationCap, MapPin, Calendar } from 'lucide-react'

export function AboutWindow() {
  return (
    <div className="flex flex-col h-full overflow-y-auto p-4 sm:p-6 custom-scrollbar text-sm">
      {/* Terminal-style header */}
      <div className="font-mono text-xs space-y-1 text-green-400/80 mb-4">
        <p><span className="text-indigo-400">~</span> cat about.txt</p>
      </div>
      <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-2">Arnav Joshi</h2>
      <p className="text-white/70 leading-relaxed text-sm sm:text-base font-medium max-w-2xl mb-6">
        CS undergrad at <span className="text-white">Thapar Institute</span> (CGPA{' '}
        <span className="text-indigo-400 font-semibold">9.55</span>), awarded Merit
        Scholarship three consecutive years. I build ML systems, agentic AI workflows,
        and production-grade full-stack apps. My work includes real ISRO spacecraft
        data and shipping products that actually work.
      </p>
      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-8">
        {[
          { icon: MapPin, text: 'Ludhiana, India' },
          { icon: GraduationCap, text: 'B.Tech CSE · 2027' },
          { icon: Calendar, text: 'Open to Opportunities' },
        ].map(({ icon: Icon, text }) => (
          <span key={text} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-xs text-white/60">
            <Icon className="w-3 h-3 text-indigo-400" />{text}
          </span>
        ))}
      </div>
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        {stats.map((s) => (
          <div key={s.label} className="bg-white/5 rounded-xl p-5 border border-white/10 hover:bg-white/10 transition-colors">
            <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 mb-1">
              {s.value}<span className="text-lg font-medium text-indigo-400 ml-1">{s.suffix}</span>
            </div>
            <div className="text-sm font-medium text-white/50">{s.label}</div>
          </div>
        ))}
      </div>
      {/* Education */}
      <div className="space-y-3">
        {education.map((e) => (
          <div key={e.institution} className="flex gap-4 p-4 rounded-xl bg-white/5 border border-white/10">
            <GraduationCap className="w-6 h-6 text-indigo-400 flex-shrink-0 mt-1" />
            <div>
              <div className="font-semibold text-white text-sm sm:text-base">{e.institution}</div>
              <div className="text-white/60 text-xs sm:text-sm">{e.degree}</div>
              <div className="text-indigo-400 text-xs font-bold mt-1.5">{e.score}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
