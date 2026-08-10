export interface CaseStudySection {
  heading: string
  body: string[]
}

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
  stars?: number
  language?: string
  /** Cover screenshot for the project card. Falls back to an abstract placeholder when absent. */
  image?: string

  // Case-study fields — SynthSales/Failure Injection additionally get a diagram
  // (see `diagram`); the rest of the six get full prose without one.
  timeframe?: string
  problem?: CaseStudySection
  approach?: CaseStudySection
  decisions?: CaseStudySection[]
  outcome?: CaseStudySection
  metrics?: { label: string; value: string }[]
  diagram?: 'synthsales-pipeline' | 'failure-injection-pool'
}

export interface Skill {
  name: string
  category: 'ml' | 'backend' | 'frontend' | 'devops' | 'languages' | 'data'
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
export type SkillCategory = 'languages' | 'ml' | 'backend' | 'frontend' | 'devops' | 'data'
