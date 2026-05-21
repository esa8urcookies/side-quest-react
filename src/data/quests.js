// =====================================================
// Quest Data — pools for daily / weekly / monthly
// =====================================================

export const dailyQuests = [
  {
    id: 'd1',
    title: 'Hydration Hero',
    description: 'Drink 8 glasses of water throughout the day. Your body will thank you.',
    difficulty: 1,
    xp: 25,
    category: '💧',
    type: 'daily',
  },
  {
    id: 'd2',
    title: 'Mindful Steps',
    description: 'Take a brisk 15-minute walk outside. Notice three things you haven\'t seen before.',
    difficulty: 1,
    xp: 30,
    category: '🚶',
    type: 'daily',
  },
  {
    id: 'd3',
    title: 'Connection Quest',
    description: 'Call or video-chat a friend or family member you haven\'t spoken to in a while.',
    difficulty: 2,
    xp: 35,
    category: '📞',
    type: 'daily',
  },
  {
    id: 'd4',
    title: 'Gratitude Scroll',
    description: 'Write down 3 things you\'re genuinely grateful for today. Be specific.',
    difficulty: 1,
    xp: 25,
    category: '📝',
    type: 'daily',
  },
  {
    id: 'd5',
    title: 'Push-Up Pledge',
    description: 'Complete 20 push-ups — spread throughout the day or all at once.',
    difficulty: 2,
    xp: 40,
    category: '💪',
    type: 'daily',
  },
  {
    id: 'd6',
    title: 'Home Chef',
    description: 'Cook a meal at home instead of ordering delivery. Extra XP for trying something new.',
    difficulty: 2,
    xp: 35,
    category: '🍳',
    type: 'daily',
  },
  {
    id: 'd7',
    title: 'Page Turner',
    description: 'Read for 20 uninterrupted minutes. No phone, no distractions.',
    difficulty: 1,
    xp: 30,
    category: '📚',
    type: 'daily',
  },
  {
    id: 'd8',
    title: 'Still Mind',
    description: 'Meditate or sit in silence for 5 minutes. Focus on your breathing.',
    difficulty: 1,
    xp: 25,
    category: '🧘',
    type: 'daily',
  },
  {
    id: 'd9',
    title: 'Tidy Domain',
    description: 'Clean and organize one room or area of your living space completely.',
    difficulty: 2,
    xp: 40,
    category: '🧹',
    type: 'daily',
  },
  {
    id: 'd10',
    title: 'Word of the Day',
    description: 'Learn one new word — look up its meaning, origin, and use it in a sentence.',
    difficulty: 1,
    xp: 25,
    category: '📖',
    type: 'daily',
  },
]

export const weeklyQuests = [
  {
    id: 'w1',
    title: 'Road Runner',
    description: 'Run or walk a combined total of 10km this week. Track your progress daily.',
    difficulty: 3,
    xp: 100,
    category: '🏃',
    type: 'weekly',
  },
  {
    id: 'w2',
    title: 'Meal Prep Master',
    description: 'Cook 5 meals at home this week. Plan your meals in advance for bonus discipline.',
    difficulty: 3,
    xp: 90,
    category: '🥗',
    type: 'weekly',
  },
  {
    id: 'w3',
    title: 'Chapter Champion',
    description: 'Read a full chapter of a non-fiction book this week. Take notes on key insights.',
    difficulty: 3,
    xp: 85,
    category: '📚',
    type: 'weekly',
  },
  {
    id: 'w4',
    title: 'Iron Will',
    description: 'Complete 3 dedicated gym or workout sessions this week. Log each one.',
    difficulty: 4,
    xp: 130,
    category: '🏋️',
    type: 'weekly',
  },
  {
    id: 'w5',
    title: 'Creative Spark',
    description: 'Start and complete a creative project — draw, write, build, or craft something.',
    difficulty: 4,
    xp: 120,
    category: '🎨',
    type: 'weekly',
  },
  {
    id: 'w6',
    title: 'Give Back',
    description: 'Volunteer for at least 2 hours at a local org or help someone in your community.',
    difficulty: 3,
    xp: 150,
    category: '🤝',
    type: 'weekly',
  },
  {
    id: 'w7',
    title: 'Digital Detox Day',
    description: 'Spend an entire day without social media. Replace with real-world activities.',
    difficulty: 4,
    xp: 110,
    category: '📵',
    type: 'weekly',
  },
  {
    id: 'w8',
    title: 'Solo Diner',
    description: 'Visit a restaurant you\'ve never been to — alone. Embrace the independence.',
    difficulty: 3,
    xp: 95,
    category: '🍽️',
    type: 'weekly',
  },
]

export const monthlyQuests = [
  {
    id: 'm1',
    title: 'Summit Seeker',
    description: 'Hike a mountain, peak, or significant trail. Reach the top and document it.',
    difficulty: 5,
    xp: 350,
    category: '⛰️',
    type: 'monthly',
  },
  {
    id: 'm2',
    title: 'Solo Expedition',
    description: 'Take a solo day trip to somewhere you\'ve never been before. Explore without a plan.',
    difficulty: 5,
    xp: 300,
    category: '🗺️',
    type: 'monthly',
  },
  {
    id: 'm3',
    title: '30-Day Challenger',
    description: 'Complete any 30-day challenge — fitness, learning, creativity, or habit-building.',
    difficulty: 5,
    xp: 400,
    category: '🏆',
    type: 'monthly',
  },
  {
    id: 'm4',
    title: 'Skill Unlocked',
    description: 'Learn the basics of a new skill this month — an instrument, language, or craft.',
    difficulty: 5,
    xp: 275,
    category: '🎓',
    type: 'monthly',
  },
  {
    id: 'm5',
    title: 'Community Architect',
    description: 'Organize a community event — a cleanup, game night, potluck, or meetup.',
    difficulty: 5,
    xp: 380,
    category: '🏡',
    type: 'monthly',
  },
  {
    id: 'm6',
    title: 'Full Detox Weekend',
    description: 'Spend an entire weekend offline — no internet, no screens. Journal the experience.',
    difficulty: 5,
    xp: 320,
    category: '🌿',
    type: 'monthly',
  },
]

// Helper to get quests by ids
export function getQuestsByIds(ids) {
  const all = [...dailyQuests, ...weeklyQuests, ...monthlyQuests]
  return ids.map(id => all.find(q => q.id === id)).filter(Boolean)
}

// Pick N random quests from a pool, excluding recently completed ones
export function pickRandom(pool, count, excludeIds = []) {
  const available = pool.filter(q => !excludeIds.includes(q.id))
  const source = available.length >= count ? available : pool
  const shuffled = [...source].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count).map(q => q.id)
}
