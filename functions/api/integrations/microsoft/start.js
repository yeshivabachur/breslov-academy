import { errorResponse, getBearerToken, handleOptions, withHeaders } from '../../_utils.js';
import { createEntity, listEntities } from '../../_store.js';
import { getUserFromToken } from '../../_auth.js';
import { hasMembership, isGlobalAdmin } from '../../_tenancy.js';

const STATE_TTL_MINUTES = 10;

const PROVIDERS = {
  onedrive: {
    id: 'microsoft_onedrive',
    scopes: [
      'openid',
      'offline_access',
      'User.Read',
      'Files.ReadWrite.All',
      'Sites.Read.All',
    ],
  },
};

function nowIso() {
  return new Date().toISOString();
}

function normalizeProvider(raw) {
  const value = String(raw || '').toLowerCase();
  if (value.includes('drive') || value.includes('onedrive') || value.includes('sharepoint')) {
    return 'onedrive';
  }
  return null;
}

function getTenant(env) {
  return String(env?.MICROSOFT_GRAPH_TENANT || 'common');
}

function getConfig(env, origin) {
  const clientId = env?.MICROSOFT_GRAPH_CLIENT_ID || '';
  const clientSecret = env?.MICROSOFT_GRAPH_CLIENT_SECRET || '';
  if (!clientId || !clientSecret) return null;
  const redirectUri = env?.MICROSOFT_GRAPH_REDIRECT_URI || new URL('/api/integrations/microsoft/callback', origin).toString();
  return { clientId, clientSecret, redirectUri };
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

function normalizeNext(next, origin) {
  if (!next) return new URL('/admin?tab=integrations', origin).toString();
  try {
    const url = new URL(next, origin);
    if (url.origin !== origin) return new URL('/admin?tab=integrations', origin).toString();
    return url.toString();
  } catch {
    return new URL('/admin?tab=integrations', origin).toString();
  }
}

export async function onRequest({ request, env }) {
  const options = handleOptions(request, env);
  if (options) return options;

  if (request.method !== 'GET') {
    return errorResponse('method_not_allowed', 405, 'Method not allowed', env);
  }

  const token = getBearerToken(request);
  const user = await getUserFromToken(token, env);
  if (!user?.email) {
    return errorResponse('auth_required', 401, 'Authentication required', env);
  }

  const url = new URL(request.url);
  const schoolId = url.searchParams.get('school_id') || url.searchParams.get('schoolId');
  const rawProvider = url.searchParams.get('provider');
  const providerKey = normalizeProvider(rawProvider);
  const nextUrl = normalizeNext(url.searchParams.get('return_url') || url.searchParams.get('next'), url.origin);

  if (!schoolId) {
    return errorResponse('missing_school', 400, 'school_id is required', env);
  }
  if (!providerKey || !PROVIDERS[providerKey]) {
    return errorResponse('invalid_provider', 400, 'Unsupported provider', env);
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

  const config = getConfig(env, url.origin);
  if (!config) {
    return errorResponse('not_configured', 500, 'Microsoft integration credentials not configured', env);
  }

  const state = crypto.randomUUID();
  const expiresAt = new Date(Date.now() + STATE_TTL_MINUTES * 60 * 1000).toISOString();
  const scopes = PROVIDERS[providerKey].scopes.join(' ');

  await createEntity(env, 'IntegrationState', {
    id: state,
    provider: PROVIDERS[providerKey].id,
    school_id: String(schoolId),
    user_email: user.email,
    requested_at: nowIso(),
    expires_at: expiresAt,
    return_url: nextUrl,
    scopes,
  });

  const tenant = getTenant(env);
  const authorize = new URL(`https://login.microsoftonline.com/${encodeURIComponent(tenant)}/oauth2/v2.0/authorize`);
  authorize.searchParams.set('client_id', config.clientId);
  authorize.searchParams.set('redirect_uri', config.redirectUri);
  authorize.searchParams.set('response_type', 'code');
  authorize.searchParams.set('response_mode', 'query');
  authorize.searchParams.set('scope', scopes);
  authorize.searchParams.set('state', state);
  authorize.searchParams.set('prompt', 'consent');

  return new Response(null, {
    status: 302,
    headers: {
      ...withHeaders(null, env),
      Location: authorize.toString(),
    },
  });
}
