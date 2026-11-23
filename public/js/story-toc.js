/* Story pages: the sections of the article, listed in the right column, each a link to its heading.
   Shown from three sections up (two sections are not worth a menu). The author and the photographer stay where they are,
   at the top of the column, and scroll away; the menu sticks (css/pages/story-toc.css). The sections are the article's
   second-level headings; when an article has fewer than three of those, its third-level headings. Without the script
   the column is just the credits. */
(function () {
  var cols = document.querySelectorAll('.story .col-md-9');
  var col = cols[1] || cols[0];
  var aside = document.querySelector('.story .storyAside');
  if (!col || !aside || !aside.parentNode) return;

  var heads = col.querySelectorAll('h2.heading');
  if (heads.length < 3) heads = col.querySelectorAll('h3.heading');
  if (heads.length < 3) return;

  var uk = (document.documentElement.lang || '').slice(0, 2) === 'uk';
  var nav = document.createElement('nav');
  nav.className = 'story-toc';
  nav.setAttribute('aria-label', uk ? 'У цій статті' : 'In this article');
  var title = document.createElement('p');
  title.className = 'story-toc__title';
  title.textContent = uk ? 'У цій статті' : 'In this article';
  var ul = document.createElement('ul');
  nav.appendChild(title);
  nav.appendChild(ul);

  var links = [];
  Array.prototype.forEach.call(heads, function (h, i) {
    var copy = h.cloneNode(true);
    Array.prototype.forEach.call(copy.querySelectorAll('sup'), function (x) { x.remove(); }); /* footnote marks are not part of the name */
    var text = copy.textContent.replace(/\s+/g, ' ').trim();
    if (!text) return;
    if (!h.id) h.id = 'section-' + (i + 1);
    var li = document.createElement('li');
    var a = document.createElement('a');
    a.href = '#' + h.id;
    a.textContent = text;
    li.appendChild(a);
    ul.appendChild(li);
    links.push({ a: a, h: h });
  });
  if (links.length < 3) return;
  aside.parentNode.appendChild(nav);

  /* the section being read: the last heading that has gone past the top edge */
  function mark() {
    var current = null;
    for (var i = 0; i < links.length; i++) {
      if (links[i].h.getBoundingClientRect().top <= 160) current = links[i]; else break;
    }
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
  mark();
})();
