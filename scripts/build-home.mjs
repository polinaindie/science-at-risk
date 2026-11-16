/**
 * Renders the Home page to static files, in both languages, for the Hugo hand-off.
 *
 * The page's words, links and pictures are defined once, in
 * `src/sandbox/HomePageV6/homeCopy.ts` (Ukrainian), the English defaults beside
 * the components, and `src/sandbox/HomeHeroV4Final` (the nine stories). This
 * script reads them through Vite, and writes
 *
 *   public/handoff/home.html       English, at `/`
 *   public/handoff/uk/home.html    Ukrainian, at `/uk`
 *
 * as plain, framework-free markup: BEM classes, every word in the HTML, no
 * script of its own. The React page's deck (one block per screen, driven by the
 * wheel) is a behaviour, not content, and is left out; the blocks stand one under
 * another. The pages carry empty `satr-chrome` header and footer slots, which
 * `npm run chrome` fills, and link `public/handoff/home.css` (the page's styles)
 * and `public/handoff/tokens.css` (the shared tokens).
 *
 *   npm run home   =   node scripts/build-home.mjs && node scripts/build-chrome.mjs
 *
 * Each block is wrapped in `<section data-block="…">` with a comment naming the
 * content-model field(s) it comes from; `public/handoff/home-blocks.md` lists them.
 */
import { createServer } from 'vite';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const publicDir = path.join(root, 'public');

/** Where the site lives. Canonical, hreflang and og: addresses must be absolute. */
const ORIGIN = 'https://scienceatrisk.org';

const vite = await createServer({
  root,
  appType: 'custom',
  server: { middlewareMode: true },
  logLevel: 'error',
});

const esc = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

