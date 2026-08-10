interface GitHubRepo {
  name: string
  stargazers_count: number
  forks_count: number
  language: string
  updated_at: string
  description: string
  html_url: string
}

const GITHUB_USERNAME = 'Arnav020'

// Fetch stats for a single repo — cached for 24 hours via Next.js ISR
export async function getRepoStats(repoName: string): Promise<{
  stars: number
  forks: number
  language: string
  updatedAt: string
} | null> {
  try {
    const res = await fetch(
      `https://api.github.com/repos/${GITHUB_USERNAME}/${repoName}`,
      {
        headers: {
          Accept: 'application/vnd.github.v3+json',
          // Add GITHUB_TOKEN env var in Vercel to avoid rate limits
          ...(process.env.GITHUB_TOKEN && {
            Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
          }),
        },
        next: { revalidate: 86400 }, // Cache 24 hours
      }
    )

    if (!res.ok) return null

    const data: GitHubRepo = await res.json()
    return {
      stars: data.stargazers_count,
      forks: data.forks_count,
      language: data.language,
      updatedAt: data.updated_at,
    }
  } catch {
    return null
  }
}

// Fetch all public repos for the user
export async function getAllRepos(): Promise<GitHubRepo[]> {
  try {
    const res = await fetch(
      `https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=100&sort=updated`,
      {
        headers: {
          Accept: 'application/vnd.github.v3+json',
          ...(process.env.GITHUB_TOKEN && {
            Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
          }),
        },
        next: { revalidate: 86400 },
      }
    )

    if (!res.ok) return []
    return res.json()
  } catch {
    return []
  }
}

// Map GitHub repo names to project slugs — kept in sync with src/data/projects.ts
export const repoSlugMap: Record<string, string> = {
  'Agentic-AI-Sales-CRM': 'agentic-ai-sales-crm',
  'Failure-Injection-Observability-Engine': 'failure-injection-observability-engine',
  'Halo-CME-Detection': 'halo-cme-detection',
  'Speech-Emotion-Recognition-App': 'speech-emotion-recognition',
  'Linear-Clone': 'linear-clone',
  'MLOps-Vehicle-Insurance-Domain': 'mlops-vehicle-insurance',
}

export function repoNameForSlug(slug: string): string | undefined {
  return Object.entries(repoSlugMap).find(([, s]) => s === slug)?.[0]
}
