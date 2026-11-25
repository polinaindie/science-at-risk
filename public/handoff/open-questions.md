# Open questions for developers and editors

Collected from all parts of the package. Details and the assumption made in the drawings are in the file named in the last column.
**Owner:** Dev = Go/Hugo team, Ed = editors/content, Des = design.

## Architecture and platform
| # | Question | Owner | Where |
|---|---|---|---|
| 1 | Hugo version: i18n files use flat dotted keys and `{{ .Count }}` plurals (Ukrainian one/few/many/other). Confirm. | Dev | `i18n/README.md` |
| 2 | Is imgproxy the real image pipeline? It is not referenced in the repo; the presets are proposals. | Dev | `content-model/README.md` §4 |
| 3 | Which captcha: keep Google reCAPTCHA, or a privacy-friendly one (Turnstile, altcha)? Is there a cookie banner? Form/cookie strings are written conditionally. | Dev | `states.html`, `i18n` |
| 4 | Where is the language choice stored (URL prefix only, cookie, account setting)? | Dev | `cabinet/README.md` |
| 5 | Should UK lists show English-only stories, scientists and papers with a tag, or hide them? Today the UK Home links to English-only story pages. | Dev + Ed | `content-model/home-map.md` |
| 6 | Does the Go site handle `/societies?tag=x` (used by the Home tag chips)? | Dev | `content-model/home-map.md` |
| 7 | `embed` shortcode needs ~10 lines of JS to swap the poster for a `youtube-nocookie` iframe; without JS it is a plain link. Acceptable? | Dev | `prose.html` |

## Cabinet (Go portal)
| # | Question | Where |
|---|---|---|
| 8 | Is the invitation link consumed on GET or POST? Drawn as POST only so mail scanners don't burn it. | `cabinet/README.md` |
| 9 | Are the numbers right: code 6 digits / 10 min, 30 s before a new code, 15 min rate limit, reset link 60 min, invitation 14 days single-use? | same |
| 10 | After a successful invitation, is the person logged in at once? (Assumed yes; after reset: back to login with a notice.) | same |
| 11 | What does "Ask for the invitation again" send to an address that already has a password? (The on-screen response is identical for every address.) | same |
| 12 | Can a scientist withdraw a Submitted request? Is there a "Withdrawn" status? (Assumed: withdraw only before review starts.) | same |
| 13 | Approved vs Live: assumed Approved = editors agreed, Live = published on the static site. | same |
| 14 | One draft per scientist? What happens to it while a request is open? | same |
| 15 | Letter sender name and address are not set. | `cabinet/email/` |
| 16 | The profile form drawn is a subset (photo, names, phone, degree, rank, institution, two texts, ORCID, LinkedIn). Publications, recommenders and per-field validation exist only in the React drafts. | `cabinet/README.md` |

