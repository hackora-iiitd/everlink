import { useNavigate } from 'react-router-dom'
import { BadgeCheck } from 'lucide-react'
import { linkedInStart } from '../../lib/demoSession'

/** "Continue with LinkedIn": redirects to the backend OAuth route, or the simulated step in demo mode. */
export default function LinkedInButton({ intent, className = '' }: { intent: 'login' | 'register'; className?: string }) {
  const navigate = useNavigate()
  const go = () => {
    const t = linkedInStart(intent)
    if (t.external) window.location.assign(t.url)
    else navigate(t.url)
  }
  return (
    <button
      type="button"
      onClick={go}
      className={`inline-flex items-center justify-center gap-2.5 rounded-full bg-midnight-blue px-7 py-3.5 font-semibold text-white-surface shadow-lg shadow-midnight-blue/20 transition hover:bg-teal ${className}`}
    >
      <BadgeCheck size={20} /> Continue with LinkedIn
    </button>
  )
}
