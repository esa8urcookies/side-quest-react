import React, { useState, useMemo } from 'react'
import { SEED_QUESTS, CATEGORIES } from '../data/quests'
import { usePlayer } from '../context/PlayerContext'
import QuestCard from './QuestCard'

const ALL = 'all'
const FILTER_TABS = [
  { key: ALL, label: 'All Quests', emoji: '📜' },
  { key: 'active', label: 'My Active', emoji: '⚡' },
  { key: 'completed', label: 'Completed', emoji: '✅' },
  ...Object.entries(CATEGORIES).map(([key, val]) => ({
    key,
    label: val.label,
    emoji: val.emoji,
  })),
]

const SORT_OPTIONS = [
  { value: 'default', label: 'Default' },
  { value: 'xp-high', label: 'XP: High → Low' },
  { value: 'xp-low', label: 'XP: Low → High' },
  { value: 'difficulty-high', label: 'Difficulty: Hard → Easy' },
  { value: 'difficulty-low', label: 'Difficulty: Easy → Hard' },
]

export default function QuestBoard() {
  const { submittedQuests, activeQuests, completedQuests } = usePlayer()
  const [activeFilter, setActiveFilter] = useState(ALL)
  const [sortBy, setSortBy] = useState('default')
  const [search, setSearch] = useState('')

  const allQuests = useMemo(() => [...SEED_QUESTS, ...submittedQuests], [submittedQuests])

  const filtered = useMemo(() => {
    let list = allQuests

    // Category / status filter
    if (activeFilter === 'active') {
      list = list.filter((q) => activeQuests.includes(q.id))
    } else if (activeFilter === 'completed') {
      list = list.filter((q) => completedQuests.includes(q.id))
    } else if (activeFilter !== ALL) {
      list = list.filter((q) => q.category === activeFilter)
    }

    // Search
    if (search.trim()) {
      const q = search.trim().toLowerCase()
      list = list.filter(
        (quest) =>
          quest.title.toLowerCase().includes(q) ||
          quest.description.toLowerCase().includes(q)
      )
    }

    // Sort
    const xpOf = (q) => q.xp ?? q.xpReward ?? 0
    if (sortBy === 'xp-high') list = [...list].sort((a, b) => xpOf(b) - xpOf(a))
    else if (sortBy === 'xp-low') list = [...list].sort((a, b) => xpOf(a) - xpOf(b))
    else if (sortBy === 'difficulty-high') list = [...list].sort((a, b) => b.difficulty - a.difficulty)
    else if (sortBy === 'difficulty-low') list = [...list].sort((a, b) => a.difficulty - b.difficulty)

    return list
  }, [allQuests, activeFilter, sortBy, search, activeQuests, completedQuests])

  return (
    <section>
      {/* Board header */}
      <div className="flex items-center gap-3 mb-6">
        <span className="text-2xl">📋</span>
        <div>
          <h2 className="text-xl font-bold text-white">Quest Board</h2>
          <p className="text-sm text-slate-500">
            {allQuests.length} quests available — {completedQuests.length} completed
          </p>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap mb-4">
        {FILTER_TABS.map((tab) => {
          const isActive = activeFilter === tab.key
          return (
            <button
              key={tab.key}
              onClick={() => setActiveFilter(tab.key)}
              className={[
                'flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-lg border transition-all duration-200',
                isActive
                  ? 'bg-amber-500/20 border-amber-500/60 text-amber-300'
                  : 'bg-slate-800/60 border-slate-700/50 text-slate-400 hover:text-slate-200 hover:border-slate-600',
              ].join(' ')}
            >
              <span>{tab.emoji}</span>
              <span>{tab.label}</span>
            </button>
          )
        })}
      </div>

      {/* Search + Sort row */}
      <div className="flex gap-3 mb-6 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">🔍</span>
          <input
            type="text"
            placeholder="Search quests…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-800/70 border border-slate-700/50 rounded-lg pl-9 pr-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-500/50 focus:border-amber-500/50 transition-colors"
          />
        </div>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="bg-slate-800/70 border border-slate-700/50 rounded-lg px-3 py-2 text-sm text-slate-300 focus:outline-none focus:ring-1 focus:ring-amber-500/50 cursor-pointer"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Quest grid */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <span className="text-5xl mb-4">🏜️</span>
          <p className="text-slate-400 text-lg font-medium">No quests found</p>
          <p className="text-slate-600 text-sm mt-1">
            {activeFilter === 'active'
              ? 'You have no active quests. Accept some from the board!'
              : activeFilter === 'completed'
              ? 'You have not completed any quests yet. Go forth, adventurer!'
              : 'Try adjusting your filters or search.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((quest) => (
            <QuestCard key={quest.id} quest={quest} />
          ))}
        </div>
      )}
    </section>
  )
}
