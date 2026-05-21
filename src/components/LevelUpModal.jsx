import React from 'react'
import { usePlayer } from '../context/PlayerContext'

export default function LevelUpModal() {
  const { showLevelUp, level, dismissLevelUp } = usePlayer()

  if (!showLevelUp) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.75)' }}
      onClick={dismissLevelUp}
    >
      <div
        className="relative bg-slate-900 border-2 border-amber-500/60 rounded-2xl p-8 max-w-sm w-full text-center shadow-2xl animate-slide-up"
        style={{ boxShadow: '0 0 60px rgba(245,158,11,0.3), 0 0 120px rgba(245,158,11,0.1)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Stars */}
        <div className="text-5xl mb-2 animate-bounce">⭐</div>
        <div className="flex justify-center gap-2 mb-4">
          {['✨','🌟','✨'].map((s, i) => (
            <span key={i} className="text-2xl" style={{ animationDelay: `${i * 0.1}s` }}>{s}</span>
          ))}
        </div>

        <h2 className="text-3xl font-bold gold-shimmer mb-1">Level Up!</h2>
        <p className="text-slate-400 text-sm mb-4">You have reached</p>
        <div className="bg-violet-900/50 border border-violet-600/50 rounded-xl py-4 px-6 mb-6 inline-block">
          <span className="text-5xl font-black text-white">{level}</span>
          <p className="text-violet-300 text-xs font-semibold uppercase tracking-widest mt-1">Level</p>
        </div>

        <p className="text-slate-400 text-sm mb-6">
          Keep completing quests to grow stronger, adventurer!
        </p>

        <button
          onClick={dismissLevelUp}
          className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold rounded-xl transition-colors text-sm uppercase tracking-wide"
        >
          Onward! ⚔️
        </button>
      </div>
    </div>
  )
}
