import { Button } from '@/components/Button';

export interface PaperCardProps {
  title: string;
  description?: string;
  /** Topic / policy theme line. */
  topic?: string;
  /** Who this paper is useful for. */
  usefulFor?: string;
  /** Optional usage proof. */
  downloads?: string;
  citedBy?: string;
  fileType?: string;
  href?: string;
  downloadHref?: string;
  ctaLabel?: string;
  downloadLabel?: string;
  /** Heading level — lower it to 3 when the card sits under a section heading. */
  headingLevel?: 2 | 3;
  className?: string;
  borderedTop?: boolean;
}

/** Research list row — title, topic, audience, optional usage proof. */
export function PaperCard({
  title,
  description,
  topic,
  usefulFor,
  downloads,
  citedBy,
  fileType = '.pdf',
  href = '#',
  downloadHref,
  ctaLabel = 'More details',
  downloadLabel = 'Download',
  headingLevel = 2,
  className = '',
  borderedTop = false,
}: PaperCardProps) {
  const Heading = headingLevel === 3 ? 'h3' : 'h2';
  const proof = [downloads, citedBy].filter(Boolean).join(' · ');

  return (
    <article
      className={`group relative border-b-2 border-brand-black py-6 md:pb-11 md:pt-3 ${
        borderedTop ? 'border-t-2' : ''
      } ${className}`.trim()}
    >
      <div className="flex flex-col gap-4 md:flex-row md:justify-between">
        <div className="md:w-8/12">
          {topic ? (
            <p className="mb-2 font-mono text-breadcrumbs text-brand-muted">{topic}</p>
          ) : null}
          <Heading className="font-serif text-h2-mobile text-brand-black md:text-h2-desktop">
            <span className="satr-hover-underline">{title}</span>
          </Heading>
          {description ? (
            <p className="mt-2 font-ukraine text-text2-desktop font-light">{description}</p>
          ) : null}
          {usefulFor ? (
            <p className="mt-3 font-ukraine text-text2-mobile font-light md:text-text2-desktop">
              <span className="font-mono text-breadcrumbs text-brand-muted">Useful for: </span>
              {usefulFor}
            </p>
          ) : null}
          {proof ? (
            <p className="mt-2 font-mono text-breadcrumbs text-brand-muted">{proof}</p>
          ) : null}
        </div>
        <div className="flex items-start gap-4 md:w-4/12 md:justify-end">
          <p className="font-mono text-text1-desktop">{fileType}</p>
        </div>
      </div>
      <div className="mt-4 hidden justify-end gap-3 opacity-0 transition-opacity group-hover:opacity-100 md:flex">
        <Button variant="bordered">{ctaLabel}</Button>
        {downloadHref ? <Button variant="black">{downloadLabel}</Button> : null}
      </div>
      <a href={href} className="absolute inset-0 z-10" aria-label={title} />
    </article>
  );
}

export default PaperCard;
