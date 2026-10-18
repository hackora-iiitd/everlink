import { useState } from 'react'
import type { FormEvent } from 'react'
import { Plus } from 'lucide-react'
import DashboardShell, { Chips, SampleTag, Section, btnGhost, btnPrimary } from '../../components/dashboard/DashboardShell'
import ProjectForm from '../../components/professor/ProjectForm'
import { Field, PrimaryButton, TextInput, inputCls } from '../../components/ui/form'
import { usePersistentState } from '../../lib/demoSession'
import { sampleApplicants, sampleFaculty, sampleMentorRequests, sampleStudents } from '../../lib/sampleData'
import type { ReqStatus } from '../../lib/sampleData'
import type { Project } from '../../lib/types'
import CommunityGraph from '../../components/dashboard/CommunityGraph'
import { communityGraphFor } from '../../lib/communityGraphData'
import { useSession } from '../../lib/demoSession'

type AppStatus = 'new' | 'shortlisted' | 'accepted' | 'declined'
type Announcement = { id: string; kind: string; title: string; body: string; date: string }

const sections = [
  { id: 'workspace', label: 'Research workspace' },
  { id: 'students', label: 'Recommended students' },
  { id: 'applications', label: 'Applications' },
  { id: 'network', label: 'Collaboration network' },
  { id: 'mentorship', label: 'Mentorship requests' },
  { id: 'announcements', label: 'Announcements' },
]
const statusLabel: Record<AppStatus, string> = { new: 'New', shortlisted: 'Shortlisted', accepted: 'Accepted', declined: 'Declined' }

