import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  metadataBase: new URL('https://arnavjoshi.dev'),
  title: 'Arnav Joshi — ML Engineer & Full Stack Developer',
  description:
    'Portfolio of Arnav Joshi — CS undergrad at Thapar Institute, specialising in ML/AI systems, agentic AI, and full-stack engineering.',
  keywords: [
    'Arnav Joshi',
    'ML Engineer',
    'Full Stack Developer',
    'Next.js',
    'Python',
    'Deep Learning',
    'Thapar',
  ],
  authors: [{ name: 'Arnav Joshi' }],
  creator: 'Arnav Joshi',
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://arnavjoshi.dev',
    title: 'Arnav Joshi — ML Engineer & Full Stack Developer',
    description:
      'Portfolio of Arnav Joshi — CS undergrad at Thapar Institute, specialising in ML/AI and full-stack engineering.',
    siteName: 'Arnav Joshi Portfolio',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Arnav Joshi',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Arnav Joshi — ML Engineer & Full Stack Developer',
    description: 'Portfolio of Arnav Joshi — CS undergrad at Thapar Institute.',
    creator: '@arnavjoshi',
  },
  robots: {
    index: true,
    follow: true,
  },
  other: {
    'dns-prefetch': 'https://api.github.com',
    'preconnect': 'https://api.github.com',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased overflow-hidden`} suppressHydrationWarning>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Person',
              name: 'Arnav Joshi',
              url: 'https://arnavjoshi.dev',
              sameAs: [
                'https://github.com/Arnav020',
                'https://linkedin.com/in/arnav-joshi-038693291',
              ],
              jobTitle: 'ML Engineer & Full Stack Developer',
              alumniOf: {
                '@type': 'EducationalOrganization',
                name: 'Thapar Institute of Engineering and Technology',
              },
              knowsAbout: [
                'Machine Learning',
                'Deep Learning',
                'Python',
                'FastAPI',
                'Next.js',
                'Go',
                'MLOps',
                'Agentic AI',
              ],
            }),
          }}
        />
        {children}
      </body>
    </html>
  )
}
