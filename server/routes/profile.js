const express = require('express')
const pool = require('../db/pool')
const requireAuth = require('../middleware/auth')

const router = express.Router()
router.use(requireAuth)

// GET /profile
router.get('/', async (req, res) => {
  const { rows } = await pool.query(
    `SELECT p.*, u.username, u.region, u.email
     FROM profiles p
     JOIN users u ON u.id = p.user_id
     WHERE p.user_id = $1`,
    [req.user.sub]
  )
  if (!rows[0]) return res.status(404).json({ error: 'Profile not found' })
  res.json(rows[0])
})

// PUT /profile
router.put('/', async (req, res) => {
  const { username, region, age, weightRange, personality, fitnessLevel, interests, rpgClass, level, xp, str, dex, int, cha, wis } = req.body
  const userId = req.user.sub

  const client = await pool.connect()
  try {
    await client.query('BEGIN')

    if (username || region) {
      const updates = []
      const vals = []
      let i = 1
      if (username) { updates.push(`username = $${i++}`); vals.push(username.trim().slice(0, 24)) }
      if (region)   { updates.push(`region   = $${i++}`); vals.push(region) }
      if (updates.length) {
        vals.push(userId)
        await client.query(`UPDATE users SET ${updates.join(', ')} WHERE id = $${i}`, vals)
      }
    }

    await client.query(
      `UPDATE profiles SET
         age           = COALESCE($1, age),
         weight_range  = COALESCE($2, weight_range),
         personality   = COALESCE($3, personality),
         fitness_level = COALESCE($4, fitness_level),
         interests     = COALESCE($5, interests),
         rpg_class     = COALESCE($6, rpg_class),
         level         = COALESCE($7, level),
         xp            = COALESCE($8, xp),
         str           = COALESCE($9, str),
         dex           = COALESCE($10, dex),
         int           = COALESCE($11, int),
         cha           = COALESCE($12, cha),
         wis           = COALESCE($13, wis),
         updated_at    = NOW()
       WHERE user_id = $14`,
      [age, weightRange, personality, fitnessLevel, interests, rpgClass, level, xp, str, dex, int, cha, wis, userId]
    )

    await client.query('COMMIT')

    const { rows } = await client.query(
      `SELECT p.*, u.username, u.region FROM profiles p JOIN users u ON u.id = p.user_id WHERE p.user_id = $1`,
      [userId]
    )
    res.json(rows[0])
  } catch (err) {
    await client.query('ROLLBACK')
    if (err.code === '23505') return res.status(409).json({ error: 'Username already taken' })
    console.error('Profile update error:', err)
    res.status(500).json({ error: 'Failed to update profile' })
  } finally {
    client.release()
  }
})

module.exports = router
