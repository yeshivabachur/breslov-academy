import { handleOptions, json } from '../../_utils.js';

export async function onRequest({ request, env, params }) {
  const options = handleOptions(request, env);
  if (options) return options;

  const appId = params?.appId ? String(params.appId) : null;

  return json({
    id: appId,
    public_settings: {
      auth_required: Boolean(env?.REQUIRE_AUTH),
    },
  }, { env });
}
