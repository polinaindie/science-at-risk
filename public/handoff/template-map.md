# Map: content type → template → components

Hugo layout names are suggestions. "Reference" = the file in this package to match; the component names are the class names of the live static pages (shown in `static-components.html`: `expert-card`, `paper-card`, `story-card`, `infrastructures-card`, `breadcrumbs`, `pagination`, `nothing`, `loader`, `help-form`) and of the live components (`states.html`).
Data fields: `content-model/<type>.md`. UI strings: `i18n/`.

| Content type / page | URL (EN / UK) | Hugo template | Reference | Components |
|---|---|---|---|---|
| Home | `/` · `/uk` | `layouts/index.html` | live site root (https://polinaindie.github.io/science-at-risk/), `content-model/home-map.md` | header, hero-stories, story-card, expert-card (+ tags), paper-card, infrastructures-card, footer (Want to help) |
| About, other pages | `/about` · `/uk/about` | `layouts/_default/single.html` | prose in `prose.html`; layout from `public/about.html` (key figures, directions, team cards, in-page menu; `content-model/page.md`) | breadcrumbs, prose, stats, directions, team cards, in-page menu, footer |
| Research list | `/research` | `layouts/research/list.html` | `static-components.html` (paper-card, search block, pagination); `public/research.html` for content | paper-card, search/tag filters, pagination |
| Research (full page) | `/research/<slug>` | `layouts/research/single.html` | `public/research/*.html` (content), `public/css/pages/research-article.css` | breadcrumbs, summary, key finding, authors, download PDF button (sticky), prose. HTML canonical, PDF is a download. |
| Scientists list + search | `/scientists`, `/scientists/page-N`, tag pages | `layouts/scientists/list.html`, `taxonomy.html` | `static-components.html` (expert-card, search block, empty state, loader, pagination) | expert-card, tag chips, search, pagination |
| Scientist | `/scientists/<slug>` | `layouts/scientists/single.html` | `public/expert/*.html`, spec in `public/css/pages/expert.css`; EN-outdated is a proposal in `states.html` | breadcrumbs, profile header, entities (experience timeline, keywords, links), work cards, Connect form, en-outdated badge |
| Societies list / society | `/societies`, `/societies/<slug>` | `layouts/societies/*.html` | `public/societies*.html`, `public/society/*.html` (illustration) | infrastructures-card (society form), pagination; society page: "Write to …" button + contact modal |
| Institution (infrastructure) list | `/infrastructure` | `layouts/infrastructure/list.html` | `static-components.html` (infrastructures-card); `docs/infrastructure-page.md` | infrastructures-card, filters |
| Institution (infrastructure) | `/infrastructure/<slug>` | `layouts/infrastructure/single.html` | `public/infrastructure/*.html`; `public/css/pages/infrastructure-page.css` | breadcrumbs (from 3 steps), short + full name, plate with amount in USD, facts grid with domain tags, gallery, Contact and help button (modal) |
| Stories list (All / Stories / Blogs / News) | `/stories`, `/stories/type/<t>` | `layouts/stories/list.html` | `public/stories*.html` | type chips, story-card, pagination |
| Story | `/stories/<slug>` | `layouts/stories/single.html` | `public/story/*.html`, `public/css/pages/story-text.css`, `story-footnotes.css`; `prose.html` | breadcrumbs, lead, prose (+4 shortcodes, gallery, video), footnotes, right-column section menu (from 3 sections), share line |
| Work card | not a page | partial inside scientist | `public/expert/*.html` (work list) | as on the expert page |
| Forms (Connect, Want to help) | modal/section | partial `form-connect.html`, `form-help.html` | `static-connect.html` (Connect); footer form in `states.html` | text-field, captcha, button; posts to Forms API |
| Search | `/search` | `layouts/search/list.html` + static index (`public/js/*-index.json`) | `static-components.html` (search block, empty state) | search field, results, pagination |
| 404 | `/404.html` | `layouts/404.html` | proposal in `states.html` (not on the live site) | 404 block |
| Cabinet (`/login`, `/account`, `/account/requests`) | Go portal, not Hugo | Go html/template | `cabinet/index.html` (map of 50+ screens), `cabinet/README.md` | cabinet.css on `tokens.css`; letters in `cabinet/email/` |

## Component → where it is shown

| Component | Reference (`states.html` unless noted) | Used by |
|---|---|---|
| header + nav + EN/UK switcher | `states.html` | every page |
| footer (+ Want to help) | `states.html` | every page |
| breadcrumbs | `static-components.html` | all inner pages |
| expert-card | `static-components.html` | home, scientists list |
| infrastructures-card | `static-components.html` | home, infrastructure list, societies list |
| paper-card | `static-components.html` | home, research list |
| story-card | `static-components.html` | home, stories list |
| work list | `public/expert/*.html` | scientist |
| button / link | `states.html` (5 states) | all |
| search + tag filters + pagination | `static-components.html` | lists |
| text-field, form states | `states.html`; Connect in `static-components.html` | forms, cabinet |
| en-outdated badge | `states.html` (proposal) | scientist (and cabinet account) |
| prose + shortcodes | `prose.html` | about, story, research, institution |

## Live components as Hugo partials

`hugo/layouts/partials/`: `satr-button`, `satr-link`, `satr-tag`, `satr-tag-label`, `satr-field`, `satr-scope-tabs`,
`satr-squircle-link`. Parameters, assets and the check: `hugo/README.md`. Use them wherever the page needs a button, link,
chip/tag, floating-label field or the Scientists/Societies switch; the cards, pagination, breadcrumbs and Connect form above are plain HTML on the live static pages and are shown, cut out of those pages, in `static-components.html`.
