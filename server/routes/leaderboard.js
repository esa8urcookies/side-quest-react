const express = require('express')
const pool = require('../db/pool')

const router = express.Router()

// GET /leaderboard?region=North+America&limit=10
router.get('/', async (req, res) => {
  const { region, limit = 10 } = req.query
  const cap = Math.min(Number(limit) || 10, 50)

  try {
    let query = `SELECT id, username, region, rpg_class, level, xp, total_score, quests_completed FROM leaderboard`
    const params = []

    if (region) {
      query += ` WHERE region = $1`
      params.push(region)
    }

    query += ` ORDER BY total_score DESC LIMIT $${params.length + 1}`
    params.push(cap)

    const { rows } = await pool.query(query, params)
    res.json(rows)
  } catch (err) {
    console.error('Leaderboard error:', err)
    res.status(500).json({ error: 'Failed to fetch leaderboard' })
  }
})

// GET /leaderboard/regions  — list distinct regions that have players
router.get('/regions', async (req, res) => {
  const { rows } = await pool.query(
    `SELECT DISTINCT region, COUNT(*)::INT AS player_count FROM users GROUP BY region ORDER BY player_count DESC`
  )
  res.json(rows)
})

// GET /leaderboard/rank/:userId  — get a specific user's rank in their region
router.get('/rank/:userId', async (req, res) => {
  const { userId } = req.params
  const { rows } = await pool.query(
    `SELECT rank FROM (
       SELECT id, RANK() OVER (PARTITION BY region ORDER BY total_score DESC) AS rank
       FROM leaderboard
     ) ranked WHERE id = $1`,
    [userId]
  )
  res.json(rows[0] || { rank: null })
})

module.exports = router
