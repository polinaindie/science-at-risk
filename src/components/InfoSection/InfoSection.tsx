import { Wrapper, Row, Col } from '@/components/Layout';
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
      {/* A title set at 72px in a four-column well runs out of room on one
          word — "reconstruction" wants 485px of a 399px column — and an
          overflowing word lies across the list beside it. Hyphenated rather
          than broken: the document declares its language, so the break lands
          where the language says it may. */}
      <h2 className="font-serif text-h1 hyphens-auto">{title}</h2>
      <p className="mt-4 max-w-2xl font-mono text-h3-mobile md:text-h3-desktop">{text}</p>
      <a
        href={linkHref}
        className="satr-hover-underline mt-6 inline-block font-mono text-h3-mobile md:text-h3-desktop"
      >
        {linkLabel}
      </a>
    </section>
  );
}

export interface ResearchSectionProps {
  info?: InfoSectionProps;
  /** Sets the title block on the foot of the row rather than its head. */
  infoAtBottom?: boolean;
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
  infoAtBottom = false,
  papers = [],
  cards = [],
  className = '',
}: ResearchSectionProps) {
  const usePapers = papers.length > 0;

  return (
    <section className={`bg-brand-accent-yellow py-14 ${className}`.trim()}>
      {/* The site's one container and its twelve columns, the same ones the
          header bar and the story grid stand on — the title column and the
          list start and stop on the same lines as everything else on the
          page. */}
      <Wrapper>
        {/* `row align-items-end` on the reference: the title column and the list
            finish on the same line rather than starting on it. */}
        <Row className={`gap-y-10 ${infoAtBottom ? 'items-end' : 'items-start'}`}>
          <Col lg={4}>
            {info ? <InfoSection {...info} className="!p-0" /> : null}
          </Col>
          {usePapers ? (
            <Col lg={7} className="lg:col-start-6">
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
            </Col>
          ) : cards.length ? (
            <Col lg={7} className="lg:col-start-6">
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
            </Col>
          ) : null}
        </Row>
      </Wrapper>
    </section>
  );
}

export interface InfrastructuresSectionProps {
  info?: InfoSectionProps;
  /** Sets the title block on the foot of the row rather than its head. */
  infoAtBottom?: boolean;
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
  infoAtBottom = false,
  cards = [],
  className = '',
}: InfrastructuresSectionProps) {
  return (
    <section className={`bg-brand-white py-14 ${className}`.trim()}>
      {/* The site's one container and its twelve columns, the same ones the
          header bar and the story grid stand on — the title column and the
          list start and stop on the same lines as everything else on the
          page. */}
      <Wrapper>
        {/* `row align-items-end` on the reference: the title column and the list
            finish on the same line rather than starting on it. */}
        <Row className={`gap-y-10 ${infoAtBottom ? 'items-end' : 'items-start'}`}>
          <Col lg={4}>
            {info ? <InfoSection {...info} className="!p-0" /> : null}
          </Col>
          <Col lg={7} className="lg:col-start-6">
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
          </Col>
        </Row>
      </Wrapper>
    </section>
  );
}

export default InfoSection;
