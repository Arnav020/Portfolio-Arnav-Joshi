import type { IconKind } from './registry'

/**
 * Hand-rolled language glyphs. Deliberately not lucide icons — VS Code's file
 * tree reads as *logos*, and a row of generic outline icons loses that instantly.
 * Each is a 16px square so tabs, tree rows and palette rows align on one grid.
 */
export function FileIcon({
  kind,
  className = '',
}: {
  kind: IconKind
  className?: string
}) {
  const cls = `h-4 w-4 shrink-0 ${className}`

  switch (kind) {
    case 'react':
      return (
        <svg viewBox="0 0 24 24" className={cls} fill="none" aria-hidden="true">
          <circle cx="12" cy="12" r="2.1" fill="#61dafb" />
          <g stroke="#61dafb" strokeWidth="1.1" fill="none">
            <ellipse cx="12" cy="12" rx="9.5" ry="3.8" />
            <ellipse cx="12" cy="12" rx="9.5" ry="3.8" transform="rotate(60 12 12)" />
            <ellipse cx="12" cy="12" rx="9.5" ry="3.8" transform="rotate(120 12 12)" />
          </g>
        </svg>
      )
    case 'html':
      return (
        <svg viewBox="0 0 24 24" className={cls} aria-hidden="true">
          <path d="M3 2h18l-1.6 18L12 22l-7.4-2L3 2z" fill="#e34f26" />
          <path d="M12 4v16.2l5.9-1.6L19.2 4H12z" fill="#ef652a" />
          <path
            d="M7.4 7h9.2l-.2 2.2H9.8l.15 2.1h6.3l-.6 6.1-3.65 1-3.6-1-.25-2.6h1.9l.13 1.3 1.82.5 1.85-.5.2-2.1H7.9L7.4 7z"
            fill="#fff"
          />
        </svg>
      )
    case 'js':
      return (
        <svg viewBox="0 0 24 24" className={cls} aria-hidden="true">
          <rect width="24" height="24" rx="3" fill="#f7df1e" />
          <path
            d="M7.4 18.2c-1.3 0-2.1-.6-2.5-1.5l1.4-.8c.3.5.6.9 1.2.9.6 0 .9-.2.9-1.1V10h1.8v5.8c0 1.6-.9 2.4-2.8 2.4zm5.4-.1c-1.2 0-2-.5-2.5-1.3l1.4-.8c.4.6.8.9 1.5.9.6 0 1-.3 1-.7 0-.5-.4-.7-1.2-1l-.4-.2c-1.2-.5-2-1.1-2-2.5 0-1.2 1-2.1 2.4-2.1 1.1 0 1.8.4 2.3 1.3l-1.3.8c-.3-.5-.6-.7-1-.7-.5 0-.7.3-.7.7 0 .4.2.6 1 1l.4.2c1.4.6 2.2 1.2 2.2 2.6 0 1.5-1.2 2.3-2.8 2.3z"
            fill="#1a1a1a"
          />
        </svg>
      )
    case 'json':
      return (
        <svg viewBox="0 0 24 24" className={cls} aria-hidden="true">
          <text
            x="12"
            y="17"
            textAnchor="middle"
            fontFamily="ui-monospace, monospace"
            fontSize="15"
            fontWeight="700"
            fill="#f7df1e"
          >
            {'{}'}
          </text>
        </svg>
      )
    case 'ts':
      return (
        <svg viewBox="0 0 24 24" className={cls} aria-hidden="true">
          <rect width="24" height="24" rx="3" fill="#3178c6" />
          <path
            d="M13.1 18.3v-1.9c.3.2.7.4 1.1.5.4.1.8.2 1.2.2.24 0 .45-.02.63-.07a1.4 1.4 0 0 0 .45-.18.75.75 0 0 0 .36-.65.72.72 0 0 0-.15-.45 1.7 1.7 0 0 0-.4-.36 4.2 4.2 0 0 0-.6-.32l-.74-.32a3.8 3.8 0 0 1-1.53-1.05 2.3 2.3 0 0 1-.5-1.5c0-.5.1-.94.3-1.3.2-.36.48-.66.83-.88.35-.23.76-.4 1.22-.5a6.6 6.6 0 0 1 1.47-.15c.5 0 .95.03 1.34.09.39.06.75.15 1.08.28v1.78a3.4 3.4 0 0 0-.53-.3 4.3 4.3 0 0 0-.6-.2 4.6 4.6 0 0 0-1.15-.16c-.22 0-.42.02-.6.06a1.5 1.5 0 0 0-.45.17.83.83 0 0 0-.29.27.63.63 0 0 0-.1.35c0 .16.04.3.12.42.08.13.2.24.35.35.15.11.33.21.55.32l.72.32c.4.17.77.35 1.09.55.32.19.6.41.82.66.23.25.4.53.52.85.12.32.18.7.18 1.13 0 .55-.1 1-.31 1.37-.2.36-.49.66-.85.88-.36.22-.77.38-1.25.48-.47.1-.97.14-1.5.14-.54 0-1.06-.04-1.55-.14a4.7 4.7 0 0 1-1.23-.42zM11.4 11.2H8.9v7.2H6.8v-7.2H4.3V9.5h7.1v1.7z"
            fill="#fff"
          />
        </svg>
      )
    case 'css':
      return (
        <svg viewBox="0 0 24 24" className={cls} aria-hidden="true">
          <path d="M3 2h18l-1.6 18L12 22l-7.4-2L3 2z" fill="#1572b6" />
          <path d="M12 4v16.2l5.9-1.6L19.2 4H12z" fill="#33a9dc" />
          <path
            d="M12 7h4.8l-.16 2.1H12V7zm0 5.1h4.4l-.5 5.6-3.9 1.1v-2.2l1.9-.5.14-1.5H12v-2.5zM12 7v2.1H7.3L7.15 7H12zm0 5.1v2.5H9.9l.14 1.5 1.96.5v2.2l-3.9-1.1-.28-3.1h1.9l.1 1.1H12v-3.6z"
            fill="#fff"
          />
        </svg>
      )
    case 'md':
      return (
        <svg viewBox="0 0 24 24" className={cls} aria-hidden="true">
          <rect x="1" y="5" width="22" height="14" rx="2.5" fill="#519aba" />
          <path
            d="M4.6 16V8.6h2l2 2.6 2-2.6h2V16h-2v-4.4l-2 2.6-2-2.6V16h-2zm11.6 0-2.7-3.4h1.7V8.6h2v4h1.7L16.2 16z"
            fill="#fff"
          />
        </svg>
      )
    case 'log':
      return (
        <svg viewBox="0 0 24 24" className={cls} aria-hidden="true">
          <rect x="3.5" y="2.5" width="17" height="19" rx="2.5" fill="#6b7280" />
          <g fill="#e5e7eb">
            <rect x="6.5" y="6.5" width="11" height="1.6" rx="0.8" />
            <rect x="6.5" y="10" width="8" height="1.6" rx="0.8" />
            <rect x="6.5" y="13.5" width="11" height="1.6" rx="0.8" />
            <rect x="6.5" y="17" width="6" height="1.6" rx="0.8" />
          </g>
        </svg>
      )
    case 'pdf':
      return (
        <svg viewBox="0 0 24 24" className={cls} aria-hidden="true">
          <path d="M5 2h9l5 5v15H5V2z" fill="#e5484d" />
          <path d="M14 2l5 5h-5V2z" fill="#ff8b8e" />
          <text
            x="12"
            y="18"
            textAnchor="middle"
            fontFamily="ui-monospace, monospace"
            fontSize="6.4"
            fontWeight="700"
            fill="#fff"
          >
            PDF
          </text>
        </svg>
      )
  }
}
