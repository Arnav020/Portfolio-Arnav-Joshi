'use client'
import { experiences, education } from '@/data/experience'
import { Briefcase, GraduationCap } from 'lucide-react'

export function ExperienceWindow() {
  return (
    <div className="flex flex-col h-full overflow-y-auto p-4 sm:p-6 custom-scrollbar text-sm sm:text-base">
      <div className="font-mono text-xs sm:text-sm text-green-400/80 mb-6">
        <p><span className="text-indigo-400">~/experience</span> cat history.log</p>
      </div>

      <div className="space-y-8 relative before:absolute before:inset-0 before:ml-2 sm:before:ml-3 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-[2px] before:bg-gradient-to-b before:from-indigo-500/50 before:via-purple-500/20 before:to-transparent">
        {experiences.map((exp, idx) => (
          <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
            <div className="flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 rounded-full border-4 border-[#0a0a0f] bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.6)] absolute left-0 md:left-1/2 -translate-x-1/2 transition-transform duration-300 group-hover:scale-125" />
            
            <div className="w-[calc(100%-2rem)] md:w-[calc(50%-2rem)] p-4 sm:p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-indigo-500/30 transition-colors shadow-lg ml-6 sm:ml-8 md:ml-0">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 border-b border-white/10 pb-3">
                <div>
                  <div className="font-bold text-white/95 text-base sm:text-lg tracking-wide">{exp.role}</div>
                  <div className="text-white/60 font-medium text-xs sm:text-sm">{exp.company}</div>
                </div>
                <div className="text-indigo-300 font-mono text-xs sm:text-sm mt-1 sm:mt-0 font-medium">{exp.period}</div>
              </div>
              
              <ul className="space-y-2.5 mb-4">
                {exp.description.map((h, i) => (
                  <li key={i} className="flex gap-3 text-sm sm:text-base text-white/70 leading-relaxed">
                    <span className="text-indigo-400 font-black flex-shrink-0 mt-0.5">•</span>
                    <span>{h}</span>
                  </li>
                ))}
              </ul>

              <div className="flex flex-wrap gap-2">
                {exp.techStack.map((t) => (
                  <span key={t} className="px-2.5 py-1 rounded-md text-xs font-medium bg-white/5 border border-white/10 text-white/60">{t}</span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 pt-6 border-t border-white/10">
        <p className="text-xs sm:text-sm font-semibold text-white/40 uppercase tracking-[0.2em] mb-4">Education</p>
        <div className="space-y-3">
          {education.map((e) => (
            <div key={e.institution} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
              <div>
                <div className="font-bold text-white text-sm sm:text-base">{e.institution}</div>
                <div className="text-white/60 text-xs sm:text-sm font-medium mt-1">{e.degree}</div>
              </div>
              <div className="text-indigo-400 font-mono text-xs sm:text-sm font-semibold mt-2 sm:mt-0">{e.score}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
