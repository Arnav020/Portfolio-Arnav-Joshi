'use client'

import { useState } from 'react'
import { DiagramCanvas, DiagramCallout, DiagramEdge, DiagramNode } from './shared/primitives'

const STAGES = [
  { id: 'requests', label: 'Incoming Requests', point: { x: 8, y: 50 }, detail: 'Simulated request traffic entering the system under test.' },
  { id: 'pool', label: 'Worker Pool', sublabel: 'goroutines', point: { x: 31, y: 50 }, detail: 'A goroutine worker pool injects latency, timeout, error, and flaky failures into request flows on demand.' },
  { id: 'logs', label: 'Structured Logs', sublabel: 'JSON', point: { x: 54, y: 50 }, detail: 'Every request is logged as structured JSON — no free-text logs that need regex archaeology later.' },
  { id: 'analysis', label: 'Log Analysis Engine', sublabel: 'concurrent', point: { x: 77, y: 50 }, detail: 'A separate concurrent engine ingests the structured logs and runs the analysis below.' },
  { id: 'latency', label: 'P95 / P99 Latency', point: { x: 92, y: 22 }, detail: 'Computes latency percentiles per endpoint from the structured logs.' },
  { id: 'rootcause', label: 'Root-Cause Rules', sublabel: '5 rules', point: { x: 92, y: 78 }, detail: 'Runs anomalies through 5 detection rules to turn raw signals into an actionable diagnosis.' },
] as const

const EDGES: [number, number][] = [
  [0, 1], [1, 2], [2, 3], [3, 4], [3, 5],
]

export function FailureInjectionWorkerPoolDiagram() {
  const [selected, setSelected] = useState<(typeof STAGES)[number]['id'] | null>(null)
  const active = STAGES.find((s) => s.id === selected)

  return (
    <div>
      <DiagramCanvas>
        {EDGES.map(([a, b], i) => (
          <DiagramEdge key={i} from={STAGES[a].point} to={STAGES[b].point} />
        ))}
        {STAGES.map((s) => (
          <DiagramNode
            key={s.id}
            point={s.point}
            label={s.label}
            sublabel={'sublabel' in s ? s.sublabel : undefined}
            active={selected === s.id}
            onClick={() => setSelected(selected === s.id ? null : s.id)}
          />
        ))}
        <DiagramCallout point={{ x: 31, y: 90 }}>latency · timeout · error · flaky</DiagramCallout>
        <DiagramCallout point={{ x: 54, y: 12 }}>Docker image: 300MB → 20MB</DiagramCallout>
      </DiagramCanvas>

      <p className="mt-4 min-h-10 text-sm leading-relaxed text-muted-foreground">
        {active ? active.detail : 'Click a stage above to see what it does.'}
      </p>
    </div>
  )
}
