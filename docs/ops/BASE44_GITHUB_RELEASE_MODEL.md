# Base44 + GitHub Release Discipline

Status: Draft
Last updated: 2026-01-11

Goal: GitHub is canonical, Base44 is an authoring surface, Cloudflare is production.

## Branch Model
- main: always releasable
- release/v11: stabilization
- base44-sync: Base44 two-way sync target
- feat/*: human feature branches

## Rules
- Base44 writes only to base44-sync
- Human changes go through PRs into main
- main is protected (PR required + checks + CODEOWNERS)

## Required Checks
- npm run lint
- node scripts/validate-v11-spec.mjs
- node scripts/parity-sweep.mjs

## Release Flow
1) Base44 commits land on base44-sync
2) PR from base44-sync into main
3) Review, fix, and merge
4) Release/v11 is cut from main for stabilization
5) Cloudflare deploys from main

## Ownership
- CODEOWNERS define default approvers
- Security or platform changes require explicit review
