import { PageLayout } from '../../components/PageLayout/PageLayout';
import { aboutDate, aboutIntro, aboutSections } from './aboutContent';

/** `/about` — the project's own page, set in the site's story template. */
export function AboutPage() {
  return (
    <PageLayout variant="story" crumbs={[{ label: 'About the project' }]}>
      <div className="row">
        <div className="col-md-9 col-12">
          <h1 className="story__main-title">About us</h1>
          <p className="data">{aboutDate}</p>
        </div>
      </div>

      <div className="row flex-md-row flex-column-reverse">
        <div className="col-md-9 col-12">
          {aboutIntro.map((text) => (
            <p className="paragraph" key={text}>
              {text}
            </p>
          ))}

          {aboutSections.map((section) => (
            <section key={section.heading}>
              <h3 className="heading heading--h3">{section.heading}</h3>
              {section.paragraphs.map((text) => (
                <p className="paragraph" key={text}>
                  {text}
                </p>
              ))}
            </section>
          ))}
        </div>
      </div>
    </PageLayout>
  );
}
