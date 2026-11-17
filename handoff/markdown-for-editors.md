# Writing content in Markdown

The site is Hugo: every page is a `.md` file with **front matter** (the fields in `content-model/<type>.md`, examples in
`data/`) and a **body** in Markdown. Layouts, header, footer, cards and forms come from templates; editors do not write HTML.

## In the body you may use

| What | How |
|---|---|
| Headings | `##` and `###` only. The page title is the single `h1`; do not write `#`. |
| Paragraphs, **bold**, *italic*, lists, quotes (`>`) | plain Markdown |
| Links | `[text](https://…)`. Internal pages: `[text]({{< relref "…" >}})` so EN/UK links survive a move. |
| Footnotes | `text[^1]` and `[^1]: note` (Markdown footnote syntax) |
| Picture | `{{< figure src="…" alt="…" caption="…" >}}` (alt is required) |
| Several pictures | `{{< gallery >}}` with `figure` lines inside, closed by `{{< /gallery >}}` |
| Video | `{{< embed url="https://www.youtube.com/watch?v=…" title="…" >}}` |
| Pull quote | `{{< quote author="…" role="…" >}}text{{< /quote >}}` |
| Link in the site's style | `{{< link href="/research" label="All research" >}}` |
| Chip that links to a list | `{{< tag href="/scientists?tag=biology" label="Biology" >}}` (add `accent="true"` for the blue "New" style) |

Their markup is shown in `prose.html` (figure, gallery, embed, quote) and `states.html` (link, tag).

## Not allowed

- Raw HTML, inline `style`, scripts, iframes written by hand (use `embed`).
- A button in text. A button is a form control; for a download or a next step write a `link`.
- Email addresses typed in text: they are filled in by the template so they are not harvested.
- Headings used for size. Pick the level by structure.

## Two languages

One file per language: `content/en/<section>/<slug>.md` and `content/uk/<section>/<slug>.md`, with the same slug and the same `translationKey` in front matter (`content-model/README.md`).
If a UK file is missing, the EN page is not shown in the UK lists (open question 5).

## Developers

Shortcodes live in `hugo/layouts/shortcodes/` and call the partials in `hugo/layouts/partials/`.
`node scripts/verify-hugo-partials.mjs` checks that a shortcode passes every parameter its partial reads.
