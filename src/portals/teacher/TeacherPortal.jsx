import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import PortalGate from '@/components/routing/PortalGate';
import PortalPageResolver from '@/portals/shared/PortalPageResolver';
import TeacherLayout from './TeacherLayout';

export default function TeacherPortal() {
  return (
    <PortalGate
      portalPrefix="/teacher"
      intendedAudience="teacher"
      allowedAudiences={['teacher','admin']}
    >
      <TeacherLayout>
        <Routes>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path=":pageName" element={<PortalPageResolver portalHome="dashboard" />} />
          <Route path="*" element={<Navigate to="dashboard" replace />} />
        </Routes>
      </TeacherLayout>
    </PortalGate>
  );
}
