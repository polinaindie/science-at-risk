/** Hidden SVG `<clipPath>` definition consumed by `useSquircleClipPath`'s `style`. */
export function SquircleDefs({ clipId, pathD }: { clipId: string; pathD: string }) {
  if (!pathD) return null;
  return (
    <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden focusable="false">
      <clipPath id={clipId} clipPathUnits="userSpaceOnUse">
        {/* `clip-rule` (not `fill-rule`) determines the inside/outside split
            when this path is used as a CSS `clip-path` — needed for the ring
            (outer + inner subpath) shape to actually punch a hole. */}
        <path d={pathD} clipRule="evenodd" />
      </clipPath>
    </svg>
  );
}

export default SquircleDefs;
