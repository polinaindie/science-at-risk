import fs from 'node:fs';
import path from 'node:path';
import { entries } from './copy.mjs';
const OUT = '/Users/ppetri/CascadeProjects/transfer-app/Science at risk/public/handoff/cabinet';
const dict = { en: {}, uk: {} };
for (const e of entries) if (e.key) { dict.en[e.key] = e.en; dict.uk[e.key] = e.uk; }

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const mk = (lang) => (key, vars = {}) => {
  let s = dict[lang][key];
  if (s === undefined) throw new Error('missing key ' + key);
  s = esc(s);
  return s.replace(/\{(\w+)\}/g, (m, k) => (k in vars ? vars[k] : m));
};
const write = (rel, content) => { const f = path.join(OUT, rel); fs.mkdirSync(path.dirname(f), { recursive: true }); fs.writeFileSync(f, content); };

/* ---------- YAML ---------- */
for (const lang of ['en', 'uk']) {
  let y = `# Cabinet microcopy, ${lang === 'uk' ? 'Ukrainian (primary for scientists)' : 'English'}.\n# One flat dictionary: dotted keys, double-quoted values. {name} = a placeholder the server fills in.\n# "# new" marks a text written for this handoff; unmarked texts come from src/components/Cabinet/cabinetCopy.ts or src/components/Auth/authCopy.ts.\n# Same keys, same order in both files: run  node check-microcopy.mjs\n`;
  for (const e of entries) {
    if (e.section) y += `\n# ---- ${e.section}\n`;
    else y += `${e.key}: ${JSON.stringify(e[lang])}${e.isNew ? ' # new' : ''}\n`;
  }
  write(`microcopy.${lang}.yaml`, y);
}
write('check-microcopy.mjs', `// Verifies microcopy.uk.yaml and microcopy.en.yaml: same keys in the same order,
// no empty values, same {placeholders} in both. No dependencies.  node check-microcopy.mjs
import fs from 'node:fs';
const dir = new URL('.', import.meta.url);
const load = (l) => {
  const out = [];
  fs.readFileSync(new URL('microcopy.' + l + '.yaml', dir), 'utf8').split('\\n').forEach((line, i) => {
    if (!line || line.startsWith('#')) return;
    const m = line.match(/^([A-Za-z0-9_.]+): ("(?:[^"\\\\]|\\\\.)*")( # new)?$/);
    if (!m) { console.error(l + ':' + (i + 1) + ' cannot parse: ' + line); process.exitCode = 1; return; }
    out.push([m[1], JSON.parse(m[2])]);
  });
  return out;
};
const en = load('en'), uk = load('uk');
let bad = 0;
const fail = (s) => { console.error(s); bad++; };
if (en.length !== uk.length) fail('different number of keys: en ' + en.length + ', uk ' + uk.length);
en.forEach(([k, v], i) => {
  const u = uk[i];
  if (!u || u[0] !== k) return fail('key mismatch at ' + (i + 1) + ': en ' + k + ' / uk ' + (u && u[0]));
  if (!v.trim() || !u[1].trim()) fail('empty value: ' + k);
  const ph = (s) => (s.match(/\\{\\w+\\}/g) || []).sort().join();
  if (ph(v) !== ph(u[1])) fail('placeholders differ: ' + k);
});
if (new Set(en.map((e) => e[0])).size !== en.length) fail('duplicate keys');
console.log(bad ? bad + ' problem(s)' : 'OK: ' + en.length + ' keys, en and uk match');
process.exit(bad ? 1 : 0);
`);

/* ---------- shell and components ---------- */
const SAMPLE = { mail: 'n•••@example.org', id: 'R-2026-0412', date: { en: '12 November 2026', uk: '12 листопада 2026' } };

