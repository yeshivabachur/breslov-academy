// Lesson Access Control Hook
// v10.0-r6: membership-first, drip-aware, and does NOT fetch full Lesson content (caller provides lessonMeta)

import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { scopedFilter } from '@/components/api/scoped';
import { getEnrollDate, computeLessonAvailability, formatAvailabilityCountdown } from '@/components/drip/dripEngine';
import { isEntitlementActive } from '@/components/utils/entitlements';

const DEFAULT_POLICY = {
  protect_content: true,
  require_payment_for_materials: true,
  allow_previews: true,
  max_preview_seconds: 90,
  max_preview_chars: 1500,
  watermark_enabled: true,
  block_copy: true,
  block_print: true,
  copy_mode: 'DISALLOW',
  download_mode: 'DISALLOW',
};

const STAFF_ROLES = new Set(['OWNER', 'ADMIN', 'INSTRUCTOR', 'TA', 'TEACHER', 'RAV', 'RABBI']);

/**
 * useLessonAccess(courseId, lessonId, user, schoolId, options?)
 * options:
 *  - lessonMeta: { is_preview, drip_publish_at, drip_days_after_enroll }
 *  - membership: preloaded membership record (optional)
 */
export const useLessonAccess = (courseId, lessonId, user, schoolId, options = {}) => {
  const lessonMeta = options?.lessonMeta || null;

  // Content protection policy (scoped)
  const { data: policy = DEFAULT_POLICY } = useQuery({
    queryKey: ['protection-policy', schoolId],
    queryFn: async () => {
      if (!schoolId) return DEFAULT_POLICY;
      const policies = await scopedFilter('ContentProtectionPolicy', schoolId, {});
      return policies?.[0] || DEFAULT_POLICY;
    },
    enabled: !!schoolId,
    staleTime: 60_000,
  });

  // Membership (membership-first). Caller may pass membership to avoid refetch.
  const { data: membershipRecords = [] } = useQuery({
    queryKey: ['membership', schoolId, user?.email],
    queryFn: async () => {
      if (!schoolId || !user?.email) return [];
      if (options?.membership) return [options.membership];
      return scopedFilter('SchoolMembership', schoolId, { user_email: user.email });
    },
    enabled: !!schoolId && !!user?.email,
    staleTime: 30_000,
  });

  const membership = useMemo(() => membershipRecords?.[0] || null, [membershipRecords]);
  const membershipRole = (membership?.role || '').toUpperCase();
  const isMember = !!membership;
  const isStaff = STAFF_ROLES.has(membershipRole);

  // Entitlements (scoped + expiry-aware). Only meaningful for members (non-staff).
  const { data: entitlementsRaw = [] } = useQuery({
    queryKey: ['entitlements', schoolId, user?.email],
    queryFn: async () => {
      if (!user?.email || !schoolId) return [];
      if (!isMember && !isStaff) return [];
      return scopedFilter('Entitlement', schoolId, { user_email: user.email });
    },
    enabled: !!user?.email && !!schoolId,
    staleTime: 30_000,
  });

  const now = useMemo(() => new Date(), []);

  const activeEntitlements = useMemo(() => {
    return (entitlementsRaw || []).filter((e) => isEntitlementActive(e, new Date()));
  }, [entitlementsRaw]);

  const hasCourseAccess = useMemo(() => {
    if (!courseId) return false;
    if (isStaff) return true;
    if (!isMember) return false;
    return activeEntitlements.some((e) => {
      const type = (e.entitlement_type || e.type || '').toUpperCase();
      return (type === 'COURSE' && e.course_id === courseId) || type === 'ALL_COURSES';
    });
  }, [activeEntitlements, courseId, isMember, isStaff]);

  // Preview only if the lesson is explicitly marked as preview and policy allows it
  const previewAllowed = !!(policy?.allow_previews && lessonMeta?.is_preview);

  // Enrollment date (for drip). Only needed if user has course access and is not staff.
  const { data: enrollDate = null } = useQuery({
    queryKey: ['enroll-date', schoolId, user?.email, courseId],
    queryFn: () => getEnrollDate({
      school_id: schoolId,
      user_email: user.email,
      course_id: courseId,
    }),
    enabled: !!schoolId && !!user?.email && !!courseId && hasCourseAccess && !isStaff,
    staleTime: 5 * 60 * 1000,
  });

  // Base access level
  let accessLevel = 'LOCKED';
  if (hasCourseAccess) accessLevel = 'FULL';
  else if (previewAllowed) accessLevel = 'PREVIEW';
  else accessLevel = 'LOCKED';

  // Drip lock (only for non-staff with course access)
  let dripInfo = { isAvailable: true, availableAt: null, countdownLabel: null, reason: null };
  if (hasCourseAccess && !isStaff && enrollDate && lessonMeta) {
    const availability = computeLessonAvailability({
      lesson: {
        drip_publish_at: lessonMeta.drip_publish_at,
        drip_days_after_enroll: lessonMeta.drip_days_after_enroll,
      },
      enrollDate,
      now,
    });
    if (!availability.isAvailable) {
      accessLevel = 'DRIP_LOCKED';
      const countdown = formatAvailabilityCountdown(availability.availableAt, now);
      dripInfo = {
        isAvailable: false,
        availableAt: availability.availableAt,
        countdownLabel: countdown.label,
        reason: availability.reason,
      };
    }
  }

  // Licenses
  const hasCopyLicense = useMemo(() => {
    if (isStaff) return true;
    return activeEntitlements.some((e) => {
      const type = (e.entitlement_type || e.type || '').toUpperCase();
      return type === 'COPY_LICENSE' || type === 'COPY';
    });
  }, [activeEntitlements, isStaff]);

  const hasDownloadLicense = useMemo(() => {
    if (isStaff) return true;
    return activeEntitlements.some((e) => {
      const type = (e.entitlement_type || e.type || '').toUpperCase();
      return type === 'DOWNLOAD_LICENSE' || type === 'DOWNLOAD';
    });
  }, [activeEntitlements, isStaff]);

  const canCopy = (policy?.copy_mode || 'DISALLOW') !== 'DISALLOW' && hasCopyLicense;
  const canDownload = (policy?.download_mode || 'DISALLOW') !== 'DISALLOW' && hasDownloadLicense;

  const watermarkText = user ? `${user.email} • ${new Date().toLocaleDateString()}` : '';

  return {
    policy,
    membership,
    isMember,
    membershipRole,
    isStaff,
    entitlements: activeEntitlements,
    hasCourseAccess,
    previewAllowed,
    accessLevel,
    dripInfo,
    canCopy,
    canDownload,
    hasCopyLicense,
    hasDownloadLicense,
    watermarkText,
    maxPreviewSeconds: policy?.max_preview_seconds || DEFAULT_POLICY.max_preview_seconds,
    maxPreviewChars: policy?.max_preview_chars || DEFAULT_POLICY.max_preview_chars,
  };
};
