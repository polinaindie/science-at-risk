/**
 * Renders the cabinet's sign-in screens and letters to static files.
 *
 * `src/components/Auth` is the only place they are defined. This script draws
 * each component to HTML and writes it into `public/`, in both languages:
 *
 *   login.html  first-login.html  set-password.html  forgot-password.html
 *   link-sent.html  password-saved.html            (English, at the root)
 *   uk/…same names…                                 (Ukrainian)
 *   email/new-link.html  email/invitation.html      (+ email/uk/…)
 *   cabinet-screens.html                            (one page that links them all)
 *
 * The pages carry empty `satr-chrome` header and footer slots; `npm run chrome`
 * fills them. `npm run auth` runs the whole chain:
 *
 *   node scripts/build-auth.mjs && node scripts/build-chrome-css.mjs && node scripts/build-chrome.mjs
 */
import { createServer } from 'vite';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const publicDir = path.join(root, 'public');

const vite = await createServer({
  root,
  appType: 'custom',
  server: { middlewareMode: true },
  logLevel: 'error',
});

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');

try {
  const auth = await vite.ssrLoadModule('/src/components/Auth/index.ts');
  const { authCopy } = auth;
  const html = (node) => renderToStaticMarkup(node).replace(/<link rel="preload"[^>]*>/g, '');

  const LOCALES = ['en', 'uk'];
  const SCREENS = [
    { file: 'login.html', key: 'login' },
    { file: 'first-login.html', key: 'firstLogin' },
    { file: 'set-password.html', key: 'setPassword' },
    { file: 'forgot-password.html', key: 'forgot' },
    { file: 'link-sent.html', key: 'sent' },
    { file: 'password-saved.html', key: 'saved' },
  ];

  const render = (key, locale, base) => {
    const props = { locale, loginHref: 'login.html' };
    switch (key) {
      case 'login':
        return html(
          createElement(auth.LoginForm, {
            locale,
            action: 'login.html',
            nextHref: `${base}cabinet`,
            forgotHref: 'forgot-password.html',
            firstLoginHref: 'first-login.html',
          }),
        );
      case 'firstLogin':
        return html(
          createElement(auth.FirstLoginForm, {
            locale,
            action: 'first-login.html',
            nextHref: 'set-password.html',
            forgotHref: 'forgot-password.html',
            loginHref: 'login.html',
          }),
        );
      case 'setPassword':
        return html(createElement(auth.SetPasswordForm, { locale, action: 'set-password.html' }));
      case 'forgot':
        return html(
          createElement(auth.ForgotPasswordForm, {
            locale,
            action: 'forgot-password.html',
            backHref: 'login.html',
          }),
        );
      case 'sent':
        return html(
          createElement(auth.LinkSentNotice, {
            locale,
            backHref: 'login.html',
            againHref: 'forgot-password.html',
          }),
        );
      case 'saved':
        return html(createElement(auth.PasswordSavedNotice, { locale, cabinetHref: `${base}cabinet` }));
      default:
        return props && '';
    }
  };

  const titleOf = (key, locale) => {
    const c = authCopy[locale];
    return { login: c.login.title, firstLogin: c.firstLogin.title, setPassword: c.setPassword.title, forgot: c.forgot.title, sent: c.sent.title, saved: c.saved.title }[
      key
    ];
  };

  const page = ({ locale, base, file, key }) => {
    const ua = locale === 'uk';
    const altPath = ua ? file : `uk/${file}`;
    const title = `${titleOf(key, locale)} — Science At Risk`;
    const needsScript = key === 'login' || key === 'firstLogin' || key === 'setPassword' || key === 'forgot';
    return `<!DOCTYPE html>
<html lang="${ua ? 'uk' : 'en'}">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="robots" content="noindex, nofollow">
    <title>${esc(title)}</title>
    <link rel="alternate" hreflang="${ua ? 'en' : 'uk'}" href="${base}${altPath}">

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@300;400;500;700&family=Noto+Serif:wght@400;700&display=swap" rel="stylesheet">
    <link href="${base}css/normalize.css" rel="stylesheet">
    <link href="${base}css/style.min.css" rel="stylesheet">
<!-- satr-chrome:head --><link rel="stylesheet" href="${base}css/satr-chrome.css"><script src="${base}js/satr-chrome.js" defer></script><!-- /satr-chrome:head -->
    <link rel="stylesheet" href="${base}css/satr-auth.css">
${needsScript ? `    <script src="${base}js/satr-auth.js" defer></script>\n` : ''}</head>
<body data-page="cabinet-auth" class=" isDefault " id="root__body">
    <div class="base-wrap ">
        <div class="base-wrap__header">
            <!-- satr-chrome:header --><div class="satr-chrome satr-chrome--header" data-satr-chrome="header" data-satr-alt="${altPath}"><header></header></div><!-- /satr-chrome:header -->
        </div>
        <div class="base-wrap__content">
            <div class="page indentHeader">
                <div class="wrapper">
                    <div class="satr-chrome">
${render(key, locale, base)}
                    </div>
                </div>
            </div>
        </div>
        <div class="base-wrap__footer">
            <!-- satr-chrome:footer --><div class="satr-chrome satr-chrome--footer" data-satr-chrome="footer"><footer></footer></div><!-- /satr-chrome:footer -->
        </div>
    </div>
</body>
</html>
`;
  };

  const written = [];
  const write = async (rel, content) => {
    const file = path.join(publicDir, rel);
    await mkdir(path.dirname(file), { recursive: true });
    await writeFile(file, content);
    written.push(rel);
  };

  for (const locale of LOCALES) {
    const base = locale === 'uk' ? '../' : '';
    for (const s of SCREENS) {
      await write(`${locale === 'uk' ? 'uk/' : ''}${s.file}`, page({ locale, base, file: s.file, key: s.key }));
    }
  }

  /* The letters. */
  const emailDoc = (locale, kind) => {
    const e = authCopy[locale].email;
    const subject = kind === 'invite' ? e.subjectInvite : e.subjectNewLink;
    const body = html(createElement(auth.InvitationEmail, { locale, kind }));
    return `<!DOCTYPE html>
<html lang="${locale}" xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="light">
<meta name="supported-color-schemes" content="light">
<title>${esc(subject)}</title>
</head>
<body style="margin:0;padding:0;background:#ffffff;">
${body}
</body>
</html>
`;
  };
  for (const locale of LOCALES) {
    const dir = locale === 'uk' ? 'email/uk/' : 'email/';
    await write(`${dir}new-link.html`, emailDoc(locale, 'newLink'));
    await write(`${dir}invitation.html`, emailDoc(locale, 'invite'));
  }

  /* One page that lists everything, for reviewing the flow. */
  const row = (label, en, uk, extra = '') =>
    `<tr><td>${label}${extra}</td><td><a href="${en}">EN</a></td><td><a href="${uk}">УКР</a></td></tr>`;
  await write(
    'cabinet-screens.html',
    `<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex"><title>Cabinet screens — review</title>
<style>
body{margin:0;padding:40px 16px;font:16px/26px 'IBM Plex Mono',monospace;color:#000;background:#fff}
main{max-width:640px;margin:0 auto}h1{font:400 32px/38px 'Noto Serif',serif;margin:0 0 8px}
p{margin:0 0 24px;color:#4d4d4d}table{width:100%;border-collapse:collapse}
td{padding:12px 0;border-top:1px solid #000}td:not(:first-child){width:72px}a{color:#000;text-underline-offset:4px}
small{display:block;color:#4d4d4d;font-size:14px;line-height:20px}
</style></head><body><main>
<h1>Cabinet: sign-in screens</h1>
<p>The flow: letter → log in → choose a password → cabinet. Branch: lost the letter → forgot password → letter sent.</p>
<table>
${row('1 · Log in (email + password)', 'login.html', 'uk/login.html', '<small>Try the password “wrong”, or open with ?state=invalid.</small>')}
${row('1b · First log in (one-time password)', 'first-login.html', 'uk/first-login.html', '<small>Try “wrong” or “expired”, or open with ?state=invalid / ?state=expired.</small>')}
${row('2 · Choose a password', 'set-password.html', 'uk/set-password.html')}
${row('3 · Forgot password', 'forgot-password.html', 'uk/forgot-password.html')}
${row('4 · Letter sent', 'link-sent.html', 'uk/link-sent.html')}
${row('5 · Letter: new link', 'email/new-link.html', 'email/uk/new-link.html')}
${row('5 · Letter: invitation', 'email/invitation.html', 'email/uk/invitation.html')}
${row('6 · Password saved', 'password-saved.html', 'uk/password-saved.html')}
</table></main></body></html>
`,
  );

  console.log(`${written.length} files written:\n  ${written.join('\n  ')}`);
} finally {
  await vite.close();
}
