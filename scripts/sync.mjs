/**
 * Keeps everything that is generated from the live components in step with them:
 *
 *   npm run sync            rebuild: utility CSS, header/footer on the static pages, hand-off specimens, partial check
 *   npm run sync -- --check change nothing, exit 1 if something is stale (used by the pre-commit hook)
 *   node scripts/sync.mjs --only=handoff   just the hand-off specimens and the partial check (fast; used by the dev watcher)
 *
 * What is shared without any step: public/css/tokens.css, satr-components.css, satr-text.css, satr-base.css, type-scale*.css
 * and the JS in public/js are read directly by both the site and the hand-off, so editing them changes both at once.
 */
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const check = process.argv.includes('--check');
const only = (process.argv.find((a) => a.startsWith('--only=')) || '').slice(7);

const run = (label, script, args = []) => {
  const r = spawnSync(process.execPath, [path.join('scripts', script), ...args], { cwd: root, encoding: 'utf8' });
  const lines = `${r.stdout || ''}${r.stderr || ''}`.trim().split('\n').filter(Boolean);
  // On failure show the lines that say what failed (a partial that no longer matches its component), otherwise the last two.
  const out = (r.status === 0 ? lines.slice(-2) : lines.filter((l) => /FAIL|partial:|react:|Error/.test(l)).slice(0, 4).map((l) => l.slice(0, 200))).join(' | ');
  console.log(`${r.status === 0 ? 'ok  ' : 'FAIL'} ${label}${out ? ': ' + out : ''}`);
  return r.status === 0;
};

let ok = true;
if (check) {
  ok = run('static pages (header, footer)', 'build-chrome.mjs', ['--check']) && ok;
  ok = run('hand-off specimens', 'build-handoff.mjs', ['--check']) && ok;
  ok = run('Hugo partials match React', 'verify-hugo-partials.mjs') && ok;
  if (!ok) console.log('\nStale. Run:  npm run sync');
} else {
  if (only !== 'handoff') {
    ok = run('utility CSS', 'build-chrome-css.mjs') && ok;
    ok = run('static pages (header, footer)', 'build-chrome.mjs') && ok;
  }
  ok = run('hand-off specimens', 'build-handoff.mjs') && ok;
  ok = run('Hugo partials match React', 'verify-hugo-partials.mjs') && ok;
}
process.exitCode = ok ? 0 : 1;
