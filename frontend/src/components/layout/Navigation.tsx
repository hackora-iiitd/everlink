import { useState } from 'react'
import { NavLink, Link } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import Logo from './Logo'

const links = [
  { to: '/how-it-works', label: 'How It Works' },
  { to: '/features', label: 'Features' },
  { to: '/explore', label: 'Explore' },
]

export default function Navigation() {
  const [open, setOpen] = useState(false)

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `text-[0.95rem] font-semibold transition-colors ${
      isActive ? 'text-forest-green' : 'text-ink/75 hover:text-forest-green'
    }`

  return (
    <header className="sticky top-0 z-50 border-b border-forest-green/10 bg-white-surface/90 backdrop-blur">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3.5 sm:px-8">
        <Logo />

        <div className="hidden items-center gap-9 md:flex">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} className={linkClass}>
              {l.label}
            </NavLink>
          ))}
          <Link
            to="/signin"
            className="rounded-full bg-forest-green px-5 py-2.5 text-[0.95rem] font-semibold text-white-surface transition hover:bg-teal"
          >
            Sign In
          </Link>
        </div>

        <button
          type="button"
          className="rounded-lg p-2 text-forest-green md:hidden"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-forest-green/10 bg-white-surface px-5 pb-5 pt-3 md:hidden">
          <div className="flex flex-col gap-1">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `rounded-lg px-3 py-3 text-base font-semibold ${
                    isActive ? 'bg-cream-surface text-forest-green' : 'text-ink'
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}
            <Link
              to="/signin"
              onClick={() => setOpen(false)}
              className="mt-2 rounded-full bg-forest-green px-5 py-3 text-center font-semibold text-white-surface"
            >
              Sign In
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
