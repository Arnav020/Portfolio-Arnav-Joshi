import { NextResponse } from 'next/server'
import { getAllRepos } from '@/lib/github'

export const revalidate = 86400 // 24 hours

export async function GET() {
  try {
    const repos = await getAllRepos()

    const simplified = repos.map((repo) => ({
      name: repo.name,
      stars: repo.stargazers_count,
      forks: repo.forks_count,
      language: repo.language,
      updatedAt: repo.updated_at,
    }))

    return NextResponse.json(simplified, {
      headers: {
        'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=3600',
      },
    })
  } catch {
    return NextResponse.json({ error: 'Failed to fetch repos' }, { status: 500 })
  }
}
