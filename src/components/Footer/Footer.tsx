import { useId, useState, type FormEvent } from 'react';
import { Button } from '@/components/Button';
import { Header } from '@/components/Header';
import { TextField } from '@/components/TextField';

export type HelpFormat =
  | 'expertise'
  | 'funding'
  | 'equipment'
  | 'institutional';

export interface FooterPartner {
  label: string;
  href: string;
}

export interface FooterSubmitData {
  name: string;
  email: string;
  organization: string;
  format: HelpFormat;
  message: string;
}

export interface FooterProps {
  title?: string;
  subtitle?: string;
  submitLabel?: string;
  partnersTitle?: string;
  implementerTitle?: string;
  implementerLabel?: string;
  implementerHref?: string;
  partners?: FooterPartner[];
  formatLabel?: string;
  formatOptions?: { value: HelpFormat; label: string }[];
  onSubmit?: (data: FooterSubmitData) => void;
  className?: string;
}

const DEFAULT_PARTNERS: FooterPartner[] = [
  {
    label: 'Press, Education and Culture Department of the US Embassy in Ukraine',
    href: 'https://ua.usembassy.gov/uk/education-culture-uk/',
  },
  { label: 'Alfred P. Sloan Foundation', href: 'https://sloan.org/' },
  {
    label: 'Ministry of Education and Science of Ukraine',
    href: 'https://mon.gov.ua/ua',
  },
  { label: 'National Research Foundation of Ukraine', href: 'https://nrfu.org.ua/' },
];

const DEFAULT_FORMATS: { value: HelpFormat; label: string }[] = [
  { value: 'expertise', label: 'Expertise' },
  { value: 'funding', label: 'Funding' },
  { value: 'equipment', label: 'Equipment' },
  { value: 'institutional', label: 'Institutional partnership' },
];

/**
 * Help / contact footer — capability ask last, partners as social proof.
 */
export function Footer({
  title = 'Want\nto help?',
  subtitle = 'Choose how you can collaborate — then tell us who you are.',
  submitLabel = 'Send',
  partnersTitle = 'The project is supported by:',
  implementerTitle = 'Responsible for project implementation:',
  implementerLabel = 'NGO "Kunsht"',
  implementerHref = 'https://kunsht.com.ua/',
  partners = DEFAULT_PARTNERS,
  formatLabel = 'How you can help',
  formatOptions = DEFAULT_FORMATS,
  onSubmit,
  className = '',
}: FooterProps) {
  const formatGroupId = useId();
  const [format, setFormat] = useState<HelpFormat>('expertise');
  const [status, setStatus] = useState<string | null>(null);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data: FooterSubmitData = {
      name: String(fd.get('name') ?? ''),
      email: String(fd.get('email') ?? ''),
      organization: String(fd.get('organization') ?? ''),
      format,
      message: String(fd.get('message') ?? ''),
    };
    onSubmit?.(data);
    setStatus('Thanks — we received your message.');
  };

  return (
    <footer
      className={`bg-brand-black text-white ${className}`.trim()}
      data-node-id="292:1578"
    >
      <div className="mx-auto max-w-[1440px] px-6 py-8 md:px-10">
        <Header tone="dark" className="mb-10 max-w-none md:mb-16" />

        <div className="grid gap-16 lg:grid-cols-2">
          <form className="flex max-w-[530px] flex-col gap-6" onSubmit={handleSubmit} noValidate>
            <div>
              <h2 className="whitespace-pre-line font-serif text-h1-mobile text-white md:text-h1-desktop">
                {title}
              </h2>
              <p className="mt-4 font-mono text-h3-mobile text-white md:text-h3-desktop">
                {subtitle}
              </p>
            </div>

            <fieldset className="m-0 border-0 p-0">
              <legend className="mb-3 font-mono text-breadcrumbs text-white/85" id={formatGroupId}>
                {formatLabel}
              </legend>
              <div className="flex flex-wrap gap-2.5" role="radiogroup" aria-labelledby={formatGroupId}>
                {formatOptions.map((opt) => {
                  const selected = format === opt.value;
                  return (
                    <label
                      key={opt.value}
                      className={`satr-tag inline-flex min-h-11 cursor-pointer items-center px-3 ${
                        selected ? 'satr-tag--accent ring-2 ring-white ring-offset-2 ring-offset-brand-black' : ''
                      }`}
                    >
                      <input
                        type="radio"
                        name="format"
                        value={opt.value}
                        checked={selected}
                        onChange={() => setFormat(opt.value)}
                        className="sr-only"
                      />
                      <span className="font-mono text-text1-mobile text-brand-black md:text-text1-desktop">
                        {opt.label}
                      </span>
                    </label>
                  );
                })}
              </div>
            </fieldset>

            <TextField
              label="Name"
              name="name"
              placeholder="Your name"
              tone="dark"
              autoComplete="name"
              required
            />
            <TextField
              label="Email"
              name="email"
              type="email"
              placeholder="you@institution.edu"
              tone="dark"
              autoComplete="email"
              required
            />
            <TextField
              label="Organization"
              name="organization"
              placeholder="University, lab, foundation…"
              tone="dark"
              autoComplete="organization"
            />
            <TextField
              label="Message"
              name="message"
              multiline
              placeholder="What are you looking to build together?"
              tone="dark"
              required
            />

            <div className="pt-2">
              <Button type="submit" variant="white">
                {submitLabel}
              </Button>
            </div>
            {status ? (
              <p role="status" className="font-mono text-breadcrumbs text-white/85">
                {status}
              </p>
            ) : null}
          </form>

          <aside className="flex flex-col gap-10 lg:pt-24">
            <div>
              <p className="font-mono text-h3-mobile text-white md:text-h3-desktop">
                {implementerTitle}
              </p>
              <p className="mt-4 font-ukraine text-text2-desktop font-light">
                <a
                  className="satr-hover-underline satr-hover-underline--white text-white"
                  href={implementerHref}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {implementerLabel}
                </a>
              </p>
            </div>
          </aside>
        </div>

        {/* Partners as a full-width social-proof row — typographic, no invented logos. */}
        <div className="mt-16 border-t border-white/25 pt-10">
          <p className="font-mono text-h3-mobile text-white md:text-h3-desktop">{partnersTitle}</p>
          <ul className="mt-6 m-0 grid list-none gap-4 p-0 sm:grid-cols-2 lg:grid-cols-4">
            {partners.map((partner) => (
              <li key={partner.href}>
                <a
                  href={partner.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="satr-hover-underline satr-hover-underline--white inline-block min-h-11 font-ukraine text-text2-mobile font-light text-white md:text-text2-desktop"
                >
                  {partner.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
