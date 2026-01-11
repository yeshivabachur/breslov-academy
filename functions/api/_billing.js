import { createEntity, listEntities, updateEntity } from './_store.js';

function nowIso() {
  return new Date().toISOString();
}

function normalizeType(value) {
  return String(value || '').toUpperCase();
}

function includesCopyLicense(name) {
  return String(name || '').toLowerCase().includes('copy');
}

export async function resolveOfferCourses(env, schoolId, offerId) {
  if (!schoolId || !offerId) return [];
  const rows = await listEntities(env, 'OfferCourse', {
    filters: { school_id: String(schoolId), offer_id: String(offerId) },
    limit: 500,
  });
  return rows || [];
}

export async function createEntitlementsForOffer({ env, schoolId, offer, userEmail, source = 'PURCHASE', sourceId, endsAt = null }) {
  if (!schoolId || !offer || !userEmail) return { created: [], skipped: [] };
  const created = [];
  const skipped = [];
  const startAt = nowIso();

  const existing = await listEntities(env, 'Entitlement', {
    filters: { school_id: String(schoolId), user_email: String(userEmail), source_id: String(sourceId || '') },
    limit: 500,
  });

  const type = normalizeType(offer.offer_type);
  const accessScope = normalizeType(offer.access_scope);

  if (type === 'ADDON') {
    const licenseType = includesCopyLicense(offer.name) ? 'COPY_LICENSE' : 'DOWNLOAD_LICENSE';
    const already = (existing || []).some((ent) => normalizeType(ent.type || ent.entitlement_type) === licenseType);
    if (already) {
      skipped.push({ type: licenseType, reason: 'already_exists' });
    } else {
      const ent = await createEntity(env, 'Entitlement', {
        school_id: String(schoolId),
        user_email: userEmail,
        type: licenseType,
        source,
        source_id: sourceId,
        starts_at: startAt,
        ends_at: endsAt,
      });
      created.push(ent);
    }
    return { created, skipped };
  }

  if (accessScope === 'ALL_COURSES' || type === 'SUBSCRIPTION') {
    const already = (existing || []).some((ent) => normalizeType(ent.type || ent.entitlement_type) === 'ALL_COURSES');
    if (already) {
      skipped.push({ type: 'ALL_COURSES', reason: 'already_exists' });
    } else {
      const ent = await createEntity(env, 'Entitlement', {
        school_id: String(schoolId),
        user_email: userEmail,
        type: 'ALL_COURSES',
        source,
        source_id: sourceId,
        starts_at: startAt,
        ends_at: endsAt,
      });
      created.push(ent);
    }
    return { created, skipped };
  }

  if (accessScope === 'SELECTED_COURSES' || type === 'COURSE' || type === 'BUNDLE') {
    const offerCourses = await resolveOfferCourses(env, schoolId, offer.id);
    for (const oc of offerCourses) {
      const already = (existing || []).some((ent) => {
        const entType = normalizeType(ent.type || ent.entitlement_type);
        return entType === 'COURSE' && String(ent.course_id) === String(oc.course_id);
      });
      if (already) {
        skipped.push({ type: 'COURSE', course_id: oc.course_id, reason: 'already_exists' });
        continue;
      }
      const ent = await createEntity(env, 'Entitlement', {
        school_id: String(schoolId),
        user_email: userEmail,
        type: 'COURSE',
        course_id: oc.course_id,
        source,
        source_id: sourceId,
        starts_at: startAt,
        ends_at: endsAt,
      });
      created.push(ent);
    }
  }

  return { created, skipped };
}

export async function recordCouponRedemption({ env, schoolId, coupon, transactionId, userEmail, discountCents }) {
  if (!coupon || !transactionId || !schoolId || !userEmail) return { created: false, skipped: 'invalid' };
  const existing = await listEntities(env, 'CouponRedemption', {
    filters: { school_id: String(schoolId), transaction_id: String(transactionId) },
    limit: 1,
  });
  if (existing?.[0]) return { created: false, skipped: 'already_exists' };

  await createEntity(env, 'CouponRedemption', {
    school_id: String(schoolId),
    coupon_id: coupon.id,
    user_email: userEmail,
    transaction_id: transactionId,
    discount_cents: discountCents || 0,
  });

  await updateEntity(env, 'Coupon', coupon.id, {
    usage_count: (coupon.usage_count || 0) + 1,
  });

  return { created: true, skipped: null };
}
