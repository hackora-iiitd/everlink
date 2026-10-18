import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { roles } from './roles'
import type { RoleKey } from './roles'
import { dashboardPath, useSession } from '../../lib/demoSession'

/**
 * Client-side route guard for a better UX only. The backend must authorize every API call itself.
 * - Not signed in: send to that role's sign-in.
 * - Signed in as another role: send to their own dashboard.
 * - Alumni who are not yet verified: send to the verification-status page.
 */
export default function RequireRole({ role, children }: { role: RoleKey; children: ReactNode }) {
  const session = useSession()
  if (!session) return <Navigate to={roles[role].loginPath} replace />
  if (session.role !== role) return <Navigate to={dashboardPath(session)} replace />
  if (role === 'alumni' && !session.verified) return <Navigate to="/verify/alumni" replace />
  return <>{children}</>
}
