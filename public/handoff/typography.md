# Typography: three roles

Components never name a font. They ask for a **role**; the role is defined once in `../css/tokens.css`.

| Role | Variable | Tailwind class (React) | Font | Use for |
|---|---|---|---|---|
| heading | `--font-heading` | `font-heading` | Noto Serif 400 | h1–h4, person names, big numbers, pull quotes |
| text | `--font-text` (+ `--font-weight-text`) | `font-text` | IBM Plex Mono 300 | everything read as sentences: article body, card descriptions, profile text, lead paragraphs, authors lines, text typed into fields |
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

## Weights

`text` has one weight, Light 300 (the only IBM Plex Mono file shipped, see open question 26), and Bold 700 for `strong`.
`heading` is 400. `ui` uses 400 and 500 (tabs) and 300 for field labels.

## One size scale (updated 2026-11-25)

Every size on the site, the static pages and the cabinet comes from one fluid scale, `--step-*`, generated into `../css/type-scale.css` (React) and `../css/type-scale-static.css` (static pages) by `scripts/build-type-scale.py`: **change the table there, not the CSS.** Each step has a size, a line height (`-lh`) and a letter spacing (`-ls`); sizes run from the phone value at 375px to the desktop value at 1280px. Values in px at the 18px root (phone to desktop):

| Step | px | Used for |
|---|---|---|
| `--step-xs` | 14 to 15 | chips, tags, breadcrumbs, fine print |
| `--step-sm` | 15 to 16 | card meta, captions, footer small print |
| `--step-md` | 16 to 18 | controls, buttons, form values |
| `--step-read` | 18 to 20 | **reading text**: story and research body, card descriptions, profile text, text typed into fields |
| `--step-lg` | 20 to 22 | tabs, lede, card names in lists, notification text |
| `--step-xl` | 24 to 28 | sub-headings, heading-3 |
| `--step-2xl` / `--step-3xl` | 28 to 36 / 36 to 48 | card titles, amounts, heading-entity |
| `--step-name` | 26 to 32 | person names in cards |
| `--step-h1` / `--step-h2` | 32 to 72 / 20 to 36 | heading-1, heading-2 |
| `--step-text2` | 14 to 16 | small text under headings |
| `--text-ui` | 16, fixed | secondary UI text: dates, counts, hints under 14 |

Rules that follow from it:
- A component asks for a step; it never writes a px size of its own. The font audit (`../../docs/font-audit/REPORT.md`, scripts `scripts/font-audit*.mjs`) lists every element and the step it uses, and decisions it kept apart.
- **Wide screens (1920px and up): the scale grows by a fifth** (reading text 24px, `--text-ui` 19.2px, h1 86px, the cabinet and the form fields with it, line heights too). It is applied on `.page` on static pages (custom properties resolve where they are declared, so the heading and text aliases are redeclared there), on the cabinet's scope classes (below) and, for the Home blocks, in `fitTextClass` and `FIT_FLOOR`. Hugo: put the same override on the page wrapper.
- **React 18px root.** The React app's root is 18px but the scale was written for 16px, so React utilities render 12.5% larger than the table. The Home page is sized by its own `--satr-fit` factor; the cabinet is corrected by scoped classes (`.satr-cabinet-scale` with a static px scale and `--spacing: 4px`, `.satr-static-scale` with `--st-*` sizes for the profile, which mirrors the expert page). The static pages are exact.
- **Contact buttons** (Write to …, Send, Connect) are 48px high at every desktop width (`satr-text.css`). Tap targets are never below 44px.
- **Form fields:** the text typed into a field is read size (`--step-read`), hints and the resting label 14px, selects and their options the same size as the inputs. From 1920px they grow with the rest (`satr-text.css`, `pages/search-field.css`).
- **Dates** are `dd.mm.yy` everywhere (lists, research, cabinet deadlines, notifications; with `, hh:mm` in notifications).
- **Amounts** are shown in USD, `~ 2 200 USD`, with non-breaking spaces (see `content-model/institution.md`).

Still open: heading-3 and card names sit on `--step-xl` and `--step-name`; the exact numbers are design decisions to confirm (`open-questions.md`, 36 and 41).
