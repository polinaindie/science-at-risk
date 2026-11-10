import { useState, type FormEvent, type ReactNode } from 'react';
import { Button } from '@/components/Button';
import { TextField } from '@/components/TextField';
import { passwordRules } from '@/components/Auth/passwordStrength';
import { cabinetCopy, type CabinetLocale } from './cabinetCopy';
import { Modal, PageTitle, Toast } from './parts';

export interface SettingsScreenProps {
  locale: CabinetLocale;
  /** The address the person signs in with. */
  email: string;
  /** Backend hook: check the current password and save the new one. Returns false when the current one is wrong. */
  onChangePassword?: (current: string, next: string) => boolean | Promise<boolean>;
  onChangeEmail?: (email: string) => void;
  onDeleteAccount?: () => void;
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function Block({ title, text, last = false, children }: { title: string; text?: string; last?: boolean; children: ReactNode }) {
  return (
    <section className={`border-t-2 border-brand-black pt-8 md:pt-10 ${last ? '' : 'pb-8 md:pb-10'}`}>
      <h2 className="font-serif text-h2-mobile md:text-h2-desktop">{title}</h2>
      {text ? (
        <p className="mt-3 max-w-[620px] font-ukraine text-text2-mobile font-light md:text-text2-desktop">{text}</p>
      ) : null}
      <div className="mt-6">{children}</div>
    </section>
  );
}

function PasswordField({
  label,
  value,
  onChange,
  error,
  autoComplete,
  show,
  hide,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  autoComplete: string;
  show: string;
  hide: string;
}) {
  const [shown, setShown] = useState(false);
  return (
    <div className="max-w-[530px]">
      <div className="relative">
        <TextField
          label={label}
          type={shown ? 'text' : 'password'}
          autoComplete={autoComplete}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-invalid={error ? true : undefined}
          className="pr-20"
        />
        <button
          type="button"
          onClick={() => setShown((v) => !v)}
          className="satr-underlined absolute bottom-2 right-0 font-mono text-breadcrumbs"
        >
          {shown ? hide : show}
        </button>
      </div>
      {error ? (
        <p role="alert" className="mt-2 font-mono text-breadcrumbs text-[#b00020]">
          {error}
        </p>
      ) : null}
    </div>
  );
}

/** Sign-in details, the letters we send, and leaving. Nothing here goes through the team's review. */
export function SettingsScreen({ locale, email, onChangePassword, onChangeEmail, onDeleteAccount }: SettingsScreenProps) {
  const t = cabinetCopy[locale].settings;

  // Email
  const [editEmail, setEditEmail] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [emailError, setEmailError] = useState<string>();
  const [emailSent, setEmailSent] = useState<string>();
  const submitEmail = (e: FormEvent) => {
    e.preventDefault();
    if (!EMAIL.test(newEmail.trim())) return setEmailError(t.email.invalid);
    onChangeEmail?.(newEmail.trim());
    setEmailSent(newEmail.trim());
    setEditEmail(false);
    setNewEmail('');
    setEmailError(undefined);
  };

  // Password
  const [cur, setCur] = useState('');
  const [next, setNext] = useState('');
  const [rep, setRep] = useState('');
  const [errs, setErrs] = useState<{ cur?: string; next?: string; rep?: string }>({});
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState<'saved' | 'failed' | null>(null);
  const rules = passwordRules(next);
  const submitPassword = async (e: FormEvent) => {
    e.preventDefault();
    if (busy) return;
    setToast(null);
    const p = t.password;
    const found = {
      cur: cur ? undefined : p.errors.current,
      next: !(rules.length && rules.letter && rules.digit)
        ? p.errors.weak
        : next === cur
          ? p.errors.same
          : undefined,
      rep: rep === next ? undefined : p.errors.mismatch,
    };
    setErrs(found);
    if (found.cur || found.next || found.rep) return;
    setBusy(true);
    try {
      const ok = (await onChangePassword?.(cur, next)) ?? true;
      if (!ok) {
        setErrs({ cur: p.errors.wrong });
        return;
      }
      setCur('');
      setNext('');
      setRep('');
      setToast('saved');
    } catch {
      // The request itself failed: the answers stay in the form, so one click tries again.
      setToast('failed');
    } finally {
      setBusy(false);
    }
  };

  // Letters
  const [letters, setLetters] = useState({ requests: true, team: true, opportunities: false });
  const [lang, setLang] = useState<CabinetLocale>(locale);

  // Delete
  const [ask, setAsk] = useState(false);
  const [deleted, setDeleted] = useState(false);

  return (
    <div>
      <PageTitle title={t.title} />

      <Block title={t.email.title} text={t.email.text}>
        <p className="m-0 font-mono text-text1-mobile md:text-text1-desktop">{email}</p>
        {emailSent ? (
          <p role="status" className="mt-4 max-w-[620px] bg-brand-accent-yellow px-4 py-3 font-ukraine text-text2-mobile font-light">
            {t.email.sent(emailSent)}
          </p>
        ) : null}
        {editEmail ? (
          <form onSubmit={submitEmail} noValidate className="mt-6 flex flex-col gap-6">
            <TextField
              label={t.email.newLabel}
              type="email"
              autoComplete="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              aria-invalid={emailError ? true : undefined}
            />
            {emailError ? (
              <p role="alert" className="-mt-4 font-mono text-breadcrumbs text-[#b00020]">
                {emailError}
              </p>
            ) : null}
            <div className="flex flex-wrap gap-3">
              <Button type="submit">{t.email.send}</Button>
              <Button variant="bordered" onClick={() => setEditEmail(false)}>
                {t.email.cancel}
              </Button>
            </div>
          </form>
        ) : (
          <div className="mt-6">
            <Button variant="bordered" onClick={() => setEditEmail(true)}>
              {t.email.change}
            </Button>
          </div>
        )}
      </Block>

      <Block title={t.password.title} text={t.password.text}>
        <form onSubmit={submitPassword} noValidate className="flex flex-col gap-6">
          <PasswordField label={t.password.current} value={cur} onChange={setCur} error={errs.cur} autoComplete="current-password" show={t.password.show} hide={t.password.hide} />
          <div className="flex flex-col gap-3">
          <PasswordField label={t.password.next} value={next} onChange={setNext} error={errs.next} autoComplete="new-password" show={t.password.show} hide={t.password.hide} />
          <div className="-mt-1">
            <ul aria-label={t.password.rulesTitle} className="m-0 flex list-none flex-wrap gap-x-6 gap-y-1 p-0 font-mono text-breadcrumbs">
              {(['length', 'letter', 'digit'] as const).map((k) => (
                <li key={k} data-met={rules[k]} className={rules[k] ? 'text-[#238636]' : ''}>
                  <span aria-hidden className={rules[k] ? 'font-bold' : ''}>
                    {rules[k] ? '✓ ' : '○ '}
                  </span>
                  {t.password.rules[k]}
                </li>
              ))}
            </ul>
          </div>
          </div>
          <PasswordField label={t.password.repeat} value={rep} onChange={setRep} error={errs.rep} autoComplete="new-password" show={t.password.show} hide={t.password.hide} />
          <div className="flex flex-wrap items-center gap-4">
            <Button type="submit" disabled={busy} aria-busy={busy}>
              {busy ? t.password.busy : t.password.submit}
            </Button>
          </div>
        </form>
      </Block>

      <Block title={t.letters.title} text={t.letters.text}>
        <ul className="m-0 flex list-none flex-col gap-4 p-0">
          {(['requests', 'team', 'opportunities'] as const).map((k) => (
            <li key={k}>
              <label className="flex cursor-pointer items-start gap-3 font-ukraine text-text2-mobile font-light md:text-text2-desktop">
                <input
                  type="checkbox"
                  checked={letters[k]}
                  onChange={(e) => setLetters((l) => ({ ...l, [k]: e.target.checked }))}
                  className="mt-1.5 size-5 shrink-0 accent-black"
                />
                {t.letters.items[k]}
              </label>
            </li>
          ))}
        </ul>
        <fieldset className="mt-8 border-0 p-0">
          <legend className="font-mono text-text1-mobile md:text-text1-desktop">{cabinetCopy[locale].settings.language.title}</legend>
          <p className="mt-2 font-ukraine text-text2-mobile font-light md:text-text2-desktop">{t.language.text}</p>
          <div className="mt-4 flex flex-wrap gap-6">
            {(['uk', 'en'] as const).map((k) => (
              <label key={k} className="flex cursor-pointer items-center gap-3 font-ukraine text-text2-mobile font-light md:text-text2-desktop">
                <input type="radio" name="letter-lang" checked={lang === k} onChange={() => setLang(k)} className="size-5 accent-black" />
                {t.language[k]}
              </label>
            ))}
          </div>
        </fieldset>
      </Block>

      <Block title={t.delete.title} text={t.delete.text} last>
        {deleted ? (
          <p role="status" className="max-w-[620px] bg-brand-accent-yellow px-4 py-3 font-ukraine text-text2-mobile font-light">
            <strong className="font-medium">{t.delete.doneTitle}.</strong> {t.delete.doneText}
          </p>
        ) : (
          <Button variant="bordered" className="satr-squircle--danger" onClick={() => setAsk(true)}>
            {t.delete.action}
          </Button>
        )}
      </Block>

      {toast ? (
        <Toast kind={toast === 'saved' ? 'success' : 'error'} closeLabel={t.password.close} onClose={() => setToast(null)}>
          {toast === 'saved' ? t.password.saved : t.password.failed}
        </Toast>
      ) : null}

      {ask ? (
        <Modal
          title={t.delete.askTitle}
          onClose={() => setAsk(false)}
          actions={
            <>
              <Button
                onClick={() => {
                  setAsk(false);
                  setDeleted(true);
                  onDeleteAccount?.();
                }}
              >
                {t.delete.confirm}
              </Button>
              <Button variant="bordered" onClick={() => setAsk(false)}>
                {t.delete.keep}
              </Button>
            </>
          }
        >
          {t.delete.askText}
        </Modal>
      ) : null}
    </div>
  );
}
