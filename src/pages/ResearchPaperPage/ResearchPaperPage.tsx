import { useParams } from 'react-router';
import { PageLayout } from '../../components/PageLayout/PageLayout';
import { Button } from '../../components/Button/Button';
import { researchPapers } from '../ResearchPage/researchContent';

const SUMMARY = [
  'This white paper gathers what Ukrainian researchers have learned in wartime and puts it into a form other institutions can act on.',
  'The full text is in the PDF beside this page; the page itself carries the abstract, the authors and the file.',
];

/** `/research/:slug` — one study, with the file in the aside. */
export function ResearchPaperPage() {
  const { slug } = useParams();
  const paper = researchPapers.find((item) => item.slug === slug) ?? researchPapers[0];

  return (
    <PageLayout
      variant="paper"
      crumbs={[{ label: 'Research', href: '/research' }, { label: paper.title }]}
    >
      <div className="row">
        <div className="col-md-9 col-12">
          <h1 className="paper__main-title">{paper.title}</h1>
          <p className="paragraph">{paper.authors}</p>
        </div>
      </div>

      <section className="paper__wrapper">
        <div className="row flex-md-row flex-column-reverse">
          <div className="col-md-9 col-12">
            {(paper.summary ?? SUMMARY).map((text) => (
              <p className="paragraph" key={text}>
                {text}
              </p>
            ))}
          </div>

          <div className="offset-xl-1 col-xl-2 col-md-3 col-12">
            <aside className="paper-aside">
              <Button className="paper-aside__download" href="#" overlayLink>
                Download
              </Button>
              <p className="paper-aside__text paper-aside__size">
                .pdf{paper.fileSize ? ` · ${paper.fileSize}` : ''}
              </p>
            </aside>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
