import { errorResponse, handleOptions, withHeaders } from '../../_utils.js';
import { createEntity, listEntities, updateEntity } from '../../_store.js';
import { createSession } from '../../_auth.js';
import { getProviderConfig } from './_providers.js';
import { getSchoolAuthPolicy, isDomainAllowed, policyAllowsProvider, resolveRoleForEmail, resolveSchool } from './_policy.js';

function nowIso() {
  return new Date().toISOString();
}

function isExpired(expiresAt) {
  if (!expiresAt) return false;
  const parsed = new Date(expiresAt);
  if (Number.isNaN(parsed.valueOf())) return false;
  return parsed <= new Date();
}

function normalizeNext(nextUrl, origin) {
  if (!nextUrl) return new URL('/', origin).toString();
  try {
    const url = new URL(nextUrl, origin);
    if (url.origin !== origin) return new URL('/', origin).toString();
    return url.toString();
  } catch {
    return new URL('/', origin).toString();
  }
}

function redirectWithError(code, message, nextUrl, origin, env) {
  const target = new URL(normalizeNext(nextUrl, origin), origin);
  target.searchParams.set('authError', code);
  if (message) {
    target.searchParams.set('authErrorMessage', message);
  }
  return new Response(null, {
    status: 302,
    headers: {
      ...withHeaders(null, env),
      Location: target.toString(),
    },
  });
}

function normalizeRole(role) {
  const value = String(role || '').toUpperCase();
  const allowed = new Set(['STUDENT', 'INSTRUCTOR', 'TEACHER', 'TA', 'ADMIN', 'OWNER']);
  return allowed.has(value) ? value : 'STUDENT';
}

function extractEmail(profile) {
  return (
    profile?.email
    || profile?.preferred_username
    || profile?.upn
    || profile?.userPrincipalName
    || profile?.mail
    || null
  );
}

function extractName(profile, fallbackEmail) {
  return profile?.name || profile?.given_name || fallbackEmail || null;
}

function extractProviderUserId(profile) {
  return profile?.sub || profile?.id || profile?.oid || null;
}

async function exchangeCode(config, code, codeVerifier) {
  const body = new URLSearchParams();
  body.set('client_id', config.clientId);
  body.set('client_secret', config.clientSecret);
  body.set('grant_type', 'authorization_code');
  body.set('code', code);
  body.set('redirect_uri', config.redirectUri);
  if (codeVerifier) {
    body.set('code_verifier', codeVerifier);
  }

  const response = await fetch(config.tokenUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: body.toString(),
  });

  const data = await response.json().catch(() => null);
  if (!response.ok) {
    const message = data?.error_description || data?.error || 'Token exchange failed';
    const error = new Error(message);
    error.status = response.status;
    throw error;
  }
  return data;
}

