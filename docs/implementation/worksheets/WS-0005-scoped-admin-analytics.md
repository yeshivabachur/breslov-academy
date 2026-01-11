# Implementation Worksheet WS-0005
Source: `Breslov_Academy_Master_Plan_V11_Single_Source_of_Truth_500p.pdf` (PDF pp. 24-26, 41-50)

## Feature/Change ID
- WS-0005 / SCOPED-ADMIN-ANALYTICS
- Registry key: SchoolAdmin, Analytics, SchoolSearch
- Legacy aliases: N/A

## Tenant Scope
- school-scoped queries for admin and analytics surfaces
- Entities touched: SchoolMembership, SchoolInvite, Analytics, UserProgress, Course, Lesson, Post, Text

## Entry Points
- `src/pages/SchoolAdmin.jsx`
- `src/pages/Analytics.jsx`
- `src/pages/SchoolSearch.jsx`

## Access States
- N/A

## Security Controls
- Enforce activeSchoolId scoping via `scopedFilter` and tenancy enforcer
- Avoid global queries without membership context

## Performance
- Query keys include activeSchoolId to prevent stale cross-school cache

## QA Tests
- Admin portal loads members/invites for active school only
- Analytics dashboards return scoped data per activeSchoolId
- Search results are scoped to activeSchoolId and query keys include school scope
- Switching schools updates query keys and data

## Rollback Plan
- Revert scoped helper usage and session wiring

## Sign-off
- Engineer:
- QA:
- Security:
