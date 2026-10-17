import { Link } from 'react-router-dom'
import { ArrowRight, FlaskConical, GraduationCap, Handshake } from 'lucide-react'
import Footer from '../../components/layout/Footer'
import { roles } from '../../components/auth/roles'

const icons = {
  student: GraduationCap,
  alumni: Handshake,
  professor: FlaskConical,
}

/** Navbar "Sign In" lands here: pick a portal, then sign in or register. */
export default function SignInChooser() {
  return (
    <>
      <main className="bg-cream-surface px-5 py-16 sm:px-8 sm:py-20">
        <div className="mx-auto max-w-5xl">
          <h1 className="text-center font-display text-3xl font-extrabold tracking-tight text-forest-green sm:text-4xl">
            Sign in to Everlink
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-center text-ink/75">
            One account system, three portals. Choose the one that fits you.
          </p>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {Object.values(roles).map((r) => {
              const Icon = icons[r.key]
              return (
                <article key={r.key} className="flex flex-col rounded-2xl border border-forest-green/15 bg-white-surface p-7">
                  <span className="grid h-12 w-12 place-items-center rounded-xl bg-forest-green text-buttermilk">
                    <Icon size={24} />
                  </span>
                  <h2 className="mt-5 font-display text-xl font-bold text-forest-green">{r.label}</h2>
                  <p className="mt-2 flex-1 text-[0.95rem] leading-relaxed text-ink/75">{r.tagline}</p>
                  <Link
                    to={r.loginPath}
                    className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-forest-green px-5 py-3 text-sm font-semibold text-white-surface transition hover:bg-teal"
                  >
                    Sign in <ArrowRight size={16} />
                  </Link>
                  <Link to={r.registerPath} className="mt-3 text-center text-sm font-semibold text-forest-green underline">
                    Create an account
                  </Link>
                </article>
              )
            })}
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
