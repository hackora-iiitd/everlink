import type { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { FlaskConical, LogOut } from 'lucide-react'
import Footer from '../layout/Footer'
import { roles } from '../auth/roles'
import type { RoleKey } from '../auth/roles'
import { clearSession, useSession } from '../../lib/demoSession'

export type NavSection = { id: string; label: string }

/** Shared frame for the alumni and professor dashboards: greeting band, section nav, content. */
export default function DashboardShell({ role, heading, sections, children }: { role: RoleKey; heading: string; sections: NavSection[]; children: ReactNode }) {
  const session = useSession()
  const navigate = useNavigate()
  const first = (session?.name ?? '').split(' ')[0]

  return (
    <>
      <div className="bg-forest-green px-5 py-9 text-white-surface sm:px-8">
        <div className="mx-auto flex max-w-7xl flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-buttermilk">{roles[role].label} portal</p>
            <h1 className="mt-2 font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
              {heading}
              {first ? `, ${first}` : ''}
            </h1>
          </div>
          <button
            type="button"
            onClick={() => {
              clearSession()
              navigate('/')
            }}
            className="inline-flex items-center gap-2 rounded-full bg-white-surface/15 px-4 py-2 text-sm font-semibold transition hover:bg-white-surface/30"
          >
            <LogOut size={16} /> Sign out
          </button>
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl gap-8 px-5 py-8 sm:px-8 lg:grid-cols-[210px_1fr]">
        <nav aria-label="Dashboard sections" className="min-w-0 lg:sticky lg:top-24 lg:self-start">
          <ul className="flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:gap-1 lg:overflow-visible">
            {sections.map((s) => (
              <li key={s.id} className="shrink-0">
                <a href={`#${s.id}`} className="block rounded-lg px-3 py-2 text-sm font-semibold text-forest-green transition hover:bg-cream-surface">
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <main className="min-w-0 space-y-8">
          <p className="flex items-start gap-2 rounded-xl border border-buttermilk/60 bg-buttermilk/10 px-4 py-3 text-xs text-ink/75">
            <FlaskConical size={14} className="mt-0.5 shrink-0" />
            Your dashboard activity is saved in this browser.
          </p>
          {children}
        </main>
      </div>
      <Footer />
    </>
  )
}

export function Section({ id, title, description, action, children }: { id: string; title: string; description?: string; action?: ReactNode; children: ReactNode }) {
  return (
    <section id={id} className="scroll-mt-24 rounded-2xl border border-forest-green/15 bg-white-surface p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="font-display text-xl font-extrabold text-forest-green">{title}</h2>
          {description && <p className="mt-1 text-sm text-ink/65">{description}</p>}
        </div>
        {action}
      </div>
      <div className="mt-5">{children}</div>
    </section>
  )
}

export const SampleTag = () => null

export function Chips({ items }: { items: string[] }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {items.map((t) => (
        <span key={t} className="rounded-full bg-cream-surface px-2.5 py-1 text-xs font-semibold text-forest-green">
          {t}
        </span>
      ))}
    </div>
  )
}

export const smallBtn = 'rounded-full px-4 py-1.5 text-sm font-semibold transition'
export const btnPrimary = `${smallBtn} bg-forest-green text-white-surface hover:bg-teal`
export const btnGhost = `${smallBtn} border-2 border-forest-green/25 text-forest-green hover:border-forest-green`
