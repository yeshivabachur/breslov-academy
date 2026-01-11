import { handleOptions, json, readJson } from '../../_utils.js';

export async function onRequest({ request, env }) {
  const options = handleOptions(request, env);
  if (options) return options;

  const payload = await readJson(request);
  const fallback = env?.LLM_FALLBACK || 'AI service is not configured.';

  if (!payload) {
    return json({ response: fallback }, { env });
  }

  return json({ response: fallback }, { env });
}
