import { useState, type FormEvent } from 'react';
import { wrapperClass } from '@/components/Layout';
import { Button } from '@/components/Button';
import { TextField } from '@/components/TextField';

export interface FooterPartner {
  label: string;
  href: string;
}

export interface FooterSubmitData {
  name: string;
  email: string;
  subject: string;
  description: string;
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
  /** The reference counts the message down from 7000 and refuses a longer one. */
  maxLength?: number;
  overLimitMessage?: string;
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
  { label: 'National research fund', href: 'https://nrfu.org.ua/' },
];

/** The two headings on the right, and their links. Mono, held to a narrow
 *  measure — the reference caps them at 280px so a supporter's full legal name
 *  breaks into a stack rather than running the width of the screen. */
const RIGHT_TITLE =
  'mb-4 max-w-[280px] font-mono text-h3-mobile text-white xl:max-w-[383px] xl:text-h3-desktop min-[1440px]:max-w-[280px]';
const RIGHT_LINK =
  'satr-hover-underline satr-hover-underline--white mt-4 block font-mono text-h3-mobile text-white no-underline xl:text-h3-desktop';

/**
 * The foot of the page, as scienceatrisk.org has it: the ask across the top,
 * the form on the left, and who stands behind the project on the right.
 *
 * The widths, the paddings and the ramp are the reference's own — the form well
 * steps 360 / 460 / 486 / 530px, and from 1440 up the two right-hand columns
 * stop stacking and stand side by side on one baseline.
 */
export function Footer({
  title = 'Want\nto help?',
  subtitle = 'Fill out the form or contact us',
  submitLabel = 'Send',
  partnersTitle = 'The project is supported by:',
  implementerTitle = 'Responsible for project implementation:',
  implementerLabel = 'NGO "Kunsht"',
  implementerHref = 'https://kunsht.com.ua/',
  partners = DEFAULT_PARTNERS,
  maxLength = 7000,
  overLimitMessage = 'Please shorten your inquiry.',
  onSubmit,
  className = '',
}: FooterProps) {
  const [count, setCount] = useState(0);
  const [status, setStatus] = useState<string | null>(null);
  const over = count > maxLength;

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (over) return;
    const fd = new FormData(e.currentTarget);
    onSubmit?.({
      name: String(fd.get('name') ?? ''),
      email: String(fd.get('email') ?? ''),
      subject: String(fd.get('subject') ?? ''),
      description: String(fd.get('description') ?? ''),
    });
    setStatus('Thanks — we received your message.');
  };

  return (
    <footer
      className={`satr-on-dark bg-brand-black text-white ${className}`.trim()}
      data-node-id="292:1578"
    >
      {/* The site's one container, and the reference's own steps down from 60px
          of air to 30px as the screen gets wider and shorter on its hands. */}
      <div
        className={`${wrapperClass} py-[60px] md:py-[50px] lg:py-[40px] xl:py-[30px] min-[1440px]:py-[40px]`}
      >
        <h2 className="mb-4 font-serif text-h1 whitespace-pre-line text-white">{title}</h2>

        <div className="md:flex md:justify-between">
          {/* The form well. Its width is the reference's ladder, not a share of
              the grid — the fields stay a readable measure however wide the
              screen gets. */}
          <div className="w-full md:max-w-[360px] lg:max-w-[460px] xl:max-w-[486px] min-[1440px]:max-w-[530px]">
            <h2 className="font-mono text-h3-mobile text-white md:text-h3-desktop">{subtitle}</h2>

            <form className="mt-8" onSubmit={handleSubmit} noValidate>
              {/* Name and email share a line from `lg` up, as they do there. */}
              <div className="grid gap-6 lg:grid-cols-2">
                <TextField label="Name" name="name" tone="dark" autoComplete="name" required />
                <TextField
                  label="Email"
                  name="email"
                  type="email"
                  tone="dark"
                  autoComplete="email"
                  required
                />
              </div>

              <TextField
                label="Topic"
                name="subject"
                tone="dark"
                className="mt-6 max-w-none"
                required
              />

              <TextField
                label="Text"
                name="description"
                multiline
                rows={3}
                tone="dark"
                className="mt-6 max-w-none"
                onChange={(e) => setCount(e.currentTarget.value.length)}
                required
              />

              {/* The count, and the one thing that can be wrong with it, on the
                  same line — the reference puts the warning on the left and the
                  tally on the right under the field. */}
              <div className="mt-2 flex items-baseline justify-between gap-4 font-mono text-breadcrumbs">
                <p
                  className={over ? 'text-brand-accent-yellow' : 'sr-only'}
                  role={over ? 'alert' : undefined}
                >
                  {overLimitMessage}
                </p>
                <span className="ml-auto text-white/85">
                  ({count} / {maxLength})
                </span>
              </div>

              <Button type="submit" variant="white" className="mt-[42px] w-full md:w-auto">
                {submitLabel}
              </Button>

              {status ? (
                <p role="status" className="mt-4 font-mono text-breadcrumbs text-white/85">
                  {status}
                </p>
              ) : null}
            </form>
          </div>

          {/* Who stands behind it. A stack under `1440`, two columns standing on
              one baseline above it. */}
          <div className="mt-[55px] md:mt-0 md:max-w-[260px] lg:max-w-[390px] xl:max-w-[424px] min-[1440px]:flex min-[1440px]:max-w-none min-[1440px]:items-end min-[1440px]:gap-[60px]">
            <div className="w-full min-[1440px]:max-w-[424px]">
              <p className={RIGHT_TITLE}>{partnersTitle}</p>
              {partners.map((partner) => (
                <a
                  key={partner.href}
                  href={partner.href}
                  target="_blank"
                  rel="nofollow noopener noreferrer"
                  className={RIGHT_LINK}
                >
                  {partner.label}
                </a>
              ))}
            </div>

            <div className="mt-8 min-[1440px]:mt-0">
              <p className={RIGHT_TITLE}>{implementerTitle}</p>
              <a
                href={implementerHref}
                target="_blank"
                rel="nofollow noopener noreferrer"
                className={RIGHT_LINK}
              >
                {implementerLabel}
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
