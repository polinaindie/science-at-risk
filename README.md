# Science At Risk — Design System

Storybook design system for [scienceatrisk.org](https://scienceatrisk.org/), built from the [Figma UI concept](https://www.figma.com/design/6bLqIaP3qpOdbDzCaxWXrX/SAtR----UI-concept--For-client---Copy-) and the offline site mirror.

## Stack

- React + TypeScript + Vite (Storybook)
- Tailwind CSS v4
- Storybook 10

## Quick start

```bash
npm install
npm run storybook
```

Open [http://localhost:6006](http://localhost:6006).

## Scripts

| Command | Description |
|---------|-------------|
| `npm run storybook` | Dev Storybook on port 6006 |
| `npm run build-storybook` | Static build → `storybook-static/` |
| `npm run typecheck` | TypeScript check |

## Structure

```
src/
  components/     # UI components + *.stories.tsx
  tokens/         # Design tokens (typography, colors)
  styles/         # fonts.css, globals.css (@theme)
public/
  fonts/          # e-Ukraine
  assets/ui/      # Figma exports (squircles, icons)
  assets/mirror/  # Sample photos for Storybook demos
scienceatrisk.org/  # Full offline mirror of the live site
```

## Browse the site mirror locally

```bash
cd scienceatrisk.org/scienceatrisk.org
python3 -m http.server 8080
```

Then open [http://localhost:8080/](http://localhost:8080/).

## Foundations (Figma)

- **Typography** — node `292:1454`
- **Colors** — node `292:1481`
- **UI kit** — node `292:1494`

## Components from site mirror

| Component | Mirror source |
|-----------|----------------|
| Tag | `.tag`, `.tag__number`, popular requests |
| Breadcrumbs | `.breadcrumbs` |
| SearchHero | `.search-hero` + `.popular-requests` |
| PageHero | listing page heroes |
| HomeHero | `.hero` |
| ExpertCard | `.expert-card` |
| InfrastructuresCard | `.infrastructures-card` |
| PaperCard | `.paper-card` |
| StoryCard | `.story-card` |
| ListCard | `.list-card` |
| StoriesSlide | `.stories__slide` |
| Footer / HelpForm | `.footer`, `.help-form` |

## Accessibility

Target: **WCAG 2.2 AA**. Verify changes in Storybook (`npm run storybook`).
