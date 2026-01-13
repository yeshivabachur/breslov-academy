import { v4 as uuidv4 } from 'uuid';

// Initial Seed Data to make the app look populated
const SEED_DATA = {
  users: [
    { id: 'u1', name: 'User', email: 'user@breslov.academy', xp: 1250, streak: 5, coins: 500 }
  ],
  forum_topics: [
    { id: 't1', title: 'Understanding Likutey Moharan I:6', category: 'Torah', author: 'Yossi', votes: 15, replies: 4, views: 120, timestamp: Date.now() - 3600000 },
    { id: 't2', title: 'Study partner for morning Seder?', category: 'Chavruta', author: 'David', votes: 8, replies: 2, views: 45, timestamp: Date.now() - 86400000 },
  ],
  daf_progress: {
    // 'masechet-daf': boolean
  },
  inventory: [],
  notifications: []
};

// Low-level DB access
const getDB = () => {
  try {
    const db = localStorage.getItem('ba_local_db');
    return db ? JSON.parse(db) : SEED_DATA;
  } catch {
    return SEED_DATA;
  }
};

const saveDB = (data) => {
  localStorage.setItem('ba_local_db', JSON.stringify(data));
};

// Generic CRUD
export const db = {
  // --- USER ---
  getUser: () => getDB().users[0],
  
  updateUser: (updates) => {
    const data = getDB();
    data.users[0] = { ...data.users[0], ...updates };
    saveDB(data);
    return data.users[0];
  },

  addXP: (amount) => {
    const data = getDB();
    data.users[0].xp += amount;
    saveDB(data);
    return data.users[0];
  },

  spendCoins: (amount) => {
    const data = getDB();
    if (data.users[0].coins < amount) throw new Error("Insufficient funds");
    data.users[0].coins -= amount;
    saveDB(data);
    return data.users[0];
  },

  // --- FORUM ---
  getTopics: () => getDB().forum_topics,
  
  addTopic: (topic) => {
    const data = getDB();
    const newTopic = { 
      id: uuidv4(), 
      timestamp: Date.now(), 
      votes: 0, 
      replies: 0, 
      views: 0, 
      ...topic 
    };
    data.forum_topics.unshift(newTopic);
    saveDB(data);
    return newTopic;
  },

  upvoteTopic: (id) => {
    const data = getDB();
    const topic = data.forum_topics.find(t => t.id === id);
    if (topic) {
      topic.votes += 1;
      saveDB(data);
    }
    return topic;
  },

  // --- DAF YOMI ---
  getDafProgress: (masechet, daf) => {
    const key = `${masechet}-${daf}`;
    return getDB().daf_progress[key] || false;
  },

  markDaf: (masechet, daf, isDone = true) => {
    const data = getDB();
    const key = `${masechet}-${daf}`;
    data.daf_progress[key] = isDone;
    if (isDone) {
        data.users[0].xp += 50; // Bonus for learning
    }
    saveDB(data);
    return isDone;
  },

  // --- SHOP ---
  buyItem: (item) => {
    const data = getDB();
    if (data.users[0].coins < item.cost) return false;
    
    data.users[0].coins -= item.cost;
    data.inventory.push({ ...item, purchasedAt: Date.now() });
    saveDB(data);
    return true;
  },

  getInventory: () => getDB().inventory,

  // --- GENERIC ENTITY (Universal Page) ---
  list: (collection) => {
    const data = getDB();
    return data[collection] || [];
  },
  
  create: (collection, item) => {
    const data = getDB();
    if (!data[collection]) data[collection] = [];
    const newItem = { id: uuidv4(), created_at: Date.now(), ...item };
    data[collection].push(newItem);
    saveDB(data);
    return newItem;
  },

  delete: (collection, id) => {
    const data = getDB();
    if (!data[collection]) return;
    data[collection] = data[collection].filter(i => i.id !== id);
    saveDB(data);
  }
};
