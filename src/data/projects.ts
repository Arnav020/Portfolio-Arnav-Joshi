import { Project, ProjectCategory } from '@/types'

export const projects: Project[] = [
  {
    slug: 'agentic-ai-sales-crm',
    title: 'SynthSales — Agentic AI Sales CRM',
    description:
      'An 8-agent LLM pipeline that researches, scores, and reaches out to leads automatically — with a confidence layer that refuses to trust weak evidence.',
    longDescription:
      'SynthSales automates the parts of outbound sales that eat an SDR\'s week: researching a company, deciding if it\'s worth pursuing, finding the right contact, verifying they\'re reachable, and writing the first message. Eight specialised agents hand off work through status-driven transitions, running four-way concurrent to keep throughput high without losing the ability to roll back a bad run from a snapshot.',
    techStack: ['Python', 'FastAPI', 'Next.js', 'PostgreSQL', 'TypeScript', 'LLM APIs'],
    category: 'fullstack',
    githubUrl: 'https://github.com/Arnav020/Agentic-AI-Sales-CRM',
    demoUrl: undefined,
    image: '/synthsales/landing_page.png',
    highlights: [
      'Architected an 8-agent pipeline — research, scoring, contact-finding, verification, outreach, follow-up, scheduling, reply classification',
      'Confidence-calibrated ranking layer hard-caps AI-driven scores by up to 54 points when evidence is weak',
      '3-provider LLM failover chain (Gemini/Groq/OpenRouter) with automatic rate-limit rerouting and self-correcting structured generation',
      '6-class intent classifier gates auto-replies behind a 70% confidence threshold',
    ],
    timeframe: '2025',
    problem: {
      heading: 'The problem',
      body: [
        'Outbound sales research is repetitive and easy to automate badly: an LLM will confidently score a lead as "hot" off a thin LinkedIn snippet, and a single flaky API call can stall an entire pipeline for hours.',
        'The goal was an agentic system that moves fast without inheriting the two classic failure modes of "just wrap it in a prompt" AI products — overconfident output, and no resilience when a provider goes down.',
      ],
    },
    approach: {
      heading: 'Approach',
      body: [
        'Split the pipeline into eight single-purpose agents (research, scoring, contact-finding, verification, outreach, follow-up, scheduling, reply classification) connected by explicit status transitions rather than one monolithic prompt chain, so each stage can be retried, inspected, or re-run independently.',
        'Ran four-way concurrent workers against the pipeline with snapshot-based rollback, so a bad batch can be rewound and re-run without re-processing leads that already succeeded.',
      ],
    },
    decisions: [
      {
        heading: 'Refusing to trust the model\'s own confidence',
        body: [
          'The scoring agent\'s raw LLM output is passed through a calibration layer that cross-checks it against the actual evidence gathered — when the evidence is thin, it hard-caps the score by up to 54 points rather than letting the model\'s stated confidence stand unchecked. Auto-replies only go out once a 6-class intent classifier clears a 70% confidence threshold; anything below that gets queued for a human.',
        ],
      },
      {
        heading: 'Failing over instead of failing',
        body: [
          'LLM calls run behind a 3-provider failover chain (Gemini, Groq, OpenRouter) with automatic rerouting on rate limits, and the search backend sits behind its own circuit breaker. Email verification skips paid API calls where possible — free DNS/MX checks and caching handle the common case, so the expensive path only runs when it has to.',
        ],
      },
    ],
    outcome: {
      heading: 'Outcome',
      body: [
        'A pipeline that converts unstructured company data into ranked, verified, outreach-ready leads with live SSE log streaming for monitoring a campaign as it runs — and that keeps working when any single LLM or search provider has a bad day.',
      ],
    },
    metrics: [
      { label: 'Agents orchestrated', value: '8' },
      { label: 'LLM providers with failover', value: '3' },
      { label: 'Score cap on weak evidence', value: 'up to 54 pts' },
      { label: 'Reply confidence gate', value: '70%' },
    ],
    diagram: 'synthsales-pipeline',
  },
  {
    slug: 'failure-injection-observability-engine',
    title: 'Failure Injection & Observability Engine',
    description:
      'A Go backend that deliberately breaks services on purpose — latency, timeouts, errors, flakiness — so their observability can be proven before production does it for you.',
    longDescription:
      'Chaos engineering in miniature: a fault-injection backend that simulates real-world failure modes behind goroutine worker pools, paired with a concurrent log-analysis engine that computes P95/P99 latency and maps anomalies to root causes automatically.',
    techStack: ['Go', 'Goroutines', 'Docker', 'Distributed Systems', 'JSON Logging'],
    category: 'backend',
    githubUrl: 'https://github.com/Arnav020/Failure-Injection-Observability-Engine',
    image: '/failure-debugger/failure_debugger_terminal.png',
    highlights: [
      'Simulates latency, timeout, error, and flaky failure modes via goroutine worker pools with structured JSON logging',
      'Concurrent log-analysis engine computing P95/P99 latency and diagnosing root causes across 5 detection rules',
      'Shrank the deployment image from 300MB to 20MB (93% reduction) via multi-stage Docker builds',
    ],
    timeframe: '2025',
    problem: {
      heading: 'The problem',
      body: [
        'Most teams discover their logging is inadequate the first time something actually breaks in production. This project inverts that: build the failures on purpose, in a controlled system, and use them to stress-test observability before it matters.',
      ],
    },
    approach: {
      heading: 'Approach',
      body: [
        'Built a Go backend that injects latency spikes, timeouts, hard errors, and flaky (intermittent) failures into request flows via goroutine worker pools, with every request logged as structured JSON — no free-text logs that need regex archaeology later.',
        'On top of that, a separate concurrent log-analysis engine ingests the structured logs, computes P95/P99 latency percentiles per endpoint, and runs the results through 5 root-cause detection rules to turn raw anomalies into an actionable diagnosis.',
      ],
    },
    decisions: [
      {
        heading: 'Concurrency for both the chaos and the analysis',
        body: [
          'Both halves of the system — failure injection and log analysis — are built around goroutine worker pools rather than sequential processing, so the tool can generate and analyze load at a realistic scale instead of a toy single-threaded simulation.',
        ],
      },
      {
        heading: 'Multi-stage Docker builds',
        body: [
          'The initial deployment image was a straightforward single-stage build at ~300MB. Restructuring it into a multi-stage build — compiling in one stage, copying only the static binary into a minimal final image — cut that to 20MB, a 93% reduction, with no change in runtime behavior.',
        ],
      },
    ],
    outcome: {
      heading: 'Outcome',
      body: [
        'A reusable harness for proving an observability stack actually surfaces the failure modes it claims to catch, running in a container an order of magnitude smaller than the naive build.',
      ],
    },
    metrics: [
      { label: 'Failure modes simulated', value: '4' },
      { label: 'Root-cause detection rules', value: '5' },
      { label: 'Docker image size cut', value: '93%' },
      { label: 'Latency metrics computed', value: 'P95 / P99' },
    ],
    diagram: 'failure-injection-pool',
  },
  {
    slug: 'halo-cme-detection',
    title: 'Physics-Informed Halo CME Detection System',
    description:
      'A physics-informed ML pipeline that detects Halo Coronal Mass Ejections from real Aditya-L1 solar-wind plasma data, with zero missed events on its labeled test set.',
    longDescription:
      'Developed a physics-informed ML pipeline to detect Halo CMEs using SWIS instrument data from ISRO\'s Aditya-L1 spacecraft. A soft-voting ensemble trained on domain-engineered features reaches 85% accuracy with zero false negatives — the metric that matters most when the cost of missing a real event is high.',
    techStack: ['Python', 'Scikit-learn', 'XGBoost', 'CDF Ingestion', 'Feature Engineering'],
    category: 'ml',
    githubUrl: 'https://github.com/Arnav020/Halo-CME-Detection',
    demoUrl: undefined,
    image: '/halo-cme/cme_landing.png',
    highlights: [
      'Derived 4 domain-specific features from 8 candidates via class-separability screening on real solar-wind plasma data',
      'Soft-voting ensemble (Random Forest + XGBoost + Logistic Regression) trained on 43 labeled event windows',
      '85% accuracy with zero false negatives — no missed CME events on the labeled set',
      'Deployed as a public Streamlit app; end-to-end CDF ingestion and event-windowing pipeline',
    ],
    timeframe: '2024',
    problem: {
      heading: 'The problem',
      body: [
        'Halo Coronal Mass Ejections are Earth-directed solar eruptions that can disrupt satellites and power grids. Detecting them from raw solar-wind plasma instrument data is a small-data, high-stakes classification problem — missing a real event (a false negative) is far more costly than a false alarm.',
      ],
    },
    approach: {
      heading: 'Approach',
      body: [
        'Built an ingestion pipeline reading CDF (Common Data Format) files from Aditya-L1\'s SWIS instrument and windowing the continuous plasma stream into discrete candidate events.',
        'Screened 8 candidate features derived from the physics of CME plasma signatures down to the 4 most class-separable, rather than throwing every possible feature at the model — a physics-informed feature set trained on 43 labeled event windows.',
      ],
    },
    decisions: [
      {
        heading: 'Optimizing for recall, not just accuracy',
        body: [
          'A soft-voting ensemble of Random Forest, XGBoost, and Logistic Regression was chosen specifically because it let the decision threshold be tuned toward zero false negatives — in this domain, a missed CME is a worse outcome than a false alarm that a human reviews and dismisses. The ensemble reaches 85% overall accuracy while catching every labeled CME event.',
        ],
      },
    ],
    outcome: {
      heading: 'Outcome',
      body: [
        'A working detector deployed as a public Streamlit app, with zero missed events on its labeled test set — evidence that a carefully engineered small feature set can outperform throwing more data or a bigger model at a physics-constrained problem.',
      ],
    },
    metrics: [
      { label: 'Accuracy', value: '85%' },
      { label: 'False negatives', value: '0' },
      { label: 'Features engineered', value: '4 from 8' },
      { label: 'Labeled event windows', value: '43' },
    ],
  },
  {
    slug: 'speech-emotion-recognition',
    title: 'Speech Emotion Recognition App',
    description:
      'A deep learning speech emotion classifier fusing Wav2Vec2 embeddings with handcrafted acoustic features, reaching 89.1% accuracy in an interactive Streamlit app.',
    longDescription:
      'Built a deep learning speech emotion recognition system using Wav2Vec2 embeddings and handcrafted acoustic features. Trained on three benchmark datasets with data augmentation, and shipped as an interactive inference app.',
    techStack: ['PyTorch', 'Wav2Vec2', 'Streamlit', 'HuggingFace', 'Audio Processing'],
    category: 'ml',
    githubUrl: 'https://github.com/Arnav020/Speech-Emotion-Recognition-App',
    image: '/ser/SER.png',
    highlights: [
      '89.1% classification accuracy across emotion categories',
      'Wav2Vec2 embeddings fused with handcrafted acoustic features',
      'Trained on 3 benchmark speech datasets with data augmentation',
      'Interactive Streamlit inference app for live audio classification',
    ],
    timeframe: '2024',
    problem: {
      heading: 'The problem',
      body: [
        'Speech emotion recognition needs to capture both the fine-grained acoustic patterns a pretrained speech model learns and the explicit prosodic cues (pitch, energy, rhythm) that classical audio features encode directly — using only one or the other tends to underperform.',
      ],
    },
    approach: {
      heading: 'Approach',
      body: [
        'Fused Wav2Vec2 embeddings — a self-supervised speech representation — with handcrafted acoustic features into a single classifier, and trained across three benchmark emotion-speech datasets with data augmentation to improve generalization across speakers and recording conditions.',
      ],
    },
    outcome: {
      heading: 'Outcome',
      body: [
        'An 89.1% classification accuracy model shipped as an interactive Streamlit app, where a user can upload or record audio and see the emotion classification run live.',
      ],
    },
    metrics: [
      { label: 'Accuracy', value: '89.1%' },
      { label: 'Benchmark datasets', value: '3' },
    ],
  },
  {
    slug: 'linear-clone',
    title: 'Linear.app Clone — Issue Tracker',
    description: 'High-performance issue tracker replicating Linear.app with Kanban boards, command menu, and real-time Supabase sync.',
    longDescription: 'Built a high-fidelity project-management platform replicating Linear.app, with keyboard-first workflows, command palette navigation, and drag-and-drop Kanban boards supporting real-time multi-user collaboration.',
    techStack: ['Next.js 15', 'TypeScript', 'Supabase', 'Tailwind CSS', 'PostgreSQL'],
    category: 'fullstack',
    githubUrl: 'https://github.com/Arnav020/Linear-Clone',
    image: '/linear-clone/linear_clone.png',
    highlights: [
      'Kanban drag-and-drop with optimistic UI updates',
      'Real-time collaboration via Supabase Realtime + PostgreSQL for live state sync across clients',
      'Keyboard-first command menu navigation',
    ],
    timeframe: '2025',
    problem: {
      heading: 'The problem',
      body: [
        'Project-management tools are a well-worn UI problem, but the details that make Linear specifically feel fast — instant keyboard navigation, drag state that never stutters, edits that appear to happen before the network round-trip finishes — are mostly invisible engineering, not visible features.',
      ],
    },
    approach: {
      heading: 'Approach',
      body: [
        'Built the core issue-tracking data model on Postgres via Supabase, with Supabase Realtime subscriptions syncing state live across every connected client, and layered a command-palette-first interaction model and drag-and-drop Kanban board on top.',
      ],
    },
    decisions: [
      {
        heading: 'Optimistic UI as the default, not an afterthought',
        body: [
          'Every mutation — dragging a card, changing a status, editing a title — updates local state immediately and reconciles with the server response afterward, rather than waiting on a round-trip before showing the change. Under concurrent multi-user edits this cuts perceived update latency to near-zero, which is the difference between a tool that feels instant and one that feels like a web app.',
        ],
      },
    ],
    outcome: {
      heading: 'Outcome',
      body: [
        'A keyboard-first, real-time-synced issue tracker that behaves like a local-first app despite every state change being persisted and broadcast through Postgres.',
      ],
    },
    metrics: [
      { label: 'Perceived update latency', value: '~0' },
      { label: 'Real-time sync', value: 'Supabase Realtime' },
    ],
  },
  {
    slug: 'mlops-vehicle-insurance',
    title: 'MLOps Vehicle Insurance Domain',
    description: 'End-to-end MLOps project in the vehicle insurance domain covering data ingestion, feature engineering, and model deployment.',
    longDescription: 'Industry-style MLOps project covering the full lifecycle: data ingestion, validation, transformation, model training, evaluation, and cloud deployment in the vehicle insurance domain.',
    techStack: ['Python', 'MongoDB', 'MLflow', 'DVC', 'AWS EC2', 'Docker', 'FastAPI'],
    category: 'mlops',
    githubUrl: 'https://github.com/Arnav020/MLOps-Vehicle-Insurance-Domain',
    highlights: [
      'Complete ML lifecycle from ingestion to deployment',
      'MongoDB data pipeline with schema validation',
      'AWS EC2 deployment with Docker containerisation',
    ],
    timeframe: '2024',
    problem: {
      heading: 'The problem',
      body: [
        'Most ML coursework and side-projects stop at a trained model in a notebook. This project was scoped instead to cover what actually gets a model into production in an industry setting: validated data in, a deployed service out.',
      ],
    },
    approach: {
      heading: 'Approach',
      body: [
        'Built the full lifecycle in the vehicle-insurance domain — ingestion from MongoDB with schema validation, transformation, model training and evaluation tracked through MLflow and DVC, and deployment to AWS EC2 behind a FastAPI service, all containerised with Docker.',
      ],
    },
    outcome: {
      heading: 'Outcome',
      body: [
        'A reproducible, versioned pipeline that mirrors how an ML system actually ships in production — not just a model, but the ingestion, validation, and deployment scaffolding around it.',
      ],
    },
  },
]

export const projectsByCategory: Record<ProjectCategory, Project[]> = {
  all: projects,
  ml: projects.filter((p) => p.category === 'ml'),
  backend: projects.filter((p) => p.category === 'backend'),
  fullstack: projects.filter((p) => p.category === 'fullstack'),
  mlops: projects.filter((p) => p.category === 'mlops'),
  other: projects.filter((p) => p.category === 'other'),
}
