/**
 * Keeps `public/css/satr-chrome.css` — the header and footer's stylesheet on
 * the mirrored static pages — in step with the components.
 *
 * The file was generated once from the components; it is scoped under
 * `.satr-chrome`. When a component gains a utility class the file lacks, this
 * script compiles just the missing ones with Tailwind and keeps them between
 * the two `satr-chrome:additions` markers at the end of the file. Run it before
 * `npm run chrome` whenever SiteHeader, MobileNav or Footer change:
 *
 *   node scripts/build-chrome-css.mjs
 */
import { compile } from '@tailwindcss/node';
import { transform } from 'lightningcss';
import postcss from 'postcss';
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const cssPath = path.join(root, 'public/css/satr-chrome.css');
const sources = [
  'SiteHeader/SiteHeader.tsx',
  'MobileNav/MobileNav.tsx',
  'Footer/Footer.tsx',
  'TextField/TextField.tsx',
  'Auth/Auth.tsx',
].map((f) =>
  path.join(root, 'src/components', f),
);
const START = '/* satr-chrome:additions */';
const END = '/* /satr-chrome:additions */';


const globals = await readFile(path.join(root, 'src/styles/globals.css'), 'utf8');
const themeStart = globals.indexOf('@theme {');
let depth = 0;
let themeEnd = themeStart;
for (let i = globals.indexOf('{', themeStart); i < globals.length; i++) {
  if (globals[i] === '{') depth++;
  if (globals[i] === '}' && --depth === 0) {
    themeEnd = i + 1;
    break;
  }
}
const theme = globals.slice(themeStart, themeEnd);

let existing = await readFile(cssPath, 'utf8');
const a = existing.indexOf(START);
if (a >= 0) existing = existing.slice(0, a).trimEnd();

// Every class-like token in the three sources.
const candidates = new Set();
for (const file of sources) {
  const text = await readFile(file, 'utf8');
  for (const m of text.matchAll(/[A-Za-z0-9_:\-\/\[\]\.%#()]+/g)) candidates.add(m[0]);
}

const compiler = await compile(`
  @theme default { --spacing: .25rem; --color-white: #fff; --color-black: #000;
    --breakpoint-sm: 40rem; --breakpoint-md: 48rem; --breakpoint-lg: 64rem; --breakpoint-xl: 80rem; }
  ${theme}
  @tailwind utilities;
`, { base: root, onDependency: () => {} });

const built = compiler.build([...candidates]);

// Flatten nesting, then scope every rule under `.satr-chrome`.
const { code } = transform({
  filename: 'additions.css',
  code: Buffer.from(built),
  minify: true,
  targets: { chrome: 100 << 16 },
});
const root2 = postcss.parse(code.toString());
root2.walkAtRules('layer', (at) => (at.nodes ? at.replaceWith(at.nodes) : at.remove()));
root2.walkAtRules('property', (at) => at.remove());
root2.walkRules((rule) => {
  if (rule.parent?.type === 'atrule' && rule.parent.name === 'keyframes') return;
  if (/^:root|^:host/.test(rule.selector)) return rule.remove();
  rule.selector = rule.selector
    .split(',')
    .map((x) => `.satr-chrome ${x.trim()}`)
    .join(',');
});
root2.walkAtRules((at) => {
  if (at.nodes && !at.nodes.length) at.remove();
});

// Drop rules the generated file already carries.
const fresh = [];
for (const node of root2.nodes) {
  const text = node.toString().replace(/\s*;?\s*$/, '');
  if (node.type === 'rule') {
    if (!existing.includes(text.replace(/;\}$/, '}')) && !existing.includes(text)) fresh.push(text);
  } else if (node.type === 'atrule' && node.nodes) {
    const keep = node.nodes.filter((r) => !existing.includes(r.toString().replace(/;\}$/, '}')));
    if (keep.length) fresh.push(`@${node.name} ${node.params}{${keep.map((r) => r.toString()).join('')}}`);
  }
}

const next = `${existing}\n${START}\n${fresh.join('')}\n${END}\n`;
await writeFile(cssPath, next);
console.log(`satr-chrome.css: ${fresh.length} rule group(s) added.`);
