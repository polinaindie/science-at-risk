# Research filter

Files: `public/js/research-filter.js`, `public/css/pages/research-filter.css`,
`public/js/research-index.json` (documents + tags), `public/js/research-i18n.json` (all labels, uk/en).
Page: `public/research.html` (a `<div data-research-filter>` above the list, the script at the end).

URL: `?theme=scientists` (one theme at a time); nothing = all topics. Language: `<html lang>` .
The page is not paged any more: all documents are drawn from the JSON. `research/page-2.html` redirects to `research.html`.

## Add a document
1. Put its page in `public/research/<slug>.html` and its PDF under `public/storage/...`.
2. Add one entry to `docs` in `research-index.json`:
   `{ "slug": "<slug>", "title": "<title in its original language>", "theme": "<tag id>", "pdf": "storage/....pdf" }`
   Order in the file = order on the page.
3. Counts, the "Showing N of M" line and the card label update by themselves.

## Order and the "New" badge
The order in `research-index.json` is the order on the page: newest first, so add a new document at the top.
`"new": true` on a document gives it the blue "New" chip over its title; delete the flag when it is no longer new.
There are no dates in the data (they are internal).

## Change a document's tag
Change its `"theme"` to one of: `scientists`, `collections`, `policy`, `society`.

## Add or rename a tag
Add the id to `themes` in `research-index.json`, and its name (`themes`) and sentence (`explain`) in **both**
languages in `research-i18n.json`. Renaming = edit the text there only.
The `explain` sentence is shown as a tooltip on hover and keyboard focus; where there is no hover (`hover: none`) or under 768px it
is a line under the chips (`.research-filter__explain`) that shows the sentence of the chosen topic and is empty for "All topics".

## Go side
Same query string, same JSON; the markup and classes (`research-filter__*`, `research-card__*`) can be rendered on the server.
