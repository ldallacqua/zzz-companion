# 0005 — Motion system

**Status:** accepted · 2026-11-16

## Context

Motion is a core part of the ZZZ feel (and of looking professional), but it must never be forced on
anyone.

## Decision

- One motion language in `packages/ui/src/lib/motion.ts` (snappy springs, expo-out easing,
  `riseIn`, `crtOn`, `stagger`…). Signature moments: CRT power-on hero, glitch titles, hazard-tape
  marquee, scroll-linked recap spine, sliding highlights (`layoutId`), TV-card tilt + scan sweep,
  "channel switch" page transitions.
- User preference: `system` (default, follows `prefers-reduced-motion`) | `full` | `reduced` | `off`.
  - `<html data-motion>` drives CSS; ambient loops carry `motion-ambient` and stop when not `full`.
  - `off` collapses CSS durations and sets `MotionGlobalConfig.skipAnimations`.
  - `reduced` uses `MotionConfig reducedMotion="always"` (fades stay, transforms go).
- Animate only `transform`, `opacity`, `clip-path`, `filter` (briefly); never layout-thrashing
  properties.

## Consequences

- New animations must be checked with all three levels. E2E asserts the attribute is applied.
- Color contrast of decorative animated layers is reviewed manually (axe can't judge them).
