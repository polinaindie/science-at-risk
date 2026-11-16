# page (About and other editorial pages)

Public URL `/about` (mirror `public/about.html`; `public/contacts.html` is only a redirect to `about.html#contacts`, there is no separate Contacts page since commit 346875f). Same template family as a story: crumbs, h1, 9/12 reading column.

Derived from: `public/about.html`, `public/contacts.html`, `public/css/pages/story-text.css` (About uses the `story` page class), `public/js/satr-email.js` (encoded address), footer partners from `src/components/Footer/footerCopy.ts`.

## Fields

| Field | R/O | Max | Type / format | Where on page | If empty | EN/UK | Derived from |
|---|---|---|---|---|---|---|---|
| `slug`, `translationKey` | R | 60 | README 2 (`about`) | URL, menu | blocks | S | |
| `title` | R | 80 (obs 8: "About us") | plain | h1 `.story__main-title`, breadcrumb, `<title>` | blocks | T | `h1` |
| `body` | R | 10000 (obs about 2900) | Markdown + four shortcodes; H3 for sections ("Our mission", "Our vision", "Our team", "Contacts"); the page has no images today | reading column; first paragraph has no top margin | blocks | T | `heading--h3` x4 |
| `contacts_email` | O | | e-mail used by the "Contacts" section and the menu "For general inquiries"; stored once in site config (`params.contact_email`), encoded in HTML, filled in by script | `a[data-satr-email]` in the About "Contacts" block and in the menu panel | the block shows nothing | S | `satr-email.js` |
| `menu` | O | | `main` places the page in the primary navigation, `weight` orders it | menu panel | not in the menu | S | the menu lists Scientists, Societies, Research, Stories, Infrastructure, About |
| `show_partners` | O | bool | adds the "project is supported by / implemented by" block (shared partial, texts in i18n `footer.partner_*`) | end of the page (About mentions them in text; the footer carries them on every page) | | S | |
| `seo.description` | O | 160 | default first 160 chars of `body` | meta | derived | T | mirror: "About us ⚡ Science At Risk! - Aid to Ukrainian scientists who suffered from the war" |
| `seo.og_image` | O | | | og | `main_og.png` | S | |

Other page types that use this template: 404 (strings in `../i18n`), privacy / data protection page (**not in the drafts**; legally required for the forms and the cabinet consent: open question), cookie notice (only if the site adds one).

## States

| State | Behaviour |
|---|---|
| Normal | as above |
| Too long | long headings wrap; no limit on height; a table of contents is not built |
| Empty (required only) | title and one paragraph |
| In-page anchors | `#contacts` works because the H3 carries an `id` derived from its text (`our-team`, `contacts`); ids must stay stable in both languages: set explicitly with `{#contacts}` |

## Disagreements

- The "Contacts" menu item and page were folded into About; the home hero data (`HomeHeroV4Final.tsx`) still lists "Contacts" in its own link array.
- The text has inline `u.cdx-underline`, `&nbsp;` and `<b>` for a pseudo-heading ("Directions of work" is a bold paragraph, should be an H3), and manual numbering "1. 2. 3. 4." in paragraphs (should be an ordered list).
