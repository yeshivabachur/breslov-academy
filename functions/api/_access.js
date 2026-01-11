import { listEntities } from './_store.js';

const STAFF_ROLES = new Set(['OWNER', 'ADMIN', 'INSTRUCTOR', 'TEACHER', 'TA', 'RAV', 'RABBI', 'SUPERADMIN']);
const DEFAULT_POLICY = {
  allow_previews: true,
  max_preview_seconds: 90,
  max_preview_chars: 1500,
};

function parseDateSafe(value) {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.valueOf()) ? null : date;
}

function normalizeEntitlementType(entitlement) {
  return String(entitlement?.type || entitlement?.entitlement_type || '').toUpperCase();
}

function isEntitlementActive(entitlement, now = new Date()) {
  if (!entitlement) return false;
  if (String(entitlement.status || '').toLowerCase() === 'revoked') return false;
  const startsAt = parseDateSafe(entitlement.starts_at || entitlement.start_date || entitlement.created_date);
  const endsAt = parseDateSafe(entitlement.ends_at || entitlement.expires_at || entitlement.end_date);
  if (startsAt && startsAt > now) return false;
  if (endsAt && endsAt <= now) return false;
  return true;
}

async function getMembership(env, schoolId, email) {
  if (!schoolId || !email) return null;
  const rows = await listEntities(env, 'SchoolMembership', {
    filters: { school_id: String(schoolId), user_email: String(email) },
    limit: 1,
  });
  return rows?.[0] || null;
}

function isStaffRole(role) {
  return STAFF_ROLES.has(String(role || '').toUpperCase());
}

async function getPolicy(env, schoolId) {
  if (!schoolId) return DEFAULT_POLICY;
  const rows = await listEntities(env, 'ContentProtectionPolicy', {
    filters: { school_id: String(schoolId) },
    limit: 1,
  });
  return rows?.[0] || DEFAULT_POLICY;
}

async function getActiveEntitlements(env, schoolId, email) {
  if (!schoolId || !email) return [];
  const rows = await listEntities(env, 'Entitlement', {
    filters: { school_id: String(schoolId), user_email: String(email) },
    limit: 500,
  });
  const now = new Date();
  return (rows || []).filter((ent) => isEntitlementActive(ent, now));
}

function hasCourseAccess(entitlements, courseId) {
  if (!courseId) return false;
  const cid = String(courseId);
  return entitlements.some((ent) => {
    const type = normalizeEntitlementType(ent);
    if (type === 'ALL_COURSES') return true;
    return type === 'COURSE' && String(ent.course_id) === cid;
  });
}

async function buildCourseMap(env, schoolId, lessons) {
  const map = new Map();
  const ids = new Set((lessons || []).map((lesson) => lesson?.course_id).filter(Boolean));
  for (const id of ids) {
    const rows = await listEntities(env, 'Course', {
      filters: { school_id: String(schoolId), id: String(id) },
      limit: 1,
    });
    if (rows?.[0]) {
      map.set(String(id), rows[0]);
    }
  }
  return map;
}

function isCourseFree(course) {
  if (!course) return false;
  const level = String(course.access_level || '').toUpperCase();
  if (level === 'FREE' || level === 'PUBLIC') return true;
  if (String(course.access_tier || '').toLowerCase() === 'free') return true;
  return false;
}

function getEnrollDate(entitlements, courseId) {
  const cid = String(courseId || '');
  const dates = (entitlements || [])
    .filter((ent) => {
      const type = normalizeEntitlementType(ent);
      return type === 'ALL_COURSES' || (type === 'COURSE' && String(ent.course_id) === cid);
    })
    .map((ent) => parseDateSafe(ent.created_date || ent.starts_at))
    .filter(Boolean)
    .sort((a, b) => a - b);
  return dates[0] || null;
}

function computeDripLock(lesson, enrollDate, now = new Date()) {
  if (!lesson || !enrollDate) return { locked: false };
  const publishAt = parseDateSafe(lesson.drip_publish_at);
  if (publishAt && publishAt > now) {
    return { locked: true, availableAt: publishAt };
  }
  if (lesson.drip_days_after_enroll) {
    const availableAt = new Date(enrollDate);
    availableAt.setDate(availableAt.getDate() + Number(lesson.drip_days_after_enroll));
    if (availableAt > now) {
      return { locked: true, availableAt };
    }
  }
  return { locked: false };
}

function truncateString(value, maxChars) {
  if (typeof value !== 'string') return value;
  if (!maxChars || value.length <= maxChars) return value;
  return `${value.slice(0, maxChars)}...`;
}

