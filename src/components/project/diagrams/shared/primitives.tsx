'use client'

import { useReducedMotion } from '@/hooks/useReducedMotion'
import { cn } from '@/lib/utils'

interface Point {
  x: number // 0–100, percentage of canvas width
  y: number // 0–100, percentage of canvas height
}

export function DiagramCanvas({
  children,
  minWidth = 640,
  aspect = '16/7',
}: {
  children: React.ReactNode
  minWidth?: number
  aspect?: string
}) {
  return (
    <div className="relative" style={{ minWidth, aspectRatio: aspect }}>
      {children}
    </div>
  )
}

export function DiagramEdge({ from, to }: { from: Point; to: Point }) {
  const reducedMotion = useReducedMotion()
  return (
    <svg className="pointer-events-none absolute inset-0 h-full w-full overflow-visible" aria-hidden="true">
      <defs>
        <marker id="diagram-arrow" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
          <path d="M0,0 L8,4 L0,8 Z" className="fill-border-strong" />
        </marker>
      </defs>
      <line
        x1={`${from.x}%`}
        y1={`${from.y}%`}
        x2={`${to.x}%`}
        y2={`${to.y}%`}
        className={cn('stroke-border-strong', !reducedMotion && 'diagram-edge-flow')}
        strokeWidth={1.5}
        strokeDasharray="4 4"
        markerEnd="url(#diagram-arrow)"
      />
    </svg>
  )
}

export function DiagramNode({
  point,
  label,
  sublabel,
  active,
  onClick,
  width = 128,
}: {
  point: Point
  label: string
  sublabel?: string
  active?: boolean
  onClick?: () => void
  width?: number
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{ left: `${point.x}%`, top: `${point.y}%`, width }}
      className={cn(
        '-translate-x-1/2 -translate-y-1/2 absolute rounded-xl border px-3 py-2 text-center text-xs font-medium leading-snug shadow-sm',
        'transition-colors duration-150 ease-[var(--ease-out)]',
        active
          ? 'border-accent bg-accent/10 text-foreground-strong'
          : 'border-border bg-background text-foreground hover:border-border-strong'
      )}
    >
      {label}
      {sublabel && <span className="mt-0.5 block text-[10px] font-normal text-muted-foreground">{sublabel}</span>}
    </button>
  )
}

export function DiagramCallout({ point, children }: { point: Point; children: React.ReactNode }) {
  return (
    <div
      style={{ left: `${point.x}%`, top: `${point.y}%` }}
      className="absolute -translate-x-1/2 rounded-md border border-accent/30 bg-accent/10 px-2 py-1 text-[10px] font-medium text-foreground-strong"
    >
      {children}
    </div>
  )
}
