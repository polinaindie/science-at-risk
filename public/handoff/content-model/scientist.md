# scientist (expert profile)

Public URL `/scientists/<slug>` (mirror `public/expert/<slug>.html`, 294 pages, all EN). Card in lists: `expert-card` (`public/js/scientists-index.json`, 294 entries, keys `h` card HTML, `t` search text, `g` keywords, `f` fields, `s` field/spec).

Derived from: `public/expert/*.html` (all 294 measured), `public/css/pages/expert.css` and `expert-entities.css` (spec comment: name serif 36/28, post IBM Plex Mono 18, institution IBM Plex Mono 14/15, description mono 16), `public/js/expert-profile.js` (mini copy of name/post/institution under the photo, Connect tooltip with languages), `public/js/scientists-index.json`, `public/js/scientists-taxonomy.json`, and the cabinet model `src/components/Cabinet/cabinetData.ts` (`ProfileData`) plus `validate.ts` (what counts as complete).

Layout (wide screen): left column sticky: breadcrumbs, photo, links, Connect button, then the mini identity once the big one scrolled away. Right column: name, post, institution, keywords, Research field, Duties, Experience, Publications, Projects. On a phone the photo comes first, then identity, keywords, languages + Connect, sections; a sticky Connect button at the bottom.

## Fields

`R/O`: R = required to publish. `max`: obs = longest in the 294 profiles, prop = proposed. `empty` = what the page shows.

| Field (front matter) | R/O | Max | Type / format | Where on page | If empty | EN/UK | Derived from |
|---|---|---|---|---|---|---|---|
| `slug` | R | 60 | kebab-case, see README 2 | URL, card link, form `sended_from` | blocks publish | S | file names |
| `translationKey` | R | 80 | string, same in EN and UK file | language switcher | switcher falls back to section index | S | proposed (Hugo) |
| `title` (full name) | R | 80 (obs 27 EN, longest `kalashnyk-rybalko-myroslava-anatoliivna`; UK with patronymic is longer: 4 words, allow 80) | plain text; EN: Latin letters, at least first name + surname (`isLatinName`); UK: Cyrillic, with patronymic | h1 `.expert__header`, card title, breadcrumb last item (truncates), photo alt, mini copy, Connect button "Write to <first name>", `<title>` | blocks publish | T (cabinet: `nameUk`, `nameEn`) | `expert__header`, `validate.ts` |
| `photo` | R (3 profiles have none today) | file 10 MB | image path; rules README 4: square frame 1:1, min 600x600 | left column `picture.aside__img`, mobile top, card `expert-card__img`, og:image | neutral square with the initials; never a broken image | S | `aside__img`, `PHOTO_MAX_BYTES` |
| `photo_alt` | O | 125 | plain; default = `title` | `alt` | falls back to `title` | T | profile pages: alt = name |
| `photo_focus` | O | | `x% y%`, default `50% 30%` | crop of the square | centre-top | S | proposed (portraits 0.75 are cropped) |
| `post` (degree and title) | R | 200 (obs 191) | plain, one line: "Ph.D., professor" = degree and rank joined (cabinet has `degree`, `degreeOther`, `rank`) | `p.paragraph` under the name, card subtitle, mini copy | line omitted (2 profiles have none) | T | `expert-id`, cabinet `degree`+`rank` |
| `institution` | R (2 profiles have none) | 250 (obs 191) | plain, official full name; department first, then university | `p.expert__affiliation` (mono 14/15, grey), card text, mini copy | line omitted | T | `expert__affiliation` |
| `languages` | O | 8 items; each from a fixed list of language codes (`uk`, `en`, `de` ...) | list of codes; shown joined by commas in the page language ("Ukrainian, English, German"; obs 65 chars) | "Working languages" block, hover tip on the Connect button (the Connect form no longer repeats the languages, decision of 2026-11-17) | shows "Ukrainian" (decision of 2026-11-12) | S (codes), labels come from i18n/CLDR | `aside__lang-text` |
| `keywords` | O | 12 items (obs 0 to 13), each 40 chars (obs 71) | list of keyword slugs from the controlled list; labels from taxonomy, EN and UK | chips `ul.expert__tags` under the institution (no heading, `aria-label="Keywords"`), card tags (button `data-try-tag`: click filters the list) | no chip row at all | S slugs, T labels | `expert__tags`, `scientists-index.json` `g` |
| `fields` | R | 3 | list of field slugs (20 values, README 5) | not printed on the profile page; drives filters and counts; the two top fields also appear as chips | blocks publish | S | `scientists-index.json` `f`, taxonomy |
| `specialities` | R | 6 | list of `field/spec` (34 values); only specs of the chosen fields | filters, "Biology and biochemistry" chips in results | blocks publish unless every chosen field has no specs (4 fields) | S | `s` in the index, `isSectionValid('keywords')` |
| `links.orcid` | O | 100 | URL `https://orcid.org/0000-0000-0000-000X` (checked by pattern) | left column list `ul.aside__links`, label "Orcid" (249 profiles) | link omitted | S | `aside__links`, `isProfileLink` |
| `links.linkedin` | O | 200 | URL on `linkedin.com` | same list, label "Linkedin" (143) | omitted | S | |
| `links.facebook` | O | 200 | URL on `facebook.com` or `fb.com` | same list, label "Facebook" (176) | omitted | S | |
| `research_area` | R | 3000 (obs 2167, median 260) | Markdown; the first paragraph is the **lead** (larger type, `expertParagraph--lead`) | section "Research field" (all 294) | section hidden, heading with it | T | `expertParagraph--lead` |
| `duties` (cabinet "Main activity") | R | 3000 (obs 2103, median 299) | Markdown | section "Duties" (all 294) | section hidden | T | |
| `experience` | R (at least 1) | 30 rows (obs 28) | list of `{year, position, place}`, newest first; `year` is `YYYY`, `YYYY–YYYY` or empty (undated facts go last with an empty year); **position** 300 (obs 801: split the row), **place** 400 (obs 350), year 12 | section "Experience" as timeline `ul.exp-list` (`exp-year`, `exp-pos`, `exp-place`), year column width = longest year | section hidden | T (position, place); year S | `exp-list`, `ExperienceItem` |
| `expert_experience` | O | 20 rows | same as `experience` | not rendered on the mirror (cabinet has it: heading "Expert experience") | not shown | T | `ProfileData.expertExperience` |
| `publications` | R in cabinet (1 to 3 key ones), O on site | 10 (obs 1 to 6; 284 of 294 have some) | list of **work** (kind `publication`), see `work.md` | section "Publications", `project-card` per item, newest year first | section hidden (10 profiles) | T title; authors S | `projects__item`, `Publication` |
| `projects` | O | 10 (obs 1 to 3; 101 profiles) | list of **work** (kind `project`) | section "Projects" | section hidden | T | `sec:Projects`, cabinet `scienceProjects` |
| `other_projects` | O | 10 | list of **work** | not rendered on the mirror (cabinet: "Other projects") | not shown | T | `ProfileData.otherProjects` |
| `societies` | O | 10 | list of society slugs (must exist in `society`) | not rendered on the mirror; cabinet: each links to `/societies/<slug>` (**proposed** block "Scientific societies" under Experience) | not shown | S | `societies.ts` |
| `date` | derived | | ISO date of first publication | `article:published_time` | | S | `article:published_time` |
| `lastmod_uk`, `en_reviewed` | derived / O | | ISO dates | "EN outdated" badge, README 7 | no badge | S | proposed |
| `seo.description` | O | 160 | plain; default first 160 chars of `research_area` first paragraph | `<meta name=description>`, og | derived | T | missing on 293 of 294 |
| `seo.og_image` | O | | image | og:image | the photo | S | |

