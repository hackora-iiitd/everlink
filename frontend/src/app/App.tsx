import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navigation from '../components/layout/Navigation'
import Home from '../pages/Home'
import Search from '../pages/Search'
import Profile from '../pages/Profile'
import HowItWorks from '../pages/public/HowItWorks'
import Features from '../pages/public/Features'
import Explore from '../pages/public/Explore'
import About from '../pages/public/About'
import SignInChooser from '../pages/auth/SignInChooser'
import Login from '../pages/auth/Login'
import ForgotPassword from '../pages/auth/ForgotPassword'
import VerifyEmail from '../pages/auth/VerifyEmail'
import StudentRegister from '../pages/student/StudentRegister'
import StudentOnboarding from '../pages/student/StudentOnboarding'
import AlumniJoin from '../pages/alumni/AlumniJoin'
import AlumniDetails from '../pages/alumni/AlumniDetails'
import AlumniPending from '../pages/alumni/AlumniPending'
import AlumniDashboard from '../pages/alumni/AlumniDashboard'
import LinkedInCallback from '../pages/alumni/LinkedInCallback'
import ProfessorRegister from '../pages/professor/ProfessorRegister'
import ProfessorOnboarding from '../pages/professor/ProfessorOnboarding'
import ProfessorDashboard from '../pages/professor/ProfessorDashboard'
import StudentDashboard from '../pages/student/StudentDashboard'
import AdminDashboard from '../pages/admin/AdminDashboard'
import RequireRole from '../components/auth/RequireRole'
import './App.css'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white-surface text-ink">
        <Navigation />
        <Routes>
          <Route path="/" element={<Home />} />

          {/* Public pages — built one by one */}
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/features" element={<Features />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/about" element={<About />} />

          {/* Auth portals */}
          <Route path="/signin" element={<SignInChooser />} />
          <Route path="/join/student" element={<StudentRegister />} />
          <Route path="/login/student" element={<Login role="student" />} />
          <Route path="/login/alumni" element={<Login role="alumni" />} />
          <Route path="/login/professor" element={<Login role="professor" />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/onboarding/student" element={<StudentOnboarding />} />
          <Route path="/dashboard/student" element={<RequireRole role="student"><StudentDashboard /></RequireRole>} />

          {/* Alumni: LinkedIn only, then education verification */}
          <Route path="/join/alumni" element={<AlumniJoin />} />
          <Route path="/auth/linkedin/callback" element={<LinkedInCallback />} />
          <Route path="/join/alumni/details" element={<AlumniDetails />} />
          <Route path="/verify/alumni" element={<AlumniPending />} />
          <Route path="/dashboard/alumni" element={<RequireRole role="alumni"><AlumniDashboard /></RequireRole>} />

          {/* Professor: IGDTUW email */}
          <Route path="/join/professor" element={<ProfessorRegister />} />
          <Route path="/onboarding/professor" element={<RequireRole role="professor"><ProfessorOnboarding /></RequireRole>} />
          <Route path="/dashboard/professor" element={<RequireRole role="professor"><ProfessorDashboard /></RequireRole>} />
          <Route path="/login/admin" element={<Login role="admin" />} />
          <Route path="/dashboard/admin" element={<RequireRole role="admin"><AdminDashboard /></RequireRole>} />

          {/* Existing pages */}
          <Route path="/search" element={<Search />} />
          <Route path="/profile/:id" element={<Profile />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
