import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navigation from '../components/layout/Navigation'
import Home from '../pages/Home'
import Search from '../pages/Search'
import Profile from '../pages/Profile'
import ComingSoon from '../pages/ComingSoon'
import SignInChooser from '../pages/auth/SignInChooser'
import Login from '../pages/auth/Login'
import ForgotPassword from '../pages/auth/ForgotPassword'
import VerifyEmail from '../pages/auth/VerifyEmail'
import StudentRegister from '../pages/student/StudentRegister'
import StudentOnboarding from '../pages/student/StudentOnboarding'
import './App.css'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white-surface text-ink">
        <Navigation />
        <Routes>
          <Route path="/" element={<Home />} />

          {/* Public pages — built one by one */}
          <Route path="/how-it-works" element={<ComingSoon title="How It Works" />} />
          <Route path="/features" element={<ComingSoon title="Features" />} />
          <Route path="/explore" element={<ComingSoon title="Explore the Network" />} />
          <Route path="/about" element={<ComingSoon title="About & Help" />} />

          {/* Auth portals */}
          <Route path="/signin" element={<SignInChooser />} />
          <Route path="/join/student" element={<StudentRegister />} />
          <Route path="/login/student" element={<Login role="student" />} />
          <Route path="/login/alumni" element={<Login role="alumni" />} />
          <Route path="/login/professor" element={<Login role="professor" />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/onboarding/student" element={<StudentOnboarding />} />
          <Route path="/dashboard/student" element={<ComingSoon title="Student Dashboard" />} />
          <Route path="/join/alumni" element={<ComingSoon title="Alumni Portal" />} />
          <Route path="/join/professor" element={<ComingSoon title="Professor Portal" />} />

          {/* Existing pages */}
          <Route path="/search" element={<Search />} />
          <Route path="/profile/:id" element={<Profile />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
