import React, { useEffect } from 'react'
import { useApp } from '../context/AppContext'

export default function LevelUpModal() {
  const { state, dispatch } = useApp()
  const { showLevelUp, newLevel, rpgClass, level } = state

  const displayLevel = newLevel || level

  useEffect(() => {
    if (showLevelUp) {
      const t = setTimeout(() => dispatch({ type: 'DISMISS_LEVEL_UP' }), 5000)
      return () => clearTimeout(t)
    }
  }, [showLevelUp, dispatch])

  if (!showLevelUp) return null

  const glowClass = rpgClass?.glowClass || 'glow-adventurer'
  const emoji = rpgClass?.emoji || '🌟'
  const textColor = rpgClass?.textColor || 'text-amber-400'

  function handleDismiss() {
    dispatch({ type: 'DISMISS_LEVEL_UP' })
  }

  return (
    <div
      className="fixed inset-0 z-50 modal-backdrop flex items-center justify-center p-4"
      onClick={handleDismiss}
    >
      <div
        className={`levelup-modal bg-slate-800 border border-slate-600 rounded-2xl p-8 max-w-sm w-full text-center ${glowClass}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-7xl mb-4 animate-bounce">{emoji}</div>

        <div className="gold-shimmer text-4xl font-black tracking-widest uppercase mb-2">
          Level Up!
        </div>

        <div className="text-6xl font-black text-white mb-3">{displayLevel}</div>

        <p className={`text-sm font-semibold ${textColor} mb-2`}>
          {rpgClass ? `${rpgClass.name} powers grow stronger!` : 'Your power grows!'}
        </p>

        <p className="text-slate-400 text-xs mb-6">
          Keep completing quests to reach new heights.
        </p>

        <div className="flex items-center gap-3 mb-6">
          <div className="flex-1 h-px bg-slate-600" />
          <span className="text-amber-500 text-lg">⚔️</span>
          <div className="flex-1 h-px bg-slate-600" />
        </div>

        <button
          onClick={handleDismiss}
          className="w-full bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold py-3 px-6 rounded-xl text-sm transition-colors duration-150"
        >
          Onward! ⚡
        </button>
      </div>
    </div>
  )
}
