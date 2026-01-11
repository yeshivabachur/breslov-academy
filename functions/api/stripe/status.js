import { errorResponse, getBearerToken, handleOptions, json } from '../_utils.js';
import { listEntities, updateEntity } from '../_store.js';
import { getUserFromToken } from '../_auth.js';
import { hasMembership, isGlobalAdmin } from '../_tenancy.js';
import { stripeRequest } from './_stripe.js';

function nowIso() {
  return new Date().toISOString();
}

export async function onRequest({ request, env }) {
  const options = handleOptions(request, env);
  if (options) return options;

  if (request.method !== 'GET') {
    return errorResponse('method_not_allowed', 405, 'Method not allowed', env);
  }

  const token = getBearerToken(request);
  const user = await getUserFromToken(token, env);
  if (!user?.email) {
    return errorResponse('auth_required', 401, 'Authentication required', env);
  }

  const url = new URL(request.url);
  const schoolId = url.searchParams.get('school_id') || url.searchParams.get('schoolId');
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

  const rows = await listEntities(env, 'StripeAccount', {
    filters: { school_id: String(schoolId) },
    limit: 1,
  });

  const record = rows?.[0];
  if (!record?.stripe_account_id) {
    return json({ connected: false }, { env });
  }

  let account = null;
  try {
    account = await stripeRequest(env, 'GET', `/v1/accounts/${record.stripe_account_id}`);
  } catch (error) {
    return errorResponse('stripe_error', error.status || 500, error.message, env);
  }

  const updated = await updateEntity(env, 'StripeAccount', record.id, {
    charges_enabled: Boolean(account.charges_enabled),
    payouts_enabled: Boolean(account.payouts_enabled),
    details_submitted: Boolean(account.details_submitted),
    updated_at: nowIso(),
  });

  return json({
    connected: true,
    account_id: record.stripe_account_id,
    charges_enabled: updated?.charges_enabled ?? account.charges_enabled,
    payouts_enabled: updated?.payouts_enabled ?? account.payouts_enabled,
    details_submitted: updated?.details_submitted ?? account.details_submitted,
  }, { env });
}
