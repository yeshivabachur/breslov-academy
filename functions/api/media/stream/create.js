import { errorResponse, getBearerToken, handleOptions, json, readJson } from '../../_utils.js';
import { createEntity, listEntities } from '../../_store.js';
import { getUserFromToken } from '../../_auth.js';
import { hasMembership, isGlobalAdmin } from '../../_tenancy.js';

function nowIso() {
  return new Date().toISOString();
}

function getStreamConfig(env) {
  const accountId = env?.CLOUDFLARE_ACCOUNT_ID || '';
  const token = env?.CLOUDFLARE_STREAM_TOKEN || '';
  if (!accountId || !token) return null;
  return { accountId, token };
}

async function getMembershipRole(env, schoolId, email) {
  if (!schoolId || !email) return null;
  const rows = await listEntities(env, 'SchoolMembership', {
    filters: { school_id: String(schoolId), user_email: String(email) },
    limit: 1,
  });
  return rows?.[0]?.role || null;
}

function isTeacherRole(role) {
  const normalized = String(role || '').toUpperCase();
  return ['OWNER', 'ADMIN', 'INSTRUCTOR', 'TEACHER', 'TA', 'RAV', 'RABBI'].includes(normalized);
}

export async function onRequest({ request, env }) {
  const options = handleOptions(request, env);
  if (options) return options;

  if (request.method !== 'POST') {
    return errorResponse('method_not_allowed', 405, 'Method not allowed', env);
  }

  const token = getBearerToken(request);
  const user = await getUserFromToken(token, env);
  if (!user?.email) {
    return errorResponse('auth_required', 401, 'Authentication required', env);
  }

  const payload = await readJson(request);
  if (!payload) {
    return errorResponse('invalid_payload', 400, 'Expected JSON body', env);
  }

  const schoolId = payload.school_id || payload.schoolId;
  if (!schoolId) {
    return errorResponse('missing_school', 400, 'school_id is required', env);
  }

  const globalAdmin = isGlobalAdmin(user, env);
  if (!globalAdmin) {
    const member = await hasMembership(env, schoolId, user.email);
    if (!member) {
      return errorResponse('forbidden', 403, 'Not authorized for this school', env);
    }
    const role = await getMembershipRole(env, schoolId, user.email);
    if (!isTeacherRole(role)) {
      return errorResponse('forbidden', 403, 'Teacher role required', env);
    }
  }

  const config = getStreamConfig(env);
  if (!config) {
    return errorResponse('not_configured', 500, 'Cloudflare Stream credentials not configured', env);
  }

  const requestBody = {
    maxDurationSeconds: payload.max_duration_seconds || 7200,
    expiry: payload.expires_at || new Date(Date.now() + 60 * 60 * 1000).toISOString(),
    requireSignedURLs: payload.require_signed_urls === true,
    meta: {
      school_id: String(schoolId),
      lesson_id: payload.lesson_id || null,
      course_id: payload.course_id || null,
      uploaded_by: user.email,
    },
  };

  const response = await fetch(`https://api.cloudflare.com/client/v4/accounts/${config.accountId}/stream/direct_upload`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${config.token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  });

  const data = await response.json().catch(() => null);
  if (!response.ok || data?.success !== true) {
    return errorResponse('stream_error', response.status || 500, data?.errors?.[0]?.message || 'Stream upload failed', env);
  }

  const result = data?.result || {};
  const uploadRecord = await createEntity(env, 'StreamUpload', {
    school_id: String(schoolId),
    stream_uid: result.uid,
    upload_url: result.uploadURL,
    expires_at: result.expiry,
    created_at: nowIso(),
    created_by: user.email,
    lesson_id: payload.lesson_id || null,
    course_id: payload.course_id || null,
    status: 'pending',
  });

  return json({
    upload_url: result.uploadURL,
    stream_uid: result.uid,
    expires_at: result.expiry,
    record_id: uploadRecord?.id || null,
  }, { env });
}
