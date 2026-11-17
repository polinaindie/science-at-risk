# Hugo partials for the live components

Seven partials in `layouts/partials/`, one per live component. Each is checked against the React component it mirrors:

```bash
node scripts/verify-hugo-partials.mjs   # 20 of 20 cases must match the React markup
```

**Hugo itself has not been run on these files** (not installed here). They use only `{{ .x }}`, `{{ if }}`, `{{ else }}`,
`eq`, `range` and variables, and the check above interprets exactly that subset. A first real `hugo` build is still the
developer's first test.

## Shortcodes for Markdown content

`layouts/shortcodes/link.html` and `tag.html` wrap `satr-link` and `satr-tag` so editors can write
`{{< link href="/research" label="All research" >}}` in a `.md` file. See `../markdown-for-editors.md`. There is no button shortcode on purpose.

## Calling the partials from a template

Pass **every** parameter listed in the partial's header comment, `false`/`""` included. In Go templates `eq` on a missing key
is an error in some versions, so do not rely on a missing key meaning "default".

```go-html-template
{{ partial "satr-button.html" (dict "label" (i18n "button.more") "variant" "black" "danger" false "disabled" false) }}
{{ partial "satr-tag.html" (dict "label" . "kind" "a" "href" (printf "/scientists?tag=%s" (. | urlize)) "accent" false "off" false "count" "" "circle" false) }}
{{ partial "satr-field.html" (dict "id" "connect-name" "name" "name" "type" "" "label" (i18n "form.name") "value" "" "tone" "light" "multiline" false "disabled" false "required" true) }}
{{ partial "satr-scope-tabs.html" (dict "label" (i18n "search.in") "current" "scientists" "tabs" (slice (dict "value" "scientists" "label" (i18n "scope.scientists") "href" "/scientists") (dict "value" "societies" "label" (i18n "scope.societies") "href" "/societies"))) }}
```

## Assets the partials need (base template)

```go-html-template
<link rel="stylesheet" href="/css/tokens.css">
<link rel="stylesheet" href="/css/type-scale.css">
<style>@layer chrome, components;</style>   {{/* before the next two lines: utilities must not beat component rules */}}
<link rel="stylesheet" href="/css/satr-components.css">
<style>@import url("/css/satr-chrome.css") layer(chrome);</style>
<link rel="stylesheet" href="/css/satr-squircle.css">
<script src="/js/satr-shape.js" defer></script>
<script src="/js/satr-squircle.js" defer></script>
```

Wrap the page (or the component) in an element with class `satr-chrome`: the utility classes in `satr-chrome.css` are scoped under it.

## Single source

The partials mirror `src/components/*`. When a component changes: change it, run `npm run handoff` (specimens in
`states.html`), `node scripts/build-chrome-css.mjs` (utility CSS) and `node scripts/verify-hugo-partials.mjs`; if the last one
fails, update the partial it names.

## Known limitation (also in `open-questions.md`)

The components are written with Tailwind utility classes, so the markup carries them (`font-mono text-brand-black …`) and
the pages need `satr-chrome.css`, a compiled subset of Tailwind. It is exact and it works with Hugo, but a developer who
wants plain BEM classes would have to replace those utilities with named rules by hand.
