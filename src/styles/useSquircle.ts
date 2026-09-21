import { useEffect, useId, useState } from 'react';
import { buildSquirclePath } from './squirclePath';

export interface UseSquircleOptions {
  /** Corner radius in px; the site asks for 60 on pills and 25 on the select panel. */
  radius: number;
  smoothing?: number;
  /** > 0 renders a ring instead of a solid — the site's `--squircle-outline`. */
  strokeWidth?: number;
}

/**
 * Clips an element to a squircle, recomputing the path whenever it resizes.
 *
 * The site does this with `mask-image: paint(squircle)`, a CSS Paint API
 * worklet it never actually registers — so nothing renders the real shape
 * there. A clip-path built from a JS-computed SVG path needs no worklet and
 * works everywhere, at the cost of measuring the element ourselves.
 */
export function useSquircle({ radius, smoothing = 0.9, strokeWidth = 0 }: UseSquircleOptions) {
  const [node, setNode] = useState<HTMLElement | null>(null);
  const clipId = `squircle-${useId().replace(/[^a-zA-Z0-9]/g, '')}`;
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (!node) return;
    const update = () => {
      const rect = node.getBoundingClientRect();
      // Snap to a half pixel, and only commit a genuine change.
      //
      // Both halves matter. A fresh object on every callback would re-render on
      // every observation; and without rounding, a layout that settles on
      // fractional sizes — a percentage-padding image next to a flex column,
      // say — jitters in the last decimal, so the comparison never matches and
      // the ResizeObserver feeds itself forever. Half a pixel is far below
      // anything the path renders differently.
      const width = Math.round(rect.width * 2) / 2;
      const height = Math.round(rect.height * 2) / 2;
      setSize((prev) => (prev.width === width && prev.height === height ? prev : { width, height }));
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(node);
    return () => observer.disconnect();
  }, [node]);

  const pathD = buildSquirclePath({ ...size, radius, smoothing, strokeWidth });

  return {
    ref: setNode,
    clipId,
    pathD,
    style: pathD ? { clipPath: `url(#${clipId})` } : undefined,
  };
}
