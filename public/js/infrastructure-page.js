/* Infrastructure page: small additions to the photos and the coordinator block. Nothing here is needed to read the page.
   1. the photos: a caption under the photo (the image's alt text, when the editors wrote one) and the counter written as "1 / 4"
   2. "Updated: <date>" over the coordinator, when the page has data-updated="YYYY-MM-DD" on .infra-contact */
(function () {
  function gallery(root) {
    var swiper = root.swiper;
    var slides = root.querySelectorAll('.swiper-slide:not(.swiper-slide-duplicate) img');
    if (!swiper || slides.length < 2) return;
    var wrap = root.closest('.infrastructure__slider-wrap');
    var caption = document.createElement('p');
    caption.className = 'infra-caption';
    caption.setAttribute('aria-live', 'polite');
    wrap.appendChild(caption);
    function sync() {
      var i = swiper.realIndex != null ? swiper.realIndex : swiper.activeIndex;
      var alt = (slides[i] && slides[i].getAttribute('alt')) || '';
      caption.textContent = alt && alt !== '#' ? alt : '';
    }
    swiper.on('slideChange', sync); sync();
    var counter = wrap.querySelector('.counter');
    if (counter) {
      var fix = function () { var t = counter.textContent; var f = t.replace(/\s*\/\s*/, ' / '); if (f !== t) counter.textContent = f; };
      new MutationObserver(fix).observe(counter, { childList: true, subtree: true, characterData: true }); fix();
    }
  }
  function updated() {
    var box = document.querySelector('.infra-contact[data-updated]');
    if (!box) return;
    var d = new Date(box.getAttribute('data-updated'));
    if (isNaN(d)) return;
    var p = document.createElement('p');
    p.className = 'infra-updated';
    p.textContent = 'Need updated: ' + d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
    var note = box.querySelector('.infra-help-note');
    if (note) note.after(p);
  }
  /* the tags are painted by the squircle worklet, which the page adds a little later; tags drawn before it arrived would stay
     blank, so they are swapped for copies of themselves once it is there */
  function repaint() { document.querySelectorAll('.infra-chips .tag').forEach(function (el) { el.replaceWith(el.cloneNode(true)); }); }
  function init() { document.querySelectorAll('.swiper-gallery').forEach(gallery); updated(); repaint(); setTimeout(repaint, 1200); }
  if (document.readyState === 'complete') init(); else window.addEventListener('load', init);
})();

/* Escape closes the help form (the X and the dimmed page already do) */
document.addEventListener('keydown', function (e) {
  if (e.key !== 'Escape') return;
  var open = document.querySelector('.person-card__help.active [data-popup-close]');
  if (open) open.click();
});

/* The help form is moved to the end of <body> so that it is a dialog over the whole page (inside the sticky block it would
   sit under the photos and the header). Without the script it stays where it is. */
(function () {
  function lift() {
    var pop = document.querySelector('.infra-contact [data-popup="help"]');
    if (!pop) return;
    pop.classList.add('infra-popup');
    document.body.appendChild(pop);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', lift); else lift();
})();
