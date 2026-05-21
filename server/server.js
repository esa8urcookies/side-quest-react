require('dotenv').config()
const express = require('express')
const cors = require('cors')

const authRoutes        = require('./routes/auth')
const profileRoutes     = require('./routes/profile')
const questRoutes       = require('./routes/quests')
const leaderboardRoutes = require('./routes/leaderboard')

const app = express()
const PORT = process.env.PORT || 3001

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}))
app.use(express.json())

// ── Routes ────────────────────────────────────────────────────────────────────
app.use('/auth',        authRoutes)
app.use('/profile',     profileRoutes)
app.use('/quests',      questRoutes)
app.use('/leaderboard', leaderboardRoutes)

// ── Health check ──────────────────────────────────────────────────────────────
app.get('/health', (_, res) => res.json({ status: 'ok', ts: new Date().toISOString() }))

// ── 404 ───────────────────────────────────────────────────────────────────────
app.use((_, res) => res.status(404).json({ error: 'Not found' }))

// ── Error handler ─────────────────────────────────────────────────────────────
app.use((err, _req, res, _next) => {
  console.error(err)
  res.status(500).json({ error: 'Internal server error' })
})

app.listen(PORT, () => {
  console.log(`⚔️  Side Quest API running on http://localhost:${PORT}`)
})
