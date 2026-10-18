import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Check } from 'lucide-react'
import AuthLayout from '../../components/auth/AuthLayout'
import { ChipInput, Field, OptionCard, PrimaryButton, SelectInput, TextInput, inputCls } from '../../components/ui/form'
import { INSTITUTION_NAME, loadPendingIdentity, saveAlumni, setSession } from '../../lib/demoSession'
import type { AlumniRecord } from '../../lib/demoSession'

const degrees = ['B.Tech', 'M.Tech', 'BCA', 'MCA', 'B.Des', 'MBA', 'PhD', 'Other']
const branches = ['Computer Science', 'Information Technology', 'Electronics & Communication', 'Electrical', 'Mechanical', 'Civil', 'Biotechnology', 'Mathematics', 'Design', 'Management']
const industries = ['Software & IT', 'Data & AI', 'Finance', 'Healthcare', 'Consulting', 'Product & Startups', 'Research & Academia', 'Government & Public Sector', 'Other']
const hours = ['1–2 hours', '3–5 hours', '6+ hours']
const modes = ['One-on-one chats', 'Mock interviews', 'Resume reviews', 'Group sessions']
const offerOptions = [
  { key: 'referrals', title: 'Referrals', description: 'Refer students into your organisation or network' },
  { key: 'mock-interviews', title: 'Mock interviews', description: 'Practice rounds with real feedback' },
  { key: 'resume-reviews', title: 'Resume reviews', description: 'Honest, specific resume feedback' },
  { key: 'internships', title: 'Internships', description: 'Openings at your company or team' },
]
const skillSuggestions = ['Python', 'Java', 'Machine Learning', 'Cloud', 'Product Management', 'Data Analysis', 'System Design', 'UI/UX']
const expertiseSuggestions = ['Career switching', 'Higher studies abroad', 'Interview prep', 'Startups', 'Research careers', 'Leadership']

const thisYear = new Date().getFullYear()
const gradYears = Array.from({ length: thisYear - 2000 + 1 }, (_, i) => String(thisYear - i))

