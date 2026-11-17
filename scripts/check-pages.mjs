#!/usr/bin/env node
/**
 * check-pages.mjs — look at the pages a change touched, not the whole site.
 *
 *   --widths 320,375,768   override viewports; --full saves full-page screenshots (for responsive sweeps)
 *   --max N   cap on pages taken from --changed (default 12): a sweeping change touches hundreds of static pages, so one per
 *             template (expert, story, society...) is kept first, then an even sample. Pass --max 9999 to check them all.
 *   node scripts/check-pages.mjs --changed          pages derived from `git diff` (uncommitted + last commit with --since HEAD~1)
 *   node scripts/check-pages.mjs /login.html /      explicit pages (paths on --base)
 *   node scripts/check-pages.mjs --preset fonts     a named set from PRESETS below
 *   npm run check:pages -- --changed
 *
 * Needs a server on --base (default http://localhost:5173, `npm run dev`; Vite serves public/ at the root).
 * For every page and viewport it checks, in the real browser after fonts have loaded:
 *   fonts    only the families in ALLOWED_FONTS are used on text; headings use HEADING_FONT; everything else BODY_FONT
 *   size     no text under MIN_PX (14px) — lists the offenders
 *   reading  running text (p, li, dd) is at least MIN_LH times its size in line-height
 *   layout   no horizontal scroll
 *   console  no errors, no failed requests
 *   assets   no stylesheet or script loaded from scienceatrisk.org (the live site changes under us: use the local copy)
 * and saves a screenshot to .check-pages/<page>-<width>.png. Exit code 1 if anything fails, so it can gate a commit.
 * Rule of thumb for the team: a check done by hand more than twice becomes a script; extend this one first.
 */
import { chromium } from 'playwright';
import { execSync } from 'node:child_process';
import { mkdirSync } from 'node:fs';

const ALLOWED_FONTS = ['Noto Serif', 'IBM Plex Mono'];
const HEADING_FONT = 'Noto Serif';
const BODY_FONT = 'IBM Plex Mono';
const MIN_PX = 14;
const MIN_LH = 1.4;
let VIEWPORTS = [{ width: 1280, height: 900 }, { width: 390, height: 844 }];

/** Named page sets: one representative page per template. Add the page you just worked on. */
const PRESETS = {
  fonts: ['/', '/about.html', '/scientists.html', '/research.html', '/stories.html', '/societies.html', '/infrastructures.html',
    '/login.html', '/uk.html', '/handoff/states.html', '/handoff/prose.html',
    ...pick('expert'), ...pick('story'), ...pick('society'), ...pick('research'), ...pick('infrastructure')],
};
function pick(dir) {
  try {
    const f = execSync(`ls public/${dir} | grep '\\.html$' | head -1`, { encoding: 'utf8' }).trim();
    return f ? [`/${dir}/${f}`] : [];
  } catch { return []; }
}

