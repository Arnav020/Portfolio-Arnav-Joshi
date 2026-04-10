'use client'

import { useEffect, useRef } from 'react'

const TECHS = [
  'Python', 'PyTorch', 'TensorFlow', 'FastAPI', 'Next.js', 'TypeScript',
  'Go', 'Docker', 'AWS', 'MLflow', 'DVC', 'React', 'MongoDB', 'PostgreSQL',
  'HuggingFace', 'Scikit-learn', 'XGBoost', 'OpenCV', 'Wav2Vec2', 'GSAP',
  'Three.js', 'Tailwind CSS', 'Node.js', 'Supabase', 'GitHub Actions',
]

export function TechMarquee() {
  const track1 = useRef<HTMLDivElement>(null)
  const track2 = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const loadGSAP = async () => {
      const { gsap } = await import('gsap')

      if (track1.current) {
        gsap.to(track1.current, {
          x: '-50%',
          duration: 30,
          ease: 'none',
          repeat: -1,
        })
      }
      if (track2.current) {
        gsap.to(track2.current, {
          x: '0%',
          duration: 30,
          ease: 'none',
          repeat: -1,
          from: { x: '-50%' },
        })
      }
    }

    loadGSAP()
  }, [])

  const items = [...TECHS, ...TECHS]

  return (
    <div className="py-16 overflow-hidden border-y border-white/5">
      {/* Row 1 — left to right */}
      <div className="flex mb-4">
        <div
          ref={track1}
          className="flex gap-4 whitespace-nowrap will-change-transform"
          style={{ width: 'max-content' }}
        >
          {items.map((tech, i) => (
            <span
              key={`${tech}-${i}`}
              className="inline-flex items-center gap-2 px-5 py-2 glass rounded-xl border border-white/8 text-sm text-[var(--muted-foreground)] flex-shrink-0"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500/60" />
              {tech}
            </span>
          ))}
        </div>
      </div>

      {/* Row 2 — right to left */}
      <div className="flex">
        <div
          ref={track2}
          className="flex gap-4 whitespace-nowrap will-change-transform"
          style={{
            width: 'max-content',
            transform: 'translateX(-50%)',
          }}
        >
          {[...items].reverse().map((tech, i) => (
            <span
              key={`rev-${tech}-${i}`}
              className="inline-flex items-center gap-2 px-5 py-2 glass rounded-xl border border-white/8 text-sm text-[var(--muted-foreground)] flex-shrink-0"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-purple-500/60" />
              {tech}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
