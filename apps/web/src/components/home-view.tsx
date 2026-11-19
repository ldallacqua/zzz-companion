import { LandingArm } from '@/lib/landing-arm'
import { FeaturesSection } from './features-section'
import { LandingHero } from './landing-hero'
import { LandingLoadout } from './landing-loadout'
import { LandingManifesto } from './landing-manifesto'
import { LandingNext } from './landing-next'
import { LandingOutro } from './landing-outro'
import { LandingRoster } from './landing-roster'
import { LandingShield } from './landing-shield'

/**
 * The landing page, built as one episode of a show (ADR 0013):
 * cold open → previously on → act 1 (the shield) → act 2 (the toolkit) → act 3 (the roster)
 * → act 4 (the loadout) → next time on → sign-off.
 *
 * Server-rendered: each section ships its HTML in the final frame and only small client islands
 * hydrate. Motion is CSS gated by `html[data-motion]` (see `app/landing.css`).
 */
export function HomeView() {
  return (
    <div>
      <LandingHero />
      <LandingManifesto />
      <LandingShield />
      <FeaturesSection />
      <LandingRoster />
      <LandingLoadout />
      <LandingNext />
      <LandingOutro />
      <LandingArm />
    </div>
  )
}
