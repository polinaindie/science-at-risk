# Science at Risk v2 — hand-off package (designer → developers)

This is a **reference for look and behaviour**, not code to ship. v2 is Hugo templates plus
a Go portal; there is no Node or PHP at runtime and no API call on a page view.
Port the markup and CSS to Hugo partials; do not port React.

Serve it as plain static files, from `public/`:

```bash
cd public && python3 -m http.server 8080
# then open http://localhost:8080/handoff/states.html
```

## What is in the package

| Path | What | Status |
|---|---|---|
| `squircle.html` + `../js/satr-shape.js` | The squircle (identity): dependency-free script, markup contract, Hugo partial. Same path as the React site. | **Reference** |
| `tokens.css` | All design tokens (`--color-*`, `--space-*`, `--radius-*`, `--shadow-*`, `--font-*`, `--text-*`, `--tap-min`). Breakpoints are comments (`--bp-*`) because CSS variables can't be used in media queries. | **Reference** |
| `states.html` | Every component with its states on one page: cards, nav, EN/UK switcher, footer, breadcrumbs, buttons/links, search + tag filters (empty, many, pagination), Connect and Want to help forms (default, focus, field error, captcha, rate limit, success, backend unavailable), EN-outdated, 404. | **Reference** |
| `prose.html`, `prose.css` | `.prose` article style and the four allowed shortcodes (`figure`, `gallery`, `embed`, `quote`). Each has its Markdown call in an HTML comment. | **Reference** |
| Home | The reference for Home is the live site (https://polinaindie.github.io/science-at-risk/); this package has no separate Home page. Field map: `content-model/home-map.md`. | **Live site** |
| `content-model/` | One file per type: scientist, institution, society, research, story, work, page, home-map. Tables: field, required, max length, format, place on page, if empty. | **Source of truth** for fields |
| `data/` | Example data in YAML, three variants each: `normal`, `too_long`, `empty` (+ `en_outdated` for scientist). Hugo front-matter style. | **Reference** |
| `i18n/` | `ui.en.yaml`, `ui.uk.yaml`: 312 identical keys, Hugo `i18n` format with plurals. | **Source of truth** for UI text, UK needs a native editor |
| `cabinet/` | Scientist cabinet (`/login`, `/account`): 54 HTML pages in EN and `uk/`, 6 letters (HTML + TXT), `microcopy.*.yaml`, its own `README.md`. | **Reference** |
| `template-map.md` | Content type → template → components. | Read first |
| `open-questions.md` | Everything that needs a developer or editor decision. | Read second |
| `hugo-migration-checklist.md` | The 8-step "vibe-code → Hugo" list, with the real findings from this repo. | Work list |
| `tokens-audit.md` | Hard-coded colours and inline styles in the drafts. | Report |

## What is the reference and what is only illustration

**Reference (reproduce it):** tokens, component look and states, page layouts at 375 / 768 / 1280,
content model, UI dictionary keys, cabinet screens, letter structure, accessibility rules.

**Illustration only (do not reproduce):**
- the rest of `public/*.html`, `public/expert/*`, `public/story/*` and so on. These are
  mirrored pages from the old site, restyled. They carry inline styles, the old Laravel
  `csrf` meta, Google Analytics and reCAPTCHA. Use them for content, not for markup;
- everything in `src/` (React, Tailwind, Storybook);
- `cabinet/demo.js` (click-through demo without a server) and the fake autosave;
- the placeholder images (`/uploads/*` in `prose.html` don't exist);
- sample text and slugs in `data/` (the `normal` variants use real copy, the others are synthetic).

## Rules the pages follow (check against them in review)

- One `<h1>`, a logical heading order, landmarks `header / nav / main / article / footer`.
- All important content is in HTML without JavaScript. JS is only enhancement.
- WCAG AA contrast, visible `:focus-visible`, keyboard navigation, targets of at least 44 px.
- Email addresses are never printed on a page (they are encoded and filled in by script on the live site; the package uses `@example.org`).
- Long text is Markdown plus four shortcodes. No raw HTML in content.
- Research: the HTML page is canonical, the PDF is a download only.
- No registration, comments, chat or live counters. The only dynamics are the Connect and Want to help forms (Forms API, captcha, rate limit) and the static search.

## Verification already done

- `states.html`, `prose.html` and the 54 cabinet pages: Playwright at 375 / 768 / 1280, no horizontal scroll, no console errors, text present with JS off, axe-core (WCAG 2 A/AA + best-practice) 0 violations.
- i18n key sets are identical (`i18n/check-keys.rb`); cabinet microcopy keys match (`cabinet/check-microcopy.mjs`); the YAML examples parse (`data/validate.rb`).
- **Not done:** Lighthouse (needs network/Chrome setup); screenshots were looked at by eye only for a few pages; no native Ukrainian read-through (see below).

## Known gaps

1. Ukrainian copy is a draft in places: 105 keys in `i18n/ui.uk.yaml` are marked `# DRAFT-UK`, and the cabinet texts need a native read.
2. Only the cabinet exists in UK as drawn pages. Other page templates are reviewed in EN; UK is covered by long-string rules and `data/*too_long*`, not by drawn pages.
4. The cabinet profile form is a subset of fields (see `cabinet/README.md`).
5. Page templates were checked at three widths only for the handoff pages above; the mirrored pages in `public/` still fail the checks listed in `hugo-migration-checklist.md`.
6. Fonts: Noto Serif and IBM Plex Mono are loaded from Google Fonts in the drafts and are not in the repo; e-Ukraine has no licence text in the files and is only the Light cut. See `open-questions.md`.

## Regenerating generated files

| File(s) | Command |
|---|---|
| `cabinet/**/*.html`, letters | Generated by the scripts in `scripts/handoff-cabinet/` (`dump.mjs` → `existing.json`, then `pages.mjs` / `letters.mjs`). **Not verified to re-run cleanly**: they were written in a scratch folder with an absolute output path in `build.mjs`. Treat the HTML as the source; `cabinet/uk/index.html` was fixed by hand and would be overwritten. |
| `i18n` / cabinet keys | run from their own folders: `cd i18n && ruby check-keys.rb`, `cd cabinet && node check-microcopy.mjs`, `cd data && ruby validate.rb` |
