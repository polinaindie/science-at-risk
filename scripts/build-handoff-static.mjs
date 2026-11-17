/**
 * Writes public/handoff/static-components.html: the components of the live static pages, exactly as they are.
 *
 * Each specimen is cut out of a real page in public/ (the first element with the given class, with its ancestors'
 * classes kept so the page's own CSS applies) and the page loads the same stylesheets the static pages do. Nothing
 * here is drawn by hand: change the page or its CSS, run `npm run handoff`, and this page follows.
 *
 *   node scripts/build-handoff-static.mjs [--check]
 */
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const pub = path.join(root, 'public');
const target = path.join(pub, 'handoff/static-components.html');

/** The first element whose class list has `cls`, balanced on its own tag name. */
function extract(html, cls) {
  const open = new RegExp(`<([a-z0-9]+)\\b[^>]*\\bclass="(?:[^"]*\\s)?${cls}(?:\\s[^"]*)?"[^>]*>`, 'i').exec(html);
  if (!open) throw new Error(`.${cls} not found`);
  const tag = open[1].toLowerCase();
  const re = new RegExp(`<(/?)${tag}\\b[^>]*>`, 'gi');
  re.lastIndex = open.index + open[0].length;
  let depth = 1;
  for (let m; (m = re.exec(html)); ) {
    depth += m[1] ? -1 : /\/>$/.test(m[0]) ? 0 : 1;
    if (!depth) return html.slice(open.index, m.index + m[0].length);
  }
  throw new Error(`.${cls} is not closed`);
}

/** Paths in a page of public/ → paths from public/handoff/. */
const rebase = (frag, dir) =>
  frag.replace(/\b(src|href|srcset)="([^"]*)"/g, (m, attr, v) =>
    /^(https?:|\/|#|mailto:|tel:|data:|javascript:)/.test(v) || v === '' ? m : `${attr}="${path.posix.join('..', dir, v)}"`,
  );
const strip = (s) => s.replace(/\s+data-squircle-ready="[^"]*"/g, '').replace(/ style="clip-path:[^"]*"/g, '');
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');

const SPECS = [
  {
    id: 'c-crumbs',
    title: 'Breadcrumbs',
    note: 'Every page but Home. The last item is the current page, not a link. A long last item is cut with an ellipsis.',
    items: [
      { cap: 'Breadcrumbs (scientists.html)', file: 'scientists.html', cls: 'breadcrumbs', wrap: ['div class="wrapper"'] },
    ],
  },
  {
    id: 'c-cards',
    title: 'Cards',
    note: 'One card per type. Each is one stretched link; hover and focus are the real pseudo-classes (move the pointer, press Tab).',
    items: [
      { cap: 'Scientist (scientists.html)', file: 'scientists.html', cls: 'experts__item', wrap: ['div class="page"', 'section class="experts"', 'div class="wrapper"', 'ul class="experts__list"'] },
      { cap: 'Research paper (research.html)', file: 'research.html', cls: 'paper-card', wrap: ['div class="page papers"', 'section class="papers-hero__wrapper"', 'div class="wrapper"', 'div class="papers-hero__list"'] },
      { cap: 'Story (stories.html)', file: 'stories.html', cls: 'story-card', wrap: ['div class="page pageStories"', 'article class="pageStories__wrapper"', 'div class="wrapper"', 'div class="row"', 'div class="col-12"'] },
      { cap: 'Infrastructure (infrastructures.html)', file: 'infrastructures.html', cls: 'infrastructures-card', wrap: ['div class="page infrastructures"', 'section class="infrastructures__wrapper"', 'div class="wrapper"', 'div class="infrastructures__list"'] },
      { cap: 'Society (societies.html)', file: 'societies.html', cls: 'infrastructures-card', wrap: ['div class="page infrastructures"', 'section class="infrastructures__wrapper"', 'div class="wrapper"', 'div class="infrastructures__list"'] },
    ],
  },
  {
    id: 'c-search',
    title: 'Search, tag filters, results, pagination',
    note: 'The Scientists list: search block with the popular tags, the empty state, the loader and the pagination. Counts and the loader are shown by script on the live pages; here they are always visible.',
    items: [
      { cap: 'Search block (scientists.html)', file: 'scientists.html', cls: 'search-hero', wrap: ['div class="page"'] },
      { cap: 'Pagination (scientists.html)', file: 'scientists.html', cls: 'pagination', wrap: ['div class="page"', 'section class="experts"', 'div class="wrapper"'] },
      { cap: 'Nothing found (scientists.html)', file: 'scientists.html', cls: 'nothing', wrap: ['div class="page"', 'section class="experts"', 'div class="wrapper"'], show: true },
      { cap: 'Loader (scientists.html)', file: 'scientists.html', cls: 'loader', wrap: ['div class="page"', 'section class="experts"', 'div class="wrapper"'], show: true },
    ],
  },
  {
    id: 'c-forms',
    title: 'Form: Connect with a scientist',
    note: 'The Connect panel on an expert page, with the reCAPTCHA slot. The footer form (Want to help?) is in the Footer specimen on states.html.',
    items: [
      { cap: 'Connect (expert page)', file: 'expert/komarov-ihor-volodymyrovych.html', cls: 'help-form', wrap: ['div class="expertHelp"'], show: true },
    ],
  },
];

const wrapIn = (wrap, inner) =>
  wrap.reduceRight((acc, w) => `<${w}>${acc}</${w.split(' ')[0]}>`, inner);

