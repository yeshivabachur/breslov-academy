# Known Issues / Tech Debt

Last updated: 2026-01-11 (Phase 0 audit + V11 hardening)

## Open Items
- [ ] Direct `base44.entities.*` usage in school-scoped contexts should be migrated to `scoped*` helpers. Remaining priorities:
  - Remaining direct usage is now limited to global entities, invite token lookups, and the legacy migration tool.
  - Full list captured in `docs/repo-snapshot.md` (review for any newly introduced school-scoped paths).
- [ ] `getLessonMaterial()` in `src/components/materials/materialsEngine.jsx` appears unused; decide whether to remove or wire through gated access.
- [ ] Legacy school fallback in `src/pages/Dashboard.jsx` and `src/pages/Courses.jsx` uses direct `base44.entities.School.filter`; acceptable since `School` is global, but revisit if tenant discovery rules change.

## Recently Closed
- [x] Scoped access + audit logging for Downloads, SchoolMonetization, ContentProtectionSettings, and Offline caching.
- [x] Materials engine switched to scoped entity access.
- [x] Public storefront pages migrated to scoped data access for offers/coupons/courses/testimonials.
- [x] School analytics and admin hardening pages now use scoped data + session gates.
- [x] School admin support modules (announcements, moderation, audit log, payouts, staff) moved to scoped APIs with audit logging.
- [x] Rate limiter now logs via scoped API.
