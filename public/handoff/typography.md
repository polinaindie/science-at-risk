# Typography: three roles

Components never name a font. They ask for a **role**; the role is defined once in `../css/tokens.css`.

| Role | Variable | Tailwind class (React) | Font | Use for |
|---|---|---|---|---|
| heading | `--font-heading` | `font-heading` | Noto Serif 400 | h1–h4, person names, big numbers, pull quotes |
| text | `--font-text` (+ `--font-weight-text`) | `font-text` | e-Ukraine Light 300 | everything read as sentences: article body, card descriptions, profile text, lead paragraphs, authors lines, text typed into fields |
| ui | `--font-ui` | `font-ui` | IBM Plex Mono | everything operated or scanned: nav, buttons, chips, tags, labels, breadcrumbs, dates, counts, captions, hints, errors |

Rule of thumb: a sentence a person reads to the end is `text`; a word or number that is scanned or clicked is `ui`.
The families themselves (`--font-serif`, `--font-ukraine`, `--font-mono`) are primitives: only `tokens.css` and the
role definitions refer to them.

## Where it is applied

- **React site and cabinet:** utilities `font-heading / font-text / font-ui` (they replaced `font-serif / font-ukraine / font-mono`; the look did not change).
- **Static pages:** `../css/satr-text.css` (linked after the page CSS by `npm run chrome`) sets `text` on the running-text
  elements listed in it and `ui` as the page default. Page stylesheets that hard-coded a family now read the role with the old
  family as fallback.
- **Hand-off pages, partials, `satr-components.css`, `prose.css`, `cabinet.css`:** the role variables.
- **Hugo:** write `font-family: var(--font-text)` (or the class) in the component; never a family name.

## Change a role

Edit one line in `../css/tokens.css`, for example `--font-text`. The React site, the cabinet, the static pages and these
hand-off pages all follow (checked by switching the role to another family and reading the computed font on each surface).

## Weights

`text` has one weight, Light 300 (the only e-Ukraine file shipped, see open question 26), and Bold 700 for `strong`.
`heading` is 400. `ui` uses 400 and 500 (tabs) and 300 for field labels.

## Not unified yet (see `open-questions.md`, 39–40)

- Sizes of running text still differ by component (14, 15, 16, 18, 22 px); only the family, weight and tracking were unified.
- Scientist profile pages run on a 16px root, the rest of the site on 18px.
