import { createAppClient } from '@/api/appClient';
import { installTenancyEnforcer } from '@/components/api/tenancyEnforcer';
import { getActiveSchoolId, getUserEmail } from '@/components/api/tenancyRuntime';
import { isGlobalAdmin } from '@/components/auth/roles';

// Base44-compatible facade backed by the app API client.
export const base44 = createAppClient();

// v8.8: Runtime multi-tenant guard
// Auto-injects school_id into school-scoped entity queries whenever possible.
// Provides explicit .filterGlobal()/.listGlobal() escape hatches for global admins.
installTenancyEnforcer(base44, {
  getActiveSchoolId,
  getUserEmail,
  isGlobalAdmin,
});
