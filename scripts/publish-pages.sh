#!/usr/bin/env bash
# Publish the site, the static pages and the hand-off to GitHub Pages (the gh-pages branch).
#
#   npm run publish:pages -- --dry-run        build and stage in a temporary worktree, push nothing
#   npm run publish:pages -- "Commit message"  build, commit to gh-pages and push it
#
# It refuses to run when generated files are stale (run `npm run sync`) or when the working tree has uncommitted changes,
# so what is published is exactly what is committed. It never touches the branch you are on.
set -euo pipefail
cd "$(dirname "$0")/.."

DRY=0; MSG=""
for a in "$@"; do case "$a" in --dry-run) DRY=1 ;; *) MSG="$a" ;; esac; done
MSG="${MSG:-Publish: site and hand-off from $(git rev-parse --short HEAD)}"

node scripts/sync.mjs --check
if [ -n "$(git status --porcelain)" ]; then
  echo "Uncommitted changes: commit them first so the published site matches the repository." >&2
  git status --short | head -10 >&2
  exit 1
fi

TMP="$(mktemp -d)"
trap 'git worktree remove --force "$TMP/gp" >/dev/null 2>&1 || true; git branch -D gp-pub >/dev/null 2>&1 || true; rm -rf "$TMP"' EXIT

PAGES_BASE=/science-at-risk/ ./node_modules/.bin/vite build --outDir "$TMP/build" >/dev/null
git fetch -q origin gh-pages
git branch -D gp-pub >/dev/null 2>&1 || true
git worktree add -q -b gp-pub "$TMP/gp" origin/gh-pages

cd "$TMP/gp"
rm -f assets/index-*
# --checksum: the build and the worktree can agree on size and time (index.html differs only by the asset hashes), and a skipped
# index.html points at assets that no longer exist.
rsync -a --checksum --exclude storybook --exclude handoff "$TMP/build/" ./
rsync -a --checksum --delete "$TMP/build/handoff/" handoff/
cp index.html 404.html
git add -A
if git diff --cached --quiet; then echo "Nothing to publish: gh-pages already matches."; exit 0; fi
git diff --cached --stat | tail -1
if [ "$DRY" = 1 ]; then echo "Dry run: nothing committed or pushed."; exit 0; fi
git commit -q -m "$MSG"
git push origin HEAD:gh-pages
echo "Pushed. GitHub Pages rebuilds in 1-2 minutes: https://polinaindie.github.io/science-at-risk/"
