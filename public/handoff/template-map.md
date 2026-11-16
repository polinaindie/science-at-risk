# Map: content type → template → components

Hugo layout names are suggestions. "Reference" = the file in this package to match; component names are the BEM blocks shown in `states.html`.
Data fields: `content-model/<type>.md`. UI strings: `i18n/`.

| Content type / page | URL (EN / UK) | Hugo template | Reference | Components |
|---|---|---|---|---|
| Home | `/` · `/uk` | `layouts/index.html` | `home.html`, `uk/home.html`, `home-blocks.md` | header, hero-stories, card-story, list-scientists (+ tags), list-research, card-infrastructure, footer (Want to help) |
| About, other pages | `/about` · `/uk/about` | `layouts/_default/single.html` | prose in `prose.html`; layout from `public/about.html` (illustration) | breadcrumbs, prose, footer |
| Research list | `/research` | `layouts/research/list.html` | `states.html` (card-research, filters, pagination); `public/research.html` for content | list-research, search/tag filters, pagination |
| Research (full page) | `/research/<slug>` | `layouts/research/single.html` | `public/research/*.html` (content), `public/css/pages/research-article.css` | breadcrumbs, summary, key finding, authors, download PDF button (sticky), prose. HTML canonical, PDF is a download. |
| Scientists list + search | `/scientists`, `/scientists/page-N`, tag pages | `layouts/scientists/list.html`, `taxonomy.html` | `states.html` (card-scientist, filters, empty, many, pagination) | card-scientist, tag chips, search, pagination |
| Scientist | `/scientists/<slug>` | `layouts/scientists/single.html` | `public/expert/*.html`, spec in `public/css/pages/expert.css`; EN-outdated in `states.html` | breadcrumbs, profile header, entities (experience timeline, keywords, links), work cards, Connect form, en-outdated badge |
| Societies list / society | `/societies`, `/societies/<slug>` | `layouts/societies/*.html` | `public/societies*.html`, `public/society/*.html` (illustration) | card-society (as card-institution), pagination |
| Institution (infrastructure) list | `/infrastructure` | `layouts/infrastructure/list.html` | `states.html` (card-institution); `docs/infrastructure-page.md` | card-institution, filters |
| Institution (infrastructure) | `/infrastructure/<slug>` | `layouts/infrastructure/single.html` | `public/infrastructure/*.html`; `public/css/pages/infrastructure-page.css` | breadcrumbs, short + full name, need and coordinator block, facts list with domain tags, gallery, Contact and help button |
| Stories list (All / Stories / Blogs / News) | `/stories`, `/stories/type/<t>` | `layouts/stories/list.html` | `public/stories*.html` | type chips, card-story, pagination |
| Story | `/stories/<slug>` | `layouts/stories/single.html` | `public/story/*.html`, `public/css/pages/story-text.css`, `story-footnotes.css`; `prose.html` | breadcrumbs, prose (+4 shortcodes), footnotes, share line |
| Work card | not a page | partial `card-work.html` inside scientist | `states.html` | card-work |
| Forms (Connect, Want to help) | modal/section | partial `form-connect.html`, `form-help.html` | `states.html` (all 7 states) | text-field, captcha, button; posts to Forms API |
| Search | `/search` | `layouts/search/list.html` + static index (`public/js/*-index.json`) | `states.html` (empty/many) | search field, results, pagination |
| 404 | `/404.html` | `layouts/404.html` | `states.html` | 404 block |
| Cabinet (`/login`, `/account`, `/account/requests`) | Go portal, not Hugo | Go html/template | `cabinet/index.html` (map of 50+ screens), `cabinet/README.md` | cabinet.css on `tokens.css`; letters in `cabinet/email/` |

## Component → where it is shown

| Component | Reference (`states.html` unless noted) | Used by |
|---|---|---|
| header + nav + EN/UK switcher | yes | every page |
| footer (+ Want to help) | yes | every page |
| breadcrumbs | yes | all inner pages |
| card-scientist | yes | home, scientists list |
| card-institution | yes | home, infrastructure list, societies list |
| card-research | yes | home, research list |
| card-story | yes | home, stories list |
| card-work | yes | scientist |
| button / link | yes (5 states) | all |
| search + tag filters + pagination | yes | lists |
| text-field, form states | yes | forms, cabinet |
| en-outdated badge | yes | scientist (and cabinet account) |
| prose + shortcodes | `prose.html` | about, story, research, institution |
