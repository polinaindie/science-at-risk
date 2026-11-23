(function () {
  /* The date of the document under the rule below the authors, as on its card in the list (research-index.json, the same "date" field). */
  var title = document.querySelector('.paper .mb-5');
  var slug = location.pathname.split('/').pop().replace(/\.html$/, '');
  if (!title || !slug || !window.fetch) return;
  fetch('../js/research-index.json').then(function (r) { return r.json(); }).then(function (data) {
    var doc = (data.docs || []).filter(function (d) { return d.slug === slug; })[0];
    var m = doc && /^(\d{4})-(\d\d)-(\d\d)$/.exec(doc.date || '');
    if (!m) return;
    var t = document.createElement('time');
    t.className = 'paper__date';
    t.setAttribute('datetime', doc.date);
    t.textContent = m[3] + '.' + m[2] + '.' + m[1].slice(2);
    title.parentNode.insertBefore(t, title.nextSibling);
  }).catch(function () {});
})();
/* Research article: the download button sits level with the rule under the author line (its bottom edge on the rule).
   The author block is as tall as the names need, so the offset is measured. Pure addition: without the script the
   button is at the top of its column. Phones have it as the bar below instead. */
(function () {
  /* Phones: the download is a bar at the foot of the screen, as Connect is on a scientist's page. It sits last in the
     page, so it stays at the bottom while the article scrolls and goes up with the page at the footer instead of lying
     over it. Built here from the button the page has (its link and label, and the file size under it); the CSS shows it, and
     hides the original, under 768px. */
  var src = document.querySelector('.paper-aside');
  var link = src && src.querySelector('a.absoluteLink');
  var page = document.querySelector('.page.paper');
  if (link && page) {
    var label = ((src.querySelector('.paper-aside__download') || {}).firstChild || {}).textContent;
    var size = src.querySelector('.paper-aside__size');
    var bar = document.createElement('div');
    bar.className = 'paper-cta';
    var a = document.createElement('a');
    a.className = 'btn btn--black';
    a.href = link.getAttribute('href');
    a.setAttribute('rel', 'nofollow');
    a.textContent = (label || '').trim();
    bar.appendChild(a);
    if (size) { /* the file size under the button, as in the column on wide screens */
      var note = document.createElement('p');
      note.className = 'paper-cta__size';
      note.textContent = size.textContent.replace(/\s+/g, ' ').trim();
      bar.appendChild(note);
    }
    page.appendChild(bar);
  }

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
