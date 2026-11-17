/**
 * Checks that every Hugo partial in public/handoff/hugo/layouts/partials produces the same markup as the React
 * component it mirrors. Hugo itself is not needed: the partials only use a small subset of the template language
 * (`{{ .x }}`, `{{ $v := "…" }}`, `{{ if }}`/`{{ else if }}`/`{{ else }}`, `eq`, `range`, `$.x`, comments), which is
 * interpreted here. Attribute order and the empty-attribute spelling (`disabled` vs `disabled=""`) are ignored.
 *
 *   node scripts/verify-hugo-partials.mjs
 */
import { createServer } from 'vite';
import { createElement as h } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dir = path.join(root, 'public/handoff/hugo/layouts/partials');

// ---------- mini template interpreter ----------
function parse(src) {
  src = src.replace(/\{\{\/\*[\s\S]*?\*\/\}\}/g, '');
  const toks = [];
  const re = /\{\{\s*([\s\S]*?)\s*\}\}/g;
  let last = 0;
  for (let m; (m = re.exec(src)); ) {
    if (m.index > last) toks.push({ t: 'text', v: src.slice(last, m.index) });
    toks.push({ t: 'act', v: m[1] });
    last = re.lastIndex;
  }
  if (last < src.length) toks.push({ t: 'text', v: src.slice(last) });
  let i = 0;
  const block = (stops) => {
    const out = [];
    while (i < toks.length) {
      const k = toks[i];
      if (k.t === 'act' && stops.some((s) => k.v === s || k.v.startsWith(s + ' '))) return out;
      i++;
      if (k.t === 'text') out.push(k);
      else if (k.v.startsWith('if ')) {
        const branches = [{ cond: k.v.slice(3), body: block(['else', 'end']) }];
        let other = null;
        while (toks[i].v !== 'end') {
          const e = toks[i++].v;
          if (e.startsWith('else if ')) branches.push({ cond: e.slice(8), body: block(['else', 'end']) });
          else other = block(['end']);
        }
        i++;
        out.push({ t: 'if', branches, other });
      } else if (k.v.startsWith('range ')) {
        const body = block(['end']);
        i++;
        out.push({ t: 'range', path: k.v.slice(6), body });
      } else if (/^\$\w+ :=/.test(k.v)) out.push({ t: 'set', name: k.v.match(/^\$(\w+)/)[1], expr: k.v.split(':=')[1].trim() });
      else out.push({ t: 'print', expr: k.v });
    }
    return out;
  };
  return block([]);
}
const val = (expr, dot, rootCtx, vars) => {
  expr = expr.trim();
  if (/^".*"$/.test(expr)) return expr.slice(1, -1);
  if (expr === '.') return dot;
  if (expr.startsWith('$.')) return rootCtx[expr.slice(2)];
  if (expr.startsWith('$')) return vars[expr.slice(1)];
  if (expr.startsWith('.')) return dot?.[expr.slice(1)];
  throw new Error('unsupported expression: ' + expr);
};
const truthy = (cond, dot, rootCtx, vars) => {
  const m = cond.match(/^eq\s+(\S+|".*?")\s+(\S+|".*?")$/);
  if (m) return val(m[1], dot, rootCtx, vars) === val(m[2], dot, rootCtx, vars);
  const v = val(cond, dot, rootCtx, vars);
  return Array.isArray(v) ? v.length > 0 : !!v;
};
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
function run(nodes, dot, rootCtx, vars = {}) {
  let out = '';
  for (const n of nodes) {
    if (n.t === 'text') out += n.v;
    else if (n.t === 'set') vars[n.name] = val(n.expr, dot, rootCtx, vars);
    else if (n.t === 'print') out += esc(val(n.expr, dot, rootCtx, vars) ?? '');
    else if (n.t === 'if') {
      const b = n.branches.find((x) => truthy(x.cond, dot, rootCtx, vars));
      out += run(b ? b.body : n.other || [], dot, rootCtx, vars);
    } else if (n.t === 'range') for (const item of val(n.path, dot, rootCtx, vars) || []) out += run(n.body, item, rootCtx, vars);
  }
  return out;
}

// ---------- comparison ----------
const norm = (html) =>
  html
    .replace(/<link rel="preload"[^>]*>/g, '')
    .replace(/<(\w+)((?:\s[^>]*?)?)\/?>/g, (_m, tag, attrs) => {
      const list = [...attrs.matchAll(/\s([\w:-]+)(?:="([^"]*)")?/g)].map(([, k, v]) => {
        v = (v ?? '').replace(/\s+/g, ' ').trim();
        return v === '' ? k : `${k}="${v}"`;
      });
      return `<${tag}${list.sort().map((a) => ' ' + a).join('')}>`;
    })
    .replace(/>\s+</g, '><')
    .trim();

