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
| 26 | e-Ukraine: the files have no licence text (only the designer's name and `plan.diia.gov.ua`); the shipped file is the Light 300 cut, there is no real 400. Confirm the licence for the site and the weights. | Des |
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
| 36 | Fluid type renders 12.5% larger than the numbers in the generator (html is 18px, scale written for 16px). The hand-off follows the site. Confirm this is the intended size, or correct both. | Des |
| 37 | `cabinet/cabinet.css` has its own sizes (16px base, own buttons and fields) and is **not** the look of the React cabinet (`satr-auth.css`, Tailwind). Which is the reference for the Go cabinet? | Des + Dev |
| 38 | `satr-shape.js` leaves a plain rounded rectangle until it runs. Is a flash of the rectangle on slow connections acceptable? | Des |
| 39 | Running-text sizes differ by component (card text 15px, article 18px, profile page 16px, search field 22px). Define two body sizes (text 18, text-small 15) and map every component to one? | Des |
| 40 | Scientist profile pages run on a 16px root and the rest of the site on 18px. Bring them to 18px (changes their layout) or keep? | Des + Dev |