## Content
| # | Question | Owner |
|---|---|---|
| 17 | "EN outdated": proposed rule is `lastmod_uk` newer than `en_reviewed` (needs per-profile timestamps) — scientists only? Is Ukrainian the source language of long text? Copy needs approval. | Ed + Dev |
| 18 | Publish Expert experience, Other projects and Scientific societies on the public profile? The cabinet collects them, the pages show none. | Ed |
| 19 | Photo minimum 600×600 is proposed; 82 of 291 existing photos fail. Migrate or lower the floor? | Ed |
| 20 | Research pages are `noindex, follow` in the mirror. Intended? (The requirement says the HTML page is canonical and SEO is rank #1.) | Ed + Dev |
| 21 | Do the controlled lists of science domains and keywords exist? Today domains are free strings with variants. | Ed |
| 22 | Story date format `DD.MM.YY` kept? Are the 2026 dates real? | Ed |
| 23 | Coordinator contact: a function address instead of a personal gmail (same address on all 23 infrastructure pages)? | Ed |
| 24 | Section names: menu "Infrastructure" vs list "Damaged infrastructure" vs Home "Restoration of infrastructure"; "Societies" vs "Scientific societies". Pick one each. | Des + Ed |
| 25 | Two duplicate microbiologist societies, "archaeology"/"archeology", a slug without a file (`…-uadzhi`). | Ed |

## Design and fonts
| # | Question | Owner |
|---|---|---|
| 26 | IBM Plex Mono: the files have no licence text (only the designer's name and `plan.diia.gov.ua`); the shipped file is the Light 300 cut, there is no real 400. Confirm the licence for the site and the weights. | Des |
| 27 | Noto Serif and IBM Plex Mono are not in the repo and load from Google Fonts at runtime (privacy). Self-host? Which weights are real? Both are SIL OFL upstream — not confirmed from a file here. | Des + Dev |
| 28 | Squircle: shipped as `../js/satr-shape.js` (same geometry as the React site, smoothing 0.9); without JS a plain `border-radius`. Is the no-JS fallback acceptable, or should the shape also be pre-drawn in CSS for the few fixed-size elements? | Des + Dev |
| 29 | Error colour: static pages use yellow with `!`; the React code has red `#b00020`. The package follows the static pages. | Des |
| 30 | Paragraph-link gold `#fdbe0d` is deprecated; links are black and underlined now. Confirm. | Des |
| 31 | Merge `#4a5459` / `#4d4d4d`; fix `#4a5459` on `#b5c6cd` (4.4:1, fails AA). | Des |
| 32 | `--color-ground-green` is used by no static page — meant for Infrastructure? | Des |

## Language
| # | Question | Owner |
|---|---|---|
| 33 | A native editor must read: 105 `# DRAFT-UK` keys in `i18n/ui.uk.yaml`, and all cabinet texts and letters. | Ed |
| 34 | No real Ukrainian body text exists in the repo, so the `normal` variants in `data/` are English only. | Ed |

## Added with the live-component hand-off
| # | Question | Owner |
|---|---|---|
| 35 | The live components use Tailwind utility classes, so partial markup carries them and pages need `satr-chrome.css` (compiled Tailwind subset). Accept, or rewrite the 7 components as named BEM rules? | Dev + Des |
| 36 | **Partly resolved 2026-11-25.** The static pages render the scale exactly (html 18px). The React app still renders 12.5% larger (root 18px, scale written for 16px); the cabinet and the profile are corrected by scoped classes, the Home by `--satr-fit`. Confirm the numbers in `typography.md` are the intended ones; then the React root can be fixed once instead of per scope. | Des |
| 37 | `cabinet/cabinet.css` has its own sizes (16px base, own buttons and fields) and is **not** the look of the React cabinet (`satr-auth.css`, Tailwind). Which is the reference for the Go cabinet? | Des + Dev |
| 38 | `satr-shape.js` leaves a plain rounded rectangle until it runs. Is a flash of the rectangle on slow connections acceptable? | Des |
| 39 | **Resolved 2026-11-25.** Running text now comes from one scale (reading 18 phone / 20 desktop, small 14 / 16, fixed UI text 16); every component maps to a step (`typography.md`, font audit in `docs/font-audit/`). Confirm the two body sizes. | Des |
| 40 | Scientist profile pages still run on a 16px root and the rest of the site on 18px; their sizes were moved onto the scale (reading size under headings, 16px institution and authors), the root was not changed. Bring them to 18px? | Des + Dev |
| 41 | Heading scale: h1 content 72, h1 detail 48, h2 36, h3/card 28 (numbers at desktop; from 1920px a fifth more). Card and person names went from 32 to 28 on list pages. Accept, or keep names at 32 as a separate role (`--step-name` exists, 26 to 32)? | Des |

## Added 2026-11-25
| # | Question | Owner |
|---|---|---|
| 42 | **Amounts are in USD now** (`~ 2 200 USD`, both languages). The 22 infrastructure amounts were converted once from UAH at rate 45, rounded to two significant digits. Store `needed_usd` only, or keep the UAH figure and the rate as fields and compute? Who updates the rate? Does the donor-facing text need "about" or a date for the rate? | Ed + Dev |
| 43 | Wide screens: from 1920px all type grows by a fifth (and the cabinet with it). Is 1920 the right threshold, and should 2560+ grow again? | Des |
| 44 | The right-column menu of stories and the About page is built by two small scripts from the headings. In Hugo: build it at render time from the headings (every heading needs a stable `id`, also across the two languages) and keep the scroll-spy script, or drop the scroll-spy? | Dev |
| 45 | The lead of a story (first three sentences set larger) is made by `story-lead.js`. Move to build time or a `lead` field? | Dev + Ed |
| 46 | Society and scientist contact button opens a modal that posts to the Forms API; the address is never printed. Confirm the endpoint and that the same form serves both. | Dev |
| 47 | Cabinet notifications and collaboration: sender photo shows only for scientists in the database; mutual contacts link to profiles. Which of these exist in the Go portal's data? Is the "Science at Risk does not read these messages" promise a product rule? | Dev + Ed |
| 48 | The type `story` is labelled **Feature** on the live site; the Ukrainian label and the URL (`/stories`) are unchanged. Confirm the name in both languages. | Ed |
