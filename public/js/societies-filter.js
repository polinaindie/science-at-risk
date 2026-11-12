/* Search and popular requests on the societies list. The mirror has no search service, so the 37 societies are
   filtered here from js/societies-index.json (slug + fields); the cards are the ones the page already draws, so the
   filtered list looks the same. A real endpoint can replace this: the form is a plain GET to societies.html with
   ?search= and ?tag=. */
(function () {
    var base = (document.currentScript && document.currentScript.getAttribute('data-base')) || '';
    var params = new URLSearchParams(location.search);
    var tag = params.get('tag') || '';
    /* The chips are already in the HTML, so they are painted before the squircle worklet has arrived (the page adds it
       from unpkg) and are not painted again when it does — they would stay blank. When the worklet is added, the
       chips are swapped for copies of themselves, which are painted with the worklet in place. */
    if (window.CSS && CSS.paintWorklet) {
        var add = CSS.paintWorklet.addModule.bind(CSS.paintWorklet);
        CSS.paintWorklet.addModule = function () {
            return add.apply(null, arguments).then(function (r) {
                document.querySelectorAll('.popular-requests__tags').forEach(function (el) { el.replaceWith(el.cloneNode(true)); });
                return r;
            });
        };
    }
    /* A link is not painted with a squircle, so the chips are buttons (as on the scientists list) that go to their href. */
    document.addEventListener('click', function (e) {
        var b = e.target.closest && e.target.closest('[data-href]');
        if (b) location.href = b.getAttribute('data-href');
    });
    document.querySelectorAll('.popular-requests__tags[data-tag]').forEach(function (a) {
        if (tag && a.getAttribute('data-tag') === tag) a.setAttribute('aria-current', 'true');
    });
    var q = (params.get('search') || '').trim().toLowerCase();
    var input = document.getElementById('search');
    if (input && q) input.value = params.get('search');
    if (!q && !tag) return;

    var slugify = function (t) { return t.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''); };
    var esc = function (t) { var d = document.createElement('div'); d.textContent = t; return d.innerHTML; };
    var cards = {};
    var load = function (url) {
        return fetch(url).then(function (r) { return r.text(); }).then(function (t) {
            new DOMParser().parseFromString(t, 'text/html').querySelectorAll('.infrastructures-card').forEach(function (c) {
                var m = /society\/([^"]+)\.html/.exec(c.innerHTML);
                if (m) cards[m[1]] = c.outerHTML.replace(/(href=")(?:\.\.\/)?society\//g, '$1' + base + 'society/');
            });
        });
    };
    var pages = [base + 'societies.html'];
    for (var i = 2; i <= 4; i++) pages.push(base + 'societies/page-' + i + '.html');
    Promise.all([fetch(base + 'js/societies-index.json').then(function (r) { return r.json(); })]
        .concat(pages.map(load))).then(function (res) {
        var rows = res[0].filter(function (s) {
            if (!cards[s.slug]) return false;
            if (tag && !s.domain.some(function (d) { return slugify(d) === tag; })) return false;
            return !q || (cards[s.slug].replace(/<[^>]*>/g, ' ').toLowerCase().indexOf(q) !== -1);
        });
        var list = document.querySelector('.infrastructures__list');
        if (!list) return;
        if (rows.length) {
            list.innerHTML = rows.map(function (s) { return cards[s.slug]; }).join('');
        } else {
            var head = document.querySelector('.infrastructures__header');
            if (head) head.style.display = 'none';
            /* The same "We didn't find anything" block as the scientists list (.nothing), with the domains to try. */
            list.innerHTML = '<div class="nothing nothing--active"><h2 class="nothing__title">We didn\'t find anything for your query</h2>' +
                '<p class="nothing__text">Try another keyword, or see popular science domains.</p><ul class="nothing__list-tags">' +
                Array.prototype.map.call(document.querySelectorAll('.popular-requests__tags[data-href]'), function (b) {
                    return '<li class="nothing__tag btn btn--bordered"><button type="button" class="nothing__tag-link" data-href="' +
                        b.getAttribute('data-href') + '">' + esc(b.getAttribute('aria-label')) + '</button></li>';
                }).join('') + '</ul></div>';
        }
        document.querySelectorAll('.pagination').forEach(function (p) { p.style.display = 'none'; });
    });
})();
