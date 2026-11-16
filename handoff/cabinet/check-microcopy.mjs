// Verifies microcopy.uk.yaml and microcopy.en.yaml: same keys in the same order,
// no empty values, same {placeholders} in both. No dependencies.  node check-microcopy.mjs
import fs from 'node:fs';
const dir = new URL('.', import.meta.url);
const load = (l) => {
  const out = [];
  fs.readFileSync(new URL('microcopy.' + l + '.yaml', dir), 'utf8').split('\n').forEach((line, i) => {
    if (!line || line.startsWith('#')) return;
    const m = line.match(/^([A-Za-z0-9_.]+): ("(?:[^"\\]|\\.)*")( # new)?$/);
    if (!m) { console.error(l + ':' + (i + 1) + ' cannot parse: ' + line); process.exitCode = 1; return; }
    out.push([m[1], JSON.parse(m[2])]);
  });
  return out;
};
const en = load('en'), uk = load('uk');
let bad = 0;
const fail = (s) => { console.error(s); bad++; };
if (en.length !== uk.length) fail('different number of keys: en ' + en.length + ', uk ' + uk.length);
en.forEach(([k, v], i) => {
  const u = uk[i];
  if (!u || u[0] !== k) return fail('key mismatch at ' + (i + 1) + ': en ' + k + ' / uk ' + (u && u[0]));
  if (!v.trim() || !u[1].trim()) fail('empty value: ' + k);
  const ph = (s) => (s.match(/\{\w+\}/g) || []).sort().join();
  if (ph(v) !== ph(u[1])) fail('placeholders differ: ' + k);
});
if (new Set(en.map((e) => e[0])).size !== en.length) fail('duplicate keys');
console.log(bad ? bad + ' problem(s)' : 'OK: ' + en.length + ' keys, en and uk match');
process.exit(bad ? 1 : 0);