try {
  const [{ homeCopyUk, homeHeroEn }, hero, scientistsMod, page] = await Promise.all([
    vite.ssrLoadModule('/src/sandbox/HomePageV6/homeCopy.ts'),
    vite.ssrLoadModule('/src/sandbox/HomeHeroV4Final/index.ts'),
    vite.ssrLoadModule('/src/sandbox/HomePageV6/HomeScientistsBlock.tsx'),
    vite.ssrLoadModule('/src/sandbox/HomePageV6/HomePageV6.tsx'),
  ]);

  /* The English words the components carry as their own defaults (read from the
     modules where they are exported, written here where the component keeps
     them inside its signature). */
  const infoEn = {
    title: 'Infrastructure recovery',
    text: 'Scientific infrastructure damaged during the war',
    linkLabel: 'All projects',
    linkHref: '/infrastructures.html',
  };
  const heroEn = { ...homeHeroEn, stories: hero.defaultHomeHeroV4FinalStories };

  const COPY = {
    en: {
      lang: 'en',
      hero: heroEn,
      scientists: {
        title: 'Find partners in Ukrainian science',
        scopeLabel: 'Search in',
        popularLabel: 'Popular domains',
        modes: { scientists: scientistsMod.defaultScientistsMode, societies: scientistsMod.defaultSocietiesMode },
      },
      research: page.defaultResearchV6,
      infrastructure: { info: infoEn, cards: page.defaultInfrastructureV6.cards },
      cardLabels: { cta: 'More details', domain: 'Science Domain', amount: 'Required amount' },
      // Words that exist in no component: the page's own, written for this file.
      ui: {
        skip: 'Skip to the content',
        storiesList: 'Stories',
        pagerOf: (n, total) => `Story ${n} of ${total}`,
      },
      meta: {
        title: 'Science At Risk! — aid to Ukrainian scientists',
        description:
          'Science At Risk! — aid to Ukrainian scientists who suffered from the war. A digital platform and community of Ukrainian scientists: stories, research, damaged infrastructure and a database of experts.',
        ogLocale: 'en_US',
        ogAlt: 'uk_UA',
      },
    },
    uk: {
      lang: 'uk',
      hero: homeCopyUk.hero,
      scientists: homeCopyUk.scientists,
      research: homeCopyUk.research,
      infrastructure: homeCopyUk.infrastructure,
      cardLabels: { cta: 'Докладніше', domain: 'Галузь науки', amount: 'Потрібна сума' },
      ui: {
        // TODO translate: not in homeCopy.ts, written here (review the wording).
        skip: 'Перейти до змісту',
        storiesList: 'Історії',
        pagerOf: (n, total) => `Історія ${n} з ${total}`,
      },
      meta: {
        // From public/uk.html.
        title: 'Science At Risk! — допомога українським вченим',
        description:
          'Science At Risk! — допомога українським вченим. Цифрова платформа та спільнота українських вчених, що потерпають від воєнної агресії Росії',
        ogLocale: 'uk_UA',
        ogAlt: 'en_US',
      },
    },
  };

  /* ------------------------------------------------------------------ */

  /** A path the data gives as root-absolute ("/story/x.html", "story/x.html",
   *  "/societies?tag=x"), as an address from this page. */
  const makeUrl = (base) => (p) => {
    if (!p) return '#';
    if (/^(https?:)?\/\//.test(p) || p.startsWith('#')) return p;
    let rel = p.replace(/^\/+/, '');
    // The one address the data writes without its extension.
    rel = rel.replace(/^(societies|scientists)\?/, '$1.html?');
    return `${base}${rel}`;
  };

  const renderHero = (c, u, pageBase) => `
    <!-- content model: Home.tagline (text), the wordmark is a fixed asset -->
    <section class="home-hero" data-block="hero" aria-labelledby="home-title">
      <h1 class="home-hero__title" id="home-title">
        <img class="home-hero__wordmark" src="${u('assets/ui/wordmark-hero.svg')}" alt="Science At Risk" width="1360" height="130">
      </h1>
      <p class="home-hero__tagline">${esc(c.hero.tagline)}</p>
    </section>`;

  const renderStories = (c, u) => {
    const h = c.hero;
    const total = h.stories.length;
    const items = h.stories
      .map((s, i) => {
        const n = i + 1;
        const prev = i === 0 ? total : n - 1;
        const next = i === total - 1 ? 1 : n + 1;
        return `
        <li class="home-story" id="story-${n}" aria-label="${esc(c.ui.pagerOf(n, total))}">
          <div class="home-story__photo">
            <img class="home-story__image" src="${u(s.imageSrc)}" alt="${esc(s.imageAlt ?? '')}" width="654" height="355"${i === 0 ? ' fetchpriority="high"' : ' loading="lazy"'}>
          </div>
          <div class="home-story__copy">
            <div class="home-story__text">
              <p class="home-story__label">${esc(h.storiesLabel)}</p>
              <h2 class="home-story__title"><a class="home-story__link" href="${u(s.href)}">${esc(s.title)}</a></h2>
              ${s.description ? `<p class="home-story__description">${esc(s.description)}</p>` : ''}
              <a class="home-story__read" href="${u(s.href)}" aria-label="${esc(`${h.readLabel}: ${s.title}`)}">${esc(h.readLabel)}</a>
            </div>
            <nav class="home-story__pager" aria-label="${esc(`${h.storiesLabel}: ${c.ui.pagerOf(n, total)}`)}">
              <a class="home-story__step home-story__step--prev" href="#story-${prev}">${esc(h.backLabel)}</a>
              <a class="home-story__all" href="${u('stories.html')}">${esc(h.otherLabel)}</a>
              <a class="home-story__step home-story__step--next" href="#story-${next}">${esc(h.nextLabel)}</a>
            </nav>
          </div>
        </li>`;
      })
      .join('');
    return `
    <!-- content model: Home.featured_stories[] (story → title, standfirst, cover image + alt, url); Back / Next are in-page anchors, no script -->
    <section class="home-stories" data-block="stories" aria-label="${esc(c.ui.storiesList)}">
      <div class="home-wrapper">
        <ol class="home-stories__track">${items}
        </ol>
      </div>
    </section>`;
  };

  const renderScientists = (c, u) => {
    const s = c.scientists;
    const scopes = ['scientists', 'societies'];
    const panel = (key) => {
      const m = s.modes[key];
      return `
        <div class="home-scientists__panel" data-scope="${key}">
          <form class="home-search" role="search" action="${u(m.action)}" method="get">
            <div class="home-search__field">
              <input class="home-search__input" id="home-search-${key}" name="search" type="search" placeholder=" " autocomplete="off">
              <label class="home-search__label" for="home-search-${key}">${esc(m.placeholder)}</label>
            </div>
            <button class="home-button home-button--black" type="submit">${esc(m.buttonLabel)}</button>
          </form>
          <div class="home-scientists__foot">
            <div class="home-scientists__note">
              <p class="home-scientists__text">${esc(m.note)}</p>
              <a class="home-link" href="${u(m.noteHref)}">${esc(m.noteLinkLabel)}</a>
            </div>
            <div class="home-scientists__popular">
              <p class="home-scientists__popular-label" id="home-popular-${key}">${esc(m.popularLabel ?? s.popularLabel)}</p>
              <ul class="home-tags" aria-labelledby="home-popular-${key}">${m.tags
                .map(
                  (t) =>
                    `<li class="home-tags__item"><a class="home-tag" href="${u(t.href)}">${esc(t.label)}<span class="home-tag__count">${t.count}</span></a></li>`,
                )
                .join('')}</ul>
            </div>
          </div>
        </div>`;
    };
    return `
    <!-- content model: Home.search (title, scope labels, per scope: placeholder, button, note + link, popular tags[label, count, url]) -->
    <section class="home-scientists" data-block="scientists" aria-labelledby="home-scientists-title">
      <div class="home-wrapper">
        <h2 class="home-scientists__title" id="home-scientists-title">${esc(s.title)}</h2>
        <fieldset class="home-scope">
          <legend class="home-sr-only">${esc(s.scopeLabel)}</legend>${scopes
            .map(
              (key, i) => `
          <input class="home-scope__input" type="radio" name="scope" id="home-scope-${key}" value="${key}"${i === 0 ? ' checked' : ''}>
          <label class="home-scope__label" for="home-scope-${key}">${esc(s.modes[key].label)}</label>`,
            )
            .join('')}
        </fieldset>${scopes.map(panel).join('')}
      </div>
    </section>`;
  };

  const renderInfo = (info, u) => `
          <div class="home-info">
            <h2 class="home-info__title">${esc(info.title)}</h2>
            <p class="home-info__text">${esc(info.text)}</p>
            <a class="home-link" href="${u(info.linkHref)}">${esc(info.linkLabel)}</a>
          </div>`;

  const renderResearch = (c, u) => {
    const r = c.research;
    return `
    <!-- content model: Home.research (title, text, link) + Home.research_items[] (paper → title, authors, url, file type) -->
    <section class="home-research" data-block="research" aria-labelledby="home-research-title">
      <div class="home-wrapper">
        <div class="home-split">${renderInfo(r.info, u).replace('<h2 class="home-info__title">', '<h2 class="home-info__title" id="home-research-title">')}
          <ul class="home-list">${r.papers
            .map(
              (p) => `
            <li class="home-list__item">
              <article class="home-card home-card--paper">
                <h3 class="home-card__title"><a class="home-card__link" href="${u(p.href)}">${esc(p.title)}</a></h3>
                ${p.description ? `<p class="home-card__text">${esc(p.description)}</p>` : ''}
                <p class="home-card__meta">.pdf</p>
              </article>
            </li>`,
            )
            .join('')}
          </ul>
        </div>
      </div>
    </section>`;
  };

  const renderInfrastructure = (c, u) => {
    const i = c.infrastructure;
    const L = c.cardLabels;
    return `
    <!-- content model: Home.infrastructure (title, text, link) + Home.infrastructure_items[] (project → name, required amount, url) -->
    <section class="home-infrastructure" data-block="infrastructure" aria-labelledby="home-infrastructure-title">
      <div class="home-wrapper">
        <div class="home-split">${renderInfo(i.info, u).replace('<h2 class="home-info__title">', '<h2 class="home-info__title" id="home-infrastructure-title">')}
          <ul class="home-list">${i.cards
            .map(
              (p) => `
            <li class="home-list__item">
              <article class="home-card home-card--project">
                <h3 class="home-card__title"><a class="home-card__link" href="${u(p.href)}">${esc(p.title)}</a></h3>
                <dl class="home-card__facts">
                  <div class="home-card__fact">
                    <dt class="home-card__fact-label">${esc(p.amountLabel ?? L.amount)}</dt>
                    <dd class="home-card__fact-value">${esc(p.amount)}</dd>
                  </div>
                </dl>
              </article>
            </li>`,
            )
            .join('')}
          </ul>
        </div>
      </div>
    </section>`;
  };

  const document = (locale) => {
    const c = COPY[locale];
    const ua = locale === 'uk';
    /* English sits in public/handoff/, Ukrainian in public/handoff/uk/. */
    const base = ua ? '../../' : '../';
    const here = ua ? 'handoff/uk/home.html' : 'handoff/home.html';
    const other = ua ? 'handoff/home.html' : 'handoff/uk/home.html';
    const u = makeUrl(base);
    const canonical = `${ORIGIN}${ua ? '/uk' : '/'}`;
    const alt = `${ORIGIN}${ua ? '/' : '/uk'}`;
    const css = ua ? '../' : '';
    const ogImage = `${ORIGIN}/${hero.defaultHomeHeroV4FinalStories[0].imageSrc.replace(/^\//, '')}`;
    return `<!DOCTYPE html>
<html lang="${c.lang}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${esc(c.meta.title)}</title>
    <meta name="description" content="${esc(c.meta.description)}">
    <link rel="canonical" href="${canonical}">
    <link rel="alternate" hreflang="en" href="${ORIGIN}/">
    <link rel="alternate" hreflang="uk" href="${ORIGIN}/uk">
    <link rel="alternate" hreflang="x-default" href="${ORIGIN}/">
    <meta property="og:type" content="website">
    <meta property="og:site_name" content="Science At Risk">
    <meta property="og:title" content="${esc(c.meta.title)}">
    <meta property="og:description" content="${esc(c.meta.description)}">
    <meta property="og:url" content="${canonical}">
    <meta property="og:locale" content="${c.meta.ogLocale}">
    <meta property="og:locale:alternate" content="${c.meta.ogAlt}">
    <meta property="og:image" content="${ogImage}">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="theme-color" content="#ffffff">

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@300;400;500;700&family=Noto+Serif:wght@400;700&display=swap" rel="stylesheet">
    <link href="${base}css/normalize.css" rel="stylesheet">
    <link href="${base}css/type-scale-static.css" rel="stylesheet">
    <link href="${css}tokens.css" rel="stylesheet">
<!-- satr-chrome:head --><link rel="stylesheet" href="${base}css/satr-chrome.css"><script src="${base}js/satr-chrome.js" defer></script><!-- /satr-chrome:head -->
    <link href="${css}home.css" rel="stylesheet">
</head>
<body class="home-page">
    <a class="home-skip" href="#main">${esc(c.ui.skip)}</a>
    <!-- the language switch is in the header: its other-language link is data-satr-alt -->
    <div class="home-page__header">
        <!-- satr-chrome:header --><div class="satr-chrome satr-chrome--header" data-satr-chrome="header" data-satr-alt="${other}"><header></header></div><!-- /satr-chrome:header -->
    </div>
    <main class="home-page__main" id="main">${renderHero(c, u)}
${renderStories(c, u)}
${renderScientists(c, u)}
${renderResearch(c, u)}
${renderInfrastructure(c, u)}
    </main>
    <!-- content model: Site.footer (the ask, the form, supporters, implementer) — one block for every page, filled in by the chrome -->
    <div class="home-page__footer" data-block="help">
        <!-- satr-chrome:footer --><div class="satr-chrome satr-chrome--footer" data-satr-chrome="footer"><footer></footer></div><!-- /satr-chrome:footer -->
    </div>
</body>
</html>
`;
  };

  const written = [];
  for (const [locale, rel] of [
    ['en', 'handoff/home.html'],
    ['uk', 'handoff/uk/home.html'],
  ]) {
    const file = path.join(publicDir, rel);
    await mkdir(path.dirname(file), { recursive: true });
    await writeFile(file, document(locale));
    written.push(rel);
  }
  console.log(`${written.length} files written:\n  ${written.join('\n  ')}`);
} finally {
  await vite.close();
}
