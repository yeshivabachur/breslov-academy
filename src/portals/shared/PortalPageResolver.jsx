import React, { Suspense } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { useSession } from '@/components/hooks/useSession';
import { getFeatureByRegistryKey } from '@/components/config/features';
import { resolvePageBySlug, resolvePageKeyBySlug } from './resolvePageBySlug';
import UniversalPage from '@/pages/UniversalPage'; // The fallback factory

// Lazy load actual pages
const PageNotFound = React.lazy(() => import('@/lib/PageNotFound'));

export default function PortalPageResolver({ portalHome = 'dashboard', audience = 'student', pageKeyOverride }) {
  const { pageName } = useParams();
  const { user } = useSession();

  // 1. Check for manual override (e.g. /quiz/:id -> QuizTake)
  if (pageKeyOverride) {
    const Component = resolvePageBySlug(pageKeyOverride); // This uses the PAGES mapping
    if (Component) return <Component />;
  }

  // 2. Resolve specific page component from registry
  const Component = resolvePageBySlug(pageName);
  if (Component) {
    return <Component />;
  }

  // 3. FALLBACK: Use Universal Page Factory for everything else
  // This covers the 300+ missing pages by generating them on the fly.
  if (pageName) {
    return <UniversalPage />;
  }

  return <Navigate to={portalHome} replace />;
}