import { useParams } from 'react-router';
import { PageLayout } from '../../components/PageLayout/PageLayout';
import { societies } from '../SocietiesPage/societiesContent';

const LINKS = [
  { label: 'Website', href: '#' },
  { label: 'Facebook', href: '#' },
  { label: 'Linkedin', href: '#' },
];

/** `/societies/:slug` — one scientific society: what it does and where to find it. */
export function SocietyPage() {
  const { slug } = useParams();
  const society = societies.find((item) => item.href.endsWith(`/${slug}`)) ?? societies[0];

  return (
    <PageLayout
      variant="scientific-societies"
      crumbs={[{ label: 'Scientific societies', href: '/societies' }, { label: society.title }]}
    >
      <div className="search-hero__info-wrap">
        <h1 className="search-hero__title">{society.title}</h1>
      </div>

      <div className="content">
        <p className="paragraph">{society.text}</p>

        <h2 className="heading heading--h3 indent-top">Science Domain</h2>
        <p className="paragraph">{society.domain}</p>

        <h2 className="heading heading--h3 indent-top">Find the society</h2>
        <div className="scientific-societies__links">
          {LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="nofollow"
              className="hover hover--underline scientific-societies__link"
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </PageLayout>
  );
}
