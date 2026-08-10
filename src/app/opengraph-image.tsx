import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Arnav Joshi — ML Engineer & Full Stack Developer'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#f5f5dc',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'sans-serif',
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: '-15%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '900px',
            height: '400px',
            borderRadius: '50%',
            background: 'radial-gradient(ellipse, rgba(212,126,48,0.16) 0%, transparent 70%)',
          }}
        />

        <div
          style={{
            fontSize: 96,
            fontWeight: 700,
            color: '#6d3b07',
            letterSpacing: '-2px',
            marginBottom: 16,
            position: 'relative',
          }}
        >
          Arnav Joshi
        </div>

        <div style={{ fontSize: 32, color: '#6f4e37', marginBottom: 40, position: 'relative' }}>
          ML/AI Engineer · Full-Stack Developer · B.Tech CSE
        </div>

        <div style={{ display: 'flex', gap: 12, position: 'relative' }}>
          {['Python', 'PyTorch', 'Agentic AI', 'Next.js', 'Go'].map((tech) => (
            <div
              key={tech}
              style={{
                padding: '8px 20px',
                borderRadius: 999,
                border: '1px solid rgba(212,126,48,0.4)',
                background: 'rgba(212,126,48,0.12)',
                color: '#a35c1f',
                fontSize: 20,
              }}
            >
              {tech}
            </div>
          ))}
        </div>

        <div
          style={{
            position: 'absolute',
            bottom: 40,
            right: 60,
            fontSize: 18,
            color: '#6d3b07',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          CGPA 9.57 · Thapar Institute
        </div>
      </div>
    ),
    { ...size }
  )
}
