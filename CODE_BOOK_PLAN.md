# Breslov Academy Code Book Plan (SSOT-Aligned)
Source of truth: `Breslov_Academy_Master_Plan_V11_Single_Source_of_Truth_500p.pdf`
Status: Draft plan (non-SSOT)
Last updated: 2026-01-11

## Purpose
- Produce an engineering-ready "Code Book" that translates SSOT requirements into buildable guidance.
- Define the chapter structure, source mapping, and the build sequence for authoring.
- Keep platform assumptions Cloudflare-first (no Base44 dependency).

## Non-negotiables (from SSOT)
- Zero deletions; Vault always; tenant isolation; public browsing without protected material leakage.
- Access state machine enforced; LOCKED/DRIP_LOCKED must not fetch or render materials.
- Integrity diagnostics and QA playbooks are required; build/lint discipline is a release gate.
- Use the Implementation Worksheet per unit of work (PDF pp. 41-50).

## Code Book format rules
- Every requirement must include a PDF citation using the footer page number.
- Each chapter ends with a checklist, acceptance criteria, and a "Do / Do not" list.
- Security, content protection, and tenancy rules must be restated in every affected chapter.
- Mark any non-SSOT notes explicitly as "nonSSOT".

## Chapter outline (authoring order)
1) Orientation and SSOT map
   - Executive summary, consolidated timeline, unified action items, gap analysis.
2) Architecture North Star
   - App shell, routing surfaces, guard layers, and delivery constraints.
3) Tenant + RBAC model
   - Roles, permissions matrix, tenant scoping rules, audit logging.
4) Content protection + materials engine
   - Access state machine, materials API, preview policy, search leakage prevention.
5) Feature registry + Vault
   - Registry contract, Vault requirements, integrity checks, legacy compatibility.
6) IA, routes, portals, and onboarding
   - Public marketing site, auth entry points, portal layouts, storefront routes.
7) Design system + UI/UX
   - Tokens, component library, UX patterns, revamp strategy without breakage.
8) Data model + migrations
   - Entity definitions, migration rules, legacy data strategy.
9) Commerce and subscriptions
   - Offers, checkout, entitlements, coupons, bundles, attribution rules.
10) Observability, integrity, CI/CD, and release trains
   - Integrity diagnostics, CI/CD pipeline, QA checklists, release management.
11) Security threat model
   - Threats, mitigations, and required security controls.
12) Reality maps and audits
   - Codebase reality map, routes reality map, tenancy/content protection reality.
13) Command palette and terminology policy
   - Command palette spec and branding/terminology rules.
14) Backlog, future builds, and known issues
   - Backlog stories, tech debt, future builds playbook.

## Source pack mapping (non-SSOT working reference)
Use these SSOT-aligned source packs while drafting chapters. Do not treat them as authoritative.
- ARCHITECTURE_NORTH_STAR
- RBAC_TENANCY_MODEL
- CONTENT_PROTECTION_MATERIALS_ENGINE
- FEATURE_REGISTRY_AND_VAULT
- IA_ROUTES_PORTALS
- DESIGN_SYSTEM_UI_UX
- MIGRATIONS_DATA_MODEL
- STORE_MONEY_SUBSCRIPTIONS
- CI_CD_PIPELINE
- OPS_INTEGRITY_QA
- SECURITY_THREAT_MODEL
- V9/V10/V11 roadmaps and detailed plans
- Reality maps, audits, and QA/release checklists

## Build sequence (aligned to SSOT timeline)
- Q1 2026: Chapters 2-7 (Learning WOW + Teacher Tools).
- Q2 2026: Chapters 8-10 (Enterprise scaling).
- Q3-Q4 2026: Chapters 11-14 (Future horizons and long-tail backlog).

## Platform assumptions (implementation target)
- Cloudflare Pages + Functions runtime.
- D1 for relational data, KV for configuration, R2 for files.
- Base44 SDK is not a dependency; any compatibility facades are internal only.

## Appendix A - Internal Version Mapping (Non-SSOT)
This appendix is an internal convenience mapping and is not part of the SSOT PDF.
Do not treat it as authoritative; use it only for legacy naming alignment.

- v9.x: Q1 2026 Learning WOW + Teacher Tools scope.
- v10.x: Q2 2026 Enterprise Scaling scope.
- v11.x: Q3-Q4 2026 Future Horizons scope.
