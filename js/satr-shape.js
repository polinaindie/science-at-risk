/*
 * satr-shape.js — the Science at Risk squircle. No dependencies, ~1 KB gzipped.
 *
 * THE SHAPE IS PART OF THE IDENTITY: a rounded rectangle whose corners are drawn with Figma's "corner smoothing" 0.9
 * (one bezier per corner, control points at 0.1765 of the radius instead of 0.4477 for a circle). It is the same
 * geometry as src/styles/squirclePath.ts, which the React site uses. Do not replace it with border-radius.
 *
 * MARKUP CONTRACT
 *   Filled shape (tags, chips, black/white buttons): put data-squircle on the element that is cut.
 *       <a class="satr-tag" data-squircle href="…">Biology</a>
 *   Shape on a background layer (buttons; the label must not be clipped away by a ring):
 *       <button class="satr-squircle satr-squircle--bordered" data-squircle="bg" data-ring="2">
 *         <span class="satr-squircle__bg" aria-hidden="true"></span>Label
 *       </button>
 *       data-squircle="bg" cuts the first child whose class ends in __bg.
 *   Options (all optional):  data-radius="16"  px, default 16;  data-ring="2"  px: draws a hollow outline instead of a
 *   filled shape; the ring disappears (fills) while the pointer is over the element, like the React Button.
 *
 * What it does: sets clip-path: url(#id) and border-radius: 0 on the target and redraws when the element is resized.
 * Before it runs (or with JavaScript off) the element keeps its CSS border-radius, so nothing breaks: a plain rounded
 * rectangle of the same size. Elements added later: call window.satrShape.init(container).
 */
(() => {
  const CIRCLE = 0.44772;
  const FIGMA = 0.1765;
  const kappaFor = (s) => CIRCLE + ((FIGMA - CIRCLE) * Math.max(0, Math.min(1, s))) / 0.9;
  const rnd = (v) => Math.round(v * 100) / 100;

  function trace(ox, oy, w, h, r, k) {
    const corner = (cx, cy, t1x, t1y, t2x, t2y) => ({ cx, cy, t1x, t1y, t2x, t2y });
    const tr = corner(ox + w, oy, ox + w - r, oy, ox + w, oy + r);
    const br = corner(ox + w, oy + h, ox + w, oy + h - r, ox + w - r, oy + h);
    const bl = corner(ox, oy + h, ox + r, oy + h, ox, oy + h - r);
    const tl = corner(ox, oy, ox, oy + r, ox + r, oy);
    const seg = (c) =>
      `C ${rnd(c.cx + (c.t1x - c.cx) * k)} ${rnd(c.cy + (c.t1y - c.cy) * k)} ${rnd(
        c.cx + (c.t2x - c.cx) * k,
      )} ${rnd(c.cy + (c.t2y - c.cy) * k)} ${rnd(c.t2x)} ${rnd(c.t2y)}`;
    return [
      `M ${rnd(tl.t2x)} ${rnd(tl.t2y)}`,
      `L ${rnd(tr.t1x)} ${rnd(tr.t1y)}`, seg(tr),
      `L ${rnd(br.t1x)} ${rnd(br.t1y)}`, seg(br),
      `L ${rnd(bl.t1x)} ${rnd(bl.t1y)}`, seg(bl),
      `L ${rnd(tl.t1x)} ${rnd(tl.t1y)}`, seg(tl),
      'Z',
    ].join(' ');
  }

  function path(w, h, radius, ring) {
    if (w <= 0 || h <= 0) return '';
    const k = kappaFor(0.9);
    const r = Math.max(0, Math.min(radius, w / 2, h / 2));
    const outer = trace(0, 0, w, h, r, k);
    if (ring <= 0 || w - ring * 2 <= 0 || h - ring * 2 <= 0) return outer;
    return `${outer} ${trace(ring, ring, w - ring * 2, h - ring * 2, Math.max(0, radius - ring), k)}`;
  }

  const NS = 'http://www.w3.org/2000/svg';
  let defs;
  let n = 0;
  const done = new WeakSet();

  function defsRoot() {
    if (defs) return defs;
    const svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('width', '0');
    svg.setAttribute('height', '0');
    svg.setAttribute('aria-hidden', 'true');
    svg.setAttribute('focusable', 'false');
    svg.style.position = 'absolute';
    defs = document.createElementNS(NS, 'defs');
    svg.appendChild(defs);
    document.body.appendChild(svg);
    return defs;
  }

  function init(host) {
    if (done.has(host)) return;
    done.add(host);
    const target =
      host.dataset.squircle === 'bg' ? host.querySelector('[class$="__bg"], [class*="__bg "]') : host;
    if (!target) return;
    const radius = host.dataset.radius !== undefined ? Number(host.dataset.radius) : 16;
    const ringWidth = Number(host.dataset.ring) || 0;

    const id = `satr-shape-${n++}`;
    const clip = document.createElementNS(NS, 'clipPath');
    clip.setAttribute('id', id);
    clip.setAttribute('clipPathUnits', 'userSpaceOnUse');
    const p = document.createElementNS(NS, 'path');
    p.setAttribute('clip-rule', 'evenodd');
    clip.appendChild(p);
    defsRoot().appendChild(clip);

    let hovered = false;
    const draw = () => {
      // offsetWidth/Height: the layout box. getBoundingClientRect would carry an ancestor's transform.
      const d = path(target.offsetWidth, target.offsetHeight, radius, hovered ? 0 : ringWidth);
      if (!d) return;
      p.setAttribute('d', d);
      target.style.clipPath = `url(#${id})`;
      target.style.borderRadius = '0';
      target.dataset.squircleReady = 'true';
    };
    if (ringWidth) {
      const set = (v) => () => {
        hovered = v;
        draw();
      };
      host.addEventListener('mouseenter', set(true));
      host.addEventListener('mouseleave', set(false));
    }
    draw();
    new ResizeObserver(draw).observe(target);
  }

  const run = (root) => (root || document).querySelectorAll('[data-squircle]').forEach(init);
  window.satrShape = { init: run };
  document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', () => run()) : run();
})();
