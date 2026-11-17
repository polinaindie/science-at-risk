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

## Headings: one scale

A heading takes its size from its **role**, not from the page it is on. Tokens in `../css/tokens.css`, Tailwind utilities `text-heading-*` (React).

| Role | Variable | Steps (phone to desktop) | Used for |
|---|---|---|---|
| heading-1 | `--heading-1` | `--step-h1` 32 to 72 | title of a content page: lists, stories, about, research article, society |
| heading-entity | `--heading-entity` | `--step-3xl` 36 to 48 | title of a profile or detail page and of utility pages: scientist, infrastructure, log in, cabinet profile |
| heading-2 | `--heading-2` | `--step-h2` 20 to 36 | a section of a page: "Research field", "Other stories", form titles; `h2` inside `.prose` |
| heading-3 | `--heading-3` | `--step-xl` 24 to 28 | sub-section and card title: scientist, paper, story, project, notification; `h3` inside `.prose` |
| label | the `ui` role, 18px | | an `h4` used as a caption ("Author:", "City"): not a heading size |

Display: the footer block title "Want to help?" is the heading-1 size. The footer's sentence under it is a paragraph, not a heading.
Headings never use `ui` or `text`; they are `heading` (Noto Serif 400).

Known exception: an infrastructure page with a very long name keeps its `font-mini` size (`infrastructure-page.css`, `!important`).
The sizes the React app renders are 12.5% larger than the numbers above (root size, open question 36).

## Weights

`text` has one weight, Light 300 (the only e-Ukraine file shipped, see open question 26), and Bold 700 for `strong`.
`heading` is 400. `ui` uses 400 and 500 (tabs) and 300 for field labels.

## Not unified yet (see `open-questions.md`, 39–40)

- Sizes of running text still differ by component (14, 15, 16, 18, 22 px); only the family, weight and tracking were unified.
- Scientist profile pages run on a 16px root, the rest of the site on 18px.
