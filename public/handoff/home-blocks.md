# Home page: blocks

Built by `npm run home` (`scripts/build-home.mjs`, then `scripts/build-chrome.mjs` fills the header and footer slots).
Outputs: `public/handoff/home.html` (EN, `/`), `public/handoff/uk/home.html` (UK, `/uk`). Styles: `public/handoff/home.css` on top of `tokens.css`.
No script of its own: stories Back/Next are in-page anchors over a scroll-snap row, the Scientists/Societies switch is native radios + CSS `:has()`.

| `data-block` | Source data (repo) | What the editor changes |
|---|---|---|
| (header) | `src/components/SiteHeader`, filled by chrome | Menu items, language switch, Log in: one place for the whole site, not per page |
| `hero` | `homeCopy.ts` `hero.tagline` (EN: `homeHeroEn`); wordmark is the fixed asset `assets/ui/wordmark-hero.svg` | The tagline under the wordmark (per language) |
| `stories` | `HomeHeroV4Final` `defaultHomeHeroV4FinalStories` (EN), `homeCopy.ts` `storiesUk` (UK titles, standfirsts, alt); labels `storiesLabel/readLabel/otherLabel/backLabel/nextLabel` | Which stories are featured and their order (up to 9): title, standfirst, cover image + alt, story URL. UI labels are site strings |
| `scientists` | `HomeScientistsBlock` `defaultScientistsMode`, `defaultSocietiesMode` (EN); `homeCopy.ts` `scientistsUk` | Heading, the two scope names, per scope: field placeholder, button, note + link; popular tags (label, count, URL). Counts are static numbers today: should come from the taxonomy |
| `research` | `HomePageV6` `defaultResearchV6` (EN); `homeCopy.ts` `researchUk` | Block title, text, "all studies" link; the three papers shown (title, authors, URL). The ".pdf" mark is fixed text |
| `infrastructure` | `HomePageV6` `defaultInfrastructureV6` (EN; title/text/link are the section's defaults in `InfoSection.tsx`); `homeCopy.ts` `infrastructureUk` | Block title, text, link; the three projects shown (name, required amount, URL) |
| `help` | `src/components/Footer` (`footerCopy.ts`), filled by chrome | The ask, form labels, supporters, implementer: one place for the whole site |

Each block in the HTML has a comment above it naming its content-model fields.
Page meta (title, description, og:*) is in `COPY.*.meta` in `build-home.mjs` (UK taken from `public/uk.html`).
