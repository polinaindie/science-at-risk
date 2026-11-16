# Infrastructure page (`/infrastructure/<slug>`)

Files: `public/css/pages/infrastructure-page.css` (layout, plate, facts, gallery, coordinator), `infrastructure-help.css`
(the primary button, the coordinator card in the right column), `public/js/infrastructure-page.js` (captions, "1 / 4",
"Need updated"). These pages load the site's stylesheet from scienceatrisk.org, so everything new is in these files.

Order in the text column: short name (h1) → full name (smaller, only when it differs) → plate (amount, purpose, Contact and
help) → text → photos → facts. On a phone the block comes right under the names, the button is full width.

Per page (in the HTML, nothing to configure in code):
- `h1.infrastructure__header` = short name; `p.infra-fullname` = full name (delete it if the names are the same).
  The breadcrumb's last item = the short name; the section crumb reads "Infrastructure" (as the menu).
- `.infra-plate`: `.infra-plate__amount` (leave out when there is no sum) and `.infra-plate__purpose` (first sentence of
  "For what", up to 3 lines). The button has `data-help` and scrolls to the coordinator card.
- Facts: no "Infrastructure name" (it is the heading); Science domain as chips; Website as the link "Visit website".
- Photo captions: the `alt` of each photo (when it is not `#`). The counter is built by the script.
- "Need updated: <date>": add `data-updated="YYYY-MM-DD"` to `<div class="col-md-6 col-12 infra-contact" ...>`; nothing shows without it.
- Coordinator: photo (if any), name, role, the primary button, the e-mail second (`.infra-contact__alt`).

Open questions for the clients: the section name (menu says "Infrastructure", the list page and old crumbs said "Damaged
infrastructure"); the e-mails shown on the pages are personal gmail addresses (kushtmagazine@gmail.com appears on all 23
pages as well as the coordinators' own).
