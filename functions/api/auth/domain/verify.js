import { errorResponse, getBearerToken, handleOptions, json, readJson } from '../../_utils.js';
import { listEntities, updateEntity } from '../../_store.js';
import { getUserFromToken } from '../../_auth.js';
import { hasMembership, isGlobalAdmin } from '../../_tenancy.js';

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

async function fetchTxtRecords(name) {
  const url = new URL('https://cloudflare-dns.com/dns-query');
  url.searchParams.set('name', name);
  url.searchParams.set('type', 'TXT');
  const response = await fetch(url.toString(), {
    headers: { Accept: 'application/dns-json' },
  });
  if (!response.ok) {
    const error = new Error(`DNS lookup failed (${response.status})`);
    error.status = response.status;
    throw error;
  }
  const data = await response.json();
  const answers = Array.isArray(data?.Answer) ? data.Answer : [];
  return answers.map((entry) => String(entry.data || '').replace(/\"/g, ''));
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

  const records = await listEntities(env, 'DomainVerification', {
    filters: { school_id: String(schoolId), domain },
    limit: 1,
  });
  const record = records?.[0];
  if (!record?.id || !record.token) {
    return errorResponse('no_challenge', 404, 'Verification challenge not found', env);
  }

  const recordName = buildRecordName(domain);
  let txtRecords = [];
  try {
    txtRecords = await fetchTxtRecords(recordName);
  } catch (error) {
    return errorResponse('dns_lookup_failed', error.status || 502, error.message, env);
  }

  const expected = `${VERIFICATION_PREFIX}=${record.token}`;
  const found = txtRecords.some((value) => value.includes(expected));

  if (!found) {
    return json({
      verified: false,
      status: 'pending',
      domain,
      record_name: recordName,
      record_value: expected,
    }, { env });
  }

  await updateEntity(env, 'DomainVerification', record.id, {
    status: 'verified',
    verified_at: nowIso(),
  });

  return json({
    verified: true,
    status: 'verified',
    domain,
    verified_at: nowIso(),
  }, { env });
}
