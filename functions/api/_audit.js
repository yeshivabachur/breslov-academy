function isTruthy(value) {
  return value !== undefined && value !== null;
}

function buildEntry({ schoolId, userEmail, action, entityType, entityId, metadata }) {
  return {
    school_id: String(schoolId),
    user_email: userEmail || null,
    action,
    entity_type: entityType,
    entity_id: entityId,
    metadata: metadata || {},
    created_date: new Date().toISOString(),
  };
}

function changed(before, after, key) {
  return isTruthy(before?.[key]) || isTruthy(after?.[key])
    ? before?.[key] !== after?.[key]
    : false;
}

export function buildAuditEntries(entity, before, after, userEmail) {
  if (!entity || !before || !after) return [];
  const schoolId = after.school_id || before.school_id;
  if (!schoolId) return [];

  const entries = [];
  const entityType = entity;

  if (entity === 'Course') {
    if (changed(before, after, 'is_published')) {
      entries.push(buildEntry({
        schoolId,
        userEmail,
        action: after.is_published ? 'COURSE_PUBLISHED' : 'COURSE_UNPUBLISHED',
        entityType,
        entityId: after.id || before.id,
        metadata: { from: before.is_published, to: after.is_published },
      }));
    }
  }

  if (entity === 'Lesson') {
    if (changed(before, after, 'status')) {
      entries.push(buildEntry({
        schoolId,
        userEmail,
        action: String(after.status || '').toLowerCase() === 'published' ? 'LESSON_PUBLISHED' : 'LESSON_UPDATED',
        entityType,
        entityId: after.id || before.id,
        metadata: { from: before.status, to: after.status },
      }));
    }
  }

  if (entity === 'Offer') {
    if (changed(before, after, 'price_cents') || changed(before, after, 'billing_interval')) {
      entries.push(buildEntry({
        schoolId,
        userEmail,
        action: 'OFFER_PRICE_CHANGED',
        entityType,
        entityId: after.id || before.id,
        metadata: {
          from: { price_cents: before.price_cents, billing_interval: before.billing_interval },
          to: { price_cents: after.price_cents, billing_interval: after.billing_interval },
        },
      }));
    }
    if (changed(before, after, 'is_active')) {
      entries.push(buildEntry({
        schoolId,
        userEmail,
        action: after.is_active ? 'OFFER_ACTIVATED' : 'OFFER_DEACTIVATED',
        entityType,
        entityId: after.id || before.id,
        metadata: { from: before.is_active, to: after.is_active },
      }));
    }
  }

  if (entity === 'Coupon') {
    if (
      changed(before, after, 'discount_value')
      || changed(before, after, 'discount_type')
      || changed(before, after, 'expires_at')
    ) {
      entries.push(buildEntry({
        schoolId,
        userEmail,
        action: 'COUPON_UPDATED',
        entityType,
        entityId: after.id || before.id,
        metadata: {
          from: { discount_value: before.discount_value, discount_type: before.discount_type, expires_at: before.expires_at },
          to: { discount_value: after.discount_value, discount_type: after.discount_type, expires_at: after.expires_at },
        },
      }));
    }
    if (changed(before, after, 'is_active')) {
      entries.push(buildEntry({
        schoolId,
        userEmail,
        action: after.is_active ? 'COUPON_ACTIVATED' : 'COUPON_DEACTIVATED',
        entityType,
        entityId: after.id || before.id,
        metadata: { from: before.is_active, to: after.is_active },
      }));
    }
  }

  if (entity === 'ContentProtectionPolicy') {
    entries.push(buildEntry({
      schoolId,
      userEmail,
      action: 'CONTENT_POLICY_UPDATED',
      entityType,
      entityId: after.id || before.id,
      metadata: {},
    }));
  }

  if (entity === 'SchoolAuthPolicy') {
    entries.push(buildEntry({
      schoolId,
      userEmail,
      action: 'AUTH_POLICY_UPDATED',
      entityType,
      entityId: after.id || before.id,
      metadata: {},
    }));
  }

  return entries;
}
