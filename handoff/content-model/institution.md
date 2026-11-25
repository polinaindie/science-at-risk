# institution (infrastructure page: a university, institute, archive, museum, garden that lost research infrastructure)

Public URL `/infrastructure/<slug>` (mirror `public/infrastructure/*.html`, 23 pages, EN). List: `/infrastructure` (`public/infrastructures.html`: card = name, science domain, required amount, "More details"). Home block shows 3 cards.

Derived from: `docs/infrastructure-page.md`, `public/infrastructure/*.html` (all 23 measured), `public/css/pages/infrastructure-page.css`, `infrastructure-help.css`, `public/js/infrastructure-page.js` (captions from `alt`, "1 / 4" counter, "Need updated"), `public/infrastructures.html`, `src/sandbox/HomePageV6/HomePageV6.tsx` (home cards).

Layout: text column (left, 74 percent from 1200 px): short name h1, full name, text, photos, facts list. Right column sticky: plate (amount, purpose, "Contact and help"), help note, coordinator card, e-mail as second option. Phone: names, plate, text, photos, facts; button full width.

## Fields

| Field | R/O | Max | Type / format | Where on page | If empty | EN/UK | Derived from |
|---|---|---|---|---|---|---|---|
| `slug`, `translationKey` | R | 160 | README 2 | URL | blocks | S | |
| `short_name` | R | 60 (obs 54) | plain; the name people use ("Ecocenter", "Karazin University") | h1 `.infrastructure__header`, breadcrumb last item, list card title, home card title | blocks publish | T | `h1`; 23 pages: 9 to 54 chars |
| `full_name` | O | 160 (obs 125) | plain; legal name | `p.infra-fullname` under the h1 (smaller, mono) | line omitted; **omit also when equal to `short_name`** | T | `infra-fullname` (13 of 23 pages have it; the other 10 put the long name in h1: migrate to short+full) |
| `body` | R | 3000 (obs 2554 in the longest, median 786) | Markdown, no headings (it is one block of paragraphs); figures go to `gallery` | `p.infrastructure__text` | blocks publish (Institute of Bio-Stem Cell Rehabilitation has none today: write one) | T | `infrastructure__text` |
| `city` | R | 40 (obs 30) | plain, from a city list (Kharkiv 8, Kyiv 3, Chornobyl 2, Kherson 2 ...); "Vasylivka, Zaporizhzhia region" allowed | facts row "City" | blocks | T | `City` |
| `domains` | R | 4 items | list from the controlled domain list (shared with society domain); 26 distinct strings today with typos (README 5) | facts row "Science Domain" as blue chips (`.infra-chips`), list card, filter | blocks | T labels | `infra-chips` (1 to 6 chips) |
| `infrastructure_type` | O | 250 (obs 209) | plain, comma-separated words ("Equipment and facilities, has the status of a national treasure") | facts row "Type of infrastructure" | row omitted | T | |
| `property_type` | O | 40 | one of: State-owned (20), Communal institution (1), Self-governing organization (1); (one page says "Medicine": wrong data) | facts row "Type of property" | row omitted | T (list) | |
| `website` | O | 300 | URL | facts row "Website" as the link "Visit website" (`rel=nofollow noopener`, title = URL) | row omitted (1 page) | S | `infra-link` |
| `needed_usd` | O | integer up to 10^10 | integer, USD (obs `~ 4500000000`); `~` is shown, not stored; today a string with `~ 11100 USD` or spaced variants | plate "Needed ~ 11 100 USD" (`.infra-plate__amount`), facts row "Fundraising amount", list card "Required amount", home card | the amount line and row are omitted; the plate shows only the purpose (4 pages have no amount) | S (format by language) | `infra-plate__amount`, 19 of 23 |
| `needed_note` | O | 120 | plain, replaces the number when it cannot be given ("Cannot be determined now") | in place of the amount | | T | proposed: Kherson State University says it in the text |
| `purpose` | R | 400 (obs 946 in the longest "For what"); the plate shows the **first sentence, up to 3 lines**, so write it first | plain | plate `.infra-plate__purpose`, facts row "For what" (full) | blocks | T | `infra-plate__purpose`, `For what` |
| `gallery` | O | 12 images (obs 0 to 8) | list of `{src, alt}`; `alt` is **also the visible caption**; rules README 4 (1200 x 670 min, shown 56 percent frame, cover) | slider with Back/Next, counter "1 / 4", caption `p.infra-caption` (`aria-live=polite`) | block omitted (7 pages have none); with one image: no controls | T alt | `infra-caption`, `infrastructure__img`; all 80 images have `alt="#"` today so no caption ever shows |
| `coordinator.name` | R | 60 (obs 23) | plain | coordinator card `h2.person-card__title` | blocks (the Help button needs a recipient) | T | `person-card__title` |
| `coordinator.role` | O | 100 (obs 91) | plain ("Rector", "Coordinator") | `p.person-card__position` | omitted | T | |
| `coordinator.photo` | O | | image, 1:1, README 4 | card 96 x 96 | no photo, name only (19 of 23 have none) | S | `storage/coordinator` (4 files) |
| `coordinator.email` | R | | e-mail, **never printed in HTML source**; shown by script as "Or write by email: ..." (`infra-contact__alt`) and used by the form | `.infra-contact__alt` | blocks | S | `data-cfemail` / `data-satr-email` |
| `coordinator.phone` | O | | not published (1 page has an empty `tel:` link) | | | S | do not render |
| `updated` | O | | ISO date `YYYY-MM-DD` | "Need updated: 12 November 2026" under the help note | nothing shows | S, formatted per language | `data-updated` in `infrastructure-page.js` (set on none of the 23 pages) |
| `seo.description` | O | 160 | default: first sentence of `purpose` | meta, og | derived | T | none of the 23 has one |
| `seo.og_image` | O | | first gallery image, else `main_og.png` | og | | S | |

