import React, { useState } from 'react'
import { useApp } from '../context/AppContext'
import { assignClass, deriveStats } from '../context/AppContext'
import { COUNTRIES, COUNTRY_TO_REGION } from '../data/regions'

const INTERESTS = [
  { key: 'outdoors', label: 'Outdoors', emoji: '🌲' },
  { key: 'social', label: 'Social', emoji: '🤝' },
  { key: 'creative', label: 'Creative', emoji: '🎨' },
  { key: 'mental', label: 'Mental', emoji: '🧠' },
  { key: 'travel', label: 'Travel', emoji: '✈️' },
  { key: 'fitness', label: 'Fitness', emoji: '💪' },
]

const HOBBIES = [
  { key: 'gaming', label: 'Gaming', emoji: '🎮' },
  { key: 'music', label: 'Music', emoji: '🎵' },
  { key: 'cooking', label: 'Cooking', emoji: '🍳' },
  { key: 'movies', label: 'Movies', emoji: '🎬' },
  { key: 'photography', label: 'Photography', emoji: '📸' },
  { key: 'art', label: 'Art & Drawing', emoji: '🖌️' },
  { key: 'writing', label: 'Writing', emoji: '✍️' },
  { key: 'dancing', label: 'Dancing', emoji: '💃' },
  { key: 'hiking', label: 'Hiking', emoji: '🥾' },
  { key: 'reading', label: 'Reading', emoji: '📚' },
  { key: 'coding', label: 'Coding', emoji: '💻' },
  { key: 'fashion', label: 'Fashion', emoji: '👗' },
]

const SPORTS = [
  { key: 'football', label: 'Football / Soccer', emoji: '⚽' },
  { key: 'basketball', label: 'Basketball', emoji: '🏀' },
  { key: 'american_football', label: 'American Football', emoji: '🏈' },
  { key: 'baseball', label: 'Baseball', emoji: '⚾' },
  { key: 'tennis', label: 'Tennis', emoji: '🎾' },
  { key: 'cricket', label: 'Cricket', emoji: '🏏' },
  { key: 'swimming', label: 'Swimming', emoji: '🏊' },
  { key: 'running', label: 'Running', emoji: '🏃' },
  { key: 'cycling', label: 'Cycling', emoji: '🚴' },
  { key: 'mma', label: 'MMA / Boxing', emoji: '🥊' },
  { key: 'volleyball', label: 'Volleyball', emoji: '🏐' },
  { key: 'golf', label: 'Golf', emoji: '⛳' },
]

const RELIGIONS = [
  'Prefer not to say',
  'No religion / Atheist',
  'Christian',
  'Muslim',
  'Hindu',
  'Buddhist',
  'Jewish',
  'Sikh',
  'Other',
]

const WEIGHT_OPTIONS = ['Under 60 kg', '60–80 kg', '80–100 kg', '100 kg+']
const TOTAL_STEPS = 10

