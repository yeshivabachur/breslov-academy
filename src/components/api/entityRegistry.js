// ENTERPRISE ENTITY REGISTRY
// Powered by Zod for runtime validation and automatic UI generation.
import { z } from 'zod';

// --- SCHEMA DEFINITIONS ---

const UserSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  role: z.enum(['student', 'teacher', 'admin', 'superadmin']).default('student'),
  xp: z.number().default(0),
  coins: z.number().default(0),
  streak: z.number().default(0),
  last_login: z.number().optional()
});

const CourseSchema = z.object({
  title: z.string().min(5, "Title must be descriptive"),
  description: z.string().optional(),
  instructor_id: z.string().uuid("Invalid Instructor ID"),
  price: z.number().min(0, "Price cannot be negative"),
  is_published: z.boolean().default(false),
  tags: z.array(z.string()).default([]),
  level: z.enum(['beginner', 'intermediate', 'advanced']).default('beginner')
});

const LessonSchema = z.object({
  course_id: z.string().uuid(),
  title: z.string().min(3),
  video_url: z.string().url("Must be a valid URL").optional().or(z.literal('')),
  content_markdown: z.string().optional(),
  order_index: z.number().int()
});

const ForumTopicSchema = z.object({
  title: z.string().min(5),
  category: z.enum(['General', 'Torah', 'Advice', 'Social']),
  author_id: z.string(),
  is_pinned: z.boolean().default(false),
  is_locked: z.boolean().default(false)
});

// --- REGISTRY CONFIGURATION ---

export const ENTITY_REGISTRY = {
  // ACADEMIC
  "Course": { 
    label: "Course", 
    icon: "BookOpen", 
    schema: CourseSchema,
    listFields: ["title", "price", "level", "is_published"],
    relationships: [
      { target: "Lesson", foreignKey: "course_id", label: "Lessons" },
      { target: "Enrollment", foreignKey: "course_id", label: "Students" }
    ]
  },
  "Lesson": { 
    label: "Lesson", 
    icon: "FileText", 
    schema: LessonSchema,
    listFields: ["title", "order_index"],
    parent: "Course"
  },
  
  // USERS & GAMIFICATION
  "User": {
    label: "User",
    icon: "User",
    schema: UserSchema,
    listFields: ["name", "email", "role", "xp"]
  },
  "Badge": {
    label: "Badge",
    icon: "Shield",
    schema: z.object({
      name: z.string(),
      icon_key: z.string(),
      xp_bonus: z.number()
    }),
    listFields: ["name", "xp_bonus"]
  },

  // JEWISH LIFE
  "HalachaRuling": {
    label: "Halacha Ruling",
    icon: "Scroll",
    schema: z.object({
      topic: z.string(),
      ruling_text: z.string(),
      source_ref: z.string()
    }),
    listFields: ["topic", "source_ref"]
  },
  
  // COMMUNITY
  "ForumTopic": {
    label: "Forum Topic",
    icon: "MessageSquare",
    schema: ForumTopicSchema,
    listFields: ["title", "category", "is_pinned"],
    relationships: [
      { target: "ForumPost", foreignKey: "topic_id", label: "Posts" }
    ]
  }
};

// Fallback for the other 700+ entities to ensure the app doesn't crash
// while maintaining the "Harder" standard for the core ones.
export const getEntityDefinition = (key) => {
  if (ENTITY_REGISTRY[key]) return ENTITY_REGISTRY[key];
  
  // Generative fallback
  return {
    label: key.replace(/([A-Z])/g, ' $1').trim(),
    icon: "Box",
    schema: z.object({
      name: z.string().optional(),
      description: z.string().optional()
    }),
    listFields: ["name", "created_at"],
    isGeneric: true
  };
};