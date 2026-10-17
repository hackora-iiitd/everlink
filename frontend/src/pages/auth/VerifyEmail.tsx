import { useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { ArrowRight, MailCheck } from 'lucide-react'
import AuthLayout from '../../components/auth/AuthLayout'
import type { RoleKey } from '../../components/auth/roles'
import { PrimaryButton } from '../../components/ui/form'
import { loadSignup } from '../../lib/demoSession'

export default function VerifyEmail() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const saved = loadSignup()
  const email = params.get('email') ?? saved?.email ?? 'your email'
  const role: RoleKey = saved?.role ?? 'student'

  const [cooldown, setCooldown] = useState(30)
  const [resent, setResent] = useState(false)

  useEffect(() => {
    if (cooldown <= 0) return
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000)
    return () => clearTimeout(t)
  }, [cooldown])

  const resend = () => {
    setResent(true)
    setCooldown(30)
  }

  return (
    <AuthLayout role={role} title="Verify your email" subtitle="One quick step before we set up your profile.">
      <div className="rounded-2xl bg-cream-surface p-6">
        <span className="grid h-12 w-12 place-items-center rounded-xl bg-forest-green text-buttermilk">
          <MailCheck size={24} />
        </span>
        <p className="mt-4 text-[0.97rem] leading-relaxed text-ink/85">
          We sent a verification link to <strong className="break-all">{email}</strong>. Open it to
          confirm your address, then come back here.
        </p>

        <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
          <button
            type="button"
            onClick={resend}
            disabled={cooldown > 0}
            className="font-semibold text-forest-green underline disabled:cursor-not-allowed disabled:text-ink/40 disabled:no-underline"
          >
            Resend email
          </button>
          {cooldown > 0 && <span className="text-ink/55">available in {cooldown}s</span>}
          {resent && cooldown > 0 && <span className="font-semibold text-teal">Sent again.</span>}
        </div>
      </div>

      {/* Demo-only shortcut, since no emails are actually sent yet */}
      <div className="mt-8 rounded-xl border-2 border-dashed border-buttermilk bg-buttermilk/10 p-4">
        <p className="text-xs font-bold uppercase tracking-wide text-ink/70">Demo mode</p>
        <p className="mt-1 text-sm text-ink/75">
          No emails are sent yet. Continue to preview the onboarding flow.
        </p>
        <PrimaryButton type="button" className="mt-4" onClick={() => navigate(`/onboarding/${role}`)}>
          I've verified my email <ArrowRight size={18} />
        </PrimaryButton>
      </div>

      <p className="mt-6 text-sm text-ink/65">
        Wrong address?{' '}
        <Link to="/join/student" className="font-semibold text-forest-green underline">
          Start again
        </Link>
      </p>
    </AuthLayout>
  )
}
