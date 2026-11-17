/* The type chips of the Stories list are painted by the squircle worklet, which the page adds a little later (from unpkg).
   Chips drawn before it has arrived would stay blank, so when it arrives they are swapped for copies of themselves
   (the same fix as the societies list). Without scripts the chips are plain links. */
(function () {
    if (!(window.CSS && CSS.paintWorklet)) return;
    var add = CSS.paintWorklet.addModule.bind(CSS.paintWorklet);
    CSS.paintWorklet.addModule = function () {
        return add.apply(null, arguments).then(function (r) {
            document.querySelectorAll('.stories-tags__tag').forEach(function (el) { el.replaceWith(el.cloneNode(true)); });
            return r;
        });
    };
})();

/* The open type (aria-current) is always in view in the sideways row on a phone, also when the page is opened on it. */
(function () {
    function show() {
        var row = document.querySelector('.stories-tags');
        var on = row && row.querySelector('a[aria-current="page"]');
        if (!on || row.scrollWidth <= row.clientWidth) return;
        var chip = on.parentNode, box = row.getBoundingClientRect(), r = chip.getBoundingClientRect(), gutter = 16, dx = 0;
        if (r.left < box.left + gutter) dx = r.left - box.left - gutter;
        else if (r.right > box.right - gutter) dx = r.right - box.right + gutter;
        if (dx) row.scrollLeft += dx;
    }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', show); else show();
    window.addEventListener('load', show);
})();
