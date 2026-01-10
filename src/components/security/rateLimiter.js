import { base44 } from '@/api/base44Client';

const LIMITS = {
  login: { max: 5, windowSeconds: 60 },
  checkout: { max: 3, windowSeconds: 60 },
  download: { max: 10, windowSeconds: 60 * 5 }, // 10 downloads per 5 mins
  ai_tutor: { max: 20, windowSeconds: 60 * 60 }, // 20 requests per hour
};

const buckets = new Map(); // key -> { count, expiresAt }

function getKey(action, identifier) {
  return `${action}:${identifier}`;
}

function cleanupBuckets() {
  const now = Date.now();
  for (const [key, bucket] of buckets.entries()) {
    if (now > bucket.expiresAt) {
      buckets.delete(key);
    }
  }
}

// Cleanup every minute
setInterval(cleanupBuckets, 60 * 1000);

/**
 * Check if action is allowed for user/ip.
 * @param {string} action - 'login' | 'checkout' | 'download' | 'ai_tutor'
 * @param {string} identifier - user email or session id
 * @param {string} schoolId - context for logging
 * @returns {Promise<{allowed: boolean, remaining: number}>}
 */
export async function checkRateLimit(action, identifier, schoolId = null) {
  if (!LIMITS[action]) return { allowed: true, remaining: 999 };

  const { max, windowSeconds } = LIMITS[action];
  const key = getKey(action, identifier);
  const now = Date.now();

  let bucket = buckets.get(key);

  if (!bucket || now > bucket.expiresAt) {
    bucket = { count: 0, expiresAt: now + (windowSeconds * 1000) };
  }

  bucket.count += 1;
  buckets.set(key, bucket);

  const allowed = bucket.count <= max;

  if (!allowed && schoolId && bucket.count === max + 1) {
    // Log violation once per window overflow
    try {
      await base44.entities.RateLimitLog.create({
        school_id: schoolId,
        user_email: identifier.includes('@') ? identifier : null,
        action,
        count: bucket.count,
        window_seconds: windowSeconds
      });
    } catch (e) {
      // Best effort logging
    }
  }

  return {
    allowed,
    remaining: Math.max(0, max - bucket.count)
  };
}
