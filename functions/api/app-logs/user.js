import { errorResponse, handleOptions, json, readJson } from '../_utils.js';

export async function onRequest({ request, env }) {
  const options = handleOptions(request, env);
  if (options) return options;

  if (request.method !== 'POST') {
    return errorResponse('method_not_allowed', 405, 'Method not allowed', env);
  }

  await readJson(request);
  return json({ ok: true }, { env });
}
