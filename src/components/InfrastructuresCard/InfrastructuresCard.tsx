import { Button } from '@/components/Button';
import { Tag } from '@/components/Tag';

export interface InfrastructuresCardProps {
  title: string;
  description?: string;
  domain?: string;
  /** When set, domain renders as a clickable tag (societies field filter). */
  domainHref?: string;
  amount?: string;
  href?: string;
  imageSrc?: string;
  ctaLabel?: string;
  domainLabel?: string;
  amountLabel?: string;
  /** Keep meta labels on desktop too — outside listings there is no column header. */
  showMetaLabels?: boolean;
  /** Heading level — lower it to 3 when the card sits under a section heading. */
  headingLevel?: 2 | 3;
  className?: string;
  borderedTop?: boolean;
  onDomainClick?: (domain: string) => void;
}

/** Infrastructure / society list row (`.infrastructures-card`). */
export function InfrastructuresCard({
  title,
  description,
  domain,
  domainHref,
  amount,
  href = '#',
  imageSrc = '/assets/mirror/infra.jpg',
  ctaLabel = 'More details',
  domainLabel = 'Science Domain',
  amountLabel = 'Required amount',
  showMetaLabels = false,
  headingLevel = 2,
  className = '',
  borderedTop = false,
  onDomainClick,
}: InfrastructuresCardProps) {
  const Heading = headingLevel === 3 ? 'h3' : 'h2';
  const labelClass =
    `mb-1 font-mono text-text1-mobile md:text-text1-desktop ${showMetaLabels ? '' : 'md:hidden'}`.trim();

  return (
    <article
      className={`group relative border-b-2 border-brand-black py-6 md:py-4 ${
        borderedTop ? 'border-t-2' : ''
      } ${className}`.trim()}
    >
      <div className="flex flex-col gap-4 md:flex-row md:justify-between">
        <div className="md:w-7/12">
          <Heading className="font-serif text-h2-mobile text-brand-black md:text-h2-desktop">
            <span className="satr-hover-underline">{title}</span>
          </Heading>
          {description ? (
            <p className="mt-2 font-ukraine text-text2-desktop font-light">{description}</p>
          ) : null}
        </div>
        <div className="flex min-w-0 flex-col gap-4 md:w-5/12 md:flex-row md:flex-wrap md:pl-10 lg:pl-24">
          {domain ? (
            <div className="relative z-20 min-w-0 flex-1">
              <p className={labelClass}>{domainLabel}</p>
              {domainHref ? (
                <Tag
                  as="a"
                  href={domainHref}
                  variant="accent"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onDomainClick) {
                      e.preventDefault();
                      onDomainClick(domain);
                    }
                  }}
                >
                  {domain}
                </Tag>
              ) : onDomainClick ? (
                <Tag
                  variant="accent"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDomainClick(domain);
                  }}
                >
                  {domain}
                </Tag>
              ) : (
                <p className="font-ukraine text-text2-desktop font-light">{domain}</p>
              )}
            </div>
          ) : null}
          {amount ? (
            <div className="md:min-w-[140px] md:text-right">
              <p className={labelClass}>{amountLabel}</p>
              <p className="font-ukraine text-text2-desktop font-light">{amount}</p>
            </div>
          ) : null}
        </div>
      </div>
      <div className="mt-4 hidden justify-end opacity-0 transition-opacity group-hover:opacity-100 md:flex">
        <Button variant="black">{ctaLabel}</Button>
      </div>
      {imageSrc ? (
        <img
          src={imageSrc}
          alt=""
          className="pointer-events-none absolute top-4 right-[18%] hidden h-[120px] w-[180px] object-cover opacity-0 transition-opacity group-hover:opacity-100 md:block"
        />
      ) : null}
      <a href={href} className="absolute inset-0 z-10" aria-label={title} />
    </article>
  );
}

export default InfrastructuresCard;
