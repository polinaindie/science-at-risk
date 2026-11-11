import { useState } from 'react';
import { useParams } from 'react-router';
import { useLink, useLocale, useMessages } from '../../i18n';
import { scientistsMessages } from '../../i18n/messages/scientists';
import { asset } from '../../content/assets';
import { PageLayout } from '../../components/PageLayout/PageLayout';
import { ExpertAside } from '../../components/ExpertAside/ExpertAside';
import { ContactModal } from '../../components/ContactModal/ContactModal';
import { PublicationCard } from '../../components/PublicationCard/PublicationCard';
import { Tag } from '../../components/Tag/Tag';
import { NotFoundPage } from '../NotFoundPage/NotFoundPage';
import { searchString } from '../ExpertsPage/scientistSearch';
import { tagLabel } from '../ExpertsPage/scientistTaxonomy';
import { findScientist } from './expertProfiles';
import './ExpertPage.css';

/**
 * `/scientists/:slug` — a scientist's profile: the aside with the photo and
 * the ways to reach them, the research description, the keywords (each one a
 * link back into the directory) and the publications.
 */
export function ExpertPage() {
  const { slug } = useParams();
  const locale = useLocale();
  const link = useLink();
  const t = useMessages(scientistsMessages);
  const [contacting, setContacting] = useState(false);

  const scientist = findScientist(slug);
  if (!scientist) return <NotFoundPage />;

  const text = scientist[locale];
  const photo = scientist.photo && {
    src: asset(scientist.photo.path),
    width: scientist.photo.width,
    height: scientist.photo.height,
  };
  const sections = [
    { title: t.profile.research, text: text.research },
    { title: t.profile.duties, text: text.duties },
    { title: t.profile.experience, text: text.experience },
  ].filter((section) => section.text);

  return (
    <PageLayout
      variant="expert"
      crumbs={[{ label: t.crumb, href: '/scientists' }, { label: text.name }]}
    >
      <div className="row">
        <div className="col-lg-4 col-md-5 col-12">
          <ExpertAside
            photo={photo}
            name={text.name}
            photoAlt={t.card.photoAlt(text.name)}
            contactLabel={t.profile.connect}
            languagesTitle={t.profile.languagesTitle}
            languages={text.languages}
            links={scientist.links}
            linksLabel={t.profile.links}
            onContact={() => setContacting(true)}
          />
        </div>
        <div className="col-lg-8 col-md-7 col-12">
          <h1 className="expert__header">{text.name}</h1>
          {text.degree && <p className="paragraph">{text.degree}</p>}
          {text.affiliation && (
            <p className="paragraph scientist__affiliation">
              <svg className="scientist__affiliation-icon" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false">
                <path
                  d="M3 21h18M5 21V10l7-5 7 5v11M9 21v-6h6v6M12 10v.01"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="square"
                  strokeLinejoin="miter"
                />
              </svg>
              <span>{text.affiliation}</span>
            </p>
          )}

          {sections.map((section) => (
            <section className="scientist__section" key={section.title}>
              <h2 className="expertTitle expertTitle--h2 scientist__title">{section.title}</h2>
              <p className="expertParagraph">{section.text}</p>
            </section>
          ))}

          {scientist.tags.length > 0 && (
            <section className="scientist__section">
              <h2 className="expertTitle expertTitle--h2 scientist__title">{t.profile.keywords}</h2>
              <ul className="tags">
                {scientist.tags.map((tag) => (
                  <li className="tags__item" key={tag}>
                    <Tag label={tagLabel(tag, locale)} href={link('/scientists') + searchString({ tags: [tag] })} />
                  </li>
                ))}
              </ul>
            </section>
          )}

          {scientist.publications.length > 0 && (
            <section className="scientist__section">
              <h2 className="expertTitle expertTitle--h2 scientist__title">{t.profile.publications}</h2>
              <ul className="projects">
                {scientist.publications.map((publication) => (
                  <li className="projects__item" key={publication.href}>
                    <PublicationCard {...publication} buttonLabel={t.profile.read} headingLevel="h3" />
                  </li>
                ))}
              </ul>
            </section>
          )}

          <p className="scientist__back">
            <a className="hover hover--underline main-text main-text--mono" href={link('/scientists')}>
              ← {t.profile.backToSearch}
            </a>
          </p>
        </div>
      </div>

      <ContactModal open={contacting} onClose={() => setContacting(false)} />
    </PageLayout>
  );
}
