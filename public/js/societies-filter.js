/* Search and popular domains on the societies list, like the scientists list.

   The rules (the Go side builds the same on the server, from the same query string):
     ?search=<words>&tag=<domain slug>
     text AND domain; every word of the text must be found in the card (name, description, domain);
     name matches first, the rest in the list's own order. Nothing applied = the plain static pages as they came.
   The mirror has no search service, so the 37 societies are filtered here from js/societies-index.json (slug + domains);
   the cards are the ones the pages already draw, so the filtered list looks the same. */
(function () {
    var base = (document.currentScript && document.currentScript.getAttribute('data-base')) || '';
    var params = new URLSearchParams(location.search);
    var state = { q: (params.get('search') || '').trim(), tag: params.get('tag') || '' };
    var form = document.querySelector('form.search-field');
    var input = document.getElementById('search');
    var requests = document.querySelector('.search-hero__requests');
    var wrapper = document.querySelector('.infrastructures__wrapper > .wrapper');
    var list = document.querySelector('.infrastructures__list');
    var header = document.querySelector('.infrastructures__header');
    var pagers = document.querySelectorAll('.pagination');
    var original = list ? list.innerHTML : '';
    var cards = null, index = null, timer = 0;

    var esc = function (t) { var d = document.createElement('div'); d.textContent = t; return d.innerHTML; };
    var slugify = function (t) { return t.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''); };

    /* The domains, as the page has them (the chips are already in the HTML, for a page without scripts). */
    var TAGS = Array.prototype.map.call(document.querySelectorAll('.popular-requests__tags[data-tag]'), function (b) {
        var n = b.querySelector('.tag__number');
        return [b.getAttribute('data-tag'), b.getAttribute('aria-label'), n ? n.textContent.trim() : ''];
    });
    var DOMAINS = {}; /* every domain of the societies: slug -> [name, how many] (filled from the index once it is loaded) */
    var tagName = function (slug) {
        var m = TAGS.filter(function (x) { return x[0] === slug; })[0];
        return m ? m[1] : (DOMAINS[slug] ? DOMAINS[slug][0] : slug);
    };
    var TOTAL = 37;

    /* The chips are painted by the squircle worklet, which the page adds later (from unpkg); chips drawn before it has
       arrived would stay blank, so when it arrives they are swapped for copies of themselves. */
    if (window.CSS && CSS.paintWorklet) {
        var add = CSS.paintWorklet.addModule.bind(CSS.paintWorklet);
        CSS.paintWorklet.addModule = function () {
            return add.apply(null, arguments).then(function (r) {
                document.querySelectorAll('.popular-requests__tags').forEach(function (el) { el.replaceWith(el.cloneNode(true)); });
                return r;
            });
        };
    }

    /* ---- the field: searched on Enter or the button, not while typing (the suggestions do answer the typing); × clears it */
    if (input) {
        input.value = state.q;
        input.setAttribute('autocomplete', 'off');
    }
    if (form) form.addEventListener('submit', function (e) {
        e.preventDefault();
        clearTimeout(timer);
        state.q = input.value.trim();
        apply();
    });
    /* the cursor is in the search as the page opens, as on scienceatrisk.org (not where a keyboard would pop up: touch screens) */
    if (input && window.matchMedia && window.matchMedia('(pointer: fine)').matches) {
        var focusSearch = function () { if (!document.activeElement || document.activeElement === document.body) input.focus({ preventScroll: true }); };
        focusSearch();
        window.addEventListener('load', focusSearch);           /* a refresh: after the page and its scripts have settled */
        window.addEventListener('pageshow', focusSearch);       /* back/forward restores the page without loading it again */
    }
    var clearBtn = null;
    if (input && form) {
        clearBtn = document.createElement('button');
        clearBtn.type = 'button';
        clearBtn.className = 'search-field__clear';
        clearBtn.setAttribute('aria-label', 'Clear the search');
        clearBtn.innerHTML = '<span aria-hidden="true">×</span>';
        form.insertBefore(clearBtn, form.querySelector('.btn'));
        input.addEventListener('input', function () { clearBtn.hidden = !input.value; });
        clearBtn.addEventListener('click', function () { input.value = ''; clearBtn.hidden = true; input.focus(); state.q = ''; apply(); });
        clearBtn.hidden = !input.value;
    }

    /* ---- what is applied, over the list: the count, each filter as a chip with ×, "Clear all" */
    var bar = document.createElement('div');
    bar.className = 'results-bar';
    bar.setAttribute('aria-live', 'polite');
    if (wrapper && list) wrapper.insertBefore(bar, list);

    var drawControls = function () {
        if (!requests || !TAGS.length) return;
        var chip = function (slug, name, n, on) {
            return '<button type="button" data-popular="' + esc(slug) + '" aria-pressed="' + on + '" aria-label="' + esc(name) + '" class="popular-requests__tags tag">' +
                esc(name) + (n ? '<span class="tag__number">' + esc(n) + '</span>' : '') + '</button>';
        };
        requests.innerHTML = '<p class="popular-requests__text">Popular domains</p><div class="popular-requests__wrapper">' +
            TAGS.map(function (x) { return chip(x[0], x[1], x[2], state.tag === x[0]); }).join('') + '</div>';
    };

    var drawBar = function (total) {
        var chips = [];
        if (state.q) chips.push(['q', '“' + state.q + '”']);
        if (state.tag) chips.push(['tag', tagName(state.tag)]);
        if (!chips.length) { bar.innerHTML = ''; return; }
        bar.innerHTML = '<p class="results-bar__count"><strong>' + total + '</strong> ' + (total === 1 ? 'society' : 'societies') + '</p>' +
            '<ul class="results-bar__chips">' + chips.map(function (c) {
                return '<li><button type="button" class="results-bar__chip expert-card__tag tag" data-remove="' + c[0] + '" aria-label="Remove: ' + esc(c[1]) + '">' + esc(c[1]) + ' <span aria-hidden="true">×</span></button></li>';
            }).join('') + '</ul><button type="button" class="results-bar__clear" data-clear>Clear all</button>';
    };

    var setInput = function () { if (input) input.value = state.q; if (clearBtn) clearBtn.hidden = !state.q; };

    document.addEventListener('click', function (e) {
        var t = e.target.closest && e.target.closest('[data-popular],[data-remove],[data-clear],[data-set-tag]');
        if (!t) return;
        e.preventDefault();
        if (t.hasAttribute('data-popular') || t.hasAttribute('data-set-tag')) {
            var v = t.getAttribute('data-popular') || t.getAttribute('data-set-tag');
            state.tag = state.tag === v ? '' : v; /* a chip turns on and, clicked again, off */
        } else if (t.hasAttribute('data-clear')) { state = { q: '', tag: '' }; }
        else if (t.getAttribute('data-remove') === 'q') state.q = '';
        else if (t.getAttribute('data-remove') === 'tag') state.tag = '';
        setInput();
        apply();
    });

    /* ---- suggestions while typing: the domains that match the text, under the field (as on the scientists list).
       A click or Enter on the highlighted one turns it into the domain chip and empties the text; arrows move, Esc closes. */
    var domainsReady = null;
    var loadDomains = function () {
        if (!domainsReady) domainsReady = fetch(base + 'js/societies-index.json').then(function (r) { return r.json(); }).then(function (rows) {
            rows.forEach(function (r) {
                r.domain.forEach(function (d) {
                    var k = slugify(d);
                    if (!DOMAINS[k]) DOMAINS[k] = [d, 0];
                    DOMAINS[k][1]++;
                });
            });
        });
        return domainsReady;
    };
    var sug = null, sugItems = [], sugAt = -1;
    var closeSuggest = function () {
        if (!sug) return;
        sug.hidden = true; sugAt = -1; sugItems = [];
        input.setAttribute('aria-expanded', 'false'); input.removeAttribute('aria-activedescendant');
    };
    var markSuggest = function (at) {
        sugAt = at;
        Array.prototype.forEach.call(sug.children, function (el, i) { el.setAttribute('aria-selected', String(i === at)); });
        if (at >= 0) input.setAttribute('aria-activedescendant', sug.children[at].id); else input.removeAttribute('aria-activedescendant');
    };
    var drawSuggest = function () {
        if (!sug) return;
        var q = input.value.trim().toLowerCase();
        if (q.length < 2) { closeSuggest(); return; }
        loadDomains().then(function () {
            if (input.value.trim().toLowerCase() !== q) return; /* typed on meanwhile */
            var hits = Object.keys(DOMAINS).filter(function (k) { return k !== state.tag && DOMAINS[k][0].toLowerCase().indexOf(q) !== -1; })
                .map(function (k) { return { slug: k, name: DOMAINS[k][0], count: DOMAINS[k][1], at: DOMAINS[k][0].toLowerCase().indexOf(q) }; });
            hits.sort(function (a, b) { return (a.at === 0 ? 0 : 1) - (b.at === 0 ? 0 : 1) || b.count - a.count; });
            sugItems = hits.slice(0, 6);
            if (!sugItems.length) { closeSuggest(); return; }
            sug.innerHTML = sugItems.map(function (h, i) {
                return '<li role="option" id="suggest-' + i + '" aria-selected="false" data-i="' + i + '"><span class="suggest__name">' + esc(h.name) +
                    '<small>Domain</small></span><em>' + h.count + '</em></li>';
            }).join('');
            sug.hidden = false; sugAt = -1;
            input.setAttribute('aria-expanded', 'true');
        });
    };
    var pickSuggest = function (i) {
        var h = sugItems[i];
        if (!h) return;
        clearTimeout(timer);
        state.tag = h.slug; state.q = '';
        setInput();
        closeSuggest();
        apply();
        input.focus();
    };
    if (input && form) {
        sug = document.createElement('ul');
        sug.className = 'suggest';
        sug.id = 'suggest-list';
        sug.setAttribute('role', 'listbox');
        sug.setAttribute('aria-label', 'Domains');
        sug.hidden = true;
        form.appendChild(sug);
        input.setAttribute('role', 'combobox');
        input.setAttribute('aria-autocomplete', 'list');
        input.setAttribute('aria-expanded', 'false');
        input.setAttribute('aria-controls', 'suggest-list');
        input.addEventListener('input', drawSuggest);
        input.addEventListener('keydown', function (e) {
            if (sug.hidden || !sugItems.length) return;
            if (e.key === 'ArrowDown') { e.preventDefault(); markSuggest((sugAt + 1) % sugItems.length); }
            else if (e.key === 'ArrowUp') { e.preventDefault(); markSuggest((sugAt - 1 + sugItems.length) % sugItems.length); }
            else if (e.key === 'Enter' && sugAt >= 0) { e.preventDefault(); pickSuggest(sugAt); }
            else if (e.key === 'Escape') { closeSuggest(); }
        });
        /* mousedown, not click: the field loses focus first and would close the list before the click lands */
        sug.addEventListener('mousedown', function (e) {
            var li = e.target.closest('li');
            if (!li) return;
            e.preventDefault();
            pickSuggest(parseInt(li.getAttribute('data-i'), 10));
        });
        document.addEventListener('click', function (e) { if (!form.contains(e.target)) closeSuggest(); });
        input.addEventListener('blur', function () { setTimeout(closeSuggest, 120); });
    }

    var loadCards = function () {
        if (cards) return Promise.resolve();
        cards = {};
        var pages = [base + 'societies.html'];
        for (var i = 2; i <= 4; i++) pages.push(base + 'societies/page-' + i + '.html');
        return Promise.all(pages.map(function (url) {
            return fetch(url).then(function (r) { return r.text(); }).then(function (t) {
                new DOMParser().parseFromString(t, 'text/html').querySelectorAll('.infrastructures-card').forEach(function (c) {
                    var m = /society\/([^"]+)\.html/.exec(c.innerHTML);
                    if (m) {
                        var name = c.querySelector('.infrastructures-card__title');
                        cards[m[1]] = {
                            html: c.outerHTML.replace(/(href=")(?:\.\.\/)?society\//g, '$1' + base + 'society/'),
                            text: c.textContent.replace(/\s+/g, ' ').toLowerCase(),
                            name: name ? name.textContent.toLowerCase() : ''
                        };
                    }
                });
            });
        })).then(function () {
            return fetch(base + 'js/societies-index.json').then(function (r) { return r.json(); }).then(function (rows) { index = rows; });
        });
    };

    var filtered = function () {
        var ws = state.q.toLowerCase().split(/\s+/).filter(Boolean), out = [];
        index.forEach(function (s, i) {
            var c = cards[s.slug];
            if (!c) return;
            if (state.tag && !s.domain.some(function (d) { return slugify(d) === state.tag; })) return;
            if (ws.some(function (w) { return c.text.indexOf(w) === -1; })) return;
            out.push({ s: s, i: i, rank: ws.length && ws.every(function (w) { return c.name.indexOf(w) !== -1; }) ? 0 : 1 });
        });
        return out.sort(function (a, b) { return a.rank - b.rank || a.i - b.i; }).map(function (x) { return x.s; });
    };

    var apply = function () {
        drawControls();
        var p = new URLSearchParams();
        if (state.q) p.set('search', state.q);
        if (state.tag) p.set('tag', state.tag);
        history.replaceState(null, '', location.pathname + (p.toString() ? '?' + p.toString() : ''));
        if (!list) return;
        if (!state.q && !state.tag) {
            bar.innerHTML = '';
            list.innerHTML = original;
            if (header) header.style.display = '';
            pagers.forEach(function (el) { el.style.display = ''; });
            return;
        }
        Promise.all([loadCards(), loadDomains()]).then(function () {
            var rows = filtered();
            drawBar(rows.length);
            pagers.forEach(function (el) { el.style.display = 'none'; });
            if (header) header.style.display = rows.length ? '' : 'none';
            if (rows.length) { list.innerHTML = rows.map(function (s) { return cards[s.slug].html; }).join(''); return; }
            /* The same "We didn't find anything" block as the scientists list (.nothing), with ways out. */
            list.innerHTML = '<div class="nothing nothing--active"><h2 class="nothing__title">We didn\'t find anything for your query</h2>' +
                '<p class="nothing__text">Remove a filter or try another keyword — or see popular science domains.</p><ul class="nothing__list-tags">' +
                '<li class="nothing__tag btn btn--black"><button type="button" class="nothing__tag-link" data-clear>Clear all</button></li>' +
                TAGS.filter(function (x) { return x[0] !== state.tag; }).slice(0, 5).map(function (x) {
                    return '<li class="nothing__tag btn btn--bordered"><button type="button" class="nothing__tag-link" data-set-tag="' + esc(x[0]) + '">' + esc(x[1]) + '</button></li>';
                }).join('') + '</ul></div>';
        });
    };

    apply();
})();
