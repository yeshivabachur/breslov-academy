# Breslov Academy - Roadmap (Codex / Implementation)
Aligned to the SSOT PDF: `Breslov_Academy_Master_Plan_V11_Single_Source_of_Truth_500p.pdf`
Page refs use the PDF footer page number.

## Principles (non-negotiable)
- Zero deletions; Vault always; tenant isolation; public browsing without protected material leakage. (PDF pp. 2, 21, 40)
- Access state machine enforced; LOCKED/DRIP_LOCKED must not fetch or render materials. (PDF pp. 27-28)
- Legacy routes preserved; portalization uses adapters. (PDF pp. 22, 26, 40)
- Integrity diagnostics and QA playbooks required. (PDF p. 35)

## Q1 2026 - Learning WOW + Teacher Tools
- Route surfaces + PortalGate contract (marketing/login/portals/storefront + legacy compatibility). (PDF pp. 26, 40)
- Feature registry + Vault contract; nav derived from registry. (PDF pp. 24, 26)
- Student Portal Core requirements (tenant isolation, AccessGate for locked lessons). (PDF pp. 24, 29, 31)
- Teacher Tools requirements + audit logging for sensitive actions. (PDF pp. 25, 30, 32, 36)

## Q2 2026 - Enterprise Scaling
- Feature flags and internationalization rollout strategy. (PDF p. 34; timeline at pp. 21, 38)
- Integrations marketplace. (PDF pp. 21, 38)
- Staffing/invites and audit logging requirements. (PDF p. 34)
- Performance and scaling rules. (PDF p. 34)

## Q3-Q4 2026 - Future Horizons
- Mobile offline-first experience. (PDF pp. 21, 38)
- AI tutor expansion with content protection enforcement. (PDF pp. 21, 28, 38)
- VR beit midrash experience. (PDF pp. 21, 38)

## Parallel tracks (always-on)
- Storefront/checkout idempotency, coupons, affiliate attribution. (PDF pp. 29-33, 37, 40)
- Content protection enforced across Lesson Viewer, Reader, Search, Downloads, AI Tutor. (PDF pp. 27-28)
- Integrity diagnostics + QA playbooks + build/lint discipline. (PDF p. 35)
- Use Implementation Worksheet per change. (PDF pp. 41-50)

## Appendix A - Internal Version Mapping (Non-SSOT)
This appendix is an internal convenience mapping and is not part of the SSOT PDF.
Do not treat it as authoritative; use it only for legacy naming alignment.

- v9.x: Q1 2026 Learning WOW + Teacher Tools scope.
- v10.x: Q2 2026 Enterprise Scaling scope.
- v11.x: Q3-Q4 2026 Future Horizons scope.
