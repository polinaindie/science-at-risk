# Example data

One YAML file per content type (`scientist`, `institution`, `society`, `research`, `story`, `work`, `page`), each with the variants:

| Variant | Content | Use |
|---|---|---|
| `normal` | real text copied from the static page named in the `#note` (EN; the repo has no Ukrainian body text for these pages) | layout check with real data |
| `too_long` | **every** field at its maximum from `../content-model/<type>.md` (lists at maximum count), in `en` and in `uk` (long Ukrainian strings, very long hyphenated names), synthetic filler text | overflow, clamp, wrap tests |
| `empty` | only the required fields; everything optional omitted | empty states, omitted sections |
| `en_outdated` (scientist only) | `lastmod_uk` later than `en_reviewed`, plus a short UK counterpart | the "EN outdated" badge |

## Style: Hugo front matter (not `data/` files)

Each variant (`normal.en`, `too_long.uk`, ...) is the YAML **front matter** of one content file `content/<lang>/<section>/<slug>.md`; the field `body` (or the long Markdown fields) is the Markdown in the file. Why: every type here is a page with its own URL, a translation per language (`translationKey`) and Markdown text, which is what Hugo content files are for; the editor edits one file per page per language and Hugo builds lists, taxonomies and the JSON search index from them. Hugo `data/` files (YAML, no URL) are right for the things that are not pages: the taxonomy (`public/js/scientists-taxonomy.json` becomes `data/taxonomy.yaml`), the partner list, the menu, home block picks (`home.research`, `home.infrastructure`, `home.hero_stories`) and the domain list. Splitting a variant into a file: front matter = the mapping; for the long text fields keep them in the front matter as written here (the build can also move one of them to the Markdown body: `research_area` for a scientist, `body` for the others).

`#note` keys in the files are comments for developers, not fields.

## Slugs, values and what is synthetic

- Controlled values are slugs: `fields`, `specialities` (taxonomy file), `theme` (`scientists|collections|policy|society`), `type` (`story|blog|news`), `languages` (`uk`, `en`, `de` ...), `property_type` (`state-owned` ...), `domains` (the domain list does not exist yet: the slugs used here such as `life-sciences-and-biomedicine` are placeholders).
- E-mail addresses on the real pages are encoded; the examples use `@example.org` addresses. No real person's contact is invented.
- `normal` story and scientist bodies are shortened; the story's image alt texts are marked `TODO real alt` because the mirror's real alt is the generated `Title №N`.
- Image paths in `too_long` and `empty` do not exist on disk.
- A UK `normal` page is not given where no real UK text exists; the real UK strings that exist in the repo (home copy) are cited in the `#note`.

## Validate

```
LC_ALL=en_US.UTF-8 ruby validate.rb
```
Parses every `*.yaml`, requires the three variants, and checks that each `too_long` long field in en and uk reaches its limit (a count of characters, Unicode). All files parse and all limits are met at the time of writing. (Ruby is used because the machine had no PyYAML; any YAML 1.2 parser reads the files.) Sizes are large on purpose: `scientist.yaml` about 290 KB because the too-long profile has 30 experience rows and 30 works in both languages.

Regenerate: the files were produced by a script from the real pages; edit the limits in `../content-model/` first and rebuild, do not hand-edit the filler.
