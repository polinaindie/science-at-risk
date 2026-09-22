# Science at Risk

A rebuild of [scienceatrisk.org](https://scienceatrisk.org) — the platform for Ukrainian
scientists affected by Russia's war — as a React app with its own component library.

- **Site:** https://polinaindie.github.io/science-at-risk/
- **Storybook:** https://polinaindie.github.io/science-at-risk/storybook/

## What is here

`src/components` is the library: the site's own blocks (header, cards, slider, pagination,
squircle buttons and tags) written against the original stylesheet, so the markup and class
names match what the live site ships. Every component has a story.

`src/pages` is the site built from them — home, experts, scientific societies, stories,
research, damaged infrastructure, about and contacts, with a detail page for each kind of
record. `src/content` holds what the pages share: navigation, supporters, routes.

Two pieces are worth knowing about:

- **`SectionDeck`** reproduces the home page's one-screen-at-a-time reading. The live site
  uses fullpage.js; this is the same behaviour — the next section sliding up over the one
  you leave, 800ms — without the dependency, and it stands down below 1024px, on short
  windows and for anyone who asks for reduced motion.
- **Squircles.** The buttons and tags are drawn with an SVG clip path rather than
  `border-radius`, which is how the original gets its corner shape.

The content in `*Content.ts` files is sample data taken from the live site, enough to show
each template. It is not a feed.

## Running it

```bash
npm install
npm run dev         # the site, on http://localhost:5183
npm run storybook   # the library, on http://localhost:6016
```

`npm run build` builds the site into `dist`.

## Publishing

Both the site and Storybook live on GitHub Pages, built from the `gh-pages` branch.

To rebuild and publish by hand:

```bash
npm run deploy
```

There is also a GitHub Actions workflow that does the same on every push to `main`. It is
parked at `ci/pages.yml` rather than `.github/workflows/` because pushing a workflow file
needs a token with the `workflow` scope. To turn it on:

```bash
gh auth refresh -s workflow
mkdir -p .github/workflows && git mv ci/pages.yml .github/workflows/pages.yml
git commit -m "Build and publish on push" && git push
```
