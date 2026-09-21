import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react';

type Common = {
  children?: ReactNode;
  uppercase?: boolean;
  disabled?: boolean;
  className?: string;
};

export type LinkProps = Common &
  (
    | ({ as?: 'a' } & AnchorHTMLAttributes<HTMLAnchorElement>)
    | ({ as: 'button' } & ButtonHTMLAttributes<HTMLButtonElement>)
  );

export function Link({
  as = 'a',
  children = 'Всі проєкти',
  uppercase = false,
  className = '',
  disabled,
  ...props
}: LinkProps) {
  const classes = `satr-link ${uppercase ? 'satr-link--uppercase' : ''} ${className}`.trim();

  if (as === 'button') {
    return (
      <button
        type="button"
        className={classes}
        disabled={disabled}
        {...(props as ButtonHTMLAttributes<HTMLButtonElement>)}
      >
        {children}
      </button>
    );
  }

  return (
    <a
      className={classes}
      aria-disabled={disabled || undefined}
      tabIndex={disabled ? -1 : undefined}
      {...(props as AnchorHTMLAttributes<HTMLAnchorElement>)}
    >
      {children}
    </a>
  );
}

export default Link;
