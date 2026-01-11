import { errorResponse, handleOptions, json, readJson } from '../../_utils.js';
import { deleteEntity, listEntities, updateEntity } from '../../_store.js';

export async function onRequest({ request, env, params }) {
  const options = handleOptions(request, env);
  if (options) return options;

  const entity = params?.entity ? String(params.entity) : null;
  const id = params?.id ? String(params.id) : null;

  if (!entity || !id) {
    return errorResponse('missing_entity', 400, 'Missing entity id', env);
  }

  if (request.method === 'GET') {
    try {
      const rows = await listEntities(env, entity, { filters: { id }, limit: 1 });
      const row = rows?.[0] || null;
      if (!row) {
        return errorResponse('not_found', 404, 'Entity not found', env);
      }
      return json(row, { env });
    } catch (err) {
      return errorResponse('storage_unavailable', 503, err.message, env);
    }
  }

  if (request.method === 'PATCH') {
    const payload = await readJson(request);
    if (!payload) {
      return errorResponse('invalid_payload', 400, 'Expected JSON body', env);
    }
    try {
      const updated = await updateEntity(env, entity, id, payload);
      if (!updated) {
        return errorResponse('not_found', 404, 'Entity not found', env);
      }
      return json(updated, { env });
    } catch (err) {
      return errorResponse('storage_unavailable', 503, err.message, env);
    }
  }

  if (request.method === 'DELETE') {
    try {
      const deleted = await deleteEntity(env, entity, id);
      if (!deleted) {
        return errorResponse('not_found', 404, 'Entity not found', env);
      }
      return json({ deleted: true }, { env });
    } catch (err) {
      return errorResponse('storage_unavailable', 503, err.message, env);
    }
  }

  return errorResponse('method_not_allowed', 405, 'Method not allowed', env);
}
