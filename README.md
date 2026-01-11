# Breslov Academy LMS

**Version:** 11.0 Future Horizons
**Architecture:** Multi-Tenant, Portalized, Registry-Driven, Lazy-Loaded, Native-Ready
**Status:** Strategic Baseline Synchronized (2026-01-11)

## Primary Source of Truth
- **[STRATEGIC MASTER PLAN V11.0](./MASTER_PLAN_V11_FULL_SPEC.md):** The unified, synthesized project roadmap and architectural specification.
- **[MASTER PLAN BOOK (PDF)](./BRESLOV_ACADEMY_MASTER_PLAN_V11_BOOK.pdf):** Consolidated historical and current documentation with an SSOT executive summary.
- **[Gemini Context](./GEMINI.md):** AI agent instructions and architectural invariants.
- **[SSOT-Aligned Roadmap](./ROADMAP.md):** Quarter-based roadmap aligned to the SSOT PDF.

## Unified Strategic Goal
Transition from a legacy single-tenant LMS into a premier, multi-tenant white-label platform for high-trust Torah education. Deliver a "WOW" academic experience through immersive 3D study (VR), conversational AI tutoring, and airtight content protection.

## Key Features (v11.0 Complete)

### 🚀 Next-Gen Experiences
- **Mobile Native:** Capacitor configuration and safe-area aware layout for iOS/Android wrapping.
- **AI Tutor:** Context-aware conversational agent (`/ai-tutor`) for personalized study assistance.
- **Virtual Beit Midrash:** Immersive 3D multiplayer study environment (`/virtual-beit-midrash`) built with React Three Fiber.

### 🏢 Enterprise Capabilities
- **Feature Flags:** Decoupled deployment from release. Admins can toggle optional features (AI Tutor, Gamification) via `/schoolfeatures`.
- **Integrations Marketplace:** Dedicated App Store for connecting Zoom, Discord, Stripe, and more.
- **Multi-Language Support:** Courses can be authored and filtered by language (English, Hebrew, Spanish, etc.).

### 🎨 University-Grade Design System
- **Calm UI:** "Calm" gradients, glassmorphism cards (`GlassCard`), and serif typography for a premium academic feel.
- **Portal Shell:** Unified `PortalLayout` replacing legacy shells, featuring adaptive sidebars and global command palette.
- **Skeletons:** Content-aware loading states (`DashboardSkeleton`, `CourseDetailSkeleton`) for perceived performance.

### 🏆 Gamification & Social
- **Leaderboards:** Global and time-based rankings with "Top Scholar" highlighting.
- **Achievements:** Visual badge collection grid with progress tracking.
- **Study Buddies:** Peer matching system with "Match Score" and accountability tools.

### 🛡️ System Integrity
- **Diagnostics:** Real-time `/integrity` dashboard for admins to detect registry drift and tenancy leaks.
- **Tenancy Guard:** Runtime enforcement of `school_id` scoping via `tenancyEnforcer.js`.
- **Content Protection:** Strict gating of `LOCKED` and `DRIP_LOCKED` materials.

## Portal Structure
- **Public Site:** `/` (Marketing, generic landing)
- **Storefront:** `/s/:schoolSlug` (Tenant-branded sales pages)
- **Student Portal:** `/student` (Dashboard, Learning, Quizzes, Social, AI, VR)
- **Teacher Portal:** `/teacher` (Course Builder, Analytics, Grading)
- **Admin Portal:** `/admin` (Monetization, Staff, Integrity, Settings)

## Getting Started
1. **Install:** `npm install`
2. **Run:** `npm run dev`
3. **Verify:** Visit `/integrity` (as admin) to check system health.
4. **Build:** `npm run build` (generates `dist/`)

## Cloudflare Deployment (Pages + Functions)
This repo includes Cloudflare Pages Functions under `functions/api` to replace the Base44 SDK.
It provides minimal `/api` endpoints for auth, entity CRUD, and integrations.

### Required environment variables
- `VITE_APP_ID`: App identifier (used for public settings requests).
- `VITE_API_BASE_URL`: API base URL (defaults to `/api` when hosting on the same domain).
- `VITE_PUBLIC_BASE_URL`: Public site base URL (used for OAuth redirect hints).

### Optional environment variables (Functions)
- `DEV_TOKEN`: Dev login token used by `/api/auth/login` (defaults to `dev`).
- `DEV_EMAIL`: Email for the dev user (defaults to `dev@breslov.academy`).
- `DEV_ROLE`: Role for the dev user (defaults to `admin`).
- `AUTH_LOGIN_URL`: External auth login URL (if using a real IdP).
- `AUTH_LOGOUT_URL`: External auth logout URL.
- `CORS_ORIGIN`: Allowed origin for API responses.
- `REQUIRE_AUTH`: Set to `true` to enforce auth in public settings responses.

### D1 schema
The API uses a simple generic entity table. Apply `cloudflare/schema.sql` to your D1 database.

### Notes
- For production auth, wire `/api/auth/*` to your IdP and replace the dev-token logic.
- For local API testing, run Pages Functions with Wrangler and set `VITE_API_BASE_URL` to the dev URL.

## Technical Invariants
*   **Registry First:** All routes must be defined in `src/components/config/features.jsx`.
*   **Scoped Data:** All school queries must use `scopedFilter` or `scopedList`.
*   **Rules of Hooks:** No conditional hooks; use `SkeletonLoaders` for waiting states.
