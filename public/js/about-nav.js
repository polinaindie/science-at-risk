/* About us: the item of the in-page menu whose section is on the screen is marked (aria-current) for as long as the reader is in that
   section; at the very bottom of the page the last one is. */
(function () {
  var links = [].slice.call(document.querySelectorAll('.about-nav a[href^="#"]')).map(function (a) {
    return { a: a, h: document.getElementById(a.getAttribute('href').slice(1)) };
  }).filter(function (l) { return l.h; });
  if (!links.length) return;
  function mark() {
    var current = null;
    for (var i = 0; i < links.length; i++) {
      if (links[i].h.getBoundingClientRect().top <= 160) current = links[i]; else break;
    }
    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) current = links[links.length - 1];
    links.forEach(function (l) {
      if (l === current) l.a.setAttribute('aria-current', 'true'); else l.a.removeAttribute('aria-current');
    });
  }
  var queued = false;
  window.addEventListener('scroll', function () {
    if (queued) return;
    queued = true;
    requestAnimationFrame(function () { queued = false; mark(); });
  }, { passive: true });
  window.addEventListener('resize', mark);
  mark();
})();
