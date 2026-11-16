import * as B from './build.mjs';
const { mk, write, shell, h1, field, summary, alert, notice, csrf, btn, link, spec, fEmail, fCode, fPwd, fNewPassword, fSingle, asideInvite, maskedEmail, sentPage, msgPage, SAMPLE, esc } = B;

const STATUSES = ['draft', 'submitted', 'in_review', 'changes_requested', 'approved', 'rejected', 'live'];
const badge = (t, s) => `<span class="badge badge--${s}">${t('status.' + s + '.label')}</span>`;
const save = (t, state, time = '14:32') => `<p class="save" role="status" data-save data-state="${state}" data-t-idle="${t('save.idle')}" data-t-saving="${t('save.saving')}" data-t-saved="${t('save.saved', { time: '{time}' })}" data-t-failed="${t('save.failed')}"><span class="save__icon" aria-hidden="true"></span><span data-save-text>${t('save.' + state, { time })}</span></p>`;

/* profile form */
function profileForm(lang, o = {}) {
  const t = mk(lang), uk = lang === 'uk';
  const lock = !!o.locked;
  const ro = lock ? 'readonly' : '';
  const v = uk
    ? { nameUk: 'Шевченко Олена Іванівна', nameEn: 'Olena Shevchenko', phone: '+380 50 000 00 00', inst: 'Інститут прикладних досліджень, Київ', act: 'Я досліджую вплив воєнних дій на екосистеми річок. Керую невеликою групою в інституті.', area: 'гідроекологія; якість води; моніторинг річок' }
    : { nameUk: 'Шевченко Олена Іванівна', nameEn: 'Olena Shevchenko', phone: '+380 50 000 00 00', inst: 'Institute of Applied Research, Kyiv', act: 'I study how military action affects river ecosystems. I lead a small group at the institute.', area: 'hydroecology; water quality; river monitoring' };
  const opts = (arr, sel) => `<option value="">${t('account.select')}</option>` + arr.map((x, i) => `<option value="${i}"${i === sel ? ' selected' : ''}>${esc(x)}</option>`).join('');
  const D = { en: { degree: ['Candidate of Sciences / PhD', 'Doctor of Sciences', 'Other'], rank: ['None', 'Associate Professor', 'Senior Researcher', 'Professor'] }, uk: { degree: ['Кандидат наук / Доктор філософії', 'Доктор наук', 'Інше'], rank: ['Немає', 'Доцент', 'Старший дослідник', 'Професор'] } }[lang];
  const sel = (id, label, arr, s) => `<div class="field"><label for="${id}">${label}</label><select id="${id}" name="${id}"${lock ? ' disabled' : ''}>${opts(arr, s)}</select></div>`;
  const bar = lock
    ? `<div class="bar bar--locked"><p class="alert bar__help" role="note" id="blocked-why" style="margin:0"><span class="alert__title">${t('submit.blocked.title')}.</span> ${t('submit.blocked.text')} <a href="request.html">${t('submit.blocked.link')}</a></p>
${save(t, 'idle').replace('data-save ', '')}
<button class="btn" type="submit" name="intent" value="submit" disabled aria-describedby="blocked-why">${t('submit.button')}</button></div>`
    : `<div class="bar">${save(t, o.saveState || 'idle')}
<button class="btn btn--ghost" type="submit" name="intent" value="save">${t('save.button')}</button>
<button class="btn" type="submit" name="intent" value="submit" style="order:3">${t('submit.button')}</button>
<p class="small muted bar__help">${t('submit.help')}</p></div>`;
  return `<form method="post" action="/account" enctype="multipart/form-data" novalidate ${lock ? '' : 'data-autosave '}data-demo-next="requests.html">${csrf}
<fieldset class="group"><legend>${t('account.group.photo')}</legend>
<div class="field"><label for="f-photo">${t('account.field.photo')}</label><input id="f-photo" name="photo" type="file" accept="image/jpeg,image/png" aria-describedby="f-photo-hint"${lock ? ' disabled' : ''}><p class="hint" id="f-photo-hint">${t('account.hint.photo')}</p></div></fieldset>
<fieldset class="group"><legend>${t('account.group.contacts')}</legend>
${field(t, { id: 'f-nameUk', name: 'name_uk', label: t('account.field.nameUk'), value: v.nameUk, hint: t('account.hint.nameUk'), readonly: true })}
${field(t, { id: 'f-email', name: 'email', label: t('account.field.email'), value: SAMPLE.mail, hint: t('account.hint.email'), readonly: true })}
${field(t, { id: 'f-nameEn', name: 'name_en', label: t('account.field.nameEn'), value: v.nameEn, hint: t('account.hint.nameEn'), readonly: lock, req: true })}
${field(t, { id: 'f-phone', name: 'phone', label: t('account.field.phone'), type: 'tel', value: v.phone, hint: t('account.hint.phone'), auto: 'tel', readonly: lock })}
</fieldset>
<fieldset class="group"><legend>${t('account.group.science')}</legend>
${sel('f-degree', t('account.field.degree'), D.degree, 0)}
${sel('f-rank', t('account.field.rank'), D.rank, 2)}
${field(t, { id: 'f-inst', name: 'institution', label: t('account.field.institution'), value: v.inst, readonly: lock, req: true })}
${field(t, { id: 'f-act', name: 'activity', label: t('account.field.activity'), value: v.act, textarea: true, readonly: lock, req: true })}
${field(t, { id: 'f-area', name: 'area', label: t('account.field.area'), value: v.area, textarea: true, rows: 3, readonly: lock, req: true })}
</fieldset>
<fieldset class="group"><legend>${t('account.group.links')}</legend>
${field(t, { id: 'f-orcid', name: 'orcid', label: t('account.field.orcid'), type: 'url', value: 'https://orcid.org/0000-0000-0000-0000', readonly: lock, extra: 'inputmode="url"' })}
${field(t, { id: 'f-linkedin', name: 'linkedin', label: t('account.field.linkedin'), type: 'url', value: '', readonly: lock, extra: 'inputmode="url"' })}
</fieldset>
<section class="group" aria-labelledby="en-h" style="text-align:left;margin-bottom:0"><h2 class="h2" id="en-h" style="margin-top:0">${t('en.title')} <span class="badge badge--en badge--en-outdated">${t('en.outdated.badge')}</span></h2>
<p>${t('en.outdated.text')}</p><p class="muted small" style="margin-top:8px">${t('en.nameOnly')}</p></section>
${bar}
</form>`;
}

