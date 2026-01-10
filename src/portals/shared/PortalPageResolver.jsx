import React, { Suspense } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { resolvePageBySlug } from './resolvePageBySlug';

export default function PortalPageResolver({ portalHome = 'dashboard' }) {
  const { pageName } = useParams();
  
  // If no pageName, redirect to portal home
  if (!pageName) {
    return <Navigate to={portalHome} replace />;
  }

  const Component = resolvePageBySlug(pageName);

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
