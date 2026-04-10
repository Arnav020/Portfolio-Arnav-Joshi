'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

export function MagneticCursor() {
  const cursorRef = useRef<HTMLDivElement>(null)
  const dotRef = useRef<HTMLDivElement>(null)

  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const springConfig = { damping: 28, stiffness: 300, mass: 0.5 }
  const cursorX = useSpring(mouseX, springConfig)
  const cursorY = useSpring(mouseY, springConfig)

  const dotX = useSpring(mouseX, { damping: 40, stiffness: 500 })
  const dotY = useSpring(mouseY, { damping: 40, stiffness: 500 })

  const [visible, setVisible] = useState(false)
  const [clicked, setClicked] = useState(false)
  const [hovering, setHovering] = useState(false)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX - 16)
      mouseY.set(e.clientY - 16)
      if (!visible) setVisible(true)
    }

    const handleMouseDown = () => setClicked(true)
    const handleMouseUp = () => setClicked(false)
    const handleMouseLeave = () => setVisible(false)
    const handleMouseEnter = () => setVisible(true)

    const handleHoverStart = () => setHovering(true)
    const handleHoverEnd = () => setHovering(false)

    const interactiveEls = document.querySelectorAll(
      'a, button, [role="button"], input, textarea, select, [data-cursor-hover]'
    )

    interactiveEls.forEach((el) => {
      el.addEventListener('mouseenter', handleHoverStart)
      el.addEventListener('mouseleave', handleHoverEnd)
    })

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mousedown', handleMouseDown)
    window.addEventListener('mouseup', handleMouseUp)
    document.addEventListener('mouseleave', handleMouseLeave)
    document.addEventListener('mouseenter', handleMouseEnter)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mousedown', handleMouseDown)
      window.removeEventListener('mouseup', handleMouseUp)
      document.removeEventListener('mouseleave', handleMouseLeave)
      document.removeEventListener('mouseenter', handleMouseEnter)
      interactiveEls.forEach((el) => {
        el.removeEventListener('mouseenter', handleHoverStart)
        el.removeEventListener('mouseleave', handleHoverEnd)
      })
    }
  }, [mouseX, mouseY, visible])

  if (typeof window !== 'undefined') {
    const isTouch = window.matchMedia('(pointer: coarse)').matches
    if (isTouch) return null
  }

  return (
    <>
      {/* Outer ring */}
      <motion.div
        ref={cursorRef}
        className="fixed top-0 left-0 z-[9999] pointer-events-none mix-blend-difference"
        style={{ x: cursorX, y: cursorY }}
        animate={{
          scale: clicked ? 0.7 : hovering ? 1.8 : 1,
          opacity: visible ? 1 : 0,
        }}
        transition={{ scale: { duration: 0.15 }, opacity: { duration: 0.2 } }}
      >
        <div
          className="w-8 h-8 rounded-full border border-white/60"
          style={{ transform: 'translate(0, 0)' }}
        />
      </motion.div>

      {/* Inner dot */}
      <motion.div
        ref={dotRef}
        className="fixed top-0 left-0 z-[9999] pointer-events-none mix-blend-difference"
        style={{
          x: useSpring(mouseX, { damping: 50, stiffness: 600 }),
          y: useSpring(mouseY, { damping: 50, stiffness: 600 }),
        }}
        animate={{ opacity: visible ? 1 : 0 }}
        transition={{ opacity: { duration: 0.2 } }}
      >
        <div className="w-8 h-8 flex items-center justify-center">
          <div
            className="w-1.5 h-1.5 rounded-full bg-white"
            style={{
              transform: hovering ? 'scale(0)' : 'scale(1)',
              transition: 'transform 0.15s',
            }}
          />
        </div>
      </motion.div>
    </>
  )
}
