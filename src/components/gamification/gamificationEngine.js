// Gamification Logic & Constants

export const RANKS = [
  { name: 'Initiate', minXP: 0, color: 'text-slate-600', icon: '🌱' },
  { name: 'Student', minXP: 1000, color: 'text-blue-600', icon: 'book' },
  { name: 'Scholar', minXP: 5000, color: 'text-indigo-600', icon: 'graduation-cap' },
  { name: 'Sage', minXP: 15000, color: 'text-purple-600', icon: 'scroll' },
  { name: 'Master', minXP: 50000, color: 'text-amber-600', icon: 'crown' },
  { name: 'Tzadik', minXP: 100000, color: 'text-emerald-600', icon: 'sun' }
];

export const BADGES = [
  { id: 'daf-1', label: 'First Daf', description: 'Complete your first Daf Yomi', icon: 'book-open', tier: 'bronze' },
  { id: 'streak-7', label: 'Week Warrior', description: '7-day learning streak', icon: 'flame', tier: 'silver' },
  { id: 'early-riser', label: 'Vatikin', description: 'Learn at sunrise (Netz)', icon: 'sunrise', tier: 'gold' },
  { id: 'social-butterfly', label: 'Chavruta', description: 'Join a study group', icon: 'users', tier: 'bronze' },
  { id: 'quiz-master', label: 'Quiz Master', description: 'Score 100% on 5 quizzes', icon: 'trophy', tier: 'gold' }
];

export function getRank(xp) {
  return RANKS.slice().reverse().find(r => xp >= r.minXP) || RANKS[0];
}

export function getNextRank(xp) {
  const current = getRank(xp);
  const next = RANKS.find(r => r.minXP > xp);
  return next ? { ...next, progress: ((xp - current.minXP) / (next.minXP - current.minXP)) * 100 } : null;
}

export function formatXP(xp) {
  return new Intl.NumberFormat('en-US').format(xp);
}
