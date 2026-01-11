# Implementation Worksheet WS-0003
Source: `Breslov_Academy_Master_Plan_V11_Single_Source_of_Truth_500p.pdf` (PDF pp. 26, 41-50)

## Feature/Change ID
- WS-0003 / TENANCY-SCOPED-ENTITIES-EXPANSION
- Registry key: N/A (tenancy infrastructure)
- Legacy aliases: N/A

## Tenant Scope
- school-scoped entity list
- Entities touched: `SCHOOL_SCOPED_ENTITIES` list
- Scope rule: all school-owned entities must be forced to activeSchoolId

## Entry Points
- `src/components/api/scopedEntities.js`
- `src/components/api/scoped.jsx`
- `src/components/api/tenancyEnforcer.js`
- `src/pages/Integrity.jsx`

## Access States
- N/A

## Security Controls
- Expanded scoped list to cover entities referenced by portal features
- Prevent cross-school reads/writes by enforcing school_id injection

## Performance
- No direct query changes; tenancy enforcer continues to use filters with activeSchoolId

## QA Tests
- Verify tenancy warnings remain empty for standard portal navigation
- Spot-check a scoped query for newly added entities (e.g., Message, LearningInsight)

## Rollback Plan
- Revert changes to `SCHOOL_SCOPED_ENTITIES`

## Sign-off
- Engineer:
- QA:
- Security:
