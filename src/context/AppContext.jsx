import React, { createContext, useContext, useReducer, useEffect } from 'react'
import { dailyQuests, weeklyQuests, monthlyQuests, pickRandom } from '../data/quests'

// ─── RPG Class Definitions ───────────────────────────────────────────────────

export const RPG_CLASSES = {
  bard: {
    key: 'bard',
    name: 'Bard',
    emoji: '🎭',
    description: 'Charming storyteller who wins hearts with wit and song.',
    color: 'pink',
    glowClass: 'glow-bard',
    borderColor: 'border-pink-500',
    textColor: 'text-pink-400',
    baseStats: { str: 3, dex: 6, int: 6, cha: 9, wis: 6 },
  },
  mage: {
    key: 'mage',
    name: 'Mage',
    emoji: '🧙',
    description: 'Arcane scholar who shapes reality through knowledge and will.',
    color: 'purple',
    glowClass: 'glow-mage',
    borderColor: 'border-purple-500',
    textColor: 'text-purple-400',
    baseStats: { str: 2, dex: 4, int: 10, cha: 5, wis: 9 },
  },
  ranger: {
    key: 'ranger',
    name: 'Ranger',
    emoji: '🏹',
    description: 'Nimble hunter attuned to the wilds with deadly precision.',
    color: 'green',
    glowClass: 'glow-ranger',
    borderColor: 'border-green-500',
    textColor: 'text-green-400',
    baseStats: { str: 8, dex: 9, int: 5, cha: 4, wis: 7 },
  },
  warrior: {
    key: 'warrior',
    name: 'Warrior',
    emoji: '⚔️',
    description: 'Unstoppable force of iron will and raw physical power.',
    color: 'red',
    glowClass: 'glow-warrior',
    borderColor: 'border-red-500',
    textColor: 'text-red-400',
    baseStats: { str: 10, dex: 6, int: 4, cha: 4, wis: 6 },
  },
  rogue: {
    key: 'rogue',
    name: 'Rogue',
    emoji: '🗡️',
    description: 'Swift and cunning traveler who thrives on freedom and adventure.',
    color: 'blue',
    glowClass: 'glow-rogue',
    borderColor: 'border-blue-500',
    textColor: 'text-blue-400',
    baseStats: { str: 5, dex: 9, int: 6, cha: 8, wis: 5 },
  },
  adventurer: {
    key: 'adventurer',
    name: 'Adventurer',
    emoji: '🌟',
    description: 'Versatile hero of many paths — adaptable, curious, and bold.',
    color: 'amber',
    glowClass: 'glow-adventurer',
    borderColor: 'border-amber-500',
    textColor: 'text-amber-400',
    baseStats: { str: 5, dex: 5, int: 5, cha: 5, wis: 5 },
  },
}

// ─── Class Assignment Logic ──────────────────────────────────────────────────

export function assignClass(profile) {
  const { personality, fitnessLevel, interests = [] } = profile
  const p = (personality || '').toLowerCase()
  const f = (fitnessLevel || '').toLowerCase()
  const hasOutdoors = interests.includes('outdoors')
  const hasSocial = interests.includes('social')
  const hasMental = interests.includes('mental')
  const hasCreative = interests.includes('creative')
  const hasTravel = interests.includes('travel')

  if (p === 'extrovert' && hasSocial) return RPG_CLASSES.bard
  if (p === 'introvert' && (hasMental || hasCreative)) return RPG_CLASSES.mage
  if (f === 'advanced' && hasOutdoors) return RPG_CLASSES.ranger
  if (f === 'advanced' && !hasOutdoors) return RPG_CLASSES.warrior
  if (hasTravel && p === 'extrovert') return RPG_CLASSES.rogue
  return RPG_CLASSES.adventurer
}

// ─── Stats Derivation ────────────────────────────────────────────────────────

