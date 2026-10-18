import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { ArrowRight, FlaskConical } from 'lucide-react'
import AuthLayout from '../../components/auth/AuthLayout'
import { PrimaryButton, TextInput } from '../../components/ui/form'
import {
  DEMO_MODE,
  isLinkedInProfileUrl,
  isValidEmail,
  loadAlumni,
  savePendingIdentity,
  setSession,
} from '../../lib/demoSession'

/**
 * Where LinkedIn sends the member back to.
 *
 * Production: the backend handles ?code=&state=, exchanges it for a LinkedIn identity and starts the session.
 * Demo mode (this page): there is no real LinkedIn call, so the identity LinkedIn would return is typed in.
 */
export default function LinkedInCallback() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const intent = params.get('intent') === 'login' ? 'login' : 'register'
  const [f, setF] = useState({ name: '', email: '', profileUrl: '' })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const set = (k: keyof typeof f) => (e: { target: { value: string } }) => setF((p) => ({ ...p, [k]: e.target.value }))

  if (!DEMO_MODE) {
    return (
      <AuthLayout role="alumni" title="LinkedIn sign-in" subtitle="This step is completed by the Everlink server.">
        <p className="rounded-xl bg-cream-surface p-5 text-sm text-ink/80">
          The LinkedIn response is handled by the backend, which is not connected yet.{' '}
          <Link to="/login/alumni" className="font-semibold text-forest-green underline">
            Back to sign in
          </Link>
        </p>
      </AuthLayout>
    )
  }

  const onSubmit = (ev: FormEvent) => {
    ev.preventDefault()
    const e: Record<string, string> = {}
    if (f.name.trim().length < 2) e.name = 'Enter your name.'
    if (!isValidEmail(f.email)) e.email = 'Enter a valid email address.'
    if (!isLinkedInProfileUrl(f.profileUrl)) e.profileUrl = 'Enter your LinkedIn profile link, e.g. linkedin.com/in/your-name'
    setErrors(e)
    if (Object.keys(e).length) return

    const identity = { name: f.name.trim(), email: f.email.trim().toLowerCase(), profileUrl: f.profileUrl.trim() }
    const existing = loadAlumni(identity.email)

    if (existing) {
      setSession({
        role: 'alumni',
        name: existing.identity.name,
        email: identity.email,
        method: 'linkedin',
        verified: existing.status === 'verified',
      })
      navigate(existing.status === 'verified' ? '/dashboard/alumni' : '/verify/alumni', { replace: true })
      return
    }
    if (intent === 'login') {
      setErrors({ email: 'No alumni account found for this LinkedIn identity. Register first.' })
      return
    }
    savePendingIdentity(identity)
    navigate('/join/alumni/details', { replace: true })
  }

  return (
    <AuthLayout
      role="alumni"
      title="LinkedIn connected (simulated)"
      subtitle="Demo mode: in production LinkedIn returns these details after you approve access."
    >
      <div className="mb-6 flex items-start gap-3 rounded-xl border-2 border-dashed border-buttermilk bg-buttermilk/10 p-4 text-sm text-ink/75">
        <FlaskConical size={18} className="mt-0.5 shrink-0" />
        <p>
          No request is sent to LinkedIn. Enter the name, email and profile link you would sign in with.
        </p>
      </div>
      <form onSubmit={onSubmit} noValidate className="space-y-5">
        <TextInput label="Name" value={f.name} onChange={set('name')} error={errors.name} autoComplete="name" />
        <TextInput label="Email" type="email" value={f.email} onChange={set('email')} error={errors.email} autoComplete="email" />
        <TextInput
          label="LinkedIn profile link"
          value={f.profileUrl}
          onChange={set('profileUrl')}
          error={errors.profileUrl}
          placeholder="linkedin.com/in/your-name"
        />
        <PrimaryButton type="submit">
          Continue <ArrowRight size={18} />
        </PrimaryButton>
      </form>
    </AuthLayout>
  )
}
