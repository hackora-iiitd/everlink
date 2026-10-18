import { useNavigate } from 'react-router-dom'
import AuthLayout from '../../components/auth/AuthLayout'
import ProjectForm from '../../components/professor/ProjectForm'
import { loadSignup, usePersistentState } from '../../lib/demoSession'
import type { Project } from '../../lib/types'

/** After registration: publish a first research opening (or skip and do it from the dashboard). */
export default function ProfessorOnboarding() {
  const navigate = useNavigate()
  const saved = loadSignup()
  const name = (saved?.fullName ?? '').split(' ').slice(-1)[0]
  const [, setProjects] = usePersistentState<Project[]>('everlink.professor.projects', [])

  return (
    <AuthLayout
      role="professor"
      wide
      title={`Publish your first research opening${name ? `, Prof. ${name}` : ''}`}
      subtitle="Students and alumni see this when they look for projects. You can edit it, add more and review applicants from your dashboard."
    >
      <ProjectForm
        submitLabel="Publish and go to dashboard"
        onSubmit={(p) => {
          setProjects((prev) => [p, ...prev])
          navigate('/dashboard/professor')
        }}
      />
      <button type="button" onClick={() => navigate('/dashboard/professor')} className="mt-6 text-sm font-semibold text-ink/55 underline hover:text-forest-green">
        Skip for now
      </button>
    </AuthLayout>
  )
}