export default function ProfessorDashboard() {
  const session = useSession()
  const [projects, setProjects] = usePersistentState<Project[]>('everlink.professor.projects', [])
  const [editing, setEditing] = useState<string | 'new' | null>(null)
  const [appStatus, setAppStatus] = usePersistentState<Record<string, AppStatus>>('everlink.professor.apps', {})
  const [mReq, setMReq] = usePersistentState<Record<string, ReqStatus>>('everlink.professor.mreq', {})
  const [invited, setInvited] = usePersistentState<string[]>('everlink.professor.invited', [])
  const [reached, setReached] = usePersistentState<string[]>('everlink.professor.reached', [])
  const [posts, setPosts] = usePersistentState<Announcement[]>('everlink.professor.posts', [])

  const save = (p: Project) => {
    setProjects(projects.some((x) => x.id === p.id) ? projects.map((x) => (x.id === p.id ? p : x)) : [p, ...projects])
    setEditing(null)
  }
  const editingProject = editing && editing !== 'new' ? projects.find((p) => p.id === editing) : undefined

  return (
    <DashboardShell role="professor" heading="Welcome, Professor" sections={sections}>
      <Section
        id="workspace"
        title="Research workspace"
        description="Create, edit and close your research projects."
        action={editing === null && <button type="button" className={`${btnPrimary} inline-flex items-center gap-1.5`} onClick={() => setEditing('new')}><Plus size={15} /> New project</button>}
      >
        {editing !== null ? (
          <ProjectForm key={editing} initial={editingProject} submitLabel={editingProject ? 'Save changes' : 'Publish project'} onSubmit={save} onCancel={() => setEditing(null)} />
        ) : projects.length === 0 ? (
          <p className="rounded-xl bg-cream-surface p-5 text-sm text-ink/75">No projects yet. Publish your first opening so students and alumni can find it.</p>
        ) : (
          <ul className="space-y-4">
            {projects.map((p) => (
              <li key={p.id} className="rounded-xl border border-forest-green/15 p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-display text-lg font-bold text-forest-green">{p.title}</p>
                    <p className="text-xs text-ink/60">{p.domain} · {p.duration} · {p.positions} {p.positions === 1 ? 'position' : 'positions'}{p.closingDate ? ` · closes ${p.closingDate}` : ''}</p>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs font-bold ${p.status === 'open' ? 'bg-forest-green text-white-surface' : 'bg-ink/10 text-ink/70'}`}>{p.status === 'open' ? 'Open' : 'Closed'}</span>
                </div>
                <p className="mt-3 text-sm text-ink/80">{p.abstract}</p>
                <div className="mt-3"><Chips items={p.skills} /></div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <button type="button" className={btnGhost} onClick={() => setEditing(p.id)}>Edit</button>
                  <button type="button" className={btnGhost} onClick={() => setProjects(projects.map((x) => (x.id === p.id ? { ...x, status: x.status === 'open' ? 'closed' : 'open' } : x)))}>{p.status === 'open' ? 'Close applications' : 'Reopen'}</button>
                  <button type="button" className="px-3 text-sm font-semibold text-ink/55 underline hover:text-forest-green" onClick={() => window.confirm('Delete this project?') && setProjects(projects.filter((x) => x.id !== p.id))}>Delete</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Section>

      <Section id="students" title="Recommended students" description="Matched on skills and research interests, with the reason shown." action={<SampleTag />}>
        <div className="grid gap-4 md:grid-cols-2">
          {sampleStudents.map((s) => (
            <article key={s.id} className="rounded-xl border border-forest-green/15 p-4">
              <p className="font-bold text-forest-green">{s.name}</p>
              <p className="text-xs text-ink/60">{s.dept} · {s.year}</p>
              <p className="mt-2 text-sm text-ink/80">{s.why}</p>
              <div className="mt-3"><Chips items={[...s.skills, ...s.interests]} /></div>
              <div className="mt-4">
                {invited.includes(s.id) ? <span className="text-sm font-semibold text-teal">Invited to apply ✓</span> : <button type="button" className={btnPrimary} onClick={() => setInvited([...invited, s.id])}>Invite to apply</button>}
              </div>
            </article>
          ))}
        </div>
      </Section>

      <Section id="network" title="Community Network" description="Contextual research connections.">
        <CommunityGraph data={communityGraphFor('professor', session?.name ?? 'Professor')} />
      </Section>

      <Section id="applications" title="Applications" description="Review applicants and update their status." action={<SampleTag />}>
        <ul className="space-y-4">
          {sampleApplicants.map((a) => {
            const st = appStatus[a.id] ?? a.status
            const proj = projects[a.projectKey]?.title
            return (
              <li key={a.id} className="rounded-xl border border-forest-green/15 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-bold text-forest-green">{a.name} <span className="font-normal text-ink/60">· {a.dept}</span></p>
                  <span className="rounded-full bg-cream-surface px-3 py-1 text-xs font-bold text-forest-green">{statusLabel[st]}</span>
                </div>
                <p className="mt-1 text-xs text-ink/60">Applying to: {proj ?? 'one of your projects'}</p>
                <p className="mt-2 text-sm text-ink/80">{a.note}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {(['shortlisted', 'accepted', 'declined'] as AppStatus[]).map((s) => (
                    <button key={s} type="button" disabled={st === s} onClick={() => setAppStatus({ ...appStatus, [a.id]: s })} className={`${st === s ? btnPrimary : btnGhost} disabled:opacity-60`}>
                      {s === 'shortlisted' ? 'Shortlist' : s === 'accepted' ? 'Accept' : 'Decline'}
                    </button>
                  ))}
                </div>
              </li>
            )
          })}
        </ul>
      </Section>

      <Section id="network" title="Collaboration network" description="Faculty and alumni whose work overlaps with yours." action={<SampleTag />}>
        <div className="grid gap-4 md:grid-cols-2">
          {sampleFaculty.map((p) => (
            <article key={p.id} className="rounded-xl border border-forest-green/15 p-4">
              <p className="font-bold text-forest-green">{p.name} <span className="ml-1 rounded-full bg-cream-surface px-2 py-0.5 text-xs font-semibold text-teal">{p.kind}</span></p>
              <p className="text-xs text-ink/60">{p.dept}</p>
              <div className="mt-3"><Chips items={p.topics} /></div>
              <div className="mt-4">
                {reached.includes(p.id) ? <span className="text-sm font-semibold text-teal">Request sent ✓</span> : <button type="button" className={btnGhost} onClick={() => setReached([...reached, p.id])}>Propose collaboration</button>}
              </div>
            </article>
          ))}
        </div>
      </Section>

      <Section id="mentorship" title="Mentorship requests" description="Students asking for academic guidance." action={<SampleTag />}>
        <ul className="space-y-4">
          {sampleMentorRequests.map((r) => {
            const st = mReq[r.id] ?? 'pending'
            return (
              <li key={r.id} className="rounded-xl border border-forest-green/15 p-4">
                <p className="font-bold text-forest-green">{r.from} <span className="font-normal text-ink/60">· {r.meta}</span></p>
                <p className="mt-1.5 text-sm text-ink/80">{r.message}</p>
                <div className="mt-3 flex items-center gap-2">
                  {st === 'pending' ? (
                    <>
                      <button type="button" className={btnPrimary} onClick={() => setMReq({ ...mReq, [r.id]: 'accepted' })}>Accept</button>
                      <button type="button" className={btnGhost} onClick={() => setMReq({ ...mReq, [r.id]: 'declined' })}>Decline</button>
                    </>
                  ) : (
                    <>
                      <span className={`rounded-full px-3 py-1 text-xs font-bold ${st === 'accepted' ? 'bg-forest-green text-white-surface' : 'bg-ink/10 text-ink/70'}`}>{st === 'accepted' ? 'Accepted' : 'Declined'}</span>
                      <button type="button" className="text-xs font-semibold text-ink/60 underline" onClick={() => setMReq({ ...mReq, [r.id]: 'pending' })}>Undo</button>
                    </>
                  )}
                </div>
              </li>
            )
          })}
        </ul>
      </Section>

      <Section id="announcements" title="Announcements" description="Publish research openings, seminars and project updates.">
        <AnnouncementForm onAdd={(a) => setPosts([a, ...posts])} />
        {posts.length > 0 && (
          <ul className="mt-6 space-y-3 border-t border-forest-green/10 pt-5">
            {posts.map((a) => (
              <li key={a.id} className="rounded-xl bg-cream-surface p-4">
                <p className="font-bold text-forest-green">{a.title} <span className="ml-1 rounded-full bg-white-surface px-2 py-0.5 text-xs font-semibold text-teal">{a.kind}</span></p>
                <p className="text-xs text-ink/55">{a.date}</p>
                <p className="mt-1.5 text-sm text-ink/80">{a.body}</p>
                <button type="button" className="mt-2 text-xs font-semibold text-ink/55 underline" onClick={() => setPosts(posts.filter((x) => x.id !== a.id))}>Remove</button>
              </li>
            ))}
          </ul>
        )}
      </Section>
    </DashboardShell>
  )
}

function AnnouncementForm({ onAdd }: { onAdd: (a: Announcement) => void }) {
  const [kind, setKind] = useState('Research opening')
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})

  const submit = (ev: FormEvent) => {
    ev.preventDefault()
    const e: Record<string, string> = {}
    if (title.trim().length < 4) e.title = 'Add a title.'
    if (body.trim().length < 10) e.body = 'Add a few words of detail.'
    setErrors(e)
    if (Object.keys(e).length) return
    onAdd({ id: `n-${Date.now()}`, kind, title: title.trim(), body: body.trim(), date: new Date().toLocaleDateString() })
    setTitle('')
    setBody('')
  }

  return (
    <form onSubmit={submit} noValidate className="space-y-4">
      <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Announcement type">
        {['Research opening', 'Seminar', 'Project update'].map((k) => (
          <button key={k} type="button" role="radio" aria-checked={kind === k} onClick={() => setKind(k)} className={`rounded-full px-4 py-2 text-sm font-semibold transition ${kind === k ? 'bg-forest-green text-white-surface' : 'bg-cream-surface text-forest-green hover:bg-forest-green/10'}`}>{k}</button>
        ))}
      </div>
      <TextInput label="Title" value={title} onChange={(e) => setTitle(e.target.value)} error={errors.title} maxLength={120} />
      <Field label="Details" htmlFor="ann-body" error={errors.body}>
        <textarea id="ann-body" rows={3} value={body} onChange={(e) => setBody(e.target.value)} aria-invalid={!!errors.body} className={`${inputCls(!!errors.body)} resize-y`} maxLength={600} />
      </Field>
      <PrimaryButton type="submit">Publish announcement</PrimaryButton>
    </form>
  )
}
