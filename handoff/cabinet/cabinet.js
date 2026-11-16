/*
 * cabinet.js — progressive enhancement. Every page works without it.
 *   1. Show / hide on password fields (the buttons are hidden until this runs).
 *   2. Autosave for <form data-autosave>: waits for a pause in typing, POSTs the
 *      same form to the same URL with intent=autosave and Accept: application/json,
 *      and updates the status line. Without JS the form is an ordinary POST
 *      with a "Save draft" button.
 * The transport can be replaced (window.satrAutosaveTransport) — the sample
 * pages do that in demo.js so no server is needed.
 */
(function () {
  document.documentElement.classList.add('js');

  document.querySelectorAll('[data-reveal]').forEach(function (btn) {
    var input = document.getElementById(btn.getAttribute('aria-controls'));
    if (!input) return;
    btn.hidden = false;
    btn.addEventListener('click', function () {
      var show = input.type === 'password';
      input.type = show ? 'text' : 'password';
      btn.textContent = show ? btn.dataset.hide : btn.dataset.show;
      btn.setAttribute('aria-pressed', show ? 'true' : 'false');
    });
  });

  function setState(ind, state, time) {
    ind.dataset.state = state;
    var text = ind.dataset['t' + state.charAt(0).toUpperCase() + state.slice(1)] || '';
    ind.querySelector('[data-save-text]').textContent = text.replace('{time}', time || '');
  }

  function defaultTransport(form) {
    var data = new FormData(form);
    data.set('intent', 'autosave');
    return fetch(form.action, {
      method: 'POST',
      body: data,
      headers: { Accept: 'application/json' },
      credentials: 'same-origin',
    }).then(function (r) {
      if (!r.ok) throw new Error('save failed');
    });
  }

  document.querySelectorAll('form[data-autosave]').forEach(function (form) {
    var ind = form.querySelector('[data-save]');
    if (!ind) return;
    var timer = null;
    var seq = 0;
    function save() {
      var mine = ++seq;
      setState(ind, 'saving');
      var send = window.satrAutosaveTransport || defaultTransport;
      Promise.resolve()
        .then(function () { return send(form); })
        .then(function () {
          if (mine !== seq) return;
          var d = new Date();
          var hh = ('0' + d.getHours()).slice(-2) + ':' + ('0' + d.getMinutes()).slice(-2);
          setState(ind, 'saved', hh);
        })
        .catch(function () { if (mine === seq) setState(ind, 'failed'); });
    }
    form.addEventListener('input', function () {
      clearTimeout(timer);
      timer = setTimeout(save, 900);
    });
  });
})();
