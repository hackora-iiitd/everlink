import DashboardShell, { Section } from '../../components/dashboard/DashboardShell'
import CommunityGraph from '../../components/dashboard/CommunityGraph'
import { communityGraphFor } from '../../lib/communityGraphData'
import { useSession } from '../../lib/demoSession'

const sections = [{ id: 'network', label: 'Community network' }]

export default function AdminDashboard() {
  const session = useSession()
  return (
    <DashboardShell role="admin" heading="Community overview" sections={sections}>
      <Section id="network" title="Community Network" description="A role-aware institutional view.">
        <CommunityGraph data={communityGraphFor('admin', session?.name ?? 'Community Admin')} />
      </Section>
    </DashboardShell>
  )
}
