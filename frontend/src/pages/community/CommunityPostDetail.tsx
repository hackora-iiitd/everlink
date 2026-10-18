import { Link, useNavigate, useParams } from 'react-router-dom'
import { useSession, usePersistentState, writePersistentState } from '../../lib/demoSession'
import { Chips } from '../../components/dashboard/DashboardShell'
import {
  developmentPosts,
  postTypeLabels,
  postUrl,
  seniorStories,
  type CommunityPost,
} from '../../lib/communityContent'
import { loadCommunityPosts } from './OpportunitiesStories'

export default function CommunityPostDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const session = useSession()
  const [posts, setPosts] = usePersistentState<CommunityPost[]>('everlink.community.posts', [])
  const [hidden, setHidden] = usePersistentState<string[]>('everlink.community.hidden-posts', [])
  const post = loadCommunityPosts(posts).find((item) => item.id === id)

  if (!post || (hidden.includes(post.id) && session?.role !== 'admin')) {
    return (
      <main className="mx-auto max-w-3xl px-5 py-12">
        <h1 className="font-display text-2xl font-bold text-forest-green">Post not found</h1>
        <Link to="/opportunities-stories" className="mt-3 inline-block font-semibold text-forest-green underline">Back to the feed</Link>
      </main>
    )
  }

  const own = Boolean(session && post.authorEmail === session.email)
  const isAdmin = session?.role === 'admin'
  const externalUrl = postUrl(post.applicationUrl ?? '')
  const relatedStories = seniorStories.filter((story) => story.skills.some((skill) => post.skills.includes(skill))).slice(0, 3)

  return (
    <main className="mx-auto max-w-4xl space-y-6 px-5 py-10 sm:px-8">
      <Link to="/opportunities-stories" className="text-sm font-semibold text-forest-green underline">Back to Opportunities &amp; Stories</Link>
      <article className="space-y-5">
        <header>
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full bg-cream-surface px-3 py-1 text-xs font-bold text-forest-green">{postTypeLabels[post.type]}</span>
            {!post.fictional && <span className="text-xs text-ink/70">Community submitted · not company-verified</span>}
          </div>
          <h1 className="mt-3 font-display text-3xl font-extrabold text-forest-green">{post.title}</h1>
          {post.organization && <p className="mt-1 text-lg font-semibold text-ink">{post.organization}</p>}
          <p className="mt-2 text-sm text-ink/70">{post.authorName} · {post.authorRole} · {post.publishedAt}</p>
        </header>
        <p className="text-lg leading-relaxed text-ink/85">{post.summary}</p>
        <section>
          <h2 className="mb-2 font-display text-xl font-bold text-forest-green">{post.type === 'blog' ? 'Article' : 'Details and instructions'}</h2>
          <div className="whitespace-pre-line text-sm leading-relaxed text-ink/85">{post.content}</div>
        </section>
        {post.eligibility && <section><h2 className="mb-1 font-display text-lg font-bold text-forest-green">Eligibility</h2><p className="text-sm text-ink/80">{post.eligibility}</p></section>}
        {post.skills.length > 0 && <section><h2 className="mb-2 font-display text-lg font-bold text-forest-green">Skills and topics</h2><Chips items={post.skills} /></section>}
        {post.deadline && <p className="text-sm font-semibold text-ink">Deadline: {post.deadline}</p>}
        {externalUrl ? (
          <a href={externalUrl} target="_blank" rel="noopener noreferrer" className="inline-flex rounded-full bg-forest-green px-5 py-2.5 font-semibold text-white-surface hover:bg-midnight-blue">
            {post.type === 'blog' ? 'Open external resource' : 'Visit application link'}
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        ) : post.type !== 'blog' ? (
          <p className="rounded-lg bg-cream-surface p-3 text-sm text-ink">No application URL was supplied. Verify current details through the organization’s official channels.</p>
        ) : null}
        {own && !post.fictional && <div className="flex flex-wrap gap-3"><Link to={`/opportunities-stories/edit/${post.id}`} className="text-sm font-semibold text-forest-green underline">Edit post</Link><button type="button" onClick={() => { const nextPosts = posts.map((item) => item.id === post.id ? { ...item, status: 'withdrawn' as const } : item); writePersistentState('everlink.community.posts', nextPosts); setPosts(nextPosts); navigate('/opportunities-stories') }} className="text-sm font-semibold text-forest-green underline">Withdraw post</button></div>}
        {isAdmin && <button type="button" onClick={() => setHidden(hidden.includes(post.id) ? hidden.filter((item) => item !== post.id) : [...hidden, post.id])} className="text-sm font-semibold text-forest-green underline">{hidden.includes(post.id) ? 'Restore post' : 'Hide post'}</button>}
      </article>
      {relatedStories.length > 0 && (
        <section>
          <h2 className="mb-3 font-display text-xl font-bold text-forest-green">Related Senior Success stories</h2>
          <div className="grid gap-3 sm:grid-cols-3">{relatedStories.map((story) => <Link key={story.id} to={`/senior-success/story/${story.id}`} className="rounded-lg border border-forest-green/15 p-3 text-sm font-semibold text-forest-green hover:bg-cream-surface">{story.title}<span className="mt-1 block text-xs font-normal text-ink/70">{story.seniorName}</span></Link>)}</div>
        </section>
      )}
      {post.fictional && developmentPosts.some((item) => item.id === post.id) && <p className="border-t border-forest-green/15 pt-4 text-xs text-ink/65">This example is not an endorsement, real hiring announcement, or current vacancy.</p>}
    </main>
  )
}
