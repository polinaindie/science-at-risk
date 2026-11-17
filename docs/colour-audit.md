# Colour audit — duplicates and what to merge

Measured over `public/css/tokens.css`, the static page CSS (`css/pages/*`, `satr-*.css`, `breadcrumbs.css`), the React source
(`src/**`) and the mirrored live-site stylesheet (`style.min.css`). 40 distinct hex values. Near-duplicates are those closer than
ΔE 7 (CIE76); contrast is WCAG 2.2 against the three grounds the site uses (white, blue `#b5c6cd`, yellow `#f0eebe`).

Nothing has been changed yet. This is the proposal; the order below is the order I would do it in.

## 1. Greys of secondary text — merge to `--color-grey-700` (`#4d4d4d`)

| value | where | white | blue | yellow |
|---|---|---|---|---|
| `#4d4d4d` | tokens (`--color-grey-700`), static css, React ×2 | 8.5 | **4.8** | 7.1 |
| `#4a5459` | tokens (`--color-grey-600`), expert css | 7.8 | 4.4 ✗ | 6.5 |
| `#595959` | `src/styles/globals.css` | 7.0 | 4.0 ✗ | 5.9 |
| `#6b6b6b` | `TextField.tsx`, `FieldSelect.tsx` (×4) | 5.3 | 3.0 ✗ | 4.5 |
| `#6e6e6e` | `SiteHeader.tsx` (×2) | 5.1 | 2.9 ✗ | 4.3 ✗ |
| `#717171` | `HomeHeroV4Final.tsx` | 4.9 | 2.8 ✗ | 4.1 ✗ |
| `#808080` | (was the `opacity: .5` dim; now fixed) | 3.9 ✗ | 2.2 ✗ | 3.3 ✗ |

Only `#4d4d4d` passes AA on all three grounds. Merge `#4a5459`, `#595959`, `#6b6b6b`, `#6e6e6e`, `#717171` into it. That is 6 greys → 1
for text, and it removes every remaining AA failure of this kind.

## 2. Greys of surfaces and lines

`#333333` (hover of the black button, captions), `#c8c8c8` (disabled borders), `#e8e8e8` (hover of the white button),
`#ececec` (chip off state). `#e8e8e8` and `#ececec` are one step apart: keep `#ececec`, point the white button's hover at it.
Result: text grey 1 + `#333333` + `#c8c8c8` + `#ececec`.

## 3. Blues — `#b5c6cd`, `#bccbd2`, `#e6edf0`

`#bccbd2` (expert profile ground, `--color-blue-deep`) differs from the brand blue `#b5c6cd` by a single step (black on it 12.6 vs 11.9).
The reason given in tokens.css (a point of contrast) is not worth a second blue: use `--color-blue` for the profile too.
`#e6edf0` (hovered row in the suggestions) is a tint of the same blue: keep it as the wash.

## 4. Reds — `#b00020`, `#c62828`, `#ed1d24`

`#b00020` is the token (`--color-error`); `#c62828` is a literal in `Cabinet/Profile.tsx` (×3); `#ed1d24` is only in a Storybook
illustration (`src/stories/assets/youtube.svg`, ignore). Point `Profile.tsx` at `--color-error`.

## 5. Mirror leftovers (`style.min.css`)

22 colours that belong to the old Bootstrap build of the live site (`#007bff`, `#28a745`, `#dc3545`, `#17a2b8`, `#343a40`, `#212529`,
`#6c757d` …). They are almost all unused on our pages (their classes are not in the HTML); `#343a40`/`#121416` are duplicates of
`#333`/`#000`, `#6c757d` of the muted grey. Not worth touching until the mirrored stylesheet is trimmed.

## 6. Unused

`#fdbe0d` (`--color-gold`, marked DEPRECATED) and `#37b066` (`--color-green`, "no static page uses it yet") — delete or keep on purpose.

## Result if all of the above is done

15 solid tokens → 9: black, white, `#333`, `#4d4d4d`, `#c8c8c8`, `#ececec`, blue, blue-wash, yellow; plus error red and (if kept) green.
The React source has no colour literals left: every hex in `src/` is a token.
