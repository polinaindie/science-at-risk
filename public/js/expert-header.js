/* Scientist profile: the header leaves when you scroll down and comes back as soon as you scroll up.
   It is hidden only by a class, so without this script the header simply stays at the top. */
(function () {
  var header = document.querySelector('.satr-chrome--header');
  if (!header) return;

  var lastY = window.scrollY;
  var ticking = false;
  var THRESHOLD = 8; // ignore tiny jitters
  var HIDE_AFTER = 120; // never hide while the page is still near the top

  function menuOpen() {
    return !!header.querySelector('[aria-expanded="true"]') || header.contains(document.activeElement);
  }

  function update() {
    var y = Math.max(window.scrollY, 0);
    var delta = y - lastY;
    header.classList.toggle('is-stuck', y > 24);

    if (y < HIDE_AFTER || menuOpen()) {
      header.classList.remove('is-hidden');
    } else if (delta > THRESHOLD) {
      header.classList.add('is-hidden');
    } else if (delta < -THRESHOLD) {
      header.classList.remove('is-hidden');
    }
    if (Math.abs(delta) > THRESHOLD) lastY = y;
    ticking = false;
  }

  window.addEventListener('scroll', function () {
    if (!ticking) {
      ticking = true;
      window.requestAnimationFrame(update);
    }
  }, { passive: true });

  header.addEventListener('focusin', function () { header.classList.remove('is-hidden'); });
  update();
})();
