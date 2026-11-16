# research (white paper / report)

Public URL `/research/<slug>` (mirror `public/research/*.html`, 16 papers; the list `/research` = `public/research.html` + `research-filter.js`). **The HTML page is canonical; the PDF is a download only** (a "Download .pdf, 9.88 MB" button), the PDF is not an indexable page.

Derived from: `docs/research-filter.md`, `public/js/research-index.json` (`themes`, `docs[]`: `slug`, `title`, `theme`, `pdf`, `authors`, `new`), `public/js/research-i18n.json`, `public/research/*.html` (all 16 measured), `public/css/pages/research-article.css`, `public/js/research-article.js`, home block `src/sandbox/HomePageV6/HomePageV6.tsx` (`defaultResearchV6`).

Layout: crumbs, h1, authors (rule under them), then two columns: reading column 9/12 (lead, text) and the aside (Download button level with the author rule, ".pdf, 9.88 MB"; on phone the button is on top). The papers have no images.

## Fields

| Field | R/O | Max | Type / format | Where on page | If empty | EN/UK | Derived from |
|---|---|---|---|---|---|---|---|
| `slug`, `translationKey` | R | 160 (obs 125) | README 2 | URL; `research-index.json.slug` | blocks | S | |
| `title` | R | 160 (obs 125) | plain, **in its original language** ("Document titles stay in their original language", `research-i18n.json` note: a Ukrainian paper has a Ukrainian title in EN too) | h1 `.paper__main-title`, list card, last breadcrumb (truncates), home card | blocks | S (not translated) unless the paper exists in both languages (then two files) | `h1` equals the index title on all 16 |
| `theme` | R | 1 | one of `scientists`, `collections`, `policy`, `society` | list filter chip; card label | blocks | S slug; label T | `research-index.json` `theme` |
| `authors` | R | 250 (obs 183) | plain, comma-separated: "Olena Kozak, Lidia Kuzemska, ..."; the label is a UI string (`research.authors`: "Author(-s):") | block above the lead with a rule below; card line "Author(-s): ..."; home card | blocks (4 papers in the index have it as a different form) | T (transliteration per language: "Олена Козак") | `Author(-s):` |
| `summary` (lead) | R | 1200 (obs 918, median about 480; first paragraph is large type `.paper-lead`) | Markdown, one paragraph | `p.paper-lead` first in the text; card/home text is not the summary (cards show title and authors only) | blocks | T | `paper-lead` on 16 of 16 |
| `key_findings` | O | 10 items (obs 0 to 10: 3, 5, 5, 6, 10 on 5 of 16 papers), each title 160, text 900 | list of `{title, text}`; title is shown in bold with its number ("1. Basic needs outweigh academic needs.") | `p.paper-point` blocks after the lead; numbered automatically, do not type the number | omitted | T | `paper-point`, `paper-point__title` |
| `body` | R | 8000 (obs 5447 for lead + findings + body together) | Markdown; four shortcodes allowed but none is used today | reading column after the findings | blocks | T | `p.paragraph` |
| `pdf` | R | 15 MB (obs 183 KB to 9.88 MB) | file in `storage/`; size is computed at build time, never typed | aside Download button (link, `rel=nofollow`), card ".pdf" button | blocks (there is no paper without a PDF) | S (one PDF per language: `pdf_uk`, `pdf_en` when both exist) | `paper-aside__download`; `pdf` equals the page's link on 16 of 16 |
| `new` | O | bool | | blue "New" chip over the card title in the list | no chip | S | `new: true` on 1 paper (docs/research-filter.md: delete the flag when it is no longer new) |
| `order` | derived | | list order = newest first; no dates are stored ("There are no dates in the data (they are internal)") | list order, home shows the first 3 | | S | proposed: a `weight` or `date` field instead of file order, so editors do not reorder JSON |
| `date` | O | | ISO date, internal | `article:published_time` not shown | | S | not in the mirror; add for ordering |
| `seo.description` | O | 160 | default: `summary` cut at 160 | meta, og | derived | T | the mirror has the site-wide sentence "Aid to Ukrainian scientists who suffered from the war" on all papers |
| `seo.og_image` | O | | | og | `main_og.png` | S | |
| `noindex` | O | bool | default false | `robots` | | S | mirror has `noindex, follow` on the pages: open question |

## States

| State | Behaviour |
|---|---|
| Normal | as above |
| Too long | h1 wraps to 4 lines at desktop, 6 at phone; the breadcrumb truncates with the title in `title`; the authors line wraps; list card title clamps at 4 lines; home card title clamps at 4 lines |
| Empty (required only) | title, theme, authors, summary, body, pdf: no key findings, no "New" chip |
| List | filter by `theme` (`?theme=scientists`); counts, "Showing N of M" computed; labels in `research-i18n.json`; chip hover black |
| PDF unavailable | the button is disabled with text "File is not available" and a note; the HTML page still reads (**proposed**) |

## Disagreements between the pages

- `og:url` is `/whitepaper/<slug>` while the page is `/research/<slug>`; `og:title` is "Science at risk" and `description` the site sentence on all 16; `robots` is `noindex, follow` on all 16.
- Summary is called "lead" in markup (`paper-lead`); the task word "key finding" maps to the numbered `paper-point` items (5 of 16 papers have them).
- `research-index.json` repeats title, authors and pdf of each page: generate it from front matter, do not keep two copies.
- Home card shows `Author(-s): ...` as the card description in EN and `Автор(и): ...` in UK; the Ukrainian authors are transliterated again (UK names differ from EN: "Павло Гольдін" vs "Pavel Gol’din"), so authors need a UK variant.
