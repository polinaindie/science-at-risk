import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  ReactNode,
} from 'react';
import { useSquircleClipPath } from '@/styles/useSquircleClipPath';
import { SquircleDefs } from '@/styles/SquircleDefs';

type TagBaseProps = {
  children: ReactNode;
  count?: number | string;
  circle?: boolean;
  variant?: 'default' | 'accent';
  /** Chip for filters; label for editorial rubrics (no squircle / button chrome). */
  appearance?: 'chip' | 'label';
  className?: string;
};

type TagAsButton = TagBaseProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'className'> & {
    as?: 'button';
    href?: never;
  };

type TagAsSpan = TagBaseProps & {
  as: 'span';
  href?: never;
  onClick?: never;
};

type TagAsLink = TagBaseProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'children' | 'className'> & {
    as: 'a';
    href: string;
  };

export type TagProps = TagAsButton | TagAsSpan | TagAsLink;

/** Filter / topic chip from site mirror (`.tag`). */
export function Tag(props: TagProps) {
  const {
    children,
    count,
    circle = false,
    variant = 'default',
    appearance = 'chip',
    className = '',
    as = 'button',
  } = props;

  const squircle = useSquircleClipPath({ radius: 16, smoothing: 0.9 });

  const classes =
    appearance === 'label'
      ? `satr-tag-label ${className}`.trim()
      : `satr-tag ${variant === 'accent' ? 'satr-tag--accent' : ''} ${className}`.trim();
  const content = (
    <>
      {circle ? <span className="satr-tag__circle" aria-hidden /> : null}
      <span>{children}</span>
      {count !== undefined ? <span className="satr-tag__number">{count}</span> : null}
    </>
  );

  if (appearance === 'label') {
    return <span className={classes}>{content}</span>;
  }

  if (as === 'span') {
    return (
      <>
        <span ref={squircle.ref} className={classes} style={squircle.style}>
          {content}
        </span>
        <SquircleDefs clipId={squircle.clipId} pathD={squircle.pathD} />
      </>
    );
  }

  if (as === 'a') {
    const { href, ...linkProps } = props as TagAsLink;
    return (
      <>
        <a ref={squircle.ref} href={href} className={classes} style={squircle.style} {...linkProps}>
          {content}
        </a>
        <SquircleDefs clipId={squircle.clipId} pathD={squircle.pathD} />
      </>
    );
  }

  const { type = 'button', ...buttonProps } = props as TagAsButton;
  return (
    <>
      <button
        ref={squircle.ref}
        type={type}
        className={classes}
        style={squircle.style}
        {...buttonProps}
      >
        {content}
      </button>
      <SquircleDefs clipId={squircle.clipId} pathD={squircle.pathD} />
    </>
  );
}

export default Tag;
