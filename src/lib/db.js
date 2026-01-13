import { base44 } from '@/api/base44Client';

// Helper to handle API vs Local
const api = base44.entities;

export const db = {
  // --- USER ---
  getUser: async () => {
    try {
      return await base44.auth.me();
    } catch {
      return null;
    }
  },
  
  updateUser: async (updates) => {
    const user = await base44.auth.me();
    if (!user) return null;
    // User profile is often read-only via auth/me, so we might need a UserProfile entity
    // For now, we'll assume we update a 'UserProfile' entity linked to email
    const profiles = await api.UserProfile.filter({ email: user.email });
    if (profiles.length > 0) {
      return api.UserProfile.update(profiles[0].id, updates);
    }
    return api.UserProfile.create({ email: user.email, ...updates });
  },

  addXP: async (amount) => {
    const user = await base44.auth.me();
    if (!user) return;
    // Record XP transaction
    await api.XpTransaction.create({ amount, user_email: user.email, timestamp: Date.now() });
    
    // Update aggregate profile
    const profiles = await api.UserProfile.filter({ email: user.email });
    let profile = profiles[0];
    if (!profile) {
      profile = await api.UserProfile.create({ email: user.email, xp: 0, coins: 0 });
    }
    await api.UserProfile.update(profile.id, { xp: (profile.xp || 0) + amount });
    return profile;
  },

  // --- FORUM ---
  getTopics: async () => {
    return api.ForumTopic.list('-timestamp', 50);
  },
  
  addTopic: async (topic) => {
    const user = await base44.auth.me();
    return api.ForumTopic.create({
      ...topic,
      author: user ? (user.name || user.email) : 'Anonymous',
      timestamp: Date.now(),
      votes: 0,
      replies: 0,
      views: 0
    });
  },

  // --- DAF YOMI ---
  getDafProgress: async (masechet, daf) => {
    const user = await base44.auth.me();
    if (!user) return false;
    const rows = await api.DafProgress.filter({ 
      user_email: user.email,
      masechet, 
      daf: String(daf) 
    });
    return rows.length > 0;
  },

  markDaf: async (masechet, daf, isDone = true) => {
    const user = await base44.auth.me();
    if (!user) return;
    
    if (isDone) {
      await api.DafProgress.create({
        user_email: user.email,
        masechet,
        daf: String(daf),
        timestamp: Date.now()
      });
      // Add Bonus XP
      await db.addXP(50);
    }
  },

  // --- SHOP ---
  buyItem: async (item) => {
    const user = await base44.auth.me();
    if (!user) return false;
    
    const profiles = await api.UserProfile.filter({ email: user.email });
    let profile = profiles[0];
    if (!profile) profile = await api.UserProfile.create({ email: user.email, coins: 500 }); // Bonus for new users

    if ((profile.coins || 0) < item.cost) return false;

    // Deduct coins
    await api.UserProfile.update(profile.id, { coins: profile.coins - item.cost });
    
    // Add to inventory
    await api.InventoryItem.create({
      user_email: user.email,
      item_id: item.id,
      name: item.name,
      purchased_at: Date.now()
    });
    
    return true;
  },

  // --- GENERIC ---
  list: async (entity) => api[entity].list(),
  create: async (entity, data) => api[entity].create(data),
  delete: async (entity, id) => api[entity].delete(id),
};