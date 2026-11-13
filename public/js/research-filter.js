/* Topic filter for the Research list.

   Data:   js/research-index.json  (every document and its one primary theme: edit THERE to retag a document)
   Labels: js/research-i18n.json   (uk / en; the language is the page's <html lang>; ?lang=uk|en only for previewing the other one)
   Markup: <div data-research-filter></div> above the list  +  <script src="js/research-filter.js" data-base=""></script>

   Rules (a Go page can build the same from the same query string):
     ?theme=scientists,policy      themes are OR: a document shows if its theme is any of the chosen ones
     no ?theme                     "All topics"
   Clicking a chosen tag un-chooses it; with nothing chosen "All topics" is active again.
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
        fetch(base + 'js/research-index.json').then(function (r) { return r.json(); }),
        fetch(base + 'js/research-i18n.json').then(function (r) { return r.json(); })
    ]).then(function (res) { init(res[0], res[1][lang] || res[1].en); })
      .catch(function () { /* data did not load: the static list stays as it is */ });

    function init(data, t) {
        var THEMES = data.themes, DOCS = data.docs;
        var chosen = readUrl();
        var recent = chosen.slice(); /* the chosen tags in the order they were clicked: the line shows the last one */

        var esc = function (s) { var d = document.createElement('div'); d.textContent = s; return d.innerHTML; };
        var fmt = function (s, v) { return s.replace(/\{(\w+)\}/g, function (_, k) { return v[k]; }); };
        var count = function (theme) { return DOCS.filter(function (d) { return d.theme === theme; }).length; };

        /* the page is no longer paged: all documents are on it */
        document.querySelectorAll('.pagination').forEach(function (p) { p.hidden = true; });

        root.className = 'research-filter';
        root.innerHTML =
            '<div class="research-filter__tags popular-requests__wrapper" role="group" aria-label="' + esc(t.filterLabel) + '"></div>' +
            '<div class="research-filter__explain" aria-live="polite"></div>';
        var tagsBox = root.querySelector('.research-filter__tags');
        var explain = root.querySelector('.research-filter__explain');

        list.setAttribute('role', 'region');
        list.setAttribute('aria-label', t.filterLabel);
        var status = document.createElement('p');
        status.className = 'research-filter__status';
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
            b.addEventListener('click', function () { toggle(id); });
            tagsBox.appendChild(b);
            return b;
        }
        var allBtn = tag('', t.all, DOCS.length);
        var btns = {};
        THEMES.forEach(function (id) { btns[id] = tag(id, t.themes[id], count(id)); });

        function readUrl() {
            var v = (new URLSearchParams(location.search).get('theme') || '').split(',');
            return THEMES.filter(function (id) { return v.indexOf(id) > -1; }); /* unknown values are ignored */
        }
        function writeUrl() {
            var p = new URLSearchParams(location.search);
            if (chosen.length) p.set('theme', chosen.join(',')); else p.delete('theme');
            var q = p.toString();
            history.replaceState(null, '', location.pathname + (q ? '?' + q : '') + location.hash);
        }
        function toggle(id) {
            if (id === '') { chosen = []; recent = []; }
            else if (chosen.indexOf(id) > -1) { recent = recent.filter(function (x) { return x !== id; }); chosen = chosen.filter(function (x) { return x !== id; }); }
            else { recent.push(id); chosen = THEMES.filter(function (x) { return x === id || chosen.indexOf(x) > -1; }); } /* keeps the tag order */
            writeUrl();
            render();
        }

        /* the card as the list always had it (.paper-card); only the theme label is new */
        function card(d) {
            var href = base + 'research/' + d.slug + '.html', pdf = base + d.pdf;
            return '<div class="paper-card"><article class="paper-card__wrap"><div class="row align-items-start justify-content-between">' +
                '<div class="col-xl-6 col-md-7"><div class="paper-card__info">' +
                '<span class="research-card__label">' + esc(t.themes[d.theme]) + '</span>' +
                '<h2 class="paper-card__title"><span>' + esc(d.title) + '</span></h2>' +
                '<p class="paper-card__text">' + esc(d.authors ? t.authors + ' ' + d.authors : t.authors.replace(/:$/, '')) + '</p></div></div>' +
                '<div class="offset-xl-3 offset-md-2 col-md-3"><div class="paper-card__right"><p class="paper-card__right-text">' + esc(t.pdf) + '</p></div></div>' +
                '</div></article>' +
                '<a class="absoluteLink" href="' + href + '" aria-label="' + esc(fmt(t.detailsAria, { title: d.title })) + '"></a>' +
                '<div class="paper-card__wrap-btn d-md-flex d-none">' +
                '<div class="paper-card__btn btn btn--bordered"><a href="' + href + '" class="paper-card__link-btn">' + esc(t.details) + '</a></div>' +
                '<div class="paper-card__btn btn btn--black position-relative">' + esc(t.download) +
                '<a class="absoluteLink" href="' + pdf + '" target="_blank" rel="noopener" aria-label="' + esc(fmt(t.pdfAria, { title: d.title })) + '"></a></div>' +
                '</div></div>';
        }

        var shownLine = null;
        function render() {
            var all = chosen.length === 0;
            [allBtn].concat(THEMES.map(function (id) { return btns[id]; })).forEach(function (b) {
                var id = b.getAttribute('data-theme');
                b.setAttribute('aria-pressed', (id === '' ? all : chosen.indexOf(id) > -1) ? 'true' : 'false');
            });

            /* one line, the sentence of the tag clicked last; it changes in place, it does not pile up */
            var last = recent.length ? recent[recent.length - 1] : '';
            if (last !== shownLine) {
                shownLine = last;
                explain.textContent = '';
                if (last) {
                    var s = document.createElement('p');
                    s.className = 'main-title main-title--h2';
                    s.textContent = t.explain[last];
                    explain.appendChild(s);
                }
            }

            var shown = all ? DOCS : DOCS.filter(function (d) { return chosen.indexOf(d.theme) > -1; });
            if (shown.length) {
                list.innerHTML = shown.map(card).join('');
            } else {
                list.innerHTML = '<div class="research-filter__empty"><p>' + esc(t.noResults) + '</p>' +
                    '<button type="button" class="btn btn--bordered' + '">' + esc(t.reset) + '</button></div>';
                list.querySelector('button').addEventListener('click', function () { toggle(''); });
            }
            status.textContent = fmt(t.shown, { n: shown.length, total: DOCS.length });
        }

        window.addEventListener('popstate', function () { chosen = readUrl(); recent = chosen.slice(); render(); });
        render();
    }
})();
