import { useParams } from 'react-router';
import { PageLayout } from '../../components/PageLayout/PageLayout';
import { Gallery } from '../../components/Gallery/Gallery';
import { Button } from '../../components/Button/Button';
import { infrastructures } from '../InfrastructuresPage/infrastructuresContent';

const GALLERY = [
  { src: '/img/story-lp-233.jpg', alt: 'Damaged building' },
  { src: '/img/story-lp-226.jpg', alt: 'Damaged interior' },
];

/**
 * `/infrastructures/:slug` — one damaged institution: what it is, what it
 * needs, a gallery of the damage and who to talk to.
 */
export function InfrastructurePage() {
  const { slug } = useParams();
  const entry =
    infrastructures.find((item) => item.href.endsWith(`/${slug}`)) ?? infrastructures[0];

  return (
    <PageLayout
      variant="infrastructure"
      crumbs={[{ label: 'Damaged infrastructure', href: '/infrastructures' }, { label: entry.title }]}
    >
      <div className="infrastructure__wrapper">
        <div className="row align-items-start">
          <div className="col-md-6 col-12">
            <h1 className="infrastructure__header font-mini">{entry.title}</h1>
            <p className="infrastructure__text">{entry.text}</p>
          </div>
          <div className="col-md-6 col-12">
            <div className="infrastructure__info">
              <div className="row">
                <div className="col-md-4 pr-0">
                  <p className="infrastructure__sec-title">Science Domain</p>
                </div>
                <div className="col-md-8">
                  <p className="infrastructure__sec-text">{entry.domain}</p>
                </div>
              </div>
              <div className="row">
                <div className="col-md-4 pr-0">
                  <p className="infrastructure__sec-title">Required amount</p>
                </div>
                <div className="col-md-8">
                  <p className="infrastructure__sec-text">{entry.amount}</p>
                </div>
              </div>
            </div>
            <Button href="#">Help this institution</Button>
          </div>
        </div>
      </div>

      <div className="infrastructure__slider-wrap">
        <Gallery images={GALLERY} />
      </div>
    </PageLayout>
  );
}
