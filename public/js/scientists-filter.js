/* The scientists list: search and filters that work together, all at once.

   The rules (the Go side builds the same on the server, from the same query string):
     ?search=<words>&field=<field slug>&spec=<field/speciality>,<field/speciality>&page=<n>
     text AND field AND (speciality OR speciality …); every word of the text must be found, in the name, degree,
     institution, specialities or description; name matches first, the rest in the list's own order.
     Choosing a field empties the specialities; any change goes back to page 1; 12 scientists a page.
   Nothing applied = the plain static pages as they came.

   The mirror has no search service, so it is done here from two files written by scripts/build-scientist-taxonomy.py:
     js/scientists-taxonomy.json   the fields and their specialities, with how many scientists each has
     js/scientists-index.json      one row per scientist: the card, its text, its fields and specialities */
(function () {
    var PAGE = 12;
    var base = (document.currentScript && document.currentScript.getAttribute('data-base')) || '';
    var params = new URLSearchParams(location.search);
    var state = {
        q: (params.get('search') || '').trim(),
        fields: (params.get('field') || '').split(',').filter(Boolean),
        specs: (params.get('spec') || '').split(',').filter(Boolean),
        page: Math.max(1, parseInt(params.get('page'), 10) || 1),
        tag: params.get('tag') || ''
    };
    /* The popular requests: what the site has always offered first — plain tags of the profiles. */
    var POPULAR = [['teaching', 'Teaching', 100], ['science-popularization', 'Science popularization', 86], ['biology', 'Biology', 57], ['natural-sciences', 'Natural sciences', 55], ['biochemistry', 'Biochemistry', 41]];
    var popularName = function (slug) { var m = POPULAR.filter(function (x) { return x[0] === slug; })[0]; return m ? m[1] : slug; };
    var form = document.querySelector('form.search-field');
    var input = document.getElementById('search');
    var requests = document.querySelector('.search-hero__requests'); /* the old chips of the specialities, now the second dropdown */
    var list = document.querySelector('.experts__list');
    var pager = document.querySelector('.pagination');
    var wrapper = document.querySelector('.experts > .wrapper');
    var original = { list: list ? list.innerHTML : '', pager: pager ? pager.innerHTML : '' };
    var tax = [], index = null, timer = 0;
    if (input) input.value = state.q;

    /* Clear (×) in the field, shown while something is typed; it empties the text and runs the search again. */
    if (input && form) {
        var clearBtn = document.createElement('button');
        clearBtn.type = 'button';
        clearBtn.className = 'search-field__clear';
        clearBtn.setAttribute('aria-label', 'Clear the search');
        clearBtn.innerHTML = '<span aria-hidden="true">×</span>';
        var submitBtn = form.querySelector('.btn');
        submitBtn.parentNode.insertBefore(clearBtn, submitBtn);
        var syncClear = function () { clearBtn.hidden = !input.value; };
        input.addEventListener('input', syncClear);
        input.addEventListener('syncclear', syncClear);
        clearBtn.addEventListener('click', function () {
            input.value = ''; syncClear(); input.focus();
            form.dispatchEvent(new Event('submit', { cancelable: true }));
        });
        syncClear();
    }

    var esc = function (t) { var d = document.createElement('div'); d.textContent = t; return d.innerHTML; };
    var load = function (name) { return fetch(base + 'js/' + name + '.json').then(function (r) { return r.json(); }); };
    var fieldOf = function (slug) { return tax.filter(function (f) { return f.slug === slug; })[0]; };
    var specOf = function (key) {
        var f = fieldOf(key.split('/')[0]);
        return f && f.specs.filter(function (s) { return f.slug + '/' + s.slug === key; })[0];
    };

    /* ---- the text: after a pause, at once on Enter or the button */
    if (input) input.addEventListener('input', function () {
        clearTimeout(timer);
        timer = setTimeout(function () { state.q = input.value.trim(); state.page = 1; apply(); }, 400);
    });
    if (form) form.addEventListener('submit', function (e) {
        e.preventDefault();
        clearTimeout(timer);
        state.q = input.value.trim(); state.page = 1;
        apply();
    });


    /* ---- the Field and Speciality menus, in the row with the search: a choice applies at once.
       Field: any of the fields; Speciality: any of the specialities, grouped by field (a speciality brings its field in). Native checkboxes in a disclosure, so the keyboard and screen readers work as they do. */
    var menus = {};
    var closeMenus = function (except) {
        Object.keys(menus).forEach(function (k) {
            if (menus[k] === except) return;
            menus[k].panel.hidden = true; menus[k].btn().setAttribute('aria-expanded', 'false');
        });
    };
    var buildMenu = function (key, label) {
        var box = document.createElement('div');
        box.className = 'filter-menu filter-menu--' + key;
        box.innerHTML = '<button type="button" class="filter-menu__btn" aria-expanded="false" aria-haspopup="true">' +
            '<span class="filter-menu__label">' + label + '</span><span class="filter-menu__count" hidden></span>' +
            '<svg class="filter-menu__caret" width="12" height="8" viewBox="0 0 12 8" fill="none" aria-hidden="true"><path d="M1 1.5 6 6.5 11 1.5" stroke="currentColor" stroke-width="1.6"/></svg></button>' +
            '<div class="filter-menu__panel" role="group" aria-label="' + label + '" hidden></div>';
        var m = { box: box, panel: box.lastChild, shown: '', def: label };
        m.btn = function () { return box.querySelector('.filter-menu__btn'); };
        m.count = function () { return box.querySelector('.filter-menu__count'); };
        m.panel.addEventListener('change', function (e) {
            var c = e.target;
            if (!c.matches('input[type=checkbox]')) return;
            var v = c.value, list = key === 'field' ? state.fields : state.specs, at = list.indexOf(v);
            if (c.checked && at === -1) list.push(v);
            if (!c.checked && at !== -1) list.splice(at, 1);
            if (key === 'spec' && c.checked && state.fields.indexOf(v.split('/')[0]) === -1) state.fields.push(v.split('/')[0]);
            if (key === 'field' && !c.checked) state.specs = state.specs.filter(function (k) { return k.split('/')[0] !== v; });
            state.page = 1;
            apply();
        });
        menus[key] = m;
        return box;
    };
    var drawMenus = function () {
        if (!menus.field || !tax.length) return;
        var f = menus.field, sp = menus.spec;
        if (!f.shown) {
            f.panel.innerHTML = tax.map(function (x) {
                return '<label class="filter-menu__opt"><input type="checkbox" value="' + x.slug + '"><span>' + esc(x.en) + '</span><em>' + x.count + '</em></label>';
            }).join('');
            f.shown = '1';
        }
        /* the specialities on offer: all of them, grouped by field — choosing one chooses its field as well */
        var on = tax;
        var sig = 'all';
        if (sp.shown !== sig) {
            sp.panel.innerHTML = on.filter(function (x) { return x.specs.length; }).map(function (x) {
                return '<p class="filter-menu__group">' + esc(x.en) + '</p>' + x.specs.map(function (y) {
                    return '<label class="filter-menu__opt"><input type="checkbox" value="' + x.slug + '/' + y.slug + '"><span>' + esc(y.en) + '</span><em>' + y.count + '</em></label>';
                }).join('');
            }).join('');
            sp.shown = sig;
        }
        [[f, state.fields], [sp, state.specs]].forEach(function (p) {
            p[0].panel.querySelectorAll('input').forEach(function (c) { c.checked = p[1].indexOf(c.value) !== -1; });
            /* the label says what is chosen (a long list is cut short by the line; the number counts them) */
            p[0].box.querySelector('.filter-menu__label').textContent = p[1].length ? p[1].map(function (v) {
                var x = p[0] === f ? fieldOf(v) : specOf(v);
                return x ? x.en : '';
            }).filter(Boolean).join(', ') : p[0].def;
            p[0].count().hidden = !p[1].length;
            p[0].count().textContent = p[1].length;
            p[0].btn().classList.toggle('is-on', !!p[1].length);
        });
    };
    document.addEventListener('click', function (e) {
        var t = e.target.closest && e.target.closest('.filter-menu');
        if (!t) { closeMenus(); return; }
        if (!e.target.closest('.filter-menu__btn')) return;
        var m = menus[t.classList.contains('filter-menu--field') ? 'field' : 'spec'], open = m.panel.hidden;
        closeMenus(m);
        m.panel.hidden = !open; m.btn().setAttribute('aria-expanded', String(open));
    });
    if (form) {
        var slot = form.querySelector('.btn');
        var wrap = document.createElement('div');
        wrap.className = 'search-field__filters';
        wrap.appendChild(buildMenu('field', 'Choose field'));
        wrap.appendChild(buildMenu('spec', 'Choose specialities'));
        form.insertBefore(wrap, form.firstChild); /* the two menus stand first, the search after them */
    }

    /* ---- what is applied, over the list; the empty block; the pagination */
    var bar = document.createElement('div');
    bar.className = 'results-bar';
    bar.setAttribute('aria-live', 'polite');
    /* What is applied sits under the blue block, over the list it describes. */
    if (wrapper) wrapper.insertBefore(bar, wrapper.firstChild);

    /* A popular request turns on and, clicked again, off. */
    if (requests) requests.addEventListener('click', function (e) {
        var b = e.target.closest('[data-popular]');
        if (!b) return;
        var v = b.getAttribute('data-popular');
        state = { q: '', fields: [], specs: [], page: 1, tag: state.tag === v ? '' : v };
        if (input) input.value = '';
        apply();
    });

    document.addEventListener('click', function (e) {
        var t = e.target.closest && e.target.closest('[data-remove],[data-clear],[data-field],[data-goto]');
        if (!t) return;
        var r = t.getAttribute('data-remove');
        if (!r && !t.hasAttribute('data-clear') && !t.hasAttribute('data-field') && !t.hasAttribute('data-goto')) return;
        e.preventDefault();
        e.stopImmediatePropagation();
        if (r === 'q') { state.q = ''; if (input) input.value = ''; }
        else if (r === 'tag') state.tag = '';
        else if (r && r.indexOf('field:') === 0) { var fv = r.slice(6); state.fields = state.fields.filter(function (x) { return x !== fv; }); state.specs = state.specs.filter(function (k) { return k.split('/')[0] !== fv; }); }
        else if (r) state.specs = state.specs.filter(function (k) { return k !== r; });
        else if (t.hasAttribute('data-clear')) { state = { q: '', fields: [], specs: [], page: 1, tag: '' }; if (input) input.value = ''; }
        else if (t.hasAttribute('data-field')) { var add = t.getAttribute('data-field'); if (state.fields.indexOf(add) === -1) state.fields.push(add); }
        if (t.hasAttribute('data-goto')) { state.page = parseInt(t.getAttribute('data-goto'), 10); apply(true); return; }
        state.page = 1;
        apply();
    }, true);

    var drawControls = function () {
        if (!requests) return;
        /* Popular requests are the quick way in; once a field or speciality is chosen the menus say what is applied, so they step aside. */
        if (state.fields.length || state.specs.length) { requests.innerHTML = ''; return; }
        requests.innerHTML = '<div class="hero-aside"><div class="popular-box"><p class="popular-requests__text">Popular requests</p><div class="popular-requests__wrapper">' +
            POPULAR.map(function (x) {
                var on = state.tag === x[0];
                return '<button type="button" data-popular="' + x[0] + '" aria-pressed="' + on + '" aria-label="' + esc(x[1]) + '" class="popular-requests__tags tag">' +
                    esc(x[1]) + '<span class="tag__number">' + x[2] + '</span></button>';
            }).join('') + '</div></div></div>';
    };

    var drawBar = function (total) {
        var chips = [];
        if (state.q) chips.push(['q', '“' + state.q + '”']);
        if (state.tag) chips.push(['tag', popularName(state.tag)]);
        state.fields.forEach(function (sl) { var f = fieldOf(sl); if (f) chips.push(['field:' + sl, f.en]); });
        state.specs.forEach(function (k) { var s = specOf(k); if (s) chips.push([k, s.en]); });
        if (!chips.length) { bar.innerHTML = ''; return; }
        bar.innerHTML = '<p class="results-bar__count"><strong>' + total + '</strong> ' + (total === 1 ? 'scientist' : 'scientists') + '</p>' +
            '<ul class="results-bar__chips">' + chips.map(function (c) {
                return '<li><button type="button" class="results-bar__chip expert-card__tag tag" data-remove="' + esc(c[0]) + '" aria-label="Remove: ' + esc(c[1]) + '">' + esc(c[1]) + ' <span aria-hidden="true">×</span></button></li>';
            }).join('') + '</ul><button type="button" class="results-bar__clear" data-clear>Clear all</button>';
    };

    var drawPager = function (pages) {
        if (!pager) return;
        if (pages <= 1) { pager.style.display = 'none'; return; }
        pager.style.display = '';
        var arrow = function (dir, to, on) {
            var svg = dir === 'prev'
                ? '<svg width="9" height="13" viewBox="0 0 9 13" fill="none"><path d="M0 7.39965V5.60035L9 0V1.86678L1.56977 6.38754V6.56747L9 11.0882V13L0 7.39965Z" fill="black"/></svg>'
                : '<svg width="9" height="13" viewBox="0 0 9 13" fill="none"><path d="M9 5.60035L9 7.39965L0 13V11.1332L7.43023 6.61246V6.43253L0 1.91177V0L9 5.60035Z" fill="black"/></svg>';
            var word = '<div class="d-md-inline-block d-none"><span class="hover hover--black">' + (dir === 'prev' ? 'Previous' : 'Next') + '</span></div>';
            var inner = dir === 'prev' ? svg + word : word + svg;
            return on ? '<a href="#" data-goto="' + to + '" class="pagination__' + dir + '">' + inner + '</a>'
                      : '<span class="pagination__' + dir + ' pagination--disabled">' + inner + '</span>';
        };
        var nums = '';
        for (var i = 1; i <= pages; i++) {
            nums += i === state.page ? '<span aria-current="page" class="pagination__number pagination__number--active">' + i + '</span>'
                                     : '<a class="pagination__number" href="#" data-goto="' + i + '">' + i + '</a>';
        }
        pager.innerHTML = arrow('prev', state.page - 1, state.page > 1) + '<div class="pagination__numbers">' + nums + '</div>' + arrow('next', state.page + 1, state.page < pages);
    };

    var showNothing = function () {
        var nothing = document.querySelector('.nothing');
        if (!nothing) return;
        nothing.classList.add('nothing--active');
        var what = [];
        if (state.q) what.push('“' + state.q + '”');
        if (state.fields.length) what.push(state.fields.map(function (sl) { var f = fieldOf(sl); return f ? f.en : sl; }).join(' or '));
        if (state.specs.length) what.push(state.specs.map(function (k) { var s = specOf(k); return s ? s.en : ''; }).join(' or '));
        var tx = nothing.querySelector('.nothing__text');
        if (tx) tx.textContent = 'No scientists for ' + what.join(' in ') + '. Remove a filter or try another keyword — or see the biggest fields of knowledge.';
        var tries = nothing.querySelector('.nothing__list-tags');
        if (tries) tries.innerHTML = '<li class="nothing__tag btn btn--black"><button type="button" class="nothing__tag-link" data-clear>Clear all</button></li>' +
            tax.filter(function (f) { return state.fields.indexOf(f.slug) === -1; }).slice(0, 5).map(function (f) {
                return '<li class="nothing__tag btn btn--bordered"><button type="button" class="nothing__tag-link" data-field="' + f.slug + '">' + esc(f.en) + '</button></li>';
            }).join('');
    };

    var words = function (t) { return t.toLowerCase().split(/\s+/).filter(Boolean); };
    var filtered = function () {
        var ws = words(state.q), out = [];
        index.forEach(function (r, i) {
            if (state.tag && r.g.indexOf(state.tag) === -1) return;
            if (state.fields.length && !state.fields.some(function (f) { return r.f.indexOf(f) !== -1; })) return;
            if (state.specs.length && !state.specs.some(function (k) { return r.s.indexOf(k) !== -1; })) return;
            if (ws.some(function (w) { return r.t.indexOf(w) === -1; })) return;
            out.push({ r: r, i: i, rank: ws.length && ws.every(function (w) { return (r.n || '').indexOf(w) !== -1; }) ? 0 : 1 });
        });
        return out.sort(function (a, b) { return a.rank - b.rank || a.i - b.i; }).map(function (x) { return x.r; });
    };

    var apply = function (scroll) {
        drawControls();
        drawMenus();
        if (input) input.dispatchEvent(new Event('syncclear'));
        var p = new URLSearchParams();
        if (state.q) p.set('search', state.q);
        if (state.tag) p.set('tag', state.tag);
        if (state.fields.length) p.set('field', state.fields.join(','));
        if (state.specs.length) p.set('spec', state.specs.join(','));
        if (state.page > 1) p.set('page', state.page);
        history.replaceState(null, '', location.pathname + (p.toString() ? '?' + p.toString() : ''));
        if (!list) return;
        var nothing = document.querySelector('.nothing');
        if (!(state.q || state.tag || state.fields.length || state.specs.length)) {
            bar.innerHTML = '';
            list.innerHTML = original.list;
            if (pager) { pager.innerHTML = original.pager; pager.style.display = ''; }
            if (nothing) nothing.classList.remove('nothing--active');
            return;
        }
        (index ? Promise.resolve(index) : load('scientists-index').then(function (rows) {
            rows.forEach(function (r) { var m = /expert-card__title"><span>([^<]*)</.exec(r.h); r.n = m ? m[1].toLowerCase() : ''; });
            return (index = rows);
        })).then(function () {
            var rows = filtered(), pages = Math.max(1, Math.ceil(rows.length / PAGE));
            if (state.page > pages) state.page = pages;
            drawBar(rows.length);
            if (!rows.length) {
                list.innerHTML = ''; drawPager(0); showNothing();
                return;
            }
            if (nothing) nothing.classList.remove('nothing--active');
            list.innerHTML = rows.slice((state.page - 1) * PAGE, state.page * PAGE).map(function (r) {
                return '<li class="experts__item">' + r.h.replace(/(href|src)="(?!https?:|\/|#|mailto:)/g, '$1="' + base) + '</li>';
            }).join('');
            drawPager(pages);
            if (scroll === true) (wrapper || list).scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    };

    load('scientists-taxonomy').then(function (t) { tax = t; apply(); });
})();
