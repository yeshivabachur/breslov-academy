import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import PortalGate from '@/components/routing/PortalGate';
import PortalPageResolver from '@/portals/shared/PortalPageResolver';
import AdminLayout from './AdminLayout';

export default function AdminPortal() {
  return (
    <PortalGate
      portalPrefix="/admin"
      intendedAudience="admin"
      allowedAudiences={['admin']}
    >
      <AdminLayout>
        <Routes>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path=":pageName" element={<PortalPageResolver portalHome="dashboard" />} />
          <Route path="*" element={<Navigate to="dashboard" replace />} />
        </Routes>
      </AdminLayout>
    </PortalGate>
  );
}
