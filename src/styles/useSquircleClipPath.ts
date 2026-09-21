import { useEffect, useId, useState } from 'react';
import { buildSquirclePath } from './squirclePath';

export interface UseSquircleClipPathOptions {
  radius: number;
  smoothing?: number;
  /** > 0 draws a hollow ring instead of a filled shape (e.g. the bordered button variant). */
  strokeWidth?: number;
}

/**
 * Drives a true squircle `clip-path` on whatever element the returned
 * `ref` is attached to, recomputed live via ResizeObserver.
 *
 * Why not `mask-image: paint(squircle)` (a real CSS Paint API worklet,
 * matching the mirror exactly)? It measurably failed to paint for
 * elements already present in a React tree at registration time in this
 * environment (confirmed via an unconditional debug fill in the paint()
 * callback that never appeared, while the identical worklet painted fine
 * on freshly-appended plain elements) — a worklet/compositing quirk that
 * didn't resolve even gating on a confirmed-loaded class. `clip-path` with
 * a JS-computed SVG path is universally supported and has none of that
 * threading uncertainty, at the cost of computing the path ourselves
 * instead of the browser's paint thread.
 */
export function useSquircleClipPath({
  radius,
  smoothing = 0.9,
  strokeWidth = 0,
}: UseSquircleClipPathOptions) {
  const [node, setNode] = useState<HTMLElement | null>(null);
  const rawId = useId();
  const clipId = `squircle-${rawId.replace(/[^a-zA-Z0-9]/g, '')}`;
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (!node) return;

    const update = () => {
      const rect = node.getBoundingClientRect();
      setSize({ width: rect.width, height: rect.height });
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
