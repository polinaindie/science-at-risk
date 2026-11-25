# society (scientific society)

Public URL `/societies/<slug>` (mirror `public/society/*.html`, 37 pages, EN; the list page is `/societies`, `public/societies.html` + `societies/page-N.html`, search index `public/js/societies-index.json` with only `slug` and `domain[]`). Home block "Find partners" can switch its scope to societies.

Derived from: `public/society/*.html` (all 37 measured), `public/societies.html` (card = name, lead text, "Science domain", "More details"), `public/js/societies-filter.js`, `public/js/societies-index.json`, `public/css/pages/society.css`, `src/components/Cabinet/societies.ts` (the list a scientist picks from; each links to the society page).

Layout: header (crumbs, name h1, lead paragraph, "Keywords" chip), then two columns: main (sections) and aside (head, member count, links). No image on the page or the card.

## Fields

| Field | R/O | Max | Type / format | Where on page | If empty | EN/UK | Derived from |
|---|---|---|---|---|---|---|---|
| `slug`, `translationKey` | R | 160 | README 2 (a slug must match `societies-index.json`; one does not today) | URL | blocks | S | |
| `title` | R | 120 (obs 107) | plain, the name as the society prints it ("NGO "Ukrainian Association of Personalized Medicine"") | h1, card title, breadcrumb, `<title>` | blocks | T (cabinet has `name` and `nameUk` for the same list) | `h1`, `societies.ts` |
| `summary` (lead) | R | 700 (obs 659, median 200) | plain text, one paragraph, usually the purpose | paragraph under the h1; list-card text (clamped to 4 lines) | blocks (list card would have no text) | T | first `<p>` after `<h1>`; card `infrastructures-card__text` |
| `domains` | R | 2 (obs 1 on 35, 2 on 2) | list from the controlled domain list (27 values today; fix "History and archaeology" vs "History and archeology") | header "Keywords" chip (button, filters the list), card row "Science domain", home popular domains counts | blocks | T labels | `societies-index.json`, `Keywords` |
| `basic_info` | R | 4000 (obs 3572 for all main sections together; basic info alone about 2000) | Markdown; paragraphs, lists | `h2` "Basic information" (all 37) | blocks | T | |
| `regions` | O | 1000 | Markdown / plain | `h2` "Regions of active representation or activity" (34 of 37) | section omitted | T | |
| `projects` | O | 3000 | Markdown | `h2` "Main projects of the company" [sic, read "society"] (36) | section omitted | T | |
| `collaboration` | R | 1500 | Markdown | `h2` "Which collaboration would be the most interesting/priority?" (37) | blocks | T | |
| `donors` | O | 1500 | Markdown | `h2` "The main donors of the society" (12 of 37) | section omitted | T | |
| `head.name` | R | 60 (obs 30) | plain ("Dmytruk Igor": surname first on this page; scientists show first name first) | aside, first heading's value | blocks | T | `aside p` |
| `head.role` | R | 80 | plain, free: President (4), Head of Society (3), Contact Person (3), Chairman of the Board ... (the page heading itself carries the role, or a long phrase such as "Director of the Institute of Hydrobiology of the National Academy of Sciences of Ukraine:") | aside `h2` above the name | defaults to "Head" | T | 37 different headings |
| `head.email` | O | | e-mail, never in HTML source; script fills it in (`data-satr-email`) | aside link | omitted | S | encoded e-mail |
| `members` | O | integer (obs 260 to 3000) | integer | aside `h2` "The number of members of the society as of filling out the application" (36 of 37) + the number | block omitted | S | |
| `links` | O | 3 | list of `{kind: website|facebook|linkedin, url}`; labels "Website" 36, "Facebook" 25, "LinkedIn" 8 | aside row of links (`rel=nofollow`) | omitted | S | |
| `date` | derived | | ISO | `article:published_time` | | S | |
| `seo.description` | O | 160 | default: `summary` cut at 160 | meta, og | derived | T | none of the 37 has one |

## States

| State | Behaviour |
|---|---|
| Normal | as above |
| Too long | title wraps (h1 3 lines on desktop, list card clamps at 3 lines); long head role wraps in the aside; main text is flowing text (no limit on height) |
| Empty (required only) | title, summary, domain, basic info, collaboration, head name and role: page shows no regions/projects/donors sections, no member count, no links, no e-mail |
| List card | title, summary (clamp 4 lines), domain; whole card is the link |

## Disagreements between the pages

- Section heading "Main projects of the company" on a society page (translation slip).
- Names of the head: "Dmytruk Igor" (surname first) vs profile style "Igor Komarov".
- The heading above the head's name is the role, so 37 headings exist for 37 pages (see `head.role`); the model separates role from the structure.
- Duplicates: `tovarystvo-mikrobiolohiv-ukrainy-im-sm-vynohradskoho` and `...-tmu` describe the same society (EN titles "Serhii Vynohradskyi society of microbiologists of Ukraine" and "Society of Microbiologists of Ukraine named after S.M. Vinogradsky").
- `societies-index.json` has `ho-ukrainska-asotsiatsiia-doslidzhen-zhinochoi-istorii`, the page file is `...-uadzhi.html`.
- The list on the home block shows popular domain counts (Medicine 6, Psychology 3, Ecology 3, Economics 2, Technology 2): computed from `domains`, not typed.

## Updated 2026-11-25 (society and expert contact)

The head's e-mail link in the aside is replaced by a **button "Write to <name>"** (`button.aside__contact`, `data-popup-open="helpSociety"`) that opens the contact modal (`.expertHelp`, `css/pages/contact-modal.css`): Name, Email, Text, languages line, icon-only close. The e-mail address is still never printed; the form goes through the Forms API. The same modal serves the scientist page ("Write to …"). The button is 48px high at every desktop width. Chips (domains) use the whole column. The modal fields follow the form-field sizes in `../typography.md`.
