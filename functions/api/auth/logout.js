import { handleOptions, withHeaders } from '../_utils.js';

export async function onRequest({ request, env }) {
  const options = handleOptions(request, env);
  if (options) return options;

  const url = new URL(request.url);
  const next = url.searchParams.get('next') || '/';

  if (env?.AUTH_LOGOUT_URL) {
    const target = new URL(env.AUTH_LOGOUT_URL, url.origin);
    target.searchParams.set('next', next);
    return Response.redirect(target.toString(), 302);
  }

  const nextUrl = new URL(next, url.origin);
  return new Response(null, {
    status: 302,
    headers: {
      ...withHeaders(null, env),
      Location: nextUrl.toString(),
    },
  });
}
