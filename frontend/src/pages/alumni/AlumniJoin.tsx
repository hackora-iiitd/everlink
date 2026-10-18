import { Link } from 'react-router-dom'
import { Check, ShieldCheck } from 'lucide-react'
import AuthLayout from '../../components/auth/AuthLayout'
import LinkedInButton from '../../components/auth/LinkedInButton'

const steps = [
  { title: 'Connect LinkedIn', body: 'Confirms who you are. We only receive your name, email and profile link.' },
  { title: 'Tell us about your IGDTUW years', body: 'Graduation year, degree and branch, plus your work today.' },
  { title: 'We verify your education', body: 'We check your LinkedIn profile for IGDTUW before you can join.' },
  { title: 'Start mentoring', body: 'Set your availability and share what you can offer.' },
]

/** Alumni registration entry: LinkedIn is the only way in. */
export default function AlumniJoin() {
  return (
    <AuthLayout
      role="alumni"
      mode="register"
      wide
      title="Join as an alumna"
      subtitle="Everlink alumni are verified IGDTUW graduates, so students know who they are talking to."
    >
      <ol className="space-y-4">
        {steps.map((s, i) => (
          <li key={s.title} className="flex gap-4">
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-buttermilk text-sm font-bold text-ink">
              {i + 1}
            </span>
            <span>
              <span className="block font-bold text-forest-green">{s.title}</span>
              <span className="block text-sm text-ink/70">{s.body}</span>
            </span>
          </li>
        ))}
      </ol>

      <div className="mt-8 rounded-2xl bg-cream-surface p-6">
        <p className="flex items-center gap-2 text-sm font-bold text-forest-green">
          <ShieldCheck size={18} /> Only IGDTUW alumni can join
        </p>
        <ul className="mt-3 space-y-1.5 text-sm text-ink/75">
          {['No password to create or leak', 'A LinkedIn account alone is not enough to get in', 'Your profile stays private until you choose otherwise'].map((t) => (
            <li key={t} className="flex items-start gap-2">
              <Check size={15} className="mt-0.5 shrink-0 text-teal" strokeWidth={3} /> {t}
            </li>
          ))}
        </ul>
        <LinkedInButton intent="register" className="mt-5 w-full sm:w-auto" />
      </div>

      <p className="mt-6 text-sm text-ink/70">
        Already verified?{' '}
        <Link to="/login/alumni" className="font-semibold text-forest-green underline">
          Sign in
        </Link>
      </p>
    </AuthLayout>
  )
}
