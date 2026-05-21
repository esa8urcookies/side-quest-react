const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const pool = require('../db/pool')

const router = express.Router()

function signToken(userId) {
  return jwt.sign({ sub: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  })
}

// POST /auth/register
router.post('/register', async (req, res) => {
  const { username, email, password, region } = req.body

  if (!username || !email || !password) {
    return res.status(400).json({ error: 'username, email, and password are required' })
  }
  if (username.length < 2 || username.length > 24) {
    return res.status(400).json({ error: 'Username must be 2–24 characters' })
  }
  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters' })
  }

  const hash = await bcrypt.hash(password, 12)

  const client = await pool.connect()
  try {
    await client.query('BEGIN')

    const { rows } = await client.query(
      'INSERT INTO users (username, email, password, region) VALUES ($1, $2, $3, $4) RETURNING id, username, email, region',
      [username.trim(), email.trim().toLowerCase(), hash, region || 'North America']
    )
    const user = rows[0]

    // Create default profile
    await client.query(
      'INSERT INTO profiles (user_id) VALUES ($1)',
      [user.id]
    )

    await client.query('COMMIT')

    const token = signToken(user.id)
    res.status(201).json({ token, user: { id: user.id, username: user.username, email: user.email, region: user.region } })
  } catch (err) {
    await client.query('ROLLBACK')
    if (err.code === '23505') {
      const field = err.constraint?.includes('email') ? 'Email' : 'Username'
      return res.status(409).json({ error: `${field} is already taken` })
    }
    console.error('Register error:', err)
    res.status(500).json({ error: 'Registration failed' })
  } finally {
    client.release()
  }
})

// POST /auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body
  if (!email || !password) {
    return res.status(400).json({ error: 'email and password are required' })
  }

  const { rows } = await pool.query(
    'SELECT id, username, email, region, password FROM users WHERE email = $1',
    [email.trim().toLowerCase()]
  )
  const user = rows[0]

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ error: 'Invalid email or password' })
  }

  const token = signToken(user.id)
  res.json({ token, user: { id: user.id, username: user.username, email: user.email, region: user.region } })
})

// GET /auth/me  (requires auth)
const requireAuth = require('../middleware/auth')
router.get('/me', requireAuth, async (req, res) => {
  const { rows } = await pool.query(
    'SELECT id, username, email, region, created_at FROM users WHERE id = $1',
    [req.user.sub]
  )
  if (!rows[0]) return res.status(404).json({ error: 'User not found' })
  res.json(rows[0])
})

module.exports = router
