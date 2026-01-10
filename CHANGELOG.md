# Changelog

## v9.1 Stable (Portalization + Security Hardening) - 2026-01-10
- **Architecture:** Split application into `/student`, `/teacher`, `/admin` portals with dedicated layouts.
- **Routing:** Implemented `PortalPageResolver` for registry-driven dynamic routing.
- **Security:** Hardened `TeachCourse` and `TeachLesson` against tenancy leaks (IDOR protection).
- **Audit:** Added audit logging for Payouts, Downloads, and Protection Policy changes.
- **Tenancy:** Enforced strict school scoping for Subscriptions and Affiliates.
- **Storefront:** Added dynamic branding to School Landing pages.
- **UX:** Implemented "Premium Calm" design system tokens and dark mode support.
- **Analytics:** Added visualization to Affiliate dashboard.

## 10.0-stable-r11 (2026-01-09)
- **Storefront**: Enhanced school landing pages with FAQ and Benefits sections.
- **Checkout**: Hardened checkout with idempotency keys and manual payment trust badges.
- **CI/CD**: Added GitLab CI/CD pipeline configuration for automated linting and builds.
- **Diagnostics**: Integrity scanner now monitors for tenancy and search regressions.

## 10.0-stable-r10 (2026-01-09)
- **Teacher Tools**: Implemented drag-and-drop lesson reordering in Course Builder.
- **Grading**: Launched new Grading Dashboard for instructors with submission queue and feedback tools.
- **Quizzes**: Enhanced Quiz Editor with "Question Bank" import functionality.
- **Bulk Actions**: Added batch publish/draft capabilities for course curriculum.

## 10.0-stable-r9 (2026-01-09)
- **Student Dashboard**: Deployed premium dashboard with KPI cards, streak tracking, and "Next Lesson" quick access.
- **Course Detail**: Overhauled UI with cleaner curriculum list, progress tracking, and clear access states using premium tokens.
- **Lesson Viewer**: Polished premium viewer experience with improved navigation and consistent design tokens.

## 10.0-stable-r8 (2026-01-09)
- **Tenant Administration**: Added "Pending Applications" approval workflow to Network Admin dashboard.
- **Audit Logging**: Integrated comprehensive audit logging for Content Protection and Terminology setting changes.
- **Onboarding**: Hardened invite acceptance flow and verified token-based lookup exceptions.

## 10.0-stable-r7 (2026-01-09)
- **Portalization & Surfaces**: Implemented separate login and signup flows for students, teachers, and schools.
- **Design System**: Introduced `PortalLayout` premium shell with an adaptive sidebar, global command palette, and warm "Night Reading" theme.
- **Import Hardening**: Standardized all internal imports to use the `@/` alias, eliminating brittle relative paths.
- **Feature Registry**: Synchronized the registry with actual router canonical paths and added missing quiz routes.
- **Security Hardening**: Prevented materials fetch in AI Tutor for locked content, enforced strict gating in `PortalGate`, and added rate limiting for checkouts and downloads.

## 10.0-stable-r6-security2 (2026-01-09)
- Content protection: lesson viewers now fetch safe lesson metadata first and only fetch full lesson content when access is FULL/PREVIEW.
- Access control: useLessonAccess is membership-first, supports staff/global-admin overrides, and does not fetch Lesson records.

## 10.0-stable-r4
- Phase 2 tenancy hardening (pass 2): storefront pages now scope ID-based queries (Offer/Transaction/Course/Lesson/Review) to the resolved school.
- Invite acceptance: allowed secure token-based invite lookup (min token length) and moved membership/invite/audit writes to scoped helpers.
- Scoped helpers: `scopedFilter` / `scopedCreate` now enforce `school_id` (no override via payload filters).
- Entitlements utilities migrated to `scoped*` helpers for consistent tenant scoping.

## 10.0-stable-r3
- Phase 2 tenancy hardening (pass 1): Dashboard, Feed, and MyProgress now use `useSession` and tenant-scoped query helpers.
- Reduced direct `base44.entities.*` usage for school-scoped entities.

## 10.0-stable-r2
- Public marketing home redirects authenticated users to `/app`.
- Login pages store canonical intent keys (`ba_intended_audience`, `ba_portal_prefix`) and removed stray control characters.
- Feature Registry updated with public marketing + legal routes, including `/legal/*` aliases.
- LessonViewerPremium hardened to use `useSession` + tenant-scoped queries.

## 10.0-stable
- Initial stable rebuild.
- Added GitLab CI modular kits under `.gitlab/ci/` (Windows Node pipeline + security basics).
- Fixed `scripts/release.ps1` so `-IncludeDist` actually includes `dist/` in the staged ZIP.
