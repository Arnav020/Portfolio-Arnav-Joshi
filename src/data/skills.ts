import { Skill, SkillCategory } from '@/types'

export const skills: Skill[] = [
  // Languages
  { name: 'Python', category: 'languages' },
  { name: 'TypeScript', category: 'languages' },
  { name: 'JavaScript', category: 'languages' },
  { name: 'Go', category: 'languages' },
  { name: 'C++', category: 'languages' },
  { name: 'SQL', category: 'languages' },

  // ML / AI
  { name: 'PyTorch', category: 'ml' },
  { name: 'TensorFlow', category: 'ml' },
  { name: 'Scikit-learn', category: 'ml' },
  { name: 'XGBoost', category: 'ml' },
  { name: 'CNNs', category: 'ml' },
  { name: 'PINNs', category: 'ml' },
  { name: 'Signal Processing', category: 'ml' },
  { name: 'HuggingFace Transformers', category: 'ml' },
  { name: 'Wav2Vec2', category: 'ml' },
  { name: 'LLM APIs', category: 'ml' },
  { name: 'LangChain', category: 'ml' },
  { name: 'RAG', category: 'ml' },
  { name: 'Agentic AI Systems', category: 'ml' },
  { name: 'Stable Diffusion', category: 'ml' },
  { name: 'OpenCV', category: 'ml' },
  { name: 'NLTK', category: 'ml' },

  // Backend
  { name: 'FastAPI', category: 'backend' },
  { name: 'Flask', category: 'backend' },
  { name: 'Node.js', category: 'backend' },
  { name: 'REST APIs', category: 'backend' },
  { name: 'Server-Sent Events', category: 'backend' },
  { name: 'Goroutines & Worker Pools', category: 'backend' },
  { name: 'PostgreSQL', category: 'backend' },
  { name: 'MongoDB', category: 'backend' },
  { name: 'MySQL', category: 'backend' },
  { name: 'Supabase (Realtime)', category: 'backend' },
  { name: 'Firebase', category: 'backend' },

  // Frontend
  { name: 'React', category: 'frontend' },
  { name: 'Next.js', category: 'frontend' },
  { name: 'Tailwind CSS', category: 'frontend' },
  { name: 'Optimistic UI', category: 'frontend' },

  // Data
  { name: 'Pandas', category: 'data' },
  { name: 'NumPy', category: 'data' },
  { name: 'Matplotlib', category: 'data' },
  { name: 'Seaborn', category: 'data' },

  // DevOps / MLOps
  { name: 'Docker', category: 'devops' },
  { name: 'Docker Compose', category: 'devops' },
  { name: 'Kubernetes', category: 'devops' },
  { name: 'AWS EC2', category: 'devops' },
  { name: 'MLflow', category: 'devops' },
  { name: 'DVC', category: 'devops' },
  { name: 'GitHub Actions', category: 'devops' },
  { name: 'Git', category: 'devops' },
]

export const skillsByCategory: Record<SkillCategory, Skill[]> = {
  languages: skills.filter((s) => s.category === 'languages'),
  ml: skills.filter((s) => s.category === 'ml'),
  backend: skills.filter((s) => s.category === 'backend'),
  frontend: skills.filter((s) => s.category === 'frontend'),
  data: skills.filter((s) => s.category === 'data'),
  devops: skills.filter((s) => s.category === 'devops'),
}

export const skillCategoryMeta: Record<SkillCategory, { label: string }> = {
  languages: { label: 'Languages' },
  ml: { label: 'ML / AI' },
  backend: { label: 'Backend' },
  frontend: { label: 'Frontend' },
  data: { label: 'Data' },
  devops: { label: 'DevOps & MLOps' },
}
