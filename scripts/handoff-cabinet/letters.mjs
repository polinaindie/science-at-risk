import { dict, write, esc } from './build.mjs';
const SITE = 'https://scienceatrisk.org';
const KINDS = {
  invitation: { file: 'invitation', url: `${SITE}/invite/Xk3p9-sample-token`, code: false, comment: false, steps: true },
  code: { file: 'sign-in-code', code: true },
  reset: { file: 'password-reset', url: `${SITE}/password/reset/Rt7q2-sample-token` },
  changes: { file: 'changes-requested', url: `${SITE}/account/requests/R-2026-0412`, comment: 'sample.comment.changes', id: true },
  rejected: { file: 'rejected', url: `${SITE}/account/requests/R-2026-0211`, comment: 'sample.comment.rejected', id: true, idv: 'R-2026-0211' },
  live: { file: 'live', url: `${SITE}/scientists/olena-shevchenko`, id: true, idv: 'R-2026-0307' },
};
const F = `'IBM Plex Mono',Menlo,Consolas,'Courier New',monospace`;
const S = `'Noto Serif',Georgia,'Times New Roman',serif`;
const raw = (L, k, v = {}) => { let s = dict[L][k]; if (s === undefined) throw new Error(k); return s.replace(/\{(\w+)\}/g, (m, n) => (n in v ? v[n] : m)); };

