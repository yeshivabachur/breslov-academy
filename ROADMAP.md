# Breslov Academy Roadmap (2026)
Source of truth: `Breslov_Academy_Master_Plan_V11_Single_Source_of_Truth_500p.pdf`
Last updated: 2026-01-11
PDF page refs use the page number printed in the PDF footer.

## Principles (non-negotiable)
- Zero deletions; Vault always; tenant isolation; public browsing without protected material leakage. (PDF pp. 2, 21, 40)
- Multi-tenant isolation: scope data by activeSchoolId (private) or schoolSlug -> school_id (public). (PDF p. 40)
- Access state machine enforced; LOCKED/DRIP_LOCKED must not fetch or render materials. (PDF pp. 27-28)
- Integrity diagnostics and QA playbooks are required; build/lint discipline is a release gate. (PDF p. 35)

## Timeline at a glance
- Q1 2026: Learning WOW + Teacher Tools. (PDF pp. 21, 38)
- Q2 2026: Enterprise Scaling (feature flags, i18n, marketplace). (PDF pp. 21, 34, 38)
- Q3-Q4 2026: Future Horizons (mobile offline-first, AI tutor expansion, VR beit midrash). (PDF pp. 21, 38)

## Q1 2026 - Learning WOW + Teacher Tools
Goal: portalized student/teacher experiences with secure routing and access controls. (PDF pp. 21, 24-26, 36, 38, 40)
Deliverables:
- Required route surfaces for marketing, login, portals, storefront, and legacy compatibility. (PDF pp. 26, 40)
- PortalGate behavior: role gates, audience intent, activeSchoolId normalization. (PDF p. 26)
- Feature registry and Vault contract: nav derived from registry; Vault includes all features. (PDF pp. 24, 26)
- Student Portal Core: school isolation, AccessGate for locked lessons, registry-based navigation. (PDF pp. 24, 29, 31)
- Teacher Tools: role-gated authoring, active-school scoping, audit logs for sensitive actions. (PDF pp. 25, 30, 32, 36)

## Q2 2026 - Enterprise Scaling
Goal: enterprise-grade feature control, internationalization, integrations, and ops maturity. (PDF pp. 21, 34, 38)
Deliverables:
- Feature flags strategy and internationalization rollout. (PDF p. 34; timeline at pp. 21, 38)
- Integrations marketplace rollout. (PDF pp. 21, 38)
- Staffing/invites and audit logging requirements. (PDF p. 34)
- Performance and scaling rules (virtualization, caching, query limits). (PDF p. 34)

## Q3-Q4 2026 - Future Horizons
Goal: next-gen experiences with strict access controls. (PDF pp. 21, 27-28, 38)
Deliverables:
- Mobile offline-first experience. (PDF p. 38; timeline at pp. 21, 38)
- AI tutor expansion with enforced content protection. (PDF pp. 21, 28, 38)
- VR beit midrash experience. (PDF pp. 21, 38)

## Commerce & Storefront Track (runs in parallel)
Goal: reliable public storefront with secure entitlements and attribution. (PDF pp. 29-33, 37, 40)
Deliverables:
- Public storefront routes and school-branded catalog/pricing/checkout. (PDF pp. 29, 40)
- Checkout and entitlement idempotency, audit trail. (PDF pp. 31, 37)
- Coupons, bundles, subscriptions. (PDF p. 33)
- Affiliate and attribution rules. (PDF p. 33)

## Security & Content Protection Track (always-on)
- Access state machine enforced across Lesson Viewer, Reader, Search, Downloads, AI Tutor. (PDF pp. 27-28)
- Protected material must not be fetched or rendered in LOCKED/DRIP_LOCKED. (PDF p. 27)
- Preview, watermark, copy/download policy enforcement. (PDF p. 28)

## Delivery & Quality Track (always-on)
- Integrity diagnostics with required detectors and JSON export. (PDF p. 35)
- QA playbooks and build/lint discipline. (PDF p. 35)
- Release management and regression coverage. (PDF p. 37)

## Implementation Discipline
- Use the Implementation Worksheet template for every unit of work. (PDF pp. 41-50)

## Appendix A - Internal Version Mapping (Non-SSOT)
This appendix is an internal convenience mapping and is not part of the SSOT PDF.
Do not treat it as authoritative; use it only for legacy naming alignment.

- v9.x: Q1 2026 Learning WOW + Teacher Tools scope.
- v10.x: Q2 2026 Enterprise Scaling scope.
- v11.x: Q3-Q4 2026 Future Horizons scope.
