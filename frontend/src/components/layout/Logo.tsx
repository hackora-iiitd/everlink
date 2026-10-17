import { Link } from 'react-router-dom'

type LogoProps = {
  light?: boolean
}

/** Everlink mark: two interlocked links forming an infinity-like chain. */
export function LogoMark({ className = 'h-8 w-8' }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden="true">
      <rect width="40" height="40" rx="11" fill="#135106" />
      <path
        d="M15.5 14.5h-1.8a5.5 5.5 0 0 0 0 11h1.8M24.5 14.5h1.8a5.5 5.5 0 0 1 0 11h-1.8"
        fill="none"
        stroke="#DCF6F4"
        strokeWidth="2.6"
        strokeLinecap="round"
      />
      <path d="M14 20h12" stroke="#E2B407" strokeWidth="2.6" strokeLinecap="round" />
    </svg>
  )
}

export default function Logo({ light = false }: LogoProps) {
  return (
    <Link to="/" className="inline-flex items-center gap-2.5" aria-label="Everlink home">
      <LogoMark />
      <span
        className={`font-display text-[1.4rem] font-extrabold tracking-tight ${
          light ? 'text-white-surface' : 'text-forest-green'
        }`}
      >
        Everlink
      </span>
    </Link>
  )
}
