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
import { chromium } from 'playwright';
import http from 'node:http';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const pub = path.join(root, 'public');
const PAGES = {
  'static-components': { title: 'Components of the static pages', other: ['static-connect', 'The Connect form (its own page: the expert page’s CSS restyles tags)'] },
  'static-connect': { title: 'The Connect form', other: ['static-components', 'Cards, breadcrumbs, search, pagination'] },
};

/** Paths in a page of public/ → paths from public/handoff/. */
const rebase = (frag, dir) =>
  frag.replace(/\b(src|href|srcset)="([^"]*)"/g, (m, attr, v) =>
    /^(https?:|\/|#|mailto:|tel:|data:|javascript:)/.test(v) || v === '' ? m : `${attr}="${path.posix.join('..', dir, v)}"`,
  );
// Runtime leftovers of the squircle script: it draws the shapes again when the page loads.
const strip = (s) =>
  s
    .replace(/\s+data-squircle-ready="[^"]*"/g, '')
    .replace(/\s+data-satr-sq(?:="[^"]*")?/g, '')
    .replace(/ style="clip-path:[^"]*"/g, '')
    .replace(/ style="clip-path:[^"]*"/g, '');
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
      { cap: 'Story (stories.html)', file: 'stories.html', cls: 'story-card', wrap: ['div class="page pageStories"', 'article class="pageStories__wrapper"', 'div class="wrapper"', 'div class="row"', 'div class="col-lg-4 col-md-6 col-12"'] },
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
    page: 'static-connect',
    id: 'c-forms',
    title: 'Form: Connect with a scientist',
    note: 'The Connect panel of an expert page as it looks when opened (it is a modal on the live page; here it sits in the flow). The reCAPTCHA slot is empty: Google draws it. The footer form (Want to help?) is in the Footer specimen on states.html.',
    items: [
      { cap: 'Connect (expert page), opened', file: 'expert/komarov-ihor-volodymyrovych.html', cls: 'expertHelp', wrap: [], show: true, open: '[data-popup-open="helpExpert"]' },
    ],
  },
];

const wrapIn = (wrap, inner) =>
  wrap.reduceRight((acc, w) => `<${w}>${acc}</${w.split(' ')[0]}>`, inner);

