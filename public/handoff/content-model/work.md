# work (project or publication card)

Not a page: a card inside a scientist profile, in the sections "Publications" and "Projects" (and, in the cabinet only, "Other projects"). 884 cards on the 294 mirrored profiles (publications 284 profiles, projects 101). Stored as a list in the profile's front matter (`publications`, `projects`, `other_projects`), one shape for all.

Derived from: `public/expert/*.html` (`project-card`, all 884 measured), `src/components/ProjectCard`, `src/components/Cabinet/cabinetData.ts` (`Project`, `Publication`), `format.ts` (`formatCitation`, `formatPublication`, `isUrl`, `isYear`), `validate.ts` (`publicationOk`: title, authors, journal, year, optional url).

Card layout: year (small, top, left), title (h3, 2 lines on cards), "Read" button (shown from 1400 px; the whole card is also a link, `a.absoluteLink`, opens in a new tab, `rel=nofollow`), the citation or description line, then "Role: <role>".

## Fields

| Field | R/O | Max | Type / format | Where on card | If empty | EN/UK | Derived from |
|---|---|---|---|---|---|---|---|
| `kind` | R | 1 | `publication` \| `project` (decides the section) | which section the card is in | blocks | S | cabinet has two lists |
| `year` | O for projects, R for publications | 4 digits (1900 to current year + 1) | `YYYY` | `.project-card__year` | no year line (202 of 884 cards have none; all are projects or undated items) | S | `isYear` |
| `title` | R | 270 (obs 261) | plain; keep the original language of the title | `h3.project-card__title`, clamps at 4 lines on mobile | blocks (1 card has none) | T for projects; publications keep the original | `project-card__title` |
| `authors` | R for publications | 600 | plain, as printed ("S.O. Kokhan, A.V. Tymtsunik, ... Angew. Chem. Int. Ed. 55, 14788-14792, 2016.") | start of the citation line | | S | cabinet `Publication.authors` |
| `journal` | R for publications | 200 | plain | inside the citation line | | S | |
| `pages` | O | 40 | plain | inside the citation line | | S | |
| `citation` | derived | 900 (obs 884 for the whole text line) | `authors. journal, pages, year.` built by `formatCitation`; for a project this field is `description` typed by the person | `p.project-card__text` | line omitted (0 to 1 card today) | publication: S; project description: T | `project-card__text` |
| `description` | R for projects | 900 | plain | the text line of a project | blocks | T | cabinet `Project.description` |
| `role` | R | 60 | one of a fixed list per language; mirror free text: Author (760), Co-author (18), Project manager (13), Project Leader (11), Project Participant (10), Leader (6), Performer (6), empty (18). Cabinet values for publications: `author`, `lead`, `coauthor` | `p.project-card__text` "Role: ..." | the "Role:" line is omitted (18 cards print an empty "Role:" today: bug) | T (labels from i18n) | `PublicationRole` |
| `url` | O | 500 | `https://` or `http://` URL with a dot in the host (`isUrl`) | "Read" button and the card link (new tab, `rel=nofollow`); no URL means no button and no card link | card is not clickable | S | `Project.url`, `absoluteLink` |

## States

| State | Behaviour |
|---|---|
| Normal | year, title, citation, role, Read |
| Too long | title 261 characters wraps and clamps at 4 lines; citation with 884 characters wraps with `overflow-wrap: anywhere` (long DOIs, author lists); never truncated without a way to read the rest: clamp after 6 lines with "More" toggle (**prop**) |
| Empty (required only) | project: title, description, role; no year, no Read button, card not clickable |
| Order | newest year first; undated items last |
| Count | cabinet asks for 1 to 3 key publications; the mirror has up to 6; proposed limit 10 per list |

## Disagreements between the pages

- Cards print the same shape for publications (citation in `project-card__text`) and projects (description); the cabinet stores them differently (`Publication` has seven fields, `Project` four).
- The mirror puts an author-formatted citation into one text line; the cabinet stores the parts, so the Go side should print the line from the parts and not store the line.
- Missing spaces inside author names in the mirrored text ("SóniaTroeiraHenriques", "SergiiAfonin") come from the old import; fix at migration.
