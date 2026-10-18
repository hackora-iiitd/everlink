import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, BookOpen, FlaskConical, GraduationCap, Handshake, Users } from 'lucide-react'
import AuthLayout from '../../components/auth/AuthLayout'
import { ChipInput, Field, OptionCard, PasswordInput, PrimaryButton, SelectInput, TextInput, inputCls, passwordStrength } from '../../components/ui/form'
import { IGDTUW_DOMAIN, INSTITUTION_NAME, igdtuwEmailError, saveSignup } from '../../lib/demoSession'

const departments = ['Computer Science', 'Information Technology', 'Electronics & Communication', 'Electrical', 'Mechanical', 'Civil', 'Biotechnology', 'Mathematics', 'Design', 'Management', 'Humanities & Sciences']
const designations = ['Assistant Professor', 'Associate Professor', 'Professor', 'Visiting Faculty', 'Other']
const interestSuggestions = ['Healthcare AI', 'Machine Learning', 'Computer Vision', 'NLP', 'Cybersecurity', 'VLSI', 'Robotics', 'Sustainability']
const skillSuggestions = ['Python', 'Statistics', 'Signal Processing', 'MATLAB', 'Deep Learning', 'Embedded Systems', 'Research Methods']

const collabOptions = [
  { key: 'research-assistants', title: 'Student research assistants', description: 'Students who join a project team', icon: <FlaskConical size={20} /> },
  { key: 'thesis', title: 'Thesis supervision', description: 'Guide final-year and postgraduate work', icon: <GraduationCap size={20} /> },
  { key: 'faculty', title: 'Faculty collaboration', description: 'Co-investigators across departments', icon: <Users size={20} /> },
  { key: 'alumni', title: 'Alumni and industry', description: 'Alumni partners for applied research', icon: <Handshake size={20} /> },
  { key: 'mentorship', title: 'Academic mentorship', description: 'Guidance on courses and research careers', icon: <BookOpen size={20} /> },
]

