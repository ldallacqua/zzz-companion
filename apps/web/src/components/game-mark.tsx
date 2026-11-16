import { cn } from '@zzz/ui'

/**
 * The official Zenless Zone Zero "ZZ" mark — © HoYoverse, used non-commercially in this fan project
 * with the legal statement in the footer. It is the one HoYoverse file the repo ships (approved by
 * the project owner; see AGENTS.md rule 6): a transparent PNG in `public/brand`.
 */
export const GAME_MARK_SRC = `${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}/brand/zzz-mark.png`
const SIZE = { w: 229, h: 244 }

/**
 * White mark with a black extruded edge. Hovering/focusing the parent `.group` tints the white
 * faces lime: a lime layer masked by the mark's own luminance (black edge and transparency stay out).
 */
export function GameMark({ className }: { className?: string }) {
  return (
    <span
      className={cn('relative block', className)}
      style={{ aspectRatio: `${SIZE.w} / ${SIZE.h}` }}
      data-testid="game-mark"
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- tiny static asset, no optimizer on a static export */}
      <img
        src={GAME_MARK_SRC}
        alt=""
        width={SIZE.w}
        height={SIZE.h}
        draggable={false}
        className="size-full select-none"
      />
      <span
        aria-hidden
        className="inset-0 absolute bg-primary opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100"
        style={{
          maskImage: `url(${GAME_MARK_SRC})`,
          maskSize: '100% 100%',
          maskRepeat: 'no-repeat',
          maskMode: 'luminance',
        }}
      />
    </span>
  )
}
