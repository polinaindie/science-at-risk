/**
 * Color tokens from Figma node 292:1481 (SAtR UI concept).
 */

export type ColorTokenId = 'white' | 'black' | 'accentBlue' | 'accentYellow';

export interface ColorToken {
  id: ColorTokenId;
  hex: string;
  /** Ukrainian usage note from Figma */
  usage: string;
  /** Tailwind background utility */
  swatchClass: string;
  /** Figma swatch node id */
  nodeId: string;
  /** Show black border (needed for white on white canvas) */
  bordered?: boolean;
}

export const colorTokens: ColorToken[] = [
  {
    id: 'white',
    hex: '#FFFFFF',
    usage: 'Для фону',
    swatchClass: 'bg-brand-white',
    nodeId: '292:1482',
    bordered: true,
  },
  {
    id: 'black',
    hex: '#000000',
    usage: 'Для фону та тексту',
    swatchClass: 'bg-brand-black',
    nodeId: '292:1483',
  },
  {
    id: 'accentBlue',
    hex: '#B5C6CD',
    usage: 'Для акцентів',
    swatchClass: 'bg-brand-accent-blue',
    nodeId: '292:1484',
  },
  {
    id: 'accentYellow',
    hex: '#F0EEBE',
    usage: 'Для акцентів',
    swatchClass: 'bg-brand-accent-yellow',
    nodeId: '292:1485',
  },
];
