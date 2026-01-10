# Roadmap — v10.0 Major Upgrades
Prepared: January 11, 2026

This roadmap defines the "v10.0" milestone, focusing on enterprise-grade capabilities and platform extensibility.

---

# Phase 1 — Feature Flags Framework
## Objective
Decouple deployment from release. Allow features to be toggled per-tenant (school) or globally.

## Tasks
1.  **Flag Registry:** Create `src/components/config/featureFlags.js` to define available flags (e.g., `ENABLE_AI_TUTOR`, `BETA_QUIZ_EDITOR`).
2.  **Tenant Settings:** Update `School` entity or `SchoolSettings` to store flag overrides.
3.  **Hook:** Create `useFeatureFlag(key)` hook that resolves:
    - Global default
    - School override
    - User override (optional, for beta testers)
4.  **UI Integration:** Update `src/components/config/features.jsx` to respect flags (hiding nav items).
5.  **Admin UI:** Create `/admin/features` for school admins to toggle opt-in features.

---

# Phase 2 — Multi-Language Content Authoring (i18n)
## Objective
Allow instructors to author courses in multiple languages and let students switch languages.

## Tasks
1.  **Data Model:** Add `language` field to `Course`, `Lesson`, `Quiz`.
2.  **Authoring UI:** Add language selector in `TeachCourseSettings` and `TeachLesson`.
3.  **Student UI:**
    - Add language filter to `Courses` page.
    - If multiple translations exist (linked by a `group_id` or similar), allow switching in `CourseDetail`.
    - *MVP:* Just support separate course entities per language.

---

# Phase 3 — Integrations Marketplace
## Objective
A dedicated surface for discovering and configuring third-party tools (Zoom, Slack, Stripe, etc.).

## Tasks
1.  **Registry:** Define available integrations in `src/components/config/integrations.js`.
2.  **Marketplace Page:** Create `/admin/integrations` (listing available apps).
3.  **Detail Page:** Create `/admin/integrations/:appId` (connect/configure).
4.  **Connectors:** Standardize the "Connect" flow (OAuth, API Key input).
5.  **Hooks:** `useIntegration(appId)` to check connection status in other components.

---

# Execution Order
1.  **Feature Flags** (Foundational)
2.  **Integrations Marketplace** (Uses feature flags)
3.  **Multi-Language** (Content expansion)
