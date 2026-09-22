import { PageLayout } from '../../components/PageLayout/PageLayout';
import { PaperCard } from '../../components/PaperCard/PaperCard';
import { researchPapers } from './researchContent';

/** `/research` — the studies the project publishes, "Policies" on the old site. */
export function ResearchPage() {
  return (
    <PageLayout crumbs={[{ label: 'Research' }]} variant="papers" wrap={false}>
      <section className="papers-hero">
        <div className="wrapper">
          <div className="row">
            <div className="col-md-7">
              <h1 className="papers-hero__title">Research</h1>
              <p className="papers-hero__text">
                What Ukrainian scientists learned keeping their work alive through the war
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="papers-hero__wrapper">
        <div className="wrapper">
          <div className="papers-hero__list">
            {researchPapers.map((paper) => (
              <PaperCard
                key={paper.slug}
                title={paper.title}
                authors={paper.authors}
                href={`/research/${paper.slug}`}
              />
            ))}
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
