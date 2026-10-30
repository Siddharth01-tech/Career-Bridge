import { Routes, Route } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import LandingPage from './pages/LandingPage'
import SignInPage from './pages/SignInPage'
import SignUpPage from './pages/SignUpPage'
import CandidateDashboard from './pages/CandidateDashboard'
import RecruiterDashboard from './pages/RecruiterDashboard'
import './App.css'

function DashboardRouter() {
  const { user } = useAuth()
  if (user?.role === 'recruiter') {
    return <RecruiterDashboard />
  }
  return <CandidateDashboard />
}

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/login" element={<SignInPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/dashboard" element={<DashboardRouter />} />
        <Route path="/candidate/dashboard" element={<CandidateDashboard />} />
        <Route path="/recruiter/dashboard" element={<RecruiterDashboard />} />
        <Route path="/recruiter" element={<RecruiterDashboard />} />
      </Routes>
    </AuthProvider>
  )
}

export default App

