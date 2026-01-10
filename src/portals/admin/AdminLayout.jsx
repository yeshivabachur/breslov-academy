import React from 'react';
import PortalLayout from '@/portals/shared/PortalLayout';

export default function AdminLayout({ children }) {
  return (
    <PortalLayout>
      {children}
    </PortalLayout>
  );
}
