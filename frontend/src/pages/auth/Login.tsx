import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, ShieldCheck } from 'lucide-react'
import AuthLayout from '../../components/auth/AuthLayout'
import LinkedInButton from '../../components/auth/LinkedInButton'
import { roles } from '../../components/auth/roles'
import type { RoleKey } from '../../components/auth/roles'
import { PasswordInput, PrimaryButton, TextInput } from '../../components/ui/form'
import { IGDTUW_DOMAIN, igdtuwEmailError, loadSignup, nameFromEmail, setSession } from '../../lib/demoSession'

/**
 * Shared sign-in screen.
 * - Students and professors: IGDTUW email + password.
 * - Alumni: LinkedIn only (no password), so only verified alumni get in.
 */
export default function Login({ role }: { role: RoleKey }) {
  const cfg = roles[role]

  if (role === 'alumni') {
    return (
      <AuthLayout role="alumni" mode="login" title="Sign in" subtitle={cfg.welcome}>
        <div className="rounded-2xl bg-cream-surface p-6">
          <p className="flex items-center gap-2 text-sm font-bold text-forest-green">
            <ShieldCheck size={18} /> Alumni sign in with LinkedIn
          </p>
          <p className="mt-2 text-sm leading-relaxed text-ink/75">
            We use LinkedIn to confirm you are a real person with an IGDTUW education. There is no
            separate password to remember.
          </p>
          <LinkedInButton intent="login" className="mt-5 w-full" />
        </div>
        <p className="mt-6 text-sm text-ink/70">
          First time here?{' '}
          <Link to={cfg.registerPath} className="font-semibold text-forest-green underline">
            Register as an alumna
          </Link>
        </p>
      </AuthLayout>
    )
  }

  return <EmailLogin role={role} />
}

function EmailLogin({ role }: { role: RoleKey }) {
  const cfg = roles[role]
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({})

  const onSubmit = (ev: FormEvent) => {
    ev.preventDefault()
    const e: typeof errors = {}
    const emailErr = igdtuwEmailError(email)
    if (emailErr) e.email = emailErr
    if (!password) e.password = 'Enter your password.'
    setErrors(e)
    if (Object.keys(e).length) return

    // Demo only: real authentication (password check + verified-email check) happens on the backend.
    const saved = loadSignup()
    const known = saved && saved.role === role && saved.email?.toLowerCase() === email.trim().toLowerCase()
    setSession({
      role,
      name: known && saved?.fullName ? saved.fullName : nameFromEmail(email),
      email: email.trim().toLowerCase(),
      method: 'igdtuw-email',
      verified: true,
    })
    navigate(`/dashboard/${role}`)
  }

  return (
    <AuthLayout role={role} mode="login" title="Sign in" subtitle={cfg.welcome}>
      <form onSubmit={onSubmit} noValidate className="space-y-5">
        <TextInput
          label="IGDTUW email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email}
          placeholder={`name@${IGDTUW_DOMAIN}`}
        />
        <PasswordInput
          label="Password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
        />

        <div className="flex justify-end">
          <Link to={`/forgot-password?role=${role}`} className="text-sm font-semibold text-forest-green underline">
            Forgot password?
          </Link>
        </div>

        <PrimaryButton type="submit" className="w-full">
          Sign in <ArrowRight size={18} />
        </PrimaryButton>

        <p className="pt-2 text-sm text-ink/70">
          New to Everlink?{' '}
          <Link to={cfg.registerPath} className="font-semibold text-forest-green underline">
            Create a {cfg.label.toLowerCase()} account
          </Link>
        </p>
      </form>
    </AuthLayout>
  )
}
