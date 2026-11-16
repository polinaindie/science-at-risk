/*
 * demo.js — ONLY for these sample pages. Not for production.
 * A static server cannot accept POST, so this lets a reviewer click through:
 *   - forms with data-demo-next go to that sample page instead of posting;
 *   - autosave is faked (add ?fail to the URL to see the "failed" state).
 */
(function () {
  document.querySelectorAll('form[data-demo-next]').forEach(function (f) {
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      location.href = f.dataset.demoNext;
    });
  });
  window.satrAutosaveTransport = function () {
    return new Promise(function (ok, no) {
      setTimeout(function () { if (/[?&]fail/.test(location.search)) no(new Error('demo')); else ok(); }, 700);
    });
  };
})();
