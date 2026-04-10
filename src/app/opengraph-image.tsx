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
          background: '#0a0a0f',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'sans-serif',
        }}
      >
        {/* Background grid */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'linear-gradient(rgba(99,102,241,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.05) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
        {/* Glow */}
        <div
          style={{
            position: 'absolute',
            top: '-20%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '800px',
            height: '400px',
            borderRadius: '50%',
            background:
              'radial-gradient(ellipse, rgba(99,102,241,0.2) 0%, transparent 70%)',
          }}
        />
        {/* Name */}
        <div
          style={{
            fontSize: 96,
            fontWeight: 700,
            background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 50%, #ec4899 100%)',
            backgroundClip: 'text',
            color: 'transparent',
            letterSpacing: '-2px',
            marginBottom: 16,
            position: 'relative',
          }}
        >
          Arnav Joshi
        </div>
        {/* Role */}
        <div
          style={{
            fontSize: 32,
            color: '#9ca3af',
            marginBottom: 40,
            position: 'relative',
          }}
        >
          ML Engineer · Full Stack Developer · B.Tech CSE
        </div>
        {/* Tags */}
        <div
          style={{
            display: 'flex',
            gap: 12,
            position: 'relative',
          }}
        >
          {['Python', 'PyTorch', 'Next.js', 'Go', 'LLMs'].map((tech) => (
            <div
              key={tech}
              style={{
                padding: '8px 20px',
                borderRadius: 12,
                border: '1px solid rgba(99,102,241,0.3)',
                background: 'rgba(99,102,241,0.1)',
                color: '#818cf8',
                fontSize: 20,
              }}
            >
              {tech}
            </div>
          ))}
        </div>
        {/* CGPA badge */}
        <div
          style={{
            position: 'absolute',
            bottom: 40,
            right: 60,
            fontSize: 18,
            color: '#4ade80',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          CGPA 9.55 · Thapar Institute
        </div>
      </div>
    ),
    { ...size }
  )
}
