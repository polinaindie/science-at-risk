# Content model

One file per content type. Every table row is derived from what the static pages and JSON indexes in this repo render today (the source file is cited per type). Where the repo had no rule, the row says **proposed** and the reason; limits marked `obs` are the longest value found in the real content (all 294 profiles, 37 societies, 23 infrastructure pages, 16 research papers, 72 stories), limits marked `prop` are proposed (observed maximum plus headroom). Examples: `../data/`. UI strings: `../i18n/`.

| Type | File | Where it lives on the real site | Count today |
|---|---|---|---|
| scientist (expert profile) | `scientist.md` | `/scientists/<slug>` (static mirror: `public/expert/*.html`) | 294 |
| institution (infrastructure page) | `institution.md` | `/infrastructure/<slug>` | 23 (universities, institutes, archives, museums) |
| society | `society.md` | `/societies/<slug>` (mirror: `public/society/*.html`) | 37 |
| research (white paper) | `research.md` | `/research/<slug>` | 16 |
| story (type = story, blog, news) | `story.md` | `/stories/<slug>` (mirror: `public/story/*.html`) | 72 (46 stories, 16 blogs, 10 news) |
| work (project / publication card) | `work.md` | embedded in a scientist profile, not a page | 884 cards on 294 profiles |
| page (About etc.) | `page.md` | `/about` and similar | 1 (About; Contacts redirects to About) |
| home blocks | `home-map.md` | `/` and `/uk` | 4 blocks |

Column key used in every table: `required` = R (publish is blocked without it) or O; `max` = characters, counted on the plain text; `empty` = what the page shows when the field is empty; `EN/UK` says if the field is translated (T), shared (S, same in both) or EN-only.

## 1. Languages and files

- Hugo, EN at `/`, UK at `/uk`. One content file per language per item: `content/en/<section>/<slug>.md`, `content/uk/<section>/<slug>.md`. Both files carry the same `translationKey` and the same slug.
- Ukrainian is the language the person or the editors write first (cabinet collects `nameUk` and `nameEn`); English is translated. A page can exist in one language only. Section indexes exist in both.
- No backend at page view: everything below is front matter or Markdown, built into HTML; JSON indexes for search and filters are generated at build time (`public/js/*-index.json` today are hand-made copies of this).
- Data style is described in `../data/README.md`.

## 2. Slugs

| Rule | Value | Source |
|---|---|---|
| Alphabet | lowercase Latin `a-z`, digits, `-`; no underscores, no dots | observed on all 294+ slugs |
| Scientist | `surname-firstname-patronymic`, Ukrainian National transliteration (2010: `Kyiv`, `Oleksandr`, `iu`, `ia`), double surnames joined with `-` (`kalashnyk-rybalko-myroslava-anatoliivna`) | `public/expert/*.html` |
| Society, institution | transliterated full name, abbreviation kept (`ukrainske-fizychne-tovarystvo`, `instytut-problem-bezpeky-atomnykh-elektrostantsii`) | `public/society`, `public/infrastructure` |
| Research | English title kebab-case, or transliterated Ukrainian title when the paper is Ukrainian (`doslidnytska-infrastruktura-v-umovakh-...`) | `public/js/research-index.json` |
| Story | English title kebab-case; the Ukrainian story keeps a transliterated Ukrainian slug (`ukraini-neobkhidno-rozvyvaty-...`) | `public/story` |
| Max length | 160 (**prop**; observed longest: scientist 39, society 101, institution 119, research 125, story 160). Longer slugs may be shortened at migration with a redirect from the old one |
| Same in both languages | yes; translating does not change the slug |
| Uniqueness | per section; the slug never changes after publication; a rename creates a redirect |
| Redirects | the old site used `/whitepaper/<slug>` for research (still in `og:url` of the mirrored pages) and `/expert/<slug>` for scientists: keep both as redirects |

Disagreements found: `olesiia-kulyk` and `petrova-irina-pavlivna` do not follow `surname-firstname-patronymic` and `irina` vs the page's own name "Iryna Petrova"; the society `ho-ukrainska-asotsiatsiia-doslidzhen-zhinochoi-istorii` is in `societies-index.json` but its page is `...-uadzhi.html`; two societies exist twice (`tovarystvo-mikrobiolohiv-ukrainy-im-sm-vynohradskoho` and `...-tmu`).

## 3. Long text: Markdown plus four shortcodes

Allowed in every long text field (`body`, `research_area`, `duties`, ...):

