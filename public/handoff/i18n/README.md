# i18n: UI strings

Files: `ui.en.yaml`, `ui.uk.yaml` (Hugo `i18n/en.yaml` and `i18n/uk.yaml` once copied; rename on copy), `check-keys.rb`.
Content (profiles, stories, ...) is not here: that lives in each page's front matter (see `../content-model/`).

## Status

| | |
|---|---|
| Keys | 312 in each file; identical sets, verified by `LC_ALL=en_US.UTF-8 ruby check-keys.rb` (also checks duplicates, plural forms, `{{ .Placeholders }}`) |
| UK taken from existing repo copy (no mark) | about 200: `footerCopy.ts`, `authCopy.ts` (all of Auth), `research-i18n.json`, `homeCopy.ts`, `public/uk.html` chrome, `cabinetCopy.ts` headings, `Pagination`, `BackToTop` |
| UK written for this hand-off, marked `# DRAFT-UK` | 105 strings: a native editor must review them (the repo had no Ukrainian source for these) |
| `# TODO translate` (EN left as is) | none; every key has a UK value, but the 105 drafts are not approved copy |
| NEW strings (no existing equivalent on the static pages) | Connect / Want to help: required, name, message, captcha, rate limit (429), backend down (5xx), offline, unknown error, sending, retry; 404 and 500 pages; skip link; language fallback notice; cookies (only if the site shows a banner); "EN outdated" strings; footnotes heading; gallery/video aria |
| Not included | Cabinet screens (`src/components/Cabinet/cabinetCopy.ts`, about 1000 lines, both languages already in that file; another team owns it). Only the profile headings the public profile shares are copied here |

## Hugo usage

```go-html-template
{{ i18n "nav.scientists" }}                                  {{/* plain */}}
{{ i18n "research.shown" (dict "Count" 12 "Total" 16) }}     {{/* named placeholders: {{ .Count }} {{ .Total }} */}}
{{ i18n "scientists.count" 294 }}                            {{/* plural: an integer picks one/few/many/other */}}
{{ i18n "scientists.count" (dict "Count" 294) }}             {{/* same, as a map: the key must be exactly Count */}}
{{ i18n "profile.photo_alt" (dict "Name" .Title) }}
{{ i18n "date.long" | time.Format ... }}                     {{/* layouts, see below */}}
```

- Keys are flat, dotted (`nav.scientists`). Do not nest them in YAML: nested tables are not flattened by every Hugo version.
- Plurals: English has `one` / `other`. Ukrainian needs `one` (1, 21, 31 ...), `few` (2-4, 22-24 ...), `many` (0, 5-20, 25-30 ...), `other` (fractions). Every plural key in `ui.uk.yaml` has all four. Do not build plurals with `if eq . 1`.
- `{{ .Name }}` style placeholders must be identical in both files (the script checks).
- A missing key in Hugo renders the key name in the page: build with `--printI18nWarnings` and fail CI on any warning.
- Dates: `date.short` = `02.01.06` (stories, cards: 20.03.23). `date.long` is a Go layout; with `time.Format` Hugo prints the month name in the page language (UK genitive: "12 листопада 2026"). Check the output once for UK.
- Amounts are data, not strings: `"~ 3 478 972"` with a space as thousands separator; the currency word comes from `number.currency` (`UAH` / `грн`).
- Footer text has a line break in the source (`Want\nto help?`); the current markup puts `<br>` after "Want" on mobile only. Put the break in the template, not in the string (the key `footer.title` is one line).
- Nothing in HTML: no tags inside strings. Emphasis and links are template markup around `i18n` calls.

## Language-switch rule

1. The switcher (`ENG / УКР`, `nav.language_*`) goes to the equivalent page of the same content item: same `translationKey` (front matter) in the other language. Use `.Translations` in the template.
2. If the item has no translation in the other language, go to the section index of that language (`/uk/scientists/`, `/uk/stories/` ...), not to the home page, and show `lang.fallback_notice` on that index once (session, dismissible).
3. A section index always exists in both languages.
4. Never auto-redirect by `Accept-Language`; the switcher is the only way. (Today the mirror has `/uk/expert/<slug>` in hreflang for every profile even when it does not exist: do not copy that; emit `hreflang` only for translations that exist.)
5. Slugs are the same in both languages (see `../content-model/README.md`), so a missing translation is the only reason the target changes.
6. Alternate links in `<head>`: `hreflang="en"`, `hreflang="uk"` (only existing), `hreflang="x-default"` = EN.

## Long Ukrainian strings: checklist

Ukrainian runs about 15 to 25 percent longer than English, and words are long ("Науковці", "Інфраструктура", "Зв’язатися та допомогти"). Check each of these with the `too_long` data (see `../data/`) in UK:

- [ ] Menu items and the header: language switch and "Увійти" stay on one line from 360 px; menu panel does not scroll horizontally.
- [ ] Buttons (`help.button` "Зв’язатися та допомогти", `connect.button_named`, `research.download`): wrap or grow, never clip; a button with an icon keeps the icon aligned.
- [ ] Filter chips and result bar (`scientists.remove_filter`, `scientists.clear_all`): chips wrap to a new line; a very long speciality name ("Прикладна фізика та наноматеріали") fits at 320 px.
- [ ] Plural counts: test 1, 2, 5, 11, 21, 22, 25 in UK ("1 науковець", "2 науковці", "5 науковців", "11 науковців", "21 науковець").
- [ ] Card titles at 3 lines with ellipsis; a title with no spaces longer than the card (long surnames, hyphenated) breaks with `overflow-wrap: anywhere`.
- [ ] Hyphenation: `lang="uk"` on `<html>` (and on any block in the other language) so `hyphens: auto` and screen readers use the right rules.
- [ ] Apostrophe is U+2019 (’) in every UK string; never ' or `. Quotes are « » outside, “ ” inside.
- [ ] Error messages: two lines on a 320 px field must not push the submit button off-screen.
- [ ] Breadcrumbs: last item truncates with ellipsis, full text in `title`; the middle items do not wrap one letter per line.
- [ ] Sticky bars and the sticky download/contact button: height does not change when the label wraps.
- [ ] Tooltips (research explain texts, language tip) stay inside the screen at 320 px.
- [ ] Footer partners list: names such as "Відділ преси, освіти та культури Посольства США в Україні" wrap without overlapping the next column.
- [ ] Numbers and units: `9,88 МБ` in UK uses a comma decimal; `9.88 MB` in EN (format in the template by language, not in the string).
- [ ] Mixed-language content: names in Latin script inside a UK sentence (`Igor Komarov`) keep their own `lang="en"` only when they are phrases, not names.
- [ ] Sorting: Ukrainian collation (`Є`, `І`, `Ї`, `Ґ` sort in the alphabet): use `collate` / locale-aware sort, not byte order, for any alphabetical list (scientists A to Z if added).
