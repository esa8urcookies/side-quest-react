export const CATEGORIES = {
  adventure: { label: 'Adventure', emoji: '🗺️', color: 'orange' },
  social:    { label: 'Social',    emoji: '🤝', color: 'pink' },
  creative:  { label: 'Creative',  emoji: '🎨', color: 'purple' },
  physical:  { label: 'Physical',  emoji: '💪', color: 'green' },
  mental:    { label: 'Mental',    emoji: '🧠', color: 'cyan' },
  random:    { label: 'Random',    emoji: '🎲', color: 'yellow' },
}

export const CATEGORY_STYLES = {
  adventure: {
    badge: 'bg-orange-900/60 text-orange-300 border-orange-700/50',
    border: 'border-orange-700/30',
    glow: 'quest-card-adventure',
    accent: 'text-orange-400',
    button: 'bg-orange-600 hover:bg-orange-500',
    complete: 'bg-orange-700/30 border-orange-600/50 text-orange-300',
  },
  social: {
    badge: 'bg-pink-900/60 text-pink-300 border-pink-700/50',
    border: 'border-pink-700/30',
    glow: 'quest-card-social',
    accent: 'text-pink-400',
    button: 'bg-pink-600 hover:bg-pink-500',
    complete: 'bg-pink-700/30 border-pink-600/50 text-pink-300',
  },
  creative: {
    badge: 'bg-purple-900/60 text-purple-300 border-purple-700/50',
    border: 'border-purple-700/30',
    glow: 'quest-card-creative',
    accent: 'text-purple-400',
    button: 'bg-purple-600 hover:bg-purple-500',
    complete: 'bg-purple-700/30 border-purple-600/50 text-purple-300',
  },
  physical: {
    badge: 'bg-green-900/60 text-green-300 border-green-700/50',
    border: 'border-green-700/30',
    glow: 'quest-card-physical',
    accent: 'text-green-400',
    button: 'bg-green-600 hover:bg-green-500',
    complete: 'bg-green-700/30 border-green-600/50 text-green-300',
  },
  mental: {
    badge: 'bg-cyan-900/60 text-cyan-300 border-cyan-700/50',
    border: 'border-cyan-700/30',
    glow: 'quest-card-mental',
    accent: 'text-cyan-400',
    button: 'bg-cyan-600 hover:bg-cyan-500',
    complete: 'bg-cyan-700/30 border-cyan-600/50 text-cyan-300',
  },
  random: {
    badge: 'bg-yellow-900/60 text-yellow-300 border-yellow-700/50',
    border: 'border-yellow-700/30',
    glow: 'quest-card-random',
    accent: 'text-yellow-400',
    button: 'bg-yellow-600 hover:bg-yellow-500',
    complete: 'bg-yellow-700/30 border-yellow-600/50 text-yellow-300',
  },
}

let _nextId = 100

export function generateId() {
  return `quest-${++_nextId}-${Date.now()}`
}

export const SEED_QUESTS = [
  {
    id: 'sq-001',
    title: 'Explore a New Trail',
    description: 'Venture into the wilderness and discover a hiking trail you have never walked before. Document your journey with at least three photos.',
    category: 'adventure',
    difficulty: 4,
    xp: 100,
  },
  {
    id: 'sq-002',
    title: 'Strike Up a Conversation',
    description: 'Approach a stranger (safely and respectfully) and have a genuine conversation for at least 5 minutes. Learn their name and one interesting fact about them.',
    category: 'social',
    difficulty: 3,
    xp: 75,
  },
  {
    id: 'sq-003',
    title: 'Draw Something from Memory',
    description: 'Without looking at references, draw a detailed portrait of a place or person that is important to you. Take your time and add at least 10 details.',
    category: 'creative',
    difficulty: 2,
    xp: 50,
  },
  {
    id: 'sq-004',
    title: 'Run 5K Without Stopping',
    description: 'Lace up your boots, adventurer. Complete a 5-kilometer run at your own pace without taking a walking break. Track your time to beat it next time.',
    category: 'physical',
    difficulty: 3,
    xp: 75,
  },
  {
    id: 'sq-005',
    title: 'Learn 20 Words in a New Language',
    description: 'Pick any language you do not speak and memorize 20 useful words or phrases. Test yourself by writing them from memory at the end.',
    category: 'mental',
    difficulty: 2,
    xp: 50,
  },
  {
    id: 'sq-006',
    title: 'Cook a Dish from Another Culture',
    description: 'Pick a cuisine from a country you have never cooked from before. Source the ingredients, follow an authentic recipe, and eat your creation.',
    category: 'adventure',
    difficulty: 2,
    xp: 50,
  },
  {
    id: 'sq-007',
    title: 'Host a Game Night',
    description: 'Invite at least 3 friends or family members for a game night you organize. Prepare snacks, choose the games, and make it a memorable evening.',
    category: 'social',
    difficulty: 3,
    xp: 75,
  },
  {
    id: 'sq-008',
    title: 'Write a Short Story',
    description: 'Craft a complete short story of at least 500 words with a beginning, conflict, and resolution. No editing allowed — just write and finish it.',
    category: 'creative',
    difficulty: 4,
    xp: 100,
  },
  {
    id: 'sq-009',
    title: 'Do 100 Push-Ups in a Day',
    description: 'Complete 100 push-ups throughout the day. You can break them into sets — just make sure you hit the full 100 by midnight.',
    category: 'physical',
    difficulty: 3,
    xp: 75,
  },
  {
    id: 'sq-010',
    title: 'Solve 10 Logic Puzzles',
    description: 'Find a logic puzzle app, book, or website and work through 10 puzzles of increasing difficulty. No hints allowed on the last 3.',
    category: 'mental',
    difficulty: 4,
    xp: 100,
  },
  {
    id: 'sq-011',
    title: 'The Mystery Errand',
    description: 'Roll a die (or use random.org): 1-2 = go to a coffee shop you have never visited; 3-4 = visit a local museum or gallery; 5-6 = explore a part of your city you have never been to.',
    category: 'random',
    difficulty: 1,
    xp: 25,
  },
  {
    id: 'sq-012',
    title: 'Summit a Local Peak',
    description: 'Find the highest natural point accessible within 50 km of where you live and reach the top. Mark the achievement and enjoy the view.',
    category: 'adventure',
    difficulty: 5,
    xp: 125,
  },
]