const pages = {};
const P = (file, fn) => { pages[file] = fn; };

/* sign-in */
P('login.html', (L) => { const t = mk(L); return { title: t('login.title'), h1: h1(t('login.title')), body: `<p class="lede">${t('login.lede')}</p>${fEmail(L)}
<p class="row">${link('login-password.html', t('login.usePassword'))}</p><p>${link('invite-resend.html', t('login.lostInvite'))}</p>${asideInvite(t)}` }; });
P('login-code.html', (L) => { const t = mk(L); return { title: t('code.title'), h1: h1(t('code.title')), body: `<p class="lede">${t('code.lede', { email: maskedEmail, minutes: 10 })}</p><p class="muted small" style="margin:-16px 0 24px">${t('code.spam')}</p>${fCode(L)}
<p class="row">${link('login.html', t('code.otherEmail'))}</p><p>${link('login-password.html', t('login.usePassword'))}</p>` }; });
P('login-password.html', (L) => { const t = mk(L); return { title: t('pwd.title'), h1: h1(t('pwd.title')), body: `<p class="lede">${t('pwd.lede')}</p>${fPwd(L)}
<p class="row">${link('reset-request.html', t('pwd.forgot'))}</p><p>${link('login.html', t('pwd.useCode'))}</p>` }; });
P('invite.html', (L) => { const t = mk(L); return { title: t('invite.title'), h1: h1(t('invite.title')), body: `<p class="lede">${t('invite.lede')}</p>${notice(`${t('invite.for', { email: maskedEmail })} ${t('invite.valid', { days: 14 })}`)}${fNewPassword(L)}` }; });
P('invite-resend.html', (L) => { const t = mk(L); return { title: t('inviteResend.title'), h1: h1(t('inviteResend.title')), body: `<p class="lede">${t('inviteResend.lede')}</p>${fSingle(L, { p: 'ir', action: '/invite/resend', next: 'invite-resend-sent.html', submit: t('inviteResend.submit') })}<p class="row">${link('login.html', t('reset.back'))}</p>` }; });
P('invite-resend-sent.html', (L) => { const t = mk(L); return { title: t('inviteResend.sentTitle'), h1: h1(t('inviteResend.sentTitle')), body: sentPage(L, '', 'inviteResend.sentText', {}, 'login.html', 'reset.back', 'invite-resend.html', 'inviteResend.spam') }; });
P('reset-request.html', (L) => { const t = mk(L); return { title: t('reset.title'), h1: h1(t('reset.title')), body: `<p class="lede">${t('reset.lede')}</p>${fSingle(L, { p: 'rs', action: '/password/reset', next: 'reset-sent.html', submit: t('reset.submit') })}<p class="row">${link('login.html', t('reset.back'))}</p>` }; });
P('reset-sent.html', (L) => { const t = mk(L); return { title: t('reset.sentTitle'), h1: h1(t('reset.sentTitle')), body: sentPage(L, '', 'reset.sentText', { minutes: 60 }, 'login.html', 'reset.back', 'reset-request.html', 'reset.spam') }; });
P('reset-new-password.html', (L) => { const t = mk(L); return { title: t('resetNew.title'), h1: h1(t('resetNew.title')), body: `<p class="lede">${t('resetNew.lede')}</p>${fNewPassword(L, { p: 'rn', action: '/password/reset/TOKEN', next: 'login-notice.html', submit: t('resetNew.submit') })}` }; });
P('login-notice.html', (L) => { const t = mk(L); return { title: t('login.title'), h1: h1(t('login.title')), body: `${notice(t('login.notice.passwordSaved'))}${fPwd(L, { p: 'ln', email: '' })}<p class="row">${link('reset-request.html', t('pwd.forgot'))}</p>` }; });

