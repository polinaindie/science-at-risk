import { useState, type CSSProperties, type ReactNode } from 'react';
import { useSquircleClipPath } from '@/styles/useSquircleClipPath';
import { SquircleDefs } from '@/styles/SquircleDefs';

export interface SquircleLinkProps {
  href: string;
  children: ReactNode;
  /** White ink for a bar standing on a dark block. */
  inverted?: boolean;
  className?: string;
  /** Size tweaks for one place (a wider block, taller padding). */
  style?: CSSProperties;
  /** Corner radius, 14 by default (the bar's size); a taller button takes 16, as `Button` does. */
  radius?: number;
  /** Ring width, 1.5 by default; 2 as `Button`'s bordered variant. */
  ring?: number;
}

const RADIUS = 14;
const RING = 1.5;

/**
 * A link drawn as the site's outlined button: the same squircle as every
 * button, as a thin ring that fills on hover. The ring is a `clip-path` on a
 * background layer (as in `Button`'s bordered variant), so the corners are the
 * real squircle and not a rounded rectangle. On the static pages
 * `public/js/satr-squircle.js` draws it from the same markup.
 */
export function SquircleLink({ href, children, inverted = false, className = '', style, radius = RADIUS, ring = RING }: SquircleLinkProps) {
  const [hovered, setHovered] = useState(false);
  const sq = useSquircleClipPath({ radius, smoothing: 0.9, strokeWidth: hovered ? 0 : ring });

  return (
    <a
      href={href}
      className={`satr-squircle-link${inverted ? ' satr-squircle-link--inverted' : ''} ${className}`.trim()}
      style={style}
      data-satr-squircle="outline"
      data-radius={radius}
      data-ring={ring}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
    >
      <span
        ref={sq.ref}
        className="satr-squircle-link__bg"
        data-ready={sq.style ? 'true' : undefined}
        style={sq.style}
        aria-hidden
      />
      <SquircleDefs clipId={sq.clipId} pathD={sq.pathD} />
      {children}
    </a>
  );
}

export default SquircleLink;
