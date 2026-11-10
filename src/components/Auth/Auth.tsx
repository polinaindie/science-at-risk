import type { ReactNode } from 'react';
import { TextField } from '@/components/TextField';
import { authCopy, type AuthLocale } from './authCopy';
import { passwordLevel, passwordRules } from './passwordStrength';

/**
 * The cabinet's sign-in screens. They only draw: the state (an error, a busy
 * button) comes in as props, and the words come from `authCopy`. Each form
 * carries its messages as `data-msg-*` attributes so a script, or the server,
 * can show them without owning any copy.
 */

export interface AuthBaseProps {
  locale?: AuthLocale;
  /** Where the form posts. A placeholder: the backend owns these routes. */
  action?: string;
  /** The button is busy: it holds still and shows a ring. */
  loading?: boolean;
  className?: string;
}

/* ───────── shared pieces ───────── */

interface FieldProps {
  name: string;
  label: string;
  type?: string;
  autoComplete?: string;
  inputMode?: 'text' | 'email' | 'numeric';
  hint?: string;
  error?: string;
  value?: string;
  msgRequired: string;
  msgInvalid?: string;
  reveal?: { show: string; hide: string };
  describedBy?: string;
}

function Field({
  name,
  label,
  type = 'text',
  autoComplete,
  inputMode,
  hint,
  error,
  value,
  msgRequired,
  msgInvalid,
  reveal,
}: FieldProps) {
  const id = `auth-${name}`;
  return (
    <div
      className={`satr-auth__field${reveal ? ' satr-auth__field--reveal' : ''}`}
      data-invalid={error ? 'true' : undefined}
    >
      <TextField
        id={id}
        name={name}
        label={label}
        type={type}
        autoComplete={autoComplete}
        inputMode={inputMode}
        defaultValue={value}
        required
        aria-invalid={error ? true : undefined}
        aria-describedby={`${id}-msg`}
        data-msg-required={msgRequired}
        data-msg-invalid={msgInvalid}
        spellCheck={false}
        autoCapitalize="none"
      />
      {reveal ? (
        <button
          type="button"
          className="satr-auth__reveal"
          aria-controls={id}
          aria-pressed="false"
          data-satr-reveal=""
          data-show={reveal.show}
          data-hide={reveal.hide}
        >
          {reveal.show}
        </button>
      ) : null}
      <p id={`${id}-msg`} className="satr-auth__under" aria-live="polite">
        <span data-satr-hint="" hidden={!!error || !hint}>
          {hint}
        </span>
        <span className="satr-auth__error" data-satr-error="" hidden={!error}>
          {error}
        </span>
      </p>
    </div>
  );
}

function Submit({ label, busyLabel, loading }: { label: string; busyLabel: string; loading?: boolean }) {
  return (
    <button
      type="submit"
      className="satr-auth__btn"
      aria-busy={loading ? 'true' : undefined}
      disabled={loading}
      data-busy-label={busyLabel}
    >
      {label}
    </button>
  );
}

export interface AuthPageProps {
  title: string;
  lede?: string;
  children?: ReactNode;
  aside?: ReactNode;
  mark?: string;
  className?: string;
}

/** The frame every screen shares: heading, one line of explanation, the
 *  form, and a quiet note under a rule. */
export function AuthPage({ title, lede, children, aside, mark, className = '' }: AuthPageProps) {
  return (
    <section className={`satr-auth ${className}`.trim()}>
      {mark ? (
        <p className="satr-auth__mark" aria-hidden>
          {mark}
        </p>
      ) : null}
      <h1 className="satr-auth__title">{title}</h1>
      {lede ? <p className="satr-auth__lede">{lede}</p> : null}
      {children}
      {aside ? <div className="satr-auth__aside">{aside}</div> : null}
    </section>
  );
}

/* ───────── 1 · /login — email and password ───────── */

export interface LoginFormProps extends AuthBaseProps {
  /** The server refused the pair. */
  error?: 'invalid';
  emailError?: string;
  passwordError?: string;
  email?: string;
  /** Where a good sign-in goes next (the static demo reads this). */
  nextHref?: string;
  forgotHref?: string;
  firstLoginHref?: string;
}

/** The note for people who were never invited: the entry is by invitation, and that is all it says. */
function InviteOnlyNote({ title, text }: { title: string; text: string }) {
  return (
    <>
      <p className="satr-auth__aside-title">{title}</p>
      <p>{text}</p>
    </>
  );
}

