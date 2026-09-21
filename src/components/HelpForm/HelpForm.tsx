import type { FormEvent } from 'react';
import { Button } from '@/components/Button';
import { TextField } from '@/components/TextField';

export interface HelpFormProps {
  open?: boolean;
  title?: string;
  text?: string;
  submitLabel?: string;
  onClose?: () => void;
  onSubmit?: (data: { name: string; email: string; message: string }) => void;
  className?: string;
}

/** Expert help overlay form (`.help-form` / `.expertHelp`). */
export function HelpForm({
  open = true,
  title = 'Want to help?',
  text = 'Fill in the form and we will get back to you.',
  submitLabel = 'Send',
  onClose,
  onSubmit,
  className = '',
}: HelpFormProps) {
  if (!open) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-end justify-center bg-black/20 md:items-center ${className}`.trim()}
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <button
        type="button"
        className="absolute inset-0 cursor-default border-0 bg-transparent"
        aria-label="Close"
        onClick={onClose}
      />
      <div className="relative z-10 w-full max-w-xl bg-brand-black p-8 text-white md:p-12">
        <button
          type="button"
          className="absolute top-4 right-4 border-0 bg-transparent p-0 text-white"
          aria-label="Close form"
          onClick={onClose}
        >
          <img src="/assets/ui/close.svg" alt="" width={22} height={22} />
        </button>
        <h2 className="font-serif text-h2-desktop text-white">{title}</h2>
        <p className="mt-3 font-mono text-h3-desktop text-white">{text}</p>
        <form
          className="mt-8 flex flex-col gap-5"
          onSubmit={(e: FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            const fd = new FormData(e.currentTarget);
            onSubmit?.({
              name: String(fd.get('name') ?? ''),
              email: String(fd.get('email') ?? ''),
              message: String(fd.get('message') ?? ''),
            });
          }}
        >
          <TextField label="Name" name="name" placeholder="Name" tone="dark" required />
          <TextField
            label="E-mail"
            name="email"
            type="email"
            placeholder="E-mail"
            tone="dark"
            required
          />
          <TextField
            label="Message"
            name="message"
            multiline
            placeholder="Message"
            tone="dark"
            required
          />
          <div>
            <Button type="submit" variant="white">
              {submitLabel}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default HelpForm;
