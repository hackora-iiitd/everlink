import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Check, Compass, Sparkles } from 'lucide-react'
import AuthLayout from '../../components/auth/AuthLayout'
import { Field, PrimaryButton, SelectInput, TextInput, inputCls } from '../../components/ui/form'
import { loadSignup } from '../../lib/demoSession'

const steps = ['Your profile', 'Your first goal', 'All set']

const goalExamples = [
  'Find a mentor in data science',
  'Get a research internship in healthcare AI',
  'Find teammates for a hackathon',
  'Get a referral for a software internship',
]

const timeframes = ['This month', 'This semester', 'Within a year', 'No fixed timeline']

const visibilityOptions = [
  { key: 'members', title: 'Everlink members', description: 'Signed-in members can find and view your profile.' },
  { key: 'connections', title: 'My connections only', description: 'Only people you have connected with can see details.' },
  { key: 'public', title: 'Public preview', description: 'A limited preview (name, department, skills) can appear in Explore.' },
]

export default function StudentOnboarding() {
  const navigate = useNavigate()
  const saved = loadSignup()
  const firstName = (saved?.fullName ?? '').split(' ')[0]

  const [step, setStep] = useState(0)
  const [headline, setHeadline] = useState('')
  const [bio, setBio] = useState('')
  const [linkedin, setLinkedin] = useState('')
  const [github, setGithub] = useState('')
  const [visibility, setVisibility] = useState('members')
  const [goal, setGoal] = useState('')
  const [timeframe, setTimeframe] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})

  const next = () => {
    const e: Record<string, string> = {}
    if (step === 0) {
      if (headline.trim().length < 5) e.headline = 'Add a short headline, e.g. "ECE student exploring ML".'
    }
    if (step === 1) {
      if (goal.trim().length < 10) e.goal = 'Describe what you want to achieve in a sentence.'
      if (!timeframe) e.timeframe = 'Pick a rough timeframe.'
    }
    setErrors(e)
    if (Object.keys(e).length === 0) setStep((s) => s + 1)
  }

  const visibilityLabel = visibilityOptions.find((v) => v.key === visibility)?.title

  return (
    <AuthLayout
      role="student"
      wide
      title={step === 2 ? `You're all set${firstName ? `, ${firstName}` : ''}` : 'Set up your profile'}
      subtitle={
        step === 2
          ? 'Your first goal is saved. Next, we show you who and what fits it.'
          : 'Two quick steps, and your first recommendations are ready.'
      }
    >
      {/* Stepper */}
      <ol className="mb-9 flex items-center" aria-label="Progress">
        {steps.map((label, i) => (
          <li key={label} className="flex flex-1 items-center last:flex-none">
            <span className="flex items-center gap-2.5">
              <span
                aria-current={i === step ? 'step' : undefined}
                className={`grid h-8 w-8 place-items-center rounded-full text-sm font-bold ${
                  i < step
                    ? 'bg-forest-green text-white-surface'
                    : i === step
                      ? 'bg-buttermilk text-ink'
                      : 'bg-ink/10 text-ink/50'
                }`}
              >
                {i < step ? <Check size={15} strokeWidth={3} /> : i + 1}
              </span>
              <span className={`hidden text-sm font-semibold sm:block ${i <= step ? 'text-forest-green' : 'text-ink/45'}`}>
                {label}
              </span>
            </span>
            {i < steps.length - 1 && (
              <span className={`mx-3 h-0.5 flex-1 rounded ${i < step ? 'bg-forest-green' : 'bg-ink/10'}`} />
            )}
          </li>
        ))}
      </ol>

      {/* Step 1 */}
      {step === 0 && (
        <div className="space-y-5">
          <TextInput
            label="Headline"
            value={headline}
            onChange={(e) => setHeadline(e.target.value)}
            error={errors.headline}
            placeholder="e.g. ECE student exploring ML and healthcare"
            maxLength={90}
          />
          <Field label="About you" htmlFor="bio" optional hint="What are you working on or curious about? This helps explain your matches.">
            <textarea
              id="bio"
              rows={4}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className={`${inputCls()} resize-y`}
              maxLength={400}
            />
          </Field>
          <div className="grid gap-5 sm:grid-cols-2">
            <TextInput label="LinkedIn" optional value={linkedin} onChange={(e) => setLinkedin(e.target.value)} placeholder="linkedin.com/in/…" />
            <TextInput label="GitHub" optional value={github} onChange={(e) => setGithub(e.target.value)} placeholder="github.com/…" />
          </div>

          <fieldset>
            <legend className="mb-1 text-sm font-semibold text-ink">Who can see your profile?</legend>
            <p className="mb-3 text-xs text-ink/60">You can change this any time in Settings. Nothing is public unless you choose it.</p>
            <div className="space-y-2.5" role="radiogroup">
              {visibilityOptions.map((v) => (
                <label
                  key={v.key}
                  className={`flex cursor-pointer items-start gap-3 rounded-xl border-2 p-4 transition ${
                    visibility === v.key ? 'border-forest-green bg-cream-surface' : 'border-forest-green/20 hover:border-forest-green/50'
                  }`}
                >
                  <input
                    type="radio"
                    name="visibility"
                    checked={visibility === v.key}
                    onChange={() => setVisibility(v.key)}
                    className="mt-1 h-4 w-4 accent-forest-green"
                  />
                  <span>
                    <span className="block text-[0.97rem] font-bold text-forest-green">{v.title}</span>
                    <span className="block text-xs text-ink/70">{v.description}</span>
                  </span>
                </label>
              ))}
            </div>
          </fieldset>
        </div>
      )}

      {/* Step 2 */}
      {step === 1 && (
        <div className="space-y-5">
          <div className="rounded-2xl bg-forest-green p-6 text-white-surface">
            <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-buttermilk">
              <Compass size={18} /> Intent Compass
            </div>
            <label htmlFor="goal" className="mt-3 block font-display text-2xl font-extrabold">
              What are you looking to achieve?
            </label>
            <textarea
              id="goal"
              rows={3}
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              aria-invalid={!!errors.goal}
              aria-describedby={errors.goal ? 'goal-error' : undefined}
              placeholder="e.g. I want a research internship in healthcare AI using Python"
              className="mt-4 w-full resize-y rounded-xl border-2 border-transparent bg-white-surface px-4 py-3 text-[0.97rem] text-ink outline-none placeholder:text-ink/40 focus:border-buttermilk"
            />
            {errors.goal && (
              <p id="goal-error" role="alert" className="mt-2 text-sm font-semibold text-buttermilk">
                {errors.goal}
              </p>
            )}
            <div className="mt-4 flex flex-wrap gap-2">
              {goalExamples.map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setGoal(g)}
                  className="rounded-full bg-white-surface/15 px-3 py-1.5 text-xs font-semibold transition hover:bg-white-surface/30"
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          <SelectInput label="When do you want this by?" options={timeframes} value={timeframe} onChange={(e) => setTimeframe(e.target.value)} error={errors.timeframe} />
        </div>
      )}

      {/* Step 3 */}
      {step === 2 && (
        <div className="space-y-5">
          <div className="rounded-2xl bg-cream-surface p-6">
            <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-teal">
              <Sparkles size={15} /> Your first goal
            </p>
            <p className="mt-2 font-display text-xl font-bold text-forest-green">{goal}</p>
            <p className="mt-1 text-sm text-ink/70">{timeframe}</p>
          </div>
          <dl className="grid gap-4 rounded-2xl border border-forest-green/15 p-6 text-sm sm:grid-cols-2">
            <div>
              <dt className="font-semibold text-ink/55">Headline</dt>
              <dd className="mt-0.5 font-semibold text-ink">{headline}</dd>
            </div>
            <div>
              <dt className="font-semibold text-ink/55">Profile visible to</dt>
              <dd className="mt-0.5 font-semibold text-ink">{visibilityLabel}</dd>
            </div>
          </dl>
          <PrimaryButton type="button" className="w-full sm:w-auto" onClick={() => navigate('/dashboard/student')}>
            See my recommendations <ArrowRight size={18} />
          </PrimaryButton>
        </div>
      )}

      {/* Nav */}
      {step < 2 && (
        <div className="mt-9 flex items-center justify-between">
          {step > 0 ? (
            <button
              type="button"
              onClick={() => setStep((s) => s - 1)}
              className="inline-flex items-center gap-2 text-sm font-semibold text-forest-green hover:text-teal"
            >
              <ArrowLeft size={16} /> Back
            </button>
          ) : (
            <button
              type="button"
              onClick={() => navigate('/dashboard/student')}
              className="text-sm font-semibold text-ink/55 underline hover:text-forest-green"
            >
              Skip for now
            </button>
          )}
          <PrimaryButton type="button" onClick={next}>
            {step === 1 ? 'Save my goal' : 'Continue'} <ArrowRight size={18} />
          </PrimaryButton>
        </div>
      )}
    </AuthLayout>
  )
}
