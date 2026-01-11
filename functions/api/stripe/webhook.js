import { errorResponse, handleOptions, json } from '../_utils.js';
import { createEntity, listEntities, updateEntity } from '../_store.js';
import { createEntitlementsForOffer, recordCouponRedemption } from '../_billing.js';

function nowIso() {
  return new Date().toISOString();
}

function parseSignature(header) {
  const parts = String(header || '').split(',');
  const map = {};
  parts.forEach((part) => {
    const [key, value] = part.split('=');
    if (key && value) {
      map[key.trim()] = value.trim();
    }
  });
  return map;
}

async function computeHmac(secret, payload) {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(payload));
  const bytes = Array.from(new Uint8Array(signature));
  return bytes.map((byte) => byte.toString(16).padStart(2, '0')).join('');
}

async function verifySignature(request, secret) {
  const signatureHeader = request.headers.get('Stripe-Signature');
  if (!signatureHeader) return { ok: false, reason: 'missing_signature' };
  const payload = await request.text();
  const parts = parseSignature(signatureHeader);
  const timestamp = parts.t;
  const signature = parts.v1;
  if (!timestamp || !signature) {
    return { ok: false, reason: 'invalid_signature' };
  }
  const signedPayload = `${timestamp}.${payload}`;
  const expected = await computeHmac(secret, signedPayload);
  if (expected !== signature) {
    return { ok: false, reason: 'signature_mismatch' };
  }
  return { ok: true, payload };
}

export async function onRequest({ request, env }) {
  const options = handleOptions(request, env);
  if (options) return options;

  if (request.method !== 'POST') {
    return errorResponse('method_not_allowed', 405, 'Method not allowed', env);
  }

  const secret = env?.STRIPE_WEBHOOK_SECRET;
  if (!secret) {
    return errorResponse('missing_webhook_secret', 500, 'Stripe webhook secret not configured', env);
  }

  const verification = await verifySignature(request, secret);
  if (!verification.ok) {
    return errorResponse('invalid_signature', 400, verification.reason, env);
  }

  const payload = verification.payload;
  let event = null;
  try {
    event = JSON.parse(payload);
  } catch {
    return errorResponse('invalid_payload', 400, 'Invalid JSON payload', env);
  }

  const accountId = event?.account || event?.data?.object?.account || null;
  let schoolId = null;
  if (accountId) {
    const rows = await listEntities(env, 'StripeAccount', {
      filters: { stripe_account_id: String(accountId) },
      limit: 1,
    });
    schoolId = rows?.[0]?.school_id || null;
    if (rows?.[0]) {
      await updateEntity(env, 'StripeAccount', rows[0].id, {
        last_event_id: event.id,
        updated_at: nowIso(),
      });
    }
  }

  await createEntity(env, 'StripeWebhookEvent', {
    school_id: schoolId,
    event_id: event.id,
    event_type: event.type,
    account_id: accountId,
    received_at: nowIso(),
    payload: event,
  });

  const session = event?.data?.object || null;
  const eventType = String(event?.type || '');
  const isCheckoutComplete = eventType === 'checkout.session.completed'
    || eventType === 'checkout.session.async_payment_succeeded';

  if (isCheckoutComplete && session) {
    const meta = session.metadata || {};
    const resolvedSchoolId = meta.school_id || schoolId;
    const transactionId = meta.transaction_id || session.client_reference_id || null;
    const offerId = meta.offer_id || null;
    const userEmail = meta.user_email || session.customer_email || null;
    const couponCode = meta.coupon_code || null;

    let transaction = null;
    if (transactionId) {
      const rows = await listEntities(env, 'Transaction', {
        filters: { id: String(transactionId) },
        limit: 1,
      });
      transaction = rows?.[0] || null;
    }

    if (transaction) {
      await updateEntity(env, 'Transaction', transaction.id, {
        status: 'paid',
        paid_at: nowIso(),
        stripe_session_id: session.id,
        provider_reference: session.payment_intent || session.subscription || null,
        updated_date: nowIso(),
      });
    } else if (resolvedSchoolId && offerId && userEmail) {
      transaction = await createEntity(env, 'Transaction', {
        school_id: String(resolvedSchoolId),
        user_email: userEmail,
        offer_id: String(offerId),
        amount_cents: session.amount_total || session.amount_subtotal || 0,
        discount_cents: session.total_details?.amount_discount || 0,
        coupon_code: couponCode || null,
        provider: 'STRIPE',
        status: 'paid',
        stripe_session_id: session.id,
        provider_reference: session.payment_intent || session.subscription || null,
        created_date: nowIso(),
      });
    }

    if (transaction && resolvedSchoolId) {
      const offerRows = await listEntities(env, 'Offer', {
        filters: { id: String(transaction.offer_id || offerId), school_id: String(resolvedSchoolId) },
        limit: 1,
      });
      const offer = offerRows?.[0] || null;
      if (offer) {
        await createEntitlementsForOffer({
          env,
          schoolId: resolvedSchoolId,
          offer,
          userEmail: transaction.user_email,
          source: 'PURCHASE',
          sourceId: transaction.id,
        });
      }

      if (couponCode && offer) {
        const couponRows = await listEntities(env, 'Coupon', {
          filters: { school_id: String(resolvedSchoolId), code: String(couponCode).toUpperCase() },
          limit: 1,
        });
        const coupon = couponRows?.[0] || null;
        if (coupon) {
          await recordCouponRedemption({
            env,
            schoolId: resolvedSchoolId,
            coupon,
            transactionId: transaction.id,
            userEmail: transaction.user_email,
            discountCents: transaction.discount_cents || 0,
          });
        }
      }

      if (session.mode === 'subscription' && session.subscription) {
        const existingSubs = await listEntities(env, 'Subscription', {
          filters: { school_id: String(resolvedSchoolId), stripe_subscription_id: String(session.subscription) },
          limit: 1,
        });
        if (existingSubs?.[0]) {
          await updateEntity(env, 'Subscription', existingSubs[0].id, {
            status: 'active',
            updated_date: nowIso(),
          });
        } else {
          await createEntity(env, 'Subscription', {
            school_id: String(resolvedSchoolId),
            user_email: transaction.user_email,
            offer_id: transaction.offer_id || offerId,
            stripe_subscription_id: String(session.subscription),
            status: 'active',
            created_date: nowIso(),
          });
        }
      }
    }
  }

  return json({ received: true }, { env });
}
