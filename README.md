# sartr-ui

Reusable React components extracted from [scienceatrisk.org](https://scienceatrisk.org/),
documented in Storybook.

The mirror the components were read from lives next to this project, in
`../scienceatrisk.org`.

## Running

```bash
npm run storybook   # component library, port 6016
npm run dev         # the home page as a real page, port 5183
```

## How this is put together

The site is a server-rendered BEM codebase with one large stylesheet. Rather than
re-implement its visual language, this package **keeps the site's own CSS** and
wraps its markup in typed React components. So a component here is the same DOM
the site ships, with props where the site had template variables.

- `src/styles/site.css` — the site's stylesheet, copied with two changes:
  - font URLs point at `public/fonts/e-ukraine`;
  - every `paint(squircle)` declaration is dropped, and the corner shape is
    rebuilt properly instead (see below).
- `src/styles/squirclePath.ts`, `useSquircle.ts`, `SquircleShape.tsx` — the
  squircle itself.
- `src/styles/squircle.css` — clears the site's background and border on the
  elements that carry a squircle, so the shape layer is what paints them.
- `.storybook/preview-head.html` — Noto Serif and IBM Plex Mono from Google
  Fonts, exactly as the site loads them. e-Ukraine is self-hosted.
- `.storybook/preview.tsx` wraps every story in `.isDefault`, the class the site
  puts on `<html>` and scopes a number of rules under.

## Corners are squircles, not rounded rectangles

The buttons, tags and the select panel are squircles: the corner is a single
cubic bezier whose control points sit **0.1765·r** from the corner, where a
circular arc would put them at 0.4477·r. That is what keeps the curvature
continuous instead of snapping from straight edge to arc.

The ratio is not a guess. It is read off the design system's own vector
(Figma node `58:3485`, "Squircle", 150×47, r = 23.5), which exports as:

```
M0 23.5 C0 4.14775 4.14775 0 23.5 0 H126.5 C145.852 0 150 4.14775 150 23.5 …
```

`4.14775 / 23.5 = 0.1765`. `buildSquirclePath` reproduces that path to four
decimal places; rasterised at 8× and compared against the Figma vector, 2 of
451,200 samples differ, all of it antialiasing.

Against a plain `border-radius: 23.5px` rounded rect at the same size, the
squircle differs by ~236px² — 3.5% of the shape's area, concentrated entirely
in the four corners. That difference is the whole point.

The site tried to do this with `mask-image: paint(squircle)`, a CSS Paint API
worklet it never registers, so nothing drew the real shape there. Here the
path is computed in JS and applied as a `clip-path` on a layer behind the
content — no worklet, and the ring variants (`--squircle-outline`) come out of
the same path as an evenodd outer-minus-inner contour, which a CSS `border`
could never follow around these corners.

Radii and fills come straight from the site's custom properties: 60 on pills
and tags (clamped to half the height, so they read as full pills), 25 on the
select panel, smoothing 0.9 throughout.

## What is here

| Group | Components |
| --- | --- |
| Foundations | Colors, Typography |
| Atoms | Button, Tag, TextField, Loader |
| Molecules | Breadcrumbs, Pagination, Select, PopularRequests, EmptyState, Quote, FullImage, SectionIntro |
| Cards | StoryCard, ExpertCard, ListCard, SocietyCard, PublicationCard |
| Pages | HomePage |
| Sections | SiteHeader, SiteFooter, HomeHero, SearchHero, StoriesSlider, ExpertAside, ContactModal, Gallery |

Everything is re-exported from `src/index.ts`.

Component names describe what the thing shows rather than the class it carries,
where the two had drifted apart on the site: `SocietyCard` renders
`.infrastructures-card`, `PublicationCard` renders `.project-card`,
`EmptyState` renders `.nothing`, `ContactModal` renders `.help-form`.

## Section snapping

The site runs on fullpage.js: each screen settles at the top of the viewport
as you scroll. `src/styles/snap.css` does the same with CSS scroll snapping,
with no dependency — `HomePage` turns it on through its `snapScroll` prop
(default on) by putting a class on `<html>`, the scroll container.

It is off below 1024px, because that is where the site's own `.fullSection`
becomes `height: 100vh`; below it the sections are content-height and snapping
them would only fight the reader. It is also off under
`prefers-reduced-motion`, since scrolling that moves on its own is exactly what
that setting asks us not to do.

Snapping is `mandatory`, which is what gives the site's one-gesture-one-screen
feel. The catch is that every top-level section then needs a snap point of its
own: under `mandatory` a section without one cannot be rested on at all — the
scroll is pulled straight past it. Taller-than-viewport sections get a point at
their start and none inside, so the reader lands on them once and then scrolls
through normally.

## The home page

`src/pages/HomePage` assembles the page from the components above and is what
`npm run dev` serves; `homePageContent.ts` holds sample content taken from the
live site. There is a `Pages/HomePage` story too.

The live site splits its top in two — a `hero` section carrying the wordmark,
and a `search-hero` further down holding the search field and the popular
requests. The new design folds both into the first screen, so `HomeHero` stands
in for the pair and `SearchHero` does not appear on this page.

The stories row is `StoriesSlider`, the site's own Swiper section.

## Two heroes

`HomeHero` is the current first screen: the mono strapline, the `SC!ENCE AT
R!SK!` wordmark, the search on one line, popular requests, and the three
counted entry points along the bottom. Its field colour is exported as
`HOME_HERO_BG` so a header sitting over it can match.

`SearchHero` is the hero the live site still ships — one headline, the search
field, and the popular requests beside a supporting note. It is untouched and
stays exported, so pages that want the old layout keep it.

`SiteHeader` grew three props for sitting on a hero: `languages` (both
languages side by side with the active one marked, as in the design, against
the site's own single "other language" link), `background` (the site paints the
bar white; over a hero, pass the hero's colour) and `divider` (the site rules
the bar off with a 1px black line, which reads as a seam across a coloured
field). The wordmark default is now `!!!`, which is what the site actually
renders — the earlier "Science at risk" text was wrong.

## The stories slider

`StoriesSlider` is the site's `.stories` section, Swiper and all, configured
exactly as the site configures it: speed 1500, looping, one slide per view
until 1280px where it shows 1.05 so the next slide peeks in. Three things are
deliberately not copied:

- The site pins Swiper 8.4.7, which falls inside a critical prototype-pollution
  advisory (GHSA-hmx5-qpq5-p643, fixed in 12.1.2). This uses a patched release.
  The options are identical between the two; only the module import path moved.
- It also passes `calculateHeight`, which is not a Swiper option and does
  nothing, so it is left out.
- Navigation binds to each instance's own buttons by id. The site's global
  `.prev` / `.next` selectors would break the moment a page had two sliders.

`StoriesSlider.css` carries one rule worth knowing about. `.fullSection` makes
the section a flex container, which leaves Swiper's root a flex item with the
default `min-width: auto` — unable to shrink below its content. Swiper then
measures an unbounded root, sizes the slides from it, and those slide widths
become the intrinsic width in turn, so it runs away to Chromium's layout
ceiling of 16,777,216px. With the picture's `padding-top: 64%` on top of that,
the browser is asked for a box ten million pixels tall and the tab stops
responding. `min-width: 0` on the root is the fix.

## Known gaps

- `Gallery` carries the site's `.storySlider` markup but no slider behaviour;
  the attachment strip scrolls horizontally instead. `StoriesSlider` is the
  one that runs Swiper.
- The site's forms post to its own backend and use reCAPTCHA. The components
  expose `onSubmit` and render no captcha.
- Menu, select and modal open/close state is React state here; on the site it is
  jQuery toggling the same classes.
