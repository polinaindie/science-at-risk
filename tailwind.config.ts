import type { Config } from 'tailwindcss';

/**
 * Tailwind v4 primarily uses CSS `@theme` in `src/styles/globals.css`.
 * This file documents the typography scale for tooling and reference.
 */
const config: Config = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}', './.storybook/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Noto Serif"', 'serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
        ukraine: ['"e-Ukraine"', 'sans-serif'],
      },
      fontSize: {
        'h1-desktop': ['72px', { lineHeight: '76px', letterSpacing: '-0.02em' }],
        'h1-mobile': ['32px', { lineHeight: '38px', letterSpacing: '-0.02em' }],
        'h2-desktop': ['36px', { lineHeight: '42px', letterSpacing: '-0.02em' }],
        'h2-mobile': ['20px', { lineHeight: '28px', letterSpacing: '-0.02em' }],
        'h3-desktop': ['22px', { lineHeight: '28px', letterSpacing: '-0.03em' }],
        'h3-mobile': ['15px', { lineHeight: '20px', letterSpacing: '-0.03em' }],
        'text1-desktop': ['18px', { lineHeight: '28px', letterSpacing: '-0.03em' }],
        'text1-mobile': ['13px', { lineHeight: '18px', letterSpacing: '-0.03em' }],
        'text2-desktop': ['18px', { lineHeight: '26px', letterSpacing: '0' }],
        'text2-mobile': ['14px', { lineHeight: '22px', letterSpacing: '0' }],
        breadcrumbs: ['12px', { lineHeight: '16px', letterSpacing: '-0.03em' }],
      },
      colors: {
        brand: {
          black: '#000000',
          white: '#ffffff',
          muted: '#595959',
          'accent-blue': '#b5c6cd',
          'accent-yellow': '#f0eebe',
        },
      },
      screens: {
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1440px',
      },
    },
  },
};

export default config;