function build(L, key) {
  const K = KINDS[key], p = (n) => `email.${key}.${n}`;
  const v = K.id ? { id: K.idv || 'R-2026-0412' } : {};
  const subject = raw(L, p('subject')), pre = raw(L, p('preheader')), lead = raw(L, p('lead'), v), cta = K.url ? raw(L, p('cta')) : '';
  const greeting = raw(L, 'email.greeting');
  const comment = K.comment ? raw(L, K.comment) : '';
  const expiry = dict[L][p('expiry')] ? raw(L, p('expiry')) : '';
  const after = dict[L][p('after')] ? raw(L, p('after')) : '';
  const notYou = dict[L][p('notYou')] ? raw(L, p('notYou')) : '';
  const steps = K.steps ? [1, 2, 3].map((i) => raw(L, p('steps.' + i))) : [];
  const sig = raw(L, 'email.signature'), foot = raw(L, 'email.footer'), fb = raw(L, 'email.linkFallback');
  const CODE = '482 913';
  const resend = `${SITE}/invite/resend`;
  const td = (inner, st = '') => `<tr><td style="padding:0 0 24px;font-family:${F};font-size:16px;line-height:26px;color:#000000;${st}">${inner}</td></tr>`;
  const html = `<!DOCTYPE html>
<!--
  Colours used (all inline, no CSS classes):
  #000000 ink: text, button background, rules
  #ffffff paper: page and button text
  #4d4d4d muted text (8.9:1 on white)
  #b5c6cd blue box behind the code (black text on it, 11:1)
  #f0eebe attention box behind the editors' comment (black text, 15:1)
  Fonts: system fallbacks only; IBM Plex Mono / Noto Serif are used only if installed on the reader's device.
  No images, so no alt text is needed. If a logo image is added, give it alt="Science At Risk".
-->
<html lang="${L}" xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="light">
<meta name="supported-color-schemes" content="light">
<title>${esc(subject)}</title>
</head>
<body style="margin:0;padding:0;background:#ffffff;">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;font-size:1px;line-height:1px;color:#ffffff;">${esc(pre)}</div>
<div role="main" aria-label="${esc(subject)}"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#ffffff;margin:0;padding:0;"><tr><td align="center" style="padding:24px 12px;">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:600px;background:#ffffff;">
<tr><td style="padding:8px 0 24px;border-bottom:2px solid #000000;font-family:${S};font-size:24px;line-height:28px;color:#000000;">${raw(L, 'email.logo')}</td></tr>
<tr><td style="padding:32px 0 8px;font-family:${S};font-size:28px;line-height:34px;color:#000000;"><h1 style="margin:0;font-family:${S};font-size:28px;line-height:34px;font-weight:normal;color:#000000;">${esc(subject)}</h1></td></tr>
<tr><td style="padding:16px 0 16px;font-family:${F};font-size:16px;line-height:26px;color:#000000;">${esc(greeting)}</td></tr>
${td(esc(lead))}
${K.code ? `<tr><td style="padding:0 0 24px;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#b5c6cd;"><tr><td style="padding:20px 24px;font-family:${F};color:#000000;"><div style="font-size:14px;line-height:20px;color:#000000;">${esc(raw(L, 'email.code.label'))}</div><div style="margin-top:6px;font-size:32px;line-height:40px;letter-spacing:4px;font-weight:bold;color:#000000;">${CODE}</div></td></tr></table></td></tr>` : ''}
${comment ? `<tr><td style="padding:0 0 24px;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f0eebe;"><tr><td style="padding:16px 20px;border-left:6px solid #000000;font-family:${F};color:#000000;"><div style="font-size:14px;line-height:22px;font-weight:bold;color:#000000;">${esc(raw(L, 'email.comment.label'))}</div><div style="margin-top:4px;font-size:16px;line-height:26px;color:#000000;">${esc(comment)}</div></td></tr></table></td></tr>` : ''}
${steps.length ? `<tr><td style="padding:0 0 24px;font-family:${F};font-size:16px;line-height:26px;color:#000000;"><ol style="margin:0;padding:0 0 0 22px;">${steps.map((s) => `<li style="margin:0 0 4px;">${esc(s)}</li>`).join('')}</ol></td></tr>` : ''}
${after ? td(esc(after)) : ''}
${K.url ? `<tr><td style="padding:0 0 16px;"><table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr><td style="background:#000000;border-radius:15px;"><a href="${K.url}" style="display:inline-block;padding:14px 32px;font-family:${F};font-size:18px;line-height:24px;color:#ffffff;text-decoration:none;">${esc(cta)}</a></td></tr></table></td></tr>
<tr><td style="padding:0 0 24px;font-family:${F};font-size:14px;line-height:22px;color:#4d4d4d;">${esc(fb)}<br><a href="${K.url}" style="color:#000000;word-break:break-all;">${K.url}</a></td></tr>` : ''}
${expiry ? `<tr><td style="padding:0 0 16px;font-family:${F};font-size:14px;line-height:22px;color:#4d4d4d;">${esc(expiry)}</td></tr>` : ''}
${key === 'invitation' ? `<tr><td style="padding:0 0 24px;font-family:${F};font-size:14px;line-height:22px;color:#4d4d4d;">${esc(raw(L, 'email.invitation.expired'))} <a href="${resend}" style="color:#000000;word-break:break-all;">${resend}</a></td></tr>` : ''}
<tr><td style="padding:24px 0 0;border-top:1px solid #000000;font-family:${F};font-size:14px;line-height:22px;color:#4d4d4d;">${notYou ? `<p style="margin:0 0 16px;">${esc(notYou)}</p>` : ''}<p style="margin:0 0 16px;color:#000000;">${esc(sig)}</p><p style="margin:0;font-size:12px;line-height:18px;">${esc(foot)}</p></td></tr>
</table></td></tr></table></div>
</body>
</html>
`;
  const txt = [
    subject, '', greeting, '', lead, '',
    K.code ? `${raw(L, 'email.code.label')}: ${CODE}\n` : '',
    comment ? `${raw(L, 'email.comment.label')}:\n${comment}\n` : '',
    steps.length ? steps.map((s, i) => `${i + 1}. ${s}`).join('\n') + '\n' : '',
    after ? after + '\n' : '',
    K.url ? `${cta}:\n${K.url}\n` : '',
    expiry ? expiry + '\n' : '',
    key === 'invitation' ? `${raw(L, 'email.invitation.expired')}\n${resend}\n` : '',
    '--', notYou, '', sig, foot, '',
  ].filter((x, i, a) => !(x === '' && a[i - 1] === '')).join('\n').replace(/\n{3,}/g, '\n\n');
  const dir = L === 'uk' ? 'email/uk/' : 'email/';
  write(`${dir}${K.file}.html`, html);
  write(`${dir}${K.file}.txt`, txt);
}
for (const L of ['en', 'uk']) for (const k of Object.keys(KINDS)) build(L, k);
console.log('letters ok');
