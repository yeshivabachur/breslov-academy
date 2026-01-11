import { errorResponse, getBearerToken, handleOptions, json, readJson } from '../../_utils.js';
import { createEntity, listEntities, updateEntity } from '../../_store.js';
import { getUserFromToken } from '../../_auth.js';
import { hasMembership, isGlobalAdmin } from '../../_tenancy.js';

const CHALLENGE_TTL_HOURS = 24;
const VERIFICATION_PREFIX = 'breslov-verification';

function nowIso() {
  return new Date().toISOString();
}

function normalizeDomain(domain) {
  return String(domain || '')
    .trim()
    .toLowerCase()
    .replace(/^@/, '')
    .replace(/^https?:\/\//, '')
    .replace(/\/.*$/, '');
}

function isValidDomain(domain) {
  return /^[a-z0-9.-]+\.[a-z]{2,}$/.test(domain);
}

function buildRecordName(domain) {
  return `_breslov-verification.${domain}`;
}

function buildRecordValue(token) {
  return `${VERIFICATION_PREFIX}=${token}`;
}

function buildToken() {
  return crypto.randomUUID().replace(/-/g, '');
}

async function getMembershipRole(env, schoolId, email) {
  if (!schoolId || !email) return null;
  const rows = await listEntities(env, 'SchoolMembership', {
    filters: { school_id: String(schoolId), user_email: String(email) },
    limit: 1,
  });
  return rows?.[0]?.role || null;
}

function isAdminRole(role) {
  const normalized = String(role || '').toUpperCase();
  return ['OWNER', 'ADMIN', 'SUPERADMIN'].includes(normalized);
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
  const rawDomain = payload.domain || '';
  const domain = normalizeDomain(rawDomain);
  const force = payload.force === true;

  if (!schoolId) {
    return errorResponse('missing_school', 400, 'school_id is required', env);
  }
  if (!domain || !isValidDomain(domain)) {
    return errorResponse('invalid_domain', 400, 'Valid domain is required', env);
  }

  const globalAdmin = isGlobalAdmin(user, env);
  if (!globalAdmin) {
    const member = await hasMembership(env, schoolId, user.email);
    if (!member) {
      return errorResponse('forbidden', 403, 'Not authorized for this school', env);
    }
    const role = await getMembershipRole(env, schoolId, user.email);
    if (!isAdminRole(role)) {
      return errorResponse('forbidden', 403, 'Admin role required', env);
    }
  }

  const existing = await listEntities(env, 'DomainVerification', {
    filters: { school_id: String(schoolId), domain },
    limit: 1,
  });
  const record = existing?.[0] || null;

  if (record?.verified_at && !force) {
    return json({
      id: record.id,
      school_id: record.school_id,
      domain,
      status: 'verified',
      verified_at: record.verified_at,
      record_name: buildRecordName(domain),
      record_value: buildRecordValue(record.token || ''),
    }, { env });
  }

  const tokenValue = buildToken();
  const expiresAt = new Date(Date.now() + CHALLENGE_TTL_HOURS * 60 * 60 * 1000).toISOString();
  const payloadUpdate = {
    school_id: String(schoolId),
    domain,
    token: tokenValue,
    status: 'pending',
    requested_by: user.email,
    requested_at: nowIso(),
    expires_at: expiresAt,
    verified_at: null,
  };

  let saved = null;
  if (record?.id) {
    saved = await updateEntity(env, 'DomainVerification', record.id, payloadUpdate);
  } else {
    saved = await createEntity(env, 'DomainVerification', payloadUpdate);
  }

  return json({
    id: saved?.id || record?.id || null,
    school_id: String(schoolId),
    domain,
    status: 'pending',
    expires_at: expiresAt,
    record_name: buildRecordName(domain),
    record_value: buildRecordValue(tokenValue),
  }, { env });
}
