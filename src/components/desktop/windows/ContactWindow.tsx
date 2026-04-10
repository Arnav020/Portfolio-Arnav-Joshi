'use client'
import { useState } from 'react'
import { Mail, Send, Check } from 'lucide-react'
import { Github, Linkedin } from '@/components/ui/Icons'
import { SOCIAL_LINKS } from '@/lib/constants'

export function ContactWindow() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [sent, setSent] = useState(false)
  const [sending, setSending] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSending(true)
    await new Promise((r) => setTimeout(r, 1200))
    setSending(false)
    setSent(true)
    setTimeout(() => setSent(false), 3500)
    setForm({ name: '', email: '', message: '' })
  }

  return (
    <div className="flex flex-col h-full overflow-y-auto p-4 sm:p-6 custom-scrollbar text-sm sm:text-base space-y-6">
      <div className="font-mono text-xs sm:text-sm text-green-400/80 mb-2">
        <p><span className="text-indigo-400">~</span> ./contact.sh</p>
      </div>
      <div className="space-y-3">
        {[
          { icon: Mail, label: 'arnavjoshi020@gmail.com', href: `mailto:${SOCIAL_LINKS.email}`, color: '#6366f1' },
          { icon: Github, label: 'github.com/Arnav020', href: SOCIAL_LINKS.github, color: '#8b5cf6' },
          { icon: Linkedin, label: 'linkedin.com/in/arnav-joshi-038693291', href: SOCIAL_LINKS.linkedin, color: '#06b6d4' },
        ].map(({ icon: Icon, label, href, color }) => (
          <a key={label} href={href} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/10 transition-all shadow-sm hover:shadow-lg group">
            <div className="p-2.5 rounded-xl flex items-center justify-center shadow-inner" style={{ background: `${color}18`, border: `1px solid ${color}33` }}>
              <Icon className="w-5 h-5 sm:w-6 sm:h-6" style={{ color }} />
            </div>
            <span className="text-sm sm:text-base text-white/70 group-hover:text-white/95 transition-colors font-mono tracking-wide truncate">
              {label}
            </span>
          </a>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="space-y-4 pt-2">
        {[
          { id: 'name', type: 'text', placeholder: 'Your name' },
          { id: 'email', type: 'email', placeholder: 'your@email.com' },
        ].map(({ id, type, placeholder }) => (
          <input key={id} type={type} required placeholder={placeholder}
            value={form[id as keyof typeof form]}
            onChange={(e) => setForm((s) => ({ ...s, [id]: e.target.value }))}
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white/90 placeholder-white/30 text-sm sm:text-base focus:outline-none focus:border-indigo-500/50 transition-colors shadow-inner"
          />
        ))}
        <textarea required rows={4} placeholder="Your message..."
          value={form.message}
          onChange={(e) => setForm((s) => ({ ...s, message: e.target.value }))}
          className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white/90 placeholder-white/30 text-sm sm:text-base focus:outline-none focus:border-indigo-500/50 transition-colors resize-none shadow-inner"
        />
        <button type="submit" disabled={sending || sent}
          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm sm:text-base font-bold tracking-wide transition-all shadow-md hover:shadow-lg"
          style={{ background: sent ? '#10b981' : '#6366f1', color: '#fff', opacity: sending ? 0.7 : 1 }}>
          {sent ? <><Check className="w-5 h-5" /> Sent Successfully!</>
            : sending ? <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Sending...</>
            : <><Send className="w-5 h-5" /> Send Message</>}
        </button>
      </form>
    </div>
  )
}