const vite = await createServer({ root, appType: 'custom', server: { middlewareMode: true }, logLevel: 'error' });
let failed = 0;
try {
  const L = (p) => vite.ssrLoadModule(p);
  const { Button } = await L('/src/components/Button/index.ts');
  const { Link } = await L('/src/components/Link/index.ts');
  const { Tag } = await L('/src/components/Tag/index.ts');
  const { TextField } = await L('/src/components/TextField/index.ts');
  const { ScopeTabs } = await L('/src/components/ScopeTabs/index.ts');
  const { SquircleLink } = await L('/src/components/SquircleLink/index.ts');
  const noop = () => {};
  const tabs = [
    { value: 'a', label: 'Scientists', href: '/a' },
    { value: 'b', label: 'Societies', href: '/b' },
  ];
  const cases = [
    ['satr-button', { label: 'X', variant: 'black' }, h(Button, { variant: 'black' }, 'X')],
    ['satr-button', { label: 'X', variant: 'white' }, h(Button, { variant: 'white' }, 'X')],
    ['satr-button', { label: 'X', variant: 'bordered', danger: true }, h(Button, { variant: 'bordered', className: 'satr-squircle--danger' }, 'X')],
    ['satr-button', { label: 'X', variant: 'black', disabled: true }, h(Button, { variant: 'black', disabled: true }, 'X')],
    ['satr-link', { label: 'T', href: '/a' }, h(Link, { href: '/a' }, 'T')],
    ['satr-link', { label: 'T', href: '/a', uppercase: true }, h(Link, { href: '/a', uppercase: true }, 'T')],
    ['satr-link', { label: 'T', button: true, disabled: true }, h(Link, { as: 'button', disabled: true }, 'T')],
    ['satr-tag', { label: 'T', kind: 'button' }, h(Tag, { onClick: noop }, 'T')],
    ['satr-tag', { label: 'T', kind: 'button', count: 3, circle: true }, h(Tag, { count: 3, circle: true, onClick: noop }, 'T')],
    ['satr-tag', { label: 'T', kind: 'button', off: true }, h(Tag, { className: 'satr-tag--off', onClick: noop }, 'T')],
    ['satr-tag', { label: 'T', kind: 'a', href: '/x', accent: true }, h(Tag, { as: 'a', href: '/x', variant: 'accent' }, 'T')],
    ['satr-tag', { label: 'T', kind: 'span' }, h(Tag, { as: 'span' }, 'T')],
    ['satr-tag-label', { label: 'T' }, h(Tag, { appearance: 'label' }, 'T')],
    ['satr-field', { id: 'f1', label: 'L', tone: 'light' }, h(TextField, { id: 'f1', label: 'L' })],
    ['satr-field', { id: 'f1', name: 'n', label: 'L', tone: 'light', value: 'v', disabled: true }, h(TextField, { id: 'f1', label: 'L', name: 'n', defaultValue: 'v', disabled: true })],
    ['satr-field', { id: 'f1', type: 'email', label: 'L', tone: 'dark', required: true }, h(TextField, { id: 'f1', label: 'L', tone: 'dark', type: 'email', required: true })],
    ['satr-field', { id: 'f1', label: 'L', tone: 'light', multiline: true }, h(TextField, { id: 'f1', label: 'L', multiline: true })],
    ['satr-scope-tabs', { label: 'S', current: 'a', tabs }, h(ScopeTabs, { label: 'S', value: 'a', tabs })],
    ['satr-squircle-link', { href: '/l', label: 'Log in' }, h(SquircleLink, { href: '/l' }, 'Log in')],
    ['satr-squircle-link', { href: '/l', label: 'Log in', inverted: true }, h(SquircleLink, { href: '/l', inverted: true }, 'Log in')],
  ];
  const cache = {};
  for (const [name, params, el] of cases) {
    cache[name] ??= parse(await readFile(path.join(dir, `${name}.html`), 'utf8'));
    const mine = norm(run(cache[name], params, params));
    const react = norm(renderToStaticMarkup(el));
    const ok = mine === react;
    if (!ok) {
      failed++;
      console.log(`FAIL ${name} ${JSON.stringify(params)}\n  partial: ${mine}\n  react:   ${react}`);
    }
  }
  console.log(`${cases.length - failed} of ${cases.length} partial cases match the React markup.`);

  // Shortcodes for Markdown: each must hand its partial every parameter the partial reads.
  const scDir = path.join(root, 'public/handoff/hugo/layouts/shortcodes');
  const { readdir } = await import('node:fs/promises');
  for (const f of await readdir(scDir)) {
    const code = (await readFile(path.join(scDir, f), 'utf8')).replace(/\{\{\/\*[\s\S]*?\*\/\}\}/g, '');
    const partial = code.match(/partial "([\w-]+\.html)"/)[1];
    const ptxt = (await readFile(path.join(dir, partial), 'utf8')).replace(/\{\{\/\*[\s\S]*?\*\/\}\}/g, '');
    const actions = [...ptxt.matchAll(/\{\{([\s\S]*?)\}\}/g)].map((m) => m[1].replace(/"[^"]*"/g, '""'));
    const used = new Set(actions.flatMap((a) => [...a.matchAll(/\$?\.(\w+)/g)].map((m) => m[1])));
    const passed = new Set([...code.matchAll(/"(\w+)" /g)].map((m) => m[1]));
    const missing = [...used].filter((k) => !passed.has(k));
    if (missing.length) {
      failed++;
      console.log(`FAIL shortcode ${f}: does not pass ${missing.join(', ')} to ${partial}`);
    } else console.log(`shortcode ${f} passes all ${used.size} parameters of ${partial}`);
  }
} finally {
  await vite.close();
}
if (failed) process.exitCode = 1;
