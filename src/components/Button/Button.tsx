import { useState, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { useSquircleClipPath } from '@/styles/useSquircleClipPath';
import { SquircleDefs } from '@/styles/SquircleDefs';

export type ButtonVariant = 'black' | 'white' | 'bordered';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  children?: ReactNode;
}

const variantClass: Record<ButtonVariant, string> = {
  black: 'satr-squircle--black',
  white: 'satr-squircle--white',
  bordered: 'satr-squircle--bordered',
};

/**
 * Squircle button — Figma note: not a rounded rectangle (node 292:1540).
 * The squircle shape lives on a decorative background layer (`__bg`), not
 * the button itself: the bordered variant's ring (`strokeWidth`) would
 * otherwise clip away the label text sitting in the hole.
 */
export function Button({
  variant = 'black',
  className = '',
  children = 'Детальніше',
  type = 'button',
  onMouseEnter,
  onMouseLeave,
  ...props
}: ButtonProps) {
  const [hovered, setHovered] = useState(false);
  const strokeWidth = variant === 'bordered' && !hovered ? 2 : 0;
  const squircle = useSquircleClipPath({ radius: 16, smoothing: 0.9, strokeWidth });

  return (
    <button
      type={type}
      className={`satr-squircle ${variantClass[variant]} ${className}`.trim()}
      onMouseEnter={(e) => {
        setHovered(true);
        onMouseEnter?.(e);
      }}
      onMouseLeave={(e) => {
        setHovered(false);
        onMouseLeave?.(e);
      }}
      {...props}
    >
      <span ref={squircle.ref} className="satr-squircle__bg" style={squircle.style} aria-hidden />
      <SquircleDefs clipId={squircle.clipId} pathD={squircle.pathD} />
      {children}
    </button>
  );
}

export default Button;
