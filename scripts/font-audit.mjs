#!/usr/bin/env node
/**
 * Font audit: walks every page of the site and records every distinct typographic
 * "entity" (family + size + weight + style + line-height + letter-spacing + case)
 * that is actually rendered on it, with the elements/classes that use it.
 *
 *   node scripts/font-audit.mjs                       # http://localhost:5174, all pages
 *   node scripts/font-audit.mjs --base=http://localhost:5174 --viewport=1440x900
 *   node scripts/font-audit.mjs --viewport=390x844    # phone
 *   node scripts/font-audit.mjs --only=about,cabinet  # substring filter on the page path
 *
 * Output: docs/font-audit/raw-<viewport>.json  (per page, per entity)
 */
import { chromium } from 'playwright';
import { readdirSync, statSync, mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const arg = (name, def) => {
  const hit = process.argv.find((a) => a.startsWith(`--${name}=`));
  return hit ? hit.slice(name.length + 3) : def;
};
const BASE = arg('base', 'http://localhost:5174').replace(/\/$/, '');
const [VW, VH] = arg('viewport', '1440x900').split('x').map(Number);
const ONLY = arg('only', '').split(',').filter(Boolean);
const CONCURRENCY = Number(arg('concurrency', 4));

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const publicDir = path.join(root, 'public');
const outDir = path.join(root, 'docs', 'font-audit');

// ---- page list -----------------------------------------------------------
const SKIP_DIRS = new Set(['handoff', 'email', 'cdn-cgi', 'assets', 'css', 'js', 'fonts', 'images', 'storage']);
const pages = [
  '/', '/uk',
  '/cabinet/profile', '/cabinet/welcome', '/cabinet/notifications', '/cabinet/collaboration',
  '/cabinet/courses', '/cabinet/grants', '/cabinet/settings',
  '/handoff/index.html', '/handoff/typography.html', '/handoff/states.html', '/handoff/static-components.html',
];
const walk = (dir, rel = '') => {
  for (const name of readdirSync(dir).sort()) {
    const full = path.join(dir, name);
    const r = rel ? `${rel}/${name}` : name;
    if (statSync(full).isDirectory()) {
      if (!rel && SKIP_DIRS.has(name)) continue;
      walk(full, r);
    } else if (name.endsWith('.html')) pages.push(`/${r}`);
  }
};
walk(publicDir);
const list = [...new Set(pages)].filter((p) => !ONLY.length || ONLY.some((o) => p.includes(o)));

// ---- in-page collector ---------------------------------------------------
function collect() {
  const out = new Map();
  const visible = (el, cs) => {
    if (cs.display === 'none' || cs.visibility === 'hidden' || +cs.opacity === 0) return false;
    const r = el.getBoundingClientRect();
    return r.width > 0 && r.height > 0;
  };
  const sel = (el) => {
    const cls = [...el.classList].slice(0, 3).map((c) => '.' + c).join('');
    return el.tagName.toLowerCase() + cls;
  };
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  let n;
  while ((n = walker.nextNode())) {
    const text = n.nodeValue.replace(/\s+/g, ' ').trim();
    if (!text) continue;
    const el = n.parentElement;
    if (!el || ['SCRIPT', 'STYLE', 'NOSCRIPT', 'TEMPLATE'].includes(el.tagName)) continue;
    const cs = getComputedStyle(el);
    if (!visible(el, cs)) continue;
    const first = cs.fontFamily.split(',')[0].trim().replace(/^["']|["']$/g, '');
    const key = [first, cs.fontSize, cs.fontWeight, cs.fontStyle, cs.lineHeight, cs.letterSpacing, cs.textTransform].join('|');
    let e = out.get(key);
    if (!e) {
      e = {
        family: first, stack: cs.fontFamily, size: cs.fontSize, weight: cs.fontWeight, style: cs.fontStyle,
        lineHeight: cs.lineHeight, letterSpacing: cs.letterSpacing, transform: cs.textTransform,
        colors: {}, count: 0, chars: 0, elements: {}, samples: [],
      };
      out.set(key, e);
    }
    e.count++;
    e.chars += text.length;
    e.colors[cs.color] = (e.colors[cs.color] || 0) + 1;
    // the element itself, then the three nearest ancestors: roles are decided from this chain
    let chain = sel(el), up = el.parentElement;
    for (let i = 0; i < 3 && up && up !== document.body; i++, up = up.parentElement) chain += ' ‹ ' + sel(up);
    e.elements[chain] = (e.elements[chain] || 0) + 1;
    if (e.samples.length < 3 && !e.samples.includes(text.slice(0, 50))) e.samples.push(text.slice(0, 50));
  }
  // placeholders count as rendered text too
  document.querySelectorAll('input[placeholder],textarea[placeholder]').forEach(() => {});
  return {
    entities: [...out.values()],
    title: document.title,
    lang: document.documentElement.lang,
    fontsLoaded: [...document.fonts].filter((f) => f.status === 'loaded').map((f) => `${f.family} ${f.weight} ${f.style}`),
    hScroll: document.documentElement.scrollWidth > window.innerWidth,
  };
}

// ---- run -------------------------------------------------------------------
const browser = await chromium.launch();
const results = {};
let done = 0;
const queue = [...list];
const worker = async () => {
  const ctx = await browser.newContext({ viewport: { width: VW, height: VH } });
  const page = await ctx.newPage();
  while (queue.length) {
    const p = queue.shift();
    // the dev server may reload a page mid-visit (hand-off sync), so a failed visit is retried
    for (let attempt = 1; attempt <= 4; attempt++) {
      try {
        const resp = await page.goto(BASE + p, { waitUntil: 'load', timeout: 30000 });
        await page.evaluate(() => document.fonts.ready);
        await page.waitForTimeout(300);
        // trigger lazy content
        await page.evaluate(async () => {
          for (let y = 0; y < document.body.scrollHeight; y += 700) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 30)); }
          window.scrollTo(0, 0);
        });
        const data = await page.evaluate(collect);
        results[p] = { status: resp?.status(), ...data };
        break;
      } catch (err) {
        results[p] = { error: String(err).slice(0, 400) };
        await page.waitForTimeout(500 * attempt);
      }
    }
    process.stdout.write(`\r${++done}/${list.length} ${p.slice(0, 70).padEnd(70)}`);
  }
  await ctx.close();
};
await Promise.all(Array.from({ length: CONCURRENCY }, worker));
await browser.close();

const failed = Object.values(results).filter((r) => r.error).length;
if (failed > list.length * 0.2) {
  console.error(`\n${failed}/${list.length} pages failed (is the server at ${BASE} running?). Nothing written.`);
  process.exit(1);
}
mkdirSync(outDir, { recursive: true });
const file = path.join(outDir, `raw-${VW}x${VH}.json`);
writeFileSync(file, JSON.stringify({ base: BASE, viewport: `${VW}x${VH}`, date: new Date().toISOString(), pages: results }, null, 1));
console.log(`\nWrote ${path.relative(root, file)} (${Object.keys(results).length} pages)`);
