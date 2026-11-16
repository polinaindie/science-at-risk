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
