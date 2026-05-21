-- Side Quest V2 — PostgreSQL Schema

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ── Users ─────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username    VARCHAR(24) UNIQUE NOT NULL,
  email       VARCHAR(255) UNIQUE NOT NULL,
  password    VARCHAR(255) NOT NULL,
  region      VARCHAR(64) NOT NULL DEFAULT 'North America',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Profiles ──────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS profiles (
  user_id       UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  age           SMALLINT,
  weight_range  VARCHAR(32),
  personality   VARCHAR(16),   -- introvert | ambivert | extrovert
  fitness_level VARCHAR(16),   -- beginner | intermediate | advanced
  interests     TEXT[],        -- {outdoors,social,creative,...}
  rpg_class     VARCHAR(32),
  level         SMALLINT NOT NULL DEFAULT 1,
  xp            INTEGER NOT NULL DEFAULT 0,
  str           SMALLINT NOT NULL DEFAULT 5,
  dex           SMALLINT NOT NULL DEFAULT 5,
  int           SMALLINT NOT NULL DEFAULT 5,
  cha           SMALLINT NOT NULL DEFAULT 5,
  wis           SMALLINT NOT NULL DEFAULT 5,
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Quest completions ─────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS quest_completions (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  quest_id     VARCHAR(16) NOT NULL,
  quest_type   VARCHAR(8)  NOT NULL,   -- daily | weekly | monthly
  xp_earned    SMALLINT NOT NULL DEFAULT 0,
  completed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_completions_user ON quest_completions(user_id);
CREATE INDEX IF NOT EXISTS idx_completions_quest ON quest_completions(quest_id);

-- ── Active quests (accepted but not yet completed) ────────────────────────────
CREATE TABLE IF NOT EXISTS active_quests (
  user_id   UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  quest_id  VARCHAR(16) NOT NULL,
  accepted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, quest_id)
);

-- ── Leaderboard view ──────────────────────────────────────────────────────────
CREATE OR REPLACE VIEW leaderboard AS
  SELECT
    u.id,
    u.username,
    u.region,
    p.rpg_class,
    p.level,
    p.xp,
    (p.level * 100 + p.xp) AS total_score,
    COUNT(qc.id)::INT       AS quests_completed
  FROM users u
  JOIN profiles p ON p.user_id = u.id
  LEFT JOIN quest_completions qc ON qc.user_id = u.id
  GROUP BY u.id, u.username, u.region, p.rpg_class, p.level, p.xp
  ORDER BY total_score DESC;
