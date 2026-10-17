import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Home() {
  const [query, setQuery] = useState('')
  const navigate = useNavigate()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query)}`)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-cream-surface to-white-surface">
      {/* Demo Banner */}
      <div className="bg-cream-surface border-b border-border-rule p-4">
        <div className="max-w-7xl mx-auto">
          <p className="text-center text-sm text-muted-ink">
            ⚠️ DEMO DATA — All profiles and achievements are fictional and are provided only to demonstrate Everlink.
          </p>
        </div>
      </div>

      {/* Hero Section */}
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-serif font-bold text-ink mb-4">
            Everlink
          </h1>
          <p className="text-2xl text-muted-ink mb-2 font-serif">
            We don't just match profiles. We connect possibilities.
          </p>
          <p className="text-lg text-muted-ink max-w-2xl mx-auto">
            Transform your university's disconnected students, seniors, alumni, and professors into one intelligent,
            interconnected network. Discover not just people, but the relationships that can move you forward.
          </p>
        </div>

        {/* Search Box */}
        <form onSubmit={handleSearch} className="mb-12">
          <div className="bg-white-surface border-2 border-midnight-blue rounded-lg p-2 flex">
            <input
              type="text"
              placeholder="Find mentors, research projects, teammates, opportunities..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 px-4 py-3 outline-none text-ink bg-transparent"
            />
            <button
              type="submit"
              className="bg-midnight-blue text-white-surface px-6 py-3 rounded font-semibold hover:bg-opacity-90 transition"
            >
              Search
            </button>
          </div>
        </form>

        {/* Example Queries */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <div className="card">
            <h3 className="font-serif text-lg font-bold text-midnight-blue mb-2">
              Find a Mentor
            </h3>
            <p className="text-muted-ink mb-4 text-sm">
              "Find a senior with healthcare AI experience who can guide me"
            </p>
            <button
              onClick={() => setQuery("Find a senior with healthcare AI experience who can guide me")}
              className="text-midnight-blue font-semibold hover:text-buttermilk transition text-sm"
            >
              Try this →
            </button>
          </div>

          <div className="card">
            <h3 className="font-serif text-lg font-bold text-midnight-blue mb-2">
              Explore Research
            </h3>
            <p className="text-muted-ink mb-4 text-sm">
              "Show me professors working on healthcare AI with active projects"
            </p>
            <button
              onClick={() => setQuery("Show me professors working on healthcare AI with active projects")}
              className="text-midnight-blue font-semibold hover:text-buttermilk transition text-sm"
            >
              Try this →
            </button>
          </div>

          <div className="card">
            <h3 className="font-serif text-lg font-bold text-midnight-blue mb-2">
              Build a Team
            </h3>
            <p className="text-muted-ink mb-4 text-sm">
              "Find teammates with backend and deployment skills"
            </p>
            <button
              onClick={() => setQuery("Find teammates with backend and deployment skills")}
              className="text-midnight-blue font-semibold hover:text-buttermilk transition text-sm"
            >
              Try this →
            </button>
          </div>

          <div className="card">
            <h3 className="font-serif text-lg font-bold text-midnight-blue mb-2">
              Alumni Achievements
            </h3>
            <p className="text-muted-ink mb-4 text-sm">
              "Find alumni with open-source experience and GSoC participation"
            </p>
            <button
              onClick={() => setQuery("Find alumni with open-source experience and GSoC participation")}
              className="text-midnight-blue font-semibold hover:text-buttermilk transition text-sm"
            >
              Try this →
            </button>
          </div>
        </div>

        {/* Features */}
        <div className="bg-midnight-blue text-white-surface rounded-lg p-8">
          <h2 className="text-2xl font-serif font-bold mb-6">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="text-2xl font-serif font-bold text-buttermilk mb-2">1</div>
              <h3 className="font-semibold mb-2">Ask in Natural Language</h3>
              <p className="text-sm text-opacity-80">
                Describe who you're looking for or what you want to learn. Our engine understands your intent.
              </p>
            </div>
            <div>
              <div className="text-2xl font-serif font-bold text-buttermilk mb-2">2</div>
              <h3 className="font-semibold mb-2">Explore the Graph</h3>
              <p className="text-sm text-opacity-80">
                We search a unified knowledge graph of people, skills, projects, and relationships.
              </p>
            </div>
            <div>
              <div className="text-2xl font-serif font-bold text-buttermilk mb-2">3</div>
              <h3 className="font-semibold mb-2">Get Recommendations</h3>
              <p className="text-sm text-opacity-80">
                See ranked matches with explanations of why each person or project matters for your goal.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
