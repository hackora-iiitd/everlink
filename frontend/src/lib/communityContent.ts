import content from '../../public/community-content.json'

export type OpportunityType =
  | 'internship'
  | 'full-time'
  | 'research'
  | 'scholarship'
  | 'competition'
  | 'entrepreneurship'
  | 'fellowship'

export type SeniorPersona = {
  id: string
  name: string
  role: 'senior' | 'alumni'
  graduationYear: number
  degree: string
  department: string
  track: string
  headline: string
  organization: string
  currentRole: string
  skills: string[]
  interests: string[]
  fictional: true
}

export type SeniorStory = {
  id: string
  type: 'story'
  fictional: true
  authorPersonId: string
  seniorName: string
  graduationYear: number
  degree: string
  department: string
  title: string
  organization: string
  opportunityType: OpportunityType
  year: number
  summary: string
  startingPoint: string
  preparation: string
  skills: string[]
  resources: string[]
  challenges: string
  lessons: string
  timeline: { label: string; detail: string }[]
  advice: string
  tags: string[]
  relatedOpportunityId: string
}

export type CampusOpportunity = {
  id: string
  title: string
  organization: string
  type: OpportunityType
  description: string
  skills: string[]
  eligibility: string
  status: string
  applicationUrl: null
  deadline: null
  source: string
  fictional: true
  storyId: string
}

export type CommunityPostKind = 'hiring' | 'internship' | 'referral' | 'blog' | 'campus'
export type CommunityPostStatus = 'published' | 'withdrawn' | 'development-only'

export type CommunityPost = {
  id: string
  type: CommunityPostKind
  fictional: boolean
  authorPersonId?: string
  authorName: string
  authorRole: string
  authorEmail?: string
  organization: string
  title: string
  summary: string
  content: string
  skills: string[]
  tags: string[]
  eligibility: string
  applicationUrl: string | null
  deadline: string | null
  status: CommunityPostStatus
  publishedAt: string
}

const seed = content as {
  profiles: SeniorPersona[]
  stories: SeniorStory[]
  opportunities: CampusOpportunity[]
  posts: CommunityPost[]
}

export const seniorPersonas = seed.profiles
export const seniorStories = seed.stories
export const campusOpportunities = seed.opportunities
export const developmentPosts = seed.posts

export const graduationBatches = [...new Set(seniorPersonas.map((person) => person.graduationYear))]
  .sort((a, b) => b - a)
export const storyOrganizations = [
  ...new Set(seniorStories.map((story) => story.organization)),
].sort()
export const storySkills = [...new Set(seniorStories.flatMap((story) => story.skills))].sort()

export const postTypeLabels: Record<CommunityPostKind, string> = {
  hiring: 'Hiring',
  internship: 'Internships',
  referral: 'Referrals',
  blog: 'Blogs',
  campus: 'Campus opportunities',
}

export function postUrl(value: string): string | null {
  if (!value.trim()) return null
  try {
    const url = new URL(value)
    return url.protocol === 'https:' || url.protocol === 'http:' ? url.toString() : null
  } catch {
    return null
  }
}