| Element | Syntax | Renders as |
|---|---|---|
| Paragraph | blank-line separated | `p.paragraph` |
| Headings | `##`, `###` only (the page title is H1; `####` and below are not used) | `h2.heading--h2`, `h3.heading--h3` |
| Emphasis | `*italic*`, `**bold**` | `<i>`, `<b>` |
| Links | `[text](https://...)`; external links get `rel="nofollow noopener"` and `target="_blank"` automatically | |
| Lists | `-` and `1.` | `ul` / `ol` |
| Footnotes | `[^1]` and `[^1]: text` | numbered `ol.footnotes` (stories only) |
| **figure** | `{{< figure src="posts/<file>" alt="..." caption="..." credit="..." >}}` | `figure.image` 57.4 percent frame (about 1.74:1), `object-fit: contain`, so any ratio shows whole |
| **gallery** | `{{< gallery >}}` with two or more `{{< figure >}}` inside `{{< /gallery >}}` | swiper slider, counter "1 / 4", caption = the slide's `caption` |
| **embed** | `{{< embed url="https://www.youtube.com/watch?v=ID" title="..." >}}` | responsive 16:9 iframe, `loading="lazy"`; allowed hosts: youtube.com, youtu.be, vimeo.com only |
| **quote** | `{{< quote name="Serhii Plokhii" role="Director of ..." >}}text{{< /quote >}}` | `section.quote` (name above, text large, role below) |

Not allowed: raw HTML (`markup.goldmark.renderer.unsafe = false`), tables, images by `![]()` (use figure), inline styles, iframes other than via embed, `&nbsp;`/`<br>`/`<u>` (the migration found `<u class="cdx-underline">` in infrastructure text, `<i>:&nbsp;</i>` in profiles, `<br>` in stories: convert to plain text; hard line break is not needed). `alt` is required on every figure (see 4); `caption` is optional; `credit` is optional (photographer).

## 4. Images

Measured on `public/storage` and `public/assets` (Pillow, n = file count).

| Use | Frame on the page | Fit | Source observed | Min size (rule) | Recommended | Max file | Notes |
|---|---|---|---|---|---|---|---|
| Scientist photo (profile left column, cards 220/260 px, cabinet) | **1:1** (`.aside__img` padding-top 100 percent; card 220x220, 260x260 from 768) | cover, radius 8 | n=291; width min 157, median 960, max 2000; ratio median 0.99, p10 0.75, min 0.45, max 1.78; 100 are exactly 1:1; 82 have shorter side under 600, 18 under 400; jpg 234, jpeg 30, png 27 | **600 x 600** (**prop**; 82 existing photos fail it) | 1000 x 1000 or larger | 10 MB (cabinet `PHOTO_MAX_BYTES`) | any ratio accepted, cropped to 1:1 around a focal point (default top third: faces); portraits 0.75 lose the top/bottom 12 percent |
| Story hero (`picture.full-image`) | box 46 percent of width (about **2.17:1**) at every width | cover | n=72; 1600x500 (3.2:1) on 39, 1920x600 on 6, 1.5 to 1.6 on the rest; width min 600 | **1600 x 740** (2.17:1) | 2400 x 1100; keep the subject inside the middle 60 percent (3.2:1 sources lose the sides) | 2 MB (3 files exceed 2 MB today) | also used as `og:image` fallback |
| Story card (`story-card__img`) | **3:2** (padding-top 67.3 percent) | cover | n=204 in `storage/lp`; ratio 1.5 on 80, 3.2 on 45, 1.9 on 43; cards in lists are mostly 600x400 | **600 x 400** | 1200 x 800 | 1 MB | the card uses the hero if no separate card image exists (today 55 of 72 stories have a separate card file, 17 reuse the hero file: rule = `card_image` optional, falls back to `hero`) |
| Image in text (`figure`) | 57.4 percent (about 1.74:1) | **contain** | n=554 `posts/attaches`; ratio 1.5 on 464, min 0.56; width min 576, median 1600; 233 webp | 1200 px wide | 1600 | 1 MB | portrait images letterbox: allowed |
| Gallery slide (story) | same as figure | contain | as above | 1200 px wide | 1600 | 1 MB | |
| Infrastructure gallery | 56 percent (about 1.79:1), cover (site CSS 78 percent overridden in `infrastructure-page.css`) | cover | n=80; 1.9:1 (1200x630) on 43, 1.5 on 13, 0.75 on 9; width min 576, median 1200 | 1200 x 670 | 1600 x 900 | 1 MB | `alt` is the visible caption |
| Coordinator photo | 96 x 96 px, 1:1, cover | cover | n=4; 400 to 1474 | 400 x 400 | 600 x 600 | 500 KB | optional |
| Research PDF | none | | n=16; 183 KB to 9.88 MB | | | 15 MB (**prop**; one is 9.88 MB) | size shown to the reader ("9.88 MB") |
| OG image | 1200 x 630 (1.9:1) | | `images/og/main_og.png` 1200x630; `logo-satr.png` is a 1360x130 strip, not an og image | 1200 x 630 | | 300 KB | see 6 |

