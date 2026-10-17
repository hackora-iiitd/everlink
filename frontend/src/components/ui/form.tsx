import { useId, useState } from 'react'
import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes } from 'react'
import { Check, Eye, EyeOff, Plus, X } from 'lucide-react'

export const inputCls = (invalid?: boolean) =>
  `w-full rounded-xl border-2 bg-white-surface px-4 py-3 text-[0.97rem] text-ink placeholder:text-ink/40 outline-none transition focus:border-forest-green focus:ring-4 focus:ring-forest-green/10 ${
    invalid ? 'border-red-600' : 'border-forest-green/20'
  }`

type FieldProps = {
  label: string
  htmlFor: string
  error?: string
  hint?: string
  optional?: boolean
  children: ReactNode
}

export function Field({ label, htmlFor, error, hint, optional, children }: FieldProps) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-1.5 flex items-baseline gap-2 text-sm font-semibold text-ink">
        {label}
        {optional && <span className="text-xs font-normal text-ink/50">optional</span>}
      </label>
      {children}
      {hint && !error && <p className="mt-1.5 text-xs text-ink/60">{hint}</p>}
      {error && (
        <p id={`${htmlFor}-error`} role="alert" className="mt-1.5 text-xs font-semibold text-red-700">
          {error}
        </p>
      )}
    </div>
  )
}

type TextInputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string
  error?: string
  hint?: string
  optional?: boolean
}

export function TextInput({ label, error, hint, optional, id, ...rest }: TextInputProps) {
  const auto = useId()
  const fid = id ?? auto
  return (
    <Field label={label} htmlFor={fid} error={error} hint={hint} optional={optional}>
      <input
        id={fid}
        aria-invalid={!!error}
        aria-describedby={error ? `${fid}-error` : undefined}
        className={inputCls(!!error)}
        {...rest}
      />
    </Field>
  )
}

type SelectInputProps = SelectInputBase & { options: string[]; placeholder?: string }
type SelectInputBase = SelectHTMLAttributes<HTMLSelectElement> & {
  label: string
  error?: string
}

export function SelectInput({ label, error, options, placeholder = 'Select', id, ...rest }: SelectInputProps) {
  const auto = useId()
  const fid = id ?? auto
  return (
    <Field label={label} htmlFor={fid} error={error}>
      <select
        id={fid}
        aria-invalid={!!error}
        aria-describedby={error ? `${fid}-error` : undefined}
        className={inputCls(!!error)}
        {...rest}
      >
        <option value="">{placeholder}</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </Field>
  )
}

export function passwordStrength(pw: string): { score: number; label: string } {
  let score = 0
  if (pw.length >= 8) score++
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++
  if (/\d/.test(pw)) score++
  if (/[^A-Za-z0-9]/.test(pw) || pw.length >= 12) score++
  return { score, label: ['Too short', 'Weak', 'Okay', 'Good', 'Strong'][score] }
}

type PasswordInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> & {
  label: string
  error?: string
  showStrength?: boolean
  hint?: string
}

export function PasswordInput({ label, error, showStrength, hint, id, value, ...rest }: PasswordInputProps) {
  const auto = useId()
  const fid = id ?? auto
  const [show, setShow] = useState(false)
  const strength = passwordStrength(String(value ?? ''))
  const bars = ['bg-red-500', 'bg-orange-500', 'bg-buttermilk', 'bg-teal', 'bg-forest-green']

  return (
    <Field label={label} htmlFor={fid} error={error} hint={hint}>
      <div className="relative">
        <input
          id={fid}
          type={show ? 'text' : 'password'}
          value={value}
          aria-invalid={!!error}
          aria-describedby={error ? `${fid}-error` : undefined}
          className={`${inputCls(!!error)} pr-12`}
          {...rest}
        />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          aria-label={show ? 'Hide password' : 'Show password'}
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-ink/55 hover:text-forest-green"
        >
          {show ? <EyeOff size={19} /> : <Eye size={19} />}
        </button>
      </div>
      {showStrength && String(value ?? '').length > 0 && (
        <div className="mt-2 flex items-center gap-3">
          <div className="flex flex-1 gap-1.5">
            {[1, 2, 3, 4].map((i) => (
              <span
                key={i}
                className={`h-1.5 flex-1 rounded-full ${i <= strength.score ? bars[strength.score] : 'bg-ink/10'}`}
              />
            ))}
          </div>
          <span className="w-16 text-right text-xs font-semibold text-ink/65">{strength.label}</span>
        </div>
      )}
    </Field>
  )
}

