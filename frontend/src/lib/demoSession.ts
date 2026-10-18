/**
 * Client-side stand-in for the auth backend.
 *
 * IMPORTANT: everything here runs in the browser, so none of it is a security
 * boundary. The same rules (IGDTUW email domain, LinkedIn verification, alumni
 * approval) MUST be enforced again by the backend. See docs/AUTH.md.
 */
import { useEffect, useState } from 'react'
import type { RoleKey } from '../components/auth/roles'

export const IGDTUW_DOMAIN = 'igdtuw.ac.in'
export const INSTITUTION_NAME = 'Indira Gandhi Delhi Technical University for Women (IGDTUW)'

/** Demo mode simulates email delivery, LinkedIn and alumni approval. Set VITE_DEMO_MODE=false to disable. */
export const DEMO_MODE = import.meta.env.VITE_DEMO_MODE !== 'false'
export const API_URL: string = import.meta.env.VITE_API_URL ?? ''

export const isValidEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim())

/** Exactly name@igdtuw.ac.in. Look-alikes such as name@evil-igdtuw.ac.in or name@igdtuw.ac.in.example.com fail. */
export const isIgdtuwEmail = (v: string) => {
  const e = v.trim().toLowerCase()
  return isValidEmail(e) && e.endsWith(`@${IGDTUW_DOMAIN}`) && e.split('@').length === 2
}

export const igdtuwEmailError = (v: string): string | undefined => {
  if (!isValidEmail(v)) return 'Enter a valid email address.'
  if (!isIgdtuwEmail(v)) return `Use your IGDTUW email (name@${IGDTUW_DOMAIN}).`
  return undefined
}

export const isLinkedInProfileUrl = (v: string) =>
  /^(https?:\/\/)?([a-z]{2,3}\.)?linkedin\.com\/in\/[A-Za-z0-9\-_%]{3,100}\/?(\?.*)?$/i.test(v.trim())

/* ---------- safe storage ---------- */

const read = <T,>(storage: 'local' | 'session', key: string): T | null => {
  try {
    const s = storage === 'local' ? window.localStorage : window.sessionStorage
    const raw = s.getItem(key)
    return raw ? (JSON.parse(raw) as T) : null
  } catch {
    return null
  }
}
const write = (storage: 'local' | 'session', key: string, value: unknown) => {
  try {
    const s = storage === 'local' ? window.localStorage : window.sessionStorage
    if (value === null) s.removeItem(key)
    else s.setItem(key, JSON.stringify(value))
  } catch {
    /* storage unavailable (private mode etc.): flows still work within the page */
  }
}

/* ---------- signup draft (no passwords are ever stored) ---------- */

export type Signup = {
  role: RoleKey
  fullName?: string
  email?: string
  [k: string]: unknown
}

export const saveSignup = (s: Signup) => write('session', 'everlink.signup', s)
export const loadSignup = (): Signup | null => read<Signup>('session', 'everlink.signup')

/* ---------- session ---------- */

export type Session = {
  role: RoleKey
  name: string
  email: string
  method: 'igdtuw-email' | 'linkedin'
  /** Alumni start unverified until their IGDTUW education is confirmed. Students and professors are verified by email. */
  verified: boolean
}

const SESSION_EVENT = 'everlink:session'

export const getSession = (): Session | null => read<Session>('local', 'everlink.session')
export const setSession = (s: Session) => {
  write('local', 'everlink.session', s)
  window.dispatchEvent(new Event(SESSION_EVENT))
}
export const clearSession = () => {
  write('local', 'everlink.session', null)
  window.dispatchEvent(new Event(SESSION_EVENT))
}

export function useSession(): Session | null {
  const [s, setS] = useState<Session | null>(getSession)
  useEffect(() => {
    const sync = () => setS(getSession())
    window.addEventListener(SESSION_EVENT, sync)
    window.addEventListener('storage', sync)
    return () => {
      window.removeEventListener(SESSION_EVENT, sync)
      window.removeEventListener('storage', sync)
    }
  }, [])
  return s
}

export const dashboardPath = (s: Session) =>
  s.role === 'alumni' && !s.verified ? '/verify/alumni' : `/dashboard/${s.role}`

export const nameFromEmail = (email: string) =>
  email
    .split('@')[0]
    .replace(/[0-9._-]+/g, ' ')
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase()) || 'Member'

/* ---------- persistent state hook ---------- */

export function usePersistentState<T>(key: string, initial: T): [T, (v: T | ((p: T) => T)) => void] {
  const [value, setValue] = useState<T>(() => read<T>('local', key) ?? initial)
  const update = (v: T | ((p: T) => T)) =>
    setValue((prev) => {
      const next = typeof v === 'function' ? (v as (p: T) => T)(prev) : v
      write('local', key, next)
      return next
    })
  return [value, update]
}

/* ---------- LinkedIn identity + alumni records (demo registry) ---------- */

export type LinkedInIdentity = { name: string; email: string; profileUrl: string }

export type AlumniRecord = {
  identity: LinkedInIdentity
  status: 'pending' | 'verified' | 'rejected'
  gradYear: string
  degree: string
  branch: string
  organization: string
  jobTitle: string
  industry: string
  skills: string[]
  expertise: string[]
  mentoring: { accepting: boolean; hoursPerMonth: string; modes: string[] }
  offers: string[]
  submittedAt: string
}

const alumniKey = (email: string) => `everlink.alumni.${email.trim().toLowerCase()}`
export const loadAlumni = (email: string) => read<AlumniRecord>('local', alumniKey(email))
export const saveAlumni = (r: AlumniRecord) => write('local', alumniKey(r.identity.email), r)

export const savePendingIdentity = (i: LinkedInIdentity) => write('session', 'everlink.linkedin', i)
export const loadPendingIdentity = () => read<LinkedInIdentity>('session', 'everlink.linkedin')

/** Where LinkedIn sign-in begins. With a backend it is a redirect to the OAuth start route. */
export const linkedInStart = (intent: 'login' | 'register') =>
  !DEMO_MODE && API_URL
    ? { external: true, url: `${API_URL}/auth/linkedin/start?intent=${intent}` }
    : { external: false, url: `/auth/linkedin/callback?demo=1&intent=${intent}` }
