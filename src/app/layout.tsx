import type { Metadata, Viewport } from 'next'
import { JetBrains_Mono, Syne } from 'next/font/google'
import './globals.css'

const jetbrains = JetBrains_Mono({
  variable: '--font-jetbrains',
  subsets: ['latin'],
})

// Syne 700/800 for display type — the pairing the reference IDE uses.
const syne = Syne({
  variable: '--font-syne',
  subsets: ['latin'],
  weight: ['700', '800'],
})

export const metadata: Metadata = {
  metadataBase: new URL('https://arnavjoshi.dev'),
  // Browser-tab title; the longer positioning line lives in openGraph below.
  title: 'Arnav Joshi | Portfolio',
  description:
    'Portfolio of Arnav Joshi, built as a code editor. CS undergrad at Thapar Institute working on agentic LLM systems, physics-informed ML, and backend infrastructure.',
  keywords: [
    'Arnav Joshi',
    'AI ML Engineer',
    'Full Stack Developer',
    'Agentic AI',
    'RAG',
    'Go',
    'Next.js',
    'Thapar Institute',
  ],
  authors: [{ name: 'Arnav Joshi' }],
  creator: 'Arnav Joshi',
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://arnavjoshi.dev',
    siteName: 'Arnav Joshi — Portfolio',
    title: 'Arnav Joshi — AI/ML Engineer & Full Stack Developer',
    description:
      'A portfolio that opens like a code editor: every section is a file you can open in a tab.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Arnav Joshi — AI/ML Engineer & Full Stack Developer',
    description:
      'A portfolio that opens like a code editor: every section is a file you can open in a tab.',
  },
  robots: { index: true, follow: true },
}

export const viewport: Viewport = {
  // The shell paints its own chrome edge-to-edge; match the browser UI to it.
  themeColor: '#1a1a2e',
  colorScheme: 'dark',
}

/**
 * Applied before first paint so a restored theme never flashes the default
 * palette. Kept in sync with THEME_KEY / the theme ids in IdeProvider.
 */
const THEME_INIT = `try{var t=localStorage.getItem('ide.theme');var v=['arnav-dark','rose-pine','tokyo-night','catppuccin','nord','gruvbox'];document.documentElement.dataset.theme=v.indexOf(t)>-1?t:'arnav-dark'}catch(e){document.documentElement.dataset.theme='arnav-dark'}`

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      data-theme="arnav-dark"
      className={`${jetbrains.variable} ${syne.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Person',
              name: 'Arnav Joshi',
              url: 'https://arnavjoshi.dev',
              jobTitle: 'AI/ML Engineer & Full Stack Developer',
              sameAs: [
                'https://github.com/Arnav020',
                'https://linkedin.com/in/arnav-joshi-038693291',
              ],
              alumniOf: {
                '@type': 'EducationalOrganization',
                name: 'Thapar Institute of Engineering and Technology',
              },
              knowsAbout: [
                'Machine Learning',
                'Agentic AI Systems',
                'Retrieval-Augmented Generation',
                'Physics-Informed Neural Networks',
                'Go',
                'Python',
                'Kubernetes',
                'MLOps',
              ],
            }),
          }}
        />
      </head>
      <body className="antialiased" suppressHydrationWarning>
        {children}
      </body>
    </html>
  )
}