export default function OnboardingModal() {
  const { dispatch } = useApp()
  const [step, setStep] = useState(0)

  const [playerName, setPlayerName] = useState('')
  const [age, setAge] = useState(25)
  const [weightRange, setWeightRange] = useState('60–80 kg')
  const [country, setCountry] = useState('United States')
  const [personality, setPersonality] = useState(null)
  const [fitnessLevel, setFitnessLevel] = useState(null)
  const [interests, setInterests] = useState([])
  const [hobbies, setHobbies] = useState([])
  const [favoriteSports, setFavoriteSports] = useState([])
  const [sportsTeam, setSportsTeam] = useState('')
  const [religion, setReligion] = useState('Prefer not to say')

  const profile = { age, weightRange, personality, fitnessLevel, interests, hobbies, favoriteSports, sportsTeam, religion, country }
  const rpgClass = (personality && fitnessLevel) ? assignClass(profile) : null
  const stats = rpgClass ? deriveStats(profile, rpgClass) : null

  function toggle(setter) {
    return (key) => setter(prev => prev.includes(key) ? prev.filter(i => i !== key) : [...prev, key])
  }

  function canAdvance() {
    if (step === 0) return playerName.trim().length >= 2
    if (step === 3) return !!personality
    if (step === 4) return !!fitnessLevel
    if (step === 5) return interests.length >= 1
    return true
  }

  function finish() {
    const region = COUNTRY_TO_REGION[country] || 'North America'
    dispatch({
      type: 'COMPLETE_ONBOARDING',
      payload: { playerName: playerName.trim(), region, profile },
    })
  }

  const statLabels = { str: 'STR', dex: 'DEX', int: 'INT', cha: 'CHA', wis: 'WIS' }
  const statColors = { str: 'from-red-600 to-red-400', dex: 'from-green-600 to-green-400', int: 'from-purple-600 to-purple-400', cha: 'from-pink-600 to-pink-400', wis: 'from-blue-600 to-blue-400' }

  return (
    <div className="fixed inset-0 z-50 modal-backdrop flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md shadow-2xl">
        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b border-slate-700/50">
          <h2 className="text-xl font-black gold-shimmer">Side Quest V2</h2>
          <p className="text-slate-400 text-sm mt-0.5">Create your adventurer</p>
          <div className="flex items-center gap-1.5 mt-3 flex-wrap">
            {Array.from({ length: TOTAL_STEPS }, (_, i) => (
              <div key={i} className={`step-dot ${i === step ? 'active' : i < step ? 'done' : ''}`} />
            ))}
          </div>
        </div>

        {/* Step content */}
        <div className="px-6 py-5 min-h-[240px] max-h-[60vh] overflow-y-auto">

          {/* Step 0 – Name */}
          {step === 0 && (
            <div>
              <p className="text-white font-semibold mb-4">What shall we call you, adventurer?</p>
              <input
                type="text"
                placeholder="Enter your adventurer name…"
                value={playerName}
                onChange={e => setPlayerName(e.target.value)}
                maxLength={24}
                autoFocus
                onKeyDown={e => e.key === 'Enter' && canAdvance() && setStep(1)}
              />
              <p className="text-xs text-slate-500 mt-2">This will appear on the leaderboard.</p>
            </div>
          )}

          {/* Step 1 – Age + Weight */}
          {step === 1 && (
            <div className="space-y-5">
              <div>
                <p className="text-white font-semibold mb-2">Age: <span className="text-amber-400">{age}</span></p>
                <input type="range" min={13} max={80} value={age} onChange={e => setAge(Number(e.target.value))} />
              </div>
              <div>
                <p className="text-white font-semibold mb-2">Weight range</p>
                <select value={weightRange} onChange={e => setWeightRange(e.target.value)} className="w-full">
                  {WEIGHT_OPTIONS.map(w => <option key={w}>{w}</option>)}
                </select>
              </div>
            </div>
          )}

          {/* Step 2 – Country */}
          {step === 2 && (
            <div>
              <p className="text-white font-semibold mb-3">Which country are you from?</p>
              <select value={country} onChange={e => setCountry(e.target.value)} className="w-full">
                {COUNTRIES.map(c => <option key={c}>{c}</option>)}
              </select>
              <p className="text-xs text-slate-500 mt-2">
                Used for regional leaderboard placement ({COUNTRY_TO_REGION[country] || 'Unknown Region'}).
              </p>
            </div>
          )}

          {/* Step 3 – Personality */}
          {step === 3 && (
            <div>
              <p className="text-white font-semibold mb-4">How would you describe yourself?</p>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { key: 'introvert', label: 'Introvert', emoji: '📚', desc: 'Recharge alone' },
                  { key: 'ambivert', label: 'Ambivert', emoji: '⚖️', desc: 'Both worlds' },
                  { key: 'extrovert', label: 'Extrovert', emoji: '🎉', desc: 'Energized by others' },
                ].map(p => (
                  <button
                    key={p.key}
                    onClick={() => setPersonality(p.key)}
                    className={`personality-btn border rounded-xl p-3 text-center ${personality === p.key ? 'selected' : 'border-slate-600 text-slate-400'}`}
                  >
                    <div className="text-2xl mb-1">{p.emoji}</div>
                    <div className="text-xs font-bold">{p.label}</div>
                    <div className="text-xs text-slate-500">{p.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 4 – Fitness */}
          {step === 4 && (
            <div>
              <p className="text-white font-semibold mb-4">What's your current fitness level?</p>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { key: 'beginner', label: 'Beginner', emoji: '🌱', desc: 'Starting out' },
                  { key: 'intermediate', label: 'Intermediate', emoji: '🔥', desc: 'Regular activity' },
                  { key: 'advanced', label: 'Advanced', emoji: '⚡', desc: 'Highly active' },
                ].map(f => (
                  <button
                    key={f.key}
                    onClick={() => setFitnessLevel(f.key)}
                    className={`personality-btn border rounded-xl p-3 text-center ${fitnessLevel === f.key ? 'selected' : 'border-slate-600 text-slate-400'}`}
                  >
                    <div className="text-2xl mb-1">{f.emoji}</div>
                    <div className="text-xs font-bold">{f.label}</div>
                    <div className="text-xs text-slate-500">{f.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 5 – Interests */}
          {step === 5 && (
            <div>
              <p className="text-white font-semibold mb-1">What drives you? <span className="text-slate-500 text-xs">(pick at least 1)</span></p>
              <p className="text-xs text-slate-500 mb-3">These shape your RPG class and quests.</p>
              <div className="grid grid-cols-2 gap-2">
                {INTERESTS.map(({ key, label, emoji }) => (
                  <button
                    key={key}
                    onClick={() => toggle(setInterests)(key)}
                    className={`interest-chip border rounded-lg py-2.5 px-3 text-sm font-medium text-left flex items-center gap-2 ${interests.includes(key) ? 'selected' : 'border-slate-600 text-slate-400'}`}
                  >
                    <span>{emoji}</span><span>{label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 6 – Hobbies */}
          {step === 6 && (
            <div>
              <p className="text-white font-semibold mb-1">What are your hobbies? <span className="text-slate-500 text-xs">(optional)</span></p>
              <p className="text-xs text-slate-500 mb-3">Pick as many as you like.</p>
              <div className="grid grid-cols-2 gap-2">
                {HOBBIES.map(({ key, label, emoji }) => (
                  <button
                    key={key}
                    onClick={() => toggle(setHobbies)(key)}
                    className={`interest-chip border rounded-lg py-2 px-3 text-sm font-medium text-left flex items-center gap-2 ${hobbies.includes(key) ? 'selected' : 'border-slate-600 text-slate-400'}`}
                  >
                    <span>{emoji}</span><span>{label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 7 – Sports */}
          {step === 7 && (
            <div>
              <p className="text-white font-semibold mb-1">Favourite sports? <span className="text-slate-500 text-xs">(optional)</span></p>
              <div className="grid grid-cols-2 gap-2 mb-4">
                {SPORTS.map(({ key, label, emoji }) => (
                  <button
                    key={key}
                    onClick={() => toggle(setFavoriteSports)(key)}
                    className={`interest-chip border rounded-lg py-2 px-3 text-sm font-medium text-left flex items-center gap-2 ${favoriteSports.includes(key) ? 'selected' : 'border-slate-600 text-slate-400'}`}
                  >
                    <span>{emoji}</span><span className="text-xs">{label}</span>
                  </button>
                ))}
              </div>
              <p className="text-white font-semibold mb-2 text-sm">Favourite team? <span className="text-slate-500 text-xs">(optional)</span></p>
              <input
                type="text"
                placeholder="e.g. Real Madrid, Lakers, All Blacks…"
                value={sportsTeam}
                onChange={e => setSportsTeam(e.target.value)}
                maxLength={40}
              />
            </div>
          )}

          {/* Step 8 – Religion */}
          {step === 8 && (
            <div>
              <p className="text-white font-semibold mb-1">Religion / Belief <span className="text-slate-500 text-xs">(optional)</span></p>
              <p className="text-xs text-slate-500 mb-3">This is private and only used to personalise your quests.</p>
              <div className="grid grid-cols-1 gap-2">
                {RELIGIONS.map(r => (
                  <button
                    key={r}
                    onClick={() => setReligion(r)}
                    className={`personality-btn border rounded-lg py-2.5 px-4 text-sm font-medium text-left transition-all ${religion === r ? 'selected border-amber-500 bg-amber-500/10 text-amber-300' : 'border-slate-600 text-slate-400'}`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 9 – Summary */}
          {step === 9 && (
            <div className="text-center">
              <div className="text-5xl mb-2">{rpgClass?.emoji || '🧭'}</div>
              <h3 className={`text-xl font-black mb-0.5 ${rpgClass?.textColor || 'text-amber-400'}`}>{rpgClass?.name || 'Adventurer'}</h3>
              <p className="text-slate-400 text-xs mb-4">{rpgClass?.description || 'Versatile and bold.'}</p>
              {stats && (
                <div className="space-y-2 text-left mb-4">
                  {Object.entries(stats).map(([k, v]) => (
                    <div key={k} className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-400 w-8 uppercase">{statLabels[k]}</span>
                      <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full bg-gradient-to-r ${statColors[k] || 'from-slate-600 to-slate-400'}`} style={{ width: `${v * 10}%` }} />
                      </div>
                      <span className="text-xs font-bold text-white w-4">{v}</span>
                    </div>
                  ))}
                </div>
              )}
              <div className="text-xs text-slate-500 space-y-1 text-left bg-slate-800 rounded-xl p-3">
                <div>🌍 <span className="text-slate-300">{country}</span></div>
                {favoriteSports.length > 0 && <div>⚽ <span className="text-slate-300">{favoriteSports.length} sport{favoriteSports.length > 1 ? 's' : ''} selected</span></div>}
                {sportsTeam && <div>🏆 <span className="text-slate-300">{sportsTeam}</span></div>}
                {hobbies.length > 0 && <div>🎯 <span className="text-slate-300">{hobbies.length} hobb{hobbies.length > 1 ? 'ies' : 'y'} selected</span></div>}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 pb-6 flex gap-3">
          {step > 0 && (
            <button
              onClick={() => setStep(s => s - 1)}
              className="flex-1 py-2.5 border border-slate-600 text-slate-300 hover:text-white hover:border-slate-500 rounded-xl text-sm font-semibold transition-colors"
            >
              Back
            </button>
          )}
          {step < TOTAL_STEPS - 1 ? (
            <button
              onClick={() => canAdvance() && setStep(s => s + 1)}
              disabled={!canAdvance()}
              className="flex-1 py-2.5 bg-amber-500 hover:bg-amber-400 disabled:bg-slate-700 disabled:text-slate-500 text-slate-900 font-bold rounded-xl text-sm transition-colors"
            >
              Continue →
            </button>
          ) : (
            <button
              onClick={finish}
              className="flex-1 py-2.5 bg-green-600 hover:bg-green-500 text-white font-bold rounded-xl text-sm transition-colors"
            >
              Begin Adventure! ⚔️
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