export async function buildStatic({ check = false } = {}) {
  const cache = new Map();
  const page = async (f) => cache.get(f) ?? (cache.set(f, await readFile(path.join(pub, f), 'utf8')), cache.get(f));

  // The stylesheets the source pages load, in the order they load them.
  const sheets = [];
  const files = [...new Set(SPECS.flatMap((s) => s.items.map((i) => i.file)))];
  for (const f of files) {
    for (const m of (await page(f)).matchAll(/<link[^>]*href="(css\/[^"]+\.css)"[^>]*>/g)) if (!sheets.includes(m[1])) sheets.push(m[1]);
  }
  const links = sheets.map((s) => `<link rel="stylesheet" href="../${s}">`).join('\n');

  const sections = [];
  for (const s of SPECS) {
    const figs = [];
    for (const i of s.items) {
      const dir = path.posix.dirname(i.file) === '.' ? '' : path.posix.dirname(i.file);
      const raw = strip(extract(await page(i.file), i.cls));
      const frag = rebase(raw, dir);
      const markup = wrapIn(i.wrap, frag);
      figs.push(
        `<figure class="hf-item"><div class="hf-stage${i.show ? ' hf-stage--show' : ''}">${markup}</div><figcaption class="hf-label">${i.cap}</figcaption><details class="hf-code"><summary>Markup</summary><pre><code>${esc(raw)}</code></pre></details></figure>`,
      );
    }
    sections.push(`<section class="hf-spec" aria-labelledby="${s.id}"><h2 class="hf-h2" id="${s.id}">${s.title}</h2><p class="hf-note">${s.note}</p><div class="hf-grid">${figs.join('')}</div></section>`);
  }

  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Components of the static pages</title>
<!-- Generated by scripts/build-handoff-static.mjs from the pages in public/. Do not edit by hand. -->
<link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@300;400;500;700&family=Noto+Serif:wght@400;700&display=swap" rel="stylesheet">
${links}
<link rel="stylesheet" href="crumbs.css">
<style>
/* Scaffold only: namespaced .hf-*, so nothing here can touch the components' own CSS. */
.hf-doc { max-width: 1240px; margin: 0 auto; padding: 24px 40px 96px; font-family: var(--font-ui, "IBM Plex Mono", monospace); color: #000; background: #fff; }
.hf-title { font-family: var(--font-heading, "Noto Serif", serif); font-weight: 400; font-size: clamp(32px, 5vw, 56px); line-height: 1.1; margin: 0 0 16px; }
.hf-lede, .hf-note { font-size: 16px; line-height: 24px; max-width: 70ch; margin: 0 0 16px; }
.hf-toc { display: flex; flex-wrap: wrap; gap: 8px 24px; list-style: none; margin: 24px 0 0; padding: 0; font-size: 16px; }
.hf-spec { margin-top: 64px; padding-top: 16px; border-top: 2px solid #000; }
.hf-h2 { font-family: var(--font-heading, "Noto Serif", serif); font-weight: 400; font-size: 28px; line-height: 34px; margin: 0 0 8px; }
.hf-grid { display: grid; gap: 32px; grid-template-columns: minmax(0, 1fr); margin-top: 24px; }
.hf-label { font-size: 14px; line-height: 20px; color: #4d4d4d; margin-top: 8px; }
.hf-item { margin: 0; min-width: 0; }
.hf-stage { border: 1px solid rgba(0,0,0,.25); overflow: hidden; }
.hf-stage--show .nothing, .hf-stage--show .loader { display: block; }
/* The Connect panel is a modal on the live page (fixed, hidden until opened): here it is open and in the flow. */
.hf-stage--show .expertHelp { position: relative; inset: auto; visibility: visible; opacity: 1; height: auto; min-height: 560px; }
.hf-stage--show .expertHelp .help-form { visibility: visible; }
.hf-code summary { cursor: pointer; font-size: 14px; padding: 8px 0; }
.hf-code pre { margin: 0; padding: 12px; overflow: auto; max-height: 320px; background: #f4f4f4; font-size: 12px; line-height: 18px; }
</style>
</head>
<body>
<main class="hf-doc">
<nav class="hf-crumbs" aria-label="Breadcrumb"><ol><li><a href="../">Science at Risk</a></li><li><a href="index.html">Hand-off</a></li><li aria-current="page">Components of the static pages</li></ol></nav>
<h1 class="hf-title">Components of the static pages</h1>
<p class="hf-lede">Cut out of the live pages, with their own CSS: this is the markup the Hugo templates have to produce. Header, footer, buttons, links, tags and fields (React-rendered, the same markup the static pages carry) are on <a href="states.html">states.html</a>.</p>
<ul class="hf-toc">${SPECS.map((s) => `<li><a href="#${s.id}">${s.title}</a></li>`).join('')}</ul>
${sections.join('\n')}
</main>
<script src="../js/satr-squircle.js" defer></script>
</body>
</html>
`;
  const prev = await readFile(target, 'utf8').catch(() => '');
  if (prev === html) {
    console.log('static-components.html is up to date.');
    return true;
  }
  if (check) {
    console.log('static-components.html is out of date: run npm run handoff');
    return false;
  }
  await writeFile(target, html);
  console.log('static-components.html rewritten.');
  return true;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const ok = await buildStatic({ check: process.argv.includes('--check') });
  if (!ok) process.exitCode = 1;
}
