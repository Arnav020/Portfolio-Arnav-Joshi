'use client'

import { useState } from 'react'
import { DiagramCanvas, DiagramCallout, DiagramEdge, DiagramNode } from './shared/primitives'

const STAGES = [
  { id: 'research', label: 'Research', point: { x: 12, y: 25 }, detail: 'Gathers company and contact data from public sources to build a research profile before any scoring happens.' },
  { id: 'scoring', label: 'Scoring', point: { x: 37, y: 25 }, detail: 'An LLM scores the lead, but the raw score is calibrated against the evidence gathered — capped by up to 54 points when evidence is thin.' },
  { id: 'contact', label: 'Contact-Finding', point: { x: 62, y: 25 }, detail: 'Identifies the right point of contact at a qualifying company.' },
  { id: 'verification', label: 'Verification', point: { x: 87, y: 25 }, detail: 'Verifies the contact is reachable — free DNS/MX checks and caching handle most cases before any paid API call.' },
  { id: 'outreach', label: 'Outreach', point: { x: 87, y: 75 }, detail: 'Drafts and sends the first message via a 3-provider LLM failover chain (Gemini/Groq/OpenRouter) with automatic rerouting on rate limits.' },
  { id: 'followup', label: 'Follow-up', point: { x: 62, y: 75 }, detail: 'Schedules and sends follow-up messages based on prior engagement.' },
  { id: 'scheduling', label: 'Scheduling', point: { x: 37, y: 75 }, detail: 'Coordinates meeting scheduling once a lead responds positively.' },
  { id: 'reply', label: 'Reply Classification', point: { x: 12, y: 75 }, detail: 'A 6-class intent classifier gates auto-replies behind a 70% confidence threshold — anything less goes to a human.' },
] as const

const EDGES: [number, number][] = [
  [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7],
]

export function SynthSalesPipelineDiagram() {
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
            active={selected === s.id}
            onClick={() => setSelected(selected === s.id ? null : s.id)}
          />
        ))}
        <DiagramCallout point={{ x: 37, y: 6 }}>hard-caps score by up to 54 pts</DiagramCallout>
        <DiagramCallout point={{ x: 87, y: 94 }}>3-provider LLM failover</DiagramCallout>
        <DiagramCallout point={{ x: 12, y: 94 }}>70% confidence gate</DiagramCallout>
      </DiagramCanvas>

      <p className="mt-4 min-h-10 text-sm leading-relaxed text-muted-foreground">
        {active ? active.detail : 'Click a stage above to see what it does.'}
      </p>
    </div>
  )
}
