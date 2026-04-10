export interface Project {
  slug: string
  title: string
  description: string
  longDescription?: string
  techStack: string[]
  category: 'ml' | 'backend' | 'fullstack' | 'mlops' | 'other'
  githubUrl: string
  demoUrl?: string
  highlights: string[]
  featured: boolean
  stars?: number
  language?: string
}

export interface Skill {
  name: string
  level: number        // 0–100
  category: 'ml' | 'backend' | 'frontend' | 'devops' | 'languages'
  icon?: string
}

export interface Experience {
  company: string
  role: string
  period: string
  description: string[]
  techStack: string[]
  type: 'internship' | 'part-time' | 'full-time'
}

export interface Achievement {
  title: string
  description: string
  year?: string
  icon?: string
}

export interface Education {
  institution: string
  degree: string
  period: string
  score: string
  highlights: string[]
}

export interface Stat {
  label: string
  value: string
  suffix: string
}

export interface GitHubRepoStats {
  name: string
  stars: number
  forks: number
  language: string
  updatedAt: string
}

export type ProjectCategory = 'all' | 'ml' | 'backend' | 'fullstack' | 'mlops' | 'other'
export type SkillCategory = 'languages' | 'ml' | 'backend' | 'frontend' | 'devops'