function shell(lang, { file, title, h1Html, body, variant = 'guest', current = '', width = 'narrow', demo = true }) {
  const t = mk(lang), uk = lang === 'uk', base = uk ? '../' : '';
  const altHref = uk ? `../${file}` : `uk/${file}`;
  const nav = variant === 'account' ? `
<nav class="cnav" aria-label="${t('common.nav.label')}"><div class="cnav__in">
<ul class="cnav__list"><li><a href="account.html"${current === 'account' ? ' aria-current="page"' : ''}>${t('nav.profile')}</a></li><li><a href="requests.html"${current === 'requests' ? ' aria-current="page"' : ''}>${t('nav.requests')}</a></li></ul>
<form method="post" action="/logout"><input type="hidden" name="_csrf" value="csrf-token"><button type="submit">${t('nav.logout')}</button></form>
</div></nav>` : '';
  return `<!DOCTYPE html>
<html lang="${lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>${esc(title)} — Science At Risk</title>
<link rel="alternate" hreflang="${uk ? 'en' : 'uk'}" href="${altHref}">
<link rel="stylesheet" href="${base}../tokens.css">
<link rel="stylesheet" href="${base}cabinet.css">
<script src="${base}cabinet.js" defer></script>${demo ? `\n<script src="${base}demo.js" defer></script>` : ''}
</head>
<body>
<a class="skip" href="#main">${t('common.skip')}</a>
<header class="hdr"><div class="hdr__in">
<a class="hdr__logo" href="/" aria-label="${t('common.site')}">SC!ENCE AT R!SK!</a>
<nav class="lang" aria-label="${t('common.lang.label')}">${uk
    ? `<a lang="en" hreflang="en" href="${altHref}">${t('common.lang.en')}</a><span aria-hidden="true">/</span><span lang="uk" aria-current="true">${t('common.lang.uk')}</span>`
    : `<span lang="en" aria-current="true">${t('common.lang.en')}</span><span aria-hidden="true">/</span><a lang="uk" hreflang="uk" href="${altHref}">${t('common.lang.uk')}</a>`}</nav>
</div></header>${nav}
<main id="main" class="wrap wrap--${width}" tabindex="-1">
${h1Html || ''}
${body}
</main>
<footer class="ftr"><div class="ftr__in"><p>${t('common.footer')}</p><p data-handoff-only><a href="${uk ? 'index.html' : 'index.html'}">${uk ? 'Мапа екранів' : 'Map of screens'}</a></p></div></footer>
</body>
</html>
`;
}

const h1 = (txt) => `<h1 class="title">${txt}</h1>`;
function field(t, o) {
  const { id, name = id, label, type = 'text', value = '', hint, error, req, auto, mode, textarea, rows = 5, readonly, extra = '', cls = '', reveal, noReq } = o;
  const desc = [hint && !error ? id + '-hint' : '', error ? id + '-err' : ''].filter(Boolean).join(' ');
  const attrs = `id="${id}" name="${name}"${desc ? ` aria-describedby="${desc}"` : ''}${error ? ' aria-invalid="true"' : ''}${req ? ' aria-required="true"' : ''}${auto ? ` autocomplete="${auto}"` : ''}${mode ? ` inputmode="${mode}"` : ''}${readonly ? ' readonly' : ''} ${extra}`;
  const control = textarea ? `<textarea ${attrs} rows="${rows}">${esc(value)}</textarea>` : `<input ${attrs} type="${type}" value="${esc(value)}">`;
  return `<div class="field ${cls}"${error ? ' data-invalid="true"' : ''}>
<label for="${id}">${label}${req ? ` <span class="req" aria-hidden="true">*</span>` : ''}</label>
${control}${reveal ? `<button type="button" class="reveal" data-reveal aria-controls="${id}" aria-pressed="false" data-show="${t('common.show')}" data-hide="${t('common.hide')}" hidden>${t('common.show')}</button>` : ''}
${error ? `<p class="err" id="${id}-err">${error}</p>` : hint ? `<p class="hint" id="${id}-hint">${hint}</p>` : ''}
</div>`;
}
const summary = (t, items) => `<div class="alert" role="alert"><span class="alert__title">${t('form.summary')}</span><ul>${items.map(([id, m]) => `<li><a href="#${id}">${m}</a></li>`).join('')}</ul></div>`;
const alert = (msg) => `<div class="alert" role="alert">${msg}</div>`;
const notice = (msg, title) => `<div class="notice" role="status">${title ? `<p class="notice__title">${title}</p>` : ''}<p>${msg}</p></div>`;
const csrf = '<input type="hidden" name="_csrf" value="csrf-token">';
const btn = (txt, cls = '') => `<button class="btn btn--block ${cls}" type="submit">${txt}</button>`;
const link = (href, txt) => `<a class="link" href="${href}">${txt}</a>`;
const spec = (id, title, meta, inner, narrow = true) => `<section class="spec" aria-labelledby="${id}"><h2 class="spec__title" id="${id}">${title}</h2><p class="spec__meta">${meta}</p><div class="spec__box${narrow ? ' spec__box--narrow' : ''}">${inner}</div></section>`;

