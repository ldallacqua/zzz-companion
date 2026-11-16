# 0003 — Content as code, researched not remembered

**Status:** accepted · 2026-11-16

## Context

Recap quality is the product. LLM-generated-at-runtime recaps cost money, hallucinate and can leak
spoilers. Memory-based writing (human or AI) drifts from the actual game.

## Decision

- Recaps are pre-written per segment, in TypeScript data files validated by Zod, versioned in git.
- Every chapter lists its `sources`; writers read the episode transcripts first and summarize in
  their own words. Thin coverage is flagged with `confidence: 'partial'` and shown in the UI.
- pt-BR uses the game's official localization terms (looked up on the wiki's "Other Languages").
- Two levels per segment: `tldr` (one sentence) and `summary` (paragraphs, `**bold**` only).

## Consequences

- Adding chapters is a reviewable PR with automatic integrity checks.
- Typed data instead of MDX keeps translations side by side and makes validation trivial; if long-form
  editorial content appears later, MDX can be introduced for that content only.
