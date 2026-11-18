/**
 * Writes the live components into public/handoff/states.html.
 *
 * The block between `<!-- satr-handoff:components -->` and `<!-- /satr-handoff:components -->` is rendered from
 * src/components (Button, Link, Tag, TextField, ScopeTabs, SquircleLink) with react-dom/server, exactly as the site
 * renders them. Do not edit that block by hand: change the component or `public/css/satr-components.css` and run
 *
 *   npm run handoff             # rewrite states.html
 *   npm run handoff -- --check  # list what is out of date, change nothing (exit 1)
 *
 * Utility classes the components use come from public/css/satr-chrome.css (node scripts/build-chrome-css.mjs keeps it
 * in step); the shapes are drawn by public/js/satr-shape.js from the data-squircle attributes the components carry.
 */
import { createServer } from 'vite';
import { createElement as h } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const target = path.join(root, 'public/handoff/states.html');
const check = process.argv.includes('--check');
const START = '<!-- satr-handoff:components -->';
const END = '<!-- /satr-handoff:components -->';

const vite = await createServer({ root, appType: 'custom', server: { middlewareMode: true }, logLevel: 'error' });

try {
  const load = (p) => vite.ssrLoadModule(p);
  const [{ Button }, { Link }, { Tag }, { TextField }, { ScopeTabs }, { SquircleLink }, { SiteHeader }, { Footer }] = await Promise.all([
    load('/src/components/Button/index.ts'),
    load('/src/components/Link/index.ts'),
    load('/src/components/Tag/index.ts'),
    load('/src/components/TextField/index.ts'),
    load('/src/components/ScopeTabs/index.ts'),
    load('/src/components/SquircleLink/index.ts'),
    load('/src/components/SiteHeader/index.ts'),
    load('/src/components/Footer/index.ts'),
  ]);

  const md = (el) => renderToStaticMarkup(el).replace(/<link rel="preload"[^>]*>/g, '');
  const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
  /** One specimen: the rendered component, its caption and the exact markup a template has to produce. */
  const item = (caption, el, { ground = '', dark = false } = {}) => {
    const html = md(el);
    return `<figure class="spec__item"><div class="spec__stage satr-chrome${dark ? ' satr-spec-dark' : ''}"${
      ground ? ` style="background:${ground}"` : ''
    }>${html}</div><figcaption class="spec__label">${caption}</figcaption><details class="spec__code"><summary>Markup</summary><pre><code>${esc(
      html,
    )}</code></pre></details></figure>`;
  };
  const group = (id, title, note, items) =>
    `<section class="spec" aria-labelledby="${id}"><h2 class="h2" id="${id}">${title}</h2><p class="spec__note">${note}</p><div class="spec__grid">${items.join('')}</div></section>`;

  const noop = () => {};
  const sections = [
    group(
      'g-buttons',
      'Buttons (live component)',
      'Rendered from <code>src/components/Button</code>. The shape is <code>data-squircle</code> + <code>js/satr-shape.js</code>; hover and focus are real (move the pointer, press Tab).',
      [
        item('Black', h(Button, { variant: 'black' }, 'More details')),
        item('White (on a tinted ground)', h(Button, { variant: 'white' }, 'More details'), { ground: '#b5c6cd' }),
        item('Bordered (the ring fills on hover)', h(Button, { variant: 'bordered' }, 'More details')),
        item('Danger (bordered)', h(Button, { variant: 'bordered', className: 'satr-squircle--danger' }, 'Delete')),
        item('Black, disabled', h(Button, { variant: 'black', disabled: true }, 'Send')),
        item('Bordered, disabled', h(Button, { variant: 'bordered', disabled: true }, 'Send')),
        item('Header “Log in” (SquircleLink)', h(SquircleLink, { href: '#' }, 'Log in')),
        item('Header “Log in”, inverted (on black)', h(SquircleLink, { href: '#', inverted: true }, 'Log in'), {
          ground: '#000',
        }),
      ],
    ),
    group('g-links', 'Text links (live component)', 'Rendered from <code>src/components/Link</code>.', [
      item('Default', h(Link, { href: '#' }, 'All projects')),
      item('Uppercase', h(Link, { href: '#', uppercase: true }, 'All projects')),
      item('As a button', h(Link, { as: 'button' }, 'Show all studies')),
      item('Disabled', h(Link, { as: 'button', disabled: true }, 'Show all studies')),
    ]),
    group(
      'g-tags',
      'Chips and tags (live component)',
      'Rendered from <code>src/components/Tag</code>. A chip is a button (filter) or a link; the label form is for editorial rubrics.',
      [
        item('Chip (button)', h(Tag, { onClick: noop }, 'Biology')),
        item('Chip with count', h(Tag, { count: 12, onClick: noop }, 'Chemistry')),
        item('Chip with dot', h(Tag, { circle: true, onClick: noop }, 'Selected')),
        item('Chip, off', h(Tag, { className: 'satr-tag--off', onClick: noop }, 'Physics')),
        item('Accent link (“New”)', h(Tag, { as: 'a', href: '#', variant: 'accent' }, 'New')),
        item('Span', h(Tag, { as: 'span' }, 'Materials science')),
        item('Label (rubric)', h(Tag, { appearance: 'label' }, 'Stories')),
      ],
    ),
    group(
      'g-fields',
      'Fields (live component)',
      'Rendered from <code>src/components/TextField</code>: floating label. The label rides up on focus or when the field has text. A field has no focus ring of its own: the label and the caret show where you are. With <code>error</code> the underline stays as it is and the message stands under the field on the attention yellow; the field is marked <code>aria-invalid</code>.',
      [
        item('Empty', h(TextField, { label: 'Your name' })),
        item('Filled', h(TextField, { label: 'Your name', defaultValue: 'Olena Kozak' })),
        item('Disabled', h(TextField, { label: 'E-mail', defaultValue: 'olena@example.org', disabled: true })),
        item('Multiline', h(TextField, { label: 'Message', multiline: true })),
        item('Error: empty required field', h(TextField, { label: 'Your name *', error: 'Enter your name.' })),
        item('Error: wrong format', h(TextField, { label: 'E-mail', type: 'email', defaultValue: 'olena@', error: 'Enter an address like name@example.org.' })),
        item('On black', h(TextField, { label: 'Your name', tone: 'dark' }), { ground: '#000', dark: true }),
        item('Error, on black', h(TextField, { label: 'Your name *', tone: 'dark', error: 'Enter your name.' }), { ground: '#000', dark: true }),
      ],
    ),
    group(
      's-nav',
      'Navigation (live component)',
      'Rendered from <code>src/components/SiteHeader</code>, the header of every page: wordmark, EN/UK switch, Log in, menu button. The menu opens full screen (press the button; Esc closes it). The language switch links to the same page in the other language (<code>hreflang</code>); the current language is <code>aria-current=true</code>.',
      [
        item('Header, English, guest', h('div', { 'data-satr-chrome': 'header' }, h(SiteHeader, { base: '../', progress: 1, menuId: 'hf-menu-en', locale: 'EN', localeHref: '#uk', loginHref: '#login', cabinetHref: '#cabinet', logoutHref: '#logout' }))),
        item('Header, Ukrainian, guest', h('div', { 'data-satr-chrome': 'header' }, h(SiteHeader, { base: '../', progress: 1, menuId: 'hf-menu-ua', locale: 'UA', localeHref: '#en', loginHref: '#login', cabinetHref: '#cabinet', logoutHref: '#logout' }))),
      ],
    ),
    group(
      's-footer',
      'Footer (live component)',
      'Rendered from <code>src/components/Footer</code>, the footer of every page: the ask, the form (with its count and over-limit message), the supporters and the implementer, then the base line with the copyright and the OpenTech wordmark. Ukrainian below.',
      [item('Footer, English', h(Footer, { logoSrc: '../images/opentech-logo-white.svg' })), item('Footer, Ukrainian', h(Footer, { locale: 'uk', logoSrc: '../images/opentech-logo-white.svg' }))],
    ),
    group('g-tabs', 'Scope switch (live component)', 'Rendered from <code>src/components/ScopeTabs</code>, links form.', [
      item(
        'Scientists open',
        h(ScopeTabs, {
          label: 'Search in',
          value: 'scientists',
          tabs: [
            { value: 'scientists', label: 'Scientists', href: '#scientists' },
            { value: 'societies', label: 'Societies', href: '#societies' },
          ],
        }),
      ),
    ]),
  ].join('');

  const block = `${START}\n${sections}\n${END}`;
  const html = await readFile(target, 'utf8');
  const re = new RegExp(`${START}[\\s\\S]*?${END}`);
  if (!re.test(html)) throw new Error('markers not found in states.html');
  const next = html.replace(re, () => block);
  if (next === html) console.log('states.html is up to date.');
  else if (check) {
    console.log('states.html is out of date: run npm run handoff');
    process.exitCode = 1;
  } else {
    await writeFile(target, next);
    console.log('states.html rewritten.');
  }
  const { buildStatic } = await import('./build-handoff-static.mjs');
  if (!(await buildStatic({ check }))) process.exitCode = 1;
} finally {
  await vite.close();
}
