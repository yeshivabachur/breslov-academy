// Entitlement checking utilities for course access control

import { base44 } from '@/api/base44Client';

/**
 * Check if user has access to a course based on entitlements
 * @param {string} userEmail - User's email
 * @param {string} courseId - Course ID
 * @param {string} schoolId - School ID
 * @returns {Promise<boolean>} - Whether user has access
 */
export async function hasAccessToCourse(userEmail, courseId, schoolId) {
  if (!userEmail || !courseId || !schoolId) return false;

  // Check for ALL_COURSES entitlement
  const allCoursesEntitlements = await base44.entities.Entitlement.filter({
    user_email: userEmail,
    school_id: schoolId,
    type: 'ALL_COURSES'
  });

  // Check if any are currently valid
  const now = new Date();
  const validAllCourses = allCoursesEntitlements.some(e => {
    const starts = new Date(e.starts_at);
    const ends = e.ends_at ? new Date(e.ends_at) : null;
    return starts <= now && (!ends || ends > now);
  });

  if (validAllCourses) return true;

  // Check for specific COURSE entitlement
  const courseEntitlements = await base44.entities.Entitlement.filter({
    user_email: userEmail,
    school_id: schoolId,
    type: 'COURSE',
    course_id: courseId
  });

  const validCourse = courseEntitlements.some(e => {
    const starts = new Date(e.starts_at);
    const ends = e.ends_at ? new Date(e.ends_at) : null;
    return starts <= now && (!ends || ends > now);
  });

  return validCourse;
}

/**
 * Check if user has access based on course access_level and entitlements
 * @param {object} course - Course object
 * @param {string} userEmail - User's email
 * @param {string} userRole - User's role in school
 * @returns {Promise<boolean>}
 */
export async function checkCourseAccess(course, userEmail, userRole) {
  if (!course || !userEmail) return false;

  // Admins/Instructors always have access
  if (['OWNER', 'ADMIN', 'INSTRUCTOR'].includes(userRole)) {
    return true;
  }

  // FREE courses are accessible to all members
  if (course.access_level === 'FREE') {
    return true;
  }

  // PAID/PRIVATE courses require entitlement
  if (course.access_level === 'PAID' || course.access_level === 'PRIVATE') {
    return await hasAccessToCourse(userEmail, course.id, course.school_id);
  }

  // Legacy: check access_tier for backward compatibility
  if (course.access_tier === 'free') {
    return true;
  }

  return false;
}

/**
 * Create entitlements for a purchase
 * @param {object} purchase - Purchase object
 * @param {object} offer - Offer object
 * @param {string} schoolId - School ID
 */
export async function createEntitlementsForPurchase(purchase, offer, schoolId) {
  const startsAt = new Date().toISOString();
  
  if (offer.access_scope === 'ALL_COURSES') {
    await base44.entities.Entitlement.create({
      school_id: schoolId,
      user_email: purchase.user_email,
      type: 'ALL_COURSES',
      source: 'PURCHASE',
      source_id: purchase.id,
      starts_at: startsAt
    });
  } else if (offer.access_scope === 'SELECTED_COURSES') {
    const offerCourses = await base44.entities.OfferCourse.filter({ 
      offer_id: offer.id 
    });
    
    for (const oc of offerCourses) {
      await base44.entities.Entitlement.create({
        school_id: schoolId,
        user_email: purchase.user_email,
        type: 'COURSE',
        course_id: oc.course_id,
        source: 'PURCHASE',
        source_id: purchase.id,
        starts_at: startsAt
      });
    }
  }
}

/**
 * Create entitlements for a subscription
 * @param {object} subscription - Subscription object
 * @param {object} offer - Offer object
 * @param {string} schoolId - School ID
 */
export async function createEntitlementsForSubscription(subscription, offer, schoolId) {
  const startsAt = new Date().toISOString();
  const endsAt = subscription.current_period_end || subscription.end_date;
  
  if (offer.access_scope === 'ALL_COURSES') {
    await base44.entities.Entitlement.create({
      school_id: schoolId,
      user_email: subscription.user_email,
      type: 'ALL_COURSES',
      source: 'SUBSCRIPTION',
      source_id: subscription.id,
      starts_at: startsAt,
      ends_at: endsAt
    });
  } else if (offer.access_scope === 'SELECTED_COURSES') {
    const offerCourses = await base44.entities.OfferCourse.filter({ 
      offer_id: offer.id 
    });
    
    for (const oc of offerCourses) {
      await base44.entities.Entitlement.create({
        school_id: schoolId,
        user_email: subscription.user_email,
        type: 'COURSE',
        course_id: oc.course_id,
        source: 'SUBSCRIPTION',
        source_id: subscription.id,
        starts_at: startsAt,
        ends_at: endsAt
      });
    }
  }
}

/**
 * Check if user has copy license
 * @param {Array} entitlements - User entitlements
 * @returns {boolean}
 */
export function hasCopyLicense(entitlements) {
  return entitlements.some(e => e.entitlement_type === 'COPY_LICENSE' || e.type === 'COPY_LICENSE');
}

/**
 * Check if user has download license
 * @param {Array} entitlements - User entitlements
 * @returns {boolean}
 */
export function hasDownloadLicense(entitlements) {
  return entitlements.some(e => e.entitlement_type === 'DOWNLOAD_LICENSE' || e.type === 'DOWNLOAD_LICENSE');
}

/**
 * Determine if user can copy content
 * @param {object} params - { policy, entitlements, accessLevel }
 * @returns {boolean}
 */
export function canCopy({ policy, entitlements, accessLevel }) {
  if (!policy || accessLevel === 'LOCKED') return false;
  if (accessLevel === 'PREVIEW') return false;
  
  if (policy.copy_mode === 'INCLUDED_WITH_ACCESS') {
    return accessLevel === 'FULL';
  } else if (policy.copy_mode === 'ADDON') {
    return hasCopyLicense(entitlements);
  }
  
  return false;
}

/**
 * Determine if user can download content
 * @param {object} params - { policy, entitlements, accessLevel }
 * @returns {boolean}
 */
export function canDownload({ policy, entitlements, accessLevel }) {
  if (!policy || accessLevel === 'LOCKED') return false;
  if (accessLevel === 'PREVIEW') return false;
  
  if (policy.download_mode === 'INCLUDED_WITH_ACCESS') {
    return accessLevel === 'FULL';
  } else if (policy.download_mode === 'ADDON') {
    return hasDownloadLicense(entitlements);
  }
  
  return false;
}