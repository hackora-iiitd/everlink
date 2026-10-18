import { useEffect, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { search } from '../services/api'
import type { SearchResult } from '../types/api'

export default function Search() {
  const [searchParams] = useSearchParams()
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [intent, setIntent] = useState<any>(null)
  const [showGraph, setShowGraph] = useState(false)

  const query = searchParams.get('q') || ''

  useEffect(() => {
    if (query) {
      const performSearch = async () => {
        setLoading(true)
        setError(null)
        try {
          const response = await search(query, 20)
          if (response.success) {
            setResults(response.data.results)
            setIntent(response.data.intent)
          } else {
            setError('Search failed. Please try again.')
          }
        } catch (err: any) {
          setError(err.message || 'An error occurred during search')
        } finally {
          setLoading(false)
        }
      }
      performSearch()
    }
  }, [query])

  if (!query) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <p className="text-muted-ink">No search query provided. Go to the home page to start searching.</p>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Demo Banner */}
      <div className="demo-banner mb-6">
        Search results are ranked by relevance to your query.
      </div>

      <h1 className="text-3xl font-serif font-bold mb-2">Search Results</h1>
      <p className="text-muted-ink mb-6">
        Query: <span className="font-semibold text-ink">"{query}"</span>
      </p>

      {intent && (
        <div className="card mb-6 bg-cream-surface">
          <h2 className="font-serif font-bold text-midnight-blue mb-2">Search Intent</h2>
          <p className="text-sm text-muted-ink mb-2">
            <strong>Type:</strong> {intent.intent_type}
          </p>
          {intent.skills && intent.skills.length > 0 && (
            <p className="text-sm text-muted-ink mb-2">
              <strong>Skills:</strong> {intent.skills.join(', ')}
            </p>
          )}
          {intent.topics && intent.topics.length > 0 && (
            <p className="text-sm text-muted-ink">
              <strong>Topics:</strong> {intent.topics.join(', ')}
            </p>
          )}
        </div>
      )}

      {loading && (
        <div className="text-center py-12">
          <p className="text-muted-ink">Searching...</p>
        </div>
      )}

      {error && (
        <div className="bg-error bg-opacity-10 border border-error text-error p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      {!loading && results.length === 0 && !error && (
        <div className="text-center py-12">
          <p className="text-muted-ink">No results found for your search.</p>
        </div>
      )}

      <div className="flex gap-3 mb-4">
        <button onClick={() => setShowGraph(false)} className={`button ${!showGraph ? 'primary' : 'secondary'}`}>List View</button>
        <button onClick={() => setShowGraph(true)} className={`button ${showGraph ? 'primary' : 'secondary'}`}>Graph View</button>
      </div>

      {!showGraph ? (
        <div className="grid gap-6">
          {results.map((result) => (
          <Link
            key={result.candidate_id}
            to={`/profile/${result.candidate_id}`}
            className="card hover:shadow-md transition group"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <h2 className="text-xl font-serif font-bold text-ink group-hover:text-midnight-blue transition">
                  {result.candidate_name}
                </h2>
                <p className="text-sm text-muted-ink capitalize">
                  {result.candidate_role}
                  {result.headline && ` · ${result.headline}`}
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-serif font-bold text-midnight-blue">
                  {result.score.toFixed(1)}
                </div>
                <p className="text-xs text-muted-ink">/100</p>
              </div>
            </div>

            <p className="text-sm text-muted-ink mb-4">{result.explanation}</p>

            <div className="flex flex-wrap gap-2 mb-3">
              {result.matched_skills.map((skill) => (
                <span key={skill} className="badge">
                  {skill}
                </span>
              ))}
              {result.matched_topics.map((topic) => (
                <span key={topic} className="badge success">
                  {topic}
                </span>
              ))}
            </div>

            <div className="text-sm font-semibold text-midnight-blue group-hover:text-muted-ink transition">
              View Profile →
            </div>
          </Link>
        ))}
      </div>

      ) : (
        <div className="bg-cream-surface border border-border-rule rounded-lg p-6">
          <h3 className="font-serif font-bold text-xl text-ink mb-4">Graph Structure</h3>
          <p className="text-muted-ink mb-6">Visualization of search results as a knowledge graph (nodes: people; edges: skills/interests/topics). Will activate when database connects.</p>
          <div className="border-2 border-dashed border-border-rule rounded p-8 text-center">
            <div className="text-4xl mb-3">🕸</div>
            <h4 className="font-serif font-bold text-lg text-ink mb-2">Graph Visualization</h4>
            <p className="text-sm text-muted-ink mb-4">Shows relationships between candidates, skills, topics, and projects based on Neo4j graph data.</p>
            <p className="text-xs text-muted-ink uppercase tracking-wide">Requires active Neo4j connection</p>
          </div>
        </div>
      )}
    </div>
  )
}
