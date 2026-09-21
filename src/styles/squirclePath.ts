/**
 * Squircle geometry — a rounded rect whose corners are one cubic bezier each,
 * with control points pulled in tight against the corner instead of bulging
 * out along the tangent the way a circular arc does.
 *
 * Verified against the design system's own vector (Figma node 58:3485,
 * "Squircle", 150x47, cornerRadius = height/2 = 23.5), exported as:
 *
 *   M0 23.5 C0 4.14775 4.14775 0 23.5 0 H126.5 C145.852 0 150 4.14775
 *   150 23.5 C150 42.8522 145.852 47 126.5 47 H23.5 C4.14775 47 0 42.8522
 *   0 23.5 Z
 *
 * Each control point sits 4.14775 from the corner, i.e. 4.14775 / 23.5 =
 * 0.1765 of the radius, against ~0.4477 for a true quarter-circle. That
 * ratio is FIGMA_KAPPA below, and it is what makes the corner read as a
 * squircle rather than a rounded rectangle.
 */

/** Control-point distance from the corner, as a fraction of r, for a circular arc. */
const CIRCLE_KAPPA = 0.44772;
/** The same ratio, matching the Figma squircle at `smoothing = 0.9`. */
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
  /** Tangent point on the incoming edge, where the previous line ends. */
  t1x: number;
  t1y: number;
  /** Tangent point on the outgoing edge, where the next line starts. */
  t2x: number;
  t2y: number;
}

function corners(ox: number, oy: number, w: number, h: number, r: number): Corner[] {
  return [
    { cx: ox + w, cy: oy, t1x: ox + w - r, t1y: oy, t2x: ox + w, t2y: oy + r },
    { cx: ox + w, cy: oy + h, t1x: ox + w, t1y: oy + h - r, t2x: ox + w - r, t2y: oy + h },
    { cx: ox, cy: oy + h, t1x: ox + r, t1y: oy + h, t2x: ox, t2y: oy + h - r },
    { cx: ox, cy: oy, t1x: ox, t1y: oy + r, t2x: ox + r, t2y: oy },
  ];
}

const round = (v: number) => Math.round(v * 10000) / 10000;

function tracePath(ox: number, oy: number, w: number, h: number, r: number, kappa: number): string {
  const [tr, br, bl, tl] = corners(ox, oy, w, h, r);

  const cornerSegment = (c: Corner) => {
    const c1x = c.cx + (c.t1x - c.cx) * kappa;
    const c1y = c.cy + (c.t1y - c.cy) * kappa;
    const c2x = c.cx + (c.t2x - c.cx) * kappa;
    const c2y = c.cy + (c.t2y - c.cy) * kappa;
    return `C ${round(c1x)} ${round(c1y)} ${round(c2x)} ${round(c2y)} ${round(c.t2x)} ${round(c.t2y)}`;
  };

  // When the radius reaches half the side, consecutive corners meet and the
  // edge between them has zero length — skip those `L`s rather than emit them.
  let x = tl.t2x;
  let y = tl.t2y;
  const out = [`M ${round(x)} ${round(y)}`];
  for (const c of [tr, br, bl, tl]) {
    if (round(c.t1x) !== round(x) || round(c.t1y) !== round(y)) {
      out.push(`L ${round(c.t1x)} ${round(c.t1y)}`);
    }
    out.push(cornerSegment(c));
    x = c.t2x;
    y = c.t2y;
  }
  out.push('Z');
  return out.join(' ');
}

export interface SquirclePathOptions {
  width: number;
  height: number;
  /** Corner radius in px, clamped to half the shorter side — a pill at high values. */
  radius: number;
  /** 0–1: 0 is a true circular arc, 0.9 is the design system's squircle. */
  smoothing?: number;
  /** > 0 draws a hollow ring (outer minus inner contour, evenodd) instead of a solid. */
  strokeWidth?: number;
}

/** Builds the `d` for a `<clipPath clipPathUnits="userSpaceOnUse">`. */
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
  const innerR = Math.max(0, r - strokeWidth);
  if (innerW <= 0 || innerH <= 0) return outer;

  return `${outer} ${tracePath(strokeWidth, strokeWidth, innerW, innerH, innerR, kappa)}`;
}