Never published and not part of this model: phone, e-mail (the account's), recommenders (3 scientists), consents. The Connect form sends to the e-mail in the account; the page never shows it (cabinet `ProfileData.email`, `phone`).

## Sections and order (fixed, the editor cannot reorder)

1. identity block (name, post, institution) 2. keywords 3. (phone: languages + Connect) 4. Research field 5. Duties 6. Experience 7. Publications 8. Projects. A section with no content is omitted together with its heading.

## Page states

| State | Behaviour |
|---|---|
| Normal | as above |
| Too long | name wraps, `overflow-wrap: anywhere`, never clipped; institution wraps to 3+ lines; mini copy under the photo truncates to 2 lines (aria-hidden anyway); card: name 2 lines, institution 2, description 3, tags wrap |
| Empty (required only) | name, photo, post, institution, Research field, Duties, one experience row, fields and specialities; no keywords chips, no links, no Publications/Projects sections |
| EN outdated | badge under the name block on the EN page |
| Only UK exists | EN URL absent; UK page has no hreflang=en |
| Connect form | sends `type=expert`, `expert_id`, `sended_from=<slug>` (hidden fields on the mirror), name, email, text (max 7000, counter) + captcha; messages in `../i18n/` (`connect.*`, `form.*`) |

## Disagreements between the pages

- 2 profiles have no institution, 2 have an empty degree line; 3 have no usable photo (see README 4).
- The cabinet collects publications as 1 to 3 key items; 284 mirrored profiles list up to 6.
- The mirror has no "Expert experience", "Other projects" or "Scientific societies" sections although the cabinet collects them: decide whether they publish (open question).
- Role strings in publications are free text: "Author" 760, "Co-author" 18, "Project manager" 13, "Project Leader" 11, empty "Role:" 18 (the cabinet uses three values: `author`, `lead`, `coauthor`).
