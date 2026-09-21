import type { FormEvent } from 'react';
import { TextField } from '../TextField/TextField';

export interface SupportGroup {
  title: string;
  links: { label: string; href: string }[];
}

export interface SiteFooterProps {
  title?: string;
  formTitle?: string;
  submitLabel?: string;
  labels?: { name: string; email: string; topic: string; text: string };
  /** Sponsor and implementer columns on the right. */
  groups?: SupportGroup[];
  onSubmit?: (event: FormEvent<HTMLFormElement>) => void;
}

/** The site's `.footer` — the "Want to help?" contact section. */
export function SiteFooter({
  title = 'Want to help?',
  formTitle = 'Fill out the form or contact us',
  submitLabel = 'Send',
  labels = { name: 'Name', email: 'Email', topic: 'Topic', text: 'Text' },
  groups = [],
  onSubmit,
}: SiteFooterProps) {
  return (
    <footer className="footer fullSection">
      <div className="wrapper">
        <h2 className="footer__main-title">{title}</h2>
        <div className="footer__wrapper">
          <div className="footer__left">
            <h2 className="footer__subtitle">{formTitle}</h2>
            <form
              className="footer__form"
              onSubmit={(e) => {
                e.preventDefault();
                onSubmit?.(e);
              }}
            >
              <div className="footer__input">
                <div className="row">
                  <div className="col-lg-6 col-12">
                    <TextField className="footer__input" label={labels.name} name="name" required />
                  </div>
                  <div className="col-lg-6 col-12">
                    <TextField
                      className="footer__input footer__input--email"
                      label={labels.email}
                      name="email"
                      type="email"
                      required
                    />
                  </div>
                </div>
              </div>
              <TextField className="footer__input" label={labels.topic} name="subject" required />
              <TextField className="footer__input" label={labels.text} name="description" multiline required />
              <button className="footer__btn btn btn--white" type="submit">
                {submitLabel}
              </button>
            </form>
          </div>
          <div className="footer__right-wrap">
            {groups.map((group, i) => (
              <div className={i === 0 ? 'footer__center' : 'footer__right'} key={group.title}>
                <h2 className="footer__title">{group.title}</h2>
                {group.links.map((link) => (
                  <a
                    className="footer__link"
                    target="_blank"
                    href={link.href}
                    rel="nofollow"
                    key={link.label}
                  >
                    <span className="hover hover--underline hover--white">{link.label}</span>
                  </a>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
