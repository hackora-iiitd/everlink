import { Link } from 'react-router-dom'

export default function Navigation() {
  return (
    <nav className="bg-midnight-blue text-white-surface sticky top-0 z-50 border-b border-border-rule">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold font-serif hover:text-buttermilk transition">
          Everlink
        </Link>
        <div className="flex items-center gap-8">
          <Link to="/" className="hover:text-buttermilk transition">
            Home
          </Link>
          <Link to="/search" className="hover:text-buttermilk transition">
            Search
          </Link>
          <a
            href="http://localhost:8000/api/docs"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-buttermilk transition"
          >
            API Docs
          </a>
        </div>
      </div>
    </nav>
  )
}
