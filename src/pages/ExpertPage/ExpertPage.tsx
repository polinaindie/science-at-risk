import { useState } from 'react';
import { useParams } from 'react-router';
import { PageLayout } from '../../components/PageLayout/PageLayout';
import { ExpertAside } from '../../components/ExpertAside/ExpertAside';
import { ContactModal } from '../../components/ContactModal/ContactModal';
import { PublicationCard } from '../../components/PublicationCard/PublicationCard';
import { findExpert } from './expertProfiles';

/**
 * `/experts/:slug` — a scientist's profile: the aside with the photo and the
 * ways to reach them, the research description, and the publications.
 */
export function ExpertPage() {
  const { slug } = useParams();
  const expert = findExpert(slug);
  const [contacting, setContacting] = useState(false);

  return (
    <PageLayout
      variant="expert"
      crumbs={[{ label: 'Experts', href: '/experts' }, { label: expert.name }]}
    >
      <div className="row">
        <div className="col-lg-4 col-md-5 col-12">
          <ExpertAside
            photo={expert.photo}
            name={expert.name}
            languagesTitle="Languages for professional communication:"
            languages={expert.languages}
            links={expert.links}
            onContact={() => setContacting(true)}
          />
        </div>
        <div className="col-lg-8 col-md-7 col-12">
          <h1 className="expert__header">{expert.name}</h1>
          {expert.degree && <p className="paragraph">{expert.degree}</p>}

          {expert.sections.map((section) => (
            <div className="expertParagraph" key={section.title}>
              <p className="paragraph">
                <b>{section.title}</b>
              </p>
              <p className="paragraph">{section.text}</p>
            </div>
          ))}

          {expert.tags && expert.tags.length > 0 && (
            <ul className="tags">
              {expert.tags.map((tag) => (
                <li className="tags__item" key={tag}>
                  <p className="tag sartr-squircle">{tag}</p>
                </li>
              ))}
            </ul>
          )}

          {expert.publications && expert.publications.length > 0 && (
            <>
              <h2 className="heading heading--h2">Publications</h2>
              {expert.publications.map((publication) => (
                <PublicationCard key={publication.title} {...publication} />
              ))}
            </>
          )}
        </div>
      </div>

      <ContactModal open={contacting} onClose={() => setContacting(false)} />
    </PageLayout>
  );
}
