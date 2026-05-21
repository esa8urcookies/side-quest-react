import React, { useState, useEffect } from 'react'

function formatTime(ms) {
  if (ms <= 0) return 'Refreshing...'
  const totalSeconds = Math.floor(ms / 1000)
  const days = Math.floor(totalSeconds / 86400)
  const hours = Math.floor((totalSeconds % 86400) / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  if (days > 0) {
    return `${days}d ${hours}h ${minutes}m`
  }
  if (hours > 0) {
    return `${hours}h ${minutes}m ${seconds}s`
  }
  return `${minutes}m ${seconds}s`
}

export default function QuestTimer({ resetAt, label = 'Refreshes in' }) {
  const [remaining, setRemaining] = useState(() => (resetAt ? resetAt - Date.now() : 0))

  useEffect(() => {
    if (!resetAt) return
    const tick = () => setRemaining(resetAt - Date.now())
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [resetAt])

  return (
    <span className="text-xs text-slate-400 font-mono">
      {label}: <span className="text-amber-400 font-semibold">{formatTime(remaining)}</span>
    </span>
  )
}
