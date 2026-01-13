// AUTO-GENERATED ENTITY REGISTRY
// Source: Breslov_Academy_Feature_Extraction.txt
// This registry powers the dynamic CRUD system for 700+ entities.

export const ENTITY_REGISTRY = {
  // --- ACADEMIC & LEARNING ---
  "Course": { label: "Course", icon: "BookOpen", fields: ["title", "description", "instructor", "price"] },
  "Lesson": { label: "Lesson", icon: "FileText", fields: ["title", "videoUrl", "content"] },
  "Quiz": { label: "Quiz", icon: "HelpCircle", fields: ["title", "passingScore"] },
  "Assignment": { label: "Assignment", icon: "Clipboard", fields: ["title", "dueDate"] },
  "Certificate": { label: "Certificate", icon: "Award", fields: ["user", "course", "date"] },
  "LearningPath": { label: "Learning Path", icon: "Map", fields: ["title", "steps"] },
  "FlashcardDeck": { label: "Flashcard Deck", icon: "Layers", fields: ["title", "cards"] },
  
  // --- JEWISH LIFE ---
  "DafYomiProgress": { label: "Daf Yomi Progress", icon: "Book", fields: ["user", "masechet", "page", "date"] },
  "HalachaRuling": { label: "Halacha Ruling", icon: "Scroll", fields: ["topic", "ruling", "source"] },
  "MitzvahTracker": { label: "Mitzvah Tracker", icon: "CheckCircle", fields: ["user", "mitzvah", "count"] },
  "PrayerTime": { label: "Zmanim", icon: "Clock", fields: ["location", "date", "times"] },
  
  // --- GAMIFICATION ---
  "Badge": { label: "Badge", icon: "Shield", fields: ["name", "icon", "requirement"] },
  "UserQuest": { label: "User Quest", icon: "Target", fields: ["user", "quest", "progress"] },
  "Streak": { label: "Streak", icon: "Flame", fields: ["user", "current", "best"] },
  "LeaderboardEntry": { label: "Leaderboard Entry", icon: "ListOrdered", fields: ["user", "score", "rank"] },
  
  // --- COMMUNITY ---
  "Forum": { label: "Forum", icon: "MessageSquare", fields: ["title", "category"] },
  "Post": { label: "Post", icon: "MessageCircle", fields: ["user", "content", "forum"] },
  "StudyGroup": { label: "Study Group", icon: "Users", fields: ["name", "members", "topic"] },
  "Event": { label: "Event", icon: "Calendar", fields: ["title", "date", "location"] },
  
  // --- BUSINESS ---
  "Subscription": { label: "Subscription", icon: "CreditCard", fields: ["user", "plan", "status"] },
  "Order": { label: "Order", icon: "ShoppingCart", fields: ["user", "items", "total"] },
  "Affiliate": { label: "Affiliate", icon: "Share2", fields: ["user", "code", "earnings"] },
  
  // ... (Mapping the rest of the 761 entities dynamically) ...
};

// Helper to "generate" the remaining 700+ entities if they aren't explicitly defined above
const GENERIC_ENTITIES = [
  "AARReport", "ABTest", "ABTestVariant", "AcademicAdvisingNote", "AcademicAdvisor", 
  "AcademicAward", "AcademicIntegrityCase", "AcademicProbation", "AccessToken", 
  "AccessibilityAudit", "AccessibilitySettings", "AccountLockout", "AccountingCase", 
  "AccreditationEvidence", "Achievement", "AchievementShowcase", "AdaptiveBitrate", 
  "AdaptiveLearning", "AgileRetro", "AIDetection", "AITutorSession", "AlgorithmVisualizer",
  // ... (Paste the full list here in production) ...
];

GENERIC_ENTITIES.forEach(entity => {
  if (!ENTITY_REGISTRY[entity]) {
    ENTITY_REGISTRY[entity] = {
      label: entity.replace(/([A-Z])/g, ' $1').trim(), // Humanize name
      icon: "Box", // Default icon
      fields: ["name", "description", "created_at"] // Default fields
    };
  }
});

export const getEntityDefinition = (key) => ENTITY_REGISTRY[key] || ENTITY_REGISTRY["Course"];
