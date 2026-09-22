import { useEffect } from 'react';
import { SiteHeader, type NavItem } from '../../components/SiteHeader/SiteHeader';
import { HomeHero, HOME_HERO_BG, type HeroLink } from '../../components/HomeHero/HomeHero';
import { SectionIntro } from '../../components/SectionIntro/SectionIntro';
import { StoriesSlider, type StorySlide } from '../../components/StoriesSlider/StoriesSlider';
import { ListCard, type ListCardProps } from '../../components/ListCard/ListCard';
import { SiteFooter, type SupportGroup } from '../../components/SiteFooter/SiteFooter';
import { type PopularRequest } from '../../components/PopularRequests/PopularRequests';
import '../../styles/snap.css';

export interface HomePageProps {
  nav: NavItem[];
  social?: NavItem[];
  languages?: { label: string; href: string; active?: boolean }[];
  popular?: PopularRequest[];
  heroLinks?: HeroLink[];
  stories?: StorySlide[];
  /** Damaged infrastructure asking for help. */
  reconstruction?: ListCardProps[];
  supporters?: SupportGroup[];
  /**
   * Settle the full-height sections at the top of the viewport as you scroll,
   * the way the site's fullpage.js does. Off below 1024px and whenever the
   * reader asks for reduced motion — see `src/styles/snap.css`.
   */
  snapScroll?: boolean;
}

/**
 * The home page, opening with `HomeHero`.
 *
 * The live site splits the top in two: a `hero` section carrying the wordmark,
 * and a `search-hero` further down the page holding the search field and the
 * popular requests. The new design folds both into the first screen, so
 * `HomeHero` stands in for the pair and `SearchHero` no longer appears here.
 */
export function HomePage({
  nav,
  social,
  languages,
  popular = [],
  heroLinks = [],
  stories = [],
  reconstruction = [],
  supporters = [],
  snapScroll = true,
}: HomePageProps) {
  // The scroll container is the document, so the class goes on <html>.
  useEffect(() => {
    if (!snapScroll) return;
    const root = document.documentElement;
    root.classList.add('snap-sections');
    return () => root.classList.remove('snap-sections');
  }, [snapScroll]);

  return (
    <>
      <SiteHeader
        nav={nav}
        social={social}
        languages={languages}
        dark={false}
        divider={false}
        background={HOME_HERO_BG}
      />

      <HomeHero popular={popular} links={heroLinks} />

      {stories.length > 0 && (
        <StoriesSlider slides={stories} otherLink={{ label: 'Other stories', href: '#' }} />
      )}

      {reconstruction.length > 0 && (
        <section className="fullSection snap-section">
          <div className="wrapper" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
            <SectionIntro
              title="Assistance in reconstruction"
              text="Scientific infrastructure damaged during the war"
              link={{ label: 'All projects', href: '#' }}
            />
            <div className="list-cards" style={{ marginTop: '2rem' }}>
              {reconstruction.map((item) => (
                <ListCard {...item} key={item.title} />
              ))}
            </div>
          </div>
        </section>
      )}

      <SiteFooter groups={supporters} />
    </>
  );
}
