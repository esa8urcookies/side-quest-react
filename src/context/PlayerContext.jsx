import React, { createContext, useContext, useReducer, useEffect, useState } from 'react'
import { SEED_QUESTS } from '../data/quests'

const PlayerContext = createContext(null)

const XP_PER_LEVEL = (level) => level * 100
const MAX_LEVEL = 50

const STORAGE_KEY = 'side-quest-player'

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch (_) {}
  return null
}

function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch (_) {}
}

function getInitialState() {
  const saved = loadState()
  if (saved) return saved
  return {
    playerName: 'Adventurer',
    level: 1,
    xp: 0,
    xpToNextLevel: 100,
    activeQuests: [],
    completedQuests: [],
    submittedQuests: [],
  }
}

function applyXP(state, amount) {
  if (state.level >= MAX_LEVEL) return { ...state, leveledUp: false }

  let xp = state.xp + amount
  let level = state.level
  let leveledUp = false

  while (level < MAX_LEVEL && xp >= XP_PER_LEVEL(level)) {
    xp -= XP_PER_LEVEL(level)
    level += 1
    leveledUp = true
  }

  if (level >= MAX_LEVEL) xp = 0

  return {
    ...state,
    xp,
    level,
    xpToNextLevel: XP_PER_LEVEL(level),
    leveledUp,
  }
}

function reducer(state, action) {
  switch (action.type) {
    case 'SET_PLAYER_NAME':
      return { ...state, playerName: action.payload }

    case 'ACCEPT_QUEST': {
      const id = action.payload
      if (state.activeQuests.includes(id) || state.completedQuests.includes(id)) return state
      return { ...state, activeQuests: [...state.activeQuests, id], leveledUp: false }
    }

    case 'ABANDON_QUEST': {
      const id = action.payload
      return { ...state, activeQuests: state.activeQuests.filter((q) => q !== id), leveledUp: false }
    }

    case 'COMPLETE_QUEST': {
      const id = action.payload
      if (!state.activeQuests.includes(id)) return state
      const allQuests = [...SEED_QUESTS, ...state.submittedQuests]
      const quest = allQuests.find((q) => q.id === id)
      const xpReward = quest ? (quest.xp ?? quest.xpReward ?? 0) : 0
      const next = applyXP(
        {
          ...state,
          activeQuests: state.activeQuests.filter((q) => q !== id),
          completedQuests: [...state.completedQuests, id],
        },
        xpReward
      )
      return next
    }

    case 'SUBMIT_QUEST': {
      const quest = action.payload
      return {
        ...state,
        submittedQuests: [...state.submittedQuests, quest],
        leveledUp: false,
      }
    }

    case 'CLEAR_LEVEL_UP':
      return { ...state, leveledUp: false }

    default:
      return state
  }
}

export function PlayerProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, null, getInitialState)
  const [showLevelUp, setShowLevelUp] = useState(false)

  useEffect(() => {
    saveState(state)
    if (state.leveledUp) {
      setShowLevelUp(true)
      dispatch({ type: 'CLEAR_LEVEL_UP' })
    }
  }, [state])

  const acceptQuest = (id) => dispatch({ type: 'ACCEPT_QUEST', payload: id })
  const abandonQuest = (id) => dispatch({ type: 'ABANDON_QUEST', payload: id })
  const completeQuest = (id) => dispatch({ type: 'COMPLETE_QUEST', payload: id })
  const submitQuest = (quest) => dispatch({ type: 'SUBMIT_QUEST', payload: quest })
  const setPlayerName = (name) => dispatch({ type: 'SET_PLAYER_NAME', payload: name })
  const dismissLevelUp = () => setShowLevelUp(false)

  const xpPercent =
    state.level >= MAX_LEVEL
      ? 100
      : Math.min(100, Math.round((state.xp / state.xpToNextLevel) * 100))

  const value = {
    ...state,
    xpPercent,
    showLevelUp,
    acceptQuest,
    abandonQuest,
    completeQuest,
    submitQuest,
    setPlayerName,
    dismissLevelUp,
    MAX_LEVEL,
  }

  return <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>
}

export function usePlayer() {
  const ctx = useContext(PlayerContext)
  if (!ctx) throw new Error('usePlayer must be used inside <PlayerProvider>')
  return ctx
}
