# Repo Reality Snapshot
Generated: 2026-01-10

## REPO ID
Directory: C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy

## PACKAGE.JSON
```json
{
  "name": "base44-app",
  "private": true,
  "version": "10.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "lint": "eslint . --quiet",
    "lint:fix": "eslint . --fix",
    "typecheck": "tsc -p ./jsconfig.json",
    "preview": "vite preview",
    "predev": "node scripts/generate-public-pages.mjs",
    "prebuild": "node scripts/generate-public-pages.mjs"
  },
  "dependencies": {
    "@base44/sdk": "^0.8.3",
    "@base44/vite-plugin": "^0.2.12",
    "@hello-pangea/dnd": "^17.0.0",
    "@hookform/resolvers": "^4.1.2",
    "@radix-ui/react-accordion": "^1.2.3",
    "@radix-ui/react-alert-dialog": "^1.1.6",
    "@radix-ui/react-aspect-ratio": "^1.1.2",
    "@radix-ui/react-avatar": "^1.1.3",
    "@radix-ui/react-checkbox": "^1.1.4",
    "@radix-ui/react-collapsible": "^1.1.3",
    "@radix-ui/react-context-menu": "^2.2.6",
    "@radix-ui/react-dialog": "^1.1.6",
    "@radix-ui/react-dropdown-menu": "^2.1.6",
    "@radix-ui/react-hover-card": "^1.1.6",
    "@radix-ui/react-label": "^2.1.2",
    "@radix-ui/react-menubar": "^1.1.6",
    "@radix-ui/react-navigation-menu": "^1.2.5",
    "@radix-ui/react-popover": "^1.1.6",
    "@radix-ui/react-progress": "^1.1.2",
    "@radix-ui/react-radio-group": "^1.2.3",
    "@radix-ui/react-scroll-area": "^1.2.3",
    "@radix-ui/react-select": "^2.1.6",
    "@radix-ui/react-separator": "^1.1.2",
    "@radix-ui/react-slider": "^1.2.3",
    "@radix-ui/react-slot": "^1.1.2",
    "@radix-ui/react-switch": "^1.1.3",
    "@radix-ui/react-tabs": "^1.1.3",
    "@radix-ui/react-toast": "^1.2.2",
    "@radix-ui/react-toggle": "^1.1.2",
    "@radix-ui/react-toggle-group": "^1.1.2",
    "@radix-ui/react-tooltip": "^1.1.8",
    "@stripe/react-stripe-js": "^3.0.0",
    "@stripe/stripe-js": "^5.2.0",
    "@tanstack/react-query": "^5.84.1",
    "canvas-confetti": "^1.9.4",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "cmdk": "^1.0.0",
    "date-fns": "^3.6.0",
    "embla-carousel-react": "^8.5.2",
    "framer-motion": "^11.16.4",
    "html2canvas": "^1.4.1",
    "input-otp": "^1.4.2",
    "jspdf": "^2.5.2",
    "lodash": "^4.17.21",
    "lucide-react": "^0.475.0",
    "moment": "^2.30.1",
    "next-themes": "^0.4.4",
    "react": "^18.2.0",
    "react-day-picker": "^8.10.1",
    "react-dom": "^18.2.0",
    "react-hook-form": "^7.54.2",
    "react-hot-toast": "^2.6.0",
    "react-leaflet": "^4.2.1",
    "react-markdown": "^9.0.1",
    "react-quill": "^2.0.0",
    "react-resizable-panels": "^2.1.7",
    "react-router-dom": "^6.26.0",
    "recharts": "^2.15.4",
    "sonner": "^2.0.1",
    "tailwind-merge": "^3.0.2",
    "tailwindcss-animate": "^1.0.7",
    "three": "^0.171.0",
    "vaul": "^1.1.2",
    "zod": "^3.24.2",
    "react-helmet-async": "^2.0.5"
  },
  "devDependencies": {
    "@eslint/js": "^9.19.0",
    "@types/node": "^22.13.5",
    "@types/react": "^18.2.66",
    "@types/react-dom": "^18.2.22",
    "@vitejs/plugin-react": "^4.3.4",
    "autoprefixer": "^10.4.20",
    "baseline-browser-mapping": "^2.8.32",
    "eslint": "^9.19.0",
    "eslint-plugin-react": "^7.37.4",
    "eslint-plugin-react-hooks": "^5.0.0",
    "eslint-plugin-react-refresh": "^0.4.18",
    "eslint-plugin-unused-imports": "^4.3.0",
    "globals": "^15.14.0",
    "postcss": "^8.5.3",
    "tailwindcss": "^3.4.17",
    "typescript": "^5.8.2",
    "vite": "^6.1.0",
    "vite-plugin-sitemap": "^0.7.1"
  }
}
```

## ROUTER HITS
- `src/App.jsx` uses `Routes`, `Route`, `Navigate` from `react-router-dom`.
- `src/portals/student/StudentPortal.jsx` defines nested routes.
- `src/portals/storefront/StorefrontPortal.jsx` uses `useParams` for `schoolSlug`.
- `src/components/config/features.jsx` defines routes for the registry.

## VAULT/REGISTRY HITS
- `src/components/config/features.jsx` is the canonical feature registry.
- `src/pages/Vault.jsx` implements the Vault UI.
- `src/components/navigation/CommandPalette.jsx` consumes the registry.

## TENANT HITS
- `src/components/api/tenancyEnforcer.js` enforces `school_id` injection.
- `src/components/hooks/useStorefrontContext.jsx` manages `schoolSlug`.
- `src/components/school/SchoolContext.jsx` manages `activeSchoolId`.
- Extensive usage of `school_id` in pages and components.

## GATING HITS
- `src/components/materials/materialsEngine.jsx` defines `shouldFetchMaterials`.
- `src/components/hooks/useLessonAccess.jsx` determines access levels (LOCKED, DRIP_LOCKED).
- `src/pages/LessonViewer.jsx` and `src/pages/LessonViewerPremium.jsx` respect gating.

## Snapshot 2026-01-11 14:23:11

### REPO ID
```
github	git@github.com:yeshivabachur/breslov-academy.git (fetch)
github	git@github.com:yeshivabachur/breslov-academy.git (push)
origin	https://oauth2:glpat-w6h_5bPdoxpOJBdMekDg5m86MQp1OmpsNjBkCw.01.12161dz2l@gitlab.com/yeshivabachur/breslov-academy.git (fetch)
origin	https://oauth2:glpat-w6h_5bPdoxpOJBdMekDg5m86MQp1OmpsNjBkCw.01.12161dz2l@gitlab.com/yeshivabachur/breslov-academy.git (push)
fbdad2e76c840c73158c54992a48dad31bb4dcb0
## main
 M src/components/api/scopedEntities.js
 M src/pages/Analytics.jsx
 M src/pages/Integrity.jsx
 M src/pages/Reader.jsx
 M src/pages/SchoolAdmin.jsx
 M src/pages/SchoolSearch.jsx
 M src/pages/SchoolSelect.jsx
?? docs/implementation/policies/
?? docs/implementation/worksheets/WS-0003-tenant-scoped-entities.md
?? docs/implementation/worksheets/WS-0004-zero-friction-school-selection.md
?? docs/implementation/worksheets/WS-0005-scoped-admin-analytics.md
?? scripts/tmp-repo-snapshot.ps1
?? src/pages/AdminOnboarding.jsx
fbdad2e Audit portal routing and add admin login
```

### PACKAGE.JSON
```json
{
  "name": "breslov-academy",
  "private": true,
  "version": "10.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "lint": "eslint . --quiet",
    "lint:fix": "eslint . --fix",
    "typecheck": "tsc -p ./jsconfig.json",
    "preview": "vite preview",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "predev": "node scripts/generate-public-pages.mjs",
    "prebuild": "node scripts/generate-public-pages.mjs"
  },
  "dependencies": {
    "@hello-pangea/dnd": "^18.0.1",
    "@hookform/resolvers": "^5.2.2",
    "@radix-ui/react-accordion": "^1.2.12",
    "@radix-ui/react-alert-dialog": "^1.1.15",
    "@radix-ui/react-aspect-ratio": "^1.1.8",
    "@radix-ui/react-avatar": "^1.1.11",
    "@radix-ui/react-checkbox": "^1.3.3",
    "@radix-ui/react-collapsible": "^1.1.12",
    "@radix-ui/react-context-menu": "^2.2.16",
    "@radix-ui/react-dialog": "^1.1.15",
    "@radix-ui/react-dropdown-menu": "^2.1.16",
    "@radix-ui/react-hover-card": "^1.1.15",
    "@radix-ui/react-label": "^2.1.8",
    "@radix-ui/react-menubar": "^1.1.16",
    "@radix-ui/react-navigation-menu": "^1.2.14",
    "@radix-ui/react-popover": "^1.1.15",
    "@radix-ui/react-progress": "^1.1.8",
    "@radix-ui/react-radio-group": "^1.3.8",
    "@radix-ui/react-scroll-area": "^1.2.10",
    "@radix-ui/react-select": "^2.2.6",
    "@radix-ui/react-separator": "^1.1.8",
    "@radix-ui/react-slider": "^1.3.6",
    "@radix-ui/react-slot": "^1.2.4",
    "@radix-ui/react-switch": "^1.2.6",
    "@radix-ui/react-tabs": "^1.1.13",
    "@radix-ui/react-toast": "^1.2.15",
    "@radix-ui/react-toggle": "^1.1.10",
    "@radix-ui/react-toggle-group": "^1.1.11",
    "@radix-ui/react-tooltip": "^1.2.8",
    "@react-three/drei": "^10.7.7",
    "@react-three/fiber": "^9.5.0",
    "@stripe/react-stripe-js": "^5.4.1",
    "@stripe/stripe-js": "^8.6.1",
    "@tanstack/react-query": "^5.90.16",
    "canvas-confetti": "^1.9.4",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "cmdk": "^1.1.1",
    "date-fns": "^4.1.0",
    "embla-carousel-react": "^8.6.0",
    "framer-motion": "^12.25.0",
    "html2canvas": "^1.4.1",
    "input-otp": "^1.4.2",
    "jspdf": "^4.0.0",
    "lodash": "^4.17.21",
    "lucide-react": "^0.562.0",
    "moment": "^2.30.1",
    "next-themes": "^0.4.6",
    "pdf-lib": "^1.17.1",
    "react": "^19.2.3",
    "react-day-picker": "^9.13.0",
    "react-dom": "^19.2.3",
    "react-helmet-async": "^2.0.5",
    "react-hook-form": "^7.71.0",
    "react-hot-toast": "^2.6.0",
    "react-leaflet": "^5.0.0",
    "react-markdown": "^10.1.0",
    "react-quill": "^2.0.0",
    "react-resizable-panels": "^4.3.3",
    "react-router-dom": "^7.12.0",
    "recharts": "^3.6.0",
    "sonner": "^2.0.7",
    "tailwind-merge": "^3.4.0",
    "tailwindcss-animate": "^1.0.7",
    "three": "^0.182.0",
    "vaul": "^1.1.2",
    "zod": "^4.3.5"
  },
  "devDependencies": {
    "@eslint/js": "^9.39.2",
    "@playwright/test": "^1.57.0",
    "@tailwindcss/postcss": "^4.1.18",
    "@types/node": "^25.0.6",
    "@types/react": "^19.2.8",
    "@types/react-dom": "^19.2.3",
    "@vitejs/plugin-react": "^5.1.2",
    "autoprefixer": "^10.4.23",
    "baseline-browser-mapping": "^2.9.14",
    "eslint": "^9.39.2",
    "eslint-plugin-react": "^7.37.5",
    "eslint-plugin-react-hooks": "^7.0.1",
    "eslint-plugin-react-refresh": "^0.4.26",
    "eslint-plugin-unused-imports": "^4.3.0",
    "globals": "^17.0.0",
    "npm-check-updates": "^19.3.1",
    "postcss": "^8.5.6",
    "tailwindcss": "^4.1.18",
    "typescript": "^5.9.3",
    "vite": "^7.3.1",
    "vite-plugin-sitemap": "^0.8.2"
  }
}
```