export function LoginForm({
  locale = 'en',
  action = '/login',
  loading,
  error,
  emailError,
  passwordError,
  email,
  nextHref = 'cabinet',
  forgotHref = 'forgot-password.html',
  firstLoginHref = 'first-login.html',
  className,
}: LoginFormProps) {
  const t = authCopy[locale];
  const l = t.login;
  return (
    <AuthPage
      title={l.title}
      lede={l.lede}
      className={className}
      aside={
        <InviteOnlyNote title={l.noInviteTitle} text={l.noInvite} />
      }
    >
      <form
        className="satr-auth__form"
        method="post"
        action={action}
        noValidate
        data-satr-auth="login"
        data-next={nextHref}
        data-msg-invalid={l.errors.invalid}
      >
        <div className="satr-auth__alert" role="alert" data-satr-alert="" hidden={!error}>
          {error ? l.errors[error] : ''}
        </div>
        <Field
          name="email"
          label={l.email}
          type="email"
          autoComplete="username"
          inputMode="email"
          value={email}
          error={emailError}
          msgRequired={l.errors.emailRequired}
          msgInvalid={l.errors.emailInvalid}
        />
        <Field
          name="password"
          label={l.password}
          type="password"
          autoComplete="current-password"
          error={passwordError}
          msgRequired={l.errors.passwordRequired}
          reveal={{ show: l.show, hide: l.hide }}
        />
        <Submit label={l.submit} busyLabel={t.loading} loading={loading} />
        <p className="satr-auth__row">
          <a className="satr-auth__link" href={forgotHref}>
            {l.forgot}
          </a>
        </p>
        <p className="satr-auth__row satr-auth__row--quiet">
          <a className="satr-auth__link" href={firstLoginHref}>
            {l.firstTime}
          </a>
        </p>
      </form>
    </AuthPage>
  );
}

/* ───────── 1b · first sign-in from the letter — email and one-time password ───────── */

export type FirstLoginError = 'invalid' | 'expired';

export interface FirstLoginFormProps extends AuthBaseProps {
  /** A failure from the server, shown above the form. */
  error?: FirstLoginError;
  emailError?: string;
  otpError?: string;
  email?: string;
  nextHref?: string;
  forgotHref?: string;
  loginHref?: string;
}

export function FirstLoginForm({
  locale = 'en',
  action = '/first-login',
  loading,
  error,
  emailError,
  otpError,
  email,
  nextHref = 'set-password.html',
  forgotHref = 'forgot-password.html',
  loginHref = 'login.html',
  className,
}: FirstLoginFormProps) {
  const t = authCopy[locale];
  const l = t.firstLogin;
  const note = t.login;
  return (
    <AuthPage
      title={l.title}
      lede={l.lede}
      className={className}
      aside={
        <InviteOnlyNote title={note.noInviteTitle} text={note.noInvite} />
      }
    >
      <form
        className="satr-auth__form"
        method="post"
        action={action}
        noValidate
        data-satr-auth="first-login"
        data-next={nextHref}
        data-msg-invalid={l.errors.invalid}
        data-msg-expired={l.errors.expired}
      >
        <div className="satr-auth__alert" role="alert" data-satr-alert="" hidden={!error}>
          {error ? l.errors[error] : ''}
        </div>
        <Field
          name="email"
          label={l.email}
          type="email"
          autoComplete="username"
          inputMode="email"
          value={email}
          error={emailError}
          msgRequired={l.errors.emailRequired}
          msgInvalid={l.errors.emailInvalid}
        />
        <Field
          name="otp"
          label={l.otp}
          autoComplete="one-time-code"
          hint={l.otpHint}
          error={otpError}
          msgRequired={l.errors.otpRequired}
        />
        <Submit label={l.submit} busyLabel={t.loading} loading={loading} />
        <p className="satr-auth__row">
          <a className="satr-auth__link" href={forgotHref}>
            {l.lost}
          </a>
        </p>
        <p className="satr-auth__row satr-auth__row--quiet">
          <a className="satr-auth__link" href={loginHref}>
            {l.haveAccount}
          </a>
        </p>
      </form>
    </AuthPage>
  );
}

/* ───────── 2 · first sign-in: choose a password ───────── */

export interface SetPasswordFormProps extends AuthBaseProps {
  /** A password to show the meter and the checklist for (stories). */
  previewPassword?: string;
  passwordError?: string;
  repeatError?: string;
}

