import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, BookOpen, FlaskConical, Handshake, Users } from 'lucide-react'
import AuthLayout from '../../components/auth/AuthLayout'
import {
  ChipInput,
  Field,
  OptionCard,
  PasswordInput,
  PrimaryButton,
  SelectInput,
  TextInput,
  inputCls,
  passwordStrength,
} from '../../components/ui/form'
import { isValidEmail, saveSignup } from '../../lib/demoSession'

const degrees = ['B.Tech / B.E.', 'B.Sc', 'BCA', 'B.Des', 'M.Tech / M.E.', 'M.Sc', 'MCA', 'MBA', 'PhD', 'Other']
const years = ['1st year', '2nd year', '3rd year', '4th year', '5th year', 'Postgraduate']
const institutions = ['IGDTUW', 'IIT Delhi', 'DTU', 'NSUT', 'IIIT Delhi', 'Delhi University']
const departments = [
  'Computer Science',
  'Electronics & Communication',
  'Information Technology',
  'Electrical',
  'Mechanical',
  'Civil',
  'Biotechnology',
  'Mathematics',
  'Design',
  'Management',
]
const skillSuggestions = [
  'Python',
  'React',
  'Machine Learning',
  'Data Analysis',
  'Java',
  'C++',
  'UI/UX',
  'SQL',
  'Embedded Systems',
  'Public Speaking',
]
const interestSuggestions = [
  'Healthcare AI',
  'Open Source',
  'Cybersecurity',
  'Startups',
  'Robotics',
  'NLP',
  'Product Management',
  'Research',
  'Hackathons',
  'Neurotech',
]

const connectionTypes = [
  { key: 'mentors', title: 'Mentors', description: 'Seniors and alumni who can guide your path', icon: <BookOpen size={20} /> },
  {
    key: 'research',
    title: 'Research collaborators',
    description: 'Professors and projects that fit your interests',
    icon: <FlaskConical size={20} />,
  },
  { key: 'teammates', title: 'Teammates', description: 'Complementary skills for hackathons and startups', icon: <Users size={20} /> },
  { key: 'referrals', title: 'Referrals', description: 'People who can open doors to internships and jobs', icon: <Handshake size={20} /> },
]

type Errors = Partial<Record<string, string>>

