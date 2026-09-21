export interface TagProps {
  label: string;
  /** Result count shown to the right of the label, as on the home page. */
  count?: number;
  href?: string;
  className?: string;
  onClick?: (label: string) => void;
}

/** The site's `.tag` block — a pill used for scientific fields and queries. */
export function Tag({ label, count, href, className = '', onClick }: TagProps) {
  const classes = `tag ${className}`.trim();
  const body = (
    <>
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

  return (
    <button type="button" className={classes} aria-label={label} onClick={() => onClick?.(label)}>
      {body}
    </button>
  );
}
