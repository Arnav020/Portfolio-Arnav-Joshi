import { ImageResponse } from 'next/og'
import { projects } from '@/data/projects'

export const alt = 'Arnav Joshi — Project'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const project = projects.find((p) => p.slug === slug)

  return new ImageResponse(
    (
      <div
        style={{
          background: '#f5f5dc',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '80px',
          fontFamily: 'sans-serif',
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: '-10%',
            right: '-10%',
            width: '700px',
            height: '400px',
            borderRadius: '50%',
            background: 'radial-gradient(ellipse, rgba(212,126,48,0.16) 0%, transparent 70%)',
          }}
        />

        <div style={{ display: 'flex', fontSize: 22, color: '#a35c1f', marginBottom: 24, position: 'relative' }}>
          Arnav Joshi · Project
        </div>

        <div
          style={{
            display: 'flex',
            fontSize: 64,
            fontWeight: 700,
            color: '#6d3b07',
            letterSpacing: '-1px',
            lineHeight: 1.1,
            maxWidth: '900px',
            position: 'relative',
          }}
        >
          {project?.title ?? 'Project'}
        </div>

        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 10,
            marginTop: 36,
            position: 'relative',
          }}
        >
          {(project?.techStack ?? []).slice(0, 5).map((t) => (
            <div
              key={t}
              style={{
                padding: '7px 18px',
                borderRadius: 999,
                border: '1px solid rgba(111,78,55,0.25)',
                background: 'rgba(111,78,55,0.06)',
                color: '#6f4e37',
                fontSize: 18,
              }}
            >
              {t}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size }
  )
}
