/* Topic filter for the Research list.

   Data:   js/research-index.json  (every document and its one primary theme: edit THERE to retag a document)
   Labels: js/research-i18n.json   (uk / en; the language is the page's <html lang>; ?lang=uk|en only for previewing the other one)
   Markup: <div data-research-filter></div> above the list  +  <script src="js/research-filter.js" data-base=""></script>

   Rules (a Go page can build the same from the same query string):
     ?theme=scientists             one theme at a time (a second value in the URL is ignored)
     no ?theme                     "All topics"
   Clicking the chosen tag un-chooses it; with nothing chosen "All topics" is active again.
   The list is drawn here from the JSON; the static cards in the page stay as the no-script fallback.
   No framework: plain DOM, so the same markup/classes can be rendered on the server. */
(function () {
    var root = document.querySelector('[data-research-filter]');
    var list = document.querySelector('.papers-hero__list');
    if (!root || !list) return;
    var script = document.currentScript;
    var base = (script && script.getAttribute('data-base')) || '';

    var params = new URLSearchParams(location.search);
    var lang = (params.get('lang') || document.documentElement.lang || 'en').slice(0, 2).toLowerCase();

    Promise.all([
        fetch(base + 'js/research-index.json', { cache: 'no-cache' }).then(function (r) { return r.json(); }),
        fetch(base + 'js/research-i18n.json', { cache: 'no-cache' }).then(function (r) { return r.json(); })
    ]).then(function (res) { init(res[0], res[1][lang] || res[1].en); })
      .catch(function () { /* data did not load: the static list stays as it is */ });

    function init(data, t) {
        var THEMES = data.themes;
        /* the file is in newest-first order, and that is the order on the page */
        var DOCS = data.docs;
        var PEOPLE = data.people || {};
        var isNew = function (d) { return d['new'] === true; };
        var chosen = readUrl();

        var esc = function (s) { var d = document.createElement('div'); d.textContent = s; return d.innerHTML; };
        var fmt = function (s, v) { return s.replace(/\{(\w+)\}/g, function (_, k) { return v[k]; }); };
        /* 2026-07-30 -> 30.07.26, the way the stories list writes a date */
        var fmtDate = function (iso) { var m = /^(\d{4})-(\d\d)-(\d\d)$/.exec(iso || ''); return m ? m[3] + '.' + m[2] + '.' + m[1].slice(2) : ''; };
        /* "A, B and C": a name that is a scientist on the site becomes a link to the profile */
        var authorsHtml = function (text) {
            return text.split(/(,\s*|\s+and\s+)/).map(function (part, i) {
                if (i % 2) return esc(part);
                var slug = PEOPLE[part.trim()];
                return slug ? '<a class="research-card__author hover hover--underline" href="' + base + 'expert/' + slug + '.html">' + esc(part) + '</a>' : esc(part);
            }).join('');
        };
        var count = function (theme) { return DOCS.filter(function (d) { return d.theme === theme; }).length; };

        /* the page is no longer paged: all documents are on it */
        document.querySelectorAll('.pagination').forEach(function (p) { p.hidden = true; });

        root.className = 'research-filter';
        root.innerHTML =
            '<div class="research-filter__tags popular-requests__wrapper" role="group" aria-label="' + esc(t.filterLabel) + '"></div>' +
            '<div class="research-filter__explain" hidden><h2 class="research-filter__explain-title"></h2><p class="research-filter__explain-text"></p></div>';
        var tagsBox = root.querySelector('.research-filter__tags');
        /* what the chosen topic covers, as a line under the chips: shown where there is no hover (phones, tablets),
           in place of the tooltip */
        var explain = root.querySelector('.research-filter__explain');
        var explainTitle = explain.querySelector('.research-filter__explain-title');
        var explainText = explain.querySelector('.research-filter__explain-text');

        list.setAttribute('role', 'region');
        list.setAttribute('aria-label', t.filterLabel);
        var status = document.createElement('p');
        status.className = 'research-filter__status sr-only'; /* announced, not shown */
        status.setAttribute('aria-live', 'polite');
        status.setAttribute('aria-atomic', 'true');
        list.parentNode.insertBefore(status, list);

        /* the site's outlined squircle (.btn--bordered, as the card buttons): black fill when chosen */
        function tag(id, label, n) {
            var b = document.createElement('button');
            b.type = 'button';
            b.className = 'research-filter__tag btn btn--bordered';
            b.setAttribute('data-theme', id);
            b.innerHTML = esc(label) + '<span class="research-filter__count">' + n + '</span>';
            if (id) { /* what the topic covers, as a tooltip on hover and keyboard focus */
                var tip = document.createElement('span');
                tip.className = 'research-filter__tip';
                tip.id = 'research-tip-' + id;
                tip.setAttribute('role', 'tooltip');
                tip.textContent = t.explain[id];
                b.setAttribute('aria-describedby', tip.id);
                b.appendChild(tip);
                /* keep the tooltip inside the screen: shift it sideways by however much it overflows */
                var place = function () {
                    tip.style.transform = '';
                    var r = tip.getBoundingClientRect(), vw = document.documentElement.clientWidth, m = 16, dx = 0;
                    if (r.right > vw - m) dx = vw - m - r.right;
                    if (r.left + dx < m) dx = m - r.left;
                    if (dx) tip.style.transform = 'translateX(' + Math.round(dx) + 'px)';
                };
                b.addEventListener('mouseenter', place);
                b.addEventListener('focus', place);
            }
            b.addEventListener('click', function () { toggle(id); });
            tagsBox.appendChild(b);
            return b;
        }
        var allBtn = tag('', t.all, DOCS.length);
        var btns = {};
        THEMES.forEach(function (id) { btns[id] = tag(id, t.themes[id], count(id)); });

        function readUrl() {
            var v = (new URLSearchParams(location.search).get('theme') || '').split(',');
            return THEMES.filter(function (id) { return v.indexOf(id) > -1; }).slice(0, 1); /* unknown values are ignored; only the first counts */
        }
        function writeUrl() {
            var p = new URLSearchParams(location.search);
            if (chosen.length) p.set('theme', chosen.join(',')); else p.delete('theme');
            var q = p.toString();
            history.replaceState(null, '', location.pathname + (q ? '?' + q : '') + location.hash);
        }
        /* one theme at a time: a click chooses it, a click on the chosen one (or on "All topics") shows everything */
        function toggle(id) {
            chosen = (id === '' || chosen[0] === id) ? [] : [id];
            writeUrl();
            render();
        }

        /* the card as the list always had it (.paper-card) */
        function card(d) {
            var href = base + 'research/' + d.slug + '.html', pdf = base + d.pdf;
            return '<div class="paper-card"><article class="paper-card__wrap"><div class="row align-items-start justify-content-between">' +
                '<div class="col-xl-6 col-md-7"><div class="paper-card__info">' +
                /* date, "New" and, on a phone, the file type at the right end of the same line; a card with no date or
                   "New" still has the line there, only for the file type, and it is hidden from tablet up */
                '<div class="research-card__meta' + (d.date || isNew(d) ? '' : ' research-card__meta--pdf-only') + '">' +
                (d.date ? '<time class="research-card__date" datetime="' + esc(d.date) + '">' + esc(fmtDate(d.date)) + '</time>' : '') +
                (isNew(d) ? '<span class="tag research-card__new">' + esc(t['new']) + '</span>' : '') +
                '<span class="research-card__pdf" aria-hidden="true">' + esc(t.pdf) + '</span>' +
                '</div>' +
                '<h2 class="paper-card__title"><span>' + esc(d.title) + '</span></h2>' +
                (d.authors ? '<p class="paper-card__text">' + esc(t.authors) + ' ' + authorsHtml(d.authors) + '</p>' : '') +
                '</div></div>' +
                '<div class="offset-xl-3 offset-md-2 col-md-3"><div class="paper-card__right"><p class="paper-card__right-text">' + esc(t.pdf) + '</p></div></div>' +
                '</div></article>' +
                '<a class="absoluteLink" href="' + href + '" aria-label="' + esc(fmt(t.detailsAria, { title: d.title })) + '"></a>' +
                '<div class="paper-card__wrap-btn d-md-flex d-none">' +
                '<div class="paper-card__btn btn btn--bordered"><a href="' + href + '" class="paper-card__link-btn">' + esc(t.details) + '</a></div>' +
                '<div class="paper-card__btn btn btn--black position-relative">' + esc(t.download) +
                '<a class="absoluteLink" href="' + pdf + '" target="_blank" rel="noopener" aria-label="' + esc(fmt(t.pdfAria, { title: d.title })) + '"></a></div>' +
                '</div></div>';
        }

        /* In the sideways row on a phone the chosen chip is always in view: on the way in (a link with ?theme=) as well as
           when it is chosen. Only the row moves, never the page; the chip is brought in with the gutter beside it. */
        var started = false;
        function showChosen(smooth) {
            var on = tagsBox.querySelector('[aria-pressed="true"]');
            if (!on || tagsBox.scrollWidth <= tagsBox.clientWidth) return;
            var box = tagsBox.getBoundingClientRect(), r = on.getBoundingClientRect(), gutter = 16, dx = 0;
            if (r.left < box.left + gutter) dx = r.left - box.left - gutter;
            else if (r.right > box.right - gutter) dx = r.right - box.right + gutter;
            if (dx) tagsBox.scrollTo({ left: tagsBox.scrollLeft + dx, behavior: smooth ? 'smooth' : 'auto' });
        }

        function render() {
            var all = chosen.length === 0;
            [allBtn].concat(THEMES.map(function (id) { return btns[id]; })).forEach(function (b) {
                var id = b.getAttribute('data-theme');
                b.setAttribute('aria-pressed', (id === '' ? all : chosen.indexOf(id) > -1) ? 'true' : 'false');
            });

            showChosen(started);
            started = true;

            var shown = all ? DOCS : DOCS.filter(function (d) { return chosen.indexOf(d.theme) > -1; });
            if (shown.length) {
                list.innerHTML = shown.map(card).join('');
            } else {
                list.innerHTML = '<div class="research-filter__empty"><p>' + esc(t.noResults) + '</p>' +
                    '<button type="button" class="btn btn--bordered' + '">' + esc(t.reset) + '</button></div>';
                list.querySelector('button').addEventListener('click', function () { toggle(''); });
            }
            explainTitle.textContent = chosen.length ? t.themes[chosen[0]] : '';
            explainText.textContent = chosen.length ? t.explain[chosen[0]] : '';
            explain.hidden = !chosen.length;
            status.textContent = fmt(t.shown, { n: shown.length, total: DOCS.length });
        }

        window.addEventListener('popstate', function () { chosen = readUrl(); render(); });
        render();
    }
})();
