import React, { Suspense } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { useSession } from '@/components/hooks/useSession';
import { getFeatureByRegistryKey } from '@/components/config/features';
import { resolvePageBySlug, resolvePageKeyBySlug } from './resolvePageBySlug';

export default function PortalPageResolver({
  portalHome = 'dashboard',
  audience: audienceOverride,
  pageKeyOverride = null,
}) {
  const { pageName } = useParams();
  const { audience: sessionAudience } = useSession();
  const audience = (audienceOverride || sessionAudience || 'student').toLowerCase();
  
  // If no pageName, redirect to portal home
  if (!pageName && !pageKeyOverride) {
    return <Navigate to={portalHome} replace />;
  }

  const pageKey = pageKeyOverride || resolvePageKeyBySlug(pageName);
  const feature = pageKey ? getFeatureByRegistryKey(pageKey) : null;
  const allowed = !!(feature?.audiences || []).some((a) => String(a).toLowerCase() === audience);

  if (!pageKey || !allowed) {
    return <Navigate to={portalHome} replace />;
  }

  const Component = resolvePageBySlug(pageKey);

  if (!Component) {
    // 404 - let the router handle it or show a generic 404
    return <Navigate to="/not-found" replace />;
  }

  return (
    <Suspense fallback={<div className="p-6">Loading...</div>}>
      <Component />
    </Suspense>
  );
}
