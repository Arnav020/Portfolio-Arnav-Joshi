export interface Pillar {
  title: string
  body: string
  href: string
  linkLabel: string
  stat: { label: string; value: string }
}

export const pillars: Pillar[] = [
  {
    title: 'Agentic AI & LLM Systems',
    body: 'Multi-agent pipelines that don’t just wrap a prompt and hope. SynthSales splits outbound sales into eight single-purpose agents with explicit status transitions, a confidence-calibration layer that refuses to trust weak evidence, and a 3-provider LLM failover chain so one API outage doesn’t take down the whole run.',
    href: '/work/agentic-ai-sales-crm',
    linkLabel: 'See it in SynthSales',
    stat: { label: 'Agents orchestrated', value: '8' },
  },
  {
    title: 'Physics-Informed & Production ML',
    body: 'Models built from an understanding of the system, not just the dataset. The Halo CME detector derives its features from the actual physics of solar-wind plasma signatures — reaching zero missed events on its labeled set precisely because the feature set was engineered, not thrown at a bigger model.',
    href: '/work/halo-cme-detection',
    linkLabel: 'See it in the Halo CME Detection System',
    stat: { label: 'False negatives', value: '0' },
  },
  {
    title: 'Full-Stack & Infrastructure',
    body: 'The parts underneath the product that nobody sees until they break: real-time sync that actually feels instant, concurrency that doesn’t fall over under load, deployments that ship in a container an order of magnitude smaller than the naive build.',
    href: '/work/linear-clone',
    linkLabel: 'See it in the Linear.app Clone',
    stat: { label: 'Perceived update latency', value: '~0' },
  },
]
