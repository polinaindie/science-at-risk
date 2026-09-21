import { Button } from '@/components/Button';

export interface ProjectCardProps {
  title: string;
  texts?: string[];
  href?: string;
  ctaLabel?: string;
  showHoverCta?: boolean;
  className?: string;
}

/** Expert detail project row (`.project-card`). */
export function ProjectCard({
  title,
  texts = [],
  href = '#',
  ctaLabel = 'More details',
  showHoverCta = true,
  className = '',
}: ProjectCardProps) {
  return (
    <article
      className={`group border-b-2 border-brand-black py-6 md:py-3 ${className}`.trim()}
    >
      <header className="mb-4 flex items-start justify-between gap-4">
        <h2 className="font-serif text-h2-desktop text-brand-black">
          <span className="satr-hover-underline">{title}</span>
        </h2>
        {showHoverCta ? (
          <div className="hidden opacity-0 transition-opacity group-hover:opacity-100 md:block">
            <a href={href}>
              <Button variant="black">{ctaLabel}</Button>
            </a>
          </div>
        ) : null}
      </header>
      <div className="flex max-w-[690px] flex-col gap-4">
        {texts.map((t) => (
          <p key={t.slice(0, 24)} className="font-ukraine text-text2-desktop font-light">
            {t}
          </p>
        ))}
      </div>
    </article>
  );
}

export default ProjectCard;
