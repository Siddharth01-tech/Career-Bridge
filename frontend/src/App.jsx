import { Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import './App.css'

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      {/* Additional full-project routes can be smoothly added here:
          e.g. <Route path="/jobs" element={<JobsPage />} />
          e.g. <Route path="/companies" element={<CompaniesPage />} />
          e.g. <Route path="/dashboard" element={<DashboardPage />} />
          e.g. <Route path="/auth/*" element={<AuthPages />} />
      */}
    </Routes>
  )
}

export default App
