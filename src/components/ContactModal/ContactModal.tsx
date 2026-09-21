import type { FormEvent } from 'react';
import { TextField } from '../TextField/TextField';
import { Button } from '../Button/Button';

export interface ContactModalProps {
  title?: string;
  text?: string;
  labels?: { name: string; email: string; text: string };
  submitLabel?: string;
  closeLabel?: string;
  /** The site renders the popup only while it is open. */
  open?: boolean;
  onClose?: () => void;
  onSubmit?: (event: FormEvent<HTMLFormElement>) => void;
}

const CloseIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M13 1L1 13" stroke="black" strokeLinecap="square" strokeLinejoin="round" />
    <path d="M1 1L13 13" stroke="black" strokeLinecap="square" strokeLinejoin="round" />
  </svg>
);

/** The `.help-form` popup used to write to a scientist directly. */
export function ContactModal({
  title = 'Contact a scientist',
  text = 'Fill out this form to contact the scientist directly',
  labels = { name: 'Name', email: 'Email', text: 'Text' },
  submitLabel = 'Send',
  closeLabel = 'Close',
  open = true,
  onClose,
  onSubmit,
}: ContactModalProps) {
  if (!open) return null;

  return (
    <div className="help-form active">
      <div className="help-form__bg" onClick={onClose} />
      <div className="wrapper position-relative">
        <Button className="help-form__btn-close" variant="white" onClick={onClose}>
          {closeLabel}
          <CloseIcon />
        </Button>
        <h2 className="help-form__title">{title}</h2>
        <p className="help-form__text">{text}</p>
        <form
          className="help-form__form"
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit?.(e);
          }}
        >
          <div className="row">
            <div className="col-md-5 d-flex align-items-end">
              <TextField className="help-form__input" label={labels.name} name="name" required />
            </div>
            <div className="col-md-5 d-flex align-items-end order-md-0 order-1">
              <TextField className="help-form__input" label={labels.text} name="description" multiline required />
            </div>
            <div className="col-md-5 d-flex align-items-end">
              <TextField
                className="help-form__input mb-md-0"
                label={labels.email}
                name="email"
                type="email"
                required
              />
            </div>
            <div className="col-md-5 d-flex align-items-end order-md-0 order-2 mt-5">
              <Button className="help-form__submit" variant="white" type="submit">
                {submitLabel}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