async function fetchUserInfo(config, accessToken) {
  const response = await fetch(config.userinfoUrl, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  const data = await response.json().catch(() => null);
  if (!response.ok) {
    const error = new Error(data?.error || 'Userinfo request failed');
    error.status = response.status;
    throw error;
  }
  return data;
}

async function ensureUserRecord(env, profile) {
  if (!profile?.email) return null;
  const existing = await listEntities(env, 'User', {
    filters: { user_email: profile.email },
    limit: 1,
  });
  if (existing?.[0]) {
    const current = existing[0];
    const updates = {
      full_name: profile.name || current.full_name,
      avatar_url: profile.picture || current.avatar_url,
      last_login_at: nowIso(),
    };
    await updateEntity(env, 'User', current.id, updates);
    return { ...current, ...updates };
  }
  return await createEntity(env, 'User', {
    user_email: profile.email,
    email: profile.email,
    full_name: profile.name || null,
    avatar_url: profile.picture || null,
    last_login_at: nowIso(),
  });
}

async function upsertIdentityLink(env, provider, providerUserId, profile) {
  if (!provider || !providerUserId) return null;
  const id = `${provider}:${providerUserId}`;
  const existing = await listEntities(env, 'IdentityLink', {
    filters: { id },
    limit: 1,
  });
  if (existing?.[0]) {
    const current = existing[0];
    const updates = {
      user_email: profile.email,
      last_seen_at: nowIso(),
      provider_email: profile.email,
      provider_name: profile.name,
    };
    await updateEntity(env, 'IdentityLink', current.id, updates);
    return { ...current, ...updates };
  }
  return await createEntity(env, 'IdentityLink', {
    id,
    provider,
    provider_user_id: providerUserId,
    user_email: profile.email,
    provider_email: profile.email,
    provider_name: profile.name,
    linked_at: nowIso(),
    last_seen_at: nowIso(),
  });
}

async function findMembership(env, schoolId, email) {
  if (!schoolId || !email) return null;
  const rows = await listEntities(env, 'SchoolMembership', {
    filters: { school_id: String(schoolId), user_email: email },
    limit: 1,
  });
  return rows?.[0] || null;
}

async function acceptInviteIfExists(env, schoolId, email) {
  if (!schoolId || !email) return null;
  const invites = await listEntities(env, 'SchoolInvite', {
    filters: { school_id: String(schoolId), email },
    limit: 25,
  });
  const now = new Date();
  const invite = (invites || []).find((row) => {
    if (row.accepted_at) return false;
    if (row.expires_at && new Date(row.expires_at) <= now) return false;
    return true;
  });
  if (!invite) return null;

  const membership = await createEntity(env, 'SchoolMembership', {
    school_id: String(schoolId),
    user_email: email,
    role: normalizeRole(invite.role),
    joined_at: nowIso(),
  });

  await updateEntity(env, 'SchoolInvite', invite.id, {
    accepted_at: nowIso(),
  });

  await createEntity(env, 'AuditLog', {
    school_id: String(schoolId),
    user_email: email,
    action: 'SCHOOL_INVITE_ACCEPTED',
    entity_type: 'SchoolInvite',
    entity_id: invite.id,
    metadata: { invited_email: invite.email, role: invite.role },
  });

  return membership;
}

async function autoProvisionMembership(env, policy, schoolId, email) {
  if (!policy || !policy.auto_provision) return null;
  const role = normalizeRole(resolveRoleForEmail(policy, email));
  const membership = await createEntity(env, 'SchoolMembership', {
    school_id: String(schoolId),
    user_email: email,
    role,
    joined_at: nowIso(),
  });
  await createEntity(env, 'AuditLog', {
    school_id: String(schoolId),
    user_email: email,
    action: 'SSO_AUTO_PROVISIONED',
    entity_type: 'SchoolMembership',
    entity_id: membership.id,
    metadata: { role },
  });
  return membership;
}

async function getVerifiedDomains(env, schoolId) {
  if (!schoolId) return [];
  const rows = await listEntities(env, 'DomainVerification', {
    filters: { school_id: String(schoolId), status: 'verified' },
    limit: 200,
  });
  return (rows || []).map((row) => row.domain).filter(Boolean);
}

export async function onRequest({ request, env }) {
  const options = handleOptions(request, env);
  if (options) return options;

  if (request.method !== 'GET') {
    return errorResponse('method_not_allowed', 405, 'Method not allowed', env);
  }

  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const stateId = url.searchParams.get('state');
  const providerParam = (url.searchParams.get('provider') || '').toLowerCase();

  if (!code || !stateId) {
    return redirectWithError('missing_code', 'Missing authorization code', '/', url.origin, env);
  }

  const stateRows = await listEntities(env, 'AuthState', {
    filters: { id: String(stateId) },
    limit: 1,
  });
  const state = stateRows?.[0];
  if (!state || state.used_at || state.revoked_at || isExpired(state.expires_at)) {
    return redirectWithError('invalid_state', 'Login state expired', '/', url.origin, env);
  }

  const provider = providerParam || state.provider;
  const config = getProviderConfig(provider, env, url.origin);
  if (!config) {
    return redirectWithError('provider_not_configured', 'Provider not configured', state.next_url, url.origin, env);
  }

  let tokenResponse;
  try {
    tokenResponse = await exchangeCode(config, code, state.code_verifier);
  } catch (error) {
    return redirectWithError('token_exchange_failed', error.message, state.next_url, url.origin, env);
  }

  let profile;
  try {
    profile = await fetchUserInfo(config, tokenResponse.access_token);
  } catch (error) {
    return redirectWithError('userinfo_failed', error.message, state.next_url, url.origin, env);
  }

  const email = extractEmail(profile);
  if (!email) {
    return redirectWithError('email_missing', 'No email returned by provider', state.next_url, url.origin, env);
  }

  const name = extractName(profile, email);
  const providerUserId = extractProviderUserId(profile);

  const school = await resolveSchool(env, state.school_id, state.school_slug);
  const policy = await getSchoolAuthPolicy(env, school?.id);
  const allowAll = String(env?.OIDC_ALLOW_ALL || '').toLowerCase() === 'true';
  const verifiedDomains = policy?.require_domain_verification ? await getVerifiedDomains(env, school?.id) : [];

  if (school?.id) {
    if (!policyAllowsProvider(policy, provider, allowAll)) {
      return redirectWithError('sso_disabled', 'SSO not enabled for this school', state.next_url, url.origin, env);
    }
    if (!isDomainAllowed(policy, email, verifiedDomains)) {
      return redirectWithError('domain_blocked', 'Email domain not allowed', state.next_url, url.origin, env);
    }
  }

  await ensureUserRecord(env, { email, name, picture: profile?.picture });
  await upsertIdentityLink(env, provider, providerUserId, { email, name });

  let membership = null;
  if (school?.id) {
    membership = await findMembership(env, school.id, email);
    if (!membership) {
      membership = await acceptInviteIfExists(env, school.id, email);
    }
    if (!membership && policy?.auto_provision) {
      membership = await autoProvisionMembership(env, policy, school.id, email);
    }
  }

  const session = await createSession(env, {
    user_email: email,
    user_name: name,
    provider,
    school_id: school?.id || null,
    role: membership?.role || null,
    metadata: {
      provider,
      school_id: school?.id || null,
      audience: state.intended_audience || null,
    },
  });

  await updateEntity(env, 'AuthState', state.id, {
    used_at: nowIso(),
  });

  const nextUrl = normalizeNext(state.next_url, url.origin);
  const redirect = new URL(nextUrl, url.origin);
  redirect.searchParams.set('token', session.id);

  return new Response(null, {
    status: 302,
    headers: {
      ...withHeaders(null, env),
      Location: redirect.toString(),
    },
  });
}
