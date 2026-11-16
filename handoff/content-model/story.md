# story (three types: story, blog, news)

Public URL `/stories/<slug>` (mirror `public/story/*.html`, 72 pages: 46 stories, 16 blogs, 10 news). Lists: `/stories` (all), `/stories?type=...` (mirror: `stories-theme-stories.html`, `stories-theme-blogs.html`, `stories-theme-news.html`, `stories/page-N.html`). Home hero shows 9 stories as a slider.

Derived from: `public/story/*.html` (all 72 measured), `public/stories.html` + `stories/*.html` (cards), `public/css/pages/story-text.css`, `story-footnotes.css`, `stories-tags.css`, `public/js/stories-tags.js`, home hero data `src/sandbox/HomeHeroV4Final/HomeHeroV4Final.tsx` and `HomePageV6/homeCopy.ts` (Ukrainian words of the 9 hero stories).

Layout: crumbs, full-width hero image (2.17:1 box), type chip (link to the type list), h1, date, then reading column 9/12 and aside (Author, Photographer), share line with a rule, "Other stories" (3 cards).

## Fields

| Field | R/O | Max | Type / format | Where on page | If empty | EN/UK | Derived from |
|---|---|---|---|---|---|---|---|
| `slug`, `translationKey` | R | 160 | README 2 | URL, card, home hero link | blocks | S | |
| `type` | R | 1 | `story` \| `blog` \| `news` (labels Stories / Blogs / News) | `a.story__type` above the title, card label `story-card__type`, list chips with counts (All 72, Stories 46, Blogs 16, News 10) | blocks | S slug; label T | `story__type`, `stories-tags` |
| `title` | R | 170 (obs 166) | plain; typographic quotes “ ” in EN, « » in UK | h1 `.story__main-title` (48 px, scale 1 / 2.7), card title, breadcrumb (truncates), hero slide, `<title>`, alt of card image | blocks | T | |
| `date` | R | | ISO `YYYY-MM-DD`; shown `DD.MM.YY` (`20.03.23`) | `p.data` under the title, card footer | blocks | S, format per language | `p.data` |
| `excerpt` | O | 200 (obs 184) | plain, one sentence | card text `story-card__text`, home hero subtitle, `meta description`, og:description | falls back to the first 160 characters of the body; the card shows no text line (2 cards empty today; the "Other stories" cards on every story page render it empty, a bug) | T | meta description on 61 of 72; card text on 142 of 144 |
| `hero` | R | file 2 MB | image + `alt`; rules README 4: 2.17:1 frame, min 1600 x 740, cover | `picture.full-image` over the title; og:image | blocks (all 72 have one) | S file, T alt | `full-image`: 1600x500 on 39, 1920x600 on 6 ... |
| `hero_alt` | R | 125 | describe the picture (the mirror repeats the title) | `alt`, `title` | falls back to `title` | T | |
| `card_image` | O | file 1 MB | image, 3:2, min 600 x 400 | list and "Other stories" cards | uses `hero` (17 stories do; 55 have their own) | S | `story-card__img` 67.3 percent |
| `authors` | O | 3 names, each 60 (obs 32) | list of names | aside "Author:" (63 of 72) | row omitted | T (transliterated) | `storyAside__title` |
| `photographers` | O | 3 names, each 80 (obs 69) | list of names | aside "Photographer:" (54 of 72) | row omitted | T | |
| `body` | R | 30000 (obs 28977 incl. captions; 83 paragraphs, 35 images) | Markdown + four shortcodes (README 3): H2/H3 headings (17 stories use H3), bold/italic, links (31 stories), figure (60), gallery (14), embed (1 video iframe; 3 mention video), quote (12), footnotes (10) | reading column: paragraphs 18 px / 1.65 line, 20 px gaps, headings 30 / 24 px | blocks | T | `story-text.css` |
| `quote` (shortcode) | O | text 600 (obs about 560), name 60, role 120 | name above (`quote__title`), text (`quote__name` heading element, a misnomer), role below (`quote__position`) | in the body | | T | `section.quote` |
| `figure.caption` | O | 200 | plain | `figcaption.image__figcaption` (empty on every image today) | caption element omitted | T | |
| `figure.alt` | R | 125 | description, not "Title №3" | `alt` | blocks publish | T | `A Conversation with Maksymovych №1` pattern on 554 images |
| `footnotes` | O | 30 | Markdown footnote syntax | numbered list `ol.footnotes` at the end of the text (10 stories) | none | T | `story-footnotes.css` |
| `disclaimer` | O | 400 | plain, italic closing paragraph ("This report has been developed within the project supported by the Public Affairs Section of the U.S. Embassy ...") | last paragraph | none | T | put in `body` end, or a shared partial per funding programme (**proposed**) |
| `related` | derived | 3 | the 3 newest stories other than this one | "Other stories" row | hidden if fewer than 1 | S | `h2.heading--h2` "Other stories" |
| `seo.description` | O | 160 | default `excerpt` | meta, og | derived | T | |
| `seo.og_image` | O | | default `hero` | og | `main_og.png` (the mirror uses it everywhere: wrong for stories) | S | |
| `lastmod` | derived | | | `article:modified_time` | | S | |

Share line: "Share with help:" Facebook, Twitter, WhatsApp (mirror's share links are `window.open` with `href="#"`; build real share URLs with the canonical address; Telegram exists in `src/components/ShareLinks` but not on the pages).

## States

| State | Behaviour |
|---|---|
| Normal | as above |
| Too long | title wraps (h1 48 px on desktop, longest observed is 166 characters); the card title clamps at 4 lines (**prop**); the home hero slide shrinks its title font from 36 px until it fits (`HomeHeroV4Final`); breadcrumb truncates; aside names wrap |
| Empty (required only) | type, title, date, hero, body: no author/photographer aside (the column collapses, text goes 9/12 width), no excerpt (card shows title and date only), no footnotes |
| News | same template; the type chip leads to the News list |
| Without translation | the UK story list shows only stories that exist in UK; English-only stories are not listed in UK (open question: show them with a "only in English" tag) |

## Disagreements between the pages

- 11 stories have no meta description, 9 have no Author, 18 have no Photographer.
- The date is printed with a two-digit year (`12.08.26`); keep the format or move to `12.08.2026` (open question).
- The type chip text on a card equals the type of the story (checked on the "Other stories" row and the list); the type is only text in the markup, so it needs a real field.
- Images in text carry a generated alt (`Title №N`) and an empty caption.
- The Ukrainian story slug pattern is transliterated (`ukraini-neobkhidno-rozvyvaty-...`), the English ones are the title; a story in both languages needs two files with one slug.
