import type { ReactNode } from 'react';

export type ButtonVariant = 'black' | 'white' | 'bordered';

export interface ButtonProps {
  children: ReactNode;
  variant?: ButtonVariant;
  /** Renders an anchor inside the button wrapper, the way the site links cards. */
  href?: string;
  target?: string;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  onClick?: () => void;
}

/**
 * The site's `.btn` block. A link button is a `div.btn` wrapping an `<a>` —
 * that is how the markup is written across the cards, and the styles depend on
 * it, so the component keeps that shape instead of styling the anchor itself.
 */
export function Button({
  children,
  variant = 'black',
  href,
  target,
  disabled,
  type = 'button',
  className = '',
  onClick,
}: ButtonProps) {
  const classes = `btn btn--${variant} ${className}`.trim();

  if (href) {
    return (
      <div className={classes}>
        <a href={href} target={target} rel={target === '_blank' ? 'nofollow' : undefined}>
          {children}
        </a>
      </div>
    );
  }

  return (
    <button className={classes} type={type} disabled={disabled} onClick={onClick}>
      {children}
    </button>
  );
}
