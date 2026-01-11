import { errorResponse, handleOptions, withHeaders } from '../../_utils.js';
import { createEntity, listEntities, updateEntity } from '../../_store.js';

function nowIso() {
  return new Date().toISOString();
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

function normalizeNext(nextUrl, origin) {
  if (!nextUrl) return new URL('/admin?tab=integrations', origin).toString();
  try {
    const url = new URL(nextUrl, origin);
    if (url.origin !== origin) return new URL('/admin?tab=integrations', origin).toString();
    return url.toString();
  } catch {
    return new URL('/admin?tab=integrations', origin).toString();
  }
}

async function exchangeCode(config, tenant, code) {
  const body = new URLSearchParams();
  body.set('client_id', config.clientId);
  body.set('client_secret', config.clientSecret);
  body.set('grant_type', 'authorization_code');
  body.set('code', code);
  body.set('redirect_uri', config.redirectUri);

  const response = await fetch(`https://login.microsoftonline.com/${encodeURIComponent(tenant)}/oauth2/v2.0/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString(),
  });

  const data = await response.json().catch(() => null);
  if (!response.ok) {
    const error = new Error(data?.error_description || data?.error || 'Token exchange failed');
    error.status = response.status;
    throw error;
  }
  return data;
}

async function upsertIntegrationConnection(env, state, tokenResponse) {
  const id = `${state.school_id}:${state.provider}`;
  const existing = await listEntities(env, 'IntegrationConnection', {
    filters: { id },
    limit: 1,
  });
  const payload = {
    id,
    school_id: state.school_id,
    provider: state.provider,
    status: 'connected',
    scopes: tokenResponse.scope || state.scopes,
    connected_at: nowIso(),
    updated_at: nowIso(),
    access_expires_at: tokenResponse.expires_in ? new Date(Date.now() + tokenResponse.expires_in * 1000).toISOString() : null,
  };
  if (existing?.[0]) {
    await updateEntity(env, 'IntegrationConnection', existing[0].id, payload);
    return existing[0].id;
  }
  const created = await createEntity(env, 'IntegrationConnection', payload);
  return created?.id || id;
}

async function upsertIntegrationSecret(env, state, tokenResponse) {
  const id = `${state.school_id}:${state.provider}`;
  const existing = await listEntities(env, 'IntegrationSecret', {
    filters: { id },
    limit: 1,
  });
  const payload = {
    id,
    school_id: state.school_id,
    provider: state.provider,
    token_type: tokenResponse.token_type || 'Bearer',
    access_token: tokenResponse.access_token || null,
    refresh_token: tokenResponse.refresh_token || existing?.[0]?.refresh_token || null,
    scope: tokenResponse.scope || state.scopes,
    expires_at: tokenResponse.expires_in ? new Date(Date.now() + tokenResponse.expires_in * 1000).toISOString() : null,
    updated_at: nowIso(),
  };
  if (existing?.[0]) {
    await updateEntity(env, 'IntegrationSecret', existing[0].id, payload);
    return existing[0].id;
  }
  const created = await createEntity(env, 'IntegrationSecret', payload);
  return created?.id || id;
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
  if (!code || !stateId) {
    return errorResponse('missing_code', 400, 'Missing authorization code', env);
  }

  const config = getConfig(env, url.origin);
  if (!config) {
    return errorResponse('not_configured', 500, 'Microsoft integration credentials not configured', env);
  }

  const stateRows = await listEntities(env, 'IntegrationState', {
    filters: { id: String(stateId) },
    limit: 1,
  });
  const state = stateRows?.[0];
  const expired = state?.expires_at ? new Date(state.expires_at) <= new Date() : false;
  if (!state || state.used_at || state.revoked_at || expired) {
    return errorResponse('invalid_state', 400, 'Integration state expired', env);
  }

  let tokenResponse = null;
  try {
    tokenResponse = await exchangeCode(config, getTenant(env), code);
  } catch (error) {
    return errorResponse('token_exchange_failed', error.status || 500, error.message, env);
  }

  await upsertIntegrationSecret(env, state, tokenResponse);
  await upsertIntegrationConnection(env, state, tokenResponse);

  await updateEntity(env, 'IntegrationState', state.id, {
    used_at: nowIso(),
  });

  const nextUrl = normalizeNext(state.return_url, url.origin);
  const redirect = new URL(nextUrl, url.origin);
  redirect.searchParams.set('integration', state.provider);

  return new Response(null, {
    status: 302,
    headers: {
      ...withHeaders(null, env),
      Location: redirect.toString(),
    },
  });
}