type ChipInputProps = {
  label: string
  id: string
  value: string[]
  onChange: (v: string[]) => void
  suggestions: string[]
  placeholder?: string
  error?: string
  hint?: string
}

/** Pick from suggestions or type your own and press Enter / comma. */
export function ChipInput({ label, id, value, onChange, suggestions, placeholder, error, hint }: ChipInputProps) {
  const [draft, setDraft] = useState('')
  const has = (t: string) => value.some((v) => v.toLowerCase() === t.toLowerCase())

  const add = (raw: string) => {
    const t = raw.trim().replace(/,$/, '').trim()
    if (t && !has(t)) onChange([...value, t])
    setDraft('')
  }
  const remove = (t: string) => onChange(value.filter((v) => v !== t))

  return (
    <Field label={label} htmlFor={id} error={error} hint={hint}>
      <div
        className={`rounded-xl border-2 bg-white-surface p-2.5 transition focus-within:border-forest-green focus-within:ring-4 focus-within:ring-forest-green/10 ${
          error ? 'border-red-600' : 'border-forest-green/20'
        }`}
      >
        <div className="flex flex-wrap gap-2">
          {value.map((t) => (
            <span
              key={t}
              className="inline-flex items-center gap-1.5 rounded-full bg-forest-green py-1 pl-3 pr-1.5 text-sm font-semibold text-white-surface"
            >
              {t}
              <button
                type="button"
                onClick={() => remove(t)}
                aria-label={`Remove ${t}`}
                className="grid h-5 w-5 place-items-center rounded-full bg-white-surface/20 hover:bg-white-surface/40"
              >
                <X size={12} />
              </button>
            </span>
          ))}
          <input
            id={id}
            value={draft}
            placeholder={value.length ? 'Add another…' : placeholder}
            onChange={(e) => {
              if (e.target.value.endsWith(',')) add(e.target.value)
              else setDraft(e.target.value)
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                add(draft)
              } else if (e.key === 'Backspace' && !draft && value.length) {
                remove(value[value.length - 1])
              }
            }}
            onBlur={() => draft.trim() && add(draft)}
            className="min-w-[8rem] flex-1 bg-transparent px-1.5 py-1 text-[0.97rem] outline-none placeholder:text-ink/40"
          />
        </div>
      </div>
      <div className="mt-2.5 flex flex-wrap gap-1.5" aria-label={`${label} suggestions`}>
        {suggestions
          .filter((s) => !has(s))
          .slice(0, 12)
          .map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => add(s)}
              className="inline-flex items-center gap-1 rounded-full bg-cream-surface px-3 py-1 text-xs font-semibold text-forest-green transition hover:bg-forest-green hover:text-white-surface"
            >
              <Plus size={12} />
              {s}
            </button>
          ))}
      </div>
    </Field>
  )
}

type OptionCardProps = {
  selected: boolean
  onToggle: () => void
  title: string
  description: string
  icon: ReactNode
}

export function OptionCard({ selected, onToggle, title, description, icon }: OptionCardProps) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={selected}
      onClick={onToggle}
      className={`relative flex items-start gap-3.5 rounded-xl border-2 p-4 text-left transition ${
        selected
          ? 'border-forest-green bg-cream-surface'
          : 'border-forest-green/20 bg-white-surface hover:border-forest-green/50'
      }`}
    >
      <span
        className={`grid h-10 w-10 shrink-0 place-items-center rounded-lg ${
          selected ? 'bg-forest-green text-buttermilk' : 'bg-cream-surface text-forest-green'
        }`}
      >
        {icon}
      </span>
      <span className="min-w-0 pr-6">
        <span className="block text-[0.97rem] font-bold text-forest-green">{title}</span>
        <span className="mt-0.5 block text-xs leading-relaxed text-ink/70">{description}</span>
      </span>
      <span
        className={`absolute right-3.5 top-3.5 grid h-5 w-5 place-items-center rounded-full border-2 ${
          selected ? 'border-forest-green bg-forest-green text-white-surface' : 'border-ink/25'
        }`}
      >
        {selected && <Check size={12} strokeWidth={3} />}
      </span>
    </button>
  )
}

export function PrimaryButton({
  children,
  className = '',
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...rest}
      className={`inline-flex items-center justify-center gap-2 rounded-full bg-forest-green px-7 py-3.5 font-semibold text-white-surface shadow-lg shadow-forest-green/20 transition hover:bg-teal disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    >
      {children}
    </button>
  )
}
