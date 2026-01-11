import { errorResponse, handleOptions, json, normalizeLimit, parseQueryJson, readJson } from '../_utils.js';
import { createEntity, listEntities } from '../_store.js';

export async function onRequest({ request, env, params }) {
  const options = handleOptions(request, env);
  if (options) return options;

  const entity = params?.entity ? String(params.entity) : null;
  if (!entity) {
    return errorResponse('missing_entity', 400, 'Missing entity name', env);
  }

  if (request.method === 'GET') {
    const url = new URL(request.url);
    const filters = parseQueryJson(url.searchParams.get('filter')) || {};
    const sort = url.searchParams.get('sort') || null;
    const limit = normalizeLimit(url.searchParams.get('limit'));

    try {
      const rows = await listEntities(env, entity, { filters, sort, limit });
      return json(rows, { env });
    } catch (err) {
      return errorResponse('storage_unavailable', 503, err.message, env);
    }
  }

  if (request.method === 'POST') {
    const payload = await readJson(request);
    if (!payload) {
      return errorResponse('invalid_payload', 400, 'Expected JSON body', env);
    }
    try {
      const created = await createEntity(env, entity, payload);
      return json(created, { status: 201, env });
    } catch (err) {
      return errorResponse('storage_unavailable', 503, err.message, env);
    }
  }

  return errorResponse('method_not_allowed', 405, 'Method not allowed', env);
}
