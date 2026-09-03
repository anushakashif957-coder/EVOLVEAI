import { useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import LandingPage from './pages/LandingPage.jsx'
import DailyReflectionPage from './pages/DailyReflectionPage.jsx'
import AIInsightPage from './pages/AIInsightPage.jsx'
import GrowthTimelinePage from './pages/GrowthTimelinePage.jsx'
import GrowthDashboardPage from './pages/GrowthDashboardPage.jsx'
import GrowthPassportPage from './pages/GrowthPassportPage.jsx'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/reflect" element={<DailyReflectionPage />} />
        <Route path="/insights" element={<AIInsightPage />} />
        <Route path="/timeline" element={<GrowthTimelinePage />} />
        <Route path="/dashboard" element={<GrowthDashboardPage />} />
        <Route path="/passport" element={<GrowthPassportPage />} />
        <Route path="*" element={<LandingPage />} />
      </Routes>
    </>
  )
}
