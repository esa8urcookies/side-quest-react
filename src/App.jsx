import React, { useState } from 'react'
import { AppProvider } from './context/AppContext'
import { useApp } from './context/AppContext'
import Header from './components/Header'
import OnboardingModal from './components/OnboardingModal'
import LevelUpModal from './components/LevelUpModal'
import Dashboard from './pages/Dashboard'
import Leaderboard from './pages/Leaderboard'
import Profile from './pages/Profile'

function AppInner() {
  const { state } = useApp()
  const [page, setPage] = useState('dashboard')

  if (!state.onboarded) return <OnboardingModal />

  const pages = { dashboard: Dashboard, leaderboard: Leaderboard, profile: Profile }
  const Page = pages[page] || Dashboard

  return (
    <div className="min-h-screen">
      <Header currentPage={page} onNavigate={setPage} />
      <Page />
      <LevelUpModal />
      <footer className="text-center py-8 text-xs text-slate-700 border-t border-slate-800 mt-8">
        ⚔️ Side Quest V2 — go forth and do something legendary
      </footer>
    </div>
  )
}

export default function App() {
  return (
    <AppProvider>
      <AppInner />
    </AppProvider>
  )
}
