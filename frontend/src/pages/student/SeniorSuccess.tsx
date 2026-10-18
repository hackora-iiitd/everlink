import { useMemo, useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { Bookmark, Search } from 'lucide-react'
import DashboardShell, { Chips } from '../../components/dashboard/DashboardShell'
import {
  campusOpportunities,
  graduationBatches,
  seniorPersonas,
  seniorStories,
  storyOrganizations,
  storySkills,
  type OpportunityType,
  type SeniorStory,
} from '../../lib/communityContent'
import { usePersistentState } from '../../lib/demoSession'

const filters: { value: OpportunityType | 'all'; label: string }[] = [
  { value: 'all', label: 'All paths' },
  { value: 'internship', label: 'Internships' },
  { value: 'full-time', label: 'Full-time roles' },
  { value: 'research', label: 'Research' },
  { value: 'scholarship', label: 'Scholarships' },
  { value: 'fellowship', label: 'Fellowships' },
  { value: 'competition', label: 'Competitions' },
  { value: 'entrepreneurship', label: 'Entrepreneurship' },
]

const sectionLinks = [
  { id: 'stories', label: 'Senior Success' },
  { id: 'opportunities', label: 'Campus opportunity records' },
]

function TextFilter({ label, value, onChange, options }: {
  label: string
  value: string
  onChange: (value: string) => void
  options: (string | number)[]
}) {
  return (
    <label className="text-sm font-semibold text-ink">
      {label}
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-1 block w-full rounded-lg border border-forest-green/25 bg-white-surface px-3 py-2"
      >
        <option value="">All</option>
        {options.map((option) => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
    </label>
  )
}

export default function SeniorSuccess() {
  const { kind, id } = useParams()
  if (kind === 'story' && id) return <SeniorStoryDetail id={id} />
  if (kind === 'person' && id) return <SeniorPersonDetail id={id} />
  if (kind === 'opportunity' && id) return <SeniorOpportunityDetail id={id} />
  return <SeniorSuccessBrowse />
}

function SeniorSuccessBrowse() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [query, setQuery] = useState(searchParams.get('q') ?? '')
  const [type, setType] = useState(searchParams.get('type') ?? 'all')
  const [organization, setOrganization] = useState(searchParams.get('organization') ?? '')
  const [skill, setSkill] = useState(searchParams.get('skill') ?? '')
  const [batch, setBatch] = useState(searchParams.get('batch') ?? '')
  const [saved, setSaved] = usePersistentState<string[]>('everlink.student.saved-stories', [])
  const normalizedQuery = query.trim().toLowerCase()

  const matches = useMemo(() => {
    return seniorStories.filter((story) => {
      const searchable = [
        story.title, story.seniorName, story.organization, story.summary,
        story.tags.join(' '), story.skills.join(' '), story.advice,
      ].join(' ').toLowerCase()
      return (!normalizedQuery || searchable.includes(normalizedQuery))
        && (type === 'all' || story.opportunityType === type)
        && (!organization || story.organization === organization)
        && (!skill || story.skills.includes(skill))
        && (!batch || story.graduationYear === Number(batch))
    })
  }, [normalizedQuery, type, organization, skill, batch])

  const updateFilters = () => {
    const next = new URLSearchParams()
    if (query.trim()) next.set('q', query.trim())
    if (type !== 'all') next.set('type', type)
    if (organization) next.set('organization', organization)
    if (skill) next.set('skill', skill)
    if (batch) next.set('batch', batch)
    setSearchParams(next, { replace: true })
  }

  const batchOptions = graduationBatches
    .filter((year) => seniorStories.some((story) => story.graduationYear === year))

  return (
    <DashboardShell role="student" heading="Senior Success" sections={sectionLinks}>
      <div className="space-y-2">
        <p className="text-lg font-semibold text-forest-green">
          Career journeys, practical preparation, and community opportunity records.
        </p>
        <p className="rounded-lg border border-buttermilk/60 bg-buttermilk/10 p-3 text-sm text-ink">
          Fictional development records. They are not verified outcomes, testimonials, live vacancies, or actual campus recruitment events.
        </p>
      </div>

      <section id="stories" className="scroll-mt-24 space-y-4">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <label className="sm:col-span-2 lg:col-span-3">
            <span className="sr-only">Search stories</span>
            <span className="flex items-center gap-2 rounded-lg border border-forest-green/25 px-3 py-2">
              <Search size={17} aria-hidden="true" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                onKeyDown={(event) => event.key === 'Enter' && updateFilters()}
                placeholder="Search stories, skills, organizations, or tags"
                className="min-w-0 flex-1 outline-none"
              />
            </span>
          </label>
          <label className="text-sm font-semibold text-ink">
            Opportunity type
            <select value={type} onChange={(event) => setType(event.target.value)} className="mt-1 block w-full rounded-lg border border-forest-green/25 bg-white-surface px-3 py-2">
              {filters.map((filter) => <option key={filter.value} value={filter.value}>{filter.label}</option>)}
            </select>
          </label>
          <TextFilter label="Organization" value={organization} onChange={setOrganization} options={storyOrganizations} />
          <TextFilter label="Skill" value={skill} onChange={setSkill} options={storySkills} />
          <TextFilter label="Graduation year" value={batch} onChange={setBatch} options={batchOptions} />
          <button type="button" onClick={updateFilters} className="self-end rounded-lg bg-forest-green px-4 py-2 font-semibold text-white-surface hover:bg-midnight-blue">
            Apply filters
          </button>
        </div>

        <p className="text-sm text-ink/70">{matches.length} career {matches.length === 1 ? 'story' : 'stories'}</p>
        {matches.length === 0 ? (
          <p className="rounded-xl bg-cream-surface p-5 text-sm text-ink">No stories match these filters. Try a broader search.</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {matches.map((story) => (
              <StoryCard
                key={story.id}
                story={story}
                saved={saved.includes(story.id)}
                onSave={() => setSaved(saved.includes(story.id) ? saved.filter((item) => item !== story.id) : [...saved, story.id])}
              />
            ))}
          </div>
        )}
      </section>

      <section id="opportunities" className="scroll-mt-24">
        <h2 className="mb-3 font-display text-xl font-bold text-forest-green">Campus opportunity records</h2>
        <p className="mb-4 text-sm text-ink/70">Dates, eligibility, live status, and application links are not verified or available for these records.</p>
        <div className="grid gap-3 md:grid-cols-2">
          {campusOpportunities.map((opportunity) => {
            const story = seniorStories.find((item) => item.id === opportunity.storyId)
            if (!story) return null
            return (
              <article key={opportunity.id} className="rounded-xl border border-forest-green/15 p-4">
                <h3 className="mt-1 font-display text-lg font-bold text-forest-green">{opportunity.title}</h3>
                <p className="text-sm text-ink/75">{opportunity.organization} · {opportunity.type}</p>
                <p className="mt-2 text-sm text-ink/80">{opportunity.description}</p>
                <p className="mt-2 text-xs text-ink/70">{opportunity.eligibility}</p>
                <Link to={`/senior-success/opportunity/${opportunity.id}`} className="mt-3 inline-block text-sm font-bold text-forest-green underline">
                  View record details
                </Link>
                {story && <span className="sr-only">Related story by {story.seniorName}</span>}
              </article>
            )
          })}
        </div>
      </section>
    </DashboardShell>
  )
}

function StoryCard({ story, saved, onSave }: { story: SeniorStory; saved: boolean; onSave: () => void }) {
  return (
    <article className="flex flex-col rounded-xl border border-forest-green/15 p-4">
      <p className="text-xs font-bold uppercase tracking-wide text-midnight-blue">Fictional development story</p>
      <h3 className="mt-1 font-display text-lg font-bold text-forest-green">{story.title}</h3>
      <p className="mt-1 text-sm text-ink/75">
        {story.seniorName} · Class of {story.graduationYear} · {story.department}
      </p>
      <p className="mt-1 text-sm font-semibold text-ink">{story.organization} · {story.year}</p>
      <p className="mt-3 flex-1 text-sm leading-relaxed text-ink/80">{story.summary}</p>
      <div className="mt-3"><Chips items={story.tags} /></div>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <Link to={`/senior-success/story/${story.id}`} className="rounded-full bg-forest-green px-4 py-2 text-sm font-semibold text-white-surface hover:bg-midnight-blue">
          Read Story
        </Link>
        <Link to={`/senior-success/person/${story.authorPersonId}`} className="text-sm font-semibold text-forest-green underline">
          View senior profile
        </Link>
        <button type="button" onClick={onSave} aria-pressed={saved} className="inline-flex items-center gap-1 text-sm font-semibold text-forest-green underline">
          <Bookmark size={15} fill={saved ? 'currentColor' : 'none'} />
          {saved ? 'Saved' : 'Save story'}
        </button>
      </div>
    </article>
  )
}

function SeniorStoryDetail({ id }: { id: string }) {
  const story = seniorStories.find((item) => item.id === id)
  const persona = story ? seniorPersonas.find((item) => item.id === story.authorPersonId) : undefined
  if (!story || !persona) return <MissingRecord />
  const relatedStories = seniorStories.filter((item) => item.id !== story.id && item.skills.some((skill) => story.skills.includes(skill))).slice(0, 3)
  return (
    <DashboardShell role="student" heading="Career story" sections={[{ id: 'journey', label: 'Journey' }, { id: 'related', label: 'Related stories' }]}>
      <article id="journey" className="mx-auto max-w-4xl space-y-6">
        <p className="rounded-lg border border-buttermilk/60 bg-buttermilk/10 p-3 text-sm text-ink">
          This illustrative career story is not a real-person testimonial or verified achievement.
        </p>
        <header>
          <p className="text-sm font-semibold text-midnight-blue">{story.opportunityType} · {story.year}</p>
          <h2 className="mt-1 font-display text-3xl font-extrabold text-forest-green">{story.title}</h2>
          <p className="mt-2 text-ink/75">{persona.name} · Class of {persona.graduationYear} · {persona.degree}</p>
          <p className="text-sm text-ink/70">{story.organization}</p>
        </header>
        <p className="leading-relaxed text-ink/85">{story.summary}</p>
        <StorySection title="Background and starting point">{story.startingPoint}</StorySection>
        <StorySection title="Preparation journey">{story.preparation}</StorySection>
        <StorySection title="Skills and tools"><Chips items={story.skills} /></StorySection>
        <StorySection title="Resources that helped"><ul className="list-inside list-disc space-y-1">{story.resources.map((item) => <li key={item}>{item}</li>)}</ul></StorySection>
        <StorySection title="Challenges and lessons"><p>{story.challenges}</p><p className="mt-2">{story.lessons}</p></StorySection>
        <StorySection title="Illustrative journey timeline"><ol className="space-y-2">{story.timeline.map((item) => <li key={item.label}><b>{item.label}:</b> {item.detail}</li>)}</ol></StorySection>
        <StorySection title="Advice for students">{story.advice}</StorySection>
        <StorySection title="Related skills and topics"><Chips items={story.tags} /></StorySection>
        <p className="text-sm text-ink/70">Application deadline and source URL: not available. This record is not a live opportunity.</p>
        <Link to={`/senior-success/opportunity/${story.relatedOpportunityId}`} className="inline-block text-sm font-bold text-forest-green underline">View related opportunity record</Link>
        <Link to={`/opportunities-stories?skill=${encodeURIComponent(story.skills[0] ?? '')}`} className="ml-4 inline-block text-sm font-bold text-forest-green underline">Related community posts</Link>
      </article>
      <section id="related" className="mx-auto mt-8 max-w-4xl">
        <h2 className="mb-3 font-display text-xl font-bold text-forest-green">Related stories by shared skills</h2>
        <div className="grid gap-3 sm:grid-cols-3">{relatedStories.map((item) => <Link key={item.id} to={`/senior-success/story/${item.id}`} className="rounded-lg border border-forest-green/15 p-3 font-semibold text-forest-green hover:bg-cream-surface">{item.title}<span className="mt-1 block text-xs font-normal text-ink/70">{item.seniorName}</span></Link>)}</div>
      </section>
    </DashboardShell>
  )
}

function SeniorOpportunityDetail({ id }: { id: string }) {
  const opportunity = campusOpportunities.find((item) => item.id === id)
  if (!opportunity) return <MissingRecord />
  const story = seniorStories.find((item) => item.id === opportunity.storyId)
  return (
    <DashboardShell role="student" heading="Campus opportunity record" sections={[{ id: 'record', label: 'Opportunity details' }]}>
      <article id="record" className="mx-auto max-w-3xl space-y-4">
        <p className="text-sm text-ink/70">No live vacancy or verified opening is associated with this record.</p>
        <h2 className="font-display text-3xl font-extrabold text-forest-green">{opportunity.title}</h2>
        <p>{opportunity.organization} · {opportunity.type}</p>
        <p>{opportunity.description}</p>
        <p>{opportunity.eligibility}</p>
        <div><p className="mb-1 font-semibold">Skills and topics</p><Chips items={opportunity.skills} /></div>
        <p className="text-sm text-ink/70">Application status, date, deadline, source URL, and preparation materials are not available.</p>
        {story && <Link to={`/senior-success/story/${story.id}`} className="inline-block text-sm font-bold text-forest-green underline">Read related career story</Link>}
      </article>
    </DashboardShell>
  )
}

function SeniorPersonDetail({ id }: { id: string }) {
  const persona = seniorPersonas.find((item) => item.id === id)
  if (!persona) return <MissingRecord />
  const stories = seniorStories.filter((story) => story.authorPersonId === persona.id)
  return (
    <DashboardShell role="student" heading="Senior profile" sections={[{ id: 'profile', label: 'Profile' }, { id: 'stories', label: 'Stories' }]}>
      <article id="profile" className="mx-auto max-w-3xl space-y-3">
        <h2 className="font-display text-3xl font-extrabold text-forest-green">{persona.name}</h2>
        <p>{persona.degree} · Class of {persona.graduationYear}</p>
        <p>{persona.track} · {persona.headline}</p>
        <p>This example profile and its organization are illustrative; associated outcomes have not been verified.</p>
        <Chips items={[...persona.skills, ...persona.interests]} />
      </article>
      <section id="stories" className="mx-auto mt-6 max-w-3xl">
        <h2 className="mb-3 font-display text-xl font-bold text-forest-green">Related career stories</h2>
        {stories.length ? stories.map((story) => <Link key={story.id} to={`/senior-success/story/${story.id}`} className="mb-2 block rounded-lg border border-forest-green/15 p-3 font-semibold text-forest-green">{story.title}</Link>) : <p className="text-sm text-ink/75">No story record is available for this persona.</p>}
      </section>
    </DashboardShell>
  )
}

function StorySection({ title, children }: { title: string; children: React.ReactNode }) {
  return <section><h3 className="mb-1 font-display text-lg font-bold text-forest-green">{title}</h3><div className="text-sm leading-relaxed text-ink/85">{children}</div></section>
}

function MissingRecord() {
  return <div className="mx-auto max-w-3xl px-5 py-12"><h1 className="font-display text-2xl font-bold text-forest-green">Record not found</h1><Link to="/senior-success" className="mt-3 inline-block font-semibold text-forest-green underline">Back to Senior Success</Link></div>
}
