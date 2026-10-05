import { fitTextClass } from '@/components/Layout';
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

/** The site's one text link: mono at the h3 size (15px, 22px from md),
 *  underlined, the underline thickening on hover. The size is divided by
 *  `--satr-fit`, the scale a home-page block is shrunk by to fit the screen,
 *  so the link measures the same in every block. Every "All projects" /
 *  "Show all studies" style link uses this so the size cannot drift. */
export const linkClass =
  `satr-underlined inline-block font-mono text-brand-black ${fitTextClass} disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-black`;

export function Link({
  as = 'a',
  children = 'Всі проєкти',
  uppercase = false,
  className = '',
  disabled,
  ...props
}: LinkProps) {
  const classes = `${linkClass} ${uppercase ? 'uppercase' : ''} ${className}`.trim();

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
