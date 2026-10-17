import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { ArrowLeft, MailCheck } from 'lucide-react'
import AuthLayout from '../../components/auth/AuthLayout'
import { roles } from '../../components/auth/roles'
import type { RoleKey } from '../../components/auth/roles'
import { PrimaryButton, TextInput } from '../../components/ui/form'
import { isValidEmail } from '../../lib/demoSession'

export default function ForgotPassword() {
  const [params] = useSearchParams()
  const q = params.get('role')
  const role: RoleKey = q === 'alumni' || q === 'professor' ? q : 'student'
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [sent, setSent] = useState(false)

  const onSubmit = (ev: FormEvent) => {
    ev.preventDefault()
    if (!isValidEmail(email)) {
      setError('Enter the email you signed up with.')
      return
    }
    setError('')
    setSent(true)
  }

  return (
    <AuthLayout
      role={role}
      title={sent ? 'Check your inbox' : 'Reset your password'}
      subtitle={
        sent
          ? undefined
          : "Enter your email and we'll send you a link to choose a new password."
      }
    >
      {sent ? (
        <div className="rounded-2xl bg-cream-surface p-6">
          <MailCheck size={30} className="text-forest-green" />
          <p className="mt-3 text-[0.97rem] leading-relaxed text-ink/85">
            If an account exists for <strong>{email.trim()}</strong>, a reset link is on its way. It can
            take a minute or two to arrive.
          </p>
          <button
            type="button"
            onClick={() => setSent(false)}
            className="mt-4 text-sm font-semibold text-forest-green underline"
          >
            Use a different email
          </button>
        </div>
      ) : (
        <form onSubmit={onSubmit} noValidate className="space-y-5">
          <TextInput
            label="Email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={error}
            placeholder="you@example.com"
          />
          <PrimaryButton type="submit" className="w-full">
            Send reset link
          </PrimaryButton>
        </form>
      )}

      <Link
        to={roles[role].loginPath}
        className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-forest-green hover:text-teal"
      >
        <ArrowLeft size={16} /> Back to sign in
      </Link>
    </AuthLayout>
  )
}
