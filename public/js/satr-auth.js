/*
 * satr-auth.js — behaviour of the cabinet's sign-in screens on the static
 * pages. No copy lives here: every message is read from the markup
 * (`data-msg-*` on the form and its fields), so the server owns the words.
 *
 * What the demo does, so the screens can be walked through end to end:
 *   login        email + password. Empty/invalid fields → messages; a password
 *                of "wrong" → the server's error; anything else → on to the
 *                cabinet (`data-next`). `?state=invalid` shows the error.
 *   first-login  email + one-time password from the letter. "wrong" or
 *                "expired" → the server errors; anything else → on to choosing
 *                a password. `?state=invalid|expired` shows that error.
 *   set-password live checklist and strength meter; mismatch → message;
 *                valid → "password saved".
 *   forgot       empty/invalid email → message; valid → "check your email"
 *                (the same screen for every address).
 * The real backend replaces the `go()` calls with the form's own POST.
 */
(() => {
  const $ = (root, sel) => root.querySelector(sel);
  const $$ = (root, sel) => Array.from(root.querySelectorAll(sel));

  const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  const MIN = 10;

  /* ---------- field messages ---------- */
  const fieldBox = (input) => input.closest('.satr-auth__field');

  function showError(input, text) {
    const box = fieldBox(input);
    const hint = $(box, '[data-satr-hint]');
    const err = $(box, '[data-satr-error]');
    box.dataset.invalid = 'true';
    input.setAttribute('aria-invalid', 'true');
    err.textContent = text;
    err.hidden = false;
    if (hint) hint.hidden = true;
  }

  function clearError(input) {
    const box = fieldBox(input);
    const hint = $(box, '[data-satr-hint]');
    const err = $(box, '[data-satr-error]');
    delete box.dataset.invalid;
    input.removeAttribute('aria-invalid');
    err.hidden = true;
    err.textContent = '';
    if (hint) hint.hidden = !hint.textContent.trim();
  }

  /** Empty or malformed → show the field's message and say so. */
  function checkRequired(input) {
    const value = input.value.trim();
    if (!value) {
      showError(input, input.dataset.msgRequired);
      return false;
    }
    if (input.type === 'email' && !EMAIL.test(value)) {
      showError(input, input.dataset.msgInvalid || input.dataset.msgRequired);
      return false;
    }
    clearError(input);
    return true;
  }

  /* ---------- the busy button ---------- */
  function busy(button, on) {
    if (on) {
      button.dataset.label = button.textContent;
      button.setAttribute('aria-busy', 'true');
      button.disabled = true;
      button.insertAdjacentHTML(
        'beforeend',
        '<span class="satr-auth__sr"> ' + (button.dataset.busyLabel || '') + '</span>',
      );
    } else {
      button.removeAttribute('aria-busy');
      button.disabled = false;
      button.textContent = button.dataset.label || button.textContent;
    }
  }

  const go = (href) => {
    window.location.href = href;
  };

  const alertBox = (form) => $(form, '[data-satr-alert]');
  function showAlert(form, key) {
    const box = alertBox(form);
    if (!box) return;
    box.textContent = form.dataset[key === 'expired' ? 'msgExpired' : 'msgInvalid'];
    box.hidden = false;
  }

  /* ---------- show / hide password ---------- */
  $$(document, '[data-satr-reveal]').forEach((btn) => {
    const input = document.getElementById(btn.getAttribute('aria-controls'));
    btn.addEventListener('click', () => {
      const show = input.type === 'password';
      input.type = show ? 'text' : 'password';
      btn.textContent = show ? btn.dataset.hide : btn.dataset.show;
      btn.setAttribute('aria-pressed', String(show));
    });
  });

  /* ---------- login and first login ---------- */
  // Both are "email + a secret": the password, or the one-time password.
  $$(document, 'form[data-satr-auth="login"], form[data-satr-auth="first-login"]').forEach((form) => {
    const email = $(form, '[name=email]');
    const secret = $(form, '[name=password], [name=otp]');
    const button = $(form, 'button[type=submit]');

    const state = new URLSearchParams(location.search).get('state');
    if (state === 'invalid' || state === 'expired') showAlert(form, state);

    [email, secret].forEach((input) => {
      input.addEventListener('input', () => {
        if (fieldBox(input).dataset.invalid) clearError(input);
        const box = alertBox(form);
        if (box) box.hidden = true;
      });
    });

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const box = alertBox(form);
      if (box) box.hidden = true;
      const okEmail = checkRequired(email);
      const okSecret = checkRequired(secret);
      if (!okEmail || !okSecret) {
        (okEmail ? secret : email).focus();
        return;
      }
      busy(button, true);
      setTimeout(() => {
        const code = secret.value.trim().toLowerCase();
        if (code === 'wrong' || code === 'expired') {
          busy(button, false);
          showAlert(form, code === 'expired' ? 'expired' : 'invalid');
          return;
        }
        // The password from the invitation letter ("firstpassword" in the demo): first choose a
        // password of your own, then the cabinet opens on an empty profile (the fill-in wizard).
        if (code === 'firstpassword') {
          // A new invitation starts from nothing: drop any half-filled draft the demo kept in this browser.
          try {
            localStorage.removeItem('satr-first-fill');
          } catch (e) {
            /* nothing stored, nothing to drop */
          }
          go('set-password.html?then=welcome');
          return;
        }
        go(form.dataset.next);
      }, 900);
    });
  });

  /* ---------- set password ---------- */
  // The same rules as src/components/Auth/passwordStrength.ts.
  const rulesOf = (v) => ({
    length: v.length >= MIN,
    letter: /\p{L}/u.test(v),
    digit: /\d/.test(v),
  });
  const levelOf = (v) => {
    if (!v) return 0;
    const r = rulesOf(v);
    if (!(r.length && r.letter && r.digit)) return 1;
    const long = v.length >= 14 ? 1 : 0;
    const varied =
      /[^\p{L}\d\s]/u.test(v) || (/\p{Lu}/u.test(v) && /\p{Ll}/u.test(v)) ? 1 : 0;
    return 2 + long + varied;
  };

  $$(document, 'form[data-satr-auth="set-password"]').forEach((form) => {
    const pass = $(form, '[name=password]');
    const repeat = $(form, '[name=repeat]');
    const button = $(form, 'button[type=submit]');
    const meter = $(form, '[data-satr-meter]');
    const label = $(form, '[data-satr-meter-label]');
    const levels = (form.dataset.levels || '').split('|');

    const paint = () => {
      const v = pass.value;
      const r = rulesOf(v);
      $$(form, '[data-rule]').forEach((li) => {
        li.dataset.met = String(r[li.dataset.rule]);
      });
      const level = levelOf(v);
      meter.dataset.level = String(level);
      label.textContent = level ? levels[level - 1] : '—';
    };
    paint();

    pass.addEventListener('input', () => {
      paint();
      if (fieldBox(pass).dataset.invalid) clearError(pass);
      if (repeat.value && fieldBox(repeat).dataset.invalid && pass.value === repeat.value) {
        clearError(repeat);
      }
    });
    repeat.addEventListener('input', () => {
      if (fieldBox(repeat).dataset.invalid) clearError(repeat);
    });
    repeat.addEventListener('blur', () => {
      if (repeat.value && repeat.value !== pass.value) showError(repeat, form.dataset.msgMismatch);
    });

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      let first = null;
      if (!checkRequired(pass)) first = first || pass;
      else {
        const r = rulesOf(pass.value);
        if (!(r.length && r.letter && r.digit)) {
          showError(pass, form.dataset.msgTooWeak);
          first = first || pass;
        }
      }
      if (!checkRequired(repeat)) first = first || repeat;
      else if (repeat.value !== pass.value) {
        showError(repeat, form.dataset.msgMismatch);
        first = first || repeat;
      }
      if (first) return first.focus();
      busy(button, true);
      // Coming from the invitation letter the next thing is the cabinet, not a new sign-in.
      const toWelcome = new URLSearchParams(location.search).get('then') === 'welcome';
      const welcome = location.pathname.replace(/[^/]*$/, '').replace(/uk\/$/, '') + 'cabinet/welcome';
      setTimeout(() => go(toWelcome ? welcome : form.dataset.next || 'password-saved.html'), 900);
    });
  });

  /* ---------- forgot password ---------- */
  $$(document, 'form[data-satr-auth="forgot"]').forEach((form) => {
    const email = $(form, '[name=email]');
    const button = $(form, 'button[type=submit]');
    email.addEventListener('input', () => {
      if (fieldBox(email).dataset.invalid) clearError(email);
    });
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      if (!checkRequired(email)) return email.focus();
      busy(button, true);
      // The same page for every address: nothing says who is registered.
      setTimeout(() => go(form.dataset.next || 'link-sent.html'), 900);
    });
  });
})();
