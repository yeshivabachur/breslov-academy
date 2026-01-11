import { errorResponse, getBearerToken, handleOptions, json, readJson } from '../_utils.js';
import { createEntity, listEntities, updateEntity } from '../_store.js';
import { getUserFromToken } from '../_auth.js';
import { hasMembership, isGlobalAdmin } from '../_tenancy.js';
import { stripeRequest } from './_stripe.js';

function nowIso() {
  return new Date().toISOString();
}

export async function onRequest({ request, env }) {
  const options = handleOptions(request, env);
  if (options) return options;

  if (request.method !== 'POST') {
    return errorResponse('method_not_allowed', 405, 'Method not allowed', env);
  }

  const token = getBearerToken(request);
  const user = await getUserFromToken(token, env);
  if (!user?.email) {
    return errorResponse('auth_required', 401, 'Authentication required', env);
  }

  const payload = await readJson(request);
  if (!payload) {
    return errorResponse('invalid_payload', 400, 'Expected JSON body', env);
  }

  const schoolId = payload.school_id || payload.schoolId;
  if (!schoolId) {
    return errorResponse('missing_school', 400, 'school_id is required', env);
  }

  const globalAdmin = isGlobalAdmin(user, env);
  if (!globalAdmin) {
    const member = await hasMembership(env, schoolId, user.email);
    if (!member) {
      return errorResponse('forbidden', 403, 'Not authorized for this school', env);
    }
  }

  const origin = new URL(request.url).origin;
  const refreshUrl = payload.refresh_url || `${origin}/admin?stripe=refresh`;
  const returnUrl = payload.return_url || `${origin}/admin?stripe=connected`;

  const existing = await listEntities(env, 'StripeAccount', {
    filters: { school_id: String(schoolId) },
    limit: 1,
  });

  let accountId = existing?.[0]?.stripe_account_id || null;
  let recordId = existing?.[0]?.id || null;

  let link = null;
  try {
    if (!accountId) {
      const account = await stripeRequest(env, 'POST', '/v1/accounts', {
        type: 'express',
        email: user.email,
        'metadata[school_id]': String(schoolId),
      });
      accountId = account.id;
      const created = await createEntity(env, 'StripeAccount', {
        school_id: String(schoolId),
        stripe_account_id: accountId,
        charges_enabled: Boolean(account.charges_enabled),
        payouts_enabled: Boolean(account.payouts_enabled),
        details_submitted: Boolean(account.details_submitted),
        created_at: nowIso(),
        updated_at: nowIso(),
      });
      recordId = created?.id || null;
    }

    link = await stripeRequest(env, 'POST', '/v1/account_links', {
      account: accountId,
      refresh_url: refreshUrl,
      return_url: returnUrl,
      type: 'account_onboarding',
    });
  } catch (error) {
    return errorResponse('stripe_error', error.status || 500, error.message, env);
  }

  if (recordId) {
    await updateEntity(env, 'StripeAccount', recordId, { updated_at: nowIso() });
  }

  return json({ url: link.url, account_id: accountId }, { env });
}