- Formats accepted on upload: jpg, png, webp. Served as webp/avif via **imgproxy** (see below), original kept.
- **imgproxy**: not used anywhere in this repo (no reference found); the static mirror serves originals from `storage/`. **Proposed** URL scheme: `/img/<preset>/<path>` mapped to imgproxy presets: `person-card` 520x520 cover, `person-profile` 720x720 cover, `story-card` 800x533 cover, `story-hero` 2000x920 cover (and 1000x460 for mobile), `figure` 1600 wide fit, `infra` 1600x900 cover, `og` 1200x630 cover. Always serve `srcset` with 1x/2x, `loading="lazy"` except the first image of a page, explicit `width`/`height` to avoid layout shift. Focal point passed as `gravity:fp:x:y`.
- **Alt text rules** (observed state in brackets): decorative images get `alt=""`; photo of a person: the person's name ([observed: name, correct]); story hero and cards: the story title ([observed: title, acceptable but repeats the heading: prefer a description of the picture, as the home hero does: "Gravestone of Professor Volodymyr Levytskyi and Sofiia Levytska with grave candles"]); images in text: a description, never "Title №3" ([observed: `A Conversation with Maksymovych №1` on 554 images: generated, to be rewritten]); infrastructure gallery: a caption sentence ([observed: `#` on every image, so captions never show]). Alt max 125 characters (**prop**); the same text in both languages is translated.
- Missing photo: the profile shows no broken image; 3 profiles have an empty or broken `src` today (`olesiia-kulyk`, `petrova-irina-pavlivna`, `derzhypolska-liudmyla-anatoliivna` points at a `.json; charset=UTF-8` URL). Empty-state: neutral placeholder square (initials of the name on the page background), never a broken icon.
- Do not upload images with text baked in; do not use images as the only carrier of facts (alt or text must carry it).

## 5. Taxonomy and tags (source: `public/js/scientists-taxonomy.json`)

| Level | Field | Values | Notes |
|---|---|---|---|
| Field of knowledge (`fields`) | `slug`, `en`, `uk`, `count` | 20 values: natural-sciences 117, biology 75, humanities 46, social-and-behavioural-sciences 39, information-technology 25, management-and-administration 23, health-care 21, manufacturing-and-technology 17, education 16, chemical-engineering-and-bioengineering 14, culture-and-arts 13, agricultural-sciences-and-food 11, international-relations 11, mathematics-and-statistics 10, mechanical-engineering 9, journalism 7, electrical-engineering 7, law 5, electronics-automation-and-electronic-communications 3, services 3 | a scientist has 1 or more (index key `f`); counts are computed, never typed |
| Speciality (`specs`) | `slug`, `en`, `uk`, `count` | 34 in total, each belongs to one field (index key `s` = `field/spec`) e.g. `natural-sciences/chemistry`; 4 fields have none (international-relations, mechanical-engineering, journalism, law) | a scientist has 1 or more; specialities of the picked field only |
| Keyword (`keywords`, index key `g`) | free chip, EN and UK | the profile shows 0 to 13 (median 4, observed max); chips on a profile are the speciality and field names plus free words (`science-popularization`, `teaching`, `expert-consulting`) | free words come from a controlled list that editors extend; text max 40 (`obs` 71) |
| Activity (cabinet) | one of 15 | `cabinetData.ts` `activities`: pick 3 | not shown on the public profile today |
| Society domain | free string, EN | 27 distinct values in `societies-index.json` | disagreement: "History and archaeology" and "History and archeology" are both used; make it a list |
| Infrastructure domain | free chips | 26 distinct values, including "Life Science and Biomedicine" vs "Life sciences and biomedicine", lowercase "arts and humanities", one Ukrainian value | make it a controlled list, the same one as society domain (**proposed**) |
| Research theme | one of 4 | `scientists`, `collections`, `policy`, `society` (`research-index.json`, labels in `research-i18n.json`) | single primary theme per paper |
| Story type | one of 3 | `stories`, `blogs`, `news` | one per story |

Rules: tags are slugs in data, labels come from the taxonomy file by language; never type a label in a content file. A new tag is added to the taxonomy file first (EN and UK required). The taxonomy has `uk` for every entry; an entry without `uk` blocks the build.

## 6. SEO fields (every page type)

