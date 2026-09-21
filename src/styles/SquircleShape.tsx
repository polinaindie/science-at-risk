import { useSquircle, type UseSquircleOptions } from './useSquircle';

export interface SquircleShapeProps extends UseSquircleOptions {
  /** Paints the shape; the ring variant fills the stroke with this. */
  fill?: string;
  className?: string;
}

/**
 * The decorative layer that carries a squircle background.
 *
 * It is a real element rather than a `::before` so the hook can measure it,
 * and it is separate from the content box so that the ring variant's
 * clip-path never clips the label sitting on top of it.
 */
export function SquircleShape({ fill, className = '', ...options }: SquircleShapeProps) {
  const squircle = useSquircle(options);

  return (
    <>
      <span
        ref={squircle.ref}
        aria-hidden
        className={`sartr-squircle__bg ${className}`.trim()}
        style={{ ...squircle.style, background: fill }}
      />
      {squircle.pathD && (
        <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden focusable="false">
          <clipPath id={squircle.clipId} clipPathUnits="userSpaceOnUse">
            {/* `clip-rule`, not `fill-rule`, decides inside/outside for a CSS
                clip-path — the ring's outer+inner subpaths need it to punch
                the hole. */}
            <path d={squircle.pathD} clipRule="evenodd" />
          </clipPath>
        </svg>
      )}
    </>
  );
}
