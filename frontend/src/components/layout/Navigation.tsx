import { useState } from 'react'
import { NavLink, Link } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import Logo from './Logo'
import { dashboardPath, useSession } from '../../lib/demoSession'

const links = [
  { to: '/how-it-works', label: 'How It Works' },
  { to: '/features', label: 'Features' },
  { to: '/explore', label: 'Explore' },
  { to: '/about', label: 'About & Help' },
]

export default function Navigation() {
  const [open, setOpen] = useState(false)
  const session = useSession()
  const cta = session ? { to: dashboardPath(session), label: 'My Dashboard' } : { to: '/signin', label: 'Sign In' }
  const authLinks = [
    ...(session?.role === 'student' ? [{ to: '/senior-success', label: 'Senior Success' }] : []),
    ...(session ? [{ to: '/opportunities-stories', label: 'Opportunities & Stories' }] : []),
    ...(session && (session.role === 'admin' || (session.role === 'alumni' && session.verified)) ? [{ to: '/opportunities-stories/new', label: 'Create Post' }] : []),
  ]
  const visibleLinks = [...links, ...authLinks]

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `text-[0.95rem] font-semibold transition-colors ${
      isActive ? 'text-forest-green' : 'text-ink/75 hover:text-forest-green'
    }`

  return (
    <header className="sticky top-0 z-50 border-b border-forest-green/10 bg-white-surface/90 backdrop-blur">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3.5 sm:px-8">
        <Logo />

        <div className="hidden items-center gap-6 lg:flex">
          {visibleLinks.map((l) => (
            <NavLink key={l.to} to={l.to} className={linkClass}>
              {l.label}
            </NavLink>
          ))}
          <Link
            to={cta.to}
            className="rounded-full bg-forest-green px-5 py-2.5 text-[0.95rem] font-semibold text-white-surface transition hover:bg-teal"
          >
            {cta.label}
          </Link>
        </div>

        <button
          type="button"
          className="rounded-lg p-2 text-forest-green lg:hidden"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-forest-green/10 bg-white-surface px-5 pb-5 pt-3 lg:hidden">
          <div className="flex flex-col gap-1">
            {visibleLinks.map((l) => (
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
              to={cta.to}
              onClick={() => setOpen(false)}
              className="mt-2 rounded-full bg-forest-green px-5 py-3 text-center font-semibold text-white-surface"
            >
              {cta.label}
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
