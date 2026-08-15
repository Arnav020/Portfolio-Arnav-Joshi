/**
 * Skills are rendered as grouped tag pills, not percentage bars — there is no
 * honest proficiency number to put on a bar, so the JSON-ish grouping carries
 * the structure instead.
 */
export interface SkillGroup {
  key: string
  label: string
  /** Maps to a theme accent slot so each group reads as its own colour. */
  tone: 'accent' | 'green' | 'blue' | 'pink' | 'yellow' | 'purple'
  items: string[]
}

export const skillGroups: SkillGroup[] = [
  {
    key: 'languages',
    label: 'Languages',
    tone: 'accent',
    items: ['Python', 'TypeScript', 'JavaScript', 'Go', 'C++', 'SQL'],
  },
  {
    key: 'ai',
    label: 'Generative AI & LLM Systems',
    tone: 'purple',
    items: [
      'LLM APIs',
      'RAG',
      'LangChain',
      'Agentic AI Systems',
      'HuggingFace Transformers',
      'Stable Diffusion',
      'NLTK',
    ],
  },
  {
    key: 'ml',
    label: 'ML · Deep Learning · Research',
    tone: 'green',
    items: [
      'PyTorch',
      'TensorFlow',
      'Scikit-learn',
      'XGBoost',
      'CNNs',
      'PINNs',
      'Wav2Vec2',
      'Signal Processing',
      'OpenCV',
    ],
  },
  {
    key: 'backend',
    label: 'Backend & APIs',
    tone: 'blue',
    items: [
      'FastAPI',
      'Flask',
      'Node.js',
      'REST APIs',
      'Server-Sent Events',
      'Goroutines & Worker Pools',
      'PostgreSQL',
      'MongoDB',
      'MySQL',
      'Supabase (Realtime)',
      'Firebase',
    ],
  },
  {
    key: 'frontend',
    label: 'Frontend',
    tone: 'pink',
    items: ['React', 'Next.js', 'Tailwind CSS', 'Optimistic UI'],
  },
  {
    key: 'data',
    label: 'Data & Analysis',
    tone: 'yellow',
    items: ['Pandas', 'NumPy', 'Matplotlib', 'Seaborn'],
  },
  {
    key: 'devops',
    label: 'DevOps & MLOps',
    tone: 'accent',
    items: [
      'Docker',
      'Docker Compose',
      'Kubernetes',
      'AWS EC2',
      'MLflow',
      'DVC',
      'GitHub Actions',
      'Git',
    ],
  },
]

export interface Achievement {
  emoji: string
  title: string
  description: string
  year: string
}

export const achievements: Achievement[] = [
  {
    emoji: '🏆',
    title: 'Top 1500 Global — Google Big Code Competition',
    description:
      'Top 1500 global ranking in an international competitive-programming and code-quality challenge.',
    year: '2025',
  },
  {
    emoji: '🚀',
    title: 'National Semi-Finalist — Flipkart GRiD 8.0',
    description:
      'Selected as a National Semi-Finalist in Flipkart’s nationwide engineering and problem-solving competition.',
    year: '2025',
  },
  {
    emoji: '⭐',
    title: 'Merit Scholarship × 3',
    description:
      'Awarded a Merit Scholarship three years running at Thapar Institute for ranking among the top students in Computer Science.',
    year: '2023–2026',
  },
  {
    emoji: '📜',
    title: 'ML Specialization — Stanford & DeepLearning.AI',
    description:
      'Completed the Machine Learning Specialization taught by Andrew Ng: supervised learning, unsupervised learning, and practical best practices.',
    year: '2024',
  },
  {
    emoji: '🛰️',
    title: 'Aditya-L1 Space Research',
    description:
      'Physics-informed ML system detecting Halo CMEs from real solar-wind plasma data — 85% accuracy with zero false negatives.',
    year: '2024',
  },
]
