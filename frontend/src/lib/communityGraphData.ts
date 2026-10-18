import type { RoleKey } from '../components/auth/roles'

export type GraphNodeKind = 'person' | 'skill' | 'interest' | 'project' | 'department'
export type GraphNode = { id: string; label: string; kind: GraphNodeKind; role?: string; skills?: string[]; interests?: string[]; detail?: string }
export type GraphEdge = { id: string; source: string; target: string; type: string; strength: number; explanation: string }
export type CommunityGraphData = { nodes: GraphNode[]; edges: GraphEdge[] }

/**
 * Demo relevance = 0.2 base + 0.15 per shared skill + 0.12 per shared interest,
 * with direct mentorship/project relationships receiving a configurable 0.25 boost.
 * Values are capped at 1 and represent matching relevance, not social closeness.
 */
const weights = { base: 0.2, skill: 0.15, interest: 0.12, direct: 0.25 }
const clamp = (n: number) => Math.max(0.1, Math.min(1, n))
const person = (id: string, label: string, role: string, skills: string[], interests: string[], detail?: string): GraphNode => ({ id, label, kind: 'person', role, skills, interests, detail })

const networkPeople = [
  person('aarohi', 'Aarohi S.', 'Student · 3rd year', ['Python', 'Machine Learning'], ['Healthcare AI', 'Research'], 'Computer Science'),
  person('tanvi', 'Tanvi R.', 'Student · 2nd year', ['React', 'SQL'], ['Open Source', 'Startups'], 'Information Technology'),
  person('neha', 'Neha G.', 'Alumna · Senior Data Scientist', ['Python', 'Machine Learning'], ['Healthcare AI', 'Applied ML'], 'Analytics Co.'),
  person('sharma', 'Prof. A. Sharma', 'Professor', ['Computer Vision', 'Python'], ['Healthcare AI', 'Computer Vision'], 'Computer Science'),
]

export function communityGraphFor(role: RoleKey, name: string, interests: string[] = [], skills: string[] = []): CommunityGraphData {
  const current = person('current-user', name || (role === 'admin' ? 'Community Admin' : 'You'), role === 'admin' ? 'Administrator' : role[0].toUpperCase() + role.slice(1), skills.length ? skills : role === 'professor' ? ['Computer Vision', 'Python'] : ['Python', 'Machine Learning'], interests.length ? interests : role === 'professor' ? ['Healthcare AI', 'Computer Vision'] : ['Healthcare AI', 'Open Source'], 'Signed-in profile')
  const people = role === 'admin'
    ? [...networkPeople, person('menon', 'Dr. R. Menon', 'Professor', ['Signal Processing'], ['Biomedical signals'], 'Electronics & Communication')]
    : networkPeople
  const nodes: GraphNode[] = [current, ...people]
  const edges: GraphEdge[] = []
  const addPersonEdge = (target: GraphNode, direct = false) => {
    const sharedSkills = target.skills?.filter((x) => current.skills?.includes(x)) ?? []
    const sharedInterests = target.interests?.filter((x) => current.interests?.includes(x)) ?? []
    const strength = clamp(weights.base + sharedSkills.length * weights.skill + sharedInterests.length * weights.interest + (direct ? weights.direct : 0))
    const parts = [sharedInterests.length ? `shares ${sharedInterests.length} interest${sharedInterests.length === 1 ? '' : 's'}` : '', sharedSkills.length ? `${sharedSkills.length} skill${sharedSkills.length === 1 ? '' : 's'} in common` : ''].filter(Boolean)
    edges.push({ id: `current-${target.id}`, source: current.id, target: target.id, type: direct ? 'Mentorship / project' : 'Interest relevance', strength, explanation: `${direct ? 'Direct opportunity: ' : 'Relevance estimate: '}${parts.join(' and ') || 'same community context'}. This is a relevance score, not a measure of a real-world relationship.` })
  }
  people.forEach((p) => addPersonEdge(p, role === 'student' && (p.id === 'sharma' || p.id === 'neha') || role === 'professor' && p.id === 'aarohi'))
  const concepts: GraphNode[] = role === 'admin'
    ? [{ id: 'cs', label: 'Computer Science', kind: 'department', detail: 'Department' }, { id: 'ece', label: 'Electronics & Communication', kind: 'department', detail: 'Department' }]
    : [{ id: 'health-ai', label: 'Healthcare AI', kind: 'interest', detail: 'Research topic' }, { id: 'python', label: 'Python', kind: 'skill', detail: 'Shared skill' }, { id: 'vision-project', label: 'Vision for Health', kind: 'project', detail: 'Research project' }]
  nodes.push(...concepts)
  if (role === 'admin') {
    edges.push({ id: 'aarohi-cs', source: 'aarohi', target: 'cs', type: 'Member of', strength: 0.65, explanation: 'Direct institutional affiliation.' }, { id: 'sharma-cs', source: 'sharma', target: 'cs', type: 'Member of', strength: 0.65, explanation: 'Direct institutional affiliation.' }, { id: 'menon-ece', source: 'menon', target: 'ece', type: 'Member of', strength: 0.65, explanation: 'Direct institutional affiliation.' })
  } else {
    edges.push({ id: 'sharma-health', source: 'sharma', target: 'health-ai', type: 'Research topic', strength: 0.78, explanation: 'Direct research-topic relationship.' }, { id: 'aarohi-python', source: 'aarohi', target: 'python', type: 'Skill', strength: 0.72, explanation: 'Direct skill relationship.' }, { id: 'neha-health', source: 'neha', target: 'health-ai', type: 'Research topic', strength: 0.7, explanation: 'This shared topic can form an indirect path.' }, { id: 'sharma-project', source: 'sharma', target: 'vision-project', type: 'Leads project', strength: 0.9, explanation: 'Professor leads this research project.' })
  }
  return { nodes, edges }
}
