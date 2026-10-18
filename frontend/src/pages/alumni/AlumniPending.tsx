import { Link, Navigate, useNavigate } from 'react-router-dom'
import { ArrowRight, Clock, FlaskConical, XCircle } from 'lucide-react'
import AuthLayout from '../../components/auth/AuthLayout'
import { PrimaryButton } from '../../components/ui/form'
import { DEMO_MODE, clearSession, loadAlumni, saveAlumni, setSession, useSession } from '../../lib/demoSession'

/** Shown to alumni until their IGDTUW education is confirmed. */
export default function AlumniPending() {
  const navigate = useNavigate()
  const session = useSession()
  if (!session || session.role !== 'alumni') return <Navigate to="/login/alumni" replace />
  const record = loadAlumni(session.email)
  if (!record) return <Navigate to="/join/alumni" replace />
  if (record.status === 'verified') return <Navigate to="/dashboard/alumni" replace />

  const rejected = record.status === 'rejected'

  const approve = () => {
    saveAlumni({ ...record, status: 'verified' })
    setSession({ ...session, verified: true })
    navigate('/dashboard/alumni')
  }

  return (
    <AuthLayout
      role="alumni"
      title={rejected ? 'We could not verify your education' : 'Verification in progress'}
      subtitle={rejected ? undefined : `Thanks, ${session.name.split(' ')[0]}. Your details are with us.`}
    >
      <div className="rounded-2xl bg-cream-surface p-6">
        <span className="grid h-12 w-12 place-items-center rounded-xl bg-forest-green text-buttermilk">
          {rejected ? <XCircle size={24} /> : <Clock size={24} />}
        </span>
        {rejected ? (
          <p className="mt-4 text-[0.97rem] leading-relaxed text-ink/85">
            We could not find IGDTUW on your LinkedIn profile or in our records. Add it to your profile and try again, or contact support.
          </p>
        ) : (
          <>
            <p className="mt-4 text-[0.97rem] leading-relaxed text-ink/85">
              We are checking that your LinkedIn profile lists IGDTUW ({record.degree}, {record.branch}, class of {record.gradYear}). You will not be able to
              use the alumni dashboard until this is confirmed.
            </p>
            <p className="mt-3 text-sm text-ink/65">We will email {record.identity.email} as soon as you are verified.</p>
          </>
        )}
      </div>

      {DEMO_MODE && !rejected && (
        <div className="mt-8 rounded-xl border-2 border-dashed border-buttermilk bg-buttermilk/10 p-4">
          <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-ink/70">
            <FlaskConical size={14} /> Demo mode
          </p>
          <p className="mt-1 text-sm text-ink/75">Real approval happens on the server. Preview the alumni dashboard by simulating it.</p>
          <PrimaryButton type="button" className="mt-4" onClick={approve}>
            Simulate approval <ArrowRight size={18} />
          </PrimaryButton>
        </div>
      )}

      <div className="mt-6 flex gap-5 text-sm">
        <Link to="/" className="font-semibold text-forest-green underline">Back to Home</Link>
        <button type="button" onClick={() => { clearSession(); navigate('/') }} className="font-semibold text-ink/60 underline">Sign out</button>
      </div>
    </AuthLayout>
  )
}
