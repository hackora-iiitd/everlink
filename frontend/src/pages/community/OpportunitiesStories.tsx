import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useSession, usePersistentState } from '../../lib/demoSession'
import { Chips } from '../../components/dashboard/DashboardShell'
import {
  developmentPosts,
  postTypeLabels,
  postUrl,
  type CommunityPost,
  type CommunityPostKind,
} from '../../lib/communityContent'

const tabs: { value: 'all' | CommunityPostKind; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'hiring', label: 'Hiring' },
  { value: 'internship', label: 'Internships' },
  { value: 'referral', label: 'Referrals' },
  { value: 'blog', label: 'Blogs' },
  { value: 'campus', label: 'Campus opportunities' },
]

const sectionLinks = [{ id: 'feed', label: 'Community feed' }]

export function loadCommunityPosts(posts: CommunityPost[]) {
  return [...developmentPosts, ...posts.filter((post) => post.status !== 'withdrawn')]
}

export default function OpportunitiesStories() {
  const session = useSession()
  const [searchParams, setSearchParams] = useSearchParams()
  const initialType = searchParams.get('type') ?? 'all'
  const [type, setType] = useState<string>(initialType)
  const [query, setQuery] = useState(searchParams.get('q') ?? '')
  const [skill, setSkill] = useState(searchParams.get('skill') ?? '')
  const [organization, setOrganization] = useState(searchParams.get('organization') ?? '')
  const [authorFilter, setAuthorFilter] = useState(searchParams.get('author') === 'me')
  const [posts, setPosts] = usePersistentState<CommunityPost[]>('everlink.community.posts', [])
  const [hidden, setHidden] = usePersistentState<string[]>('everlink.community.hidden-posts', [])
  const isAdmin = session?.role === 'admin'
  const normalizedQuery = query.trim().toLowerCase()
  const organizations = [...new Set([...developmentPosts, ...posts].map((post) => post.organization).filter(Boolean))].sort()
  const skills = [...new Set([...developmentPosts, ...posts].flatMap((post) => post.skills))].sort()

  const visiblePosts = useMemo(() => {
    return loadCommunityPosts(posts)
      .filter((post) => isAdmin || !hidden.includes(post.id))
      .filter((post) => type === 'all' || post.type === type)
      .filter((post) => !authorFilter || post.authorEmail === session?.email)
      .filter((post) => !organization || post.organization === organization)
      .filter((post) => !skill || post.skills.includes(skill))
      .filter((post) => {
        if (!normalizedQuery) return true
        return [
          post.title, post.organization, post.summary, post.content, post.authorName,
          post.tags.join(' '), post.skills.join(' '),
        ].join(' ').toLowerCase().includes(normalizedQuery)
      })
      .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
  }, [posts, hidden, type, authorFilter, organization, skill, normalizedQuery, isAdmin, session?.email])

  const updateUrl = () => {
    const next = new URLSearchParams()
    if (type !== 'all') next.set('type', type)
    if (query.trim()) next.set('q', query.trim())
    if (skill) next.set('skill', skill)
    if (organization) next.set('organization', organization)
    if (authorFilter) next.set('author', 'me')
    setSearchParams(next, { replace: true })
  }

  const toggleVisibility = (id: string) => {
    setHidden(hidden.includes(id) ? hidden.filter((item) => item !== id) : [...hidden, id])
  }

  return (
    <main className="mx-auto max-w-7xl space-y-8 px-5 py-10 sm:px-8">
      <header className="space-y-2">
        <h1 className="font-display text-3xl font-extrabold text-forest-green">Opportunities &amp; Stories</h1>
        <p className="text-lg font-semibold text-forest-green">
          Learn from your community. Discover opportunities. Take your next step.
        </p>
        <p className="text-sm text-ink/75">
          Community-submitted content is not company-verified. Development records are clearly labeled and are not live vacancies.
        </p>
        {session && (session.role === 'admin' || (session.role === 'alumni' && session.verified)) && (
          <div className="flex flex-wrap gap-3 pt-2">
            <Link to="/opportunities-stories/new" className="rounded-full bg-forest-green px-4 py-2 text-sm font-semibold text-white-surface hover:bg-midnight-blue">Create Post</Link>
            {session.role === 'alumni' && <button type="button" onClick={() => { setAuthorFilter(true); setSearchParams({ author: 'me' }, { replace: true }) }} className="rounded-full border border-forest-green px-4 py-2 text-sm font-semibold text-forest-green">Manage my posts</button>}
          </div>
        )}
      </header>

      <section id={sectionLinks[0].id} className="scroll-mt-24 space-y-4">
        <div role="tablist" aria-label="Post type" className="flex flex-wrap gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.value}
              type="button"
              role="tab"
              aria-selected={type === tab.value}
              onClick={() => { setType(tab.value); setSearchParams((previous) => { const next = new URLSearchParams(previous); if (tab.value === 'all') next.delete('type'); else next.set('type', tab.value); return next }, { replace: true }) }}
              className={`rounded-full px-3 py-2 text-sm font-semibold ${type === tab.value ? 'bg-forest-green text-white-surface' : 'border border-forest-green/25 text-forest-green hover:bg-cream-surface'}`}
            >
              {tab.label}
            </button>
          ))}
          {session?.role === 'alumni' && (
            <label className="inline-flex items-center gap-2 px-2 text-sm font-semibold text-ink">
              <input type="checkbox" checked={authorFilter} onChange={(event) => { setAuthorFilter(event.target.checked); setSearchParams((previous) => { const next = new URLSearchParams(previous); if (event.target.checked) next.set('author', 'me'); else next.delete('author'); return next }, { replace: true }) }} />
              My posts
            </label>
          )}
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_auto]">
          <label>
            <span className="sr-only">Search community posts</span>
            <input value={query} onChange={(event) => setQuery(event.target.value)} onKeyDown={(event) => event.key === 'Enter' && updateUrl()} placeholder="Search title, author, skills, or content" className="w-full rounded-lg border border-forest-green/25 px-3 py-2" />
          </label>
          <label className="text-sm font-semibold text-ink">
            Skill
            <select value={skill} onChange={(event) => setSkill(event.target.value)} className="mt-1 block w-full rounded-lg border border-forest-green/25 bg-white-surface px-2 py-2"><option value="">All skills</option>{skills.map((item) => <option key={item}>{item}</option>)}</select>
          </label>
          <label className="text-sm font-semibold text-ink">
            Organization
            <select value={organization} onChange={(event) => setOrganization(event.target.value)} className="mt-1 block w-full rounded-lg border border-forest-green/25 bg-white-surface px-2 py-2"><option value="">All organizations</option>{organizations.map((item) => <option key={item}>{item}</option>)}</select>
          </label>
          <button type="button" onClick={updateUrl} className="self-end rounded-lg bg-forest-green px-4 py-2 font-semibold text-white-surface hover:bg-midnight-blue">Apply</button>
        </div>
        <p className="text-sm text-ink/70">{visiblePosts.length} posts</p>
        {visiblePosts.length === 0 ? (
          <p className="rounded-xl bg-cream-surface p-5 text-sm text-ink">{authorFilter ? 'You have not published any posts in this browser yet.' : 'No posts match these filters. Try another search.'}</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {visiblePosts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                own={Boolean(session && post.authorEmail === session.email)}
                isAdmin={isAdmin}
                hidden={hidden.includes(post.id)}
                onToggleVisibility={() => toggleVisibility(post.id)}
                onWithdraw={() => setPosts(posts.map((item) => item.id === post.id ? { ...item, status: 'withdrawn' } : item))}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  )
}

function PostCard({ post, own, isAdmin, hidden, onToggleVisibility, onWithdraw }: {
  post: CommunityPost
  own: boolean
  isAdmin: boolean
  hidden: boolean
  onToggleVisibility: () => void
  onWithdraw: () => void
}) {
  const externalUrl = postUrl(post.applicationUrl ?? '')
  return (
    <article className="flex flex-col rounded-xl border border-forest-green/15 p-4">
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-cream-surface px-2.5 py-1 text-xs font-bold text-forest-green">{postTypeLabels[post.type]}</span>
        {!post.fictional && <span className="text-xs text-ink/70">Community submitted · not company-verified</span>}
      </div>
      <h2 className="mt-3 font-display text-lg font-bold text-forest-green">{post.title}</h2>
      {post.organization && <p className="text-sm font-semibold text-ink">{post.organization}</p>}
      <p className="mt-1 text-sm leading-relaxed text-ink/80">{post.summary}</p>
      <p className="mt-3 text-xs text-ink/65">{post.authorName} · {post.authorRole} · {post.publishedAt}</p>
      <div className="mt-3"><Chips items={post.tags} /></div>
      {post.deadline && <p className="mt-2 text-xs font-semibold text-ink">Deadline: {post.deadline}</p>}
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <Link to={`/opportunities-stories/${post.id}`} className="text-sm font-bold text-forest-green underline">{post.type === 'blog' ? 'Read article' : 'View details'}</Link>
        {externalUrl && (
          <a href={externalUrl} target="_blank" rel="noopener noreferrer" className="text-sm font-bold text-forest-green underline">
            Application link <span className="sr-only">(opens in a new tab)</span>
          </a>
        )}
        {own && <Link to={`/opportunities-stories/edit/${post.id}`} className="text-sm font-semibold text-forest-green underline">Edit</Link>}
        {own && !post.fictional && <button type="button" onClick={onWithdraw} className="text-sm font-semibold text-forest-green underline">Withdraw</button>}
        {isAdmin && <button type="button" onClick={onToggleVisibility} className="text-sm font-semibold text-forest-green underline">{hidden ? 'Restore' : 'Hide post'}</button>}
      </div>
      {!post.applicationUrl && post.type !== 'blog' && <p className="mt-2 text-xs text-ink/65">No application URL provided. Check the source organization for current details.</p>}
    </article>
  )
}
