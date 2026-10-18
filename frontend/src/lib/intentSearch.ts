import { search, type SearchResult } from './api'
import { sampleFaculty, sampleStudents } from './sampleData'

export type IntentCategory = 'professor' | 'alumni' | 'student' | 'project' | 'people'
export type IntentResult = SearchResult & { entityType: IntentCategory }
const projects = [{ id: 'vision-health', name: 'Vision for Health', topics: ['Healthcare AI', 'Computer Vision'], explanation: 'Research project exploring computer vision methods for health applications.' }]

export function inferIntent(query: string): { category: IntentCategory; topic: string } {
  const lower = query.toLowerCase()
  const category: IntentCategory = /project|research opening/.test(lower) ? 'project' : /professor|faculty/.test(lower) ? 'professor' : /alumni|senior|mentor/.test(lower) ? 'alumni' : /student|teammate/.test(lower) ? 'student' : 'people'
  const topic = ['computer vision', 'healthcare ai', 'machine learning', 'open source', 'signal processing'].find((value) => lower.includes(value)) ?? ''
  return { category, topic }
}

const containsTopic = (values: string[], topic: string) => !topic || values.some((value) => {
  const candidate = value.toLowerCase(); const requested = topic.toLowerCase()
  return candidate.includes(requested) || requested.includes(candidate) || (requested === 'machine learning' && /\bml\b/.test(candidate))
})
const makeResult = (id: string, name: string, role: string, values: string[], explanation: string, entityType: IntentCategory): IntentResult => ({ candidate_id: id, candidate_name: name, candidate_role: role, score: 100, matching_mode: 'relevance', explanation, matched_skills: values, matched_topics: values, entityType })

function seededResults(category: IntentCategory, topic: string): IntentResult[] {
  if (category === 'professor') return sampleFaculty.filter((person) => person.kind === 'Faculty' && containsTopic(person.topics, topic)).map((person) => makeResult(person.id, person.name, 'Professor', person.topics, `Relevant expertise: ${person.topics.join(', ')}.`, 'professor'))
  if (category === 'alumni') return sampleFaculty.filter((person) => person.kind === 'Alumna' && containsTopic(person.topics, topic)).map((person) => makeResult(person.id, person.name, 'Alumna', person.topics, `Relevant expertise: ${person.topics.join(', ')}.`, 'alumni'))
  if (category === 'student') return sampleStudents.filter((person) => containsTopic([...person.skills, ...person.interests], topic)).map((person) => makeResult(person.id, person.name, 'Student', [...person.skills, ...person.interests], person.why, 'student'))
  if (category === 'project') return projects.filter((project) => containsTopic(project.topics, topic)).map((project) => makeResult(project.id, project.name, 'Research project', project.topics, project.explanation, 'project'))
  return [...seededResults('professor', topic), ...seededResults('alumni', topic), ...seededResults('student', topic)]
}

const roleMatches = (role: string, category: IntentCategory) => category === 'people' || category === 'project' ? category === 'people' : role.toLowerCase().includes(category === 'alumni' ? 'alumn' : category)

export async function runIntentSearch(query: string): Promise<{ intent: { category: IntentCategory; topic: string }; results: IntentResult[] }> {
  const intent = inferIntent(query)
  try {
    const response = await search(query, 20)
    const results = response.data.results.filter((result) => roleMatches(result.candidate_role, intent.category) && (!intent.topic || containsTopic([...result.matched_skills, ...result.matched_topics], intent.topic))).map((result) => ({ ...result, entityType: intent.category }))
    if (results.length) return { intent, results }
  } catch { /* The seeded records remain available for discovery when the API is offline. */ }
  return { intent, results: seededResults(intent.category, intent.topic) }
}
