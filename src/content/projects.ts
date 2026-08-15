/** Maps to a theme colour slot so every card reads as its own accent. */
export type ProjectTone = 'purple' | 'orange' | 'green' | 'blue' | 'pink' | 'yellow'

export interface Project {
  id: string
  emoji: string
  title: string
  /** Rendered as the uppercase "FULL STACK · AGENTIC AI" category line. */
  tags: string[]
  tone: ProjectTone
  /** One line on what it is. The numbers belong in `highlights`. */
  description: string
  /** Exactly two, each carrying a concrete figure — the card is built around a pair. */
  highlights: [string, string]
  techStack: string[]
  githubUrl: string
  demoUrl?: string
}

export const projects: Project[] = [
  {
    id: 'synthsales',
    emoji: '🤖',
    title: 'SynthSales — Agentic AI Sales CRM',
    tags: ['Full Stack', 'Agentic AI', 'LLM Systems'],
    tone: 'purple',
    description:
      'An agentic pipeline that researches, scores and reaches out to sales leads on its own.',
    highlights: [
      '8 single-purpose agents with snapshot rollback; calibration hard-caps weak-evidence scores by up to 54 points',
      '3-provider LLM failover (Gemini / Groq / OpenRouter); auto-replies gated at 70% classifier confidence',
    ],
    techStack: ['Python', 'FastAPI', 'Next.js', 'PostgreSQL', 'TypeScript', 'LLM APIs'],
    githubUrl: 'https://github.com/Arnav020/SynthSales-Agentic-AI-Sales-CRM',
  },
  {
    id: 'failure-injection',
    emoji: '💥',
    title: 'Failure Injection & Observability Engine',
    tags: ['Backend', 'Go', 'Distributed Systems'],
    tone: 'orange',
    description:
      'A Go backend that breaks services on purpose to prove their observability actually works.',
    highlights: [
      '4 failure modes injected through goroutine pools; P95/P99 latency mapped to causes across 5 detection rules',
      'Multi-stage Docker build cut the image 300MB → 20MB, a 93% reduction with no runtime change',
    ],
    techStack: ['Go', 'Goroutines', 'Docker', 'Distributed Systems', 'JSON Logging'],
    githubUrl: 'https://github.com/Arnav020/Failure-Injection-Observability-Engine',
  },
  {
    id: 'sentinel-rag',
    emoji: '🛡️',
    title: 'Sentinel-RAG — Guarded Documentation Assistant',
    tags: ['RAG', 'LangGraph', 'AI Safety'],
    tone: 'green',
    description:
      'Answers engineering questions from an org’s own runbooks — and refuses to do anything else.',
    highlights: [
      '4-layer guardrail cascade: held-out injection detection at P/R/F1 1.000, ~0.3s and ~250 tokens per gate',
      '948-chunk index seeded with 58 decoy docs; hit@5 100%, RAGAS answer relevancy 0.917',
    ],
    techStack: ['LangGraph', 'Qdrant', 'FlashRank', 'NeMo Guardrails', 'FastAPI', 'Groq'],
    githubUrl: 'https://github.com/Arnav020/Sentinel-RAG',
  },
  {
    id: 'halo-cme',
    emoji: '🛰️',
    title: 'Physics-Informed Halo CME Detection',
    tags: ['Machine Learning', 'Space Research', 'Feature Engineering'],
    tone: 'blue',
    description:
      "Detects Earth-directed solar eruptions from ISRO Aditya-L1 SWIS plasma data.",
    highlights: [
      '85% accuracy with zero false negatives — no missed events on the labelled set',
      '4 physics-derived features screened from 8 by class separability over 43 labelled event windows',
    ],
    techStack: ['Python', 'Scikit-learn', 'XGBoost', 'CDF Ingestion', 'Streamlit'],
    githubUrl: 'https://github.com/Arnav020/Halo-CME-Detection',
  },
  {
    id: 'speech-emotion',
    emoji: '🎙️',
    title: 'Speech Emotion Recognition App',
    tags: ['Deep Learning', 'Audio', 'HuggingFace'],
    tone: 'pink',
    description: 'Classifies emotion from speech in a live inference app.',
    highlights: [
      '89.1% accuracy fusing Wav2Vec2 embeddings with handcrafted prosodic features',
      'Trained across 3 benchmark datasets with augmentation for speaker and recording generalisation',
    ],
    techStack: ['PyTorch', 'Wav2Vec2', 'HuggingFace', 'Streamlit', 'Audio Processing'],
    githubUrl: 'https://github.com/Arnav020/Speech-Emotion-Recognition-App',
  },
  {
    id: 'linear-clone',
    emoji: '📋',
    title: 'Linear.app Clone — Issue Tracker',
    tags: ['Full Stack', 'Realtime', 'Product Engineering'],
    tone: 'yellow',
    description: 'A keyboard-first issue tracker that behaves like a local app.',
    highlights: [
      'Optimistic writes on every mutation cut perceived update latency to ~0 under concurrent edits',
      'Real-time multi-user sync over Supabase Realtime on PostgreSQL, with drag-and-drop Kanban',
    ],
    techStack: ['Next.js', 'TypeScript', 'Supabase', 'PostgreSQL', 'Tailwind CSS'],
    githubUrl: 'https://github.com/Arnav020/Linear-Clone',
  },
]
