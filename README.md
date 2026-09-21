# sartr-ui

Reusable React components extracted from [scienceatrisk.org](https://scienceatrisk.org/),
documented in Storybook.

The mirror the components were read from lives next to this project, in
`../scienceatrisk.org`.

## Running

```bash
npm run storybook
```

Storybook serves on port 6016.

## How this is put together

The site is a server-rendered BEM codebase with one large stylesheet. Rather than
re-implement its visual language, this package **keeps the site's own CSS** and
wraps its markup in typed React components. So a component here is the same DOM
the site ships, with props where the site had template variables.

- `src/styles/site.css` — the site's stylesheet, copied with two changes:
  - font URLs point at `public/fonts/e-ukraine`;
  - every `paint(squircle)` declaration is dropped. The site asks for a Houdini
    paint worklet that it never registers, so its own
    `@supports not (...)` fallback (plain `border-radius`) is what actually
    renders — those blocks are unwrapped so they always apply.
- `src/styles/overrides.css` — the few rules that the squircle removal left
  without a background. Each one says why it is there.
- `.storybook/preview-head.html` — Noto Serif and IBM Plex Mono from Google
  Fonts, exactly as the site loads them. e-Ukraine is self-hosted.
- `.storybook/preview.tsx` wraps every story in `.isDefault`, the class the site
  puts on `<html>` and scopes a number of rules under.

## What is here

| Group | Components |
| --- | --- |
| Foundations | Colors, Typography |
| Atoms | Button, Tag, TextField, Loader |
| Molecules | Breadcrumbs, Pagination, Select, PopularRequests, EmptyState, Quote, FullImage, SectionIntro |
| Cards | StoryCard, ExpertCard, ListCard, SocietyCard, PublicationCard |
| Sections | SiteHeader, SiteFooter, SearchHero, ExpertAside, ContactModal, Gallery |

Everything is re-exported from `src/index.ts`.

Component names describe what the thing shows rather than the class it carries,
where the two had drifted apart on the site: `SocietyCard` renders
`.infrastructures-card`, `PublicationCard` renders `.project-card`,
`EmptyState` renders `.nothing`, `ContactModal` renders `.help-form`.

## Known gaps

- `Gallery` carries the site's `.storySlider` markup but no slider behaviour —
  the site drives it with Swiper, which is not a dependency here. The track
  scrolls horizontally instead.
- The site's forms post to its own backend and use reCAPTCHA. The components
  expose `onSubmit` and render no captcha.
- Menu, select and modal open/close state is React state here; on the site it is
  jQuery toggling the same classes.
