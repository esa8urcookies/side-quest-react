import React from 'react'
import { useApp } from '../context/AppContext'
import { dailyQuests, weeklyQuests, monthlyQuests } from '../data/quests'
import QuestCard from '../components/QuestCard'
import QuestTimer from '../components/QuestTimer'

function SectionHeader({ emoji, title, badge, badgeColor, timer, resetAt }) {
  return (
    <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
      <div className="flex items-center gap-3">
        <span className="text-2xl">{emoji}</span>
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-black text-white">{title}</h2>
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${badgeColor}`}>{badge}</span>
          </div>
          {resetAt && <QuestTimer resetAt={resetAt} />}
        </div>
      </div>
    </div>
  )
}

export default function Dashboard() {
  const { state } = useApp()
  const { currentDaily, currentWeekly, currentMonthly, dailyResetAt, weeklyResetAt, monthlyResetAt, activeQuests, completedQuests } = state

  const allQuests = [...dailyQuests, ...weeklyQuests, ...monthlyQuests]
  const getQuest = (id) => allQuests.find(q => q.id === id)

  const dailyPool   = (currentDaily   || []).map(getQuest).filter(Boolean)
  const weeklyPool  = (currentWeekly  || []).map(getQuest).filter(Boolean)
  const monthlyPool = (currentMonthly || []).map(getQuest).filter(Boolean)

  const active = activeQuests.length
  const done   = completedQuests.length

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-10 page-enter">
      {/* Stats bar */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Active Quests', value: active, emoji: '⚡', color: 'text-amber-400' },
          { label: 'Completed', value: done, emoji: '✅', color: 'text-green-400' },
          { label: 'Total Available', value: dailyPool.length + weeklyPool.length + monthlyPool.length, emoji: '📜', color: 'text-violet-400' },
        ].map(({ label, value, emoji, color }) => (
          <div key={label} className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-4 text-center">
            <div className="text-2xl mb-1">{emoji}</div>
            <div className={`text-2xl font-black ${color}`}>{value}</div>
            <div className="text-xs text-slate-500 mt-0.5">{label}</div>
          </div>
        ))}
      </div>

      {/* Daily */}
      <section>
        <SectionHeader
          emoji="☀️"
          title="Daily Quests"
          badge="Easy"
          badgeColor="bg-green-900/40 border-green-700/40 text-green-400"
          resetAt={dailyResetAt}
        />
        {dailyPool.length ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {dailyPool.map(q => <QuestCard key={q.id} quest={q} />)}
          </div>
        ) : (
          <p className="text-slate-500 text-sm">No daily quests loaded yet.</p>
        )}
      </section>

      {/* Weekly */}
      <section>
        <SectionHeader
          emoji="📅"
          title="Weekly Quests"
          badge="Medium – Hard"
          badgeColor="bg-amber-900/40 border-amber-700/40 text-amber-400"
          resetAt={weeklyResetAt}
        />
        {weeklyPool.length ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {weeklyPool.map(q => <QuestCard key={q.id} quest={q} />)}
          </div>
        ) : (
          <p className="text-slate-500 text-sm">No weekly quests loaded yet.</p>
        )}
      </section>

      {/* Monthly */}
      <section>
        <SectionHeader
          emoji="🗓️"
          title="Monthly Quests"
          badge="Legendary"
          badgeColor="bg-red-900/40 border-red-700/40 text-red-400"
          resetAt={monthlyResetAt}
        />
        {monthlyPool.length ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {monthlyPool.map(q => <QuestCard key={q.id} quest={q} />)}
          </div>
        ) : (
          <p className="text-slate-500 text-sm">No monthly quests loaded yet.</p>
        )}
      </section>
    </div>
  )
}
