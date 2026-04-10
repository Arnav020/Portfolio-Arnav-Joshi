'use client'
import { useState } from 'react'
import { projects, projectsByCategory } from '@/data/projects'
import { ChevronRight, X } from 'lucide-react'
import { Github } from '@/components/ui/Icons'
import { motion, AnimatePresence } from 'framer-motion'
import type { Project, ProjectCategory } from '@/types'

const FILTERS: { label: string; value: ProjectCategory }[] = [
  { label: 'All', value: 'all' },
  { label: 'ML', value: 'ml' },
  { label: 'Full Stack', value: 'fullstack' },
  { label: 'Backend', value: 'backend' },
  { label: 'MLOps', value: 'mlops' },
]

const CAT_COLORS: Record<string, string> = {
  ml: '#8b5cf6', backend: '#10b981',
  fullstack: '#06b6d4', mlops: '#f59e0b', other: '#6366f1',
}

export function ProjectsWindow() {
  const [filter, setFilter] = useState<ProjectCategory>('all')
  const [selected, setSelected] = useState<Project | null>(null)
  const list = projectsByCategory[filter]

  if (selected) {
    return (
      <div className="flex flex-col h-full overflow-y-auto p-4 sm:p-6 custom-scrollbar text-sm sm:text-base">
        <button onClick={() => setSelected(null)}
          className="flex items-center gap-1.5 text-sm text-white/50 hover:text-white/90 transition-colors mb-4 font-medium">
          ← Back to projects
        </button>
        <div className="flex items-center gap-3 mb-2">
          <span className="px-3 py-1 rounded-md text-xs font-mono font-bold tracking-wide"
            style={{ background: `${CAT_COLORS[selected.category]}22`,
              color: CAT_COLORS[selected.category] }}>
            {selected.category}
          </span>
          <h3 className="font-bold text-white text-2xl sm:text-3xl tracking-tight">{selected.title}</h3>
        </div>
        <p className="text-white/70 leading-relaxed text-sm sm:text-base mb-6 font-medium">{selected.longDescription || selected.description}</p>
        <div className="space-y-2.5 mb-6">
          {selected.highlights.map((h, i) => (
            <div key={i} className="flex gap-3 text-sm sm:text-base text-white/70 leading-relaxed">
              <ChevronRight className="w-5 h-5 text-indigo-400 flex-shrink-0 mt-0.5" />{h}
            </div>
          ))}
        </div>
        <div className="flex flex-wrap gap-2 mb-8">
          {selected.techStack.map((t) => (
            <span key={t} className="px-2.5 py-1 rounded-md text-xs font-medium bg-white/5 border border-white/10 text-white/60">{t}</span>
          ))}
        </div>
        <a href={selected.githubUrl} target="_blank" rel="noopener noreferrer"
           className="mt-auto self-start inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-sm font-semibold hover:bg-indigo-500/40 hover:text-white transition-all shadow-lg hover:shadow-indigo-500/20">
          <Github className="w-4 h-4" /> View on GitHub
        </a>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full overflow-y-auto p-4 sm:p-6 custom-scrollbar space-y-5 text-sm sm:text-base">
      <div className="font-mono text-xs sm:text-sm text-green-400/80 mb-2">
        <p><span className="text-indigo-400">~</span> ls projects/ | {projects.length} items</p>
      </div>
      <div className="flex flex-wrap gap-2 mb-2">
        {FILTERS.map(({ label, value }) => (
          <button key={value} onClick={() => setFilter(value)}
            className="px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all"
            style={filter === value
              ? { background: '#6366f1', color: '#fff' }
              : { background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.45)',
                  border: '1px solid rgba(255,255,255,0.1)' }
            }
          >
            {label} <span className="opacity-50 ml-1.5">{projectsByCategory[value].length}</span>
          </button>
        ))}
      </div>
      <div className="space-y-3">
        {list.map((project) => (
          <button key={project.slug} onClick={() => setSelected(project)}
            className="w-full flex items-center justify-between p-4 sm:p-5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 transition-all text-left shadow-sm hover:shadow-xl group">
            <div className="flex items-center gap-4 min-w-0">
              <div className="w-3 h-3 rounded-full flex-shrink-0 shadow-inner"
                style={{ background: CAT_COLORS[project.category] }} />
              <div className="min-w-0">
                <div className="text-sm sm:text-base font-semibold text-white/90 truncate">{project.title}</div>
                <div className="text-xs sm:text-sm text-white/50 truncate mt-1 font-medium">{project.techStack.slice(0, 4).join(' · ')}</div>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-white/30 group-hover:text-white/80 group-hover:translate-x-1 flex-shrink-0 transition-all" />
          </button>
        ))}
      </div>
    </div>
  )
}
