import { SquircleShape } from '../../styles/SquircleShape';

export interface TagProps {
  label: string;
  /** Result count shown to the right of the label, as on the home page. */
  count?: number;
  href?: string;
  /** The expert cards tint their tags; the site's `--squircle-fill` there is #B5C6CD. */
  fill?: string;
  /**
   * `span` for a tag that only labels something — a story's themes, say —
   * rather than filtering a list. Keeps a dead button out of the tab order.
   */
  as?: 'button' | 'span';
  className?: string;
  onClick?: (label: string) => void;
}

/**
 * The site's `.tag` pill — a squircle of radius 60 at smoothing 0.9, the same
 * shape as the buttons.
 */
export function Tag({
  label,
  count,
  href,
  fill = '#FFFFFF',
  className = '',
  as = 'button',
  onClick,
}: TagProps) {
  const classes = `tag sartr-squircle ${className}`.trim();
  const body = (
    <>
      <SquircleShape radius={60} smoothing={0.9} fill={fill} />
      {label}
      {count !== undefined && <span className="tag__number">{count}</span>}
    </>
  );

  if (href) {
    return (
      <div className={`${classes} position-relative`}>
        {body}
        <a className="absoluteLink" href={href} aria-label={label} />
      </div>
    );
  }

  if (as === 'span') {
    return <span className={classes}>{body}</span>;
  }

  return (
    <button type="button" className={classes} aria-label={label} onClick={() => onClick?.(label)}>
      {body}
    </button>
  );
}