## States

| State | Behaviour |
|---|---|
| Normal | as above |
| Too long | `short_name` wraps (h1 2 lines on desktop 3 on phone); `full_name` 3 lines; list-card title clamps to 3 lines, full name in `title`; chips wrap; the plate purpose clamps at 3 lines (full text in the facts list); amount of 10 digits plus "UAH" must fit the plate at 320 px |
| Empty (required only) | short name, text, city, domain, purpose, coordinator name and e-mail: page shows plate with purpose only (no amount), no photos, no facts rows except City, Domain, For what |
| Help form | "Want to help?": type `coordinator`, `coordinator_id`, `sended_from=<slug>`; fields name, email, text (7000), captcha; messages in `../i18n/` (`help.*`, `form.*`) |

## Disagreements between the pages

- 13 pages have short name + full name, 10 have only a long name in h1 (docs/infrastructure-page.md says to delete `infra-fullname` when the names are equal; those 10 need a short name written).
- Amount: 19 pages have `Fundraising amount`; 4 have none; the plate has `~ 11 100 USD` (spaced) and the facts row `~ 11100 USD` (not spaced).
- Domain strings: "Life Science and Biomedicine" vs "Life sciences and biomedicine" vs "life sciences and biomedicine" vs "biomedicine"; `arts and humanities` lowercase; one Ukrainian chip (`Мистецтво та гуманітарні науки`).
- Section naming (docs/infrastructure-page.md): menu "Infrastructure"; list page "Damaged infrastructure".
- The e-mails on the pages are personal gmail addresses; `kushtmagazine@gmail.com` appears on all 23 (docs/infrastructure-page.md): use an organisation address or the form only.

## Updated 2026-11-25 (infrastructure)

- **Amount in USD.** `needed_usd` (integer) replaces `needed_uah`; shown `~ 2 200 USD` in both languages (UK too, the word is `USD`), non-breaking spaces as thousands separator. The 22 existing amounts were converted from UAH at a rate of **45** and rounded to two significant digits (100 000 UAH becomes 2 200 USD). The conversion is a one-off; the rate and the rounding rule are open question 42. Four institutions have no amount; the plate then shows no figure.
- **Plate** (`.infra-plate`): label "Needed", the amount in serif (`--step-2xl`), the purpose text at 16px (`--text-ui`); the help note at 16px. In lists the amount is read size, as the description text beside it.
- **Page.** Body at reading size, full name 16px, buttons 48px, the facts as a grid; breadcrumbs are hidden below three steps; the coordinator's e-mail line is removed from the page (the Contact and help button opens the modal). 1920px and up: type grows by a fifth.
