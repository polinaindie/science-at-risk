import { Button } from '@/components/Button';

export interface PersonCardProps {
  name: string;
  position?: string;
  imageSrc?: string;
  imageAlt?: string;
  contactHref?: string;
  contactLabel?: string;
  helpLabel?: string;
  onHelpClick?: () => void;
  className?: string;
}

/** Expert / infrastructure contact strip (`.person-card`). */
export function PersonCard({
  name,
  position,
  imageSrc = '/assets/mirror/expert.jpg',
  imageAlt = '',
  contactHref,
  contactLabel = 'Contact',
  helpLabel = 'Want to help?',
  onHelpClick,
  className = '',
}: PersonCardProps) {
  return (
    <section
      className={`bg-brand-accent-yellow px-6 py-10 md:min-h-[420px] md:px-10 md:py-14 ${className}`.trim()}
    >
      <div className="mx-auto flex max-w-[1440px] flex-col gap-8 md:flex-row md:items-center md:gap-16">
        <img
          src={imageSrc}
          alt={imageAlt}
          className="h-[343px] w-full object-cover md:size-[260px] md:shrink-0"
        />
        <div>
          <h2 className="font-serif text-h2-desktop text-brand-black">{name}</h2>
          {position ? (
            <p className="mt-2 font-mono text-text1-desktop text-brand-black">{position}</p>
          ) : null}
          <div className="mt-8 flex flex-wrap gap-3">
            {contactHref ? (
              <a href={contactHref}>
                <Button variant="black">{contactLabel}</Button>
              </a>
            ) : null}
            {onHelpClick ? (
              <Button variant="bordered" onClick={onHelpClick}>
                {helpLabel}
              </Button>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}

export default PersonCard;
