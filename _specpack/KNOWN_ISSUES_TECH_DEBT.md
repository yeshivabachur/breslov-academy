# Known Issues / Tech Debt (Seed List)
Prepared: January 01, 2026 (Asia/Jerusalem)

This list starts from the v9.0 stable ZIP inspection.

## Registry gaps
- [x] `TeachQuizEditor` page exists but is missing from `FEATURES` registry. (Added in v9.1)
- [x] `QuizTake` page exists but is missing from `FEATURES` registry. (Added in v9.1)

## Portal split not implemented yet
- [x] No `/student/*`, `/teacher/*`, `/admin/*` route groups yet. (Implemented v9.1)
- [x] No `/login/student` and `/login/teacher` pages yet. (Implemented v9.1)

## Public marketing site not implemented yet
- [x] No `/about`, `/how-it-works`, `/faq`, `/contact`, `/privacy`, `/terms` pages. (Implemented v9.1)

## Security follow-ups
- [x] Audit for any direct calls to `base44.entities.<scoped>.create/update/delete` (Phase 6 Audit: Passed)
- [x] Audit lesson viewer + quizzes for any fetch while LOCKED/DRIP_LOCKED (Phase 6 Audit: Passed)

## Documentation
- [x] Ensure docs live under `/docs` in the real repo and are kept current (Phase 0: Done)

## Remaining / New Items
- [ ] `LegacyMigration.jsx` uses unscoped queries (Authorized exception for admin tool).
- [ ] `useSession` context switching logic is basic (role-based) and could be "smarter" about user intent.
