import React, { useState } from 'react'
import { usePlayer } from '../context/PlayerContext'

export default function Header() {
  const {
    playerName,
    level,
    xp,
    xpToNextLevel,
    xpPercent,
    completedQuests,
    activeQuests,
    setPlayerName,
    MAX_LEVEL,
  } = usePlayer()

  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(playerName)

  function handleNameSubmit(e) {
    e.preventDefault()
    const trimmed = draft.trim()
    if (trimmed) setPlayerName(trimmed)
    setEditing(false)
  }

  return (
    <header className="sticky top-0 z-40 bg-navy-950/95 backdrop-blur border-b border-slate-700/50 shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 py-3">
        {/* Top row */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          {/* Logo */}
          <div className="flex items-center gap-3 shrink-0">
            <span className="text-3xl leading-none">⚔️</span>
            <div>
              <h1 className="text-xl font-bold gold-shimmer leading-none">Side Quest</h1>
              <p className="text-xs text-slate-500 mt-0.5">RPG Quest Board</p>
            </div>
          </div>

          {/* Player info */}
          <div className="flex items-center gap-4 flex-1 justify-end flex-wrap">
            {/* Stats */}
            <div className="flex items-center gap-3 text-sm text-slate-400">
              <span className="flex items-center gap-1">
                <span className="text-amber-400">✓</span>
                <span>{completedQuests.length} completed</span>
              </span>
              <span className="text-slate-600">|</span>
              <span className="flex items-center gap-1">
                <span className="text-violet-400">◈</span>
                <span>{activeQuests.length} active</span>
              </span>
            </div>

            {/* Player name */}
            <div className="flex items-center gap-2">
              {editing ? (
                <form onSubmit={handleNameSubmit} className="flex items-center gap-2">
                  <input
                    autoFocus
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    maxLength={24}
                    className="bg-slate-800 border border-amber-500/50 rounded px-2 py-1 text-sm text-white focus:outline-none focus:ring-1 focus:ring-amber-500 w-36"
                    onBlur={handleNameSubmit}
                  />
                </form>
              ) : (
                <button
                  onClick={() => { setDraft(playerName); setEditing(true) }}
                  className="text-sm font-semibold text-amber-300 hover:text-amber-200 transition-colors group flex items-center gap-1"
                  title="Click to rename"
                >
                  🧙 {playerName}
                  <span className="text-xs text-slate-600 group-hover:text-slate-400 transition-colors">✎</span>
                </button>
              )}
            </div>

            {/* Level badge */}
            <div className="flex items-center gap-2 bg-violet-900/40 border border-violet-700/40 rounded-lg px-3 py-1.5">
              <span className="text-xs text-violet-400 font-medium uppercase tracking-wider">Level</span>
              <span className="text-lg font-bold text-white leading-none">{level}</span>
              {level >= MAX_LEVEL && (
                <span className="text-xs text-amber-400 font-bold">MAX</span>
              )}
            </div>
          </div>
        </div>

        {/* XP Bar */}
        <div className="mt-3">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span className="text-amber-500/80 font-medium">
              {level >= MAX_LEVEL ? '— MAX LEVEL —' : `${xp} / ${xpToNextLevel} XP`}
            </span>
            <span>
              {level >= MAX_LEVEL ? '⭐ Legend' : `${xpPercent}% to level ${level + 1}`}
            </span>
          </div>
          <div className="h-2.5 bg-slate-800 rounded-full overflow-hidden border border-slate-700/50">
            <div
              className="xp-bar-fill h-full rounded-full relative overflow-hidden"
              style={{
                width: `${xpPercent}%`,
                background: 'linear-gradient(90deg, #d97706, #f59e0b, #fcd34d)',
                boxShadow: '0 0 8px rgba(245,158,11,0.6)',
              }}
            >
              {/* shimmer overlay */}
              <div
                className="absolute inset-0 opacity-50"
                style={{
                  background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%)',
                  animation: 'shimmer 1.5s linear infinite',
                  backgroundSize: '200% 100%',
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