| Field | R/O | Max | What is on the mirrored pages | Rule |
|---|---|---|---|---|
| `title` (page name) | R | 70 | `<title>` = `<name> | Science At Risk!` on profiles, societies, institutions, stories; research pages have only the paper title; lists have only the section name | `<title>` = `<name> | Science At Risk!`, truncated at 60 for display |
| `description` | O (derived) | 160 | missing on all 294 profiles but one, all 23 institutions, all societies; present on 61 of 72 stories (copied from the card text) and on lists ("Stories ⚡ Science At Risk! - Aid to Ukrainian scientists who suffered from the war"); research pages carry the site-wide sentence on every paper | if empty: first 160 characters of the lead / first paragraph, never the site-wide sentence |
| `og:title` | derived | | profiles: same as title; research: constant "Science at risk" (wrong) | = title |
| `og:image` | O | 1200x630 | profiles: the photo (square: crops badly in previews); stories and research: `main_og.png` constant | if no own og image: the main photo / hero, else `main_og.png`; profile: generated card 1200x630 (name on the page colour with the photo) is **proposed** |
| `og:type` | derived | | `article` for profiles/stories/societies/institutions, `website` for research | `article` for all single pages |
| `article:published_time` | derived from `date` | | on profiles, societies, institutions, stories | keep; add `article:modified_time` from `lastmod` |
| canonical | derived | | relative (`komarov-ihor-volodymyrovych.html`) in the mirror | absolute, own language: `https://scienceatrisk.org/scientists/<slug>` and `https://scienceatrisk.org/uk/scientists/<slug>` |
| hreflang | derived | | `uk` and `en` always, even when the translation does not exist | only for existing translations, plus `x-default` = EN |
| `robots` | O | | research pages have `noindex, follow` (the mirror copied it; likely a leftover from the staging of the white papers) | index everything unless `noindex: true` is set in front matter; open question |
| `og:url` for research | | | `https://scienceatrisk.org/whitepaper/<slug>` while the page is `/research/<slug>` | use the canonical URL |
| JSON-LD | derived | | Organization on the home page only | add `Person`/`ScholarlyArticle`/`Organization` per type is **proposed**, optional |

## 7. "EN outdated" flag (scientist profile; proposed, the static pages have no such thing)

Why: the person edits the Ukrainian text in the cabinet; English is translated by the team afterwards, so the EN page can be older than the UK one.

| Item | Rule |
|---|---|
| Fields | `lastmod_uk` (date the UK text of any public field last changed, set by the cabinet when the moderator approves) and `en_reviewed` (date the EN text was last brought in line with UK, set by the translator) |
| Trigger | the badge shows on the **EN** page when `lastmod_uk` is later than `en_reviewed`, or `en_reviewed` is empty while a UK text exists. Changes to non-text fields (photo, links, order) do not trigger it |
| What shows | on the EN profile, under the name block: badge `profile.en_outdated_badge` ("English version may be out of date"), one line `profile.en_outdated_note` with the date `lastmod_uk` and a link `profile.en_outdated_link` to the UK page. The text itself stays; nothing is hidden |
| What does not show | on the UK page: nothing. No badge when a language has no page at all (then the switcher falls back, see `../i18n/README.md`) |
| Machine | `<meta name="robots">` unchanged; the badge is plain HTML (role="note"), not a modal; included in the search index text? no |
| Where else | the same two fields exist on every type, but only scientist profiles show the badge now (**open question**: stories and societies?) |
| Empty `en` | an EN page that has only names and no text is not published (the scientist appears in the UK list only) |

## 8. Dates and numbers

- `date` (publication) ISO `YYYY-MM-DD` in data; shown `DD.MM.YY` on stories (observed `20.03.23`, the mirror has dates in 2026), `H` format see `../i18n`. `lastmod` is automatic from the CMS, not typed.
- Amount (infrastructure): stored as an integer in USD (converted from UAH at 45) (`needed_usd: 500000`), shown "~ 11 100 USD" / "~ 11 100 USD" (space thousands separator, the tilde is part of the display). Today it is a string and spacing varies (`~ 11100 USD` in the facts list, `~ 11 100 USD` on the plate).
- Phone and e-mail: never in the HTML as plain text; the mirror encodes e-mails (`data-satr-email`, filled in by script; the old site used Cloudflare e-mail protection). Contact is through the form; the coordinator's address is shown only on institution pages (and note in `docs/infrastructure-page.md`: personal gmail addresses; `kushtmagazine@gmail.com` on all 23 pages).

## 9. Things the existing pages disagree on (cross-type)

1. Section name: menu "Infrastructure", list page and old crumbs "Damaged infrastructure", home "Infrastructure recovery"/"Restoration of infrastructure" (docs/infrastructure-page.md also lists it).
2. "Societies" (menu) vs "Scientific societies" (crumb on the profile and society page) vs "Scientific societies" (home chip).
3. Breadcrumb root label "Main" (all pages) vs home.
4. Story label colons: "Author:", "Photographer:", "Share with help:" keep colons; infrastructure pages dropped colons ("no colons after labels", commit feb4a00).
5. Research: the `research-index.json` title and the page `<h1>` match on all 16; `og:title` does not.
6. Story card text equals the meta description; 11 stories have neither (the card text shows empty on "Other stories" cards, which always rendered empty even where the list page has text).
