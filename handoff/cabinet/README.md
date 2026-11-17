# Scientist cabinet: handoff for the Go developers

Static HTML and CSS samples of every cabinet screen and letter. Open `index.html` (English) or `uk/index.html` (Ukrainian) for the map.

**Ukrainian is the primary language.** Scientists use the cabinet in Ukrainian; the `uk/` pages and `microcopy.uk.yaml` are the source of truth. English is a translation for the team and foreign colleagues. Both folders have the same files.

## What is here

| Path | What |
|---|---|
| `index.html`, `uk/index.html` | Map of all screens and states |
| `login*.html`, `invite*.html`, `reset-*.html`, `link-*.html`, `rate-limited.html`, `auth-states.html` | Sign-in, invitation, password reset, error states |
| `account.html`, `account-request-open.html`, `account-states.html` | Profile form, one-open-request lock, loading / empty / no access / session / error / EN mark |
| `requests.html`, `request.html`, `request-states.html` | Request list with archive, one request, all 7 statuses |
| `email/` and `email/uk/` | Six letters, each as `.html` and `.txt` |
| `microcopy.uk.yaml`, `microcopy.en.yaml`, `check-microcopy.mjs` | All texts, one flat dictionary; `node check-microcopy.mjs` verifies both files have the same keys, order and placeholders |
| `cabinet.css`, `cabinet.js` | Production styles and progressive enhancement |
| `demo.js` | Samples only: lets a reviewer click through without a server. Do not ship |

Pages link `../tokens.css` (the shared tokens file) before `cabinet.css`. `cabinet.css` has a "token bridge" at the top: every value is `var(--color-…, fallback)`, so pages render before `tokens.css` exists. The bridge already uses the real names from `tokens.css` (`--color-text`, `--color-bg`, `--color-attention`, `--font-mono`, `--radius-squircle` and so on). Note tokens.css sets `html { font-size: 112.5% }`; cabinet.css uses px so it is unaffected.

Fonts: pages use font stacks only (IBM Plex Mono, Noto Serif, IBM Plex Mono, then system). The site's font loading is not repeated here.

## Routes the samples assume

`/login`, `/login/code`, `/login/code/resend`, `/login/password`, `/invite/{token}`, `/invite/resend`, `/password/reset`, `/password/reset/{token}`, `/logout`, `/account`, `/account/requests`, `/account/requests/{id}`. Forms carry a hidden `_csrf` field.

## States matrix

### Sign in

| State | Page | Scientist sees | Actions |
|---|---|---|---|
| Email step | `login.html` | Email field, "Send the code" | Send the code; log in with a password; ask for the invitation again. No registration button, no link to any admin area |
| Code step | `login-code.html` | Masked email, 6-digit field (`autocomplete=one-time-code`) | Log in; send a new code (after 30 s); other email; use a password |
| Password step | `login-password.html` | Email + password (one form, so password managers work) | Log in; forgot password; get a code instead |
| Invitation opened | `invite.html` | Masked email, "valid 14 days, works once", new password + repeat | Save password and log in |
| Ask for invitation again | `invite-resend.html` then `invite-resend-sent.html` | Email field, then the same answer for any address | Send |
| Password reset | `reset-request.html`, `reset-sent.html`, `reset-new-password.html`, `login-notice.html` | Same pattern | Send; save new password; log in |
| Field error | `auth-states.html` #s1, #s2, #s6 | Message under the field, typed text kept, summary at top | Fix and resend |
| Wrong code / expired code | `auth-states.html` #s3, #s4 | Alert above the form | Retry; send a new code |
| Wrong password | `auth-states.html` #s5 | Generic alert, email kept | Retry; reset |
| Invitation expired (14 days) | `link-expired.html` | Explanation | Ask for a new invitation |
| Link already used | `link-used.html` | Explanation | Log in; ask for a new link; reset |
| Reset link expired | `auth-states.html` #s7 | Explanation | Ask for a new link |
| Rate limited | `rate-limited.html` | "Try again in N minutes" | Back to log in |
| Server error | `auth-states.html` #s9 | General message | Retry |

### Profile and requests

