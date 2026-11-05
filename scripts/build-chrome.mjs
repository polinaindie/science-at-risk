/**
 * Writes the site's one header and one footer into every static page.
 *
 * `src/components/SiteHeader` and `src/components/Footer` are the only place
 * either is defined. The copied pages under `public/` carry their rendered
 * markup between `satr-chrome:header` / `satr-chrome:footer` markers; this
 * script renders the two components and replaces what is between the markers,
 * so a change to a component reaches every page with one command:
 *
 *   npm run chrome          # rewrite the pages
 *   npm run chrome -- --check   # list pages that are out of date, change nothing
 *
 * Per page it keeps only what belongs to the page: the link prefix (`../` per
 * level of depth), the language and the ink of each bar (uk.html carries two
 * and shows one), and the footer wrapper's own classes.
 */
import { createServer } from 'vite';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const publicDir = path.join(root, 'public');
const check = process.argv.includes('--check');

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(full);
    else if (entry.name.endsWith('.html')) yield full;
  }
}

const vite = await createServer({
  root,
  appType: 'custom',
  server: { middlewareMode: true },
  logLevel: 'error',
});

try {
  const [headerMod, footerMod] = await Promise.all([
    vite.ssrLoadModule('/src/components/SiteHeader/index.ts'),
    vite.ssrLoadModule('/src/components/Footer/index.ts'),
  ]);

  const renderFooter = (ua, base) =>
    renderToStaticMarkup(
      createElement(
        footerMod.Footer,
        ua
          ? {
              loginLabel: 'Увійти',
              cabinetLabel: 'Мій кабінет',
              logoutLabel: 'Вийти',
              loginHref: `${base}uk/login.html`,
              cabinetHref: `${base}cabinet`,
              logoutHref: `${base}logout`,
            }
          : { loginHref: `${base}login.html`, cabinetHref: `${base}cabinet`, logoutHref: `${base}logout` },
      ),
    ).replace(/<link rel="preload"[^>]*>/g, '');

  // <div ...data-satr-chrome="header"...> ... <header>…</header> ... </div>
  const headerRe =
    /(<div[^>]*data-satr-chrome="header"([^>]*)>)(?:<link rel="preload"[^>]*>)*<header[\s\S]*?<\/header>/g;
  const footerRe = /(<div[^>]*data-satr-chrome="footer"[^>]*>)(?:<link rel="preload"[^>]*>)*<footer[\s\S]*?<\/footer>/g;

  let changed = 0;
  let total = 0;
  for await (const file of walk(publicDir)) {
    const html = await readFile(file, 'utf8');
    if (!html.includes('satr-chrome:header')) continue;
    total += 1;

    const depth = path.relative(publicDir, path.dirname(file)).split(path.sep).filter(Boolean).length;
    const base = '../'.repeat(depth);

    const headRe = /<!-- satr-chrome:head -->[\s\S]*?<!-- \/satr-chrome:head -->/;
    const head = `<!-- satr-chrome:head --><link rel="stylesheet" href="${base}css/satr-chrome.css"><link rel="stylesheet" href="${base}css/satr-squircle.css"><script src="${base}js/satr-chrome.js" defer></script><script src="${base}js/satr-squircle.js" defer></script><!-- /satr-chrome:head -->`;

    const next = html
      .replace(headRe, () => head)
      .replace(headerRe, (_m, open, rest) => {
        const light = /data-satr-ink="light"/.test(rest); // light ink: a bar on a dark block
        const ua = /<html[^>]*lang="uk"/.test(html);
        const alt = (rest.match(/data-satr-alt="([^"]+)"/) || [])[1]; // this page's twin in the other language
        const menuId = `satr-menu-${ua ? 'ua' : 'en'}-${light ? 'light' : 'dark'}`;
        const bar = renderToStaticMarkup(
          createElement(headerMod.SiteHeader, {
            base,
            progress: 1, // the static pages have no hero: the wordmark is always in the bar
            menuId,
            inverted: light,
            locale: ua ? 'UA' : 'EN',
            localeHref: alt ? `${base}${alt}` : ua ? base || './' : `${base}uk.html`,
            loginHref: ua ? `${base}uk/login.html` : `${base}login.html`,
            cabinetHref: `${base}cabinet`,
            logoutHref: `${base}logout`,
          }),
        );
        return open + bar.replace(/<link rel="preload"[^>]*>/g, '');
      })
      .replace(footerRe, (_m, open) => open + renderFooter(/<html[^>]*lang="uk"/.test(html), base));

    if (next !== html) {
      changed += 1;
      if (!check) await writeFile(file, next);
      else console.log(path.relative(publicDir, file));
    }
  }
  console.log(`${changed} of ${total} pages ${check ? 'out of date' : 'rewritten'}.`);
  if (check && changed) process.exitCode = 1;
} finally {
  await vite.close();
}
