/**
 * Typography tokens from Figma node 292:1454 (SAtR UI concept).
 * Source of truth: Figma — not the live site mirror (which uses heavier heading weights).
 */

export type TypographyBreakpoint = 'desktop' | 'mobile';

export type TypographyTokenId =
  | 'h1'
  | 'h2'
  | 'h3'
  | 'text1'
  | 'text2'
  | 'breadcrumbs';

export interface TypographyToken {
  id: TypographyTokenId;
  label: string;
  fontFamily: 'Noto Serif' | 'IBM Plex Mono' | 'e-Ukraine';
  fontWeight: 300 | 400;
  desktop: {
    size: number;
    lineHeight: number;
    letterSpacing: number;
  };
  mobile: {
    size: number;
    lineHeight: number;
    letterSpacing: number;
  };
  /** Tailwind utility classes for the sample text */
  className: {
    desktop: string;
    mobile: string;
  };
}

export const typographyTokens: TypographyToken[] = [
  {
    id: 'h1',
    label: 'H1',
    fontFamily: 'Noto Serif',
    fontWeight: 400,
    desktop: { size: 72, lineHeight: 76, letterSpacing: -0.02 },
    mobile: { size: 32, lineHeight: 38, letterSpacing: -0.02 },
    className: {
      desktop: 'font-serif font-normal text-h1-desktop',
      mobile: 'font-serif font-normal text-h1-mobile',
    },
  },
  {
    id: 'h2',
    label: 'H2',
    fontFamily: 'Noto Serif',
    fontWeight: 400,
    desktop: { size: 36, lineHeight: 42, letterSpacing: -0.02 },
    mobile: { size: 20, lineHeight: 28, letterSpacing: -0.02 },
    className: {
      desktop: 'font-serif font-normal text-h2-desktop',
      mobile: 'font-serif font-normal text-h2-mobile',
    },
  },
  {
    id: 'h3',
    label: 'H3',
    fontFamily: 'IBM Plex Mono',
    fontWeight: 400,
    desktop: { size: 22, lineHeight: 28, letterSpacing: -0.03 },
    mobile: { size: 15, lineHeight: 20, letterSpacing: -0.03 },
    className: {
      desktop: 'font-mono font-normal text-h3-desktop',
      mobile: 'font-mono font-normal text-h3-mobile',
    },
  },
  {
    id: 'text1',
    label: 'Text 1',
    fontFamily: 'IBM Plex Mono',
    fontWeight: 400,
    desktop: { size: 18, lineHeight: 28, letterSpacing: -0.03 },
    mobile: { size: 13, lineHeight: 18, letterSpacing: -0.03 },
    className: {
      desktop: 'font-mono font-normal text-text1-desktop',
      mobile: 'font-mono font-normal text-text1-mobile',
    },
  },
  {
    id: 'text2',
    label: 'Text 2',
    fontFamily: 'e-Ukraine',
    fontWeight: 300,
    desktop: { size: 18, lineHeight: 26, letterSpacing: 0 },
    mobile: { size: 14, lineHeight: 22, letterSpacing: 0 },
    className: {
      desktop: 'font-ukraine font-light text-text2-desktop',
      mobile: 'font-ukraine font-light text-text2-mobile',
    },
  },
  {
    id: 'breadcrumbs',
    label: 'Breadcrumbs',
    fontFamily: 'IBM Plex Mono',
    fontWeight: 400,
    desktop: { size: 12, lineHeight: 16, letterSpacing: -0.03 },
    mobile: { size: 12, lineHeight: 16, letterSpacing: -0.03 },
    className: {
      desktop: 'font-mono font-normal text-breadcrumbs',
      mobile: 'font-mono font-normal text-breadcrumbs',
    },
  },
];

function formatLetterSpacing(value: number): string {
  if (value === 0) return '';
  return `, ${Math.round(value * 100)}%`;
}

export function formatTypographySpec(
  token: TypographyToken,
  breakpoint: TypographyBreakpoint,
): string {
  const specs = token[breakpoint];
  const weightLabel = token.fontWeight === 300 ? 'Light' : 'Regular';
  const tracking = formatLetterSpacing(specs.letterSpacing);
  return `${token.fontFamily}, ${weightLabel}, ${specs.size}/${specs.lineHeight}${tracking}`;
}
