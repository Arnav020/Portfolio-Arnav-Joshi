import { Experience } from '@/types'

export const experiences: Experience[] = [
  {
    company: 'Samsung R&D Institute, Bengaluru',
    role: 'Research Intern — Cloud AI/ML',
    period: 'July 2026 – December 2026',
    description: [
      'Building a Retrieval-Augmented Generation (RAG) pipeline for an AI-powered cloud-operations and Kubernetes assistant, enriching natural-language queries with application-specific context.',
      'Designing an agentic decision layer that lets operators accept or reject AI-recommended Kubernetes actions, orchestrating multiple LLM backends into one troubleshooting interface.',
    ],
    techStack: ['RAG', 'Kubernetes', 'LLM APIs', 'Python', 'Agentic AI'],
    type: 'internship',
  },
  {
    company: 'IIT Delhi — FE²B Lab',
    role: 'AI/ML Intern',
    period: 'May 2026 – July 2026',
    description: [
      'Designed a feature-engineering and unsupervised clustering pipeline to classify bubble-acoustic flow regimes from 90 real hydrophone recordings, achieving 95.56% cross-validated accuracy.',
      'Engineered an AI-based signal classification and adaptive wavelet denoising pipeline to extract low-amplitude acoustic signals from strong background noise, improving downstream classification SNR.',
      'Built a physics-informed neural network (PINN-inspired) regression model fusing PIV velocity fields with force-balance priors to predict dipole acoustic pressure and full 360° directivity, plus MATLAB/Python modal decomposition (SPOD/POD/DMD) across 6 experimental configurations — validated against 110 real experimental frames.',
    ],
    techStack: ['PINNs', 'Signal Processing', 'MATLAB', 'Python', 'Feature Engineering'],
    type: 'internship',
  },
  {
    company: 'Aigetai Pvt. Ltd.',
    role: 'AI Developer Intern',
    period: 'July 2025 – October 2025',
    description: [
      'Developed an NLP-based comment enhancement system for a social media platform using transformer models, NLTK pipelines, and LLM APIs to improve comment quality and engagement.',
      'Collaborated on generative AI workflows exploring text-to-video generation for social media content using diffusion-based models and Stable Diffusion techniques.',
      'Built backend services and data-processing pipelines in Python, integrating ML services with REST APIs for production-ready AI features.',
    ],
    techStack: ['Python', 'Transformers', 'NLTK', 'LLM APIs', 'Stable Diffusion', 'FastAPI'],
    type: 'internship',
  },
]
