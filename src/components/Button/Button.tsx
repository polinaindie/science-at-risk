import type { ButtonHTMLAttributes, ReactNode } from 'react';

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
 */
export function Button({
  variant = 'black',
  className = '',
  children = 'Детальніше',
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={`satr-squircle ${variantClass[variant]} ${className}`.trim()}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;