export function deriveStats(profile, rpgClass) {
  if (!rpgClass) return { str: 5, dex: 5, int: 5, cha: 5, wis: 5 }
  const base = { ...rpgClass.baseStats }
  const { personality, fitnessLevel, interests = [] } = profile

  // Personality → CHA/WIS
  if (personality === 'extrovert') { base.cha = Math.min(10, base.cha + 1) }
  if (personality === 'introvert') { base.wis = Math.min(10, base.wis + 1) }

  // Fitness → STR/DEX
  if (fitnessLevel === 'advanced') { base.str = Math.min(10, base.str + 1); base.dex = Math.min(10, base.dex + 1) }
  if (fitnessLevel === 'beginner') { base.str = Math.max(1, base.str - 1) }

  // Interests → INT/WIS/CHA
  if (interests.includes('mental')) base.int = Math.min(10, base.int + 1)
  if (interests.includes('creative')) base.int = Math.min(10, base.int + 1)
  if (interests.includes('social')) base.cha = Math.min(10, base.cha + 1)
  if (interests.includes('travel')) base.dex = Math.min(10, base.dex + 1)
  if (interests.includes('outdoors')) base.str = Math.min(10, base.str + 1)
  if (interests.includes('fitness')) base.str = Math.min(10, base.str + 1)

  return base
}

// ─── Level Calculation ───────────────────────────────────────────────────────

export function xpForLevel(level) {
  return level * 100
}

export function calculateLevel(xp) {
  let level = 1
  let remaining = xp
  while (remaining >= xpForLevel(level)) {
    remaining -= xpForLevel(level)
    level++
  }
  return { level, remainingXp: remaining, xpNeeded: xpForLevel(level) }
}

// ─── Badges ──────────────────────────────────────────────────────────────────

export const BADGES = [
  { id: 'first_quest', emoji: '🎯', name: 'First Steps', desc: 'Complete your first quest', condition: (s) => s.totalQuestsCompleted >= 1 },
  { id: 'ten_quests', emoji: '🏅', name: 'Veteran', desc: 'Complete 10 quests', condition: (s) => s.totalQuestsCompleted >= 10 },
  { id: 'level5', emoji: '⭐', name: 'Rising Star', desc: 'Reach level 5', condition: (s) => s.level >= 5 },
  { id: 'level10', emoji: '🌟', name: 'Hero', desc: 'Reach level 10', condition: (s) => s.level >= 10 },
  { id: 'monthly', emoji: '🏆', name: 'Monthly Champion', desc: 'Complete a monthly quest', condition: (s) => s.completedQuests.some(c => c.id.startsWith('m')) },
  { id: 'streak3', emoji: '🔥', name: 'On Fire', desc: 'Complete 3 quests in one day', condition: (s) => {
    const today = new Date().toDateString()
    const todayCount = s.completedQuests.filter(c => new Date(c.completedAt).toDateString() === today).length
    return todayCount >= 3
  }},
]

// ─── Reset Helpers ───────────────────────────────────────────────────────────

function nextDailyReset() { return Date.now() + 24 * 60 * 60 * 1000 }
function nextWeeklyReset() { return Date.now() + 7 * 24 * 60 * 60 * 1000 }
function nextMonthlyReset() { return Date.now() + 30 * 24 * 60 * 60 * 1000 }

function initQuests(state) {
  const now = Date.now()
  let { currentDaily, currentWeekly, currentMonthly, dailyResetAt, weeklyResetAt, monthlyResetAt, completedQuests } = state
  const recentlyCompleted = completedQuests.map(c => c.id)
  let changed = false

  if (!dailyResetAt || now >= dailyResetAt) {
    currentDaily = pickRandom(dailyQuests, 3, recentlyCompleted)
    dailyResetAt = nextDailyReset()
    changed = true
  }
  if (!weeklyResetAt || now >= weeklyResetAt) {
    currentWeekly = pickRandom(weeklyQuests, 2, recentlyCompleted)
    weeklyResetAt = nextWeeklyReset()
    changed = true
  }
  if (!monthlyResetAt || now >= monthlyResetAt) {
    currentMonthly = pickRandom(monthlyQuests, 1, recentlyCompleted)
    monthlyResetAt = nextMonthlyReset()
    changed = true
  }

  if (!currentDaily || currentDaily.length === 0) {
    currentDaily = pickRandom(dailyQuests, 3, [])
    dailyResetAt = nextDailyReset()
    changed = true
  }
  if (!currentWeekly || currentWeekly.length === 0) {
    currentWeekly = pickRandom(weeklyQuests, 2, [])
    weeklyResetAt = nextWeeklyReset()
    changed = true
  }
  if (!currentMonthly || currentMonthly.length === 0) {
    currentMonthly = pickRandom(monthlyQuests, 1, [])
    monthlyResetAt = nextMonthlyReset()
    changed = true
  }

  if (changed) {
    return { ...state, currentDaily, currentWeekly, currentMonthly, dailyResetAt, weeklyResetAt, monthlyResetAt }
  }
  return state
}

