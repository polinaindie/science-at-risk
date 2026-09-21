/**
 * True "squircle" geometry — a rounded rect whose corners are drawn with a
 * single cubic bezier per corner, control points pulled in close to the
 * corner point rather than bulging out along the tangent (mirrors Figma's
 * "corner smoothing" export, not a plain circular-arc rounded rect). Used as
 * a plain SVG path so it can drive a `clip-path` — universally supported,
 * unlike the CSS Paint API (see useSquircleClipPath for why).
 *
 * Verified against the Figma source (node 1:191, `Squircle`, exported as a
 * flattened vector): for a 197x47 pill (cornerRadius = height/2 = 23.5) the
 * path is `M0 23.5 C0 4.14775 4.14775 0 23.5 0 H173.5 C192.852 0 197
 * 4.14775 197 23.5 ...` — i.e. each control point sits only
 * `4.14775 / 23.5 ≈ 0.1765` of the radius away from the corner, versus
 * `≈ 0.4477` for a true circular arc. `FIGMA_KAPPA` below is that ratio.
 */

/** Control-point distance from the corner (as a fraction of r) for a true circular arc. */
const CIRCLE_KAPPA = 0.44772;
/** Same ratio, but matching the Figma "Squircle" export at `smoothing = 0.9`. */
const FIGMA_KAPPA = 0.1765;
const FIGMA_KAPPA_SMOOTHING = 0.9;

function kappaFor(smoothing: number): number {
  const s = Math.max(0, Math.min(1, smoothing));
  return CIRCLE_KAPPA + ((FIGMA_KAPPA - CIRCLE_KAPPA) * s) / FIGMA_KAPPA_SMOOTHING;
}

interface Corner {
  /** The rect's actual corner point. */
  cx: number;
  cy: number;
  /** Tangent point on the incoming edge (where the previous line ends). */
  t1x: number;
  t1y: number;
  /** Tangent point on the outgoing edge (where the next line starts). */
  t2x: number;
  t2y: number;
}

function corners(ox: number, oy: number, w: number, h: number, r: number): Corner[] {
  return [
    { cx: ox + w, cy: oy, t1x: ox + w - r, t1y: oy, t2x: ox + w, t2y: oy + r }, // top-right
    { cx: ox + w, cy: oy + h, t1x: ox + w, t1y: oy + h - r, t2x: ox + w - r, t2y: oy + h }, // bottom-right
    { cx: ox, cy: oy + h, t1x: ox + r, t1y: oy + h, t2x: ox, t2y: oy + h - r }, // bottom-left
    { cx: ox, cy: oy, t1x: ox, t1y: oy + r, t2x: ox + r, t2y: oy }, // top-left
  ];
}

function tracePath(ox: number, oy: number, w: number, h: number, r: number, kappa: number): string {
  const round = (v: number) => Math.round(v * 100) / 100;
  const [tr, br, bl, tl] = corners(ox, oy, w, h, r);

  const cornerSegment = (c: Corner) => {
    const c1x = c.cx + (c.t1x - c.cx) * kappa;
    const c1y = c.cy + (c.t1y - c.cy) * kappa;
    const c2x = c.cx + (c.t2x - c.cx) * kappa;
    const c2y = c.cy + (c.t2y - c.cy) * kappa;
    return `C ${round(c1x)} ${round(c1y)} ${round(c2x)} ${round(c2y)} ${round(c.t2x)} ${round(c.t2y)}`;
  };

  return [
    `M ${round(tl.t2x)} ${round(tl.t2y)}`,
    `L ${round(tr.t1x)} ${round(tr.t1y)}`,
    cornerSegment(tr),
    `L ${round(br.t1x)} ${round(br.t1y)}`,
    cornerSegment(br),
    `L ${round(bl.t1x)} ${round(bl.t1y)}`,
    cornerSegment(bl),
    `L ${round(tl.t1x)} ${round(tl.t1y)}`,
    cornerSegment(tl),
    'Z',
  ].join(' ');
}

export interface SquirclePathOptions {
  width: number;
  height: number;
  /** Corner radius in px, clamped to half the shorter side (a pill at high values). */
  radius: number;
  /** 0–1: 0 is a true circular arc, higher pulls the curve in tighter (Figma default ≈ 0.9). */
  smoothing?: number;
  /** > 0 draws a hollow ring (outer minus inner contour, evenodd) instead of a filled shape. */
  strokeWidth?: number;
}

/** Builds an SVG path `d` string for use in a `<clipPath clipPathUnits="userSpaceOnUse">`. */
export function buildSquirclePath({
  width,
  height,
  radius,
  smoothing = 0.9,
  strokeWidth = 0,
}: SquirclePathOptions): string {
  if (width <= 0 || height <= 0) return '';
  const kappa = kappaFor(smoothing);
  const r = Math.max(0, Math.min(radius, width / 2, height / 2));
  const outer = tracePath(0, 0, width, height, r, kappa);

  if (strokeWidth <= 0) return outer;

  const innerW = width - strokeWidth * 2;
  const innerH = height - strokeWidth * 2;
  const innerR = Math.max(0, radius - strokeWidth);
  if (innerW <= 0 || innerH <= 0) return outer;

  const inner = tracePath(strokeWidth, strokeWidth, innerW, innerH, innerR, kappa);
  return `${outer} ${inner}`;
}
