export type Project = {
  id: string
  title: string
  abstract: string
  domain: string
  skills: string[]
  prerequisites: string
  duration: string
  positions: number
  instructions: string
  closingDate?: string
  status: 'open' | 'closed'
}

export const researchDomains = [
  'Healthcare AI',
  'Machine Learning',
  'Data Science',
  'NLP',
  'Cybersecurity',
  'VLSI & Embedded Systems',
  'Robotics',
  'Sustainability',
  'HCI & Design',
  'Other',
]

export const durations = ['1 month', '2–3 months', 'One semester', 'One year', 'Ongoing']
