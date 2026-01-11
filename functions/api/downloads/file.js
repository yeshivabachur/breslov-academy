import { errorResponse, getCorsHeaders, handleOptions } from '../_utils.js';
import { listEntities, updateEntity, createEntity } from '../_store.js';

function nowIso() {
  return new Date().toISOString();
}

function getClientIp(request) {
  return request.headers.get('CF-Connecting-IP')
    || request.headers.get('X-Forwarded-For')
    || request.headers.get('X-Real-IP')
    || null;
}

function isExpired(expiresAt) {
  if (!expiresAt) return false;
  return new Date(expiresAt) <= new Date();
}

export async function onRequest({ request, env }) {
  const options = handleOptions(request, env);
  if (options) return options;

  if (request.method !== 'GET') {
    return errorResponse('method_not_allowed', 405, 'Method not allowed', env);
  }

  const url = new URL(request.url);
  const tokenId = url.searchParams.get('token');
  if (!tokenId) {
    return errorResponse('missing_token', 400, 'Missing token', env);
  }

  const tokens = await listEntities(env, 'DownloadToken', { filters: { id: tokenId }, limit: 1 });
  const token = tokens?.[0];
  if (!token) {
    return errorResponse('invalid_token', 404, 'Invalid token', env);
  }

  if (token.revoked_at || token.used_at || isExpired(token.expires_at)) {
    return errorResponse('token_expired', 410, 'Token expired', env);
  }

  const downloads = await listEntities(env, 'Download', {
    filters: { id: String(token.download_id), school_id: String(token.school_id) },
    limit: 1
  });
  const download = downloads?.[0];
  if (!download?.file_url) {
    return errorResponse('not_found', 404, 'Download not found', env);
  }

  await updateEntity(env, 'DownloadToken', token.id, {
    used_at: nowIso(),
    used_ip: getClientIp(request)
  });

  await createEntity(env, 'EventLog', {
    school_id: String(token.school_id),
    user_email: token.user_email,
    event_type: 'download_token_used',
    entity_type: 'Download',
    entity_id: String(download.id),
    metadata: {
      token_id: token.id
    }
  });

  const upstream = await fetch(download.file_url);
  if (!upstream.ok) {
    return errorResponse('download_unavailable', 502, 'File unavailable', env);
  }

  const headers = new Headers(upstream.headers);
  const cors = getCorsHeaders(env);
  Object.entries(cors).forEach(([key, value]) => headers.set(key, value));
  headers.set('Cache-Control', 'no-store');
  headers.set('X-Download-Watermark', token.watermark_text || '');

  return new Response(upstream.body, {
    status: upstream.status,
    headers
  });
}
