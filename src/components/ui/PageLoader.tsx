'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export function PageLoader() {
  const [loading, setLoading] = useState(true)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    // Simulate asset loading progress
    const intervals = [
      setTimeout(() => setProgress(30), 100),
      setTimeout(() => setProgress(60), 300),
      setTimeout(() => setProgress(85), 600),
      setTimeout(() => setProgress(100), 900),
      setTimeout(() => setLoading(false), 1200),
    ]
    return () => intervals.forEach(clearTimeout)
  }, [])

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-[var(--background)]"
        >
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="text-5xl font-bold text-gradient mb-12"
          >
            AJ
          </motion.div>

          {/* Progress bar */}
          <div className="w-48 h-px bg-white/10 rounded-full overflow-hidden mb-4">
            <motion.div
              className="h-full rounded-full"
              style={{
                background:
                  'linear-gradient(90deg, #6366f1, #8b5cf6)',
                width: `${progress}%`,
                transition: 'width 0.3s ease',
              }}
            />
          </div>

          {/* Counter */}
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xs text-[var(--muted-foreground)] tabular-nums"
          >
            {progress}%
          </motion.span>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
