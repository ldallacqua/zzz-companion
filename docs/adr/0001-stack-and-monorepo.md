# 0001 — Stack and monorepo

**Status:** accepted · 2026-11-16

## Context

A public, AI-agnostic repo that will grow from a story recap into build and gacha tools. Agents and
contributors need clear boundaries and the most widely known tools.

## Decision

- pnpm workspaces + Turborepo.
- `apps/web`: Next.js (App Router), React, TypeScript strict, Tailwind CSS v4, next-intl, Motion,
  Zustand.
- `packages/core`: pure TypeScript + Zod. Domain types, timeline, spoiler gating. Future build
  engine and pull advisor go here too, so they are 100% unit-testable.
- `packages/story`: content as typed data validated by `core` schemas.
- `packages/ui`: shadcn-style components (Radix via `radix-ui`, `cva`, `cn`) + ZZZ tokens.
- Internal packages ship TS source and are compiled by Next (`transpilePackages`).

## Consequences

- Boundaries are physical (package deps), not conventions: `core` cannot import React.
- Mainstream stack → better results from any AI coding agent.
- Slightly more setup than a single app; acceptable for the roadmap.
