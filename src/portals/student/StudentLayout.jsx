import React from 'react';
import PortalLayout from '@/portals/shared/PortalLayout';

export default function StudentLayout({ children }) {
  return (
    <PortalLayout audienceOverride="student">
      {children}
    </PortalLayout>
  );
}
