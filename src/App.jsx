import React from 'react'
import { PlayerProvider } from './context/PlayerContext'
import Header from './components/Header'
import QuestBoard from './components/QuestBoard'
import QuestSubmitForm from './components/QuestSubmitForm'
import LevelUpModal from './components/LevelUpModal'

export default function App() {
  return (
    <PlayerProvider>
      <div className="min-h-screen bg-navy-950">
        <Header />

        <main className="max-w-7xl mx-auto px-4 py-8">
          <QuestBoard />
          <QuestSubmitForm />
        </main>

        <LevelUpModal />

        <footer className="border-t border-slate-800 text-center py-6 text-xs text-slate-600">
          ⚔️ Side Quest — go forth and do something legendary
        </footer>
      </div>
    </PlayerProvider>
  )
}
