import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import { usePersistentState, useSession, writePersistentState } from '../../lib/demoSession'
import {
  postUrl,
  postTypeLabels,
  type CommunityPost,
  type CommunityPostKind,
} from '../../lib/communityContent'

const postTypes: CommunityPostKind[] = ['hiring', 'internship', 'referral', 'blog', 'campus']

type Draft = {
  type: CommunityPostKind
  title: string
  organization: string
  summary: string
  content: string
  skills: string
  tags: string
  eligibility: string
  applicationUrl: string
  deadline: string
}

const emptyDraft: Draft = {
  type: 'blog',
  title: '',
  organization: '',
  summary: '',
  content: '',
  skills: '',
  tags: '',
  eligibility: '',
  applicationUrl: '',
  deadline: '',
}

function splitTags(value: string) {
  return [...new Set(value.split(',').map((item) => item.trim()).filter(Boolean))]
}

export default function CreateCommunityPost() {
  const session = useSession()
  const { id } = useParams()
  const navigate = useNavigate()
  const [posts, setPosts] = usePersistentState<CommunityPost[]>('everlink.community.posts', [])
  const existing = id ? posts.find((post) => post.id === id) : undefined
  const authorizedRole = session?.role === 'alumni' || session?.role === 'admin'
  const authorizedEdit = Boolean(session && existing && (session.role === 'admin' || existing.authorEmail === session.email))
  const [draft, setDraft] = useState<Draft>(() => existing ? {
    type: existing.type,
    title: existing.title,
    organization: existing.organization,
    summary: existing.summary,
    content: existing.content,
    skills: existing.skills.join(', '),
    tags: existing.tags.join(', '),
    eligibility: existing.eligibility,
    applicationUrl: existing.applicationUrl ?? '',
    deadline: existing.deadline ?? '',
  } : emptyDraft)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  if (!session) return <Navigate to="/signin" replace />
  if (session.role === 'alumni' && !session.verified) return <Navigate to="/verify/alumni" replace />
  if (!authorizedRole) {
    return (
      <main className="mx-auto max-w-3xl px-5 py-12">
        <h1 className="font-display text-2xl font-bold text-forest-green">Publishing is limited to verified alumni and administrators.</h1>
        <Link to="/opportunities-stories" className="mt-3 inline-block font-semibold text-forest-green underline">Back to the community feed</Link>
      </main>
    )
  }
  if (id && !authorizedEdit) {
    return (
      <main className="mx-auto max-w-3xl px-5 py-12">
        <h1 className="font-display text-2xl font-bold text-forest-green">This post cannot be edited from this account.</h1>
        <Link to="/opportunities-stories" className="mt-3 inline-block font-semibold text-forest-green underline">Back to the community feed</Link>
      </main>
    )
  }

  const update = (field: keyof Draft, value: string) => setDraft((previous) => ({ ...previous, [field]: value }))
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (busy) return
    setError('')
    const title = draft.title.trim()
    const summary = draft.summary.trim()
    const body = draft.content.trim()
    if (!title || !summary || !body) {
      setError('Add a title, summary, and full content before publishing.')
      return
    }
    if (draft.type !== 'blog' && !draft.organization.trim()) {
      setError('Add an organization for this opportunity or announcement.')
      return
    }
    const applicationUrl = postUrl(draft.applicationUrl)
    if (draft.applicationUrl.trim() && !applicationUrl) {
      setError('Enter a valid application URL beginning with http:// or https://.')
      return
    }
    setBusy(true)
    const post: CommunityPost = {
      id: existing?.id ?? `community-${crypto.randomUUID()}`,
      type: draft.type,
      fictional: false,
      authorName: session.name,
      authorRole: session.role === 'admin' ? 'Administrator' : 'Alumni / Senior',
      authorEmail: session.email,
      organization: draft.organization.trim(),
      title,
      summary,
      content: body,
      skills: splitTags(draft.skills),
      tags: splitTags(draft.tags),
      eligibility: draft.eligibility.trim(),
      applicationUrl,
      deadline: draft.deadline || null,
      status: 'published',
      publishedAt: existing?.publishedAt ?? new Date().toISOString().slice(0, 10),
    }
    const nextPosts = existing ? posts.map((item) => item.id === existing.id ? post : item) : [post, ...posts]
    writePersistentState('everlink.community.posts', nextPosts)
    setPosts(nextPosts)
    navigate(`/opportunities-stories/${post.id}?saved=1`, { replace: true })
  }

  const inputClass = 'mt-1 block w-full rounded-lg border border-forest-green/25 px-3 py-2'
  return (
    <main className="mx-auto max-w-3xl space-y-6 px-5 py-10 sm:px-8">
      <Link to="/opportunities-stories" className="text-sm font-semibold text-forest-green underline">Back to Opportunities &amp; Stories</Link>
      <header>
        <h1 className="font-display text-3xl font-extrabold text-forest-green">{existing ? 'Edit post' : 'Create a post'}</h1>
        <p className="mt-2 text-sm text-ink/75">Your post is saved in this browser only. Do not include private contact details. Community opportunity posts are not company-verified.</p>
      </header>
      <form onSubmit={submit} className="space-y-4">
        <label className="block text-sm font-semibold text-ink">
          Post type
          <select value={draft.type} onChange={(event) => update('type', event.target.value)} className={inputClass}>
            {postTypes.map((type) => <option key={type} value={type}>{postTypeLabels[type]}</option>)}
          </select>
        </label>
        <label className="block text-sm font-semibold text-ink">Title<input required maxLength={120} value={draft.title} onChange={(event) => update('title', event.target.value)} className={inputClass} /></label>
        {draft.type !== 'blog' && <label className="block text-sm font-semibold text-ink">Organization<input required maxLength={100} value={draft.organization} onChange={(event) => update('organization', event.target.value)} className={inputClass} /></label>}
        <label className="block text-sm font-semibold text-ink">Short summary<textarea required maxLength={400} rows={3} value={draft.summary} onChange={(event) => update('summary', event.target.value)} className={inputClass} /></label>
        <label className="block text-sm font-semibold text-ink">{draft.type === 'blog' ? 'Full article' : 'Details and instructions'}<textarea required maxLength={12000} rows={9} value={draft.content} onChange={(event) => update('content', event.target.value)} className={inputClass} /></label>
        <label className="block text-sm font-semibold text-ink">Skills, comma separated<input value={draft.skills} onChange={(event) => update('skills', event.target.value)} className={inputClass} /></label>
        <label className="block text-sm font-semibold text-ink">Topic tags, comma separated<input value={draft.tags} onChange={(event) => update('tags', event.target.value)} className={inputClass} /></label>
        {draft.type !== 'blog' && <label className="block text-sm font-semibold text-ink">Eligibility, if known<textarea rows={2} value={draft.eligibility} onChange={(event) => update('eligibility', event.target.value)} className={inputClass} /></label>}
        {draft.type !== 'blog' && (
          <>
            <label className="block text-sm font-semibold text-ink">Application link, if supplied<input type="url" value={draft.applicationUrl} onChange={(event) => update('applicationUrl', event.target.value)} placeholder="https://…" className={inputClass} /></label>
            <label className="block text-sm font-semibold text-ink">Deadline, only if confirmed<input type="date" value={draft.deadline} onChange={(event) => update('deadline', event.target.value)} className={inputClass} /></label>
          </>
        )}
        {error && <p role="alert" className="rounded-lg border border-red-700/30 bg-red-50 p-3 text-sm text-red-900">{error}</p>}
        <p className="text-xs leading-relaxed text-ink/70">Do not claim an unverified hiring outcome, current vacancy, guaranteed referral, or company endorsement. Do not include another person’s contact details without permission.</p>
        <button type="submit" disabled={busy} className="rounded-full bg-forest-green px-5 py-2.5 font-semibold text-white-surface hover:bg-midnight-blue disabled:cursor-not-allowed disabled:opacity-60">{existing ? 'Save changes' : 'Publish locally'}</button>
      </form>
    </main>
  )
}
