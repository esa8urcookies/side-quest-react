import React from 'react'
import { CATEGORIES, CATEGORY_STYLES } from '../data/quests'
import { usePlayer } from '../context/PlayerContext'

function Stars({ difficulty }) {
  return (
    <span className="text-base leading-none" title={`Difficulty: ${difficulty}/5`}>
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} className={i < difficulty ? 'star-filled' : 'star-empty'}>
          {i < difficulty ? '★' : '☆'}
        </span>
      ))}
    </span>
  )
}

export default function QuestCard({ quest }) {
  const { id, title, description, category, difficulty, xp, xpReward } = quest
  const xpValue = xp ?? xpReward ?? 0

  const { activeQuests, completedQuests, acceptQuest, abandonQuest, completeQuest } = usePlayer()

  const isActive = activeQuests.includes(id)
  const isDone = completedQuests.includes(id)

  const cat = CATEGORIES[category] ?? CATEGORIES['random']
  const styles = CATEGORY_STYLES[category] ?? CATEGORY_STYLES['random']

  const cardBase = [
    'group relative flex flex-col bg-slate-800/80 border rounded-xl p-5 transition-all duration-300',
    styles.border,
    styles.glow,
    isDone ? 'opacity-60' : '',
  ].filter(Boolean).join(' ')

  return (
    <article className={cardBase}>
      {/* Completed overlay ribbon */}
      {isDone && (
        <div className="absolute top-3 right-3 bg-green-600/80 text-green-100 text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
          <span>✓</span> Done
        </div>
      )}

      {/* Active indicator */}
      {isActive && !isDone && (
        <div className="absolute top-3 right-3 bg-violet-600/80 text-violet-100 text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
          <span className="animate-pulse">◉</span> Active
        </div>
      )}

      {/* Category badge */}
      <div className="flex items-center gap-2 mb-3">
        <span
          className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full border ${styles.badge}`}
        >
          <span>{cat.emoji}</span>
          <span>{cat.label}</span>
        </span>
      </div>

      {/* Title */}
      <h3 className={`font-bold text-base text-white mb-2 leading-snug group-hover:${styles.accent} transition-colors`}>
        {title}
      </h3>

      {/* Description */}
      <p className="text-sm text-slate-400 leading-relaxed flex-1 mb-4">
        {description}
      </p>

      {/* Difficulty + XP */}
      <div className="flex items-center justify-between mb-4">
        <Stars difficulty={difficulty} />
        <span className="flex items-center gap-1 text-sm font-bold text-amber-400">
          <span>✦</span>
          <span>{xpValue} XP</span>
        </span>
      </div>

      {/* Action button */}
      {isDone ? (
        <div className={`w-full text-center text-sm font-semibold py-2 rounded-lg border ${styles.complete}`}>
          Quest Completed!
        </div>
      ) : isActive ? (
        <div className="flex gap-2">
          <button
            onClick={() => completeQuest(id)}
            className="flex-1 text-sm font-bold py-2 rounded-lg bg-green-600 hover:bg-green-500 text-white transition-colors flex items-center justify-center gap-1.5"
          >
            <span>⚡</span> Complete
          </button>
          <button
            onClick={() => abandonQuest(id)}
            className="px-3 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white transition-colors text-sm"
            title="Abandon quest"
          >
            ✕
          </button>
        </div>
      ) : (
        <button
          onClick={() => acceptQuest(id)}
          className={`w-full text-sm font-bold py-2 rounded-lg text-white transition-all duration-200 ${styles.button} active:scale-95`}
        >
          Accept Quest
        </button>
      )}
    </article>
  )
}
