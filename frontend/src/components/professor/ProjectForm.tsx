import { useState } from 'react'
import type { FormEvent } from 'react'
import { ChipInput, Field, PrimaryButton, SelectInput, TextInput, inputCls } from '../ui/form'
import { durations, researchDomains } from '../../lib/types'
import type { Project } from '../../lib/types'

const skillSuggestions = ['Python', 'Machine Learning', 'Data Analysis', 'Signal Processing', 'C++', 'Embedded Systems', 'Statistics', 'Literature Review']

type Props = {
  initial?: Project
  submitLabel: string
  onSubmit: (p: Project) => void
  onCancel?: () => void
}

/** One form for creating or editing a research project, used in onboarding and in the dashboard. */
export default function ProjectForm({ initial, submitLabel, onSubmit, onCancel }: Props) {
  const [f, setF] = useState({
    title: initial?.title ?? '',
    abstract: initial?.abstract ?? '',
    domain: initial?.domain ?? '',
    prerequisites: initial?.prerequisites ?? '',
    duration: initial?.duration ?? '',
    positions: String(initial?.positions ?? 1),
    instructions: initial?.instructions ?? '',
    closingDate: initial?.closingDate ?? '',
  })
  const [skills, setSkills] = useState<string[]>(initial?.skills ?? [])
  const [errors, setErrors] = useState<Record<string, string>>({})
  const set = (k: keyof typeof f) => (e: { target: { value: string } }) => setF((p) => ({ ...p, [k]: e.target.value }))

  const submit = (ev: FormEvent) => {
    ev.preventDefault()
    const e: Record<string, string> = {}
    if (f.title.trim().length < 5) e.title = 'Give the project a clear title.'
    if (f.abstract.trim().length < 40) e.abstract = 'Write an abstract of a few sentences (at least 40 characters).'
    if (!f.domain) e.domain = 'Choose a research domain.'
    if (skills.length === 0) e.skills = 'List at least one required skill.'
    if (!f.duration) e.duration = 'Choose an expected duration.'
    const n = Number(f.positions)
    if (!Number.isInteger(n) || n < 1 || n > 20) e.positions = 'Enter between 1 and 20 positions.'
    if (f.instructions.trim().length < 10) e.instructions = 'Tell applicants how to apply.'
    setErrors(e)
    if (Object.keys(e).length) return
    onSubmit({
      id: initial?.id ?? `p-${Date.now()}`,
      title: f.title.trim(),
      abstract: f.abstract.trim(),
      domain: f.domain,
      skills,
      prerequisites: f.prerequisites.trim(),
      duration: f.duration,
      positions: n,
      instructions: f.instructions.trim(),
      closingDate: f.closingDate || undefined,
      status: initial?.status ?? 'open',
    })
  }

  return (
    <form onSubmit={submit} noValidate className="space-y-5">
      <TextInput label="Project title" value={f.title} onChange={set('title')} error={errors.title} maxLength={120} />
      <Field label="Abstract" htmlFor="abstract" error={errors.abstract} hint="What is the project and what will a student work on?">
        <textarea id="abstract" rows={4} value={f.abstract} onChange={set('abstract')} aria-invalid={!!errors.abstract} className={`${inputCls(!!errors.abstract)} resize-y`} maxLength={1200} />
      </Field>
      <div className="grid gap-5 sm:grid-cols-2">
        <SelectInput label="Research domain" options={researchDomains} value={f.domain} onChange={set('domain')} error={errors.domain} />
        <SelectInput label="Expected duration" options={durations} value={f.duration} onChange={set('duration')} error={errors.duration} />
      </div>
      <ChipInput id="project-skills" label="Required skills" value={skills} onChange={setSkills} suggestions={skillSuggestions} placeholder="Type a skill and press Enter" error={errors.skills} />
      <Field label="Prerequisites" htmlFor="prereq" optional hint="Courses, prior work or experience applicants should have.">
        <textarea id="prereq" rows={2} value={f.prerequisites} onChange={set('prerequisites')} className={`${inputCls()} resize-y`} maxLength={500} />
      </Field>
      <div className="grid gap-5 sm:grid-cols-2">
        <TextInput label="Available positions" type="number" min={1} max={20} value={f.positions} onChange={set('positions')} error={errors.positions} />
        <TextInput label="Closing date" type="date" optional value={f.closingDate} onChange={set('closingDate')} />
      </div>
      <Field label="How to apply" htmlFor="instructions" error={errors.instructions} hint="For example: send a short statement of interest and your transcript.">
        <textarea id="instructions" rows={3} value={f.instructions} onChange={set('instructions')} aria-invalid={!!errors.instructions} className={`${inputCls(!!errors.instructions)} resize-y`} maxLength={600} />
      </Field>
      <div className="flex flex-wrap items-center gap-4">
        <PrimaryButton type="submit">{submitLabel}</PrimaryButton>
        {onCancel && (
          <button type="button" onClick={onCancel} className="text-sm font-semibold text-ink/60 underline hover:text-forest-green">
            Cancel
          </button>
        )}
      </div>
    </form>
  )
}