/* forms (shared by real pages and states specimens) */
const fEmail = (lang, o = {}) => {
  const t = mk(lang), p = o.p || 'em';
  const errs = o.error ? [[p + '-email', o.error]] : [];
  return `<form method="post" action="/login" novalidate data-demo-next="login-code.html">${csrf}
${o.alert ? alert(o.alert) : ''}${errs.length ? summary(t, errs) : ''}
${field(t, { id: p + '-email', name: 'email', label: t('login.email'), type: 'email', value: o.value || '', hint: t('login.emailHint'), error: o.error, req: true, auto: 'username', mode: 'email', extra: 'autocapitalize="none" spellcheck="false"' })}
${btn(t('login.submit'))}
</form>`;
};
const fCode = (lang, o = {}) => {
  const t = mk(lang), p = o.p || 'cd';
  return `<form method="post" action="/login/code" novalidate data-demo-next="account.html">${csrf}
${o.alert ? alert(o.alert) : ''}${o.error ? summary(t, [[p + '-code', o.error]]) : ''}
${field(t, { id: p + '-code', name: 'code', label: t('code.label'), value: o.value || '', hint: t('code.hint'), error: o.error, req: true, auto: 'one-time-code', mode: 'numeric', cls: 'field--code', extra: 'maxlength="6" pattern="[0-9]{6}" spellcheck="false"' })}
${btn(t('code.submit'))}
</form>
<form method="post" action="/login/code/resend" class="row">${csrf}<button class="btn btn--ghost btn--block" type="submit">${t('code.resend')}</button></form>
<p class="small muted row">${t('code.resendWait', { seconds: 30 })}</p>`;
};
const fPwd = (lang, o = {}) => {
  const t = mk(lang), p = o.p || 'pw';
  const errs = [];
  if (o.emailError) errs.push([p + '-email', o.emailError]);
  if (o.pwError) errs.push([p + '-pass', o.pwError]);
  return `<form method="post" action="/login/password" novalidate data-demo-next="account.html">${csrf}
${o.alert ? alert(o.alert) : ''}${errs.length ? summary(t, errs) : ''}
${field(t, { id: p + '-email', name: 'email', label: t('login.email'), type: 'email', value: o.email || '', error: o.emailError, req: true, auto: 'username', mode: 'email', extra: 'autocapitalize="none" spellcheck="false"' })}
${field(t, { id: p + '-pass', name: 'password', label: t('pwd.password'), type: 'password', error: o.pwError, req: true, auto: 'current-password', reveal: true, cls: 'field--reveal', extra: 'spellcheck="false"' })}
${btn(t('pwd.submit'))}
</form>`;
};
const fNewPassword = (lang, o = {}) => {
  const t = mk(lang), p = o.p || 'np', action = o.action || '/invite/TOKEN';
  const errs = [];
  if (o.passError) errs.push([p + '-pass', o.passError]);
  if (o.repError) errs.push([p + '-rep', o.repError]);
  return `<form method="post" action="${action}" novalidate data-demo-next="${o.next || 'account.html'}">${csrf}
${errs.length ? summary(t, errs) : ''}
${field(t, { id: p + '-pass', name: 'password', label: t('invite.password'), type: 'password', error: o.passError, req: true, auto: 'new-password', reveal: true, cls: 'field--reveal', extra: 'spellcheck="false" minlength="10"' })}
<div class="rules"><p id="${p}-rules">${t('invite.rulesTitle')}</p><ul aria-labelledby="${p}-rules"><li>${t('invite.rule.length')}</li><li>${t('invite.rule.letter')}</li><li>${t('invite.rule.digit')}</li></ul></div>
${field(t, { id: p + '-rep', name: 'password_repeat', label: t('invite.repeat'), type: 'password', error: o.repError, req: true, auto: 'new-password', reveal: true, cls: 'field--reveal', extra: 'spellcheck="false"' })}
${btn(o.submit || t('invite.submit'))}
</form>`;
};
const fSingle = (lang, o) => { // one email field, used by invite-resend and reset
  const t = mk(lang), p = o.p;
  return `<form method="post" action="${o.action}" novalidate data-demo-next="${o.next}">${csrf}
${o.error ? summary(t, [[p + '-email', o.error]]) : ''}
${field(t, { id: p + '-email', name: 'email', label: t('login.email'), type: 'email', value: o.value || '', error: o.error, req: true, auto: 'username', mode: 'email', extra: 'autocapitalize="none" spellcheck="false"' })}
${btn(o.submit)}
</form>`;
};
const asideInvite = (t) => `<div class="notice notice--note"><p class="notice__title">${t('login.noInviteTitle')}</p><p>${t('login.noInvite')}</p></div>`;
const maskedEmail = `<span class="mask">${SAMPLE.mail}</span>`;
const sentPage = (lang, titleKey, textKey, vars, backHref, backKey, anotherHref, spamKey) => {
  const t = mk(lang);
  return `<div class="msg"><p class="msg__mark" aria-hidden="true">!!!</p><p class="lede">${t(textKey, vars)}</p><p class="muted">${t(spamKey)}</p>
<p>${link(backHref, t(backKey))}</p><p>${link(anotherHref, t('reset.another'))}</p></div>`;
};
const msgPage = (inner) => `<div class="msg">${inner}</div>`;

export { dict, esc, mk, write, shell, h1, field, summary, alert, notice, csrf, btn, link, spec, fEmail, fCode, fPwd, fNewPassword, fSingle, asideInvite, maskedEmail, sentPage, msgPage, SAMPLE, OUT };
