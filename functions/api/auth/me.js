import { errorResponse, getBearerToken, handleOptions, json } from '../_utils.js';
import { getUserFromToken } from '../_auth.js';

export async function onRequest({ request, env }) {
  const options = handleOptions(request, env);
  if (options) return options;

  const token = getBearerToken(request);
  if (!token) {
    return errorResponse('auth_required', 401, 'Authentication required', env);
  }

  const user = getUserFromToken(token, env);
  if (!user) {
    return errorResponse('auth_required', 401, 'Authentication required', env);
  }

  return json(user, { env });
}
