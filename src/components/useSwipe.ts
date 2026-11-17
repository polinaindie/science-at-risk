import { useRef, type PointerEvent } from 'react';

/**
 * Horizontal swipe for a carousel on a phone. Spread the result on the element that should react.
 * Pointer events, so a finger and a mouse drag (the browser's phone preview sends mouse) both work; below `maxWidth`
 * only, so a click-drag on a desktop page stays a text selection. A swipe counts when it runs further sideways than
 * up or down and past `distance` px, so scrolling the page with a thumb never turns a slide; `touch-action: pan-y`
 * leaves the vertical scroll to the browser.
 */
export function useSwipe({
  onLeft,
  onRight,
  distance = 40,
  maxWidth = 767,
}: {
  onLeft: () => void;
  onRight: () => void;
  distance?: number;
  maxWidth?: number;
}) {
  const start = useRef<{ x: number; y: number } | null>(null);
  const narrow = () => window.matchMedia(`(max-width: ${maxWidth}px)`).matches;
  return {
    style: { touchAction: 'pan-y' as const },
    onDragStart: (e: React.DragEvent) => {
      if (narrow()) e.preventDefault(); // a dragged photo or link would otherwise take the gesture
    },
    onPointerDown: (e: PointerEvent) => {
      start.current = narrow() ? { x: e.clientX, y: e.clientY } : null;
    },
    onPointerUp: (e: PointerEvent) => {
      const from = start.current;
      start.current = null;
      if (!from) return;
      const dx = e.clientX - from.x;
      const dy = e.clientY - from.y;
      if (Math.abs(dx) < distance || Math.abs(dx) < Math.abs(dy) * 1.5) return;
      if (dx < 0) onLeft();
      else onRight();
    },
    onPointerCancel: () => {
      start.current = null;
    },
  };
}
