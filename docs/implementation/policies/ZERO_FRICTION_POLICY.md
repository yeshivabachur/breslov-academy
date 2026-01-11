# Zero Friction Policy (nonSSOT)
Status: Adopted by product request (user directive)
Last updated: 2026-01-11

This policy defines a friction-reduction baseline for all portal entry, onboarding, and school selection
flows. It is not part of the SSOT PDF and must not override SSOT security requirements.

## Principles
- Prefer automatic resolution over extra clicks (e.g., auto-select last active school).
- Never reload the SPA to complete a flow.
- Preserve the intended audience and return path across login.
- Avoid duplicate prompts: if the user already chose, remember it.
- Security is never traded for convenience.

## Required behaviors
- If a user has a single membership, auto-select and enter the portal.
- If multiple memberships exist, show selection immediately with clear role labels.
- After selection, route directly to the intended portal without full page reloads.
- Store minimal local hints (`active_school_id`, `ba_intended_audience`, `ba_portal_prefix`).

## Non-goals
- This policy does not grant access beyond RBAC or content protection rules.
- This policy does not create cross-school visibility.
