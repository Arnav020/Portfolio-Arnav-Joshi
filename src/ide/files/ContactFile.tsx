'use client'

import { useState } from 'react'
import { ChevronRight, Mail } from 'lucide-react'
import { GithubMark, LinkedinMark } from '../BrandIcons'
import { FileHeading, SectionLabel, Tagline } from './parts'
import { links } from '@/content/profile'

/**
 * Set NEXT_PUBLIC_FORMSPREE_ID to the id from your Formspree endpoint
 * (the `xyzabcd` in https://formspree.io/f/xyzabcd). Without it the form
 * still works — it composes the same message as a mailto: draft instead of
 * silently pretending to have sent something.
 */
const FORMSPREE_ID = process.env.NEXT_PUBLIC_FORMSPREE_ID

type Status = 'idle' | 'sending' | 'sent' | 'error'

const CONTACTS = [
  {
    label: 'EMAIL',
    value: links.email,
    href: `mailto:${links.email}`,
    Icon: Mail,
    tone: 'text-c-blue',
  },
  {
    label: 'LINKEDIN',
    value: 'linkedin.com/in/arnav-joshi',
    href: links.linkedin,
    Icon: LinkedinMark,
    tone: 'text-c-blue',
  },
  {
    label: 'GITHUB',
    value: 'github.com/Arnav020',
    href: links.github,
    Icon: GithubMark,
    tone: 'text-fg',
  },
]

function Field({
  label,
  required,
  children,
}: {
  label: string
  required?: boolean
  children: React.ReactNode
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block font-mono text-xs text-c-comment">
        {'// '}
        {label}
        {required && <span className="ml-1 text-c-red">*</span>}
      </span>
      {children}
    </label>
  )
}

const inputClass =
  'w-full rounded-md border border-line bg-surface px-3 py-2.5 text-sm text-fg-strong outline-none transition-colors placeholder:text-faint focus:border-accent'

export function ContactFile() {
  const [status, setStatus] = useState<Status>('idle')

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const data = new FormData(form)

    if (!FORMSPREE_ID) {
      // No endpoint configured: hand the message to the user's mail client.
      const subject = encodeURIComponent(
        String(data.get('subject') || 'Hello from your portfolio')
      )
      const body = encodeURIComponent(
        `${data.get('message')}\n\n— ${data.get('name')} (${data.get('email')})`
      )
      window.location.href = `mailto:${links.email}?subject=${subject}&body=${body}`
      return
    }

    setStatus('sending')
    try {
      const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
        method: 'POST',
        body: data,
        headers: { Accept: 'application/json' },
      })
      if (!res.ok) throw new Error(String(res.status))
      form.reset()
      setStatus('sent')
    } catch {
      setStatus('error')
    }
  }

  return (
    <>
      <Tagline syntax="css">contact.css — let&apos;s build something</Tagline>

      <FileHeading
        title="Contact"
        sub="// open to internships, research collabs & good problems"
      />

      <div className="grid gap-8 lg:grid-cols-2">
        <section>
          <SectionLabel tone="green">Find me on</SectionLabel>
          <div className="space-y-2.5">
            {CONTACTS.map(({ label, value, href, Icon, tone }) => (
              <a
                key={label}
                href={href}
                target={href.startsWith('mailto:') ? undefined : '_blank'}
                rel="noopener noreferrer"
                className="group flex items-center gap-3 rounded-lg border border-line bg-panel px-4 py-3 transition-colors hover:border-accent"
              >
                <span
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-line bg-surface ${tone}`}
                >
                  <Icon className="h-4 w-4" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-xs tracking-[0.14em] text-fg-strong">
                    {label}
                  </span>
                  <span className="block truncate text-xs text-dim">{value}</span>
                </span>
                <ChevronRight className="h-4 w-4 shrink-0 text-faint transition-transform group-hover:translate-x-0.5" />
              </a>
            ))}
          </div>
        </section>

        <section>
          <SectionLabel tone="green">Send a message</SectionLabel>

          <form onSubmit={onSubmit} className="space-y-4">
            <Field label="YOUR_NAME" required>
              <input name="name" required placeholder="string" className={inputClass} />
            </Field>

            <Field label="YOUR_EMAIL" required>
              <input
                name="email"
                type="email"
                required
                placeholder="string"
                className={inputClass}
              />
            </Field>

            <Field label="SUBJECT">
              <input name="subject" placeholder="string" className={inputClass} />
            </Field>

            <Field label="MESSAGE" required>
              <textarea
                name="message"
                required
                rows={5}
                placeholder="'''your message'''"
                className={`${inputClass} resize-y`}
              />
            </Field>

            <button
              type="submit"
              disabled={status === 'sending'}
              className="w-full rounded-md bg-accent px-4 py-2.5 text-sm font-medium text-statusbar-fg transition-opacity hover:opacity-90 disabled:opacity-60"
            >
              {status === 'sending' ? '→ sending()…' : '→ send_message()'}
            </button>

            {status === 'sent' && (
              <p className="font-mono text-xs text-c-green">
                {"// 200 OK — message delivered, I'll reply soon."}
              </p>
            )}
            {status === 'error' && (
              <p className="font-mono text-xs text-c-red">
                {'// 500 — send failed. Email me directly at '}
                {links.email}
              </p>
            )}

            <p className="font-mono text-xs text-c-comment">
              {FORMSPREE_ID
                ? '// powered by Formspree — lands directly in my inbox'
                : '// opens a draft in your mail client'}
            </p>
          </form>
        </section>
      </div>
    </>
  )
}
