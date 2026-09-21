import { ListCard, type ListCardProps } from '@/components/ListCard';
import { PaperCard, type PaperCardProps } from '@/components/PaperCard';
import {
  InfrastructuresCard,
  type InfrastructuresCardProps,
} from '@/components/InfrastructuresCard';

export interface InfoSectionProps {
  title?: string;
  text?: string;
  linkLabel?: string;
  linkHref?: string;
  className?: string;
}

/** Home info block (`.info`). */
export function InfoSection({
  title = 'About the project',
  text = 'Science at Risk documents damage to Ukrainian science and connects researchers with support.',
  linkLabel = 'Learn more',
  linkHref = '/about',
  className = '',
}: InfoSectionProps) {
  return (
    <section className={`px-6 py-14 md:px-10 ${className}`.trim()}>
      <h2 className="font-serif text-h1-mobile md:text-h1-desktop">{title}</h2>
      <p className="mt-4 max-w-2xl font-mono text-h3-mobile md:text-h3-desktop">{text}</p>
      <a href={linkHref} className="satr-hover-underline mt-6 inline-block font-mono text-h3-mobile md:text-h3-desktop">
        {linkLabel}
      </a>
    </section>
  );
}

export interface ResearchSectionProps {
  info?: InfoSectionProps;
  /** Prefer PaperCard-shaped items for Research & policy. */
  papers?: PaperCardProps[];
  /** @deprecated Prefer `papers` — kept for older Storybook demos. */
  cards?: ListCardProps[];
  className?: string;
}

/** Cream research + policy list (`.policies`). */
export function ResearchSection({
  info = {
    title: 'Research & policy',
    text: 'Formalized wartime expertise you can cite, share, and build on.',
    linkLabel: 'Show all studies',
    linkHref: '/research',
  },
  papers = [],
  cards = [],
  className = '',
}: ResearchSectionProps) {
  const usePapers = papers.length > 0;

  return (
    <section className={`bg-brand-accent-yellow py-14 ${className}`.trim()}>
      <div className="mx-auto flex w-full max-w-[1360px] flex-col gap-10 lg:flex-row lg:items-start lg:gap-12">
        <div className="lg:w-4/12">
          {info ? <InfoSection {...info} className="!px-6 !py-0 md:!px-10" /> : null}
        </div>
        {usePapers ? (
          <div className="px-6 md:px-10 lg:w-8/12">
            <ul className="m-0 list-none p-0">
              {papers.map((paper, index) => (
                <li key={paper.href ?? paper.title}>
                  <PaperCard
                    {...paper}
                    borderedTop={index === 0}
                    headingLevel={paper.headingLevel ?? 3}
                  />
                </li>
              ))}
            </ul>
          </div>
        ) : cards.length ? (
          <div className="px-6 md:px-10 lg:w-8/12">
            <ul className="m-0 list-none p-0">
              {cards.map((card) => (
                <li key={card.title}>
                  <ListCard
                    {...card}
                    ctaLabel={card.ctaLabel ?? 'More details'}
                    headingLevel={card.headingLevel ?? 3}
                  />
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </section>
  );
}

export interface InfrastructuresSectionProps {
  info?: InfoSectionProps;
  cards?: InfrastructuresCardProps[];
  className?: string;
}

/** Homepage "damaged infrastructure" list (`.infrastructures`). */
export function InfrastructuresSection({
  info = {
    title: 'Assistance in reconstruction',
    text: 'Scientific infrastructure damaged during the war',
    linkLabel: 'All projects',
    linkHref: '/infrastructures',
  },
  cards = [],
  className = '',
}: InfrastructuresSectionProps) {
  return (
    <section className={`bg-brand-white py-14 ${className}`.trim()}>
      <div className="mx-auto flex w-full max-w-[1360px] flex-col gap-10 lg:flex-row lg:items-start lg:gap-12">
        <div className="lg:w-4/12">
          {info ? <InfoSection {...info} className="!px-6 !py-0 md:!px-10" /> : null}
        </div>
        <div className="px-6 md:px-10 lg:w-8/12">
          <ul className="m-0 list-none p-0">
            {cards.map((card, index) => (
              <li key={card.href ?? card.title}>
                <InfrastructuresCard
                  {...card}
                  borderedTop={index === 0}
                  headingLevel={card.headingLevel ?? 3}
                />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

export default InfoSection;