### TREE
```
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\.gitignore
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\.gitlab-ci.yml
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\BRESLOV_ACADEMY_MASTER_PLAN_V11_BOOK.pdf
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\Breslov_Academy_Master_Plan_V11_Single_Source_of_Truth_500p.pdf
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\build.log
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\BUILDINFO.json
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\capacitor.config.json
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\CHANGELOG.md
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\checksums.sha256
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\CHECKSUMS_MANIFEST.sha256
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\ci.log
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\CODE_BOOK_PLAN.md
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\components.json
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\eslint.config.js
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\GEMINI.md
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\HEALTHCHECKS.md
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\index.html
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\install.log
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\jsconfig.json
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\MASTER_PLAN_V11_DOWNLOADED.pdf
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\MASTER_PLAN_V11_FULL_SPEC.md
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\npm-install.out
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\OPS_PROTOCOL.md
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\package-lock.json
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\package.json
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\playwright.config.js
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\postcss.config.js
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\README.md
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\ROADMAP.md
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\ROADMAP_CODEX.md
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\ROADMAP_STATUS.md
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\SECURITY_INVARIANTS.md
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\tailwind.config.cjs
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\vite.config.js
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\wrangler.toml
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\zod-4.3.3.tgz
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\.github\workflows\sync-from-gitlab.yml
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\.gitlab\ci\kit.ci-node-windows.yml
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\.gitlab\ci\kit.releases.yml
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\.gitlab\ci\kit.rules.yml
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\.gitlab\ci\kit.security-basics.yml
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\.gitlab\ci\README.md
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\.gitlab\ci\patches\HOW_TO_APPLY_INCLUDES.txt
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\cloudflare\schema.sql
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\docs\AUDIT_REPORT_V9_1.md
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\docs\README.md
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\docs\REALITY_MAP.md
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\docs\repo-snapshot.md
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\docs\v9.1-legacy-route-map.md
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\docs\v9.1-portalization.md
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\docs\v9.1-seo-prerender.md
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\docs\V9_1_STABLE_RELEASE.md
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\docs\_write_test.txt
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\docs\implementation\IMPLEMENTATION_WORKSHEET_TEMPLATE.md
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\docs\implementation\audits\ROUTING_PORTALIZATION_AUDIT.md
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\docs\implementation\policies\ZERO_FRICTION_POLICY.md
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\docs\implementation\worksheets\WS-0001-session-source-of-truth.md
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\docs\implementation\worksheets\WS-0002-routing-portalization.md
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\docs\implementation\worksheets\WS-0003-tenant-scoped-entities.md
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\docs\implementation\worksheets\WS-0004-zero-friction-school-selection.md
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\docs\implementation\worksheets\WS-0005-scoped-admin-analytics.md
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\docs\specpack\v9_specpack_v5_fromStable\00_INDEX.md
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\docs\specpack\v9_specpack_v5_fromStable\ARCHITECTURE_NORTH_STAR.md
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\docs\specpack\v9_specpack_v5_fromStable\BACKLOG_STORIES.md
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\docs\specpack\v9_specpack_v5_fromStable\BRANDING_TERMINOLOGY_POLICY.md
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\docs\specpack\v9_specpack_v5_fromStable\CI_CD_PIPELINE.md
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\docs\specpack\v9_specpack_v5_fromStable\COMMAND_PALETTE_SPEC.md
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\docs\specpack\v9_specpack_v5_fromStable\CONTENT_PROTECTION_MATERIALS_ENGINE.md
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\docs\specpack\v9_specpack_v5_fromStable\DESIGN_SYSTEM_UI_UX.md
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\docs\specpack\v9_specpack_v5_fromStable\FEATURE_REGISTRY_AND_VAULT.md
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\docs\specpack\v9_specpack_v5_fromStable\FUTURE_BUILDS_PLAYBOOK.md
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\docs\specpack\v9_specpack_v5_fromStable\GITLAB_SETUP_WORKFLOW.md
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\docs\specpack\v9_specpack_v5_fromStable\IA_ROUTES_PORTALS.md
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\docs\specpack\v9_specpack_v5_fromStable\KNOWN_ISSUES_TECH_DEBT.md
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\docs\specpack\v9_specpack_v5_fromStable\MIGRATIONS_DATA_MODEL.md
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\docs\specpack\v9_specpack_v5_fromStable\NEXT_CHAT_CONTEXT.md
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\docs\specpack\v9_specpack_v5_fromStable\OPS_INTEGRITY_QA.md
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\docs\specpack\v9_specpack_v5_fromStable\PORTALIZATION_BUILD_SCRIPT_V9_1.md
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\docs\specpack\v9_specpack_v5_fromStable\PORTAL_FEATURE_MATRIX.md
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\docs\specpack\v9_specpack_v5_fromStable\PR_CHECKLIST.md
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\docs\specpack\v9_specpack_v5_fromStable\QA_RELEASE_CHECKLISTS.md
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\docs\specpack\v9_specpack_v5_fromStable\RBAC_TENANCY_MODEL.md
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\docs\specpack\v9_specpack_v5_fromStable\README.md
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\docs\specpack\v9_specpack_v5_fromStable\RELEASE_TRAINS_FUTURE_BUILDS.md
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\docs\specpack\v9_specpack_v5_fromStable\RELEASE_TRAIN_CONTINUOUS_BUILDS.md
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\docs\specpack\v9_specpack_v5_fromStable\REPO_REALITY_AUDIT.md
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\docs\specpack\v9_specpack_v5_fromStable\ROADMAP_V9_DETAILED.md
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\docs\specpack\v9_specpack_v5_fromStable\SECURITY_THREAT_MODEL.md
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\docs\specpack\v9_specpack_v5_fromStable\STORE_MONEY_SUBSCRIPTIONS.md
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\docs\specpack\v9_specpack_v5_fromStable\V9_AUTH_ONBOARDING_REALITY.md
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\docs\specpack\v9_specpack_v5_fromStable\V9_CODEBASE_REALITY_MAP.md
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\docs\specpack\v9_specpack_v5_fromStable\V9_CONTENT_PROTECTION_REALITY.md
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\docs\specpack\v9_specpack_v5_fromStable\V9_FEATURE_REGISTRY_REALITY.md
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\docs\specpack\v9_specpack_v5_fromStable\V9_PUBLIC_SITE_AND_PORTALS_PLAN.md
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\docs\specpack\v9_specpack_v5_fromStable\V9_QA_RELEASES.md
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\docs\specpack\v9_specpack_v5_fromStable\V9_QUIZZES_REALITY.md
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\docs\specpack\v9_specpack_v5_fromStable\V9_ROADMAP_EXTREME_DETAIL.md
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\docs\specpack\v9_specpack_v5_fromStable\V9_ROUTES_REALITY_MAP.md
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\docs\specpack\v9_specpack_v5_fromStable\V9_TENANCY_REALITY.md
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\docs\specpack\v9_specpack_v5_fromStable\V9_UI_UX_REVAMP_PLAN.md
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\functions\api\_auth.js
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\functions\api\_store.js
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\functions\api\_utils.js
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\functions\api\app\public-settings\[appId].js
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\functions\api\app-logs\user.js
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\functions\api\auth\login.js
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\functions\api\auth\logout.js
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\functions\api\auth\me.js
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\functions\api\entities\[entity].js
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\functions\api\entities\[entity]\[id].js
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\functions\api\integrations\core\invoke-llm.js
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\Plan\Breslov Academy - Breslov Academy LMS Build.pdf
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\Plan\Breslov_Academy_Coding_Book_v9_1.pdf
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\Plan\Breslov_Academy_Master_Coding_Plan.pdf
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\Plan\Breslov_Academy_Master_Coding_Plan_Remastered.pdf
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\public\favicon.svg
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\public\manifest.json
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\public\robots.txt
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\public\about\index.html
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\public\contact\index.html
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\public\faq\index.html
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\public\how-it-works\index.html
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\public\pricing\index.html
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\public\privacy\index.html
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\public\terms\index.html
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\scripts\Clean-OldZips.ps1
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\scripts\generate-public-pages.mjs
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\scripts\release.ps1
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\scripts\tmp-repo-snapshot.ps1
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\scripts\update-gitlab-from-zip.ps1
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\src\App.jsx
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\src\globals.css
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\src\index.css
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\src\main.jsx
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\src\pages.config.js
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\src\api\appClient.js
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\src\api\base44Client.js
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\src\components\UserNotRegisteredError.jsx
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\src\components\academic\quizEngine.jsx
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\src\components\accessibility\AccessibilityMenu.jsx
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\src\components\admin\ContentProtectionSettings.jsx
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\src\components\ai\AcademicAdvisorChat.jsx
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\src\components\ai\AITutor.jsx
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\src\components\ai\AITutorInterface.jsx
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\src\components\ai\AiTutorPanel.jsx
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\src\components\ai\CourseRecommendations.jsx
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\src\components\analytics\attribution.jsx
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\src\components\analytics\ConversionFunnel.jsx
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\src\components\analytics\EngagementPredictor.jsx
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\src\components\analytics\LearningStyleAssessment.jsx
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\src\components\analytics\RevenueChart.jsx
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\src\components\analytics\StudentDashboard.jsx
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\src\components\analytics\track.jsx
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\src\components\announcements\AnnouncementsPanel.jsx
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\src\components\api\contracts.js
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\src\components\api\scoped.jsx
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\src\components\api\scopedEntities.js
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\src\components\api\TenancyBridge.jsx
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\src\components\api\tenancyEnforcer.js
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\src\components\api\tenancyRuntime.js
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\src\components\api\tenancyWarnings.js
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\src\components\auth\roles.jsx
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\src\components\automation\AutomationBuilder.jsx
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\src\components\career\ResumeBuilder.jsx
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\src\components\career\SalaryNegotiator.jsx
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\src\components\certificates\certificatesEngine.jsx
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\src\components\certificates\CertificateView.jsx
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\src\components\collaboration\Whiteboard.jsx
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\src\components\community\ReportButton.jsx
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\src\components\config\featureFlags.js
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\src\components\config\features.jsx
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\src\components\config\integrations.js
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\src\components\courses\CourseCard.jsx
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\src\components\creator\BulkOperations.jsx
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\src\components\dashboard\StatCard.jsx
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\src\components\drip\dripEngine.jsx
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\src\components\enterprise\TeamDashboard.jsx
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\src\components\focus\PomodoroTimer.jsx
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\src\components\gamification\AchievementBadge.jsx
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\src\components\gamification\GamificationLayout.jsx
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\src\components\gamification\PowerUpShop.jsx
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\src\components\hooks\useAITutor.js
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\src\components\hooks\useFeatureFlag.js
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\src\components\hooks\useLessonAccess.jsx
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\src\components\hooks\useSession.jsx
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\src\components\hooks\useStorefrontContext.jsx
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\src\components\hooks\useTerminology.jsx
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\src\components\insights\LearningInsights.jsx
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\src\components\instructor\CourseBuilder.jsx
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\src\components\instructor\InstructorDashboard.jsx
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\src\components\instructor\TeachCourseCurriculum.jsx
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\src\components\instructor\TeachCoursePricing.jsx
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\src\components\instructor\TeachCourseSettings.jsx
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\src\components\instructor\TeachCourseStudents.jsx
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\src\components\integrations\GoogleServiceConnector.jsx
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\src\components\language\FlashcardPractice.jsx
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\src\components\language\LanguageSelector.jsx
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\src\components\learning\BookmarkPanel.jsx
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\src\components\learning\CodePlayground.jsx
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\src\components\learning\DiscussionThread.jsx
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\src\components\learning\NotesPanel.jsx
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\src\components\learning\PremiumVideoPlayer.jsx
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\src\components\learning\QuizCard.jsx
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\src\components\learning\TranscriptPanel.jsx
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\src\components\marketing\CourseLandingPage.jsx
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\src\components\materials\materialsEngine.jsx
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\src\components\mobile\OfflineMode.jsx
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\src\components\moderation\ContentReportForm.jsx
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\src\components\monetization\OfferCard.jsx
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\src\components\navigation\CommandPalette.jsx
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\src\components\notifications\NotificationCenter.jsx
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\src\components\onboarding\OnboardingFlow.jsx
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\src\components\parent\StudentProgressReport.jsx
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\src\components\payouts\PayoutBatchManager.jsx
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\src\components\proctoring\ProctorView.jsx
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\src\components\protection\ProtectedContent.jsx
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\src\components\routing\PortalGate.jsx
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\src\components\scheduling\StudyCalendar.jsx
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\src\components\school\SchoolAnalytics.jsx
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\src\components\school\SchoolAnnouncements.jsx
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\src\components\school\SchoolAuditLog.jsx
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\src\components\school\SchoolContext.jsx
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\src\components\school\SchoolModeration.jsx
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\src\components\school\SchoolPayouts.jsx
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\src\components\school\SchoolProtectionSettings.jsx
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\src\components\school\SchoolSwitcher.jsx
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\src\components\school\TerminologySettings.jsx
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\src\components\search\AdvancedSearch.jsx
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\src\components\security\AccessGate.jsx
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\src\components\security\rateLimiter.js
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\src\components\seo\MetaTags.jsx
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\src\components\storefront\SchoolHero.jsx
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\src\components\study\MatchGame.jsx
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\src\components\study\WriteMode.jsx
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\src\components\subscription\PricingCard.jsx
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\src\components\subscriptions\subscriptionEngine.jsx
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\src\components\system\codeScanner.js
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\src\components\system\Drawer.jsx
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\src\components\system\ErrorBoundary.jsx
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\src\components\system\FeatureFlags.jsx
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\src\components\system\Modal.jsx
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\src\components\system\usePageState.jsx
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\src\components\system\useToast.js
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\src\components\system\VirtualizedList.jsx
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\src\components\testimonials\TestimonialCard.jsx
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\src\components\theme\ThemeProvider.jsx
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\src\components\theme\ThemeToggle.jsx
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\src\components\theme\tokens.js
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\src\components\ui\accordion.jsx
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\src\components\ui\alert-dialog.jsx
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\src\components\ui\alert.jsx
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\src\components\ui\aspect-ratio.jsx
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\src\components\ui\avatar.jsx
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\src\components\ui\badge.jsx
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\src\components\ui\breadcrumb.jsx
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\src\components\ui\button.jsx
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\src\components\ui\calendar.jsx
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\src\components\ui\card.jsx
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\src\components\ui\carousel.jsx
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\src\components\ui\chart.jsx
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\src\components\ui\checkbox.jsx
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\src\components\ui\collapsible.jsx
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\src\components\ui\command.jsx
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\src\components\ui\context-menu.jsx
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\src\components\ui\dialog.jsx
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\src\components\ui\drawer.jsx
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\src\components\ui\dropdown-menu.jsx
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\src\components\ui\EmptyState.jsx
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\src\components\ui\form.jsx
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\src\components\ui\GlassCard.jsx
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\src\components\ui\hover-card.jsx
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\src\components\ui\IconButton.jsx
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\src\components\ui\input-otp.jsx
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\src\components\ui\input.jsx
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\src\components\ui\label.jsx
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\src\components\ui\menubar.jsx
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\src\components\ui\navigation-menu.jsx
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\src\components\ui\PageShell.jsx
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\src\components\ui\pagination.jsx
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\src\components\ui\popover.jsx
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\src\components\ui\progress.jsx
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\src\components\ui\radio-group.jsx
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\src\components\ui\resizable.jsx
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\src\components\ui\scroll-area.jsx
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\src\components\ui\SectionHeader.jsx
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\src\components\ui\select.jsx
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\src\components\ui\separator.jsx
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\src\components\ui\sheet.jsx
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\src\components\ui\sidebar.jsx
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\src\components\ui\skeleton.jsx
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\src\components\ui\SkeletonLoaders.jsx
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\src\components\ui\slider.jsx
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\src\components\ui\sonner.jsx
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\src\components\ui\StatusBadge.jsx
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\src\components\ui\Stepper.jsx
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\src\components\ui\switch.jsx
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\src\components\ui\table.jsx
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\src\components\ui\tabs.jsx
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\src\components\ui\textarea.jsx
C:\Users\gav4y\OneDrive\Desktop\REPO\breslov-academy\src\components\ui\toast.jsx
```