export default function ProfessorRegister() {
  const navigate = useNavigate()
  const [f, setF] = useState({ fullName: '', email: '', password: '', confirm: '', department: '', designation: '', publications: '', currentProjects: '' })
  const [interests, setInterests] = useState<string[]>([])
  const [skills, setSkills] = useState<string[]>([])
  const [collab, setCollab] = useState<string[]>([])
  const [terms, setTerms] = useState(false)
  const [attempted, setAttempted] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const set = (k: keyof typeof f) => (e: { target: { value: string } }) => setF((p) => ({ ...p, [k]: e.target.value }))
  const toggle = (k: string) => setCollab((c) => (c.includes(k) ? c.filter((x) => x !== k) : [...c, k]))

  const validate = () => {
    const e: Record<string, string> = {}
    if (f.fullName.trim().length < 2) e.fullName = 'Enter your full name.'
    const emailErr = igdtuwEmailError(f.email)
    if (emailErr) e.email = emailErr
    if (f.password.length < 8) e.password = 'Use at least 8 characters.'
    else if (passwordStrength(f.password).score < 2) e.password = 'Add a number or mix upper and lower case.'
    if (f.confirm !== f.password) e.confirm = 'Passwords do not match.'
    if (!f.department) e.department = 'Choose your department.'
    if (!f.designation) e.designation = 'Choose your designation.'
    if (interests.length === 0) e.interests = 'Add at least one research interest.'
    if (skills.length === 0) e.skills = 'Add at least one skill or area of expertise.'
    if (collab.length === 0) e.collab = 'Pick at least one collaboration preference.'
    if (!terms) e.terms = 'Please accept the terms to continue.'
    return e
  }
  const errors = attempted ? validate() : {}

  const onSubmit = (ev: FormEvent) => {
    ev.preventDefault()
    const e = validate()
    setAttempted(true)
    if (Object.keys(e).length) {
      setTimeout(() => {
        const el = document.querySelector('[aria-invalid="true"], [data-error="true"]') as HTMLElement | null
        el?.scrollIntoView({ behavior: 'smooth', block: 'center' })
        el?.focus?.()
      }, 0)
      return
    }
    setSubmitting(true)
    const { password: _p, confirm: _c, ...safe } = f
    saveSignup({ role: 'professor', ...safe, institution: 'IGDTUW', interests, skills, collab })
    setTimeout(() => navigate(`/verify-email?email=${encodeURIComponent(f.email.trim())}`), 400)
  }

  const legend = 'mb-1 text-xs font-bold uppercase tracking-widest text-teal'

  return (
    <AuthLayout role="professor" mode="register" wide title="Create your faculty account" subtitle="Everlink is open to IGDTUW faculty. Use your institutional email.">
      <form onSubmit={onSubmit} noValidate className="space-y-10">
        <fieldset className="space-y-5">
          <legend className={legend}>1 · Account</legend>
          <TextInput label="Full name" autoComplete="name" value={f.fullName} onChange={set('fullName')} error={errors.fullName} placeholder="As you would like students to see it" />
          <TextInput label="IGDTUW email" type="email" autoComplete="email" value={f.email} onChange={set('email')} error={errors.email} placeholder={`name@${IGDTUW_DOMAIN}`} hint="We'll send a verification link to this address." />
          <div className="grid gap-5 sm:grid-cols-2">
            <PasswordInput label="Password" autoComplete="new-password" value={f.password} onChange={set('password')} error={errors.password} showStrength />
            <PasswordInput label="Confirm password" autoComplete="new-password" value={f.confirm} onChange={set('confirm')} error={errors.confirm} />
          </div>
        </fieldset>

        <fieldset className="space-y-5">
          <legend className={legend}>2 · Institution</legend>
          <div>
            <p className="mb-1.5 text-sm font-semibold text-ink">Institution</p>
            <p className="rounded-xl border-2 border-forest-green/10 bg-cream-surface px-4 py-3 text-[0.97rem] text-ink/80">{INSTITUTION_NAME}</p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <SelectInput label="Department" options={departments} value={f.department} onChange={set('department')} error={errors.department} />
            <SelectInput label="Designation" options={designations} value={f.designation} onChange={set('designation')} error={errors.designation} />
          </div>
        </fieldset>

        <fieldset className="space-y-5">
          <legend className={legend}>3 · Research</legend>
          <ChipInput id="interests" label="Research interests" value={interests} onChange={setInterests} suggestions={interestSuggestions} placeholder="Type an interest and press Enter" error={errors.interests} />
          <ChipInput id="skills" label="Skills and expertise" value={skills} onChange={setSkills} suggestions={skillSuggestions} placeholder="Type a skill and press Enter" error={errors.skills} />
          <Field label="Selected publications" htmlFor="pubs" optional hint="One per line. Titles or links are fine.">
            <textarea id="pubs" rows={3} value={f.publications} onChange={set('publications')} className={`${inputCls()} resize-y`} />
          </Field>
          <Field label="Current research projects" htmlFor="current" optional hint="A line or two each. You can publish openings with full details after sign-up.">
            <textarea id="current" rows={3} value={f.currentProjects} onChange={set('currentProjects')} className={`${inputCls()} resize-y`} />
          </Field>
        </fieldset>

        <fieldset>
          <legend className={legend}>4 · Collaboration and mentorship</legend>
          <p className="mb-4 text-sm text-ink/65">Choose all that apply. You can change this any time.</p>
          <div className="grid gap-3 sm:grid-cols-2" data-error={!!errors.collab}>
            {collabOptions.map((c) => (
              <OptionCard key={c.key} selected={collab.includes(c.key)} onToggle={() => toggle(c.key)} title={c.title} description={c.description} icon={c.icon} />
            ))}
          </div>
          {errors.collab && <p role="alert" className="mt-2 text-xs font-semibold text-red-700">{errors.collab}</p>}
        </fieldset>

        <div>
          <label className="flex items-start gap-3 text-sm text-ink/80">
            <input type="checkbox" checked={terms} onChange={(e) => setTerms(e.target.checked)} aria-invalid={!!errors.terms} className="mt-0.5 h-5 w-5 shrink-0 accent-forest-green" />
            <span>
              I agree to the <Link to="/about#terms" className="font-semibold text-forest-green underline">Terms</Link> and <Link to="/about#privacy" className="font-semibold text-forest-green underline">Privacy Policy</Link>.
            </span>
          </label>
          {errors.terms && <p role="alert" className="mt-2 text-xs font-semibold text-red-700">{errors.terms}</p>}
          <PrimaryButton type="submit" disabled={submitting} className="mt-6 w-full sm:w-auto">
            {submitting ? 'Creating account…' : 'Create account'}
            {!submitting && <ArrowRight size={18} />}
          </PrimaryButton>
          <p className="mt-5 text-sm text-ink/70">
            Already a member? <Link to="/login/professor" className="font-semibold text-forest-green underline">Sign in</Link>
          </p>
        </div>
      </form>
    </AuthLayout>
  )
}
