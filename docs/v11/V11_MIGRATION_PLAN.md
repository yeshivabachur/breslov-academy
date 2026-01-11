# V11 Migration Plan

Status: Draft
Last updated: 2026-01-11

This plan defines how legacy data is migrated into v11 without losing data.

## Scope
- v10 and earlier tenants, courses, lessons, memberships, and transactions
- Feature flag state and content protection policy

## Strategy
1) Inventory and snapshot
   - export School, Course, Lesson, Membership, Transaction
   - verify counts and checksums
2) Schema alignment
   - map legacy fields to v11 entities
   - define default values for new required fields
3) Backfill jobs
   - add school_id to missing records
   - create ContentProtectionPolicy per school
   - generate FeatureFlag and SchoolSetting entries
4) Validation
   - compare counts and ownership by school_id
   - run integrity scans
5) Rollback plan
   - keep read-only snapshot for rollback
   - reversible migration scripts with dry-run

## Tools
- LegacyMigration admin page
- scripts/migration (TBD)

## Verification Queries
- Courses per school_id match legacy export
- Lessons per course_id match legacy export
- Memberships per school_id match legacy export

## Risks and Mitigations
- Missing school_id: blocked by tenancy enforcer, backfill required
- Duplicate slugs: resolve with suffix and redirect
- Inconsistent access tiers: normalize to access_level
