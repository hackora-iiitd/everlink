import { useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { Check, X } from 'lucide-react'
import DashboardShell, { Chips, SampleTag, Section, btnGhost, btnPrimary } from '../../components/dashboard/DashboardShell'
import { Field, PrimaryButton, SelectInput, TextInput, inputCls } from '../../components/ui/form'
import { loadAlumni, usePersistentState, useSession } from '../../lib/demoSession'
import { sampleAlumniPeers, sampleEvents, sampleMentorRequests, sampleStudents } from '../../lib/sampleData'
import type { ReqStatus } from '../../lib/sampleData'

type Opp = { id: string; kind: string; title: string; org: string; link: string; eligibility: string; deadline: string }
const oppKinds = ['Referral', 'Internship', 'Job opening']
const visibilityOptions = ['Everlink members', 'My connections only', 'Public preview']
const sections = [
  { id: 'requests', label: 'Mentorship requests' },
  { id: 'students', label: 'Recommended students' },
  { id: 'connect', label: 'Alumni Connect' },
  { id: 'share', label: 'Share an opportunity' },
  { id: 'events', label: 'Events & reunions' },
  { id: 'impact', label: 'Impact overview' },
]

export default function AlumniDashboard() {
  const session = useSession()
  const record = session ? loadAlumni(session.email) : null

  const [settings, setSettings] = usePersistentState('everlink.alumni.settings', { visibility: 'Everlink members', accepting: record?.mentoring.accepting ?? true })
  const [requests, setRequests] = usePersistentState<Record<string, ReqStatus>>('everlink.alumni.requests', {})
  const [invited, setInvited] = usePersistentState<string[]>('everlink.alumni.invited', [])
  const [opps, setOpps] = usePersistentState<Opp[]>('everlink.alumni.opps', [])
  const [going, setGoing] = usePersistentState<string[]>('everlink.alumni.events', [])

  const statusOf = (id: string): ReqStatus => requests[id] ?? 'pending'
  const accepted = sampleMentorRequests.filter((r) => statusOf(r.id) === 'accepted').length

  return (
    <DashboardShell role="alumni" heading="Welcome" sections={sections}>
      {/* Visibility and availability */}
      <div className="grid gap-4 rounded-2xl bg-cream-surface p-5 sm:grid-cols-2">
        <label className="flex cursor-pointer items-start gap-3">
          <input type="checkbox" checked={settings.accepting} onChange={(e) => setSettings({ ...settings, accepting: e.target.checked })} className="mt-1 h-5 w-5 accent-forest-green" />
          <span>
            <span className="block font-bold text-forest-green">Accepting new mentoring requests</span>
            <span className="block text-xs text-ink/70">{settings.accepting ? 'Students can request mentorship from you.' : 'Paused. Students will not see a request button on your profile.'}</span>
          </span>
        </label>
        <SelectInput label="Who can see my profile" options={visibilityOptions} placeholder="Choose" value={settings.visibility} onChange={(e) => setSettings({ ...settings, visibility: e.target.value })} />
      </div>

      <Section id="requests" title="Mentorship requests" description="Review each request, then accept or decline." action={<SampleTag />}>
        <ul className="space-y-4">
          {sampleMentorRequests.map((r) => {
            const st = statusOf(r.id)
            return (
              <li key={r.id} className="rounded-xl border border-forest-green/15 p-4">
                <p className="font-bold text-forest-green">{r.from} <span className="font-normal text-ink/60">· {r.meta}</span></p>
                <p className="mt-1.5 text-sm text-ink/80">{r.message}</p>
                <div className="mt-3 flex items-center gap-2">
                  {st === 'pending' ? (
                    <>
                      <button type="button" className={btnPrimary} onClick={() => setRequests({ ...requests, [r.id]: 'accepted' })}>Accept</button>
                      <button type="button" className={btnGhost} onClick={() => setRequests({ ...requests, [r.id]: 'declined' })}>Decline</button>
                    </>
                  ) : (
                    <>
                      <span className={`rounded-full px-3 py-1 text-xs font-bold ${st === 'accepted' ? 'bg-forest-green text-white-surface' : 'bg-ink/10 text-ink/70'}`}>{st === 'accepted' ? 'Accepted' : 'Declined'}</span>
                      <button type="button" className="text-xs font-semibold text-ink/60 underline" onClick={() => setRequests({ ...requests, [r.id]: 'pending' })}>Undo</button>
                    </>
                  )}
                </div>
              </li>
            )
          })}
        </ul>
      </Section>

      <Section id="students" title="Recommended students" description="Matched on your expertise and shared interests, with the reason shown." action={<SampleTag />}>
        <div className="grid gap-4 md:grid-cols-2">
          {sampleStudents.map((s) => (
            <article key={s.id} className="flex flex-col rounded-xl border border-forest-green/15 p-4">
              <p className="font-bold text-forest-green">{s.name}</p>
              <p className="text-xs text-ink/60">{s.dept} · {s.year}</p>
              <p className="mt-2 text-sm text-ink/80">{s.why}</p>
              <div className="mt-3"><Chips items={s.skills} /></div>
              <div className="mt-4">
                {invited.includes(s.id) ? (
                  <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-teal"><Check size={15} strokeWidth={3} /> Invitation sent</span>
                ) : (
                  <button type="button" className={btnPrimary} onClick={() => setInvited([...invited, s.id])}>Offer to mentor</button>
                )}
              </div>
            </article>
          ))}
        </div>
      </Section>

      <AlumniConnect />

      <Section id="share" title="Share an opportunity" description="Publish a referral, internship or job opening for IGDTUW students.">
        <OppForm onAdd={(o) => setOpps([o, ...opps])} />
        {opps.length > 0 && (
          <ul className="mt-6 space-y-3 border-t border-forest-green/10 pt-5">
            {opps.map((o) => (
              <li key={o.id} className="flex items-start justify-between gap-3 rounded-xl bg-cream-surface p-4">
                <div className="min-w-0">
                  <p className="font-bold text-forest-green">{o.title} <span className="ml-1 rounded-full bg-white-surface px-2 py-0.5 text-xs font-semibold text-teal">{o.kind}</span></p>
                  <p className="text-sm text-ink/70">{o.org}{o.deadline ? ` · apply by ${o.deadline}` : ''}</p>
                  <p className="mt-1 text-sm text-ink/80">{o.eligibility}</p>
                </div>
                <button type="button" aria-label={`Remove ${o.title}`} onClick={() => setOpps(opps.filter((x) => x.id !== o.id))} className="rounded-full p-1.5 text-ink/50 hover:bg-white-surface hover:text-forest-green"><X size={16} /></button>
              </li>
            ))}
          </ul>
        )}
      </Section>

      <Section id="events" title="Events and reunions" action={<SampleTag />}>
        <ul className="space-y-3">
          {sampleEvents.map((e) => (
            <li key={e.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-forest-green/15 p-4">
              <div>
                <p className="font-bold text-forest-green">{e.title}</p>
                <p className="text-sm text-ink/65">{e.kind} · {e.when} · {e.where}</p>
              </div>
              <button type="button" className={going.includes(e.id) ? btnPrimary : btnGhost} onClick={() => setGoing(going.includes(e.id) ? going.filter((x) => x !== e.id) : [...going, e.id])}>
                {going.includes(e.id) ? 'Interested ✓' : "I'm interested"}
              </button>
            </li>
          ))}
        </ul>
      </Section>

      <Section id="impact" title="Impact overview" description="Counts of what you have done in this browser session history. Real totals will come from the server.">
        <dl className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            ['Requests accepted', accepted],
            ['Students invited', invited.length],
            ['Opportunities shared', opps.length],
            ['Events marked', going.length],
          ].map(([k, v]) => (
            <div key={String(k)} className="rounded-xl bg-cream-surface p-4">
              <dd className="font-display text-3xl font-extrabold text-forest-green">{v}</dd>
              <dt className="mt-1 text-xs font-semibold text-ink/65">{k}</dt>
            </div>
          ))}
        </dl>
      </Section>
    </DashboardShell>
  )
}

function AlumniConnect() {
  const [q, setQ] = useState('')
  const [year, setYear] = useState('')
  const [industry, setIndustry] = useState('')
  const years = useMemo(() => [...new Set(sampleAlumniPeers.map((p) => String(p.year)))].sort(), [])
  const industries = useMemo(() => [...new Set(sampleAlumniPeers.map((p) => p.industry))].sort(), [])
  const results = sampleAlumniPeers.filter(
    (p) => (!year || String(p.year) === year) && (!industry || p.industry === industry) && (!q || `${p.name} ${p.role} ${p.org}`.toLowerCase().includes(q.toLowerCase())),
  )
  return (
    <Section id="connect" title="Alumni Connect" description="Find peers by graduating year and industry." action={<SampleTag />}>
      <div className="grid gap-4 sm:grid-cols-3">
        <TextInput label="Search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Name, role or organisation" />
        <SelectInput label="Graduating year" options={years} placeholder="Any year" value={year} onChange={(e) => setYear(e.target.value)} />
        <SelectInput label="Industry" options={industries} placeholder="Any industry" value={industry} onChange={(e) => setIndustry(e.target.value)} />
      </div>
      <ul className="mt-5 grid gap-3 md:grid-cols-2" aria-live="polite">
        {results.map((p) => (
          <li key={p.id} className="rounded-xl border border-forest-green/15 p-4">
            <p className="font-bold text-forest-green">{p.name} <span className="font-normal text-ink/60">· Class of {p.year}</span></p>
            <p className="text-sm text-ink/75">{p.role}, {p.org}</p>
            <p className="mt-1 text-xs text-teal">{p.industry}</p>
          </li>
        ))}
        {results.length === 0 && <li className="text-sm text-ink/65">No alumni match these filters.</li>}
      </ul>
    </Section>
  )
}

function OppForm({ onAdd }: { onAdd: (o: Opp) => void }) {
  const empty = { kind: '', title: '', org: '', link: '', eligibility: '', deadline: '' }
  const [f, setF] = useState(empty)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const set = (k: keyof typeof f) => (e: { target: { value: string } }) => setF((p) => ({ ...p, [k]: e.target.value }))

  const submit = (ev: FormEvent) => {
    ev.preventDefault()
    const e: Record<string, string> = {}
    if (!f.kind) e.kind = 'Choose a type.'
    if (f.title.trim().length < 3) e.title = 'Add a title.'
    if (f.org.trim().length < 2) e.org = 'Add the organisation.'
    if (f.link.trim() && !/^https?:\/\/\S+\.\S+/i.test(f.link.trim())) e.link = 'Use a full link starting with https://'
    if (f.eligibility.trim().length < 5) e.eligibility = 'Say who can apply.'
    setErrors(e)
    if (Object.keys(e).length) return
    onAdd({ id: `o-${Date.now()}`, ...f, title: f.title.trim(), org: f.org.trim(), link: f.link.trim(), eligibility: f.eligibility.trim() })
    setF(empty)
  }

  return (
    <form onSubmit={submit} noValidate className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-3">
        <SelectInput label="Type" options={oppKinds} value={f.kind} onChange={set('kind')} error={errors.kind} />
        <div className="sm:col-span-2"><TextInput label="Title" value={f.title} onChange={set('title')} error={errors.title} placeholder="e.g. Summer data analyst intern" /></div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <TextInput label="Organisation" value={f.org} onChange={set('org')} error={errors.org} />
        <TextInput label="Link" optional value={f.link} onChange={set('link')} error={errors.link} placeholder="https://" />
      </div>
      <Field label="Eligibility" htmlFor="elig" error={errors.eligibility}>
        <textarea id="elig" rows={2} value={f.eligibility} onChange={set('eligibility')} aria-invalid={!!errors.eligibility} className={`${inputCls(!!errors.eligibility)} resize-y`} />
      </Field>
      <TextInput label="Deadline" type="date" optional value={f.deadline} onChange={set('deadline')} />
      <PrimaryButton type="submit">Publish opportunity</PrimaryButton>
    </form>
  )
}
