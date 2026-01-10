import React from 'react';
import PortalLayout from '@/portals/shared/PortalLayout';

export default function TeacherLayout({ children }) {
  return (
    <PortalLayout>
      {children}
    </PortalLayout>
  );
}
