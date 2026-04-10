'use client'
import { useState } from 'react'
import { skillsByCategory, skillCategoryMeta } from '@/data/skills'
import { motion } from 'framer-motion'
import type { SkillCategory } from '@/types'

const CATS = Object.keys(skillsByCategory) as SkillCategory[]

export function SkillsWindow() {
  const [active, setActive] = useState<SkillCategory>('ml')
  return (
    <div className="flex flex-col h-full overflow-y-auto p-4 sm:p-6 custom-scrollbar text-sm sm:text-base space-y-6">
      <div className="font-mono text-xs sm:text-sm text-green-400/80 mb-2">
        <p><span className="text-indigo-400">~</span> ls skills/</p>
      </div>
      <div className="flex flex-wrap gap-2.5">
        {CATS.map((cat) => (
          <button
            key={cat}
            onClick={() => setActive(cat)}
            className="px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all shadow-sm hover:shadow-md"
            style={active === cat
              ? { background: skillCategoryMeta[cat].color, color: '#fff' }
              : { background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.5)',
                  border: '1px solid rgba(255,255,255,0.1)' }
            }
          >
            {skillCategoryMeta[cat].label}
          </button>
        ))}
      </div>
      <div className="space-y-4 sm:space-y-5 bg-white/5 border border-white/5 p-4 sm:p-6 rounded-2xl">
        {skillsByCategory[active].map((skill, i) => (
          <div key={skill.name}>
            <div className="flex justify-between mb-1.5 sm:mb-2">
              <span className="text-sm sm:text-base font-medium text-white/90">{skill.name}</span>
              <span className="text-xs sm:text-sm font-mono font-bold" style={{ color: skillCategoryMeta[active].color }}>
                {skill.level}%
              </span>
            </div>
            <div className="h-1.5 sm:h-2 bg-white/10 rounded-full overflow-hidden shadow-inner">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${skill.level}%` }}
                transition={{ duration: 0.8, delay: i * 0.05, ease: [0.3,0,0.2,1] }}
                className="h-full rounded-full"
                style={{ background: skillCategoryMeta[active].color }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
