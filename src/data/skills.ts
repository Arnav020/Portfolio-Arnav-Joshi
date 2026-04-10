import { Skill } from '@/types'

export const skills: Skill[] = [
  // Languages
  { name: 'Python', level: 95, category: 'languages' },
  { name: 'TypeScript', level: 82, category: 'languages' },
  { name: 'Go (Golang)', level: 75, category: 'languages' },
  { name: 'C++', level: 78, category: 'languages' },
  { name: 'JavaScript', level: 85, category: 'languages' },
  { name: 'SQL', level: 80, category: 'languages' },

  // ML / AI
  { name: 'PyTorch', level: 90, category: 'ml' },
  { name: 'TensorFlow', level: 82, category: 'ml' },
  { name: 'Scikit-learn', level: 92, category: 'ml' },
  { name: 'XGBoost', level: 88, category: 'ml' },
  { name: 'HuggingFace Transformers', level: 85, category: 'ml' },
  { name: 'OpenCV', level: 80, category: 'ml' },
  { name: 'NLTK', level: 78, category: 'ml' },
  { name: 'LLM APIs', level: 88, category: 'ml' },

  // Backend
  { name: 'FastAPI', level: 90, category: 'backend' },
  { name: 'Flask', level: 85, category: 'backend' },
  { name: 'Node.js', level: 80, category: 'backend' },
  { name: 'REST APIs', level: 92, category: 'backend' },
  { name: 'MongoDB', level: 82, category: 'backend' },
  { name: 'MySQL', level: 80, category: 'backend' },
  { name: 'Firebase', level: 72, category: 'backend' },
  { name: 'Supabase', level: 78, category: 'backend' },

  // Frontend
  { name: 'React', level: 85, category: 'frontend' },
  { name: 'Next.js', level: 83, category: 'frontend' },
  { name: 'Tailwind CSS', level: 88, category: 'frontend' },

  // DevOps / MLOps
  { name: 'Docker', level: 85, category: 'devops' },
  { name: 'AWS EC2', level: 75, category: 'devops' },
  { name: 'MLflow', level: 82, category: 'devops' },
  { name: 'DVC', level: 80, category: 'devops' },
  { name: 'GitHub Actions', level: 78, category: 'devops' },
  { name: 'Git', level: 92, category: 'devops' },
]

export const skillsByCategory = {
  languages: skills.filter((s) => s.category === 'languages'),
  ml: skills.filter((s) => s.category === 'ml'),
  backend: skills.filter((s) => s.category === 'backend'),
  frontend: skills.filter((s) => s.category === 'frontend'),
  devops: skills.filter((s) => s.category === 'devops'),
}

export const skillCategoryMeta = {
  languages: { label: 'Languages', color: '#6366f1' },
  ml: { label: 'ML / AI', color: '#8b5cf6' },
  backend: { label: 'Backend', color: '#10b981' },
  frontend: { label: 'Frontend', color: '#06b6d4' },
  devops: { label: 'DevOps & MLOps', color: '#f59e0b' },
}
