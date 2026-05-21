import React, { useState } from 'react'
import { useApp, BADGES, calculateLevel } from '../context/AppContext'
import regions from '../data/regions'

const INTERESTS_OPTIONS = [
  { key: 'outdoors', label: 'Outdoors', emoji: '🌲' },
  { key: 'social', label: 'Social', emoji: '👥' },
  { key: 'creative', label: 'Creative', emoji: '🎨' },
  { key: 'mental', label: 'Mental', emoji: '🧠' },
  { key: 'travel', label: 'Travel', emoji: '✈️' },
  { key: 'fitness', label: 'Fitness', emoji: '💪' },
]

const STAT_LABELS = { str: 'STR', dex: 'DEX', int: 'INT', cha: 'CHA', wis: 'WIS' }
const STAT_COLORS = {
  str: 'from-red-600 to-red-400',
  dex: 'from-green-600 to-green-400',
  int: 'from-purple-600 to-purple-400',
  cha: 'from-pink-600 to-pink-400',
  wis: 'from-blue-600 to-blue-400',
}

function StatBar({ stat, value }) {
  const gradient = STAT_COLORS[stat] || 'from-slate-600 to-slate-400'
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs font-bold text-slate-400 w-8 uppercase flex-shrink-0">{STAT_LABELS[stat]}</span>
      <div className="flex-1 h-2.5 bg-slate-700 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${gradient} transition-all duration-700`}
          style={{ width: `${value * 10}%` }}
        />
      </div>
      <span className="text-xs font-black text-white w-4 text-right">{value}</span>
    </div>
  )
}

