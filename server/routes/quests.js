const express = require('express')
const pool = require('../db/pool')
const requireAuth = require('../middleware/auth')

const router = express.Router()
router.use(requireAuth)

// GET /quests/active  — quests this user has accepted
router.get('/active', async (req, res) => {
  const { rows } = await pool.query(
    'SELECT quest_id, accepted_at FROM active_quests WHERE user_id = $1',
    [req.user.sub]
  )
  res.json(rows)
})

// GET /quests/completed  — all completed quests for this user
router.get('/completed', async (req, res) => {
  const { rows } = await pool.query(
    'SELECT quest_id, quest_type, xp_earned, completed_at FROM quest_completions WHERE user_id = $1 ORDER BY completed_at DESC',
    [req.user.sub]
  )
  res.json(rows)
})

// POST /quests/:id/accept
router.post('/:id/accept', async (req, res) => {
  const { id } = req.params
  const userId = req.user.sub

  // Check not already completed
  const { rows: done } = await pool.query(
    'SELECT 1 FROM quest_completions WHERE user_id = $1 AND quest_id = $2',
    [userId, id]
  )
  if (done.length) return res.status(409).json({ error: 'Quest already completed' })

  try {
    await pool.query(
      'INSERT INTO active_quests (user_id, quest_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
      [userId, id]
    )
    res.status(201).json({ questId: id, status: 'active' })
  } catch (err) {
    console.error('Accept quest error:', err)
    res.status(500).json({ error: 'Failed to accept quest' })
  }
})

// POST /quests/:id/abandon
router.post('/:id/abandon', async (req, res) => {
  await pool.query(
    'DELETE FROM active_quests WHERE user_id = $1 AND quest_id = $2',
    [req.user.sub, req.params.id]
  )
  res.json({ questId: req.params.id, status: 'abandoned' })
})

// POST /quests/:id/complete
router.post('/:id/complete', async (req, res) => {
  const { id } = req.params
  const { questType, xpEarned } = req.body
  const userId = req.user.sub

  if (!questType || typeof xpEarned !== 'number') {
    return res.status(400).json({ error: 'questType and xpEarned are required' })
  }

  // Must be active
  const { rows: active } = await pool.query(
    'SELECT 1 FROM active_quests WHERE user_id = $1 AND quest_id = $2',
    [userId, id]
  )
  if (!active.length) return res.status(400).json({ error: 'Quest is not active' })

  // Must not be already completed
  const { rows: done } = await pool.query(
    'SELECT 1 FROM quest_completions WHERE user_id = $1 AND quest_id = $2',
    [userId, id]
  )
  if (done.length) return res.status(409).json({ error: 'Quest already completed' })

  const client = await pool.connect()
  try {
    await client.query('BEGIN')

    // Record completion
    await client.query(
      'INSERT INTO quest_completions (user_id, quest_id, quest_type, xp_earned) VALUES ($1, $2, $3, $4)',
      [userId, id, questType, xpEarned]
    )

    // Remove from active
    await client.query('DELETE FROM active_quests WHERE user_id = $1 AND quest_id = $2', [userId, id])

    // Update XP on profile (level-up handled client-side, but we keep XP in sync)
    const { rows: profile } = await client.query(
      'SELECT level, xp FROM profiles WHERE user_id = $1 FOR UPDATE',
      [userId]
    )
    const current = profile[0]
    let newXp = (current?.xp || 0) + xpEarned
    let newLevel = current?.level || 1
    while (newLevel < 50 && newXp >= newLevel * 100) {
      newXp -= newLevel * 100
      newLevel++
    }
    await client.query(
      'UPDATE profiles SET xp = $1, level = $2, updated_at = NOW() WHERE user_id = $3',
      [newXp, newLevel, userId]
    )

    await client.query('COMMIT')
    res.json({ questId: id, xpEarned, newXp, newLevel })
  } catch (err) {
    await client.query('ROLLBACK')
    console.error('Complete quest error:', err)
    res.status(500).json({ error: 'Failed to complete quest' })
  } finally {
    client.release()
  }
})

module.exports = router
