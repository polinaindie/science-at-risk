/* Video in an article: the third-party player is created only when the visitor presses play.
   Markup: .embed__frame > .embed__poster > a.embed__play[data-embed-src][data-embed-title]. Without this script the link just opens the video. */
document.addEventListener('click', function (e) {
  var a = e.target.closest && e.target.closest('a.embed__play[data-embed-src]');
  if (!a) return;
  e.preventDefault();
  var f = document.createElement('iframe');
  f.src = a.getAttribute('data-embed-src') + (a.getAttribute('data-embed-src').indexOf('?') < 0 ? '?autoplay=1' : '&autoplay=1');
  f.title = a.getAttribute('data-embed-title') || 'Video';
  f.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
  f.allowFullscreen = true;
  f.referrerPolicy = 'strict-origin-when-cross-origin';
  var frame = a.closest('.embed__frame');
  frame.replaceChildren(f);
  f.focus();
});
