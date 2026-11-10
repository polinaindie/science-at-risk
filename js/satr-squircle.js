/*
 * satr-squircle.js — draws the outlined squircle link on the static pages.
 * The geometry is src/styles/squirclePath.ts (Figma's corner smoothing, 0.9),
 * ported as it is; the markup is what <SquircleLink> renders.
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
  let n = 0;

  function init(el) {
    const bg = el.querySelector('.satr-squircle-link__bg');
    if (!bg) return;
    const radius = Number(el.dataset.radius) || 14;
    const ringWidth = Number(el.dataset.ring) || 1.5;
    const id = `satr-sq-link-${n++}`;

    const svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('width', '0');
    svg.setAttribute('height', '0');
    svg.setAttribute('aria-hidden', 'true');
    svg.setAttribute('focusable', 'false');
    svg.style.position = 'absolute';
    const clip = document.createElementNS(NS, 'clipPath');
    clip.setAttribute('id', id);
    clip.setAttribute('clipPathUnits', 'userSpaceOnUse');
    const p = document.createElementNS(NS, 'path');
    p.setAttribute('clip-rule', 'evenodd');
    clip.appendChild(p);
    svg.appendChild(clip);
    el.appendChild(svg);

    let hovered = false;
    const draw = () => {
      // offsetWidth/Height: the layout box, not a transformed rect.
      const d = path(bg.offsetWidth, bg.offsetHeight, radius, hovered ? 0 : ringWidth);
      if (!d) return;
      p.setAttribute('d', d);
      bg.style.clipPath = `url(#${id})`;
      bg.style.borderRadius = '0';
      bg.dataset.ready = 'true';
    };
    const set = (v) => () => {
      hovered = v;
      draw();
    };
    el.addEventListener('mouseenter', set(true));
    el.addEventListener('mouseleave', set(false));
    el.addEventListener('focus', set(true));
    el.addEventListener('blur', set(false));
    draw();
    new ResizeObserver(draw).observe(bg);
  }

  const run = () => document.querySelectorAll('[data-satr-squircle="outline"]').forEach(init);
  document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', run) : run();
})();