/** Which pages does a changed source file affect? Most specific rule wins; add rules as templates appear. */
const RULES = [
  [/^src\/(sandbox\/Home|components\/(SiteHeader|SiteFooter))/, ['/']],
  [/^src\/components\/Cabinet|^src\/sandbox\/Cabinet/, ['/cabinet', '/cabinet/welcome']],
  [/^public\/css\/pages\/expert/, [...pick('expert'), '/scientists.html']],
  [/^public\/css\/pages\/(story|stories)/, [...pick('story'), '/stories.html']],
  [/^public\/css\/pages\/society/, [...pick('society'), '/societies.html']],
  [/^public\/css\/pages\/(research|listing)/, ['/research.html', ...pick('research')]],
  [/^public\/css\/pages\/infrastructure/, [...pick('infrastructure'), '/infrastructures.html']],
  [/^public\/css\/satr-auth|^src\/components\/Auth/, ['/login.html', '/first-login.html']],
  [/^public\/css\/(tokens|satr-text|satr-components|type-scale|style\.min)|^src\/(styles|tokens)\//, PRESETS.fonts],
];

function args() {
  const a = process.argv.slice(2);
  const o = { base: 'http://localhost:5173', pages: [], changed: false, since: null, max: 12, out: '.check-pages', shots: true, full: false };
  for (let i = 0; i < a.length; i++) {
    const x = a[i];
    if (x === '--base') o.base = a[++i];
    else if (x === '--changed') o.changed = true;
    else if (x === '--since') o.since = a[++i];
    else if (x === '--preset') o.pages.push(...(PRESETS[a[++i]] ?? []));
    else if (x === '--max') o.max = Number(a[++i]);
    else if (x === '--out') o.out = a[++i];
    else if (x === '--no-shots') o.shots = false;
    else if (x === '--full') o.full = true;
    else if (x === '--widths') VIEWPORTS = a[++i].split(',').map((w) => ({ width: Number(w), height: Number(w) < 700 ? 844 : 900 }));
    else o.pages.push(x);
  }
  return o;
}

function changedPages(since) {
  const cmd = since ? `git diff --name-only ${since}` : 'git diff --name-only HEAD';
  const files = execSync(cmd, { encoding: 'utf8' }).split('\n').filter(Boolean);
  const pages = new Set();
  for (const f of files) {
    // a changed static page is itself the page to look at
    const m = f.match(/^public\/(.+\.html)$/);
    if (m && !m[1].startsWith('handoff/cabinet/email') && !m[1].startsWith('email/')) pages.add('/' + m[1]);
    for (const [re, ps] of RULES) if (re.test(f)) { ps.forEach((p) => pages.add(p)); break; }
  }
  return [...pages];
}

/** Runs in the page. Returns the findings for one viewport. */
function audit({ allowed, heading, body, minPx, minLh }) {
  const clean = (s) => s.split(',')[0].trim().replace(/^["']|["']$/g, '');
  const fonts = {}, small = [], tight = [], wrongRole = [];
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  const seen = new Set();
  const label = (e) => e.tagName.toLowerCase() + (e.className && typeof e.className === 'string' ? '.' + e.className.trim().split(/\s+/).slice(0, 2).join('.') : '');
  while (walker.nextNode()) {
    const n = walker.currentNode, t = n.textContent.trim();
    const e = n.parentElement;
    if (!t || !e || seen.has(e) || e.closest('script,style,noscript,svg,code,pre,kbd,samp')) continue;
    const cs = getComputedStyle(e);
    if (cs.visibility === 'hidden' || cs.display === 'none' || e.closest('.sr-only')) continue;
    seen.add(e);
    const fam = clean(cs.fontFamily), px = parseFloat(cs.fontSize), lh = parseFloat(cs.lineHeight) / px;
    (fonts[fam] ||= []).push(label(e));
    if (px < minPx) small.push(`${label(e)} ${px.toFixed(1)}px "${t.slice(0, 30)}"`);
    if (/^(P|LI|DD)$/.test(e.tagName) && t.length > 60 && !isNaN(lh) && lh < minLh) tight.push(`${label(e)} ${px.toFixed(0)}px lh ${lh.toFixed(2)} "${t.slice(0, 30)}"`);
    const isHeading = !!e.closest('h1,h2,h3');
    if (isHeading && fam !== heading && allowed.includes(fam)) wrongRole.push(`${label(e)} is ${fam}, headings are ${heading}`);
    if (!isHeading && fam === heading && !e.closest('.satr-wordmark,[class*="font-heading"],[class*="title"],[class*="name"],[class*="heading"],[class*="amount"],[class*="code"],[class*="photo"],[class*="number"],blockquote,figcaption,a'))
      wrongRole.push(`${label(e)} is ${heading} outside a heading`);
  }
  const foreign = Object.keys(fonts).filter((f) => !allowed.includes(f)).map((f) => `${f} ×${fonts[f].length} (${fonts[f].slice(0, 3).join(', ')})`);
  const overflow = document.documentElement.scrollWidth - document.documentElement.clientWidth;
  return { counts: Object.fromEntries(Object.entries(fonts).map(([k, v]) => [k, v.length])), foreign, small: small.slice(0, 8), tight: tight.slice(0, 5), wrongRole: wrongRole.slice(0, 6), overflow };
}

const o = args();
/** Keep one page per template folder first (expert/, story/ ...), then an even sample up to the cap. */
function sample(list, max) {
  if (list.length <= max) return list;
  const byDir = new Map();
  for (const p of list) { const parts = p.split('/'); const d = parts.length > 2 ? parts[1] : ''; if (!byDir.has(d)) byDir.set(d, p); }
  const picked = new Set(byDir.values());
  const rest = list.filter((p) => !picked.has(p));
  const step = Math.max(1, Math.floor(rest.length / Math.max(1, max - picked.size)));
  for (let i = 0; i < rest.length && picked.size < max; i += step) picked.add(rest[i]);
  console.log(`(${list.length} changed pages, checking ${picked.size}: one per template + a sample. --max to change.)`);
  return [...picked];
}
let pages = [...new Set([...(o.changed ? sample(changedPages(o.since), o.max) : []), ...o.pages])];
if (!pages.length) { console.log('No pages to check. Give paths, --preset fonts, or change something (--changed).'); process.exit(0); }
console.log(`Checking ${pages.length} page(s) on ${o.base}:\n  ${pages.join('\n  ')}\n`);
mkdirSync(o.out, { recursive: true });

const browser = await chromium.launch();
let failed = 0;
for (const path of pages) {
  for (const vp of VIEWPORTS) {
    const ctx = await browser.newContext({ viewport: vp });
    const page = await ctx.newPage();
    const problems = [];
    page.on('console', (m) => m.type() === 'error' && !/google|gtag|analytics|ERR_FAILED|ERR_BLOCKED/i.test(m.text()) && problems.push('console: ' + m.text().slice(0, 140)));
    page.on('request', (r) => /^https:\/\/(www\.)?scienceatrisk\.org\/.+\.(css|js)(\?|$)/.test(r.url()) && problems.push('loads the live site\'s own file instead of the local one: ' + r.url().slice(0, 90)));
    page.on('requestfailed', (r) => r.url().startsWith(o.base) && problems.push('request failed: ' + r.url().slice(0, 100)));
    page.on('response', (r) => r.url().startsWith(o.base) && r.status() >= 400 && problems.push(`HTTP ${r.status()}: ${r.url().slice(0, 100)}`));
    try {
      const res = await page.goto(o.base + path, { waitUntil: 'networkidle', timeout: 30000 });
      if (!res || res.status() >= 400) problems.push(`page answered ${res?.status()}`);
      await page.evaluate(() => document.fonts.ready);
      await page.waitForTimeout(300);
      const r = await page.evaluate(audit, { allowed: ALLOWED_FONTS, heading: HEADING_FONT, body: BODY_FONT, minPx: MIN_PX, minLh: MIN_LH });
      r.foreign.forEach((x) => problems.push('font outside the two: ' + x));
      r.wrongRole.forEach((x) => problems.push('role: ' + x));
      r.small.forEach((x) => problems.push(`under ${MIN_PX}px: ` + x));
      r.tight.forEach((x) => problems.push('tight line-height: ' + x));
      if (r.overflow > 0) problems.push(`horizontal scroll: ${r.overflow}px`);
      if (o.shots) {
        const name = (path === '/' ? 'home' : path.replace(/^\//, '').replace(/\.html$/, '').replace(/[\/]/g, '_')).slice(0, 80);
        await page.screenshot({ path: `${o.out}/${name}-${vp.width}.png`, fullPage: o.full });
      }
      const mark = problems.length ? 'FAIL' : 'ok  ';
      console.log(`${mark} ${path} @${vp.width}  ${Object.entries(r.counts).map(([k, v]) => `${k} ${v}`).join(' | ')}`);
    } catch (e) { problems.push('error: ' + e.message.split('\n')[0]); console.log(`FAIL ${path} @${vp.width}`); }
    [...new Set(problems)].forEach((p) => console.log('       - ' + p));
    if (problems.length) failed++;
    await ctx.close();
  }
}
await browser.close();
console.log(`\n${failed ? failed + ' check(s) failed' : 'all checks passed'}. Screenshots: ${o.out}/`);
process.exit(failed ? 1 : 0);
