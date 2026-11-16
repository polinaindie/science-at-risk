/* Research article: the download button sits level with the rule under the author line (its bottom edge on the rule).
   The author block is as tall as the names need, so the offset is measured. Pure addition: without the script the
   button is at the top of its column. Phones keep the button on top, unshifted. */
(function () {
  var aside = document.querySelector('.paper-aside');
  var btn = aside && aside.querySelector('.paper-aside__download');
  var rule = document.querySelector('.paper .mb-5');
  if (!btn || !rule) return;
  function align() {
    aside.style.marginTop = '';
    if (window.innerWidth < 768) return;
    var gap = rule.getBoundingClientRect().bottom - btn.getBoundingClientRect().bottom;
    if (gap > 0) aside.style.marginTop = Math.round(gap) + 'px';
  }
  window.addEventListener('resize', align);
  window.addEventListener('load', align);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(align);
  align();
})();