export async function buildStatic({ check = false } = {}) {
  // The pages' scripts build parts of the cards (the research list adds the date, "New", the authors line and the size),
  // so the markup is taken from the page as it renders, not from the file.
  // A throw-away static server over public/: the pages' scripts need a real origin (file:// blocks their fetches).
  const types = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json', '.svg': 'image/svg+xml', '.jpg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp' };
  const server = http.createServer(async (req, res) => {
    try {
      const rel = decodeURIComponent(new URL(req.url, 'http://x').pathname);
      const file = path.join(pub, rel.endsWith('/') ? rel + 'index.html' : rel);
      if (!file.startsWith(pub)) throw new Error('outside');
      res.setHeader('content-type', types[path.extname(file)] ?? 'application/octet-stream');
      res.end(await readFile(file));
    } catch {
      res.statusCode = 404;
      res.end();
    }
  });
  await new Promise((r) => server.listen(0, '127.0.0.1', r));
  const origin = `http://127.0.0.1:${server.address().port}/`;
  const browser = await chromium.launch();
  const tabs = new Map();
  const rendered = async (f, cls, open) => {
    let pg = tabs.get(f);
    if (!pg) {
      pg = await browser.newPage({ viewport: { width: 1280, height: 900 } });
      await pg.goto(origin + f, { waitUntil: 'load' }).catch(() => {});
      await pg.waitForTimeout(2000);
      tabs.set(f, pg);
    }
    if (open) {
      await pg.evaluate((o) => document.querySelector(o)?.click(), open);
      await pg.waitForTimeout(1200);
    }
    // reCAPTCHA draws its own box and, off the registered domain, an error in it: leave the slot empty.
    await pg.evaluate(() => document.querySelectorAll('.g-recaptcha').forEach((e) => (e.innerHTML = '')));
    const html = await pg.evaluate((c) => document.querySelector('.' + c)?.outerHTML ?? null, cls);
    if (!html) throw new Error(`${f}: .${cls} not found`);
    return html;
  };
  const cache = new Map();
  const page = async (f) => cache.get(f) ?? (cache.set(f, await readFile(path.join(pub, f), 'utf8')), cache.get(f));

  let ok = true;
  for (const [name, meta] of Object.entries(PAGES)) {
    const specs = SPECS.filter((x) => (x.page ?? 'static-components') === name);
    const target = path.join(pub, `handoff/${name}.html`);
    // The stylesheets the source pages load, in the order they load them.
    const sheets = [];
    const files = [...new Set(specs.flatMap((s) => s.items.map((i) => i.file)))];
    for (const f of files) {
      for (const m of (await page(f)).matchAll(/<link[^>]*href="((?:\.\.\/)*css\/[^"]+\.css)"[^>]*>/g)) {
        const css = m[1].replace(/^(\.\.\/)+/, '');
        if (!sheets.includes(css)) sheets.push(css);
      }
    }
    // Page CSS first, then the shared layers: satr-text.css is always last, as on the pages.
    const tail = (c) => /satr-|tokens|type-scale/.test(c);
    const ordered = [...sheets.filter((c) => !tail(c)), ...sheets.filter(tail)];
    const links = ordered.map((s) => `<link rel="stylesheet" href="../${s}">`).join('\n');

    const sections = [];
    for (const s of specs) {
      const figs = [];
      for (const i of s.items) {
        const dir = path.posix.dirname(i.file) === '.' ? '' : path.posix.dirname(i.file);
        const raw = strip(await rendered(i.file, i.cls, i.open));
        const frag = rebase(raw, dir);
        // The pages put `isDefault` and a page class on <body>; much of style.min.css hangs off them (`.isDefault .btn--black`…).
        const bodyCls = /<body[^>]*?class="([^"]*)"/s.exec(await page(i.file))?.[1].replace(/\s+/g, ' ').trim() ?? 'isDefault';
        const markup = `<div class="${bodyCls}">${wrapIn(i.wrap, frag)}</div>`;
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
  <title>${meta.title}</title>
  <!-- Generated by scripts/build-handoff-static.mjs from the pages in public/. Do not edit by hand. -->
  <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@300;400;500;700&family=Noto+Serif:wght@400;700&display=swap" rel="stylesheet">
  ${links}
  <link rel="stylesheet" href="crumbs.css">
  <style>
  /* Scaffold only: namespaced .hf-*, so nothing here can touch the components' own CSS. */
  .hf-doc { max-width: none; margin: 0; padding: 24px 0 96px; font-family: var(--font-ui, "IBM Plex Mono", monospace); color: #000; background: #fff; }
  .hf-title { font-family: var(--font-heading, "Noto Serif", serif); font-weight: 400; font-size: clamp(32px, 5vw, 56px); line-height: 1.1; margin: 0 0 16px; }
  .hf-lede, .hf-note { font-size: 16px; line-height: 24px; max-width: 70ch; margin: 0 0 16px; }
  .hf-toc { display: flex; flex-wrap: wrap; gap: 8px 24px; list-style: none; margin: 24px 0 0; padding: 0; font-size: 16px; }
  .hf-spec { margin-top: 64px; padding-top: 16px; border-top: 2px solid #000; }
  .hf-h2 { font-family: var(--font-heading, "Noto Serif", serif); font-weight: 400; font-size: 28px; line-height: 34px; margin: 0 0 8px; }
  .hf-grid { display: grid; gap: 32px; grid-template-columns: minmax(0, 1fr); margin-top: 24px; }
  .hf-label { font-size: 14px; line-height: 20px; color: #4d4d4d; margin-top: 8px; }
  .hf-item { margin: 0; min-width: 0; }
  .hf-doc > *, .hf-spec > * { padding-inline: 40px; }
  .hf-doc > .hf-spec { padding-inline: 0; }
  .hf-grid, .hf-item { padding-inline: 0 !important; }
  .hf-label, .hf-code { padding-inline: 40px; }
  /* The stage is as wide as the page: the live container is 1200px inside a 1280px window, exactly as here. */
  .hf-stage { border: solid rgba(0,0,0,.25); border-width: 1px 0; overflow: hidden; padding: 0; }
  .hf-stage--show .nothing, .hf-stage--show .loader { display: block; }
  /* The Connect panel is a modal on the live page (fixed, hidden until opened): here it is open and in the flow. */
  .hf-stage--show .expertHelp { position: relative; inset: auto; visibility: visible; opacity: 1; height: auto; min-height: 560px; }
  .hf-stage--show .expertHelp .help-form { visibility: visible; }
  .hf-code summary { cursor: pointer; font-size: 14px; padding: 8px 0; }
  .hf-code pre { margin: 0; padding: 12px; overflow: auto; max-height: 320px; background: #f4f4f4; font-size: 12px; line-height: 18px; }
  </style>
  </head>
  <body class="isDefault">
  <main class="hf-doc">
  <nav class="hf-crumbs" aria-label="Breadcrumb"><ol><li><a href="../">Science at Risk</a></li><li><a href="index.html">Hand-off</a></li><li aria-current="page">${meta.title}</li></ol></nav>
  <h1 class="hf-title">${meta.title}</h1>
  <p class="hf-lede">Cut out of the live pages, with their own CSS: this is the markup the Hugo templates have to produce. Header, footer, buttons, links, tags and fields (React-rendered, the same markup the static pages carry) are on <a href="states.html">states.html</a>. Also: <a href="${meta.other[0]}.html">${meta.other[1]}</a>.</p>
  <ul class="hf-toc">${specs.map((s) => `<li><a href="#${s.id}">${s.title}</a></li>`).join('')}</ul>
  ${sections.join('\n')}
  </main>
  <script src="../js/client.bundle.js"></script>
  <script src="../js/jquery.min.js"></script>
  <script src="../js/common.js"></script>
  <script src="../js/satr-squircle.js" defer></script>
  <script>
  /* Exactly what the static pages do: the squircle paint worklet draws the black buttons and the bordered chips. */
  (async function () {
    if (!("paintWorklet" in CSS)) await import("https://unpkg.com/css-paint-polyfill");
    CSS.paintWorklet.addModule("https://www.unpkg.com/css-houdini-squircle@0.1.3/squircle.min.js");
  })();
  </script>
  </body>
  </html>
  `;

    const prev = await readFile(target, 'utf8').catch(() => '');
    if (prev === html) console.log(`${name}.html is up to date.`);
    else if (check) {
      console.log(`${name}.html is out of date: run npm run handoff`);
      ok = false;
    } else {
      await writeFile(target, html);
      console.log(`${name}.html rewritten.`);
    }
  }
  await browser.close();
  server.close();
  return ok;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const ok = await buildStatic({ check: process.argv.includes('--check') });
  if (!ok) process.exitCode = 1;
}
