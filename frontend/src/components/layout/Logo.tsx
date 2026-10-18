import { Link } from 'react-router-dom'

type LogoProps = {
  light?: boolean
}

export function LogoMark({ className = 'h-8 w-auto' }: { className?: string }) {
  return <img src="/image.png" className={className} alt="" aria-hidden="true" />
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
