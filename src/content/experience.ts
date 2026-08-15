export interface Role {
  company: string
  role: string
  period: string
  /** Drives the filled/outline timeline marker. */
  current: boolean
  description: string[]
  techStack: string[]
}

export const experiences: Role[] = [
  {
    company: 'Samsung R&D Institute, Bengaluru',
    role: 'Research Intern — Cloud AI/ML',
    period: 'Jul 2026 – Dec 2026',
    current: true,
    description: [
      'Building a Retrieval-Augmented Generation pipeline for an AI-powered cloud-operations and Kubernetes assistant, enriching natural-language queries with application-specific context.',
      'Designing an agentic decision layer that lets operators accept or reject AI-recommended Kubernetes actions, orchestrating multiple LLM backends into one troubleshooting interface.',
    ],
    techStack: ['RAG', 'Kubernetes', 'LLM APIs', 'Python', 'Agentic AI'],
  },
  {
    company: 'IIT Delhi — FE²B Lab',
    role: 'AI/ML Intern',
    period: 'May 2026 – Jul 2026',
    current: false,
    description: [
      'Designed a feature-engineering and unsupervised clustering pipeline to classify bubble-acoustic flow regimes from 90 real hydrophone recordings, achieving 95.56% cross-validated accuracy.',
      'Engineered an AI-based signal classification and adaptive wavelet denoising pipeline to extract low-amplitude acoustic signals from strong background noise, improving downstream classification SNR.',
      'Built a physics-informed (PINN-inspired) regression model fusing PIV velocity fields with force-balance priors to predict dipole acoustic pressure and full 360° directivity, plus MATLAB/Python modal decomposition (SPOD/POD/DMD) across 6 experimental configurations — validated against 110 real experimental frames.',
    ],
    techStack: ['PINNs', 'Signal Processing', 'MATLAB', 'Python', 'Feature Engineering'],
  },
  {
    company: 'Aigetai Pvt. Ltd.',
    role: 'AI Developer Intern',
    period: 'Jul 2025 – Oct 2025',
    current: false,
    description: [
      'Developed an NLP-based comment enhancement system for a social media platform using transformer models, NLTK pipelines, and LLM APIs to improve comment quality and engagement.',
      'Collaborated on generative AI workflows exploring text-to-video generation for social content using diffusion-based models and Stable Diffusion techniques.',
      'Built backend services and data-processing pipelines in Python, integrating ML services with REST APIs for production-ready AI features.',
    ],
    techStack: ['Python', 'Transformers', 'NLTK', 'LLM APIs', 'Stable Diffusion', 'FastAPI'],
  },
]

export interface Education {
  emoji: string
  institution: string
  degree: string
  period: string
  score: string
  highlights: string[]
}

export const education: Education[] = [
  {
    emoji: '🎓',
    institution: 'Thapar Institute of Engineering and Technology',
    degree: 'B.Tech, Computer Science Engineering',
    period: 'Aug 2023 – Jul 2027',
    score: 'CGPA 9.57 / 10',
    highlights: [
      'Merit Scholarship recipient for three consecutive years',
      'Ranked among the top students in the CS program',
    ],
  },
  {
    emoji: '🏫',
    institution: 'Ryan International School, Ludhiana',
    degree: 'Class 12 — Senior Secondary',
    period: 'Jul 2023',
    score: '96.7%',
    highlights: [],
  },
]
