import React from 'react'
import { useApp } from '../context/AppContext'
import { SEED_LEADERBOARD } from '../data/leaderboard'
import regions from '../data/regions'

const RANK_STYLES = [
  'text-amber-400 text-lg font-black',
  'text-slate-300 font-bold',
  'text-orange-400 font-bold',
]

export default function Leaderboard() {
  const { state, dispatch } = useApp()
  const { region, playerName, level, xp, rpgClass } = state

  const npcs = SEED_LEADERBOARD[region] || []

  const player = {
    id: '__player__',
    name: playerName,
    rpgClass: rpgClass || { emoji: '🧭', name: 'Adventurer' },
    level,
    xp,
    isPlayer: true,
  }

  const all = [...npcs, player].sort((a, b) => {
    const totalA = a.level * 100 + (a.xp || 0)
    const totalB = b.level * 100 + (b.xp || 0)
    return totalB - totalA
  })

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 page-enter">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <span className="text-3xl">🏆</span>
          <div>
            <h2 className="text-2xl font-black text-white">Leaderboard</h2>
            <p className="text-slate-500 text-sm">Top adventurers in your region</p>
          </div>
        </div>
        <select
          value={region}
          onChange={e => dispatch({ type: 'CHANGE_REGION', payload: e.target.value })}
          className="text-sm"
        >
          {regions.map(r => <option key={r}>{r}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl overflow-hidden">
        <div className="grid grid-cols-[40px_1fr_80px_80px] text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-2.5 border-b border-slate-700/50">
          <span>#</span><span>Adventurer</span><span className="text-center">Level</span><span className="text-right">XP</span>
        </div>

        {all.map((entry, idx) => {
          const rank = idx + 1
          const isPlayer = entry.isPlayer
          const totalXp = entry.level * 100 + (entry.xp || 0)
          const rankStyle = RANK_STYLES[idx] || 'text-slate-400 font-semibold'
          const medal = rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : null

          return (
            <div
              key={entry.id || entry.name}
              className={`grid grid-cols-[40px_1fr_80px_80px] items-center px-4 py-3 border-b border-slate-700/30 last:border-0 transition-colors ${
                isPlayer ? 'lb-self' : 'hover:bg-slate-700/20'
              }`}
            >
              <span className={rankStyle}>{medal || rank}</span>
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-lg">{entry.rpgClass?.emoji || '🧭'}</span>
                <div className="min-w-0">
                  <p className={`font-semibold text-sm truncate ${isPlayer ? 'text-amber-300' : 'text-slate-200'}`}>
                    {entry.name}
                    {isPlayer && <span className="ml-1.5 text-xs text-amber-500/80">(you)</span>}
                  </p>
                  <p className="text-xs text-slate-500 truncate">{entry.rpgClass?.name || 'Adventurer'}</p>
                </div>
              </div>
              <div className="text-center">
                <span className="text-sm font-bold text-violet-300 bg-violet-900/30 border border-violet-700/30 px-2 py-0.5 rounded-full">
                  {entry.level}
                </span>
              </div>
              <div className="text-right">
                <span className="text-sm font-bold text-amber-400">{totalXp.toLocaleString()}</span>
              </div>
            </div>
          )
        })}
      </div>

      <p className="text-center text-xs text-slate-600 mt-4">
        Complete quests to earn XP and climb the ranks ⚔️
      </p>
    </div>
  )
}