/* link states */
P('link-expired.html', (L) => { const t = mk(L); return { title: t('link.expired.title'), h1: h1(t('link.expired.title')), body: msgPage(`<p class="lede">${t('link.expired.text', { days: 14 })}</p><a class="btn" href="invite-resend.html">${t('link.expired.cta')}</a><p class="row">${link('login.html', t('link.used.login'))}</p>`) }; });
P('link-used.html', (L) => { const t = mk(L); return { title: t('link.used.title'), h1: h1(t('link.used.title')), body: msgPage(`<p class="lede">${t('link.used.text')}</p><a class="btn" href="login.html">${t('link.used.login')}</a><p class="row">${link('invite-resend.html', t('link.used.again'))}</p><p>${link('reset-request.html', t('pwd.forgot'))}</p>`) }; });
P('rate-limited.html', (L) => { const t = mk(L); return { title: t('rate.title'), h1: h1(t('rate.title')), body: msgPage(`<p class="lede">${t('rate.text', { minutes: 15 })}</p><p class="muted">${t('rate.hint')}</p><p class="row">${link('login.html', t('rate.back'))}</p>`) }; });

/* auth states page */
P('auth-states.html', (L) => {
  const t = mk(L), uk = L === 'uk';
  const m = uk ? {
    h1: 'Помилки й стани входу', lede: 'Кожен стан входу на одній сторінці. Окремі сторінки: ',
    s1: 'Помилка в полі пошти', s1m: 'Текст під полем, ввідне значення збережено. Підсумок угорі з посиланням на поле.',
    s2: 'Код має неправильний вигляд', s2m: 'Перевірка на сервері, поле зберігає введене.',
    s3: 'Код неправильний', s3m: 'Для невідомої пошти відповідь така сама: сервер не розкриває, чи є обліковий запис.',
    s4: 'Код прострочено', s4m: 'Код діє 10 хвилин. Тут зручно одразу попросити новий.',
    s5: 'Невірний пароль', s5m: 'Пошта збережена, пароль ніколи не повертається в сторінку.',
    s6: 'Нові паролі: помилки', s6m: 'Паролі не повертаються в поле; текст помилки стоїть під полем.',
    s7: 'Посилання для скидання прострочене', s7m: 'Діє 60 хвилин, один раз.',
    s8: 'Пароль збережено', s8m: 'Після скидання пароля людина потрапляє на вхід з повідомленням.',
    s9: 'Помилка сервера', s9m: 'Загальне повідомлення без деталей.',
    pages: 'Прострочене запрошення', pages2: 'Використане посилання', pages3: 'Забагато спроб',
  } : {
    h1: 'Sign-in errors and states', lede: 'Every sign-in state on one page. Separate pages: ',
    s1: 'Error in the email field', s1m: 'The message sits under the field and the typed value stays. A summary at the top links to the field.',
    s2: 'Code has the wrong shape', s2m: 'Checked on the server; the field keeps what was typed.',
    s3: 'Wrong code', s3m: 'For an unknown email the answer is the same: the server never says whether an account exists.',
    s4: 'Expired code', s4m: 'A code works for 10 minutes. A new code is one click away.',
    s5: 'Wrong password', s5m: 'The email is kept; the password is never put back into the page.',
    s6: 'New password: errors', s6m: 'Passwords are not put back into the fields; the message is under the field.',
    s7: 'Reset link expired', s7m: 'Works once, for 60 minutes.',
    s8: 'Password saved', s8m: 'After a reset the person lands on log in with this message.',
    s9: 'Server error', s9m: 'A general message without details.',
    pages: 'Invitation link expired', pages2: 'Link already used', pages3: 'Rate limited',
  };
  const a = (href, txt) => `<a href="${href}">${txt}</a>`;
  const exp = `<p class="row"><a class="btn btn--ghost" href="rate-limited.html" style="display:none"></a></p>`;
  const body = `<p class="lede" style="text-align:left">${m.lede}${a('link-expired.html', m.pages)}, ${a('link-used.html', m.pages2)}, ${a('rate-limited.html', m.pages3)}.</p>
${spec('s1', m.s1, m.s1m, fEmail(L, { p: 'a1', value: 'name@example', error: t('login.errors.emailInvalid') }))}
${spec('s2', m.s2, m.s2m, fCode(L, { p: 'a2', value: '12ab', error: t('code.errors.format') }))}
${spec('s3', m.s3, m.s3m, fCode(L, { p: 'a3', value: '482913', alert: t('code.errors.wrong') }))}
${spec('s4', m.s4, m.s4m, fCode(L, { p: 'a4', value: '', alert: t('code.errors.expired', { minutes: 10 }) }))}
${spec('s5', m.s5, m.s5m, fPwd(L, { p: 'a5', email: 'name@example.org', alert: t('pwd.errors.invalid') }))}
${spec('s6', m.s6, m.s6m, fNewPassword(L, { p: 'a6', passError: t('invite.errors.tooWeak'), repError: t('invite.errors.mismatch') }))}
${spec('s7', m.s7, m.s7m, msgPage(`<p class="notice__title">${t('link.resetExpired.title')}</p><p class="lede">${t('link.resetExpired.text', { minutes: 60 })}</p><a class="btn" href="reset-request.html">${t('link.resetExpired.cta')}</a>`))}
${spec('s8', m.s8, m.s8m, notice(t('login.notice.passwordSaved')))}
${spec('s9', m.s9, m.s9m, `<div class="alert" role="alert"><span class="alert__title">${t('error.generic.title')}.</span> ${t('error.generic.text')}</div>`)}`;
  return { title: m.h1, h1: h1(m.h1), body, width: 'mid' };
});

