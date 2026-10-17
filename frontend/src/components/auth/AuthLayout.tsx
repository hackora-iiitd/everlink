import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Check } from 'lucide-react'
import { roleList, roles } from './roles'
import type { RoleKey } from './roles'

type AuthLayoutProps = {
  role: RoleKey
  /** Which tab is active; omit for screens without tabs (verify, onboarding…) */
  mode?: 'register' | 'login'
  title: string
  subtitle?: string
  children: ReactNode
  wide?: boolean
}

/**
 * Shared shell for all three portals: dark green brand panel + form column.
 * Only the role config (tagline, points) changes between portals.
 */
export default function AuthLayout({ role, mode, title, subtitle, children, wide }: AuthLayoutProps) {
  const cfg = roles[role]

  return (
    <div className="grid min-h-[calc(100vh-65px)] lg:grid-cols-[minmax(340px,0.8fr)_1.4fr]">
      {/* Brand panel */}
      <aside className="relative overflow-hidden bg-forest-green px-6 py-10 text-white-surface sm:px-10 lg:py-14">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-70"
          style={{
            backgroundImage: 'radial-gradient(#DCF6F426 1.2px, transparent 1.2px)',
            backgroundSize: '26px 26px',
          }}
        />
        <div className="relative flex h-full flex-col lg:sticky lg:top-24 lg:h-auto">
          <p className="text-sm font-bold uppercase tracking-widest text-buttermilk">{cfg.label} portal</p>
          <h2 className="mt-3 font-display text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">
            {cfg.tagline}
          </h2>

          <ul className="mt-8 hidden space-y-4 lg:block">
            {cfg.points.map((p) => (
              <li key={p} className="flex items-start gap-3 text-[0.97rem] text-white-surface/85">
                <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-buttermilk text-ink">
                  <Check size={12} strokeWidth={3} />
                </span>
                {p}
              </li>
            ))}
          </ul>

          <p className="mt-10 hidden text-xs text-white-surface/55 lg:block">
            One Everlink account system for every role. Your profile stays private until you choose
            otherwise.
          </p>
        </div>
      </aside>

      {/* Form column */}
      <section className="bg-white-surface px-5 py-10 sm:px-10 lg:py-14">
        <div className={`mx-auto ${wide ? 'max-w-2xl' : 'max-w-md'}`}>
          {/* role switcher */}
          <nav aria-label="Choose portal" className="mb-8 flex flex-wrap gap-2">
            {roleList.map((r) => (
              <Link
                key={r.key}
                to={mode === 'login' ? r.loginPath : r.registerPath}
                aria-current={r.key === role ? 'page' : undefined}
                className={`rounded-full px-4 py-1.5 text-sm font-semibold transition ${
                  r.key === role
                    ? 'bg-forest-green text-white-surface'
                    : 'bg-cream-surface text-forest-green hover:bg-forest-green/10'
                }`}
              >
                {r.label}
              </Link>
            ))}
          </nav>

          {mode && (
            <div role="tablist" className="mb-7 grid grid-cols-2 rounded-full bg-cream-surface p-1">
              <Link
                role="tab"
                aria-selected={mode === 'register'}
                to={cfg.registerPath}
                className={`rounded-full py-2.5 text-center text-sm font-semibold transition ${
                  mode === 'register' ? 'bg-white-surface text-forest-green shadow' : 'text-ink/60'
                }`}
              >
                Create account
              </Link>
              <Link
                role="tab"
                aria-selected={mode === 'login'}
                to={cfg.loginPath}
                className={`rounded-full py-2.5 text-center text-sm font-semibold transition ${
                  mode === 'login' ? 'bg-white-surface text-forest-green shadow' : 'text-ink/60'
                }`}
              >
                Sign in
              </Link>
            </div>
          )}

          <h1 className="font-display text-3xl font-extrabold tracking-tight text-forest-green">{title}</h1>
          {subtitle && <p className="mt-2 text-[0.97rem] leading-relaxed text-ink/70">{subtitle}</p>}

          <div className="mt-8">{children}</div>
        </div>
      </section>
    </div>
  )
}