export function SetPasswordForm({
  locale = 'en',
  action = '/set-password',
  loading,
  previewPassword = '',
  passwordError,
  repeatError,
  className,
}: SetPasswordFormProps) {
  const t = authCopy[locale];
  const s = t.setPassword;
  const rules = passwordRules(previewPassword);
  const level = passwordLevel(previewPassword);
  const reveal = { show: s.show, hide: s.hide };
  return (
    <AuthPage title={s.title} lede={s.lede} className={className}>
      <form
        className="satr-auth__form"
        method="post"
        action={action}
        noValidate
        data-satr-auth="set-password"
        data-msg-too-weak={s.errors.tooWeak}
        data-msg-mismatch={s.errors.mismatch}
        data-levels={s.strength.levels.join('|')}
      >
        <Field
          name="password"
          label={s.password}
          type="password"
          autoComplete="new-password"
          value={previewPassword}
          error={passwordError}
          msgRequired={s.errors.required}
          reveal={reveal}
        />

        <p className="satr-auth__rules-title" id="auth-rules-title">
          {s.requirementsTitle}
        </p>
        <ul className="satr-auth__rules" aria-labelledby="auth-rules-title" data-satr-rules="">
          {(['length', 'letter', 'digit'] as const).map((key) => (
            <li
              key={key}
              className="satr-auth__rule"
              data-rule={key}
              data-met={rules[key] ? 'true' : 'false'}
            >
              {s.rules[key]}
            </li>
          ))}
        </ul>

        <div
          className="satr-auth__meter"
          data-satr-meter=""
          data-level={level}
          role="status"
          aria-live="polite"
        >
          <span>{s.strength.label}</span>
          <span className="satr-auth__meter-bars" aria-hidden>
            <span />
            <span />
            <span />
            <span />
          </span>
          <span className="satr-auth__meter-label" data-satr-meter-label="">
            {level ? s.strength.levels[level - 1] : '—'}
          </span>
        </div>

        <Field
          name="repeat"
          label={s.repeat}
          type="password"
          autoComplete="new-password"
          value={previewPassword && !repeatError ? previewPassword : undefined}
          error={repeatError}
          msgRequired={s.errors.repeatRequired}
          reveal={reveal}
        />
        <Submit label={s.submit} busyLabel={t.loading} loading={loading} />
      </form>
    </AuthPage>
  );
}

/* ───────── 3 · forgot password / send the letter again ───────── */

export interface ForgotPasswordFormProps extends AuthBaseProps {
  emailError?: string;
  email?: string;
  backHref?: string;
}

export function ForgotPasswordForm({
  locale = 'en',
  action = '/forgot-password',
  loading,
  emailError,
  email,
  backHref = 'login.html',
  className,
}: ForgotPasswordFormProps) {
  const t = authCopy[locale];
  const f = t.forgot;
  return (
    <AuthPage title={f.title} lede={f.lede} className={className}>
      <form
        className="satr-auth__form"
        method="post"
        action={action}
        noValidate
        data-satr-auth="forgot"
      >
        <Field
          name="email"
          label={f.email}
          type="email"
          autoComplete="username"
          inputMode="email"
          value={email}
          error={emailError}
          msgRequired={f.errors.emailRequired}
          msgInvalid={f.errors.emailInvalid}
        />
        <Submit label={f.submit} busyLabel={t.loading} loading={loading} />
        <p className="satr-auth__row">
          <a className="satr-auth__link" href={backHref}>
            {f.back}
          </a>
        </p>
      </form>
    </AuthPage>
  );
}

/* ───────── 4 · "the letter is sent" — the same for every address ───────── */

export interface LinkSentNoticeProps {
  locale?: AuthLocale;
  backHref?: string;
  againHref?: string;
  className?: string;
}

/** Says the same thing whoever asked and whatever they typed, and never
 *  repeats the address: it must not tell anyone who is in the system. */
export function LinkSentNotice({
  locale = 'en',
  backHref = 'login.html',
  againHref = 'forgot-password.html',
  className,
}: LinkSentNoticeProps) {
  const s = authCopy[locale].sent;
  return (
    <AuthPage title={s.title} mark="!!!" className={className}>
      <div role="status">
        <p className="satr-auth__lede" style={{ marginBottom: 16 }}>
          {s.text}
        </p>
        <p className="satr-auth__under" style={{ marginTop: 0 }}>
          {s.spam}
        </p>
      </div>
      <a className="satr-auth__btn" href={backHref}>
        {s.back}
      </a>
      <p className="satr-auth__row">
        <a className="satr-auth__link" href={againHref}>
          {s.again}
        </a>
      </p>
    </AuthPage>
  );
}

/* ───────── 6 · password saved → the cabinet ───────── */

export interface PasswordSavedNoticeProps {
  locale?: AuthLocale;
  cabinetHref?: string;
  className?: string;
}

export function PasswordSavedNotice({
  locale = 'en',
  cabinetHref = 'cabinet',
  className,
}: PasswordSavedNoticeProps) {
  const s = authCopy[locale].saved;
  return (
    <AuthPage title={s.title} mark="!!!" className={className}>
      <p className="satr-auth__lede" role="status">
        {s.text}
      </p>
      <a className="satr-auth__btn" href={cabinetHref}>
        {s.cta}
      </a>
    </AuthPage>
  );
}
