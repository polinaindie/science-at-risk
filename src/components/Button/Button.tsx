import { useState, type ReactNode } from 'react';
import { SquircleShape } from '../../styles/SquircleShape';

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
  'aria-expanded'?: boolean;
  'aria-label'?: string;
}

/** Fill per variant, from the site's own `--squircle-fill`. */
const fills: Record<ButtonVariant, string> = {
  black: '#000000',
  white: '#FFFFFF',
  bordered: '#000000',
};

/**
 * The site's `.btn` block, drawn as a real squircle (radius 60, smoothing 0.9
 * — the site's own `--squircle-radius` / `--squircle-smooth`).
 *
 * A link button is a `div.btn` wrapping an `<a>`, because that is how the
 * markup is written across the cards and the styles depend on it.
 *
 * The bordered variant is a 1px ring, and on hover the site sets
 * `--squircle-outline: 0` — the ring fills in rather than changing colour.
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
  ...aria
}: ButtonProps) {
  const [hovered, setHovered] = useState(false);
  const strokeWidth = variant === 'bordered' && !hovered ? 1 : 0;
  const classes = `btn btn--${variant} sartr-squircle ${className}`.trim();
  const hoverProps = {
    onMouseEnter: () => setHovered(true),
    onMouseLeave: () => setHovered(false),
  };
  const shape = <SquircleShape radius={60} smoothing={0.9} strokeWidth={strokeWidth} fill={fills[variant]} />;

  if (href) {
    return (
      <div className={classes} {...aria} {...hoverProps}>
        {shape}
        <a href={href} target={target} rel={target === '_blank' ? 'nofollow' : undefined}>
          {children}
        </a>
      </div>
    );
  }

  return (
    <button
      className={classes}
      type={type}
      disabled={disabled}
      onClick={onClick}
      {...aria}
      {...hoverProps}
    >
      {shape}
      {children}
    </button>
  );
}