function sanitizeLesson(lesson, access, policy, previewChars) {
  if (!lesson || typeof lesson !== 'object') return lesson;
  const safe = { ...lesson };

  if (access === 'LOCKED' || access === 'DRIP_LOCKED') {
    ['content', 'content_json', 'text', 'content_text', 'body'].forEach((key) => {
      if (key in safe) safe[key] = null;
    });
    if ('video_url' in safe) safe.video_url = null;
    if ('audio_url' in safe) safe.audio_url = null;
    return safe;
  }

  if (access === 'PREVIEW') {
    const maxChars = Math.min(
      Number.isFinite(previewChars) && previewChars > 0 ? previewChars : policy?.max_preview_chars || DEFAULT_POLICY.max_preview_chars,
      policy?.max_preview_chars || DEFAULT_POLICY.max_preview_chars,
    );
    ['content', 'content_json', 'text', 'content_text', 'body'].forEach((key) => {
      if (key in safe) safe[key] = truncateString(safe[key], maxChars);
    });
    return safe;
  }

  return safe;
}

export async function applyLessonAccess({ env, schoolId, userEmail, lessons = [], previewChars = null }) {
  if (!Array.isArray(lessons) || lessons.length === 0) return lessons;
  const policy = await getPolicy(env, schoolId);
  const membership = await getMembership(env, schoolId, userEmail);
  const staff = isStaffRole(membership?.role);
  if (staff) return lessons;

  const entitlements = await getActiveEntitlements(env, schoolId, userEmail);
  const courseMap = await buildCourseMap(env, schoolId, lessons);

  return lessons.map((lesson) => {
    const course = courseMap.get(String(lesson.course_id || '')) || null;
    const courseAccess = isCourseFree(course) || hasCourseAccess(entitlements, lesson.course_id);
    let access = 'LOCKED';
    if (courseAccess) access = 'FULL';
    else if (policy?.allow_previews && lesson?.is_preview) access = 'PREVIEW';

    if (access === 'FULL') {
      const enrollDate = getEnrollDate(entitlements, lesson.course_id);
      const drip = computeDripLock(lesson, enrollDate);
      if (drip.locked) {
        access = 'DRIP_LOCKED';
      }
    }

    return sanitizeLesson(lesson, access, policy, previewChars);
  });
}

function projectFields(record, fields) {
  if (!fields || fields.length === 0) return record;
  const allow = new Set(fields.map((field) => String(field)));
  allow.add('id');
  if (record?.school_id) allow.add('school_id');
  if (record?.user_email) allow.add('user_email');
  const out = {};
  allow.forEach((key) => {
    if (record && Object.prototype.hasOwnProperty.call(record, key)) {
      out[key] = record[key];
    }
  });
  return out;
}

export function applyFieldProjection(records, fields) {
  if (!fields || fields.length === 0) return records;
  if (Array.isArray(records)) {
    return records.map((record) => projectFields(record, fields));
  }
  return projectFields(records, fields);
}

async function getQuizMeta(env, schoolId, quizId) {
  if (!schoolId || !quizId) return null;
  const rows = await listEntities(env, 'Quiz', {
    filters: { school_id: String(schoolId), id: String(quizId) },
    limit: 1,
  });
  return rows?.[0] || null;
}

async function getCourse(env, schoolId, courseId) {
  if (!schoolId || !courseId) return null;
  const rows = await listEntities(env, 'Course', {
    filters: { school_id: String(schoolId), id: String(courseId) },
    limit: 1,
  });
  return rows?.[0] || null;
}

function resolveQuizAccess({ quiz, entitlements, staff, course }) {
  if (!quiz) return 'LOCKED';
  if (staff) return 'FULL';
  if (!quiz.course_id) return 'FULL';
  const courseAccess = isCourseFree(course) || hasCourseAccess(entitlements, quiz.course_id);
  if (courseAccess) return 'FULL';
  const previewLimit = Number(quiz.preview_limit_questions || 0);
  return previewLimit > 0 ? 'PREVIEW' : 'LOCKED';
}

export async function applyQuizQuestionAccess({ env, schoolId, userEmail, questions = [] }) {
  if (!Array.isArray(questions) || questions.length === 0) return questions;
  const membership = await getMembership(env, schoolId, userEmail);
  const staff = isStaffRole(membership?.role);
  if (staff) return questions;

  const entitlements = await getActiveEntitlements(env, schoolId, userEmail);
  const grouped = new Map();

  questions.forEach((question) => {
    const quizId = question?.quiz_id || question?.quizId || null;
    if (!quizId) return;
    if (!grouped.has(quizId)) grouped.set(quizId, []);
    grouped.get(quizId).push(question);
  });

  const allowedQuestions = [];
  for (const [quizId, list] of grouped.entries()) {
    const quiz = await getQuizMeta(env, schoolId, quizId);
    const course = quiz?.course_id ? await getCourse(env, schoolId, quiz.course_id) : null;
    const access = resolveQuizAccess({ quiz, entitlements, staff, course });
    if (access === 'LOCKED') continue;
    const sorted = [...list].sort((a, b) => (a?.question_index ?? 0) - (b?.question_index ?? 0));
    if (access === 'PREVIEW') {
      const limit = Math.max(0, Number(quiz?.preview_limit_questions || 0));
      allowedQuestions.push(...sorted.slice(0, limit || 0));
    } else {
      allowedQuestions.push(...sorted);
    }
  }

  return allowedQuestions;
}
