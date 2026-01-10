# Breslov Academy LMS

**Version:** 9.1 Stable
**Architecture:** Multi-Tenant, Portalized, Registry-Driven
**Status:** Audit Passed (2026-01-10)

## Documentation
- **[Coding Book (PDF)](./Breslov_Academy_Coding_Book_v9_1.pdf):** The source of truth.
- **[Architecture Map](./docs/REALITY_MAP.md):** Current codebase structure.
- **[Audit Report](./docs/AUDIT_REPORT_V9_1.md):** Zero-Trust security audit results.
- **[Release Notes](./docs/V9_1_STABLE_RELEASE.md):** v9.1 release details.

## Core Features
- **Public Site:** `/`, `/about`, `/pricing` (Marketing)
- **Storefront:** `/s/:schoolSlug` (Tenant-branded)
- **Portals:**
  - `/student`: Learning dashboard, courses, quizzes.
  - `/teacher`: Course builder, grading, analytics.
  - `/admin`: School settings, monetization, staff.
## Security
  - **Tenancy:** Enforced by `tenancyEnforcer.js` (runtime) + scoped helpers.
  - **Content:** Gated by `materialsEngine.jsx` (LOCKED/DRIP_LOCKED).
  - **Audit:** Comprehensive logging for financial & policy actions.
  - **Integrity:** Diagnostics at `/integrity`.

## Getting Started
1. `npm install`
2. `npm run dev`
3. Visit `/integrity` (as admin) to verify system health.