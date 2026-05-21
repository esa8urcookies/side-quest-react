import React from 'react'
import { useApp } from '../context/AppContext'

const DIFFICULTY_LABELS = ['', 'Easy', 'Easy', 'Medium', 'Hard', 'Epic']
const DIFFICULTY_COLORS = ['', 'text-green-400', 'text-green-400', 'text-amber-400', 'text-orange-400', 'text-red-400']
const DIFFICULTY_BG = ['', 'bg-green-900/40 border-green-700/50', 'bg-green-900/40 border-green-700/50', 'bg-amber-900/40 border-amber-700/50', 'bg-orange-900/40 border-orange-700/50', 'bg-red-900/40 border-red-700/50']

function DifficultyStars({ count }) {
  return (
    <span className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <span key={i} className={i <= count ? 'diff-star' : 'diff-star empty'}>★</span>
      ))}
    </span>
  )
}

export default function QuestCard({ quest }) {
  const { state, dispatch } = useApp()
  const { activeQuests, completedQuests } = state

  const isActive = activeQuests.includes(quest.id)
  const isCompleted = completedQuests.some(c => c.id === quest.id)

  function handleAccept() {
    if (!isActive && !isCompleted) {
      dispatch({ type: 'ACCEPT_QUEST', payload: { questId: quest.id } })
    }
  }

  function handleComplete() {
    if (isActive && !isCompleted) {
      dispatch({ type: 'COMPLETE_QUEST', payload: { questId: quest.id, xpReward: quest.xp } })
    }
  }

  const diffColor = DIFFICULTY_COLORS[quest.difficulty] || 'text-slate-400'
  const diffBg = DIFFICULTY_BG[quest.difficulty] || ''

  return (
    <div className={`quest-card bg-slate-800 border border-slate-700 rounded-xl p-4 flex flex-col gap-3 ${isCompleted ? 'completed' : ''}`}>
      {/* Top Row */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <span className="text-2xl flex-shrink-0">{quest.category}</span>
          <div className="min-w-0">
            <h3 className={`font-bold text-sm leading-tight ${isCompleted ? 'line-through text-slate-500' : 'text-slate-100'}`}>
              {quest.title}
            </h3>
            <div className="flex items-center gap-2 mt-0.5">
              <DifficultyStars count={quest.difficulty} />
              <span className={`text-xs font-semibold ${diffColor}`}>{DIFFICULTY_LABELS[quest.difficulty]}</span>
            </div>
          </div>
        </div>
        {isCompleted ? (
          <div className="completed-badge flex-shrink-0">✓</div>
        ) : (
          <div className={`flex-shrink-0 border rounded-lg px-2 py-1 text-xs font-bold ${diffBg} ${diffColor}`}>
            +{quest.xp} XP
          </div>
        )}
      </div>

      {/* Description */}
      <p className="text-slate-400 text-xs leading-relaxed">
        {quest.description}
      </p>

      {/* Buttons */}
      {!isCompleted && (
        <div className="flex gap-2 mt-auto">
          {!isActive ? (
            <button
              onClick={handleAccept}
              className="flex-1 bg-slate-700 hover:bg-amber-600/20 border border-slate-600 hover:border-amber-500 text-slate-300 hover:text-amber-300 text-xs font-semibold py-2 px-3 rounded-lg transition-all duration-150"
            >
              Accept Quest
            </button>
          ) : (
            <>
              <span className="flex-1 bg-amber-900/20 border border-amber-700/40 text-amber-500 text-xs font-semibold py-2 px-3 rounded-lg text-center">
                Active ⚡
              </span>
              <button
                onClick={handleComplete}
                className="flex-1 bg-green-700/80 hover:bg-green-600 border border-green-600 text-white text-xs font-bold py-2 px-3 rounded-lg transition-all duration-150"
              >
                Complete ✓
              </button>
            </>
          )}
        </div>
      )}

      {isCompleted && (
        <div className="text-center text-xs text-slate-500 italic">Quest Completed!</div>
      )}
    </div>
  )
}