| State | Page | Scientist sees | Actions |
|---|---|---|---|
| Editing, idle | `account.html` | Form; "public profile will not change until approved"; save line idle | Save draft; Submit for review |
| Autosave saving / saved / failed | `account-states.html` #x1 | One status line, `role="status"` | Failed: press Save draft |
| One request already open | `account-request-open.html` | Fields read-only, Submit disabled, reason in text next to it | See the request |
| Loading / empty / no access / session ended / load error | `account-states.html` | See page | One button each |
| EN outdated / up to date | `account.html`, `account-states.html` #x7 | Badge next to "English version" | None (information) |
| Requests list | `requests.html` | "In progress" (0 or 1 request) and "Archive" | View |
| Draft | `request-states.html` | Badge, text | Continue editing; Submit for review; Delete the draft |
| Submitted | same | | View; Withdraw and keep editing |
| In review | same | Editing paused | View |
| Changes requested | same | Editors' comment | Edit and submit again; View |
| Approved | same | "Will appear on the site soon" | View |
| Rejected | same | Editors' comment | View; Make new changes |
| Live | same | | Open on the site; Make new changes |

Open request = Draft, Submitted, In review, Changes requested, Approved. Only Rejected and Live count as closed. While one is open the Submit button is disabled everywhere. (Changes requested is a returned draft: the scientist edits it and submits the same request again; it is not a second request.)

## Access boundaries

- A scientist sees only their own profile and their own requests. `/account` takes no id; the profile comes from the session.
- `/account/requests/{id}` for someone else's request, or an id that does not exist, returns the same 404 page (`account-states.html` #x4). Do not answer 403.
- The cabinet has no link to any admin or editors' area, in pages or letters. Letters link only to the scientist's own request (needs log in) or to the public profile.
- Name and email come from the account and are read-only in the form; the scientist changes them by writing to the team.
- Errors on sign-in never say whether an account exists. Unknown email gets the same answer, same status code and, as far as possible, the same timing as a known one.

## Progressive enhancement

Everything works as plain HTML forms with POST and redirect.

| Without JS | What `cabinet.js` adds |
|---|---|
| Server-rendered errors under fields, typed text kept (passwords never echoed) | Nothing; the server stays the source of validation (`novalidate` on forms) |
| "Save draft" button posts the form (`intent=save`) | Autosave: after 0.9 s of silence posts the same form with `intent=autosave` and `Accept: application/json`; 2xx = saved, anything else = failed. The save line switches between its four states |
| "Submit for review" posts `intent=submit` | Nothing |
| Password fields are plain | A Show / Hide button (`hidden` until JS runs) |
| Code field is one numeric input | Nothing |

Notes: "Save draft" is first in the DOM, so Enter in a text field saves rather than submits. The save line is rendered by the server in the right state after each full POST. The autosave JSON response can be empty; only the status code matters.

## Open questions for the Go developers

1. Does the invitation link get consumed on GET or on POST? We assume POST only, so mail scanners that open links do not burn it.
2. Code length and lifetime: samples say 6 digits, 10 minutes, 30 s before a new code, 15 min rate limit. Reset link 60 min. Confirm the numbers.
3. After a successful invitation or reset, is the person logged in at once? Samples go to `/account` after the invitation and to the log in page (with a notice) after a reset.
4. What does "Ask for the invitation again" send to an address that already has a password? Samples assume nothing visible changes; the letter text for that case is not written.
5. English version: samples assume editors write it and the scientist sees an "EN outdated" mark when the Ukrainian text changed later; only the Latin name is editable. Confirm, or give the scientist EN fields.
6. Can a scientist withdraw a Submitted request? Assumed yes before review starts, not In review. Is there a "Withdrawn" status?
7. Approved versus Live: assumed Approved = editors agreed, Live = published on the static site. Does the scientist need Approved as a separate step, or can the letter go straight to Live?
8. Is a draft one per scientist? Assumed yes ("Delete the draft" removes it). What happens to a draft when the account has an open request?
9. The profile form shows the pattern with a subset of fields. The full field list, validation and the photo upload follow `src/components/Cabinet/Profile.tsx`.
10. Notifications, collaboration, courses and settings from the React cabinet are not part of this handoff; the header shows only Profile, Requests, Log out.
11. Language: where is the choice stored (URL prefix `/uk/` as here, cookie, or account setting)? Letters are sent in the account language.
12. Letters: the sign-in code appears in the body, not the subject. Sender name and address, and whether to add an unsubscribe-style footer, are not set.
