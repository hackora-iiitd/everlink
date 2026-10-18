import { Link } from 'react-router-dom'
import DashboardShell, { Section } from '../../components/dashboard/DashboardShell'
import CommunityGraph from '../../components/dashboard/CommunityGraph'
import { communityGraphFor } from '../../lib/communityGraphData'
import { useSession } from '../../lib/demoSession'

const sections = [{ id: 'network', label: 'Community network' }, { id: 'moderation', label: 'Content moderation' }]

export default function AdminDashboard() {
  const session = useSession()
  return (
    <DashboardShell role="admin" heading="Community overview" sections={sections}>
      <Section id="network" title="Community Network" description="A role-aware institutional view.">
        <CommunityGraph data={communityGraphFor('admin', session?.name ?? 'Community Admin')} />
      </Section>
      <Section id="moderation" title="Content moderation" description="Review submitted community posts and hide or restore posts from the feed.">
        <p className="mb-3 text-sm text-ink/75">Moderation actions currently apply only in this browser. This is a prototype control, not a server-enforced moderation boundary.</p>
        <Link to="/opportunities-stories" className="inline-block rounded-full bg-forest-green px-4 py-2 text-sm font-semibold text-white-surface hover:bg-midnight-blue">Review community feed</Link>
      </Section>
    </DashboardShell>
  )
}