/* account */
P('account.html', (L) => { const t = mk(L); return { variant: 'account', current: 'account', width: 'mid', title: t('account.title'), h1: h1(t('account.title')), body: `<p class="lede" style="text-align:left">${t('account.lede')}</p><div class="notice" role="note"><p>${t('account.publicNotice')}</p></div><p class="small muted" style="text-align:left;margin:-8px 0 24px">${t('common.required')}</p>${profileForm(L)}` }; });
P('account-request-open.html', (L) => { const t = mk(L); return { variant: 'account', current: 'account', width: 'mid', title: t('account.title'), h1: h1(t('account.title')), body: `<p class="lede" style="text-align:left">${badge(t, 'in_review')} ${t('status.in_review.text')}</p><div class="notice" role="note"><p>${t('account.publicNotice')}</p></div>${profileForm(L, { locked: true })}` }; });
P('account-states.html', (L) => {
  const t = mk(L), uk = L === 'uk';
  const m = uk ? { h1: 'Профіль: стани', saveT: 'Стан збереження чернетки', saveM: 'Чотири стани. Рядок має role="status", тому читач екрана чує зміну. Без JS видно лише початковий стан, а чернетку зберігає кнопка.', load: 'Завантаження', loadM: 'Скелет сторінки, поки сервер збирає профіль (за потреби; зазвичай сторінка приходить одразу).', empty: 'Порожній профіль', emptyM: 'Наука ще нічого не заповнила.', na: 'Немає доступу', naM: 'Інший профіль або чужий запит. Відповідь така сама, як для неіснуючої адреси (404).', sess: 'Сеанс завершився', sessM: 'Чернетка збережена на сервері.', err: 'Помилка завантаження', errM: 'Сервер недоступний.', en: 'Позначка «EN застаріла»', enM: 'Показується біля заголовка англійської версії, коли українську змінено пізніше.', blk: 'Один відкритий запит', blkM: 'Кнопка вимкнена, причина написана поруч, а не лише в підказці.' } : { h1: 'Profile: states', saveT: 'Draft save indicator', saveM: 'Four states. The line has role="status" so a screen reader hears the change. Without JS only the first state is shown and the Save draft button saves.', load: 'Loading', loadM: 'A skeleton while the server builds the profile (only if needed; normally the page arrives whole).', empty: 'Empty profile', emptyM: 'The scientist has not filled anything in yet.', na: 'No access', naM: 'Someone else’s profile or request. The answer is the same as for a page that does not exist (404).', sess: 'Session ended', sessM: 'The draft is kept on the server.', err: 'Load error', errM: 'The server is not reachable.', en: '“EN outdated” mark', enM: 'Shown next to the English version heading when the Ukrainian text changed later.', blk: 'One open request', blkM: 'The button is disabled and the reason is written next to it, not only in a tooltip.' };
  const msg = (k, cta, href) => `<div class="msg" style="text-align:center"><p class="notice__title">${t(k + '.title')}</p><p>${t(k + '.text')}</p><a class="btn" href="${href}">${t(cta)}</a></div>`;
  const body = `${spec('x1', m.saveT, m.saveM, `<div class="spec__grid">${['idle', 'saving', 'saved', 'failed'].map((s) => `<div><p class="small muted">data-state="${s}"</p>${save(t, s)}</div>`).join('')}</div>`, false)}
${spec('x2', m.load, m.loadM, `<div role="status" aria-busy="true"><p class="sr">${t('state.loading')}</p><span class="skel skel--title"></span><span class="skel"></span><span class="skel skel--short"></span><span class="skel"></span></div>`, false)}
${spec('x3', m.empty, m.emptyM, msg('state.empty', 'state.empty.cta', 'account.html'))}
${spec('x4', m.na, m.naM, msg('state.noaccess', 'state.noaccess.cta', 'account.html'))}
${spec('x5', m.sess, m.sessM, msg('state.session', 'state.session.cta', 'login.html'))}
${spec('x6', m.err, m.errM, msg('state.error', 'state.error.cta', 'account.html'))}
${spec('x7', m.en, m.enM, `<p><span class="badge badge--en badge--en-outdated">${t('en.outdated.badge')}</span> ${t('en.outdated.text')}</p><p class="row"><span class="badge badge--en">${t('en.current.badge')}</span> ${t('en.current.text')}</p>`, false)}
${spec('x8', m.blk, m.blkM, `<div class="alert" role="note" id="spec-why" style="margin-bottom:16px"><span class="alert__title">${t('submit.blocked.title')}.</span> ${t('submit.blocked.text')} <a href="request.html">${t('submit.blocked.link')}</a></div><button class="btn" type="button" disabled aria-describedby="spec-why">${t('submit.button')}</button>`, false)}`;
  return { variant: 'account', current: 'account', width: 'mid', title: m.h1, h1: h1(m.h1), body };
});

