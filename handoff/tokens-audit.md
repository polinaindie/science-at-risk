# Tokens audit (report only, nothing was fixed)

Scope: `public/css/**` (own files, not `style.min.css`), `src/` (React/Tailwind), `public/**/*.html`. Counts taken on branch `v5-homepage-drafts`. Re-run with the greps at the bottom.

## 1. Hard-coded colours

Own CSS (pages/*, satr-*, breadcrumbs): about 135 hex literals, 5 `rgba()`. `src/styles/globals.css` holds the 38 that are legitimate (they are the `@theme` definitions).

| Value | Count (own CSS) | Token it should be |
|---|---|---|
| `#000` / `#000000` | 91 | `--color-text` / `--color-line` / `--color-action-bg` (by role) |
| `#fff` / `#ffffff` | 34 | `--color-bg` / `--color-surface` / `--color-action-text` |
| `#b5c6cd` | 9 | `--color-blue` |
| `#333` | 9 | `--color-grey-900` |
| `#f0eebe` | 6 | `--color-yellow` / `--color-attention` |
| `#4d4d4d` | 6 | `--color-grey-700` |
| `#4a5459` | 5 | `--color-grey-600` (near duplicate of grey-700; ask design to merge) |
| `#bccbd2`, `#e6edf0`, `#37b066`, `#c8c8c8`, `#fdbe0d`, `#595959`, `#ececec`, `#e8e8e8` | 1 each | see tokens.css; `#ececec`, `#e8e8e8`, `#595959` are stragglers with no token |

Top offenders (own CSS, hex count): `public/css/pages/listing-hero.css` 18, `public/css/satr-auth.css` 14 (it re-declares its own `--auth-*` palette instead of using shared tokens), `pages/infrastructure-page.css` 12, `pages/research-filter.css` 11, `pages/expert.css` 11, `pages/expert-entities.css` 8 (declares `--ground`, `--s1..--s7`, `--r`), `pages/stories-tags.css` 7, `pages/search-field.css` 6.

Colours that exist in `src/` or the mirror but are NOT in the design system: `#b00020` (error red, 4x in React components, never used by the static pages, which use yellow `#f0eebe` for errors: pick one), `#6b6b6b` (4x), and in `style.min.css`: `#ff5114`, `#6c757d`, `#ffc107`, `#f8f9fa`, `#dc3545`, `#cbd3da` (Bootstrap leftovers). In `src/` React files: `#000` 15, `#fff` 14+6, `#b5c6cd` 4, `#000000` 4, `#c8c8c8` 3. Files: `SiteHeader.tsx`, `Cabinet/Profile.tsx`, `Cabinet/Settings.tsx`, `TextField.tsx`, `Select/FieldSelect.tsx`, `Auth/InvitationEmail.tsx` (email: hex is fine there, mail clients need it).

`style.min.css` (mirror, 15.7k lines): `#000000` 73, `#fff` 57, `#b5c6cd` 7, `#f0eebe` 5. It is legacy; do not port it, port the tokens.

## 2. Magic px numbers that should be tokens

Counts of literals in own page CSS + satr-auth + breadcrumbs:

- Breakpoints as literals: `768px` 46x, `767px` 8x (`max-width` mirror of 768: should be one inverse query), `1280px` 6x, `992px` 3x (Bootstrap legacy), `1440px`. Not expressible as variables; documented in `tokens.css` section 10.
- Spacing: `24px` 24x, `16px` 24x, `32px` 20x, `8px` 17x, `12px` 15x (off-scale: 12 is not on the 8-based ladder), `48px` 14x, `40px` 12x, `20px` 13x (off-scale), `4px` 22x, `22px` 9x, `26px` 6x (off-scale, from the header's 26px padding).
- Border widths: `2px` 34x (= `--border-rule`), `3px` 16x (= `--border-heavy`), `1px` 12x.
- Tap size: `44px` 8x (= `--tap-min`), but chips/buttons elsewhere are 28 / 32 / 47 / 48px: `.pagination__number` 28 px (32 from 768) and `.search-field__clear` 32 px are BELOW 44.
- Fixed widths: `360px`, `560px`, `180px`, `160px`, `840px`, `720px` (dialog), `530px` (form). Layout one-offs; keep local.
- Font sizes in px inside `satr-auth.css` (14, 15, 16, 18, 32) and `satr-squircle.css` (15, 20/28): should use `--step-*` / `--text-*`. The pages already use rem steps.
- Radii: `15px` 4x, `14px` 1x, `12px` 1x, `8px` 2x, `0` 7x, `50%` 1x.
- Focus: `outline: 2px solid #000` 5x, `3px solid #000` 2x, `2px solid #fff` 1x, `outline: none/0` 6x. The `outline: none` cases need checking that a visible replacement exists (see `satr-auth` inputs: replaced by bottom border change).
- z-index: 1, 2, 5, 30, 40, 60, 100 plus Tailwind 50/60/70 in `satr-chrome.css`; consolidated to 4 layers in tokens.
- Transition durations: `0.15s`, `0.2s`, `0.3s`, `0.5s`, `0.8s` (spinner).

## 3. Inline `style=` in static HTML templates

3007 `style="` attributes in 522 HTML files (excluding `handoff/`). Almost all are repeated by the shared header chrome, i.e. they will vanish when the header is a Hugo partial:

| Inline style | Occurrences | What it is |
|---|---|---|
| `padding-top:26px;height:68px` | one per page (~520) | header bar |
| `top:47px` | one per page | EN/UK switcher position |
| `opacity:1` / `opacity:0;pointer-events:none` | one each per page | logo crossfade (two logos stacked) |
| `height:42px` | one per page | logo box |
| `--exp-year-w:11ch` / `13ch` / `10ch` | 211 / 44 / 20 (expert/*.html) | width of the year column in the experience list: data-driven, belongs in a template variable or CSS `ch` grid |
| rest | ~100 | one-offs: `margin-top:0`, `margin-bottom:16px`, in auth screens (`link-sent.html` 2) |

Per section: `expert/` 1764 (294 files, 6 per page), `society/` 185, `story/` 360, `infrastructure/` 115, `research/` 85.
Top offender files: every `public/expert/*.html` (6 each); root pages 1-2 each. Source of the header ones is `src/components/SiteHeader` compiled to `public/css/satr-chrome.css` and HTML snippets between `<!-- satr-chrome:header -->` markers.

Also: `satr-chrome.css` is generated Tailwind (`.satr-chrome .px-[calc(16px/var(--satr-fit,1))]` etc.), not hand-portable. In Hugo, the header and footer should be written fresh with the BEM classes of `states.html`, reading `tokens.css`.

## 4. Fonts (Cyrillic and licence)

| Font | In repo? | Cyrillic | Licence |
|---|---|---|---|
| IBM Plex Mono (Light 300, Bold 700) | yes, `public/fonts/e-ukraine/*.woff2/.woff/.otf` (duplicate copy in `fonts/client/e-ukraine/`) | Verified with fontTools on the `.otf`/`.woff`: all 64 basic Cyrillic letters (U+0410-044F) and the Ukrainian extras (Є І Ї Ґ є і ї ґ), apostrophe, dash, № present, 465 glyphs. Bold identical coverage. `woff2` not opened (no brotli) but is the same md5 in both folders | NOT STATED. The font name table carries only the designer (Dmitry Rastvortsev) and the URL `plan.diia.gov.ua`; no licence text file in the repo. OPEN QUESTION: confirm terms of use with Diia / the designer before self-hosting in production. Also: the file named `e-ukraine.*` is the Light (300) cut and is declared as weight 400 in `src/styles/fonts.css`: no true 400 weight exists |
| IBM Plex Mono | NO local files; loaded from Google Fonts (`fonts.googleapis.com`) in every page (516 pages) | Google serves a `cyrillic` subset for IBM Plex Mono (upstream family has Cyrillic). Not verifiable offline here | SIL OFL 1.1 (upstream IBM Plex). Not verified from a file in the repo |
| Noto Serif | NO local files; Google Fonts | Google serves `cyrillic` and `cyrillic-ext` subsets | SIL OFL 1.1 (upstream Noto). Not verified from a file in the repo |

Findings for developers: (1) two of three families are fetched from Google at runtime: a GDPR/privacy and availability issue for a Ukrainian-NGO site; recommend self-hosting woff2 for Latin + Cyrillic (+ latin-ext) subsets, with the OFL text shipped next to them. (2) `src/styles/fonts.css` requests IBM Plex Mono weights 300/400/500 and Noto Serif 400 only, the static pages request 300-700 / 400+700: settle which weights are real (tokens assume 300, 400, 700 mono; serif 400). (3) Fallbacks in tokens.css are system fonts; no `size-adjust` metrics have been tuned.

## 5. Other findings relevant to hand-off

- The squircle is `paint(squircle)` via `css-houdini-squircle` from `unpkg.com` (Chromium only; Safari/Firefox get a plain radius, with `.isSafari` hacks). Hand-off now uses `js/satr-shape.js` (same path as the React site).
- Third-party runtime assets on every page: Google Fonts, cdnjs (Swiper 9.1.0, fullPage.js 4.0.9), unpkg, Google reCAPTCHA.
- Two spacing scales coexist: 8-based `--s1..--s7` (expert pages) and Tailwind 4px multiples (chrome). Tokens use the 8-based one plus a 4px half-step.
- Two muted greys (`#4d4d4d`, `#4a5459`); `#4a5459` on `#b5c6cd` is 4.4:1 and fails AA.
- Pagination numbers (28/32px) and search clear (32px) are under the 44px target floor.

## Re-run

```
grep -ciE "#[0-9a-f]{3,8}\b" public/css/pages/*.css public/css/satr-*.css src/styles/*.css
grep -o ' style="' $(find public -name '*.html' -not -path 'public/handoff/*') | wc -l
```
