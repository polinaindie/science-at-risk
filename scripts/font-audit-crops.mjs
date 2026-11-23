#!/usr/bin/env node
/**
 * For every (role, variant) in docs/font-audit/roles-data.json: opens the example page, finds the first visible element whose text starts with
 * the sample and whose computed style matches the variant, and saves a crop to docs/font-audit/crops/<role>-<n>.png (1440 viewport).
 * Run after scripts/font-audit-roles.py.
 */
import { chromium } from 'playwright';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const out = path.join(root, 'docs', 'font-audit');
mkdirSync(path.join(out, 'crops'), { recursive: true });
const BASE = process.argv.find((a) => a.startsWith('--base='))?.slice(7) ?? 'http://localhost:5174';
const { data } = JSON.parse(readFileSync(path.join(out, 'roles-data.json'), 'utf8'));
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();
let n = 0, miss = 0;
for (const [role, variants] of Object.entries(data['1440'])) {
  if (role === 'hidden') continue;
  let i = 0;
  for (const v of variants) {
    v.crop = null;
    if (!v.sample || !v.page) { i++; continue; }
    try {
      await page.goto(BASE + v.page, { waitUntil: 'load', timeout: 30000 });
      await page.evaluate(() => document.fonts.ready);
      await page.waitForTimeout(400);
      await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 700) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 30)); } window.scrollTo(0, 0); });
      const handle = await page.evaluateHandle(({ sample, size, weight, family }) => {
        const px = (s) => Math.round(parseFloat(s) * 10) / 10;
        const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
        let t;
        while ((t = w.nextNode())) {
          if (!t.nodeValue.replace(/\s+/g, ' ').trim().startsWith(sample)) continue;
          const el = t.parentElement, cs = getComputedStyle(el), r = el.getBoundingClientRect();
          if (r.width && r.height && Math.abs(parseFloat(cs.fontSize) - +size) < 0.11 && cs.fontWeight === weight && cs.fontFamily.includes(family)) return el;
        }
        return null;
      }, { sample: v.sample, size: v.size, weight: v.weight, family: v.family });
      const el = handle.asElement();
      if (!el) { miss++; i++; continue; }
      const file = `crops/${role}-${i}.png`;
      await el.scrollIntoViewIfNeeded();
      await el.screenshot({ path: path.join(out, file) });
      v.crop = file; n++;
    } catch (e) { miss++; console.log(role, i, String(e).slice(0, 140)); }
    i++;
  }
}
await browser.close();
writeFileSync(path.join(out, 'roles-data.json'), JSON.stringify({ ...JSON.parse(readFileSync(path.join(out, 'roles-data.json'), 'utf8')), data }, null, 1));
console.log(`crops: ${n}, not found: ${miss}`);
