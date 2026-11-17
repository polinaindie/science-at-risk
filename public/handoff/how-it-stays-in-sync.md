# How the hand-off stays in step with the site

There is one source of truth for each thing. The hand-off never holds its own copy.

| What you change | Where | What happens in the hand-off | Your step |
|---|---|---|---|
| A colour, font role, heading size, spacing, radius | `public/css/tokens.css` | `states.html`, prose, cabinet, partials and the site all read the same file | none, it is live on reload |
| A component's look (button, link, tag, field) | `public/css/satr-components.css` | same file is linked by the hand-off | none |
| Running-text / heading rules for static pages | `public/css/satr-text.css` | linked by the static pages | none |
| Squircle | `public/js/satr-shape.js` | the hand-off loads the same script | none |
| A component's markup or its Tailwind classes | `src/components/*` | specimens in `states.html` are re-rendered from it; header/footer on the static pages too; partial check re-runs | automatic while `npm run dev` runs (about a second after saving); otherwise `npm run sync` |

## The loop

1. `npm run dev`. Edit a component or a stylesheet. The page reloads by itself.
2. If you changed the markup of a component that has a Hugo partial, the dev server prints
   `[handoff-sync] FAILED` and names the partial that no longer matches (`hugo/layouts/partials/…`). Update the partial; the next save turns it green.
3. Commit. A pre-commit hook checks that nothing generated is stale and stops the commit if it is (`npm run sync`, then commit again).
   The hook is switched on by `npm install` (`prepare` sets `core.hooksPath` to `.githooks`).
4. Publish: `npm run publish:pages -- --dry-run` to see what would go out, then `npm run publish:pages -- "message"`.
   It refuses to publish with uncommitted changes or stale generated files, so the published hand-off is exactly what is committed.

## What does not follow automatically

- `static-components.html` (cards, breadcrumbs, search, pagination, empty state, loader, Connect form) is cut out of the pages in `public/` by `scripts/build-handoff-static.mjs`, with the pages' own CSS: change the page or its CSS, run `npm run handoff`. `states.html`'s EN-outdated and 404 are proposals the live site does not have; they are drawn by hand.
- A Hugo partial: it follows a component only through the check. The check tells you when it drifts; a person fixes it.
- Nothing is pushed by saving a file. Publishing is always the command above.