// ─── Default State ───────────────────────────────────────────────────────────

const DEFAULT_STATE = {
  playerName: 'Adventurer',
  level: 1,
  xp: 0,
  region: 'North America',
  onboarded: false,
  profile: {
    age: null,
    weightRange: null,
    personality: null,
    fitnessLevel: null,
    interests: [],
  },
  rpgClass: null,
  stats: { str: 5, dex: 5, int: 5, cha: 5, wis: 5 },
  activeQuests: [],
  completedQuests: [],
  dailyResetAt: null,
  weeklyResetAt: null,
  monthlyResetAt: null,
  currentDaily: [],
  currentWeekly: [],
  currentMonthly: [],
  showLevelUp: false,
  newLevel: null,
  totalQuestsCompleted: 0,
}

// ─── Reducer ─────────────────────────────────────────────────────────────────

function reducer(state, action) {
  switch (action.type) {
    case 'HYDRATE':
      return initQuests({ ...DEFAULT_STATE, ...action.payload })

    case 'COMPLETE_ONBOARDING': {
      const { playerName, region, profile } = action.payload
      const rpgClass = assignClass(profile)
      const stats = deriveStats(profile, rpgClass)
      const next = initQuests({
        ...state,
        playerName,
        region,
        profile,
        rpgClass,
        stats,
        onboarded: true,
      })
      return next
    }

    case 'UPDATE_PROFILE': {
      const { profile, playerName, region } = action.payload
      const rpgClass = assignClass(profile)
      const stats = deriveStats(profile, rpgClass)
      return { ...state, profile, rpgClass, stats, playerName: playerName || state.playerName, region: region || state.region }
    }

    case 'ACCEPT_QUEST': {
      const { questId } = action.payload
      if (state.activeQuests.includes(questId)) return state
      return { ...state, activeQuests: [...state.activeQuests, questId] }
    }

    case 'COMPLETE_QUEST': {
      const { questId, xpReward } = action.payload
      const alreadyCompleted = state.completedQuests.some(c => c.id === questId)
      if (alreadyCompleted) return state

      const newXp = state.xp + xpReward
      const oldLevel = state.level
      const { level: newLevel } = calculateLevel(newXp)
      const leveledUp = newLevel > oldLevel

      return {
        ...state,
        xp: newXp,
        level: newLevel,
        activeQuests: state.activeQuests.filter(id => id !== questId),
        completedQuests: [...state.completedQuests, { id: questId, completedAt: Date.now() }],
        totalQuestsCompleted: state.totalQuestsCompleted + 1,
        showLevelUp: leveledUp,
        newLevel: leveledUp ? newLevel : state.newLevel,
      }
    }

    case 'DISMISS_LEVEL_UP':
      return { ...state, showLevelUp: false }

    case 'REFRESH_QUESTS': {
      return initQuests(state)
    }

    case 'CHANGE_REGION':
      return { ...state, region: action.payload }

    default:
      return state
  }
}

// ─── Context ─────────────────────────────────────────────────────────────────

const AppContext = createContext(null)

const STORAGE_KEY = 'sidequest_v2_state'

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw)
  } catch {
    return null
  }
}

function saveToStorage(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // ignore
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, DEFAULT_STATE, (initial) => {
    const saved = loadFromStorage()
    if (saved) {
      return initQuests({ ...initial, ...saved })
    }
    return initial
  })

  // Persist to localStorage on every state change
  useEffect(() => {
    saveToStorage(state)
  }, [state])

  // Check quest resets periodically
  useEffect(() => {
    const interval = setInterval(() => {
      dispatch({ type: 'REFRESH_QUESTS' })
    }, 60 * 1000) // check every minute
    return () => clearInterval(interval)
  }, [])

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}

export default AppContext
