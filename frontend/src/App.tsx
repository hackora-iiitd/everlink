import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navigation from './components/Navigation'
import Home from './pages/Home'
import Search from './pages/Search'
import Profile from './pages/Profile'
import './App.css'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white-surface text-ink">
        <Navigation />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/profile/:id" element={<Profile />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
