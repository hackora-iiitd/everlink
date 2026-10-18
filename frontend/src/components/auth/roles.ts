export type RoleKey = 'student' | 'alumni' | 'professor'

export type RoleConfig = {
  key: RoleKey
  label: string
  tagline: string
  /** Shown on the sign-in screen */
  welcome: string
  points: string[]
  registerPath: string
  loginPath: string
}

export const roles: Record<RoleKey, RoleConfig> = {
  student: {
    key: 'student',
    label: 'Student',
    tagline: 'Discover people who help you grow.',
    welcome: 'Welcome back. Your next mentor, project or teammate may already be waiting.',
    points: [
      'Ranked matches, each with the reason it fits you',
      'Mentors, professors and teammates in one place',
      'You decide who can see your profile',
    ],
    registerPath: '/join/student',
    loginPath: '/login/student',
  },
  alumni: {
    key: 'alumni',
    label: 'Alumni / Senior',
    tagline: 'Share your experience. Open new doors.',
    welcome: 'Welcome back. Students are looking for the guidance only you can give.',
    points: [
      'Verified IGDTUW alumni only, so students know who they meet',
      'Mentor students on your own terms',
      'Offer referrals, mock interviews and internships',
      'Stay connected with your batch and peers in industry',
    ],
    registerPath: '/join/alumni',
    loginPath: '/login/alumni',
  },
  professor: {
    key: 'professor',
    label: 'Professor',
    tagline: 'Connect research with the right minds.',
    welcome: 'Welcome back. Your research projects and applicants are one click away.',
    points: [
      'Publish research openings with clear prerequisites',
      'Find students by skills and research interests',
      'Collaborate with faculty and alumni',
    ],
    registerPath: '/join/professor',
    loginPath: '/login/professor',
  },
}

export const roleList = Object.values(roles)
