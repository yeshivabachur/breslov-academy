# Architecture

Last updated: 2026-01-11 (Phase 0 audit)

## Canonical Files (entry points and invariants)
- Router entry: `src/main.jsx` -> `src/App.jsx`
- Portal routing: `src/portals/app/AppPortal.jsx` (uses `src/pages.config.js`)
- Public layout: `src/portals/public/PublicLayout.jsx`
- Authenticated shell + nav: `src/portals/shared/PortalLayout.jsx`, `src/portals/shared/PortalSidebar.jsx`
- Feature registry (SSOT): `src/components/config/features.jsx` (adapter: `src/components/utils/featureRegistry.jsx`)
- Vault page: `src/pages/Vault.jsx`
- Session/auth: `src/lib/AuthContext.jsx`, `src/components/hooks/useSession.jsx`
- Tenancy scoping: `src/components/api/scoped.jsx`, `src/components/api/scopedEntities.js`
- Tenancy guard + bridge: `src/components/api/tenancyEnforcer.js`, `src/components/api/tenancyRuntime.js`, `src/components/api/TenancyBridge.jsx`
- Storefront context: `src/components/hooks/useStorefrontContext.jsx`
- Lesson access hook: `src/components/hooks/useLessonAccess.jsx`
- Content protection UI: `src/components/security/AccessGate.jsx`, `src/components/protection/ProtectedContent.jsx`
- Materials gating/utilities: `src/components/materials/materialsEngine.jsx`
- API clients: `src/api/appClient.js`, `src/api/base44Client.js`
- Edge entities API: `functions/api/entities/[entity].js` (data schema: `cloudflare/schema.sql`)

## Truth Map (required lookups)
| Concern | Primary Location | Notes |
| --- | --- | --- |
| Feature Registry | `src/components/config/features.jsx` | Registry-first routing + navigation |
| Vault | `src/pages/Vault.jsx` | Renders from registry, no inline lists |
| Content protection policy | `src/components/hooks/useLessonAccess.jsx` | Uses `ContentProtectionPolicy` and access levels |
| Content protection enforcement | `src/components/materials/materialsEngine.jsx`, `src/components/security/AccessGate.jsx`, `src/components/protection/ProtectedContent.jsx` | No material fetch for LOCKED/DRIP_LOCKED |
| Monetization config | `src/pages/SchoolMonetization.jsx`, `src/components/utils/entitlements.jsx` | Offers, transactions, entitlements |
| Tenant branding/terminology | `src/pages/SchoolAdmin.jsx`, `src/components/school/TerminologySettings.jsx` | Branding + terminology presets |
| Integrity diagnostics | `src/pages/Integrity.jsx` | Registry/scoping/gating scans |

## Legacy/Compatibility Routes (must remain)
- Legacy route fallback: `src/utils/index.ts` (fallback to `/PageName` paths)
- Legacy deep link catch-all: `src/portals/LegacyToAppRedirect.jsx`
- Storefront legacy query params: `src/components/hooks/useStorefrontContext.jsx`
- Legacy legal aliases: `/legal/privacy`, `/legal/terms` routed in `src/App.jsx`