export default function Profile() {
  const { state, dispatch } = useApp()
  const {
    playerName,
    xp,
    level,
    rpgClass,
    stats,
    profile,
    region,
    completedQuests,
    totalQuestsCompleted,
  } = state

  const { remainingXp, xpNeeded } = calculateLevel(xp)
  const xpPercent = Math.min(100, Math.round((remainingXp / xpNeeded) * 100))

  const earnedBadges = BADGES.filter(b => b.condition(state))

  // Edit form state
  const [editName, setEditName] = useState(playerName)
  const [editRegion, setEditRegion] = useState(region)
  const [editPersonality, setEditPersonality] = useState(profile?.personality || null)
  const [editFitness, setEditFitness] = useState(profile?.fitnessLevel || null)
  const [editInterests, setEditInterests] = useState(profile?.interests || [])
  const [saved, setSaved] = useState(false)

  function toggleInterest(key) {
    setEditInterests(prev =>
      prev.includes(key) ? prev.filter(i => i !== key) : [...prev, key]
    )
  }

  function handleSave() {
    const newProfile = {
      ...profile,
      personality: editPersonality,
      fitnessLevel: editFitness,
      interests: editInterests,
    }
    dispatch({
      type: 'UPDATE_PROFILE',
      payload: {
        profile: newProfile,
        playerName: editName || playerName,
        region: editRegion,
      },
    })
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6 page-enter">
      {/* ── Character Card ──────────────────────────────────── */}
      <div className={`bg-slate-800 border-2 rounded-2xl p-6 ${rpgClass?.borderColor || 'border-slate-600'} ${rpgClass?.glowClass || ''}`}>
        {/* Class Header */}
        <div className="flex items-start gap-4 mb-5">
          <div className="text-5xl">{rpgClass?.emoji || '🌟'}</div>
          <div className="flex-1">
            <div className={`text-xl font-black ${rpgClass?.textColor || 'text-amber-400'}`}>
              {rpgClass?.name || 'Adventurer'}
            </div>
            <div className="text-slate-400 text-xs mt-0.5">{rpgClass?.description || 'Your adventure begins.'}</div>
            <div className="text-slate-300 font-semibold text-base mt-1">{playerName}</div>
          </div>
          <div className="text-right flex-shrink-0">
            <div className="bg-amber-500 text-slate-900 text-xs font-black px-2.5 py-1 rounded-full">
              Level {level}
            </div>
          </div>
        </div>

        {/* XP Bar */}
        <div className="mb-5">
          <div className="flex justify-between text-xs mb-1">
            <span className="text-slate-400">Experience Points</span>
            <span className="text-amber-400 font-semibold">{remainingXp} / {xpNeeded} XP</span>
          </div>
          <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
            <div className="xp-bar-fill h-full rounded-full" style={{ width: `${xpPercent}%` }} />
          </div>
          <div className="text-xs text-slate-500 mt-1">{xp} total XP earned</div>
        </div>

        {/* Stats */}
        <div className="space-y-2 mb-5">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Character Stats</div>
          {stats && Object.entries(stats).map(([k, v]) => (
            <StatBar key={k} stat={k} value={v} />
          ))}
        </div>

        {/* Info Row */}
        <div className="flex gap-4 text-center border-t border-slate-700 pt-4">
          <div className="flex-1">
            <div className="text-2xl font-black text-green-400">{totalQuestsCompleted}</div>
            <div className="text-xs text-slate-500">Quests Done</div>
          </div>
          <div className="flex-1">
            <div className="text-2xl font-black text-amber-400">{xp}</div>
            <div className="text-xs text-slate-500">Total XP</div>
          </div>
          <div className="flex-1">
            <div className="text-2xl font-black text-purple-400">{earnedBadges.length}</div>
            <div className="text-xs text-slate-500">Badges</div>
          </div>
        </div>

        {/* Badges */}
        {earnedBadges.length > 0 && (
          <div className="mt-4 pt-4 border-t border-slate-700">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Badges Earned</div>
            <div className="flex flex-wrap gap-2">
              {earnedBadges.map(b => (
                <div
                  key={b.id}
                  title={b.desc}
                  className="bg-slate-700 border border-slate-600 rounded-lg px-3 py-1.5 flex items-center gap-2 text-xs"
                >
                  <span className="text-base">{b.emoji}</span>
                  <span className="text-slate-300 font-semibold">{b.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {earnedBadges.length === 0 && (
          <div className="mt-4 pt-4 border-t border-slate-700 text-center text-slate-600 text-xs">
            Complete quests to earn badges! 🏅
          </div>
        )}
      </div>

      {/* ── Edit Profile ────────────────────────────────────── */}
      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
        <h2 className="text-base font-black text-slate-100 mb-4">Edit Profile</h2>

        {/* Name */}
        <div className="mb-4">
          <label className="text-sm font-semibold text-slate-300 block mb-1.5">Adventurer Name</label>
          <input
            type="text"
            value={editName}
            onChange={e => setEditName(e.target.value)}
            maxLength={24}
            className="w-full"
          />
        </div>

        {/* Region */}
        <div className="mb-4">
          <label className="text-sm font-semibold text-slate-300 block mb-1.5">Region</label>
          <select
            value={editRegion}
            onChange={e => setEditRegion(e.target.value)}
            className="w-full"
          >
            {regions.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>

        {/* Personality */}
        <div className="mb-4">
          <label className="text-sm font-semibold text-slate-300 block mb-2">Personality</label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { key: 'introvert', label: 'Introvert', emoji: '🌙' },
              { key: 'ambivert', label: 'Ambivert', emoji: '⚖️' },
              { key: 'extrovert', label: 'Extrovert', emoji: '☀️' },
            ].map(opt => (
              <button
                key={opt.key}
                onClick={() => setEditPersonality(opt.key)}
                className={`personality-btn border rounded-xl p-2 text-center text-xs ${
                  editPersonality === opt.key ? 'selected border-amber-500' : 'border-slate-600 text-slate-400'
                }`}
              >
                <div className="text-xl mb-0.5">{opt.emoji}</div>
                <div className="font-bold">{opt.label}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Fitness */}
        <div className="mb-4">
          <label className="text-sm font-semibold text-slate-300 block mb-2">Fitness Level</label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { key: 'beginner', label: 'Beginner', emoji: '🌱' },
              { key: 'intermediate', label: 'Intermediate', emoji: '🏃' },
              { key: 'advanced', label: 'Advanced', emoji: '🦅' },
            ].map(opt => (
              <button
                key={opt.key}
                onClick={() => setEditFitness(opt.key)}
                className={`personality-btn border rounded-xl p-2 text-center text-xs ${
                  editFitness === opt.key ? 'selected border-amber-500' : 'border-slate-600 text-slate-400'
                }`}
              >
                <div className="text-xl mb-0.5">{opt.emoji}</div>
                <div className="font-bold">{opt.label}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Interests */}
        <div className="mb-5">
          <label className="text-sm font-semibold text-slate-300 block mb-2">Interests</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {INTERESTS_OPTIONS.map(i => (
              <button
                key={i.key}
                onClick={() => toggleInterest(i.key)}
                className={`interest-chip border rounded-lg py-2 px-3 flex items-center gap-2 text-sm ${
                  editInterests.includes(i.key) ? 'selected border-amber-500' : 'border-slate-600 text-slate-400'
                }`}
              >
                <span>{i.emoji}</span>
                <span className="font-semibold">{i.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Save button */}
        <button
          onClick={handleSave}
          className={`w-full py-3 rounded-xl font-bold text-sm transition-all duration-200 ${
            saved
              ? 'bg-green-600 text-white'
              : 'bg-amber-500 hover:bg-amber-400 text-slate-900'
          }`}
        >
          {saved ? '✓ Saved!' : 'Save Changes'}
        </button>
        {saved && (
          <p className="text-xs text-slate-400 text-center mt-2">
            Your class may have been reassigned based on your new answers.
          </p>
        )}
      </div>
    </div>
  )
}
