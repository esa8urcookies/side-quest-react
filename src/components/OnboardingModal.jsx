import React, { useState } from 'react'
import { useApp } from '../context/AppContext'
import { assignClass, deriveStats } from '../context/AppContext'
import regions from '../data/regions'

const INTERESTS = [
  { key: 'outdoors', label: '🌲 Outdoors' },
  { key: 'social', label: '🤝 Social' },
  { key: 'creative', label: '🎨 Creative' },
  { key: 'mental', label: '🧠 Mental' },
  { key: 'travel', label: '✈️ Travel' },
  { key: 'fitness', label: '💪 Fitness' },
]

const WEIGHT_OPTIONS = ['Under 60 kg', '60–80 kg', '80–100 kg', '100 kg+']
const TOTAL_STEPS = 7

export default function OnboardingModal() {
  const { dispatch } = useApp()
  const [step, setStep] = useState(0)

  const [playerName, setPlayerName] = useState('')
  const [region, setRegion] = useState('North America')
  const [age, setAge] = useState(25)
  const [weightRange, setWeightRange] = useState('60–80 kg')
  const [personality, setPersonality] = useState(null)
  const [fitnessLevel, setFitnessLevel] = useState(null)
  const [interests, setInterests] = useState([])

  const profile = { age, weightRange, personality, fitnessLevel, interests }
  const rpgClass = (personality && fitnessLevel) ? assignClass(profile) : null
  const stats = rpgClass ? deriveStats(profile, rpgClass) : null

  function toggleInterest(key) {
    setInterests(prev => prev.includes(key) ? prev.filter(i => i !== key) : [...prev, key])
  }

  function canAdvance() {
    if (step === 0) return playerName.trim().length >= 2
    if (step === 2) return !!personality
    if (step === 3) return !!fitnessLevel
    if (step === 4) return interests.length >= 1
    return true
  }

  function finish() {
    dispatch({
      type: 'COMPLETE_ONBOARDING',
      payload: { playerName: playerName.trim(), region, profile },
    })
  }

  const statLabels = { str: 'STR', dex: 'DEX', int: 'INT', cha: 'CHA', wis: 'WIS' }

  return (
    <div className="fixed inset-0 z-50 modal-backdrop flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md shadow-2xl">
        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b border-slate-700/50">
          <h2 className="text-xl font-black gold-shimmer">Side Quest V2</h2>
          <p className="text-slate-400 text-sm mt-0.5">Create your adventurer</p>
          {/* Step dots */}
          <div className="flex items-center gap-1.5 mt-3">
            {Array.from({ length: TOTAL_STEPS }, (_, i) => (
              <div key={i} className={`step-dot ${i === step ? 'active' : i < step ? 'done' : ''}`} />
            ))}
          </div>
        </div>

        {/* Step content */}
        <div className="px-6 py-5 min-h-[220px]">

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

          {/* Step 2 – Personality */}
          {step === 2 && (
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

          {/* Step 3 – Fitness */}
          {step === 3 && (
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

          {/* Step 4 – Interests */}
          {step === 4 && (
            <div>
              <p className="text-white font-semibold mb-3">Pick your interests <span className="text-slate-500 text-xs">(at least 1)</span></p>
              <div className="grid grid-cols-2 gap-2">
                {INTERESTS.map(({ key, label }) => (
                  <button
                    key={key}
                    onClick={() => toggleInterest(key)}
                    className={`interest-chip border rounded-lg py-2.5 px-3 text-sm font-medium text-left ${interests.includes(key) ? 'selected' : 'border-slate-600 text-slate-400'}`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 5 – Region */}
          {step === 5 && (
            <div>
              <p className="text-white font-semibold mb-3">Which region are you from?</p>
              <select value={region} onChange={e => setRegion(e.target.value)} className="w-full">
                {regions.map(r => <option key={r}>{r}</option>)}
              </select>
              <p className="text-xs text-slate-500 mt-2">Used to place you on the regional leaderboard.</p>
            </div>
          )}

          {/* Step 6 – Summary */}
          {step === 6 && (
            <div className="text-center">
              <div className={`text-5xl mb-2 ${rpgClass?.glowClass || ''}`}>{rpgClass?.emoji || '🧭'}</div>
              <h3 className="text-xl font-black text-white mb-0.5">{rpgClass?.name || 'Adventurer'}</h3>
              <p className="text-slate-400 text-xs mb-4">{rpgClass?.description || 'Versatile and bold.'}</p>
              {stats && (
                <div className="space-y-1.5 text-left">
                  {Object.entries(stats).map(([k, v]) => (
                    <div key={k} className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-400 w-8 uppercase">{statLabels[k]}</span>
                      <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden">
                        <div className="stat-bar-fill h-full rounded-full" style={{ width: `${v * 10}%` }} />
                      </div>
                      <span className="text-xs font-bold text-white w-4">{v}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer buttons */}
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
