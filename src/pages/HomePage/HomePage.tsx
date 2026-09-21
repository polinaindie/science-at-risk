import { SiteHeader, type NavItem } from '../../components/SiteHeader/SiteHeader';
import { HomeHero, HOME_HERO_BG, type HeroLink } from '../../components/HomeHero/HomeHero';
import { SectionIntro } from '../../components/SectionIntro/SectionIntro';
import { StoryCard, type StoryCardProps } from '../../components/StoryCard/StoryCard';
import { ListCard, type ListCardProps } from '../../components/ListCard/ListCard';
import { SiteFooter, type SupportGroup } from '../../components/SiteFooter/SiteFooter';
import { type PopularRequest } from '../../components/PopularRequests/PopularRequests';

export interface HomePageProps {
  nav: NavItem[];
  social?: NavItem[];
  languages?: { label: string; href: string; active?: boolean }[];
  popular?: PopularRequest[];
  heroLinks?: HeroLink[];
  stories?: StoryCardProps[];
  /** Damaged infrastructure asking for help. */
  reconstruction?: ListCardProps[];
  supporters?: SupportGroup[];
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
}: HomePageProps) {
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
        <section className="fullSection">
          <div className="wrapper" style={{ paddingTop: '4rem', paddingBottom: '2rem' }}>
            <SectionIntro
              title="Stories"
              text="How Ukrainian science lives through the war"
              link={{ label: 'All stories', href: '#' }}
            />
            <div className="row" style={{ marginTop: '2rem' }}>
              {stories.map((story) => (
                <div className="col-md-4 col-12" key={story.title}>
                  <StoryCard {...story} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {reconstruction.length > 0 && (
        <section className="fullSection">
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
