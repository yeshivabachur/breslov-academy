import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/lib/AuthContext';
import { useSession } from '@/components/hooks/useSession';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';

/**
 * PortalGate
 * - Enforces auth + (optional) role/audience
 * - Blocks portals without membership/active school (routes to onboarding/select)
 * - Persists v9.1 portal intent keys:
 *   - ba_intended_audience: student | teacher | admin
 *   - ba_portal_prefix: /student | /teacher | /admin | /superadmin | /app
 * - Keeps legacy key for backwards compatibility: breslov.login.intent
 */
export default function PortalGate({
  portalPrefix = '/app',
  intendedAudience = 'student',
  allowedAudiences = null, // e.g. ['teacher','admin']
  requiresMembership = true,
  requiresActiveSchool = true,
  requiresGlobalAdmin = false,
  children,
}) {
  const loc = useLocation();
  const { isLoadingAuth, isLoadingPublicSettings, authError, isAuthenticated, navigateToLogin } = useAuth();
  const {
    isLoading: isLoadingSession,
    audience,
    memberships,
    activeSchoolId,
    activeSchool,
    isGlobalAdmin,
  } = useSession();

  useEffect(() => {
    try {
      localStorage.setItem('ba_intended_audience', String(intendedAudience || 'student'));
      localStorage.setItem('ba_portal_prefix', String(portalPrefix || '/app'));
      localStorage.setItem('breslov.login.intent', String(intendedAudience || 'student'));
    } catch {
      // ignore
    }
  }, [portalPrefix, intendedAudience]);

  if (isLoadingPublicSettings || isLoadingAuth || isLoadingSession) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm z-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
          <p className="text-sm font-medium text-muted-foreground animate-pulse">Entering Portal...</p>
        </div>
      </div>
    );
  }

  if (authError?.type === 'user_not_registered') {
    return <UserNotRegisteredError />;
  }

  // If auth is required / missing, kick to IdP login with return URL
  if (authError?.type === 'auth_required' || !isAuthenticated) {
    // We don't use window.location.origin to stay internal-friendly
    const nextUrl = `${loc.pathname}${loc.search || ''}${loc.hash || ''}`;
    navigateToLogin(nextUrl);
    return null;
  }

  if (requiresGlobalAdmin && !isGlobalAdmin) {
    return <Navigate to="/app" replace />;
  }

  const hasMemberships = Array.isArray(memberships) && memberships.length > 0;
  const resolvedSchoolId = activeSchoolId || activeSchool?.id;

  if (requiresMembership && !hasMemberships) {
    return <Navigate to="/app/onboarding" replace />;
  }

  if (requiresActiveSchool && hasMemberships && !resolvedSchoolId) {
    return <Navigate to="/app/SchoolSelect" replace />;
  }

  // Enforce audience (if requested)
  if (Array.isArray(allowedAudiences) && allowedAudiences.length > 0) {
    const a = (audience || 'student').toLowerCase();
    const ok = allowedAudiences.map(x => String(x).toLowerCase()).includes(a);
    if (!ok) {
      // Send user to their likely correct portal based on their actual role
      const fallback = a === 'admin' ? '/admin' : a === 'teacher' ? '/teacher' : '/student';
      return <Navigate to={fallback} replace />;
    }
  }

  return <>{children}</>;
}