export default function StudentRegister() {
  const navigate = useNavigate()
  const [f, setF] = useState({
    fullName: '',
    email: '',
    password: '',
    confirm: '',
    institution: '',
    department: '',
    degree: '',
    year: '',
    goals: '',
  })
  const [skills, setSkills] = useState<string[]>([])
  const [interests, setInterests] = useState<string[]>([])
  const [connect, setConnect] = useState<string[]>([])
  const [terms, setTerms] = useState(false)
  const [attempted, setAttempted] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const set = (k: keyof typeof f) => (e: { target: { value: string } }) => setF((p) => ({ ...p, [k]: e.target.value }))
  const toggleConnect = (k: string) => setConnect((c) => (c.includes(k) ? c.filter((x) => x !== k) : [...c, k]))

  // After the first submit attempt, errors update live as the user fixes fields.
  const validate = (): Errors => {
    const e: Errors = {}
    if (f.fullName.trim().length < 2) e.fullName = 'Enter your full name.'
    if (!isValidEmail(f.email)) e.email = 'Enter a valid email address.'
    if (f.password.length < 8) e.password = 'Use at least 8 characters.'
    else if (passwordStrength(f.password).score < 2) e.password = 'Add a number or mix upper and lower case.'
    if (f.confirm !== f.password) e.confirm = 'Passwords do not match.'
    if (!f.institution.trim()) e.institution = 'Enter your institution.'
    if (!f.department) e.department = 'Choose your department.'
    if (!f.degree) e.degree = 'Choose your degree.'
    if (!f.year) e.year = 'Choose your current year.'
    if (skills.length === 0) e.skills = 'Add at least one skill.'
    if (interests.length === 0) e.interests = 'Add at least one interest.'
    if (f.goals.trim().length < 10) e.goals = 'Tell us a little about your goals (a sentence is enough).'
    if (connect.length === 0) e.connect = 'Pick at least one type of connection.'
    if (!terms) e.terms = 'Please accept the terms to continue.'
    return e
  }

  const errors: Errors = attempted ? validate() : {}

  const onSubmit = (ev: FormEvent) => {
    ev.preventDefault()
    const e = validate()
    setAttempted(true)
    if (Object.keys(e).length) {
      // wait a tick so the error state has rendered before locating the first invalid field
      setTimeout(() => {
        const el = document.querySelector('[aria-invalid="true"], [data-error="true"]') as HTMLElement | null
        el?.scrollIntoView({ behavior: 'smooth', block: 'center' })
        el?.focus?.()
      }, 0)
      return
    }
    setSubmitting(true)
    // Demo only: no backend yet. Password is deliberately not stored.
    const { password: _p, confirm: _c, ...safe } = f
    saveSignup({ role: 'student', ...safe, skills, interests, connect })
    setTimeout(() => navigate(`/verify-email?email=${encodeURIComponent(f.email.trim())}`), 400)
  }

  return (
    <AuthLayout
      role="student"
      mode="register"
      wide
      title="Create your student account"
      subtitle="Takes about three minutes. The more we know, the better your matches will be."
    >
      <form onSubmit={onSubmit} noValidate className="space-y-10">
        {/* Account */}
        <fieldset className="space-y-5">
          <legend className="mb-1 text-xs font-bold uppercase tracking-widest text-teal">1 · Account</legend>
          <TextInput label="Full name" autoComplete="name" value={f.fullName} onChange={set('fullName')} error={errors.fullName} placeholder="Your full name" />
          <TextInput
            label="Email"
            type="email"
            autoComplete="email"
            value={f.email}
            onChange={set('email')}
            error={errors.email}
            placeholder="you@college.edu or personal email"
            hint="Institutional or personal. We'll send a verification link."
          />
          <div className="grid gap-5 sm:grid-cols-2">
            <PasswordInput label="Password" autoComplete="new-password" value={f.password} onChange={set('password')} error={errors.password} showStrength />
            <PasswordInput label="Confirm password" autoComplete="new-password" value={f.confirm} onChange={set('confirm')} error={errors.confirm} />
          </div>
        </fieldset>

        {/* Education */}
        <fieldset className="space-y-5">
          <legend className="mb-1 text-xs font-bold uppercase tracking-widest text-teal">2 · Education</legend>
          <TextInput
            label="Institution"
            list="institution-list"
            value={f.institution}
            onChange={set('institution')}
            error={errors.institution}
            placeholder="Start typing, or enter your own"
          />
          <datalist id="institution-list">
            {institutions.map((i) => (
              <option key={i} value={i} />
            ))}
          </datalist>
          <SelectInput label="Department" options={departments} value={f.department} onChange={set('department')} error={errors.department} />
          <div className="grid gap-5 sm:grid-cols-2">
            <SelectInput label="Degree" options={degrees} value={f.degree} onChange={set('degree')} error={errors.degree} />
            <SelectInput label="Current year" options={years} value={f.year} onChange={set('year')} error={errors.year} />
          </div>
        </fieldset>

        {/* Skills & interests */}
        <fieldset className="space-y-5">
          <legend className="mb-1 text-xs font-bold uppercase tracking-widest text-teal">3 · Skills and interests</legend>
          <ChipInput id="skills" label="Skills" value={skills} onChange={setSkills} suggestions={skillSuggestions} placeholder="Type a skill and press Enter" error={errors.skills} />
          <ChipInput id="interests" label="Interests" value={interests} onChange={setInterests} suggestions={interestSuggestions} placeholder="Type an interest and press Enter" error={errors.interests} />
        </fieldset>

        {/* Goals */}
        <fieldset className="space-y-5">
          <legend className="mb-1 text-xs font-bold uppercase tracking-widest text-teal">4 · Goals</legend>
          <Field label="Career or academic goals" htmlFor="goals" error={errors.goals} hint="For example: land a data science internship, or publish a first research paper.">
            <textarea
              id="goals"
              rows={4}
              value={f.goals}
              onChange={set('goals')}
              aria-invalid={!!errors.goals}
              aria-describedby={errors.goals ? 'goals-error' : undefined}
              className={`${inputCls(!!errors.goals)} resize-y`}
              placeholder="What do you want to achieve in the next year or two?"
            />
          </Field>
        </fieldset>

        {/* Connection types */}
        <fieldset>
          <legend className="mb-1 text-xs font-bold uppercase tracking-widest text-teal">5 · Who do you want to meet?</legend>
          <p className="mb-4 text-sm text-ink/65">Choose all that apply. You can change this any time.</p>
          <div className="grid gap-3 sm:grid-cols-2" data-error={!!errors.connect}>
            {connectionTypes.map((c) => (
              <OptionCard
                key={c.key}
                selected={connect.includes(c.key)}
                onToggle={() => toggleConnect(c.key)}
                title={c.title}
                description={c.description}
                icon={c.icon}
              />
            ))}
          </div>
          {errors.connect && (
            <p role="alert" className="mt-2 text-xs font-semibold text-red-700">
              {errors.connect}
            </p>
          )}
        </fieldset>

        {/* Terms + submit */}
        <div>
          <label className="flex items-start gap-3 text-sm text-ink/80">
            <input
              type="checkbox"
              checked={terms}
              onChange={(e) => setTerms(e.target.checked)}
              aria-invalid={!!errors.terms}
              className="mt-0.5 h-5 w-5 shrink-0 accent-forest-green"
            />
            <span>
              I agree to the{' '}
              <Link to="/about#terms" className="font-semibold text-forest-green underline">
                Terms
              </Link>{' '}
              and{' '}
              <Link to="/about#privacy" className="font-semibold text-forest-green underline">
                Privacy Policy
              </Link>
              .
            </span>
          </label>
          {errors.terms && (
            <p role="alert" className="mt-2 text-xs font-semibold text-red-700">
              {errors.terms}
            </p>
          )}

          <PrimaryButton type="submit" disabled={submitting} className="mt-6 w-full sm:w-auto">
            {submitting ? 'Creating account…' : 'Create account'}
            {!submitting && <ArrowRight size={18} />}
          </PrimaryButton>

          <p className="mt-5 text-sm text-ink/70">
            Already a member?{' '}
            <Link to="/login/student" className="font-semibold text-forest-green underline">
              Sign in
            </Link>
          </p>
        </div>
      </form>
    </AuthLayout>
  )
}