### ROUTER HITS
```
.\CHECKSUMS_MANIFEST.sha256:392:06c5449f45154dabc3876e793d6d939b2f142d54ccd53a9a89384575831660c1  src/portals/app/AppPortal.jsx
.\CHECKSUMS_MANIFEST.sha256:393:16dd8ade3bc1316ee34df5bb61f3aa95d6f282f25b6242e1c2f52f4eaa3ffeaa  src/portals/app/OnboardingHub.jsx
.\package-lock.json:70:        "react-router-dom": "^7.12.0",
.\package-lock.json:8893:    "node_modules/react-router": {
.\package-lock.json:8895:      "resolved": "https://registry.npmjs.org/react-router/-/react-router-7.12.0.tgz",
.\package-lock.json:8915:    "node_modules/react-router-dom": {
.\package-lock.json:8917:      "resolved": "https://registry.npmjs.org/react-router-dom/-/react-router-dom-7.12.0.tgz",
.\package-lock.json:8921:        "react-router": "7.12.0"
.\index.html:24:      /* Avoid public prerender flicker on app/storefront routes (runs before app JS loads) */
.\package.json:78:    "react-router-dom": "^7.12.0",
.\public\contact\index.html:24:      /* Avoid public prerender flicker on app/storefront routes (runs before app JS loads) */
.\docs\v9.1-seo-prerender.md:9:- Hide the snapshot instantly on `/app/*` and `/s/*` to avoid flicker for signed-in users.
.\docs\v9.1-seo-prerender.md:35:  - 0 memberships -> `/app/onboarding`
.\docs\v9.1-seo-prerender.md:36:  - multiple memberships w/ no explicit selection -> `/app/SchoolSelect`
.\docs\v9.1-seo-prerender.md:37:  - teacher/admin -> `/app/teach`
.\docs\v9.1-seo-prerender.md:38:  - student -> `/app/dashboard`
.\docs\v9.1-portalization.md:10:- Authenticated product experience lives under `/app/*`.
.\docs\v9.1-portalization.md:36:- `/app/*` (legacy `Pages` map + case-insensitive dynamic routes)
.\docs\v9.1-portalization.md:38:  - `/app/teach/quizzes`
.\docs\v9.1-portalization.md:39:  - `/app/teach/quizzes/new`
.\docs\v9.1-portalization.md:40:  - `/app/teach/quizzes/:quizId`
.\docs\v9.1-portalization.md:41:  - `/app/quiz/:quizId`
.\docs\v9.1-portalization.md:42:  - `/app/my-quizzes`
.\docs\v9.1-portalization.md:45:Any route not matched by the public marketing portal or storefront is redirected to `/app/*` while preserving path + query + hash.
.\public\terms\index.html:24:      /* Avoid public prerender flicker on app/storefront routes (runs before app JS loads) */
.\public\about\index.html:24:      /* Avoid public prerender flicker on app/storefront routes (runs before app JS loads) */
.\public\how-it-works\index.html:24:      /* Avoid public prerender flicker on app/storefront routes (runs before app JS loads) */
.\public\privacy\index.html:24:      /* Avoid public prerender flicker on app/storefront routes (runs before app JS loads) */
.\public\pricing\index.html:24:      /* Avoid public prerender flicker on app/storefront routes (runs before app JS loads) */
.\_specpack\REPO_REALITY_AUDIT.md:59:rg -n "react-router|createBrowserRouter|Routes\b|Route\b|next/router|app\/" -S . | sed -n '1,200p'
.\docs\implementation\worksheets\WS-0001-session-source-of-truth.md:17:- App portal landing: `src/portals/app/AppPortal.jsx`
.\scripts\tmp-repo-snapshot.ps1:8:$router = rg -n "react-router|createBrowserRouter|Routes\\b|Route\\b|next/router|app/" -S . | Select-Object -First 200
.\docs\v9.1-legacy-route-map.md:8:- **Authenticated app:** `/app/*`
.\docs\v9.1-legacy-route-map.md:11:Any route that is **not** one of the public marketing routes, and does **not** start with `/s/` or `/app/`,
.\docs\v9.1-legacy-route-map.md:14:- `/<anything>` GåÆ `/app/<anything>`
.\docs\v9.1-legacy-route-map.md:17:- `/Dashboard` GåÆ `/app/Dashboard`
.\docs\v9.1-legacy-route-map.md:18:- `/courses` GåÆ `/app/courses`
.\docs\v9.1-legacy-route-map.md:19:- `/teach/quizzes` GåÆ `/app/teach/quizzes`
.\docs\v9.1-legacy-route-map.md:20:- `/my-quizzes` GåÆ `/app/my-quizzes`
.\docs\repo-snapshot.md:82:    "react-router-dom": "^6.26.0",
.\docs\repo-snapshot.md:116:- `src/App.jsx` uses `Routes`, `Route`, `Navigate` from `react-router-dom`.
.\docs\implementation\audits\ROUTING_PORTALIZATION_AUDIT.md:18:    `src/portals/app/AppPortal.jsx` + `src/portals/shared/PortalPageResolver.jsx`.
.\docs\implementation\audits\ROUTING_PORTALIZATION_AUDIT.md:27:    `/app/SchoolSelect` when needed.
.\src\lib\AuthContext.jsx:41:          const publicSettings = await requestJson(`/app/public-settings/${appParams.appId}`, {
.\src\utils\index.ts:15:// - Authenticated application lives under /app/*
.\checksums.sha256:393:06c5449f45154dabc3876e793d6d939b2f142d54ccd53a9a89384575831660c1  src/portals/app/AppPortal.jsx
.\checksums.sha256:394:16dd8ade3bc1316ee34df5bb61f3aa95d6f282f25b6242e1c2f52f4eaa3ffeaa  src/portals/app/OnboardingHub.jsx
.\src\pages\AdminOnboarding.jsx:10:import { useNavigate } from 'react-router-dom';
.\src\pages\Assignments.jsx:10:import { Link } from 'react-router-dom';
.\src\pages\AssignmentDetail.jsx:9:import { Link, useSearchParams } from 'react-router-dom';
.\src\lib\PageNotFound.jsx:1:import { useLocation } from 'react-router-dom';
.\src\pages\Cohorts.jsx:4:import { Link } from 'react-router-dom';
.\src\pages\CohortDetail.jsx:4:import { Link } from 'react-router-dom';
.\src\pages\CourseDetail.jsx:2:import { Link } from 'react-router-dom';
.\src\pages\Dashboard.jsx:8:import { Link } from 'react-router-dom';
.\src\pages\CourseSales.jsx:5:import { Link } from 'react-router-dom';
.\public\faq\index.html:24:      /* Avoid public prerender flicker on app/storefront routes (runs before app JS loads) */
.\src\portals\teacher\TeacherPortal.jsx:2:import { Routes, Route, Navigate } from 'react-router-dom';
.\src\lib\NavigationTracker.jsx:2:import { useLocation } from 'react-router-dom';
.\src\pages\IntegrationDetail.jsx:2:import { useSearchParams, useNavigate } from 'react-router-dom';
.\src\portals\public\PublicLayout.jsx:2:import { Link, Outlet, useLocation } from 'react-router-dom';
.\src\pages\IntegrationsMarketplace.jsx:2:import { Link } from 'react-router-dom';
.\docs\specpack\v9_specpack_v5_fromStable\REPO_REALITY_AUDIT.md:59:rg -n "react-router|createBrowserRouter|Routes\b|Route\b|next/router|app\/" -S . | sed -n '1,200p'
.\src\App.jsx:2:import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
.\src\App.jsx:31:import AppPortal from '@/portals/app/AppPortal';
.\src\App.jsx:83:              <Route path="/app/*" element={<AppPortal />} />
.\src\portals\superadmin\SuperAdminPortal.jsx:3:import AppPortal from '@/portals/app/AppPortal';
.\src\pages\InviteAccept.jsx:5:import { useNavigate } from 'react-router-dom';
.\src\pages\LanguageLearning.jsx:4:import { Link } from 'react-router-dom';
.\src\portals\LegacyToAppRedirect.jsx:2:import { Navigate, useLocation } from 'react-router-dom';
.\src\portals\LegacyToAppRedirect.jsx:16: * - /Dashboard -> /app/Dashboard (or /student/Dashboard if that's the current portal)
.\src\portals\LegacyToAppRedirect.jsx:18: * - /my-quizzes -> /app/my-quizzes
.\src\portals\app\AppPortal.jsx:2:import { Route, Routes, Navigate, useLocation, useParams } from 'react-router-dom';
.\src\portals\app\AppPortal.jsx:111: * Mounted at /app/* and also reused by /student/*, /teacher/*, /admin/*, /superadmin/*.
.\src\portals\app\OnboardingHub.jsx:2:import { useNavigate } from 'react-router-dom';
.\src\portals\app\OnboardingHub.jsx:73:                onClick={() => navigate(`/app/InviteAccept?token=${encodeURIComponent(token)}`)}
.\src\portals\app\OnboardingHub.jsx:85:            <Button onClick={() => navigate('/app/SchoolNew')}>Create School</Button>
.\src\portals\admin\AdminPortal.jsx:2:import { Routes, Route, Navigate } from 'react-router-dom';
.\src\portals\public\components\PublicContentPage.jsx:2:import { Link } from 'react-router-dom';
.\src\portals\shared\PortalSidebar.jsx:2:import { Link } from 'react-router-dom';
.\src\portals\student\StudentPortal.jsx:2:import { Routes, Route, Navigate } from 'react-router-dom';
.\src\portals\storefront\StorefrontPortal.jsx:2:import { Route, Routes, useParams } from 'react-router-dom';
.\src\portals\shared\PortalPageResolver.jsx:2:import { useParams, Navigate } from 'react-router-dom';
.\src\portals\shared\PortalLayout.jsx:2:import { Link } from 'react-router-dom';
.\src\pages\LessonViewerPremium.jsx:6:import { Link } from 'react-router-dom';
.\src\pages\Marketplace.jsx:8:import { Link } from 'react-router-dom';
.\src\pages\LessonViewer.jsx:11:import { Link } from 'react-router-dom';
.\src\pages\LearningPaths.jsx:4:import { Link } from 'react-router-dom';
.\src\pages\MyQuizzes.jsx:2:import { Link } from 'react-router-dom';
.\src\pages\MyProgress.jsx:8:import { Link } from 'react-router-dom';
.\src\pages\QuizTake.jsx:2:import { Link, useParams, useSearchParams } from 'react-router-dom';
.\src\portals\student\pages\StudentDashboard.jsx:3:import { Link } from 'react-router-dom';
.\src\pages\SchoolAdmin.jsx:3:import { useNavigate } from 'react-router-dom';
.\src\pages\SchoolCheckout.jsx:5:import { useNavigate } from 'react-router-dom';
.\src\portals\public\pages\SignupTeacher.jsx:6:import { Link } from 'react-router-dom';
.\src\pages\SchoolCourses.jsx:4:import { Link } from 'react-router-dom';
.\src\pages\SchoolJoin.jsx:3:import { useNavigate } from 'react-router-dom';
.\src\pages\SchoolLanding.jsx:4:import { Link } from 'react-router-dom';
.\src\components\courses\CourseCard.jsx:4:import { Link } from 'react-router-dom';
.\src\pages\SchoolNew.jsx:3:import { useNavigate } from 'react-router-dom';
.\src\portals\public\pages\SignupStudent.jsx:7:import { Link } from 'react-router-dom';
.\src\pages\SchoolPricing.jsx:4:import { Link } from 'react-router-dom';
.\src\pages\SchoolSearch.jsx:3:import { Link } from 'react-router-dom';
.\src\pages\SchoolSelect.jsx:3:import { useNavigate } from 'react-router-dom';
.\src\portals\public\pages\LoginChooser.jsx:2:import { Link } from 'react-router-dom';
.\src\portals\public\pages\SignupSchool.jsx:7:import { Link } from 'react-router-dom';
.\src\portals\public\pages\PublicHome.jsx:2:import { Navigate, Link } from 'react-router-dom';
.\src\pages\SchoolThankYou.jsx:5:import { Link } from 'react-router-dom';
.\src\portals\public\pages\SignupChooser.jsx:2:import { Link } from 'react-router-dom';
.\src\components\hooks\useStorefrontContext.jsx:1:import { useParams } from 'react-router-dom';
.\src\components\monetization\OfferCard.jsx:2:import { Link } from 'react-router-dom';
.\src\pages\StudySetNew.jsx:4:import { useNavigate } from 'react-router-dom';
.\src\pages\StudySet.jsx:7:import { Link } from 'react-router-dom';
.\src\components\navigation\CommandPalette.jsx:2:import { useNavigate } from 'react-router-dom';
.\src\pages\Teach.jsx:4:import { Link, useNavigate } from 'react-router-dom';
.\src\components\gamification\GamificationLayout.jsx:2:import { Link, useLocation } from 'react-router-dom';
.\src\pages\SubmissionForm.jsx:12:import { Link, useNavigate, useSearchParams } from 'react-router-dom';
.\src\components\utils\RECOVERY.md:185:- **Routing:** `src/portals/app/AppPortal.jsx` handles internal routing
.\src\components\notifications\NotificationCenter.jsx:13:import { Link } from 'react-router-dom';
.\src\pages\StudySets.jsx:7:import { Link } from 'react-router-dom';
.\src\pages\TeachLesson.jsx:5:import { useNavigate } from 'react-router-dom';
.\src\pages\TeachQuizEditor.jsx:2:import { Link, useNavigate, useParams } from 'react-router-dom';
.\src\pages\TeachQuizzes.jsx:2:import { Link } from 'react-router-dom';
.\src\pages\TeachCourseNew.jsx:4:import { useNavigate } from 'react-router-dom';
.\src\pages\TeachCourse.jsx:3:import { useNavigate } from 'react-router-dom';
.\src\pages\Vault.jsx:2:import { Link } from 'react-router-dom';
.\src\components\instructor\TeachCourseCurriculum.jsx:4:import { Link } from 'react-router-dom';
.\src\components\language\LanguageSelector.jsx:5:import { Link } from 'react-router-dom';
.\src\components\security\AccessGate.jsx:2:import { Link } from 'react-router-dom';
.\src\components\routing\PortalGate.jsx:2:import { Navigate, useLocation } from 'react-router-dom';
.\src\components\routing\PortalGate.jsx:77:    return <Navigate to="/app/onboarding" replace />;
.\src\components\routing\PortalGate.jsx:81:    return <Navigate to="/app/SchoolSelect" replace />;
.\src\components\storefront\SchoolHero.jsx:4:import { Link } from 'react-router-dom';
.\src\components\school\SchoolAnalytics.jsx:2:import { Link } from 'react-router-dom';
.\src\components\school\SchoolSwitcher.jsx:3:import { useNavigate } from 'react-router-dom';
.\src\components\school\SchoolContext.jsx:3:import { useNavigate } from 'react-router-dom';
```

### VAULT/REGISTRY HITS
```
.\BUILDINFO.json:14:    "Vault safety: hidden quiz take/editor routes added; pages accept ?quizId= fallback for Vault discovery.",
.\BUILDINFO.json:18:    "v10.0-r2: Public home redirects authenticated users to /app; login intent keys hardened; registry includes public/legal routes + aliases; LessonViewerPremium now uses useSession + scoped queries.",
.\index.html:66:        <div><div style="font-weight:600;font-size:13px;margin-bottom:6px;">What you get</div><ul><li>Protected lessons with watermarking, preview limits, and download rules</li><li>Storefront per school: landing, catalog, checkout, thank you</li><li>Quizzes: teacher builder, student attempts, course integration</li><li>Strict multi-tenancy enforcement (school isolation + scoped entities)</li><li>Vault + Feature Registry: zero feature loss, everything discoverable</li></ul></div><div><div style="font-weight:600;font-size:13px;margin-bottom:6px;">Built for real schools</div><p>Each school has its own branding, policies, products, staff, and learners GÇö while the platform remains unified and secure.</p></div>
.\ROADMAP_CODEX.md:6:- Zero deletions; Vault always; tenant isolation; public browsing without protected material leakage. (PDF pp. 2, 21, 40)
.\ROADMAP_CODEX.md:13:- Feature registry + Vault contract; nav derived from registry. (PDF pp. 24, 26)
.\CHECKSUMS_MANIFEST.sha256:187:36bd761c62050fc94a5ede3fe234f74fc52fab029703d23330421c90efe7c5d0  src/components/navigation/CommandPalette.jsx
.\CHECKSUMS_MANIFEST.sha256:290:621178f1f0ce7a9e8abeccedb08452cf1a8c244c90ba6e4098347d521db4fd74  src/components/utils/featureRegistry.jsx
.\CHECKSUMS_MANIFEST.sha256:388:eca83356673a6e8ef4fa3db27d0d42be12c32ce2285ebb9d8c57abc9242c2932  src/pages/Vault.jsx
.\HEALTHCHECKS.md:14:   - Open: Dashboard, Courses, CourseDetail, LessonViewer, Reader, Vault
.\GEMINI.md:56:Admins can visit `/integrity` to run automated scans for registry drift and data leakage.
.\CODE_BOOK_PLAN.md:12:- Zero deletions; Vault always; tenant isolation; public browsing without protected material leakage.
.\CODE_BOOK_PLAN.md:32:5) Feature registry + Vault
.\CODE_BOOK_PLAN.md:33:   - Registry contract, Vault requirements, integrity checks, legacy compatibility.
.\ROADMAP_STATUS.md:9:- [ ] Feature registry + Vault contract; nav derived from registry. (PDF pp. 24, 26)
.\README.md:39:- **Diagnostics:** Real-time `/integrity` dashboard for admins to detect registry drift and tenancy leaks.
.\ROADMAP.md:7:- Zero deletions; Vault always; tenant isolation; public browsing without protected material leakage. (PDF pp. 2, 21, 40)
.\ROADMAP.md:22:- Feature registry and Vault contract: nav derived from registry; Vault includes all features. (PDF pp. 24, 26)
.\ROADMAP.md:23:- Student Portal Core: school isolation, AccessGate for locked lessons, registry-based navigation. (PDF pp. 24, 29, 31)
.\checksums.sha256:188:36bd761c62050fc94a5ede3fe234f74fc52fab029703d23330421c90efe7c5d0  src/components/navigation/CommandPalette.jsx
.\checksums.sha256:291:621178f1f0ce7a9e8abeccedb08452cf1a8c244c90ba6e4098347d521db4fd74  src/components/utils/featureRegistry.jsx
.\checksums.sha256:389:eca83356673a6e8ef4fa3db27d0d42be12c32ce2285ebb9d8c57abc9242c2932  src/pages/Vault.jsx
.\docs\REALITY_MAP.md:11:| **Vault** | `src/pages/Vault.jsx` | Renders the registry; safety net for navigation. |
.\docs\AUDIT_REPORT_V9_1.md:21:*   **Registry:** The canonical feature registry (`src/components/config/features.jsx`) is intact and used by the new `PortalSidebar`.
.\docs\AUDIT_REPORT_V9_1.md:22:*   **Routing:** Legacy routes (e.g., `/dashboard`) are preserved via `App.jsx` redirects or the `AppPortal` fallback. The new `PortalPageResolver` correctly maps registry keys to components for the new portal routes.
.\docs\repo-snapshot.md:119:- `src/components/config/features.jsx` defines routes for the registry.
.\docs\repo-snapshot.md:122:- `src/components/config/features.jsx` is the canonical feature registry.
.\docs\repo-snapshot.md:123:- `src/pages/Vault.jsx` implements the Vault UI.
.\docs\repo-snapshot.md:124:- `src/components/navigation/CommandPalette.jsx` consumes the registry.
.\public\terms\index.html:66:        <div><div style="font-weight:600;font-size:13px;margin-bottom:6px;">What you get</div><ul><li>Protected lessons with watermarking, preview limits, and download rules</li><li>Storefront per school: landing, catalog, checkout, thank you</li><li>Quizzes: teacher builder, student attempts, course integration</li><li>Strict multi-tenancy enforcement (school isolation + scoped entities)</li><li>Vault + Feature Registry: zero feature loss, everything discoverable</li></ul></div><div><div style="font-weight:600;font-size:13px;margin-bottom:6px;">Built for real schools</div><p>Each school has its own branding, policies, products, staff, and learners GÇö while the platform remains unified and secure.</p></div>
.\_specpack\BACKLOG_STORIES.md:47:## Epic B GÇö Registry + Vault + Integrity
.\_specpack\BACKLOG_STORIES.md:51:  - Create/restore registry module.
.\_specpack\BACKLOG_STORIES.md:56:  - No inline registries exist inside Vault/nav.
.\_specpack\BACKLOG_STORIES.md:58:### B2 GÇö Vault Directory
.\_specpack\BACKLOG_STORIES.md:59:**Story:** As a user, I can find any feature (even GÇ£hiddenGÇ¥ ones) via Vault.
.\_specpack\BACKLOG_STORIES.md:61:  - Vault renders from registry.
.\_specpack\BACKLOG_STORIES.md:65:  - Vault never renders links user cannot access.
.\_specpack\BACKLOG_STORIES.md:66:  - Vault exposes all accessible features.
.\_specpack\BACKLOG_STORIES.md:72:  - Checks: registry vs router, tenancy heuristics, leakage heuristics.
.\src\utils\index.ts:91:    // Try registry-based canonical routing first.
.\scripts\tmp-repo-snapshot.ps1:9:$vault = rg -n "Vault|featureRegistry|registry|Command.*Palette" -S . | Select-Object -First 200
.\_specpack\ARCHITECTURE_NORTH_STAR.md:42:- alias routes in registry
.\_specpack\ARCHITECTURE_NORTH_STAR.md:84:## 4) Feature Registry + Vault as the anti-loss safety net
.\_specpack\ARCHITECTURE_NORTH_STAR.md:85:One typed registry drives:
.\_specpack\ARCHITECTURE_NORTH_STAR.md:87:- Vault (full directory)
.\_specpack\ARCHITECTURE_NORTH_STAR.md:91:Registry must be a central module (`src/config/features.*` or `src/registry/featureRegistry.*`).
.\_specpack\ARCHITECTURE_NORTH_STAR.md:92:Never inline registry arrays in UI pages.
.\_specpack\ARCHITECTURE_NORTH_STAR.md:98:- validate registry vs router existence (best-effort)
.\_specpack\ARCHITECTURE_NORTH_STAR.md:107:- No feature deletions. If nav is simplified, keep feature in Vault.
.\src\pages.config.js:96:const Vault = React.lazy(() => import('./pages/Vault'));
.\src\pages.config.js:177:    "Vault": Vault,
.\public\privacy\index.html:66:        <div><div style="font-weight:600;font-size:13px;margin-bottom:6px;">What you get</div><ul><li>Protected lessons with watermarking, preview limits, and download rules</li><li>Storefront per school: landing, catalog, checkout, thank you</li><li>Quizzes: teacher builder, student attempts, course integration</li><li>Strict multi-tenancy enforcement (school isolation + scoped entities)</li><li>Vault + Feature Registry: zero feature loss, everything discoverable</li></ul></div><div><div style="font-weight:600;font-size:13px;margin-bottom:6px;">Built for real schools</div><p>Each school has its own branding, policies, products, staff, and learners GÇö while the platform remains unified and secure.</p></div>
.\package-lock.json:105:      "resolved": "https://registry.npmjs.org/@alloc/quick-lru/-/quick-lru-5.2.0.tgz",
.\package-lock.json:118:      "resolved": "https://registry.npmjs.org/@babel/code-frame/-/code-frame-7.27.1.tgz",
.\package-lock.json:133:      "resolved": "https://registry.npmjs.org/@babel/compat-data/-/compat-data-7.28.5.tgz",
.\package-lock.json:143:      "resolved": "https://registry.npmjs.org/@babel/core/-/core-7.28.5.tgz",
.\package-lock.json:174:      "resolved": "https://registry.npmjs.org/@babel/generator/-/generator-7.28.5.tgz",
.\package-lock.json:191:      "resolved": "https://registry.npmjs.org/@babel/helper-compilation-targets/-/helper-compilation-targets-7.27.2.tgz",
.\package-lock.json:208:      "resolved": "https://registry.npmjs.org/@babel/helper-globals/-/helper-globals-7.28.0.tgz",
.\package-lock.json:218:      "resolved": "https://registry.npmjs.org/@babel/helper-module-imports/-/helper-module-imports-7.27.1.tgz",
.\package-lock.json:232:      "resolved": "https://registry.npmjs.org/@babel/helper-module-transforms/-/helper-module-transforms-7.28.3.tgz",
.\package-lock.json:250:      "resolved": "https://registry.npmjs.org/@babel/helper-plugin-utils/-/helper-plugin-utils-7.27.1.tgz",
.\package-lock.json:260:      "resolved": "https://registry.npmjs.org/@babel/helper-string-parser/-/helper-string-parser-7.27.1.tgz",
.\package-lock.json:270:      "resolved": "https://registry.npmjs.org/@babel/helper-validator-identifier/-/helper-validator-identifier-7.28.5.tgz",
.\package-lock.json:280:      "resolved": "https://registry.npmjs.org/@babel/helper-validator-option/-/helper-validator-option-7.27.1.tgz",
.\package-lock.json:290:      "resolved": "https://registry.npmjs.org/@babel/helpers/-/helpers-7.28.4.tgz",
.\package-lock.json:304:      "resolved": "https://registry.npmjs.org/@babel/parser/-/parser-7.28.5.tgz",
.\package-lock.json:320:      "resolved": "https://registry.npmjs.org/@babel/plugin-transform-react-jsx-self/-/plugin-transform-react-jsx-self-7.27.1.tgz",
.\package-lock.json:336:      "resolved": "https://registry.npmjs.org/@babel/plugin-transform-react-jsx-source/-/plugin-transform-react-jsx-source-7.27.1.tgz",
.\package-lock.json:352:      "resolved": "https://registry.npmjs.org/@babel/runtime/-/runtime-7.28.4.tgz",
.\package-lock.json:361:      "resolved": "https://registry.npmjs.org/@babel/template/-/template-7.27.2.tgz",
.\package-lock.json:376:      "resolved": "https://registry.npmjs.org/@babel/traverse/-/traverse-7.28.5.tgz",
.\package-lock.json:395:      "resolved": "https://registry.npmjs.org/@babel/types/-/types-7.28.5.tgz",
.\package-lock.json:409:      "resolved": "https://registry.npmjs.org/@date-fns/tz/-/tz-1.4.1.tgz",
.\package-lock.json:415:      "resolved": "https://registry.npmjs.org/@dimforge/rapier3d-compat/-/rapier3d-compat-0.12.0.tgz",
.\package-lock.json:421:      "resolved": "https://registry.npmjs.org/@esbuild/aix-ppc64/-/aix-ppc64-0.27.2.tgz",
.\package-lock.json:438:      "resolved": "https://registry.npmjs.org/@esbuild/android-arm/-/android-arm-0.27.2.tgz",
.\package-lock.json:455:      "resolved": "https://registry.npmjs.org/@esbuild/android-arm64/-/android-arm64-0.27.2.tgz",
.\package-lock.json:472:      "resolved": "https://registry.npmjs.org/@esbuild/android-x64/-/android-x64-0.27.2.tgz",
.\package-lock.json:489:      "resolved": "https://registry.npmjs.org/@esbuild/darwin-arm64/-/darwin-arm64-0.27.2.tgz",
.\package-lock.json:506:      "resolved": "https://registry.npmjs.org/@esbuild/darwin-x64/-/darwin-x64-0.27.2.tgz",
.\package-lock.json:523:      "resolved": "https://registry.npmjs.org/@esbuild/freebsd-arm64/-/freebsd-arm64-0.27.2.tgz",
.\package-lock.json:540:      "resolved": "https://registry.npmjs.org/@esbuild/freebsd-x64/-/freebsd-x64-0.27.2.tgz",
.\package-lock.json:557:      "resolved": "https://registry.npmjs.org/@esbuild/linux-arm/-/linux-arm-0.27.2.tgz",
.\package-lock.json:574:      "resolved": "https://registry.npmjs.org/@esbuild/linux-arm64/-/linux-arm64-0.27.2.tgz",
.\package-lock.json:591:      "resolved": "https://registry.npmjs.org/@esbuild/linux-ia32/-/linux-ia32-0.27.2.tgz",
.\package-lock.json:608:      "resolved": "https://registry.npmjs.org/@esbuild/linux-loong64/-/linux-loong64-0.27.2.tgz",
.\package-lock.json:625:      "resolved": "https://registry.npmjs.org/@esbuild/linux-mips64el/-/linux-mips64el-0.27.2.tgz",
.\package-lock.json:642:      "resolved": "https://registry.npmjs.org/@esbuild/linux-ppc64/-/linux-ppc64-0.27.2.tgz",
.\package-lock.json:659:      "resolved": "https://registry.npmjs.org/@esbuild/linux-riscv64/-/linux-riscv64-0.27.2.tgz",
.\package-lock.json:676:      "resolved": "https://registry.npmjs.org/@esbuild/linux-s390x/-/linux-s390x-0.27.2.tgz",
.\package-lock.json:693:      "resolved": "https://registry.npmjs.org/@esbuild/linux-x64/-/linux-x64-0.27.2.tgz",
.\package-lock.json:710:      "resolved": "https://registry.npmjs.org/@esbuild/netbsd-arm64/-/netbsd-arm64-0.27.2.tgz",
.\package-lock.json:727:      "resolved": "https://registry.npmjs.org/@esbuild/netbsd-x64/-/netbsd-x64-0.27.2.tgz",
.\package-lock.json:744:      "resolved": "https://registry.npmjs.org/@esbuild/openbsd-arm64/-/openbsd-arm64-0.27.2.tgz",
.\package-lock.json:761:      "resolved": "https://registry.npmjs.org/@esbuild/openbsd-x64/-/openbsd-x64-0.27.2.tgz",
.\package-lock.json:778:      "resolved": "https://registry.npmjs.org/@esbuild/openharmony-arm64/-/openharmony-arm64-0.27.2.tgz",
.\package-lock.json:795:      "resolved": "https://registry.npmjs.org/@esbuild/sunos-x64/-/sunos-x64-0.27.2.tgz",
.\package-lock.json:812:      "resolved": "https://registry.npmjs.org/@esbuild/win32-arm64/-/win32-arm64-0.27.2.tgz",
.\package-lock.json:829:      "resolved": "https://registry.npmjs.org/@esbuild/win32-ia32/-/win32-ia32-0.27.2.tgz",
.\package-lock.json:846:      "resolved": "https://registry.npmjs.org/@esbuild/win32-x64/-/win32-x64-0.27.2.tgz",
.\package-lock.json:863:      "resolved": "https://registry.npmjs.org/@eslint-community/eslint-utils/-/eslint-utils-4.9.1.tgz",
.\package-lock.json:882:      "resolved": "https://registry.npmjs.org/eslint-visitor-keys/-/eslint-visitor-keys-3.4.3.tgz",
.\package-lock.json:895:      "resolved": "https://registry.npmjs.org/@eslint-community/regexpp/-/regexpp-4.12.2.tgz",
.\package-lock.json:905:      "resolved": "https://registry.npmjs.org/@eslint/config-array/-/config-array-0.21.1.tgz",
.\package-lock.json:920:      "resolved": "https://registry.npmjs.org/@eslint/config-helpers/-/config-helpers-0.4.2.tgz",
.\package-lock.json:933:      "resolved": "https://registry.npmjs.org/@eslint/core/-/core-0.17.0.tgz",
.\package-lock.json:946:      "resolved": "https://registry.npmjs.org/@eslint/eslintrc/-/eslintrc-3.3.3.tgz",
.\package-lock.json:970:      "resolved": "https://registry.npmjs.org/globals/-/globals-14.0.0.tgz",
.\package-lock.json:983:      "resolved": "https://registry.npmjs.org/@eslint/js/-/js-9.39.2.tgz",
.\package-lock.json:996:      "resolved": "https://registry.npmjs.org/@eslint/object-schema/-/object-schema-2.1.7.tgz",
.\package-lock.json:1006:      "resolved": "https://registry.npmjs.org/@eslint/plugin-kit/-/plugin-kit-0.4.1.tgz",
.\package-lock.json:1020:      "resolved": "https://registry.npmjs.org/@floating-ui/core/-/core-1.7.3.tgz",
.\package-lock.json:1029:      "resolved": "https://registry.npmjs.org/@floating-ui/dom/-/dom-1.7.4.tgz",
.\package-lock.json:1039:      "resolved": "https://registry.npmjs.org/@floating-ui/react-dom/-/react-dom-2.1.6.tgz",
.\package-lock.json:1052:      "resolved": "https://registry.npmjs.org/@floating-ui/utils/-/utils-0.2.10.tgz",
.\package-lock.json:1058:      "resolved": "https://registry.npmjs.org/@hello-pangea/dnd/-/dnd-18.0.1.tgz",
.\package-lock.json:1075:      "resolved": "https://registry.npmjs.org/@hookform/resolvers/-/resolvers-5.2.2.tgz",
.\package-lock.json:1087:      "resolved": "https://registry.npmjs.org/@humanfs/core/-/core-0.19.1.tgz",
.\package-lock.json:1097:      "resolved": "https://registry.npmjs.org/@humanfs/node/-/node-0.16.7.tgz",
.\package-lock.json:1111:      "resolved": "https://registry.npmjs.org/@humanwhocodes/module-importer/-/module-importer-1.0.1.tgz",
.\package-lock.json:1125:      "resolved": "https://registry.npmjs.org/@humanwhocodes/retry/-/retry-0.4.3.tgz",
.\package-lock.json:1139:      "resolved": "https://registry.npmjs.org/@jridgewell/gen-mapping/-/gen-mapping-0.3.13.tgz",
.\package-lock.json:1150:      "resolved": "https://registry.npmjs.org/@jridgewell/remapping/-/remapping-2.3.5.tgz",
.\package-lock.json:1161:      "resolved": "https://registry.npmjs.org/@jridgewell/resolve-uri/-/resolve-uri-3.1.2.tgz",
.\package-lock.json:1171:      "resolved": "https://registry.npmjs.org/@jridgewell/sourcemap-codec/-/sourcemap-codec-1.5.5.tgz",
.\package-lock.json:1178:      "resolved": "https://registry.npmjs.org/@jridgewell/trace-mapping/-/trace-mapping-0.3.31.tgz",
.\package-lock.json:1189:      "resolved": "https://registry.npmjs.org/@mediapipe/tasks-vision/-/tasks-vision-0.10.17.tgz",
.\package-lock.json:1195:      "resolved": "https://registry.npmjs.org/@monogrid/gainmap-js/-/gainmap-js-3.4.0.tgz",
.\package-lock.json:1207:      "resolved": "https://registry.npmjs.org/@pdf-lib/standard-fonts/-/standard-fonts-1.0.0.tgz",
.\package-lock.json:1216:      "resolved": "https://registry.npmjs.org/@pdf-lib/upng/-/upng-1.0.1.tgz",
.\package-lock.json:1225:      "resolved": "https://registry.npmjs.org/@playwright/test/-/test-1.57.0.tgz",
.\package-lock.json:1241:      "resolved": "https://registry.npmjs.org/@radix-ui/number/-/number-1.1.1.tgz",
.\package-lock.json:1247:      "resolved": "https://registry.npmjs.org/@radix-ui/primitive/-/primitive-1.1.3.tgz",
.\package-lock.json:1253:      "resolved": "https://registry.npmjs.org/@radix-ui/react-accordion/-/react-accordion-1.2.12.tgz",
.\package-lock.json:1284:      "resolved": "https://registry.npmjs.org/@radix-ui/react-alert-dialog/-/react-alert-dialog-1.1.15.tgz",
.\package-lock.json:1312:      "resolved": "https://registry.npmjs.org/@radix-ui/react-slot/-/react-slot-1.2.3.tgz",
.\package-lock.json:1330:      "resolved": "https://registry.npmjs.org/@radix-ui/react-arrow/-/react-arrow-1.1.7.tgz",
.\package-lock.json:1353:      "resolved": "https://registry.npmjs.org/@radix-ui/react-aspect-ratio/-/react-aspect-ratio-1.1.8.tgz",
.\package-lock.json:1376:      "resolved": "https://registry.npmjs.org/@radix-ui/react-primitive/-/react-primitive-2.1.4.tgz",
.\package-lock.json:1399:      "resolved": "https://registry.npmjs.org/@radix-ui/react-avatar/-/react-avatar-1.1.11.tgz",
.\package-lock.json:1426:      "resolved": "https://registry.npmjs.org/@radix-ui/react-context/-/react-context-1.1.3.tgz",
.\package-lock.json:1441:      "resolved": "https://registry.npmjs.org/@radix-ui/react-primitive/-/react-primitive-2.1.4.tgz",
.\package-lock.json:1464:      "resolved": "https://registry.npmjs.org/@radix-ui/react-checkbox/-/react-checkbox-1.3.3.tgz",
.\package-lock.json:1494:      "resolved": "https://registry.npmjs.org/@radix-ui/react-collapsible/-/react-collapsible-1.1.12.tgz",
.\package-lock.json:1524:      "resolved": "https://registry.npmjs.org/@radix-ui/react-collection/-/react-collection-1.1.7.tgz",
.\package-lock.json:1550:      "resolved": "https://registry.npmjs.org/@radix-ui/react-slot/-/react-slot-1.2.3.tgz",
.\package-lock.json:1568:      "resolved": "https://registry.npmjs.org/@radix-ui/react-compose-refs/-/react-compose-refs-1.1.2.tgz",
.\package-lock.json:1583:      "resolved": "https://registry.npmjs.org/@radix-ui/react-context/-/react-context-1.1.2.tgz",
.\package-lock.json:1598:      "resolved": "https://registry.npmjs.org/@radix-ui/react-context-menu/-/react-context-menu-2.2.16.tgz",
.\package-lock.json:1626:      "resolved": "https://registry.npmjs.org/@radix-ui/react-dialog/-/react-dialog-1.1.15.tgz",
.\package-lock.json:1662:      "resolved": "https://registry.npmjs.org/@radix-ui/react-slot/-/react-slot-1.2.3.tgz",
.\package-lock.json:1680:      "resolved": "https://registry.npmjs.org/@radix-ui/react-direction/-/react-direction-1.1.1.tgz",
.\package-lock.json:1695:      "resolved": "https://registry.npmjs.org/@radix-ui/react-dismissable-layer/-/react-dismissable-layer-1.1.11.tgz",
.\package-lock.json:1722:      "resolved": "https://registry.npmjs.org/@radix-ui/react-dropdown-menu/-/react-dropdown-menu-2.1.16.tgz",
.\package-lock.json:1751:      "resolved": "https://registry.npmjs.org/@radix-ui/react-focus-guards/-/react-focus-guards-1.1.3.tgz",
.\package-lock.json:1766:      "resolved": "https://registry.npmjs.org/@radix-ui/react-focus-scope/-/react-focus-scope-1.1.7.tgz",
.\package-lock.json:1791:      "resolved": "https://registry.npmjs.org/@radix-ui/react-hover-card/-/react-hover-card-1.1.15.tgz",
.\package-lock.json:1822:      "resolved": "https://registry.npmjs.org/@radix-ui/react-id/-/react-id-1.1.1.tgz",
.\package-lock.json:1840:      "resolved": "https://registry.npmjs.org/@radix-ui/react-label/-/react-label-2.1.8.tgz",
.\package-lock.json:1863:      "resolved": "https://registry.npmjs.org/@radix-ui/react-primitive/-/react-primitive-2.1.4.tgz",
.\package-lock.json:1886:      "resolved": "https://registry.npmjs.org/@radix-ui/react-menu/-/react-menu-2.1.16.tgz",
.\package-lock.json:1926:      "resolved": "https://registry.npmjs.org/@radix-ui/react-slot/-/react-slot-1.2.3.tgz",
.\package-lock.json:1944:      "resolved": "https://registry.npmjs.org/@radix-ui/react-menubar/-/react-menubar-1.1.16.tgz",
.\package-lock.json:1976:      "resolved": "https://registry.npmjs.org/@radix-ui/react-navigation-menu/-/react-navigation-menu-1.2.14.tgz",
.\package-lock.json:2012:      "resolved": "https://registry.npmjs.org/@radix-ui/react-popover/-/react-popover-1.1.15.tgz",
.\package-lock.json:2049:      "resolved": "https://registry.npmjs.org/@radix-ui/react-slot/-/react-slot-1.2.3.tgz",
.\package-lock.json:2067:      "resolved": "https://registry.npmjs.org/@radix-ui/react-popper/-/react-popper-1.2.8.tgz",
.\package-lock.json:2099:      "resolved": "https://registry.npmjs.org/@radix-ui/react-portal/-/react-portal-1.1.9.tgz",
.\package-lock.json:2123:      "resolved": "https://registry.npmjs.org/@radix-ui/react-presence/-/react-presence-1.1.5.tgz",
.\package-lock.json:2147:      "resolved": "https://registry.npmjs.org/@radix-ui/react-primitive/-/react-primitive-2.1.3.tgz",
.\package-lock.json:2170:      "resolved": "https://registry.npmjs.org/@radix-ui/react-slot/-/react-slot-1.2.3.tgz",
.\package-lock.json:2188:      "resolved": "https://registry.npmjs.org/@radix-ui/react-progress/-/react-progress-1.1.8.tgz",
.\package-lock.json:2212:      "resolved": "https://registry.npmjs.org/@radix-ui/react-context/-/react-context-1.1.3.tgz",
.\package-lock.json:2227:      "resolved": "https://registry.npmjs.org/@radix-ui/react-primitive/-/react-primitive-2.1.4.tgz",
.\package-lock.json:2250:      "resolved": "https://registry.npmjs.org/@radix-ui/react-radio-group/-/react-radio-group-1.3.8.tgz",
.\package-lock.json:2282:      "resolved": "https://registry.npmjs.org/@radix-ui/react-roving-focus/-/react-roving-focus-1.1.11.tgz",
.\package-lock.json:2313:      "resolved": "https://registry.npmjs.org/@radix-ui/react-scroll-area/-/react-scroll-area-1.2.10.tgz",
.\package-lock.json:2344:      "resolved": "https://registry.npmjs.org/@radix-ui/react-select/-/react-select-2.2.6.tgz",
.\package-lock.json:2387:      "resolved": "https://registry.npmjs.org/@radix-ui/react-slot/-/react-slot-1.2.3.tgz",
.\package-lock.json:2405:      "resolved": "https://registry.npmjs.org/@radix-ui/react-separator/-/react-separator-1.1.8.tgz",
.\package-lock.json:2428:      "resolved": "https://registry.npmjs.org/@radix-ui/react-primitive/-/react-primitive-2.1.4.tgz",
.\package-lock.json:2451:      "resolved": "https://registry.npmjs.org/@radix-ui/react-slider/-/react-slider-1.3.6.tgz",
.\package-lock.json:2484:      "resolved": "https://registry.npmjs.org/@radix-ui/react-slot/-/react-slot-1.2.4.tgz",
.\package-lock.json:2502:      "resolved": "https://registry.npmjs.org/@radix-ui/react-switch/-/react-switch-1.2.6.tgz",
.\package-lock.json:2531:      "resolved": "https://registry.npmjs.org/@radix-ui/react-tabs/-/react-tabs-1.1.13.tgz",
.\package-lock.json:2561:      "resolved": "https://registry.npmjs.org/@radix-ui/react-toast/-/react-toast-1.2.15.tgz",
.\package-lock.json:2595:      "resolved": "https://registry.npmjs.org/@radix-ui/react-toggle/-/react-toggle-1.1.10.tgz",
.\package-lock.json:2620:      "resolved": "https://registry.npmjs.org/@radix-ui/react-toggle-group/-/react-toggle-group-1.1.11.tgz",
.\package-lock.json:2649:      "resolved": "https://registry.npmjs.org/@radix-ui/react-tooltip/-/react-tooltip-1.2.8.tgz",
.\package-lock.json:2683:      "resolved": "https://registry.npmjs.org/@radix-ui/react-slot/-/react-slot-1.2.3.tgz",
.\package-lock.json:2701:      "resolved": "https://registry.npmjs.org/@radix-ui/react-use-callback-ref/-/react-use-callback-ref-1.1.1.tgz",
.\package-lock.json:2716:      "resolved": "https://registry.npmjs.org/@radix-ui/react-use-controllable-state/-/react-use-controllable-state-1.2.2.tgz",
.\package-lock.json:2735:      "resolved": "https://registry.npmjs.org/@radix-ui/react-use-effect-event/-/react-use-effect-event-0.0.2.tgz",
.\package-lock.json:2753:      "resolved": "https://registry.npmjs.org/@radix-ui/react-use-escape-keydown/-/react-use-escape-keydown-1.1.1.tgz",
.\package-lock.json:2771:      "resolved": "https://registry.npmjs.org/@radix-ui/react-use-is-hydrated/-/react-use-is-hydrated-0.1.0.tgz",
.\package-lock.json:2789:      "resolved": "https://registry.npmjs.org/@radix-ui/react-use-layout-effect/-/react-use-layout-effect-1.1.1.tgz",
.\package-lock.json:2804:      "resolved": "https://registry.npmjs.org/@radix-ui/react-use-previous/-/react-use-previous-1.1.1.tgz",
.\package-lock.json:2819:      "resolved": "https://registry.npmjs.org/@radix-ui/react-use-rect/-/react-use-rect-1.1.1.tgz",
.\package-lock.json:2837:      "resolved": "https://registry.npmjs.org/@radix-ui/react-use-size/-/react-use-size-1.1.1.tgz",
.\package-lock.json:2855:      "resolved": "https://registry.npmjs.org/@radix-ui/react-visually-hidden/-/react-visually-hidden-1.2.3.tgz",
```

### TENANT HITS
```
.\CODE_BOOK_PLAN.md:12:- Zero deletions; Vault always; tenant isolation; public browsing without protected material leakage.
.\CODE_BOOK_PLAN.md:29:   - Roles, permissions matrix, tenant scoping rules, audit logging.
.\GEMINI.md:6:Breslov Academy is a **multi-tenant white-label Learning Management System (LMS)** designed for high-trust educational content delivery.
.\BUILDINFO.json:20:    "v10.0-r4: Phase 2 tenancy hardening (pass 2) GÇö fixed public storefront unscoped id queries (Offer/Transaction/Course/Lesson/Review), allowed secure invite token lookup, hardened scoped helpers to enforce school_id, and migrated entitlement utilities to scoped helpers.",
.\cloudflare\schema.sql:4:  school_id TEXT,
.\cloudflare\schema.sql:12:CREATE INDEX IF NOT EXISTS idx_entities_entity_school ON entities(entity, school_id);
.\SECURITY_INVARIANTS.md:10:- The runtime enforcer will block missing/incorrect `school_id`.
.\functions\api\_store.js:90:  if (filters.school_id) {
.\functions\api\_store.js:91:    sql += ' AND school_id = ?';
.\functions\api\_store.js:92:    bindings.push(String(filters.school_id));
.\functions\api\_store.js:105:  const ignoredKeys = ['id', 'school_id', 'user_email'];
.\functions\api\_store.js:130:    'INSERT INTO entities (id, entity, school_id, user_email, data, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)'
.\functions\api\_store.js:134:    record.school_id ? String(record.school_id) : null,
.\functions\api\_store.js:171:    'UPDATE entities SET data = ?, school_id = ?, user_email = ?, updated_at = ? WHERE entity = ? AND id = ?'
.\functions\api\_store.js:174:    updated.school_id ? String(updated.school_id) : null,
.\functions\api\_store.js:198:  const ignoredKeys = ['id', 'school_id', 'user_email'];
.\scripts\tmp-repo-snapshot.ps1:10:$tenant = rg -n "tenant|schoolSlug|school_id|activeSchool" -S . | Select-Object -First 200
.\scripts\tmp-repo-snapshot.ps1:42:$lines += $tenant
.\docs\implementation\audits\ROUTING_PORTALIZATION_AUDIT.md:13:- Storefront: `/s/:schoolSlug`, `/s/:schoolSlug/courses`, `/s/:schoolSlug/course/:courseId`,
.\docs\implementation\audits\ROUTING_PORTALIZATION_AUDIT.md:14:  `/s/:schoolSlug/pricing`, `/s/:schoolSlug/checkout`, `/s/:schoolSlug/thank-you`
.\docs\implementation\audits\ROUTING_PORTALIZATION_AUDIT.md:25:- Normalizes activeSchoolId selection and blocks portals without active school when required
.\docs\V9_1_STABLE_RELEASE.md:9:- **Tenancy:** Strict `school_id` enforcement via `tenancyEnforcer.js` + `scoped.jsx`.
.\ROADMAP_STATUS.md:10:- [ ] Student Portal Core requirements (tenant isolation, AccessGate for locked lessons). (PDF pp. 24, 29, 31)
.\_specpack\CONTENT_PROTECTION_MATERIALS_ENGINE.md:42:- `getLessonAccess({lessonId, userId, tenantId}) -> { state, unlockAt, reasons, previewAllowed }`
.\_specpack\CONTENT_PROTECTION_MATERIALS_ENGINE.md:43:- `getLessonMaterials({lessonId, userId, tenantId}) -> materials` (must assert UNLOCKED)
.\_specpack\CONTENT_PROTECTION_MATERIALS_ENGINE.md:44:- `getDownloadUrl({fileId, userId, tenantId}) -> signedOrEphemeralUrl` (must log)
.\ROADMAP_CODEX.md:6:- Zero deletions; Vault always; tenant isolation; public browsing without protected material leakage. (PDF pp. 2, 21, 40)
.\ROADMAP_CODEX.md:14:- Student Portal Core requirements (tenant isolation, AccessGate for locked lessons). (PDF pp. 24, 29, 31)
.\README.md:14:Transition from a legacy single-tenant LMS into a premier, multi-tenant white-label platform for high-trust Torah education. Deliver a "WOW" academic experience through immersive 3D study (VR), conversational AI tutoring, and airtight content protection.
.\README.md:40:- **Tenancy Guard:** Runtime enforcement of `school_id` scoping via `tenancyEnforcer.js`.
.\README.md:45:- **Storefront:** `/s/:schoolSlug` (Tenant-branded sales pages)
.\docs\AUDIT_REPORT_V9_1.md:8:*   **Audit Finding:** High-risk tenancy leaks were detected in `TeachCourse.jsx` and `TeachLesson.jsx` where entities were fetched by ID without `school_id` scoping. This creates an IDOR risk where an instructor from School A could potentially read/write School B's content if they guessed the ID.
.\docs\AUDIT_REPORT_V9_1.md:9:*   **Remediation:** I have refactored both files to use `scopedFilter` and `scopedUpdate`, ensuring `activeSchoolId` is enforced on every query.
.\_specpack\BRANDING_TERMINOLOGY_POLICY.md:4:These settings must be tenant-scoped and admin-editable.
.\_specpack\BRANDING_TERMINOLOGY_POLICY.md:8:## 1) Branding settings (per tenant)
.\_specpack\BRANDING_TERMINOLOGY_POLICY.md:20:## 2) Terminology settings (per tenant)
.\_specpack\BRANDING_TERMINOLOGY_POLICY.md:37:## 3) Content protection policy (per tenant)
.\_specpack\BRANDING_TERMINOLOGY_POLICY.md:49:## 4) Monetization settings (per tenant)
.\docs\implementation\worksheets\WS-0005-scoped-admin-analytics.md:22:- Enforce activeSchoolId scoping via `scopedFilter` and tenancy enforcer
.\docs\implementation\worksheets\WS-0005-scoped-admin-analytics.md:26:- Query keys include activeSchoolId to prevent stale cross-school cache
.\docs\implementation\worksheets\WS-0005-scoped-admin-analytics.md:30:- Analytics dashboards return scoped data per activeSchoolId
.\docs\implementation\worksheets\WS-0005-scoped-admin-analytics.md:31:- Search results are scoped to activeSchoolId and query keys include school scope
.\docs\implementation\IMPLEMENTATION_WORKSHEET_TEMPLATE.md:25:- Query limits; caching keys include activeSchoolId; virtualization if list > 200.
.\docs\implementation\worksheets\WS-0001-session-source-of-truth.md:12:- Scope rule: activeSchoolId must be derived from memberships (no client-forged tenant_id)
.\docs\implementation\worksheets\WS-0001-session-source-of-truth.md:24:- Avoids using stale localStorage school_id if not in memberships
.\docs\implementation\worksheets\WS-0001-session-source-of-truth.md:33:- Login with single membership: activeSchoolId set from preference or membership
.\docs\implementation\worksheets\WS-0001-session-source-of-truth.md:34:- Login with multiple memberships: activeSchoolSource set to firstMembership and needsSchoolSelection true
.\docs\implementation\worksheets\WS-0001-session-source-of-truth.md:35:- Stale localStorage school_id not in memberships: activeSchoolId cleared and reselected
.\_specpack\FEATURE_REGISTRY_AND_VAULT.md:29:- `getVaultFeatures(options)` where `options` includes `audience`, `roles`, `tenant`
.\_specpack\FEATURE_REGISTRY_AND_VAULT.md:30:- `getMainNavFeatures(options)` where `options` includes `audience`, `roles`, `tenant`
.\_specpack\FEATURE_REGISTRY_AND_VAULT.md:66:- tenant/school id
.\ROADMAP.md:7:- Zero deletions; Vault always; tenant isolation; public browsing without protected material leakage. (PDF pp. 2, 21, 40)
.\ROADMAP.md:8:- Multi-tenant isolation: scope data by activeSchoolId (private) or schoolSlug -> school_id (public). (PDF p. 40)
.\ROADMAP.md:21:- PortalGate behavior: role gates, audience intent, activeSchoolId normalization. (PDF p. 26)
.\_specpack\GITLAB_SETUP_WORKFLOW.md:60:  - tenant scoping
.\_specpack\BACKLOG_STORIES.md:38:    - Active tenant required
.\_specpack\BACKLOG_STORIES.md:39:  - Add GÇ£Choose schoolGÇ¥ modal for multi-tenant users.
.\_specpack\BACKLOG_STORIES.md:42:  - Cross-tenant access is blocked.
.\_specpack\BACKLOG_STORIES.md:76:  - Export works and includes timestamp + tenant id.
.\_specpack\BACKLOG_STORIES.md:86:- A student cannot join a tenant without meeting one of the configured rules.
.\_specpack\BACKLOG_STORIES.md:95:- Create pending tenant application
.\_specpack\BACKLOG_STORIES.md:103:- Create invitations (role + tenant + expiry)
.\docs\v9.1-portalization.md:9:- Public storefront stays at `/s/:schoolSlug/*`.
.\docs\v9.1-portalization.md:29:- `/s/:schoolSlug`
.\docs\v9.1-portalization.md:30:- `/s/:schoolSlug/courses`
.\docs\v9.1-portalization.md:31:- `/s/:schoolSlug/course/:courseId`
.\docs\v9.1-portalization.md:32:- `/s/:schoolSlug/pricing`
.\docs\v9.1-portalization.md:33:- `/s/:schoolSlug/thank-you`
.\docs\implementation\worksheets\WS-0004-zero-friction-school-selection.md:23:- Selection uses session membership list and activeSchoolId guard
.\docs\implementation\worksheets\WS-0002-routing-portalization.md:10:- Public/global (no tenant-scoped entities)
.\_specpack\ARCHITECTURE_NORTH_STAR.md:7:- School/Entity signup + onboarding (multi-tenant)
.\_specpack\ARCHITECTURE_NORTH_STAR.md:19:- `memberships[]` (tenant memberships + roles)
.\_specpack\ARCHITECTURE_NORTH_STAR.md:20:- `activeSchoolId` + `activeSchoolSlug`
.\_specpack\ARCHITECTURE_NORTH_STAR.md:27:  1) explicit selector (for multi-tenant users)
.\_specpack\ARCHITECTURE_NORTH_STAR.md:39:- Public storefront: `/s/:schoolSlug/*`
.\_specpack\ARCHITECTURE_NORTH_STAR.md:47:- **Route guard**: blocks UI rendering if role/tenant missing
.\_specpack\ARCHITECTURE_NORTH_STAR.md:48:- **Data guard**: all queries/mutations are server/app-layer protected by tenant + entitlement
.\_specpack\ARCHITECTURE_NORTH_STAR.md:55:- `Membership` GÇö ties user to tenant + role(s).
.\_specpack\ARCHITECTURE_NORTH_STAR.md:59:- Never trust client-provided `tenant_id`.
.\_specpack\ARCHITECTURE_NORTH_STAR.md:60:- Derive tenant scope from:
.\_specpack\ARCHITECTURE_NORTH_STAR.md:61:  - `activeSchoolId` for authenticated portal requests
.\_specpack\ARCHITECTURE_NORTH_STAR.md:62:  - `schoolSlug -> school_id` for public storefront
.\_specpack\IA_ROUTES_PORTALS.md:98:- `/superadmin/tenants`
.\_specpack\IA_ROUTES_PORTALS.md:112:- `/s/:schoolSlug` (school landing)
.\_specpack\IA_ROUTES_PORTALS.md:113:- `/s/:schoolSlug/catalog`
.\_specpack\IA_ROUTES_PORTALS.md:114:- `/s/:schoolSlug/course/:courseId` (sales page)
.\_specpack\IA_ROUTES_PORTALS.md:115:- `/s/:schoolSlug/pricing` (or offers)
.\_specpack\IA_ROUTES_PORTALS.md:116:- `/s/:schoolSlug/checkout`
.\_specpack\IA_ROUTES_PORTALS.md:117:- `/s/:schoolSlug/thank-you`
.\docs\implementation\policies\ZERO_FRICTION_POLICY.md:19:- Store minimal local hints (`active_school_id`, `ba_intended_audience`, `ba_portal_prefix`).
.\_specpack\OPS_INTEGRITY_QA.md:8:- No data leaks; tenant scoping must be consistent.
.\_specpack\OPS_INTEGRITY_QA.md:25:  - scan queries for missing `school_id` filters (best-effort patterns)
.\_specpack\OPS_INTEGRITY_QA.md:31:- JSON report with timestamp, school_id, checks, warnings, environment metadata.
.\_specpack\OPS_INTEGRITY_QA.md:61:- cache keys include activeSchoolId
.\_specpack\MIGRATIONS_DATA_MODEL.md:25:- `ProtectionPolicy` (per tenant)
.\_specpack\MIGRATIONS_DATA_MODEL.md:52:For any entity missing `school_id`, add it (non-destructively), then backfill from related entities.
.\docs\repo-snapshot.md:118:- `src/portals/storefront/StorefrontPortal.jsx` uses `useParams` for `schoolSlug`.
.\docs\repo-snapshot.md:127:- `src/components/api/tenancyEnforcer.js` enforces `school_id` injection.
.\docs\repo-snapshot.md:128:- `src/components/hooks/useStorefrontContext.jsx` manages `schoolSlug`.
.\docs\repo-snapshot.md:129:- `src/components/school/SchoolContext.jsx` manages `activeSchoolId`.
.\docs\repo-snapshot.md:130:- Extensive usage of `school_id` in pages and components.
.\docs\v9.1-legacy-route-map.md:7:- **Storefront (public):** `/s/:schoolSlug/*`
.\_specpack\PR_CHECKLIST.md:6:- [ ] Tenant scoping everywhere (`activeSchoolId` portals; slugGåÆschool_id storefront).
.\_specpack\NEXT_CHAT_CONTEXT.md:9:6) MultiGÇætenant isolation: tenant scoping is mandatory (activeSchoolId for private portals; schoolSlugGåÆschool_id for public storefront).
.\_specpack\NEXT_CHAT_CONTEXT.md:16:- Public storefront per school slug: /s/:schoolSlug/* (catalog/sales/checkout/thank-you)
.\docs\implementation\worksheets\WS-0003-tenant-scoped-entities.md:12:- Scope rule: all school-owned entities must be forced to activeSchoolId
.\docs\implementation\worksheets\WS-0003-tenant-scoped-entities.md:25:- Prevent cross-school reads/writes by enforcing school_id injection
.\docs\implementation\worksheets\WS-0003-tenant-scoped-entities.md:28:- No direct query changes; tenancy enforcer continues to use filters with activeSchoolId
.\docs\REALITY_MAP.md:19:| **Tenancy Enforcer** | `src/components/api/tenancyEnforcer.js` | Runtime guard injecting `school_id`. |
.\docs\REALITY_MAP.md:21:| **Active School** | `src/components/school/SchoolContext.jsx` | Manages `active_school_id` in localStorage. |
.\docs\REALITY_MAP.md:22:| **Storefront Ctx** | `src/components/hooks/useStorefrontContext.jsx` | Resolves `schoolSlug` from URL. |
.\_specpack\RBAC_TENANCY_MODEL.md:11:- School Admin (tenant admin)
.\_specpack\RBAC_TENANCY_MODEL.md:12:- Org Owner (tenant owner; billing + high privilege)
.\_specpack\RBAC_TENANCY_MODEL.md:16:- A user may have multiple tenant memberships (multi-school).
.\_specpack\RBAC_TENANCY_MODEL.md:17:- A user may be a student in one tenant and teacher/admin in another.
.\_specpack\RBAC_TENANCY_MODEL.md:24:- All data operations must be tenant-scoped.
.\_specpack\RBAC_TENANCY_MODEL.md:30:- Determine `activeSchoolId` from session.
.\_specpack\RBAC_TENANCY_MODEL.md:31:- All entity queries must include `school_id == activeSchoolId` (or equivalent tenant field).
.\_specpack\RBAC_TENANCY_MODEL.md:34:- Resolve `schoolSlug` -> `school_id` once at layout/root.
.\_specpack\RBAC_TENANCY_MODEL.md:35:- Use that `school_id` to scope all storefront queries.
.\_specpack\RBAC_TENANCY_MODEL.md:38:- Never query tenant-scoped entities without a tenant filter.
.\_specpack\RBAC_TENANCY_MODEL.md:39:- Never accept client-supplied tenant_id as GÇ£truth.GÇ¥
.\_specpack\RBAC_TENANCY_MODEL.md:60:| Cross-tenant access | X | X | X | X | X | A |
.\_specpack\RBAC_TENANCY_MODEL.md:66:- `/student/*` requires authenticated + membership role includes Student (or higher) in activeSchool.
.\_specpack\RBAC_TENANCY_MODEL.md:75:Log these events with actor + tenant + timestamp + metadata:
.\_specpack\QA_RELEASE_CHECKLISTS.md:32:- No data from another tenant appears in lists
.\_specpack\README.md:10:- **Tenant scoping everywhere.** All school-owned data must be scoped by `activeSchoolId` (private portals) or `schoolSlug -> school_id` (public storefront).
.\_specpack\README.md:28:- `RBAC_TENANCY_MODEL.md` GÇö roles/permissions matrix + tenant-scoping rules.
.\_specpack\RELEASE_TRAINS_FUTURE_BUILDS.md:24:- v9.1: Onboarding & tenant excellence
.\src\utils\index.ts:16:// - Storefront stays public under /s/:schoolSlug/*
.\_specpack\RELEASE_TRAIN_CONTINUOUS_BUILDS.md:55:### Train B GÇö Multi-tenant Onboarding Excellence (v9.2.x)
.\_specpack\REPO_REALITY_AUDIT.md:63:rg -n "tenant|schoolSlug|school_id|activeSchool" -S . | sed -n '1,200p'
.\docs\specpack\v9_specpack_v5_fromStable\ARCHITECTURE_NORTH_STAR.md:7:- School/Entity signup + onboarding (multi-tenant)
.\docs\specpack\v9_specpack_v5_fromStable\ARCHITECTURE_NORTH_STAR.md:19:- `memberships[]` (tenant memberships + roles)
.\docs\specpack\v9_specpack_v5_fromStable\ARCHITECTURE_NORTH_STAR.md:20:- `activeSchoolId` + `activeSchoolSlug`
.\docs\specpack\v9_specpack_v5_fromStable\ARCHITECTURE_NORTH_STAR.md:27:  1) explicit selector (for multi-tenant users)
.\docs\specpack\v9_specpack_v5_fromStable\ARCHITECTURE_NORTH_STAR.md:39:- Public storefront: `/s/:schoolSlug/*`
.\docs\specpack\v9_specpack_v5_fromStable\ARCHITECTURE_NORTH_STAR.md:47:- **Route guard**: blocks UI rendering if role/tenant missing
.\docs\specpack\v9_specpack_v5_fromStable\ARCHITECTURE_NORTH_STAR.md:48:- **Data guard**: all queries/mutations are server/app-layer protected by tenant + entitlement
.\docs\specpack\v9_specpack_v5_fromStable\ARCHITECTURE_NORTH_STAR.md:55:- `Membership` GÇö ties user to tenant + role(s).
.\docs\specpack\v9_specpack_v5_fromStable\ARCHITECTURE_NORTH_STAR.md:59:- Never trust client-provided `tenant_id`.
.\docs\specpack\v9_specpack_v5_fromStable\ARCHITECTURE_NORTH_STAR.md:60:- Derive tenant scope from:
.\docs\specpack\v9_specpack_v5_fromStable\ARCHITECTURE_NORTH_STAR.md:61:  - `activeSchoolId` for authenticated portal requests
.\docs\specpack\v9_specpack_v5_fromStable\ARCHITECTURE_NORTH_STAR.md:62:  - `schoolSlug -> school_id` for public storefront
.\src\pages\Account.jsx:16:  const [activeSchoolId, setActiveSchoolId] = useState(null);
.\src\pages\Account.jsx:24:        setActiveSchoolId(localStorage.getItem('active_school_id'));
.\src\pages\Account.jsx:33:    queryKey: ['my-transactions', user?.email, activeSchoolId],
.\src\pages\Account.jsx:34:    queryFn: () => scopedFilter('Transaction', activeSchoolId, {
.\src\pages\Account.jsx:37:    enabled: !!user && !!activeSchoolId
.\src\pages\Account.jsx:41:    queryKey: ['my-subscriptions', user?.email, activeSchoolId],
.\src\pages\Account.jsx:42:    queryFn: () => scopedFilter('Subscription', activeSchoolId, {
.\src\pages\Account.jsx:45:    enabled: !!user && !!activeSchoolId
.\src\pages\Account.jsx:49:    queryKey: ['my-entitlements', user?.email, activeSchoolId],
.\src\pages\Account.jsx:50:    queryFn: () => scopedFilter('Entitlement', activeSchoolId, {
.\src\pages\Account.jsx:53:    enabled: !!user && !!activeSchoolId
.\src\pages\Account.jsx:57:    queryKey: ['my-affiliate', user?.email, activeSchoolId],
.\src\pages\Account.jsx:59:      const affs = await scopedFilter('Affiliate', activeSchoolId, {
.\src\pages\Account.jsx:64:    enabled: !!user && !!activeSchoolId
.\src\pages\Account.jsx:73:      }, activeSchoolId, true);
.\_specpack\ROADMAP_V9_DETAILED.md:30:- Tenant scope helpers (e.g., `useStorefrontContext`, `activeSchoolId`)
.\_specpack\ROADMAP_V9_DETAILED.md:46:- Where are tenant settings (terminology, branding)?
.\_specpack\ROADMAP_V9_DETAILED.md:51:- Search for any entities queried without tenant scoping
.\_specpack\ROADMAP_V9_DETAILED.md:138:- Ensure tenant is selected/derived before rendering portal pages
.\_specpack\ROADMAP_V9_DETAILED.md:162:- Create pending application + tenant record
.\_specpack\ROADMAP_V9_DETAILED.md:167:- Create invitations with expiry + role + tenant
.\_specpack\SECURITY_THREAT_MODEL.md:11:- Cross-tenant data leakage
.\_specpack\SECURITY_THREAT_MODEL.md:21:- Every query includes `school_id` filter.
.\_specpack\SECURITY_THREAT_MODEL.md:22:- Storefront resolves slug -> school_id at root and reuses it.
.\_specpack\SECURITY_THREAT_MODEL.md:51:- Try cross-tenant switching and ensure no data bleed
.\_specpack\STORE_MONEY_SUBSCRIPTIONS.md:4:This describes the storefront experience while keeping multi-tenant security intact.
.\_specpack\STORE_MONEY_SUBSCRIPTIONS.md:9:- School landing: `/s/:schoolSlug`
.\_specpack\STORE_MONEY_SUBSCRIPTIONS.md:10:- Catalog: `/s/:schoolSlug/catalog`
.\_specpack\STORE_MONEY_SUBSCRIPTIONS.md:11:- Sales page: `/s/:schoolSlug/course/:courseId`
.\_specpack\STORE_MONEY_SUBSCRIPTIONS.md:12:- Pricing/offers: `/s/:schoolSlug/pricing`
.\_specpack\STORE_MONEY_SUBSCRIPTIONS.md:13:- Checkout: `/s/:schoolSlug/checkout`
.\_specpack\STORE_MONEY_SUBSCRIPTIONS.md:14:- Thank you: `/s/:schoolSlug/thank-you`
.\_specpack\STORE_MONEY_SUBSCRIPTIONS.md:16:All storefront data must be scoped using `schoolSlug -> school_id`.
.\_specpack\STORE_MONEY_SUBSCRIPTIONS.md:60:- Entitlements must be tenant-scoped.
.\_specpack\STORE_MONEY_SUBSCRIPTIONS.md:65:Per-tenant affiliates:
.\_specpack\V10_ROADMAP_DETAIL.md:10:Decouple deployment from release. Allow features to be toggled per-tenant (school) or globally.
.\src\pages\AdminHardening.jsx:12:  const [activeSchoolId, setActiveSchoolId] = useState(null);
.\src\pages\AdminHardening.jsx:20:        const schoolId = localStorage.getItem('active_school_id');
.\src\pages\AdminHardening.jsx:30:    queryKey: ['rate-limits', activeSchoolId],
.\src\pages\AdminHardening.jsx:31:    queryFn: () => base44.entities.RateLimitLog.filter({ school_id: activeSchoolId }, '-created_date', 100),
.\src\pages\AdminHardening.jsx:32:    enabled: !!activeSchoolId
.\src\pages\AdminHardening.jsx:36:    queryKey: ['audit-summary', activeSchoolId],
.\src\pages\AdminHardening.jsx:37:    queryFn: () => base44.entities.AuditLog.filter({ school_id: activeSchoolId }, '-created_date', 50),
.\src\pages\AdminHardening.jsx:38:    enabled: !!activeSchoolId
.\src\pages\AdminHardening.jsx:44:      const courses = await base44.entities.Course.filter({ school_id: activeSchoolId });
.\src\pages\AdminHardening.jsx:45:      const entitlements = await base44.entities.Entitlement.filter({ school_id: activeSchoolId });
.\src\pages\AdminHardening.jsx:57:      a.download = `school-data-${activeSchoolId}.csv`;
.\docs\specpack\v9_specpack_v5_fromStable\BRANDING_TERMINOLOGY_POLICY.md:4:These settings must be tenant-scoped and admin-editable.
.\docs\specpack\v9_specpack_v5_fromStable\BRANDING_TERMINOLOGY_POLICY.md:8:## 1) Branding settings (per tenant)
.\docs\specpack\v9_specpack_v5_fromStable\BRANDING_TERMINOLOGY_POLICY.md:20:## 2) Terminology settings (per tenant)
.\docs\specpack\v9_specpack_v5_fromStable\BRANDING_TERMINOLOGY_POLICY.md:37:## 3) Content protection policy (per tenant)
.\docs\specpack\v9_specpack_v5_fromStable\BRANDING_TERMINOLOGY_POLICY.md:49:## 4) Monetization settings (per tenant)
.\src\api\base44Client.js:9:// v8.8: Runtime multi-tenant guard
.\src\api\base44Client.js:10:// Auto-injects school_id into school-scoped entity queries whenever possible.
.\docs\specpack\v9_specpack_v5_fromStable\FEATURE_REGISTRY_AND_VAULT.md:29:- `getVaultFeatures(options)` where `options` includes `audience`, `roles`, `tenant`
.\docs\specpack\v9_specpack_v5_fromStable\FEATURE_REGISTRY_AND_VAULT.md:30:- `getMainNavFeatures(options)` where `options` includes `audience`, `roles`, `tenant`
```

### GATING HITS
```
.\BUILDINFO.json:15:    "Content protection: LOCKED/DRIP_LOCKED lessons render AccessGate and avoid mounting protected panels.",
.\CHECKSUMS_MANIFEST.sha256:183:e1959088ef8c2fb4ee3ba9d0ff1e7db91bcbbbd296511c2a1219ecfbbc5be1c5  src/components/materials/materialsEngine.jsx
.\checksums.sha256:184:e1959088ef8c2fb4ee3ba9d0ff1e7db91bcbbbd296511c2a1219ecfbbc5be1c5  src/components/materials/materialsEngine.jsx
.\CODE_BOOK_PLAN.md:13:- Access state machine enforced; LOCKED/DRIP_LOCKED must not fetch or render materials.
.\CODE_BOOK_PLAN.md:30:4) Content protection + materials engine
.\CODE_BOOK_PLAN.md:31:   - Access state machine, materials API, preview policy, search leakage prevention.
.\GEMINI.md:38:- **Hard Invariant:** If a lesson is `LOCKED` or `DRIP_LOCKED`, the application **must not** fetch premium materials.
.\README.md:41:- **Content Protection:** Strict gating of `LOCKED` and `DRIP_LOCKED` materials.
.\ROADMAP.md:9:- Access state machine enforced; LOCKED/DRIP_LOCKED must not fetch or render materials. (PDF pp. 27-28)
.\ROADMAP.md:51:- Protected material must not be fetched or rendered in LOCKED/DRIP_LOCKED. (PDF p. 27)
.\SECURITY_INVARIANTS.md:22:- If questions are stored in `QuizQuestion`, do **not** fetch them when access is LOCKED.
.\_specpack\BACKLOG_STORIES.md:134:- LOCKED/DRIP_LOCKED: no material fetch/render/mount.
.\_specpack\BACKLOG_STORIES.md:135:- UNLOCKED: materials engine can fetch/render.
.\scripts\tmp-repo-snapshot.ps1:11:$gating = rg -n "LOCKED|DRIP_LOCKED|UNLOCKED|materials|downloadUrl" -S . | Select-Object -First 200
.\_specpack\ARCHITECTURE_NORTH_STAR.md:68:- `LOCKED` GÇö no entitlement
.\_specpack\ARCHITECTURE_NORTH_STAR.md:69:- `DRIP_LOCKED` GÇö has entitlement, but not released yet
.\_specpack\ARCHITECTURE_NORTH_STAR.md:70:- `UNLOCKED` GÇö entitled + released
.\_specpack\ARCHITECTURE_NORTH_STAR.md:72:**Hard rule:** In `LOCKED` or `DRIP_LOCKED`, lesson materials must not be fetched, rendered, mounted, nor passed into components.
.\_specpack\ARCHITECTURE_NORTH_STAR.md:80:- `materials` only when `UNLOCKED`
.\_specpack\ARCHITECTURE_NORTH_STAR.md:100:- validate leakage heuristics (materials not fetched while locked)
.\ROADMAP_CODEX.md:7:- Access state machine enforced; LOCKED/DRIP_LOCKED must not fetch or render materials. (PDF pp. 27-28)
.\docs\V9_1_STABLE_RELEASE.md:12:- **Content Protection:** Verified. `LOCKED` state completely blocks material fetch.
.\src\components\academic\quizEngine.jsx:5:// - Avoid fetching questions when access is LOCKED
.\src\components\academic\quizEngine.jsx:76:  if (!isTeacher && normalizedAccess === 'LOCKED') {
.\src\components\academic\quizEngine.jsx:77:    return { quiz, questions: [], access: 'LOCKED' };
.\_specpack\V9_ROADMAP_EXTREME_DETAIL.md:15:   - never fetch premium materials in LOCKED/DRIP_LOCKED
.\_specpack\V9_ROADMAP_EXTREME_DETAIL.md:16:   - never fetch quiz questions in LOCKED
.\_specpack\V9_QUIZZES_REALITY.md:24:- If questions are stored in `QuizQuestion`, do **not** fetch them when access is LOCKED.
.\_specpack\V9_CONTENT_PROTECTION_REALITY.md:11:- `LOCKED` GÇö no access; no preview
.\_specpack\V9_CONTENT_PROTECTION_REALITY.md:12:- `DRIP_LOCKED` GÇö user has entitlement but lesson not yet available via drip schedule
.\_specpack\V9_CONTENT_PROTECTION_REALITY.md:23:If accessLevel is `LOCKED` or `DRIP_LOCKED`:
.\_specpack\V9_CONTENT_PROTECTION_REALITY.md:24:- Do NOT fetch premium materials.
.\_specpack\V9_CONTENT_PROTECTION_REALITY.md:28:- `src/components/materials/materialsEngine.jsx`
.\_specpack\V9_CONTENT_PROTECTION_REALITY.md:31:  - Unified lock UI for LOCKED/DRIP_LOCKED
.\_specpack\V9_CONTENT_PROTECTION_REALITY.md:34:- `getSecureDownloadUrl()` in `materialsEngine.jsx`
.\_specpack\V9_CODEBASE_REALITY_MAP.md:46:- **Materials engine**: `src/components/materials/materialsEngine.jsx`
.\_specpack\V9_CODEBASE_REALITY_MAP.md:152:- `components/materials/`
.\_specpack\V9_CODEBASE_REALITY_MAP.md:153:- `components/materials/materialsEngine.jsx`
.\_specpack\V9_CODEBASE_REALITY_MAP.md:207:- If questions are stored in `QuizQuestion`, do **not** fetch them when access is LOCKED.
.\_specpack\V9_CODEBASE_REALITY_MAP.md:226:- **Question fetch gating**: do not fetch questions when access is LOCKED.
.\_specpack\SECURITY_THREAT_MODEL.md:29:- LOCKED/DRIP_LOCKED never fetch materials.
.\_specpack\ROADMAP_V9_DETAILED.md:50:- Search for any queries that fetch lessons/materials without gating
.\_specpack\ROADMAP_V9_DETAILED.md:202:- Confirm lesson materials never fetched while locked/drip-locked
.\_specpack\REPO_REALITY_AUDIT.md:65:rg -n "LOCKED|DRIP_LOCKED|UNLOCKED|materials|downloadUrl" -S . | sed -n '1,200p'
.\_specpack\README.md:11:- **Content safety:** In `LOCKED` or `DRIP_LOCKED` states, lesson materials **must not fetch, render, mount, or be passed** into downstream components (including AI tutor).
.\_specpack\README.md:31:- `CONTENT_PROTECTION_MATERIALS_ENGINE.md` GÇö gating states + materials engine contracts.
.\_specpack\RBAC_TENANCY_MODEL.md:51:| View lesson materials (unlocked) | X | R | R | R | R | R |
.\_specpack\QA_RELEASE_CHECKLISTS.md:38:- Guest: no full materials visible anywhere
.\_specpack\QA_RELEASE_CHECKLISTS.md:39:- LOCKED: lesson viewer shows AccessGate only; no materials fetched
.\_specpack\QA_RELEASE_CHECKLISTS.md:40:- DRIP_LOCKED: countdown only; no materials fetched
.\_specpack\QA_RELEASE_CHECKLISTS.md:41:- UNLOCKED: materials render; watermark/policy applied
.\_specpack\PR_CHECKLIST.md:8:- [ ] LOCKED/DRIP_LOCKED never fetch/render/mount materials.
.\_specpack\OPS_INTEGRITY_QA.md:21:  - GÇ£materials fetched while lockedGÇ¥ detection (best-effort)
.\_specpack\OPS_INTEGRITY_QA.md:39:  - confirm no full lesson materials visible
.\_specpack\OPS_INTEGRITY_QA.md:42:  - confirm no materials fetch calls
.\_specpack\OPS_INTEGRITY_QA.md:44:  - countdown visible; no materials fetch
.\_specpack\NEXT_CHAT_CONTEXT.md:10:7) Public browsing OK; materials protected: do not fetch/render lesson materials unless access state is UNLOCKED.
.\_specpack\NEXT_CHAT_CONTEXT.md:19:In LOCKED or DRIP_LOCKED states, lesson materials must NOT be fetched, rendered, or passed to downstream components.
.\_specpack\KNOWN_ISSUES_TECH_DEBT.md:19:- [x] Audit lesson viewer + quizzes for any fetch while LOCKED/DRIP_LOCKED (Phase 6 Audit: Passed)
.\docs\specpack\v9_specpack_v5_fromStable\V9_ROADMAP_EXTREME_DETAIL.md:15:   - never fetch premium materials in LOCKED/DRIP_LOCKED
.\docs\specpack\v9_specpack_v5_fromStable\V9_ROADMAP_EXTREME_DETAIL.md:16:   - never fetch quiz questions in LOCKED
.\src\pages\CourseDetail.jsx:42:  return previewLimit > 0 ? 'PREVIEW' : 'LOCKED';
.\src\pages\CourseDetail.jsx:485:                  <Card key={quiz.id} className={cx("border-none shadow-sm", access === 'LOCKED' ? 'bg-muted/50' : tokens.glass.card)}>
.\src\pages\CourseDetail.jsx:490:                          {access === 'LOCKED' && <Lock className="w-3 h-3 text-muted-foreground" />}
.\src\pages\CourseDetail.jsx:499:                      {access !== 'LOCKED' ? (
.\src\portals\public\publicContent.json:201:        "body": "By using the platform you agree to follow school policies and respect protected materials."
.\docs\specpack\v9_specpack_v5_fromStable\V9_QUIZZES_REALITY.md:24:- If questions are stored in `QuizQuestion`, do **not** fetch them when access is LOCKED.
.\docs\specpack\v9_specpack_v5_fromStable\V9_CONTENT_PROTECTION_REALITY.md:11:- `LOCKED` GÇö no access; no preview
.\docs\specpack\v9_specpack_v5_fromStable\V9_CONTENT_PROTECTION_REALITY.md:12:- `DRIP_LOCKED` GÇö user has entitlement but lesson not yet available via drip schedule
.\docs\specpack\v9_specpack_v5_fromStable\V9_CONTENT_PROTECTION_REALITY.md:23:If accessLevel is `LOCKED` or `DRIP_LOCKED`:
.\docs\specpack\v9_specpack_v5_fromStable\V9_CONTENT_PROTECTION_REALITY.md:24:- Do NOT fetch premium materials.
.\docs\specpack\v9_specpack_v5_fromStable\V9_CONTENT_PROTECTION_REALITY.md:28:- `src/components/materials/materialsEngine.jsx`
.\docs\specpack\v9_specpack_v5_fromStable\V9_CONTENT_PROTECTION_REALITY.md:31:  - Unified lock UI for LOCKED/DRIP_LOCKED
.\docs\specpack\v9_specpack_v5_fromStable\V9_CONTENT_PROTECTION_REALITY.md:34:- `getSecureDownloadUrl()` in `materialsEngine.jsx`
.\src\pages\AuditLogViewer.jsx:75:    'DOWNLOAD_BLOCKED', 'SUBSCRIPTION_RECONCILED'];
.\_specpack\GITLAB_SETUP_WORKFLOW.md:50:- `fix(gating): prevent materials fetch when locked`
.\docs\specpack\v9_specpack_v5_fromStable\V9_CODEBASE_REALITY_MAP.md:46:- **Materials engine**: `src/components/materials/materialsEngine.jsx`
.\docs\specpack\v9_specpack_v5_fromStable\V9_CODEBASE_REALITY_MAP.md:152:- `components/materials/`
.\docs\specpack\v9_specpack_v5_fromStable\V9_CODEBASE_REALITY_MAP.md:153:- `components/materials/materialsEngine.jsx`
.\docs\specpack\v9_specpack_v5_fromStable\V9_CODEBASE_REALITY_MAP.md:207:- If questions are stored in `QuizQuestion`, do **not** fetch them when access is LOCKED.
.\docs\specpack\v9_specpack_v5_fromStable\V9_CODEBASE_REALITY_MAP.md:226:- **Question fetch gating**: do not fetch questions when access is LOCKED.
.\docs\specpack\v9_specpack_v5_fromStable\OPS_INTEGRITY_QA.md:21:  - GÇ£materials fetched while lockedGÇ¥ detection (best-effort)
.\docs\specpack\v9_specpack_v5_fromStable\OPS_INTEGRITY_QA.md:39:  - confirm no full lesson materials visible
.\docs\specpack\v9_specpack_v5_fromStable\OPS_INTEGRITY_QA.md:42:  - confirm no materials fetch calls
.\docs\specpack\v9_specpack_v5_fromStable\OPS_INTEGRITY_QA.md:44:  - countdown visible; no materials fetch
.\_specpack\CONTENT_PROTECTION_MATERIALS_ENGINE.md:11:- DRIP_LOCKED user fetches materials early GÇ£in the background.GÇ¥
.\_specpack\CONTENT_PROTECTION_MATERIALS_ENGINE.md:26:- `LOCKED` (no entitlement)
.\_specpack\CONTENT_PROTECTION_MATERIALS_ENGINE.md:27:- `DRIP_LOCKED` (entitled but unreleased)
.\_specpack\CONTENT_PROTECTION_MATERIALS_ENGINE.md:28:- `UNLOCKED` (entitled + released)
.\_specpack\CONTENT_PROTECTION_MATERIALS_ENGINE.md:33:- In `LOCKED` or `DRIP_LOCKED`, the UI must render **AccessGate only**.
.\_specpack\CONTENT_PROTECTION_MATERIALS_ENGINE.md:34:- Do not call materials fetch functions.
.\_specpack\CONTENT_PROTECTION_MATERIALS_ENGINE.md:43:- `getLessonMaterials({lessonId, userId, tenantId}) -> materials` (must assert UNLOCKED)
.\_specpack\CONTENT_PROTECTION_MATERIALS_ENGINE.md:48:- Viewer mounts only when `state === 'UNLOCKED'`.
.\docs\specpack\v9_specpack_v5_fromStable\BACKLOG_STORIES.md:134:- LOCKED/DRIP_LOCKED: no material fetch/render/mount.
.\docs\specpack\v9_specpack_v5_fromStable\BACKLOG_STORIES.md:135:- UNLOCKED: materials engine can fetch/render.
.\docs\specpack\v9_specpack_v5_fromStable\NEXT_CHAT_CONTEXT.md:10:7) Public browsing OK; materials protected: do not fetch/render lesson materials unless access state is UNLOCKED.
.\docs\specpack\v9_specpack_v5_fromStable\NEXT_CHAT_CONTEXT.md:19:In LOCKED or DRIP_LOCKED states, lesson materials must NOT be fetched, rendered, or passed to downstream components.
.\docs\specpack\v9_specpack_v5_fromStable\SECURITY_THREAT_MODEL.md:29:- LOCKED/DRIP_LOCKED never fetch materials.
.\docs\specpack\v9_specpack_v5_fromStable\KNOWN_ISSUES_TECH_DEBT.md:19:- [ ] Audit lesson viewer + quizzes for any fetch while LOCKED/DRIP_LOCKED
.\docs\specpack\v9_specpack_v5_fromStable\ROADMAP_V9_DETAILED.md:50:- Search for any queries that fetch lessons/materials without gating
.\docs\specpack\v9_specpack_v5_fromStable\ROADMAP_V9_DETAILED.md:202:- Confirm lesson materials never fetched while locked/drip-locked
.\docs\specpack\v9_specpack_v5_fromStable\ARCHITECTURE_NORTH_STAR.md:68:- `LOCKED` GÇö no entitlement
.\docs\specpack\v9_specpack_v5_fromStable\ARCHITECTURE_NORTH_STAR.md:69:- `DRIP_LOCKED` GÇö has entitlement, but not released yet
.\docs\specpack\v9_specpack_v5_fromStable\ARCHITECTURE_NORTH_STAR.md:70:- `UNLOCKED` GÇö entitled + released
.\docs\specpack\v9_specpack_v5_fromStable\ARCHITECTURE_NORTH_STAR.md:72:**Hard rule:** In `LOCKED` or `DRIP_LOCKED`, lesson materials must not be fetched, rendered, mounted, nor passed into components.
.\docs\specpack\v9_specpack_v5_fromStable\ARCHITECTURE_NORTH_STAR.md:80:- `materials` only when `UNLOCKED`
.\docs\specpack\v9_specpack_v5_fromStable\ARCHITECTURE_NORTH_STAR.md:100:- validate leakage heuristics (materials not fetched while locked)
.\docs\specpack\v9_specpack_v5_fromStable\REPO_REALITY_AUDIT.md:65:rg -n "LOCKED|DRIP_LOCKED|UNLOCKED|materials|downloadUrl" -S . | sed -n '1,200p'
.\docs\specpack\v9_specpack_v5_fromStable\GITLAB_SETUP_WORKFLOW.md:50:- `fix(gating): prevent materials fetch when locked`
.\docs\repo-snapshot.md:133:- `src/components/materials/materialsEngine.jsx` defines `shouldFetchMaterials`.
.\docs\repo-snapshot.md:134:- `src/components/hooks/useLessonAccess.jsx` determines access levels (LOCKED, DRIP_LOCKED).
.\docs\specpack\v9_specpack_v5_fromStable\README.md:11:- **Content safety:** In `LOCKED` or `DRIP_LOCKED` states, lesson materials **must not fetch, render, mount, or be passed** into downstream components (including AI tutor).
.\docs\specpack\v9_specpack_v5_fromStable\README.md:31:- `CONTENT_PROTECTION_MATERIALS_ENGINE.md` GÇö gating states + materials engine contracts.
.\docs\REALITY_MAP.md:28:| **Access Logic** | `src/components/hooks/useLessonAccess.jsx` | Determines `FULL` / `PREVIEW` / `LOCKED`. |
.\docs\REALITY_MAP.md:29:| **Materials Engine** | `src/components/materials/materialsEngine.jsx` | Gates content fetch based on access level. |
.\docs\REALITY_MAP.md:30:| **Secure Download** | `src/components/materials/materialsEngine.jsx` | `getSecureDownloadUrl` handles signed URLs. |
.\docs\REALITY_MAP.md:41:- **Gating:** `materialsEngine.jsx` correctly blocks fetches in `LOCKED`/`DRIP_LOCKED` states.
.\docs\specpack\v9_specpack_v5_fromStable\RBAC_TENANCY_MODEL.md:51:| View lesson materials (unlocked) | X | R | R | R | R | R |
.\docs\specpack\v9_specpack_v5_fromStable\CONTENT_PROTECTION_MATERIALS_ENGINE.md:11:- DRIP_LOCKED user fetches materials early GÇ£in the background.GÇ¥
.\docs\specpack\v9_specpack_v5_fromStable\CONTENT_PROTECTION_MATERIALS_ENGINE.md:26:- `LOCKED` (no entitlement)
.\docs\specpack\v9_specpack_v5_fromStable\CONTENT_PROTECTION_MATERIALS_ENGINE.md:27:- `DRIP_LOCKED` (entitled but unreleased)
.\docs\specpack\v9_specpack_v5_fromStable\CONTENT_PROTECTION_MATERIALS_ENGINE.md:28:- `UNLOCKED` (entitled + released)
.\docs\specpack\v9_specpack_v5_fromStable\CONTENT_PROTECTION_MATERIALS_ENGINE.md:33:- In `LOCKED` or `DRIP_LOCKED`, the UI must render **AccessGate only**.
.\docs\specpack\v9_specpack_v5_fromStable\CONTENT_PROTECTION_MATERIALS_ENGINE.md:34:- Do not call materials fetch functions.
.\docs\specpack\v9_specpack_v5_fromStable\CONTENT_PROTECTION_MATERIALS_ENGINE.md:43:- `getLessonMaterials({lessonId, userId, tenantId}) -> materials` (must assert UNLOCKED)
.\docs\specpack\v9_specpack_v5_fromStable\CONTENT_PROTECTION_MATERIALS_ENGINE.md:48:- Viewer mounts only when `state === 'UNLOCKED'`.
.\src\components\hooks\useLessonAccess.jsx:12:  require_payment_for_materials: true,
.\src\components\hooks\useLessonAccess.jsx:107:  let accessLevel = 'LOCKED';
.\src\components\hooks\useLessonAccess.jsx:110:  else accessLevel = 'LOCKED';
.\src\components\hooks\useLessonAccess.jsx:124:      accessLevel = 'DRIP_LOCKED';
.\docs\specpack\v9_specpack_v5_fromStable\QA_RELEASE_CHECKLISTS.md:38:- Guest: no full materials visible anywhere
.\docs\specpack\v9_specpack_v5_fromStable\QA_RELEASE_CHECKLISTS.md:39:- LOCKED: lesson viewer shows AccessGate only; no materials fetched
.\docs\specpack\v9_specpack_v5_fromStable\QA_RELEASE_CHECKLISTS.md:40:- DRIP_LOCKED: countdown only; no materials fetched
.\docs\specpack\v9_specpack_v5_fromStable\QA_RELEASE_CHECKLISTS.md:41:- UNLOCKED: materials render; watermark/policy applied
.\docs\specpack\v9_specpack_v5_fromStable\PR_CHECKLIST.md:8:- [ ] LOCKED/DRIP_LOCKED never fetch/render/mount materials.
.\docs\AUDIT_REPORT_V9_1.md:15:*   **Audit Finding:** `LessonViewer` and `LessonViewerPremium` correctly check `useLessonAccess` states (`LOCKED`, `DRIP_LOCKED`).
.\docs\AUDIT_REPORT_V9_1.md:16:*   **Verification:** The `materialsEngine.jsx` module explicitly returns `null` for materials if the state is locked. The client-side queries (`lesson-full`) are disabled (`enabled: false`) when access is locked. This double-layer protection ensures no protected content ever crosses the wire to unauthorized users.
.\docs\AUDIT_REPORT_V9_1.md:44:*   `src/components/materials/materialsEngine.jsx`
.\src\components\admin\ContentProtectionSettings.jsx:28:    require_payment_for_materials: true,
.\src\components\admin\ContentProtectionSettings.jsx:88:    if (localPolicy.require_payment_for_materials) score += 20;
.\src\components\admin\ContentProtectionSettings.jsx:138:              checked={localPolicy.require_payment_for_materials}
.\src\components\admin\ContentProtectionSettings.jsx:139:              onCheckedChange={(checked) => setLocalPolicy({...localPolicy, require_payment_for_materials: checked})}
.\docs\implementation\IMPLEMENTATION_WORKSHEET_TEMPLATE.md:19:- FULL/PREVIEW/LOCKED/DRIP_LOCKED behavior; forbidden actions for each.
.\src\components\utils\SECURITY_CONTRACT.md:13:- **NEVER** fetch lesson materials when accessLevel is LOCKED or DRIP_LOCKED
.\src\components\utils\SECURITY_CONTRACT.md:16:- **ALWAYS** use materialsEngine.shouldFetchMaterials() before queries
.\src\components\utils\SECURITY_CONTRACT.md:17:- **ALWAYS** use materialsEngine.sanitizeMaterialForAccess() before rendering
.\src\components\utils\SECURITY_CONTRACT.md:20:**States:** FULL | PREVIEW | LOCKED | DRIP_LOCKED
.\src\components\utils\SECURITY_CONTRACT.md:22:- **FULL:** Active entitlement + no drip restriction GåÆ full materials (still wrapped in ProtectedContent)
.\src\components\utils\SECURITY_CONTRACT.md:23:- **PREVIEW:** No entitlement + preview allowed GåÆ truncated materials (maxPreviewChars, maxPreviewSeconds)
.\src\components\utils\SECURITY_CONTRACT.md:24:- **LOCKED:** No entitlement + no preview GåÆ AccessGate paywall, NO material fetch
.\src\components\utils\SECURITY_CONTRACT.md:25:- **DRIP_LOCKED:** Has entitlement but lesson unreleased GåÆ AccessGate drip countdown, NO material fetch
.\src\components\utils\SECURITY_CONTRACT.md:28:- LOCKED GåÆ PREVIEW (if is_preview=true)
.\src\components\utils\SECURITY_CONTRACT.md:29:- LOCKED GåÆ FULL (on entitlement grant)
.\src\components\utils\SECURITY_CONTRACT.md:30:- FULL GåÆ DRIP_LOCKED (if lesson has drip settings and not yet released)
.\src\components\utils\SECURITY_CONTRACT.md:31:- DRIP_LOCKED GåÆ FULL (on release date/time)
.\src\components\utils\SECURITY_CONTRACT.md:41:- **Enforcement:** DRIP_LOCKED state prevents ALL content access (video, text, downloads, AI tutor)
.\src\components\utils\SECURITY_CONTRACT.md:47:- Enforcement: ProtectedContent wrapper + materialsEngine gating
.\src\components\utils\SECURITY_CONTRACT.md:99:- components/materials/materialsEngine.js
.\src\components\utils\SECURITY_CONTRACT.md:123:- [ ] No material fetches in LOCKED/DRIP_LOCKED states
.\src\components\utils\SECURITY_CONTRACT.md:145:1. Guest GåÆ LessonViewer (expect: LOCKED gate, no content)
.\src\components\utils\SECURITY_CONTRACT.md:148:4. Paid user GåÆ DRIP_LOCKED lesson (expect: countdown, no content)
.\src\components\security\AccessGate.jsx:12:  mode = 'LOCKED', // LOCKED | DRIP_LOCKED | PREVIEW_NOTICE
.\src\components\security\AccessGate.jsx:23:  const defaultMessage = mode === 'DRIP_LOCKED'
.\src\components\security\AccessGate.jsx:31:          {mode === 'DRIP_LOCKED' ? (
.\src\pages\LessonViewerPremium.jsx:20:import { shouldFetchMaterials } from '@/components/materials/materialsEngine';
.\src\pages\LessonViewerPremium.jsx:123:  if (access.accessLevel === 'LOCKED' || access.accessLevel === 'DRIP_LOCKED') {
.\src\pages\LessonViewerPremium.jsx:129:        message={access.accessLevel === 'DRIP_LOCKED' ? (access.dripInfo?.countdownLabel || 'This lesson will unlock soon.') : undefined}
.\src\components\school\SchoolProtectionSettings.jsx:20:    require_payment_for_materials: true,
.\src\components\school\SchoolProtectionSettings.jsx:32:    require_payment_for_materials: true,
.\src\components\school\SchoolProtectionSettings.jsx:47:    require_payment_for_materials: false,
.\src\components\school\SchoolProtectionSettings.jsx:72:    require_payment_for_materials: true,
.\src\components\school\SchoolProtectionSettings.jsx:180:                checked={policy.require_payment_for_materials}
.\src\components\school\SchoolProtectionSettings.jsx:181:                onCheckedChange={(v) => setPolicy({...policy, require_payment_for_materials: v})}
.\src\components\utils\entitlements.jsx:236:  if (!policy || accessLevel === 'LOCKED') return false;
.\src\components\utils\entitlements.jsx:255:  if (!policy || accessLevel === 'LOCKED') return false;
.\src\components\utils\CHANGELOG.md:86:- useLessonAccess (FULL/PREVIEW/LOCKED)
.\src\components\utils\RECOVERY.md:40:- LOCKED: Paywall/AccessGate
.\src\components\utils\docs.jsx:31:- Access gating: FULL/PREVIEW/LOCKED in LessonViewer + Reader
.\src\components\utils\docs.jsx:77:- require_payment_for_materials: true
.\src\components\utils\docs.jsx:127:4. **Content Protection:** Policy-based with FULL/PREVIEW/LOCKED access levels
.\src\components\utils\docs.jsx:139:useLessonAccess GåÆ Check entitlements GåÆ FULL/PREVIEW/LOCKED
.\src\pages\LessonViewer.jsx:14:import { shouldFetchMaterials } from '@/components/materials/materialsEngine';
.\src\pages\LessonViewer.jsx:187:  if (access.accessLevel === 'LOCKED' || access.accessLevel === 'DRIP_LOCKED') {
.\src\pages\LessonViewer.jsx:193:        message={access.accessLevel === 'DRIP_LOCKED' ? (access.dripInfo?.countdownLabel || 'This lesson will unlock soon.') : undefined}
.\src\components\utils\ARCHITECTURE.md:54:3. LOCKED: No access GåÆ AccessGate paywall
.\src\components\materials\materialsEngine.jsx:9: * Determine if materials should be fetched based on access level
.\src\components\materials\materialsEngine.jsx:10: * @param {string} accessLevel - FULL | PREVIEW | LOCKED | DRIP_LOCKED
.\src\components\materials\materialsEngine.jsx:76: * @param {string} accessLevel - FULL | PREVIEW | LOCKED | DRIP_LOCKED
.\src\components\materials\materialsEngine.jsx:81:  // LOCKED and DRIP_LOCKED return nothing
.\src\components\materials\materialsEngine.jsx:82:  if (accessLevel === 'LOCKED' || accessLevel === 'DRIP_LOCKED') {
.\src\pages\Downloads.jsx:133:                        const { getSecureDownloadUrl } = await import('@/components/materials/materialsEngine');
.\src\pages\MyQuizzes.jsx:24:  return previewLimit > 0 ? 'PREVIEW' : 'LOCKED';
.\src\pages\MyQuizzes.jsx:86:                <Button asChild disabled={access === 'LOCKED'}>
.\src\components\learning\TranscriptPanel.jsx:7:import { shouldFetchMaterials } from '@/components/materials/materialsEngine';
.\src\pages\QuizTake.jsx:71:    if (!quiz) return 'LOCKED';
.\src\pages\QuizTake.jsx:87:    return previewLimit > 0 ? 'PREVIEW' : 'LOCKED';
.\src\pages\SchoolLanding.jsx:122:              <p className={tokens.text.body}>Access exclusive teachings and materials curated by experts.</p>
.\src\pages\SchoolLanding.jsx:136:              <p className={tokens.text.body}>Learn at your own rhythm with 24/7 access to all materials.</p>
.\src\pages\Reader.jsx:150:    const accessLevel = hasCourseAccess ? 'FULL' : (previewAllowed ? 'PREVIEW' : 'LOCKED');
.\src\pages\Reader.jsx:207:    enabled: !!activeSchoolId && !!selectedText?.id && selectedAccess?.accessLevel !== 'LOCKED',
```
