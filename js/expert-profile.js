/* Scientist profile, behaviour. Four small independent pieces, each in its own function:
   1. the header leaves on scroll down and returns on scroll up
   2. the name, post and institution repeat under the photo once the big ones have scrolled away
   3. the right column's top edge is level with the photo's
   4. the Write button shows the languages to write in
   Nothing here is needed to read the page: without the script everything simply stays in place. */

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

/* Scientist profile, wide screens: once the name, degree, institution and languages have scrolled out of view,
   a smaller copy appears in the sticky left column, under the photo and above the Write button. */
(function () {
  var aside = document.querySelector('.expert-profile > .col-lg-4 > .aside');
  var id = document.querySelector('.expert-id');
  if (!aside || !id) return;
  var photo = aside.querySelector('picture.aside__img');
  if (!photo) return;

  var lang = document.querySelector('.aside__mobile .aside__lang-text');
  var name = id.querySelector('.expert__header');
  var degree = id.querySelector('.paragraph:not(.expert__affiliation)');
  var place = id.querySelector('.expert__affiliation');

  var box = document.createElement('div');
  box.className = 'aside-mini';
  box.setAttribute('aria-hidden', 'true'); // a repeat of what the page already says
  var inner = document.createElement('div');
  inner.className = 'aside-mini__inner';
  [[name, 'aside-mini__name'], [degree, 'aside-mini__line'], [place, 'aside-mini__line aside-mini__place']]
    .forEach(function (p) {
      if (!p[0] || !p[0].textContent.trim()) return;
      var el = document.createElement('p');
      el.className = p[1];
      el.textContent = p[0].textContent.trim();
      inner.appendChild(el);
    });
  if (!inner.firstChild) return;
  box.appendChild(inner);
  photo.insertAdjacentElement('afterend', box);

  var last = lang || place || degree || name;
  var ticking = false;
  function update() {
    ticking = false;
    var gone = last.getBoundingClientRect().bottom < 72;
    box.classList.toggle('is-on', gone && window.innerWidth >= 768);
  }
  window.addEventListener('scroll', function () {
    if (!ticking) { ticking = true; window.requestAnimationFrame(update); }
  }, { passive: true });
  window.addEventListener('resize', update);
  update();
})();

/* Scientist profile, wide screens: the name's top edge sits level with the photo's top edge.
   The breadcrumbs ride above the photo in the left column, so the right column steps down by their height. */
(function () {
  var right = document.querySelector('.expert-profile > .col-lg-8');
  var crumbs = document.querySelector('.expert-profile > .col-lg-4 .aside > .breadcrumbs');
  if (!right || !crumbs) return;
  function align() {
    if (window.innerWidth < 768) { right.style.paddingTop = ''; return; }
    var gap = parseFloat(getComputedStyle(crumbs).marginBottom) || 0;
    // minus the empty space above the capitals in the 36px heading's line box
    right.style.paddingTop = Math.max(crumbs.offsetHeight + gap - 8, 0) + 'px';
  }
  window.addEventListener('resize', align);
  window.addEventListener('load', align);
  align();
})();

/* Scientist profile, wide screens: hovering (or focusing) the Write button shows, under it, a note saying which languages to write in. */
(function () {
  var aside = document.querySelector('.expert-profile > .col-lg-4 > .aside');
  var btn = aside && aside.querySelector(':scope > .aside__contact');
  var lang = document.querySelector('.aside__mobile .aside__lang-text');
  if (!btn || !lang || !lang.textContent.trim()) return;

  var tip = document.createElement('div');
  tip.className = 'contact-tip';
  tip.id = 'contact-tip';
  tip.setAttribute('role', 'tooltip');
  tip.textContent = 'Communicates in: ' + lang.textContent.trim();
  aside.appendChild(tip);
  btn.setAttribute('aria-describedby', tip.id);

  function show() {
    tip.style.width = btn.offsetWidth + 'px';
    tip.style.left = btn.offsetLeft + 'px';
    tip.style.top = (btn.offsetTop + btn.offsetHeight + 8) + 'px';
    tip.classList.add('is-on');
  }
  function hide() { tip.classList.remove('is-on'); }
  btn.addEventListener('mouseenter', show);
  btn.addEventListener('focus', show);
  btn.addEventListener('mouseleave', hide);
  btn.addEventListener('blur', hide);
})();
