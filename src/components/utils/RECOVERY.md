# RECOVERY GUIDE

How to recover from common issues and locate critical components.

---

## Feature Registry

**Location:** `components/config/features.jsx`

Single source of truth. Never inline registry elsewhere.

**Adapters:** `components/utils/featureRegistry.js`, `components/utils/scopedQueries.js`

**If imports break:**
1. Verify Vite alias `@` → `./src`
2. Check jsconfig.json paths
3. Never inline registry
4. Run `/integrity` diagnostics

---

## Vault

**Location:** `pages/Vault.jsx`

Access to ALL features, including vault-only pages.

**NEVER delete Vault** - it's the safety net.

---

## Content Protection

**Policy:** `ContentProtectionPolicy` entity (school-scoped)

**Access Levels:**
- FULL: Complete access
- PREVIEW: Truncated (90s video, 1500 chars text)
- LOCKED: Paywall/AccessGate

**Configuration:** School Admin → Protection tab

---

## Multi-Tenant Scoping

**Canonical scoped helpers:** `src/components/api/scoped.jsx`

**Scoped entity list:** `src/components/api/scopedEntities.js`

### Runtime Tenancy Guard (v8.8)

Defense-in-depth safety net that auto-injects `school_id` into school-scoped entity reads/writes.

**Installer:** `src/api/base44Client.js` (calls `installTenancyEnforcer()`)

**Guard:** `src/components/api/tenancyEnforcer.js`

**Runtime context:** `src/components/api/tenancyRuntime.js`

**React bridge:** `src/components/api/TenancyBridge.jsx`

**Global admin escape hatches:** `base44.entities.<Entity>.filterGlobal()` and `.listGlobal()`
(used by NetworkAdmin to query cross-school data).

**Validation:** `/integrity` page

**If leakage:** Verify `scopedFilter(entity, schoolId, ...)` usage

---

## Storefront Routing

**Canonical:** `/s/:schoolSlug/*` routes

**Legacy:** Query params preserved (`?slug=`, `?courseId=`)

**Context:** `components/hooks/useStorefrontContext.js`

---

## Entitlements

**Logic:** `components/utils/entitlements.jsx`

**Types:** ALL_COURSES, COURSE, COPY_LICENSE, DOWNLOAD_LICENSE, SUBSCRIPTION

**Granting Functions:**
- `createEntitlementsForPurchase(transaction, offer, schoolId)`
- `createEntitlementsForSubscription(subscription, offer, schoolId)`
- `processReferral(transaction, schoolId)` - handles affiliate commissions

---

## Security Verification

**Page:** `/integrity` (admin-only)

**Checks:** Registry, routing, scoping, OAuth, protection

---

## If System Breaks

1. **Router:** Check registry alignment
2. **Imports:** Verify @ alias
3. **Registry:** Add to features.jsx, don't inline
4. **Scoping:** Run /integrity, fix queries
5. **Protection:** Verify useLessonAccess
6. **OAuth:** Check env vars

---

## Critical Files (Never Delete)

- src/components/config/features.jsx
- src/components/api/scoped.jsx
- src/components/api/scopedEntities.js
- src/components/api/tenancyEnforcer.js
- src/components/api/tenancyRuntime.js
- src/components/api/TenancyBridge.jsx
- src/components/hooks/useLessonAccess.jsx
- src/components/protection/ProtectedContent.js
- src/components/security/AccessGate.jsx
- src/pages/Vault.jsx
- src/pages/Integrity.jsx

---

Last Updated: 2026-01-10

---

## v9.1 Recovery Additions (Stable Release)

### Portal Architecture

- **Resolver:** `src/portals/shared/PortalPageResolver.jsx` maps URL slugs to components using the Registry (`portalPages.js`).
- **Layouts:** `StudentLayout`, `TeacherLayout`, `AdminLayout` wrap `PortalLayout` and force `audienceOverride` to ensure correct sidebar context.
- **Smart Session:** `useSession.jsx` respects `ba_intended_audience` to allow role-based context switching (e.g. Admin viewing Student Portal).

### Critical Fixes

- **Tenancy:** `TeachCourse.jsx` and `TeachLesson.jsx` now use `scopedFilter` to prevent IDOR.
- **Audit:** `PayoutBatchManager.jsx` and `SchoolProtectionSettings.jsx` now log critical actions to `AuditLog`.
- **Search:** `SchoolSearch.jsx` enforces metadata-only search for Lessons/Texts.

### If Nav Breaks

1. Check `src/components/config/features.jsx` (Registry).
2. Verify `portalPages.js` exports the component.
3. Check `PortalGate.jsx` allowed audiences.
4. Clear localStorage `ba_intended_audience`.

---

## v8.9 Recovery Additions

### Runtime warnings

- `src/components/api/tenancyWarnings.js` stores runtime warnings emitted by the tenant guard.
- If you see warnings in `/integrity`, click “Clear” after investigating the offending code path.

### Static scanning

- `src/components/system/codeScanner.js` runs best-effort static scans on high-risk modules.
- If a scan trips, treat it as a regression indicator and validate:
  - Search filters do NOT include lesson content/body
  - Downloads do NOT expose `file_url` until authorized
  - No unscoped `.list()` calls on school-owned entities

### Query contracts

- `src/components/api/contracts.js` and `normalizeLimit()` ensure reads remain bounded.

---

## v10.0 Architecture (Portals + Onboarding)

### Portal Layouts

- **Global Shell:** `src/portals/shared/PortalLayout.jsx` (replaces legacy `Layout.jsx`)
- **Portal Entry Points:** `/student/*`, `/teacher/*`, `/admin/*`
- **Routing:** `src/portals/app/AppPortal.jsx` handles internal routing
- **Gating:** `src/components/routing/PortalGate.jsx` enforces auth + audience

### Onboarding Flow

- **Signup Chooser:** `/signup`
- **Student/Teacher:** `/signup/student`, `/signup/teacher`
- **School Creation:** `/signup/school` (creates pending TenantApplication)

### Import Standard

- **Alias:** Always use `@/` for `src/` imports.
- **Forbidden:** Relative `../` imports crossing module boundaries.

### Critical Files (v10 Additions)

- src/portals/shared/PortalLayout.jsx
- src/portals/shared/PortalSidebar.jsx
- src/components/routing/PortalGate.jsx
- src/components/theme/ThemeToggle.jsx
- src/components/storefront/SchoolHero.jsx