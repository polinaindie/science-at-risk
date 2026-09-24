import type { CSSProperties, ElementType, ReactNode, Ref } from 'react';

/**
 * The live site's layout contract, taken from scienceatrisk.org's own
 * stylesheet rather than guessed from a screenshot:
 *
 * - `.wrapper` is the one container. It is full width with 16px gutters, and
 *   from 1280px up it takes 40px gutters and stops growing at 1744px.
 * - `.row` is a 12-column grid. The site builds it out of negative row
 *   margins against column padding — 8px a side below 768px, 12px above —
 *   which lands content on exactly the same lines as a grid gap of 16 and 24.
 * - Column spans change at the site's own steps: `md` (768), `lg` (1024),
 *   `xl` (1280).
 *
 * Sections stay full-bleed so their ground can run edge to edge; the Wrapper
 * goes inside them, around the content.
 */

export interface WrapperProps {
  as?: ElementType;
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
  /** Some callers measure the content box — e.g. the V5 header, which is
   *  where the hero's wordmark has to land. */
  innerRef?: Ref<HTMLDivElement>;
}

/**
 * Full width, 16px gutters, 40px and a 1744px ceiling from `xl` up.
 * Flat pixels, not the rem steps: the base font here is 18px, so `px-4` would
 * measure 18 and `px-10` 45 — neither is the site's gutter.
 *
 * The gutters and the ceiling are divided by `--satr-fit`, which is 1 wherever
 * nothing sets it — that is every page but one. A caller that has scaled a
 * whole block down to fit the screen sets it to the scale it used, and the
 * gutter grows by as much as the block shrinks, so it still measures 40px on
 * screen and the block stays on the same lines as the header bar above it.
 */
export const wrapperClass =
  'mx-auto w-full px-[calc(16px/var(--satr-fit,1))] xl:max-w-[calc(1744px/var(--satr-fit,1))] xl:px-[calc(40px/var(--satr-fit,1))]';

export function Wrapper({
  as: Tag = 'div',
  children,
  className = '',
  style,
  innerRef,
}: WrapperProps) {
  return (
    <Tag ref={innerRef} className={`${wrapperClass} ${className}`.trim()} style={style}>
      {children}
    </Tag>
  );
}

/** Twelve columns with the site's gutter: 16px on phones, 24px from `md`.
 *  Flat pixels for the same reason as the wrapper's padding, and divided by
 *  the same `--satr-fit` so the column lines hold under a scaled block. */
export const rowClass =
  'grid w-full grid-cols-12 gap-x-[calc(16px/var(--satr-fit,1))] md:gap-x-[calc(24px/var(--satr-fit,1))]';

export interface RowProps {
  as?: ElementType;
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
}

export function Row({ as: Tag = 'div', children, className = '', style }: RowProps) {
  return (
    <Tag className={`${rowClass} ${className}`.trim()} style={style}>
      {children}
    </Tag>
  );
}

/* Written out rather than built by template string: Tailwind only ships the
   class names it can find in the source, and `col-span-${n}` finds nothing. */
const SPAN = [
  '',
  'col-span-1',
  'col-span-2',
  'col-span-3',
  'col-span-4',
  'col-span-5',
  'col-span-6',
  'col-span-7',
  'col-span-8',
  'col-span-9',
  'col-span-10',
  'col-span-11',
  'col-span-12',
] as const;

const SPAN_MD = [
  '',
  'md:col-span-1',
  'md:col-span-2',
  'md:col-span-3',
  'md:col-span-4',
  'md:col-span-5',
  'md:col-span-6',
  'md:col-span-7',
  'md:col-span-8',
  'md:col-span-9',
  'md:col-span-10',
  'md:col-span-11',
  'md:col-span-12',
] as const;

const SPAN_LG = [
  '',
  'lg:col-span-1',
  'lg:col-span-2',
  'lg:col-span-3',
  'lg:col-span-4',
  'lg:col-span-5',
  'lg:col-span-6',
  'lg:col-span-7',
  'lg:col-span-8',
  'lg:col-span-9',
  'lg:col-span-10',
  'lg:col-span-11',
  'lg:col-span-12',
] as const;

const SPAN_XL = [
  '',
  'xl:col-span-1',
  'xl:col-span-2',
  'xl:col-span-3',
  'xl:col-span-4',
  'xl:col-span-5',
  'xl:col-span-6',
  'xl:col-span-7',
  'xl:col-span-8',
  'xl:col-span-9',
  'xl:col-span-10',
  'xl:col-span-11',
  'xl:col-span-12',
] as const;

/* An offset of n starts the column on line n + 1. */
const START_MD = [
  'md:col-start-1',
  'md:col-start-2',
  'md:col-start-3',
  'md:col-start-4',
  'md:col-start-5',
  'md:col-start-6',
  'md:col-start-7',
  'md:col-start-8',
  'md:col-start-9',
  'md:col-start-10',
  'md:col-start-11',
  'md:col-start-12',
] as const;

const START_LG = [
  'lg:col-start-1',
  'lg:col-start-2',
  'lg:col-start-3',
  'lg:col-start-4',
  'lg:col-start-5',
  'lg:col-start-6',
  'lg:col-start-7',
  'lg:col-start-8',
  'lg:col-start-9',
  'lg:col-start-10',
  'lg:col-start-11',
  'lg:col-start-12',
] as const;

export type ColSpan = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

export interface ColProps {
  as?: ElementType;
  /** Columns taken below `md`. Full width by default, as the site is. */
  span?: ColSpan;
  md?: ColSpan;
  lg?: ColSpan;
  xl?: ColSpan;
  /** Columns left empty to the left, from that step up. */
  offsetMd?: number;
  offsetLg?: number;
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
}

export function Col({
  as: Tag = 'div',
  span = 12,
  md,
  lg,
  xl,
  offsetMd,
  offsetLg,
  children,
  className = '',
  style,
}: ColProps) {
  const classes = [
    SPAN[span],
    md ? SPAN_MD[md] : '',
    lg ? SPAN_LG[lg] : '',
    xl ? SPAN_XL[xl] : '',
    offsetMd ? START_MD[offsetMd] : '',
    offsetLg ? START_LG[offsetLg] : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <Tag className={classes} style={style}>
      {children}
    </Tag>
  );
}
