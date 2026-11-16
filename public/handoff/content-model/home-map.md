# Home blocks: field to page place

The home page (`/`, `/uk`) is a deck of five blocks. Drafted in `src/sandbox/HomePageV6/` (`HomePageV6.tsx`, `homeCopy.ts`, `HomeScientistsBlock.tsx`) and `src/sandbox/HomeHeroV4Final/`. Everything an editor may change is below; anything not listed (block order, transitions, header, footer) is code.

Hero text, stories and the three lists are **not typed on the home page**: they are picked from the other content types, so a change in the story or the paper changes the home.

## 1. Hero (block 1)

| Field | Source / who edits | Max | Where on the page | If empty | EN/UK |
|---|---|---|---|---|---|
| `hero.tagline` | site config | 70 | line under the wordmark: "Centre of Excellence on Science at Risk, Ukraine" | line omitted | T |
| `hero.stories` | list of up to 9 story slugs (order = slider order); editor picks in the CMS ("featured on home") | 9 items, min 3 | slider; each slide uses the story's `title` (clamp 3 lines; font shrinks from 36 px), `excerpt` (subtitle), `hero` image (666 x 428 crop, about 1.56:1, cover) with `hero_alt`, link = story page; "Read Story" button | fewer than 3: the slider is replaced by the single newest story | T from the story |
| `hero.story_label`, `read_label`, `other_label`, `back/next` | i18n | | "Stories", "Read Story", "Other Stories", "< Previous", "Next >" | | T |

Observed: the 9 hero stories have Ukrainian titles, excerpts and alts in `homeCopy.ts` (`storiesUk`); the story pages themselves are still English-only, so the UK hero links to EN pages (decide: UK slider shows only stories that exist in UK).

## 2. Scientists and societies search (block 2)

| Field | Source | Max | Where on the page | If empty | EN/UK |
|---|---|---|---|---|---|
| `title` | i18n `scientists.title` | 60 | block heading "Find partners in Ukrainian science" | | T |
| scope switch | i18n `scientists.scope_*` | | two tabs: Scientists / Societies | | T |
| `placeholder`, `button` | i18n | 60 / 30 | search input and button per scope | | T |
| popular tags | **computed**: the 5 largest keywords (scientists: Teaching 100, Science popularization 86, Biology 57, Natural sciences 55, Biochemistry 41) and the 5 largest domains (societies: Medicine 6, Psychology 3, Ecology 3, Economics 2, Technology 2), or a hand-picked list `home.popular_tags` (slug list, 5 items) | 5 | chips with counts, each links to `/scientists?tag=<slug>` | no chips row | T labels |
| note + link | i18n | 160 / 40 | text under the search + "To the full database of scientists" / "To all scientific societies" | | T |

Observed disagreement: the counts on the home (Teaching 100, Biochemistry 41) differ from the live scientists page (Teaching 101): counts must be computed at build time, never typed.

## 3. Research (block 3)

| Field | Source | Max | Where | If empty | EN/UK |
|---|---|---|---|---|---|
| `info.title` | i18n `research.title` | 30 | heading "Research" | | T |
| `info.text` | site config `home.research_text` | 200 | intro "Formalized and organized experience of Ukrainian scientists ..." | omitted | T |
| `info.link` | i18n `research.show_all` | 40 | link to `/research` | | T |
| `papers` | the 3 newest papers by order (or a picked list `home.research` of 3 slugs) | 3 | cards: `title` (clamp 4 lines), "Author(-s): `authors`", "More details", "Download" (PDF link) | fewer than 3: show what exists | from the paper |

## 4. Infrastructure (block 4)

| Field | Source | Max | Where | If empty | EN/UK |
|---|---|---|---|---|---|
| `info.title`, `info.text`, `info.link` | i18n / site config: "Restoration of infrastructure", "Scientific infrastructure damaged during the war", "All projects" | 40 / 120 / 30 | block heading, intro, link to `/infrastructure` | | T |
| `cards` | a picked list `home.infrastructure` of 3 institution slugs | 3 | card: `full_name` or `short_name` (clamp 3 lines), "Science domain", "Required amount" `needed_uah`, "More details" | card without amount hides the amount | from the institution |

Observed: the home cards use the full legal name (e.g. "Danilevsky Institute for Endocrine Pathology Problems of the National Academy of Medical Sciences of Ukraine"), the page h1 uses the short name: choose one (proposed: short name on the card, full name in `title`).

## 5. Footer block (block 5)

Same footer as every page: "Want to help?" form, partners, implementer (`footer.*` in `../i18n/`). Editors change nothing here except the partner list in site config.

## Header and menu (every page)

| Item | Source |
|---|---|
| Menu entries (6) and their order | site config `menus.main` with `name` per language (`nav.*`) |
| Social links (X/Twitter, LinkedIn, Facebook) | site config `params.social`; the mirror's Facebook link is the bare `https://www.facebook.com`, fix |
| General inquiries e-mail | site config `params.contact_email` (shown encoded) |
| Language switch | automatic, see `../i18n/README.md` |
