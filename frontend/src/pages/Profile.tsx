import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getPerson, Person } from '../lib/api'

export default function Profile() {
  const { id } = useParams<{ id: string }>()
  const [person, setPerson] = useState<Person | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (!id) {
      setError('No person ID provided')
      setLoading(false)
      return
    }

    const fetchPerson = async () => {
      try {
        const response = await getPerson(id)
        if (response.success) {
          setPerson(response.data)
        } else {
          setError('Failed to load person profile')
        }
      } catch (err: any) {
        setError(err.message || 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchPerson()
  }, [id])

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <p className="text-muted-ink">Loading...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-error bg-opacity-10 border border-error text-error p-4 rounded-lg mb-6">
          {error}
        </div>
        <button
          onClick={() => navigate('/')}
          className="button primary"
        >
          Back to Home
        </button>
      </div>
    )
  }

  if (!person) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <p className="text-muted-ink">Person not found</p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Demo Banner */}
      <div className="demo-banner mb-6">
        ⚠️ DEMO DATA — This is a fictional profile for demonstration purposes.
      </div>

      <div className="card mb-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-3xl font-serif font-bold text-ink mb-2">
              {person.name}
            </h1>
            <p className="text-lg text-muted-ink capitalize">
              {person.role}
              {person.department && ` • ${person.department}`}
            </p>
          </div>
          <div className="badge success text-lg px-4 py-2 capitalize">
            {person.role}
          </div>
        </div>

        {person.headline && (
          <p className="text-lg text-ink font-semibold mb-4">{person.headline}</p>
        )}

        {person.bio && (
          <p className="text-muted-ink mb-6 leading-relaxed">{person.bio}</p>
        )}

        <div className="grid grid-cols-2 gap-4 py-4 border-t border-border-rule border-b">
          {person.department && (
            <div>
              <p className="text-xs font-semibold text-muted-ink uppercase">Department</p>
              <p className="text-ink font-semibold">{person.department}</p>
            </div>
          )}
          {person.id && (
            <div>
              <p className="text-xs font-semibold text-muted-ink uppercase">ID</p>
              <p className="text-ink font-mono text-sm">{person.id}</p>
            </div>
          )}
        </div>
      </div>

      {/* Skills */}
      {person.skills && person.skills.length > 0 && (
        <div className="card mb-6">
          <h2 className="text-xl font-serif font-bold text-ink mb-4">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {person.skills.map((skill) => (
              <span key={skill} className="badge">
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Interests */}
      {person.interests && person.interests.length > 0 && (
        <div className="card mb-6">
          <h2 className="text-xl font-serif font-bold text-ink mb-4">Interests</h2>
          <div className="flex flex-wrap gap-2">
            {person.interests.map((interest) => (
              <span key={interest} className="badge success">
                {interest}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-4">
        <button
          onClick={() => navigate('/')}
          className="button secondary"
        >
          ← Back
        </button>
        <button className="button primary">
          Send Mentorship Request
        </button>
      </div>
    </div>
  )
}
