/**
 * The landing page's Act 1 ("the shield") is a scripted scene on a mock recap screen. These pure
 * functions say what the mock shows for a scroll position (desktop, pinned) or for the step
 * caption on screen (phones). See `components/landing-shield.tsx`.
 */
export interface ShieldScene {
  /** Active step: -1 before the act, then 0 (pick your part), 1 (short/full), 2 (files). */
  step: number
  /** Index of the "You are here" part (0 … 3). */
  here: number
  /** Parts after "here" are redacted. */
  shield: boolean
  /** Full mode (the unlocked parts expand). */
  full: boolean
  /** The intel card about Belle is open. */
  intel: boolean
  /** Belle and Wise are in the characters strip. */
  files: boolean
}

export const SHIELD_START: ShieldScene = {
  step: -1,
  here: 0,
  shield: false,
  full: false,
  intel: false,
  files: false,
}

/** The HTML (and motion "off") shows the end of the act: everything demonstrated. */
export const SHIELD_FINAL: ShieldScene = {
  step: 2,
  here: 3,
  shield: true,
  full: true,
  intel: true,
  files: true,
}

/**
 * Desktop: progress through the pinned act (0 … 1) → scene. The marker walks down for the first
 * quarter, then the shield drops; Full mode comes in step 2 and the files in step 3.
 */
export function sceneAt(progress: number): ShieldScene {
  const p = Math.min(1, Math.max(0, progress))
  return {
    step: p < 0.33 ? 0 : p < 0.66 ? 1 : 2,
    here: p < 0.08 ? 0 : p < 0.15 ? 1 : p < 0.22 ? 2 : 3,
    shield: p >= 0.28,
    full: p >= 0.4,
    intel: p >= 0.72,
    files: p >= 0.78,
  }
}

/** Phones and tablets: the caption on screen (-1 = none yet) → scene. */
export function sceneForStep(step: number): ShieldScene {
  if (step < 0) return SHIELD_START
  return { step, here: 3, shield: true, full: step >= 1, intel: step >= 2, files: step >= 2 }
}

export const sameScene = (a: ShieldScene, b: ShieldScene) =>
  a.step === b.step &&
  a.here === b.here &&
  a.shield === b.shield &&
  a.full === b.full &&
  a.intel === b.intel &&
  a.files === b.files
