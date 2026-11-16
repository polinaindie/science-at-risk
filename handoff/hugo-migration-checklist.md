# Fitting the vibe-coded drafts to Hugo: the 8 steps, with what this repo needs

Findings come from scripts run on `public/*.html` (the mirrored pages, 518 files outside `handoff/`) and from `tokens-audit.md`. Counts are literal results, not estimates.

| # | Step | State in the drafts | What to do |
|---|---|---|---|
| 1 | Styles into tokens | `handoff/tokens.css` exists. About 135 hex literals remain in page CSS; `satr-auth.css` re-declares its own palette; 3007 inline `style=` across 522 HTML files (mostly the repeated header, plus 275 `--exp-year-w` values on expert pages). | Use `tokens.css` only. Replace `--exp-year-w` with a class or computed width. Merge `#4a5459` and `#4d4d4d`. See `tokens-audit.md`. |
| 2 | Public pages static | Mirrored pages are static HTML. Home exists as static only in `handoff/home.html` (React before). Chrome (header/footer) is filled by a build script. | Hugo renders everything server-side. Drop `satr-chrome.js` behaviour except menu toggle. Remove Google Analytics, reCAPTCHA and `csrf` meta from every page (294 expert pages carry all three). |
| 3 | Templates and partials | Pages are one big mirrored file each; `states.html` has the named BEM components. | Partials named `card-scientist`, `list-research`… as in `template-map.md`. |
| 4 | Data apart from markup | `data/*.yaml` repeats the content model; Home copy is still in `homeCopy.ts` / `build-home.mjs`. | Content in front matter, taxonomy/menu/partners in Hugo `data/`. |
| 5 | Two languages from the start | UK exists only for Home, auth pages and the cabinet. `i18n/` holds 312 keys; 105 UK drafts need review. | `/` and `/uk`, `i18n/ui.*.yaml`, switcher goes to the equivalent page (fallback: section index). |
| 6 | No raw HTML in content | Mirrored story/research bodies are raw HTML. | Convert to Markdown + `figure`, `gallery`, `embed`, `quote` (see `prose.html`). Image alt texts are generated "Title №N" and every figcaption is empty; infrastructure gallery `alt` is `#`. |
| 7 | No features outside the architecture | Only Connect, Want to help, static search; cabinet is a separate Go portal. | Don't add registration, comments, counters. Tag counts must be computed at build (home shows Teaching 100, list shows 101). |
| 8 | Automatic checks | Not wired. One-off runs on handoff pages: axe 0 violations, no JS, 3 widths. | Add axe + Lighthouse in CI, plus a no-JS check and three viewport screenshots. Lighthouse was NOT run here. |

## Specific defects found in the mirrored pages (fix in templates, not in the mirror)

| Finding | Count |
|---|---|
| Pages with no `<main>` (expert 294, infrastructure 23, research 17, scientists lists 29, societies lists 3, most root pages 18) | 384 |
| Images without `alt` (scientists list 284, root pages 78, story 65) | 427 |
| Research pages `noindex, follow` | all 16 |
| Research `og:url` points to `/whitepaper/<slug>`, `og:title` is "Science at risk" on every paper | all |
| Story pages without meta description | 11 of 72 |
| Every story `og:image` is `main_og.png` | all |
| Scientist profiles without a usable photo | 3 |
| Photos under the proposed 600×600 minimum | 82 of 291 |
| Pagination numbers (28–32 px) and search clear button (32 px) below the 44 px target | existing CSS |
| `#4a5459` on `#b5c6cd` = 4.4:1 (fails AA) | existing CSS |
| Email address of one coordinator in plain text on every expert, infrastructure and research page (breaks "emails are never shown") | 412 occurrences (expert, research, scientists, story pages; also on all 23 infrastructure pages) |
| Static UK versions of lists, profiles, stories | none |

More cross-page inconsistencies (section names, domain strings, slugs, duplicate societies): `content-model/README.md`.
