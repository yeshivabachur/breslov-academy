# Codebase Reality Map (v9.0 Stable)

Based on the [Repo Snapshot](./repo-snapshot.md), this document confirms the location of key architectural components.

## 1. Core Architecture

| Component | Location | Notes |
| :--- | :--- | :--- |
| **Router Entry** | `src/App.jsx` | Defines root routes and portal shells. |
| **Feature Registry** | `src/components/config/features.jsx` | Single source of truth for all 40+ pages. |
| **Vault** | `src/pages/Vault.jsx` | Renders the registry; safety net for navigation. |
| **Session/Auth** | `src/components/hooks/useSession.jsx` | "Single source of truth" for user/school/role. |
| **Layout Shell** | `src/Layout.jsx` | Main app shell with sidebar/topbar. |

## 2. Multi-Tenancy & Scoping

| Component | Location | Notes |
| :--- | :--- | :--- |
| **Tenancy Enforcer** | `src/components/api/tenancyEnforcer.js` | Runtime guard injecting `school_id`. |
| **Scoped Helpers** | `src/components/api/scoped.jsx` | Helpers like `scopedFilter`, `scopedCreate`. |
| **Active School** | `src/components/school/SchoolContext.jsx` | Manages `active_school_id` in localStorage. |
| **Storefront Ctx** | `src/components/hooks/useStorefrontContext.jsx` | Resolves `schoolSlug` from URL. |

## 3. Content Protection

| Component | Location | Notes |
| :--- | :--- | :--- |
| **Access Logic** | `src/components/hooks/useLessonAccess.jsx` | Determines `FULL` / `PREVIEW` / `LOCKED`. |
| **Materials Engine** | `src/components/materials/materialsEngine.jsx` | Gates content fetch based on access level. |
| **Secure Download** | `src/components/materials/materialsEngine.jsx` | `getSecureDownloadUrl` handles signed URLs. |

## 4. Key Directories

- `src/pages/`: Flat list of all application pages.
- `src/portals/`: Portal-specific layouts and sub-routers (Student, Teacher, Storefront).
- `src/components/api/`: Base44/SDK wrappers and tenancy logic.
- `src/components/config/`: Configuration files (features, themes).

## 5. Risk Assessment

- **Gating:** `materialsEngine.jsx` correctly blocks fetches in `LOCKED`/`DRIP_LOCKED` states.
- **Tenancy:** `tenancyEnforcer.js` provides a safety layer, and `scopedFilter` is widely used.
- **Legacy Routes:** `App.jsx` maintains legacy redirects and aliasing.
