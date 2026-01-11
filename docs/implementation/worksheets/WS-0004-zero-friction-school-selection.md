# Implementation Worksheet WS-0004
Source: `Breslov_Academy_Master_Plan_V11_Single_Source_of_Truth_500p.pdf` (PDF pp. 24-26, 41-50)
Policy: `docs/implementation/policies/ZERO_FRICTION_POLICY.md` (nonSSOT)

## Feature/Change ID
- WS-0004 / ZERO-FRICTION-SCHOOL-SELECT
- Registry key: SchoolSelect
- Legacy aliases: N/A

## Tenant Scope
- school-scoped session selection
- Entities touched: School, SchoolMembership, UserSchoolPreference

## Entry Points
- `src/pages/SchoolSelect.jsx`
- `src/components/hooks/useSession.jsx`
- `src/components/routing/PortalGate.jsx`

## Access States
- N/A

## Security Controls
- Selection uses session membership list and activeSchoolId guard
- No cross-school access without membership

## Performance
- Avoids full page reload; uses in-app route updates
- School lookup is limited to membership school IDs

## QA Tests
- Select a school and return to dashboard without reload
- Membership list shows role badge from membership record
- If no memberships exist, show empty state + create school CTA

## Rollback Plan
- Revert SchoolSelect to previous localStorage + reload flow

## Sign-off
- Engineer:
- QA:
- Security:
