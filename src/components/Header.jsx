import React from 'react'
import { useApp } from '../context/AppContext'
import { calculateLevel, xpForLevel } from '../context/AppContext'

export default function Header({ currentPage, onNavigate }) {
  const { state } = useApp()
  const { playerName, xp, level, rpgClass } = state

  const { remainingXp, xpNeeded } = calculateLevel(xp)
  const xpPercent = Math.min(100, Math.round((remainingXp / xpNeeded) * 100))

  const navItems = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'leaderboard', label: 'Leaderboard' },
    { id: 'profile', label: 'Profile' },
  ]

  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 border-b border-slate-700 backdrop-blur-sm">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
        {/* Logo */}
        <button
          onClick={() => onNavigate('dashboard')}
          className="flex items-center gap-2 flex-shrink-0 hover:opacity-80 transition-opacity"
        >
          <span className="text-xl">⚔️</span>
          <span className="font-black text-base text-slate-100 tracking-wide">Side Quest</span>
          <span className="bg-amber-500 text-slate-900 text-[10px] font-black px-1.5 py-0.5 rounded-md leading-none">V2</span>
        </button>

        {/* Nav Links */}
        <nav className="hidden sm:flex items-center gap-1">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`px-3 py-1.5 text-sm font-semibold rounded-lg transition-all duration-150 ${
                currentPage === item.id
                  ? 'nav-link-active text-amber-400 bg-amber-500/10'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* XP Bar + Level */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {rpgClass && (
            <span className="text-lg hidden sm:block">{rpgClass.emoji}</span>
          )}
          <div className="flex flex-col items-end gap-0.5">
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-slate-400 hidden sm:block truncate max-w-[80px]">{playerName}</span>
              <span className="bg-amber-500 text-slate-900 text-[11px] font-black px-2 py-0.5 rounded-full leading-none">
                Lv.{level}
              </span>
            </div>
            <div className="w-28 sm:w-32 bg-slate-700 rounded-full h-1.5 overflow-hidden">
              <div
                className="xp-bar-fill h-full rounded-full"
                style={{ width: `${xpPercent}%` }}
              />
            </div>
            <span className="text-[10px] text-slate-500 font-mono">{remainingXp}/{xpNeeded} XP</span>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      <div className="sm:hidden border-t border-slate-800 flex">
        {navItems.map(item => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`flex-1 py-2 text-xs font-semibold transition-all ${
              currentPage === item.id
                ? 'text-amber-400 bg-amber-500/10 border-b-2 border-amber-500'
                : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
    </header>
  )
}