/** Step 1 = IGDTUW education + current work (what we verify). Step 2 = mentoring and what they can offer. */
export default function AlumniDetails() {
  const navigate = useNavigate()
  const identity = loadPendingIdentity()
  const [step, setStep] = useState(0)
  const [f, setF] = useState({ gradYear: '', degree: '', branch: '', organization: '', jobTitle: '', industry: '', hours: '' })
  const [skills, setSkills] = useState<string[]>([])
  const [expertise, setExpertise] = useState<string[]>([])
  const [accepting, setAccepting] = useState(true)
  const [mentorModes, setMentorModes] = useState<string[]>([])
  const [offers, setOffers] = useState<string[]>([])
  const [confirm, setConfirm] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  if (!identity) return <Navigate to="/join/alumni" replace />

  const set = (k: keyof typeof f) => (e: { target: { value: string } }) => setF((p) => ({ ...p, [k]: e.target.value }))
  const toggle = (list: string[], v: string, put: (x: string[]) => void) => put(list.includes(v) ? list.filter((x) => x !== v) : [...list, v])

  const next = () => {
    const e: Record<string, string> = {}
    if (!f.gradYear) e.gradYear = 'Choose your graduation year.'
    if (!f.degree) e.degree = 'Choose your degree.'
    if (!f.branch) e.branch = 'Choose your branch.'
    if (f.organization.trim().length < 2) e.organization = 'Enter your current organisation.'
    if (f.jobTitle.trim().length < 2) e.jobTitle = 'Enter your job title.'
    if (!f.industry) e.industry = 'Choose your industry.'
    if (skills.length === 0) e.skills = 'Add at least one professional skill.'
    if (!confirm) e.confirm = 'Please confirm that you studied at IGDTUW.'
    setErrors(e)
    if (Object.keys(e).length === 0) setStep(1)
  }

  const submit = () => {
    const e: Record<string, string> = {}
    if (accepting && !f.hours) e.hours = 'Tell us roughly how much time you can give.'
    if (expertise.length === 0) e.expertise = 'Add at least one area you can guide students in.'
    setErrors(e)
    if (Object.keys(e).length) return

    const record: AlumniRecord = {
      identity,
      status: 'pending',
      gradYear: f.gradYear,
      degree: f.degree,
      branch: f.branch,
      organization: f.organization.trim(),
      jobTitle: f.jobTitle.trim(),
      industry: f.industry,
      skills,
      expertise,
      mentoring: { accepting, hoursPerMonth: accepting ? f.hours : '', modes: mentorModes },
      offers,
      submittedAt: new Date().toISOString(),
    }
    saveAlumni(record)
    setSession({ role: 'alumni', name: identity.name, email: identity.email, method: 'linkedin', verified: false })
    navigate('/verify/alumni', { replace: true })
  }

  return (
    <AuthLayout
      role="alumni"
      wide
      title={step === 0 ? 'Your IGDTUW years and your work' : 'Mentoring and what you can offer'}
      subtitle={step === 0 ? `Signed in as ${identity.name}. We verify the education details below against your LinkedIn profile.` : 'You can change all of this later from your dashboard.'}
    >
      <p className="mb-6 text-xs font-bold uppercase tracking-widest text-teal">Step {step + 1} of 2</p>

      {step === 0 && (
        <div className="space-y-6">
          <div>
            <p className="mb-1.5 text-sm font-semibold text-ink">Institution</p>
            <p className="rounded-xl border-2 border-forest-green/10 bg-cream-surface px-4 py-3 text-[0.97rem] text-ink/80">{INSTITUTION_NAME}</p>
          </div>
          <div className="grid gap-5 sm:grid-cols-3">
            <SelectInput label="Graduation year" options={gradYears} value={f.gradYear} onChange={set('gradYear')} error={errors.gradYear} />
            <SelectInput label="Degree" options={degrees} value={f.degree} onChange={set('degree')} error={errors.degree} />
            <SelectInput label="Branch" options={branches} value={f.branch} onChange={set('branch')} error={errors.branch} />
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <TextInput label="Current organisation" value={f.organization} onChange={set('organization')} error={errors.organization} autoComplete="organization" />
            <TextInput label="Job title" value={f.jobTitle} onChange={set('jobTitle')} error={errors.jobTitle} autoComplete="organization-title" />
          </div>
          <SelectInput label="Industry" options={industries} value={f.industry} onChange={set('industry')} error={errors.industry} />
          <ChipInput id="skills" label="Professional skills" value={skills} onChange={setSkills} suggestions={skillSuggestions} placeholder="Type a skill and press Enter" error={errors.skills} />

          <div>
            <label className="flex items-start gap-3 text-sm text-ink/80">
              <input type="checkbox" checked={confirm} onChange={(e) => setConfirm(e.target.checked)} aria-invalid={!!errors.confirm} className="mt-0.5 h-5 w-5 shrink-0 accent-forest-green" />
              <span>I studied at IGDTUW, and my LinkedIn profile lists it. I understand Everlink will check this before I can join.</span>
            </label>
            {errors.confirm && <p role="alert" className="mt-2 text-xs font-semibold text-red-700">{errors.confirm}</p>}
          </div>
        </div>
      )}

      {step === 1 && (
        <div className="space-y-6">
          <label className="flex cursor-pointer items-start gap-3 rounded-xl border-2 border-forest-green/20 p-4">
            <input type="checkbox" checked={accepting} onChange={(e) => setAccepting(e.target.checked)} className="mt-1 h-5 w-5 accent-forest-green" />
            <span>
              <span className="block font-bold text-forest-green">I am open to mentoring requests</span>
              <span className="block text-xs text-ink/70">You can pause this any time from your dashboard.</span>
            </span>
          </label>

          {accepting && (
            <>
              <SelectInput label="Time you can give each month" options={hours} value={f.hours} onChange={set('hours')} error={errors.hours} />
              <fieldset>
                <legend className="mb-2 text-sm font-semibold text-ink">How would you like to help?</legend>
                <div className="flex flex-wrap gap-2">
                  {modes.map((m) => (
                    <button
                      key={m}
                      type="button"
                      aria-pressed={mentorModes.includes(m)}
                      onClick={() => toggle(mentorModes, m, setMentorModes)}
                      className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition ${mentorModes.includes(m) ? 'bg-forest-green text-white-surface' : 'bg-cream-surface text-forest-green hover:bg-forest-green/10'}`}
                    >
                      {mentorModes.includes(m) && <Check size={14} strokeWidth={3} />} {m}
                    </button>
                  ))}
                </div>
              </fieldset>
            </>
          )}

          <ChipInput id="expertise" label="Areas you can guide students in" value={expertise} onChange={setExpertise} suggestions={expertiseSuggestions} placeholder="Type an area and press Enter" error={errors.expertise} />

          <fieldset>
            <legend className="mb-1 text-sm font-semibold text-ink">What can you offer students?</legend>
            <p className="mb-3 text-xs text-ink/60">Optional. Choose all that apply.</p>
            <div className="grid gap-3 sm:grid-cols-2">
              {offerOptions.map((o) => (
                <OptionCard key={o.key} selected={offers.includes(o.key)} onToggle={() => toggle(offers, o.key, setOffers)} title={o.title} description={o.description} icon={<Check size={20} />} />
              ))}
            </div>
          </fieldset>

          <Field label="Anything else students should know?" htmlFor="note" optional>
            <textarea id="note" rows={3} className={`${inputCls()} resize-y`} maxLength={300} />
          </Field>
        </div>
      )}

      <div className="mt-9 flex items-center justify-between">
        {step > 0 ? (
          <button type="button" onClick={() => setStep(0)} className="inline-flex items-center gap-2 text-sm font-semibold text-forest-green hover:text-teal">
            <ArrowLeft size={16} /> Back
          </button>
        ) : (
          <span />
        )}
        {step === 0 ? (
          <PrimaryButton type="button" onClick={next}>Continue <ArrowRight size={18} /></PrimaryButton>
        ) : (
          <PrimaryButton type="button" onClick={submit}>Submit for verification <ArrowRight size={18} /></PrimaryButton>
        )}
      </div>
    </AuthLayout>
  )
}