/* requests */
const listItem = (t, L, s, id, date, open) => `<li class="card${open ? ' card--open' : ''}"><div class="card__head"><span class="card__title">${t('requests.number', { id })}</span>${badge(t, s)}</div><p class="card__meta">${t('requests.sent', { date })}</p><p class="card__actions"><a class="link" href="request.html">${t('requests.view')}<span class="sr">: ${t('requests.number', { id })}</span></a></p></li>`;
P('requests.html', (L) => {
  const t = mk(L), D = (en, uk) => (L === 'uk' ? uk : en);
  const body = `<p class="lede" style="text-align:left">${t('requests.lede')}</p>
<h2 class="h2" style="text-align:left">${t('requests.open')}</h2>
<ul class="cards">${listItem(t, L, 'changes_requested', 'R-2026-0412', D('12 November 2026', '12 листопада 2026'), true)}</ul>
<h2 class="h2" style="text-align:left">${t('requests.archive')}</h2>
<ul class="cards">${listItem(t, L, 'live', 'R-2026-0307', D('3 October 2026', '3 жовтня 2026'))}${listItem(t, L, 'rejected', 'R-2026-0211', D('18 August 2026', '18 серпня 2026'))}${listItem(t, L, 'live', 'R-2026-0044', D('9 March 2026', '9 березня 2026'))}</ul>
<p class="muted small" style="margin-top:24px;text-align:left">${t('requests.emailNote')}</p>`;
  return { variant: 'account', current: 'requests', width: 'mid', title: t('requests.title'), h1: h1(t('requests.title')), body };
});
P('request.html', (L) => {
  const t = mk(L), D = (en, uk) => (L === 'uk' ? uk : en);
  const body = `<p style="text-align:left"><a class="link" href="requests.html">← ${t('requests.back')}</a></p>
<p class="lede" style="text-align:left">${badge(t, 'changes_requested')} ${t('requests.sent', { date: D('12 November 2026', '12 листопада 2026') })}</p>
<p style="text-align:left">${t('status.changes_requested.text')}</p>
<div class="comment" role="note"><p class="comment__label">${t('requests.commentTitle')}</p><p>${t('sample.comment.changes')}</p></div>
<h2 class="h2" style="text-align:left;margin-top:32px">${t('requests.changedTitle')}</h2>
<ul class="plain"><li>${t('sample.changed.1')}</li><li>${t('sample.changed.2')}</li><li>${t('sample.changed.3')}</li></ul>
<h2 class="h2" style="text-align:left">${t('requests.nextTitle')}</h2>
<p style="text-align:left">${t('account.publicNotice')}</p>
<p style="margin-top:24px;text-align:left"><a class="btn" href="account.html">${t('action.editResubmit')}</a></p>`;
  return { variant: 'account', current: 'requests', width: 'mid', title: t('requests.number', { id: 'R-2026-0412' }).replace(/&amp;/g, '&'), h1: h1(t('requests.number', { id: SAMPLE.id })), body };
});
const ACTIONS = { draft: ['edit', 'submit', 'discard'], submitted: ['view', 'withdraw'], in_review: ['view'], changes_requested: ['editResubmit', 'view'], approved: ['view'], rejected: ['view', 'startNew'], live: ['viewOnSite', 'startNew'] };
const OPEN = { draft: 1, submitted: 1, in_review: 1, changes_requested: 1, approved: 1, rejected: 0, live: 0 };
P('request-states.html', (L) => {
  const t = mk(L), uk = L === 'uk';
  const label = (a) => (a === 'submit' ? t('submit.button') : t('action.' + a));
  const m = uk ? { h1: 'Запити: статуси', lede: 'Кожен статус таким, яким його бачить науковець. Кнопки нижче — зразки, не посилання.', empty: 'Порожній список' } : { h1: 'Requests: statuses', lede: 'Each status as the scientist sees it. The buttons below are specimens, not links.', empty: 'Empty list' };
  const cards = STATUSES.map((s) => {
    const comment = s === 'changes_requested' || s === 'rejected';
    const acts = ACTIONS[s].map((a, i) => `<li><span class="btn btn--spec${i ? ' btn--ghost' : ''}">${label(a)}</span></li>`).join('');
    return `<section class="state-card" aria-labelledby="st-${s}"><h2 id="st-${s}">${t('status.' + s + '.label')}</h2>
<dl class="facts"><dt>${t('states.badge')}</dt><dd>${badge(t, s)}</dd>
<dt>${t('states.text')}</dt><dd>${t('status.' + s + '.text')}</dd>
<dt>${t('states.buttons')}</dt><dd><ul class="btns">${acts}</ul></dd>
<dt>${t('states.comment')}</dt><dd>${comment ? `<div class="comment" style="margin:0"><p class="comment__label">${t('requests.commentTitle')}</p><p>${t('sample.comment.' + (s === 'rejected' ? 'rejected' : 'changes'))}</p></div>` : `<span class="muted">${t('states.commentHidden')}</span>`}</dd>
<dt>${t('states.counts')}</dt><dd>${OPEN[s] ? t('states.counts.yes') : t('states.counts.no')}</dd></dl></section>`;
  }).join('');
  const empty = `<section class="state-card" aria-labelledby="st-empty"><h2 id="st-empty">${m.empty}</h2><p class="notice__title">${t('requests.empty.title')}</p><p>${t('requests.empty.text')}</p><p class="muted small" style="margin-top:8px">${t('requests.openNone')}</p></section>`;
  return { variant: 'account', current: 'requests', width: 'mid', title: m.h1, h1: h1(m.h1), body: `<p class="lede" style="text-align:left">${m.lede}</p>${cards}${empty}` };
});

