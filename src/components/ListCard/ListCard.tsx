import { Button } from '@/components/Button';

export interface ListCardProps {
  title: string;
  text?: string;
  /** Institution / object name — metadata, not the headline. */
  entity?: string;
  price?: string;
  href?: string;
  ctaLabel?: string;
  /** Label above the amount on mobile; desktop may use a column header instead. */
  amountLabel?: string;
  /** Heading level — lower it to 3 when the card sits under a section heading. */
  headingLevel?: 2 | 3;
  className?: string;
}

/** Format raw UAH amounts for display (~ 500,000 UAH / ~ 366.6 million UAH). */
export function formatUahAmount(raw: string | number, locale: 'en' | 'uk' = 'en'): string {
  const text = String(raw ?? '').trim();
  const match = text.match(/([\d\s.,]+)/);
  if (!match) return text;
  const n = parseInt(match[1].replace(/[\s.,]/g, ''), 10);
  if (!Number.isFinite(n) || n <= 0) return text;
  const suffix = locale === 'uk' ? 'грн' : 'UAH';
  if (n >= 1_000_000) {
    const millions = n / 1_000_000;
    const rounded =
      millions >= 100 ? Math.round(millions).toString() : millions.toFixed(1).replace(/\.0$/, '');
    return `~ ${rounded} ${locale === 'uk' ? 'млн' : 'million'} ${suffix}`;
  }
  return `~ ${n.toLocaleString(locale === 'uk' ? 'uk-UA' : 'en-US')} ${suffix}`;
}

/**
 * Homepage infrastructure / fundraising row.
 * Capability lives in the title; institution and amount are detail.
 */
export function ListCard({
  title,
  text,
  entity,
  price,
  href = '#',
  ctaLabel = 'More details',
  amountLabel = 'Reconstruction cost',
  headingLevel = 2,
  className = '',
}: ListCardProps) {
  const Heading = headingLevel === 3 ? 'h3' : 'h2';
  const displayPrice =
    price && /^\s*~?\s*[\d\s.,]+\s*(UAH|грн)?\s*$/i.test(price)
      ? formatUahAmount(price)
      : price;

  return (
    <article
      className={`group relative border-b-2 border-brand-black py-4 md:py-6 ${className}`.trim()}
    >
      <header className="mb-3 flex items-start justify-between gap-4">
        <div className="min-w-0">
          <Heading className="font-serif text-h2-mobile text-brand-black md:text-h2-desktop">
            <span className="satr-hover-underline">{title}</span>
          </Heading>
          {entity ? (
            <p className="mt-2 font-mono text-breadcrumbs text-brand-muted">{entity}</p>
          ) : null}
        </div>
        {displayPrice ? (
          <p className="hidden shrink-0 font-mono text-text1-desktop md:block">{displayPrice}</p>
        ) : null}
      </header>
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        {text ? (
          <p className="max-w-[397px] font-ukraine text-text2-desktop font-light">{text}</p>
        ) : null}
        <div className="flex items-center justify-between gap-4">
          {displayPrice ? (
            <div className="md:hidden">
              <p className="font-mono text-breadcrumbs text-brand-muted">{amountLabel}</p>
              <p className="font-mono text-text1-desktop">{displayPrice}</p>
            </div>
          ) : null}
          <div className="opacity-100 transition-opacity md:opacity-0 md:group-hover:opacity-100">
            <Button variant="black">{ctaLabel}</Button>
          </div>
        </div>
      </div>
      <a href={href} className="absolute inset-0 z-10" aria-label={title} />
    </article>
  );
}

export default ListCard;
