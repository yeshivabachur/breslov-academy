import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import PortalGate from '@/components/routing/PortalGate';
import StudentDashboard from './pages/StudentDashboard';
import PortalPageResolver from '@/portals/shared/PortalPageResolver';
import StudentLayout from './StudentLayout';

export default function StudentPortal() {
  return (
    <PortalGate
      portalPrefix="/student"
      intendedAudience="student"
      allowedAudiences={['student','teacher','admin']}
    >
      <StudentLayout>
        <Routes>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<StudentDashboard />} />
          <Route path=":pageName" element={<PortalPageResolver portalHome="dashboard" />} />
          <Route path="*" element={<Navigate to="dashboard" replace />} />
        </Routes>
      </StudentLayout>
    </PortalGate>
  );
}
