import React, { useState } from 'react'
import { CATEGORIES, generateId } from '../data/quests'
import { usePlayer } from '../context/PlayerContext'

const EMPTY = { title: '', description: '', category: 'adventure', difficulty: 3 }

export default function QuestSubmitForm() {
  const { submitQuest } = usePlayer()
  const [form, setForm] = useState(EMPTY)
  const [submitted, setSubmitted] = useState(false)
  const [errors, setErrors] = useState({})

  function validate() {
    const e = {}
    if (!form.title.trim()) e.title = 'Quest name is required.'
    else if (form.title.trim().length < 5) e.title = 'Title must be at least 5 characters.'
    if (!form.description.trim()) e.description = 'Description is required.'
    else if (form.description.trim().length < 20) e.description = 'Give a bit more detail (20+ chars).'
    return e
  }

  function handleSubmit(e) {
    e.preventDefault()
    const e2 = validate()
    if (Object.keys(e2).length) { setErrors(e2); return }
    const quest = {
      id: generateId(),
      title: form.title.trim(),
      description: form.description.trim(),
      category: form.category,
      difficulty: Number(form.difficulty),
      xp: Number(form.difficulty) * 25,
    }
    submitQuest(quest)
    setForm(EMPTY)
    setErrors({})
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 3000)
  }

  function set(field) {
    return (e) => {
      setForm((f) => ({ ...f, [field]: e.target.value }))
      setErrors((err) => ({ ...err, [field]: undefined }))
    }
  }

  const inputCls = (field) => [
    'w-full bg-slate-800/70 border rounded-lg px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 transition-colors',
    errors[field]
      ? 'border-red-500/70 focus:ring-red-500/50'
      : 'border-slate-700/50 focus:ring-amber-500/50 focus:border-amber-500/50',
  ].join(' ')

  return (
    <section className="mt-12 mb-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <span className="text-2xl">📝</span>
          <div>
            <h2 className="text-xl font-bold text-white">Submit a Quest</h2>
            <p className="text-sm text-slate-500">Got a challenge idea? Share it with the world.</p>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 space-y-5"
        >
          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1.5">
              Quest Name *
            </label>
            <input
              type="text"
              maxLength={80}
              placeholder="Give your quest a bold name…"
              value={form.title}
              onChange={set('title')}
              className={inputCls('title')}
            />
            {errors.title && <p className="text-red-400 text-xs mt-1">{errors.title}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1.5">
              Description *
            </label>
            <textarea
              rows={3}
              maxLength={400}
              placeholder="Describe the quest clearly — what must the adventurer do to complete it?"
              value={form.description}
              onChange={set('description')}
              className={`${inputCls('description')} resize-none`}
            />
            {errors.description && <p className="text-red-400 text-xs mt-1">{errors.description}</p>}
            <p className="text-xs text-slate-600 mt-1 text-right">{form.description.length}/400</p>
          </div>

          {/* Category + Difficulty row */}
          <div className="flex gap-4 flex-wrap">
            <div className="flex-1 min-w-[160px]">
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1.5">
                Category
              </label>
              <select
                value={form.category}
                onChange={set('category')}
                className="w-full bg-slate-800/70 border border-slate-700/50 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-amber-500/50 cursor-pointer"
              >
                {Object.entries(CATEGORIES).map(([key, cat]) => (
                  <option key={key} value={key}>
                    {cat.emoji} {cat.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex-1 min-w-[160px]">
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1.5">
                Difficulty — {['','Easy','Moderate','Challenging','Hard','Legendary'][form.difficulty]}
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min={1}
                  max={5}
                  value={form.difficulty}
                  onChange={set('difficulty')}
                  className="flex-1 accent-amber-500"
                />
                <span className="text-amber-400 font-bold text-sm w-4">{form.difficulty}</span>
              </div>
              <p className="text-xs text-slate-600 mt-1">XP reward: {form.difficulty * 25}</p>
            </div>
          </div>

          {/* Submit */}
          <div className="pt-2">
            {submitted ? (
              <div className="w-full py-3 bg-green-700/40 border border-green-600/50 text-green-300 text-sm font-semibold rounded-xl text-center">
                ✓ Quest posted to the board! Adventurers await.
              </div>
            ) : (
              <button
                type="submit"
                className="w-full py-3 bg-violet-700 hover:bg-violet-600 active:scale-95 text-white font-bold rounded-xl transition-all text-sm uppercase tracking-wide"
              >
                📜 Post Quest to Board
              </button>
            )}
          </div>
        </form>
      </div>
    </section>
  )
}