/* index */
P('index.html', (L) => {
  const uk = L === 'uk';
  const T = uk ? { h1: 'Кабінет науковця: мапа екранів', lede: 'Статичні зразки для розробників. Українська версія первинна: науковці користуються кабінетом українською, англійська — переклад для команди й закордонних колег.', cols: ['Екран', 'EN', 'УКР'], groups: ['Вхід і запрошення', 'Помилки входу', 'Профіль /account', 'Запити /account/requests', 'Листи', 'Довідка'] } : { h1: 'Scientist cabinet: map of screens', lede: 'Static samples for the developers. Ukrainian is the primary version: scientists use the cabinet in Ukrainian; English is a translation for the team and foreign colleagues.', cols: ['Screen', 'EN', 'UK'], groups: ['Sign in and invitation', 'Sign-in errors', 'Profile /account', 'Requests /account/requests', 'Letters', 'Reference'] };
  const row = (label, file, note, extra) => {
    const en = file, ukf = 'uk/' + file;
    return `<tr><th scope="row">${label}${note ? `<span class="small">${note}</span>` : ''}</th><td>${extra ? extra[0] : `<a href="${en}">EN</a>`}</td><td>${extra ? extra[1] : `<a href="${ukf}" lang="uk" hreflang="uk">УКР</a>`}</td></tr>`;
  };
  const tbl = (g, rows) => `<h2 class="h2" style="text-align:left">${g}</h2><table class="map"><caption class="sr">${g}</caption><thead><tr><th scope="col">${T.cols[0]}</th><th scope="col">${T.cols[1]}</th><th scope="col">${T.cols[2]}</th></tr></thead><tbody>${rows.join('')}</tbody></table>`;
  const N = (a, b) => (uk ? b : a);
  const letter = (k, label) => `<tr><th scope="row">${label}</th><td><a href="email/${k}.html">HTML</a> <a href="email/${k}.txt">TXT</a></td><td><a href="email/uk/${k}.html" lang="uk" hreflang="uk">HTML</a> <a href="email/uk/${k}.txt" lang="uk" hreflang="uk">TXT</a></td></tr>`;
  const body = `<p class="lede" style="text-align:left">${T.lede}</p>
${tbl(T.groups[0], [
    row(N('1. Log in: email', '1. Вхід: пошта'), 'login.html', '/login'),
    row(N('2. Log in: 6-digit code', '2. Вхід: код із 6 цифр'), 'login-code.html', '/login/code'),
    row(N('3. Log in: password', '3. Вхід: пароль'), 'login-password.html', '/login/password'),
    row(N('Invitation: choose your own password', 'Запрошення: власний пароль'), 'invite.html', '/invite/{token}'),
    row(N('Invitation: ask again', 'Запрошення: попросити ще раз'), 'invite-resend.html', '/invite/resend'),
    row(N('Invitation: answer after asking', 'Запрошення: відповідь після запиту'), 'invite-resend-sent.html', N('same for any address', 'однакова для будь-якої адреси')),
    row(N('Password reset: ask', 'Скидання пароля: запит'), 'reset-request.html', '/password/reset'),
    row(N('Password reset: answer after asking', 'Скидання пароля: відповідь після запиту'), 'reset-sent.html', N('same for any address', 'однакова для будь-якої адреси')),
    row(N('Password reset: new password', 'Скидання пароля: новий пароль'), 'reset-new-password.html', '/password/reset/{token}'),
    row(N('Log in after password saved', 'Вхід після збереження пароля'), 'login-notice.html'),
  ])}
${tbl(T.groups[1], [
    row(N('All sign-in states and field errors', 'Усі стани входу й помилки полів'), 'auth-states.html'),
    row(N('Invitation link expired (14 days)', 'Запрошення прострочене (14 днів)'), 'link-expired.html'),
    row(N('Link already used', 'Посилання вже використано'), 'link-used.html'),
    row(N('Rate limited', 'Забагато спроб'), 'rate-limited.html'),
  ])}
${tbl(T.groups[2], [
    row(N('Profile form with autosave', 'Форма профілю з автозбереженням'), 'account.html', '/account'),
    row(N('Request already open: button disabled', 'Запит уже відкритий: кнопка вимкнена'), 'account-request-open.html'),
    row(N('Loading, empty, no access, session, error, EN mark', 'Завантаження, порожньо, немає доступу, сеанс, помилка, позначка EN'), 'account-states.html'),
  ])}
${tbl(T.groups[3], [
    row(N('List with archive', 'Список з архівом'), 'requests.html', '/account/requests'),
    row(N('One request (changes requested)', 'Один запит (потрібні правки)'), 'request.html', '/account/requests/{id}'),
    row(N('All 7 statuses and the empty list', 'Усі 7 статусів і порожній список'), 'request-states.html'),
  ])}
<h2 class="h2" style="text-align:left">${T.groups[4]}</h2><table class="map"><caption class="sr">${T.groups[4]}</caption><thead><tr><th scope="col">${T.cols[0]}</th><th scope="col">${T.cols[1]}</th><th scope="col">${T.cols[2]}</th></tr></thead><tbody>
${letter('invitation', N('Invitation', 'Запрошення'))}${letter('sign-in-code', N('Sign-in code', 'Код для входу'))}${letter('password-reset', N('Password reset', 'Скидання пароля'))}${letter('changes-requested', N('Changes requested', 'Потрібні правки'))}${letter('rejected', N('Rejected', 'Відхилено'))}${letter('live', N('Your changes are live', 'Зміни вже на сайті'))}</tbody></table>
<h2 class="h2" style="text-align:left">${T.groups[5]}</h2><ul class="stack" style="text-align:left"><li><a class="link" href="README.md">README.md</a></li><li><a class="link" href="microcopy.uk.yaml">microcopy.uk.yaml</a> · <a href="microcopy.en.yaml">microcopy.en.yaml</a></li></ul>`;
  return { title: T.h1, h1: h1(T.h1), body, width: 'mid', demo: false };
});

for (const [file, fn] of Object.entries(pages)) {
  for (const L of ['en', 'uk']) {
    const r = fn(L);
    write((L === 'uk' ? 'uk/' : '') + file, shell(L, { file, ...r, h1Html: r.h1 }));
  }
}
console.log(Object.keys(pages).length * 2 + ' pages');
