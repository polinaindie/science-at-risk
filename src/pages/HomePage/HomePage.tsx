import { useMemo, useState } from 'react';
import { SiteHeader, type HeaderTone, type NavItem } from '../../components/SiteHeader/SiteHeader';
import { HomeHero, HOME_HERO_BG, type HeroLink } from '../../components/HomeHero/HomeHero';
import { SectionIntro } from '../../components/SectionIntro/SectionIntro';
import { StoriesSlider, type StorySlide } from '../../components/StoriesSlider/StoriesSlider';
import { ListCard, type ListCardProps } from '../../components/ListCard/ListCard';
import { SectionDeck, type DeckSection } from '../../components/SectionDeck/SectionDeck';
import { SiteFooter, type SupportGroup } from '../../components/SiteFooter/SiteFooter';
import { type PopularRequest } from '../../components/PopularRequests/PopularRequests';
import { ROUTES } from '../../content/site';

export interface HomePageProps {
  nav: NavItem[];
  social?: NavItem[];
  languages?: { label: string; href: string; active?: boolean }[];
  popular?: PopularRequest[];
  heroLinks?: HeroLink[];
  stories?: StorySlide[];
  /** Damaged infrastructure asking for help. */
  reconstruction?: ListCardProps[];
  /** The studies the project publishes. */
  research?: ListCardProps[];
  supporters?: SupportGroup[];
  /**
   * Read the page one screen at a time, the way the site's fullpage.js does:
   * the next section slides up over the one you are leaving. Off below
   * 1024px, on short windows and whenever the reader asks for reduced motion
   * — see `SectionDeck`.
   */
  deckScroll?: boolean;
}

/**
 * The home page, opening with `HomeHero`.
 *
 * The live site splits the top in two: a `hero` section carrying the wordmark,
 * and a `search-hero` further down the page holding the search field and the
 * popular requests. The new design folds both into the first screen, so
 * `HomeHero` stands in for the pair and `SearchHero` no longer appears here.
 *
 * The header is pinned above the deck and takes its colour from the section on
 * screen — the site's own `data-color`, black over a light field and white
 * over a dark one.
 */
export function HomePage({
  nav,
  social,
  languages,
  popular = [],
  heroLinks = [],
  stories = [],
  reconstruction = [],
  research = [],
  supporters = [],
  deckScroll = true,
}: HomePageProps) {
  const [tone, setTone] = useState<HeaderTone>('black');

  const sections = useMemo<DeckSection[]>(() => {
    const list: DeckSection[] = [
      { key: 'hero', tone: 'black', node: <HomeHero popular={popular} links={heroLinks} /> },
    ];

    if (stories.length > 0) {
      list.push({
        key: 'stories',
        tone: 'white',
        node: (
          <StoriesSlider slides={stories} otherLink={{ label: 'Other stories', href: ROUTES.stories }} />
        ),
      });
    }

    if (research.length > 0) {
      list.push({
        key: 'research',
        tone: 'black',
        node: (
          <section className="policies fullSection">
            <div className="wrapper">
              <div className="policies__wrapper">
                <div className="row align-items-end">
                  <div className="col-lg-4 col-md-4 col-12">
                    <SectionIntro
                      title="Research"
                      text="What Ukrainian scientists learned keeping their work alive through the war"
                      link={{ label: 'Show all studies', href: ROUTES.research }}
                    />
                  </div>
                  <div className="offset-md-1 col-md-7 col-12">
                    <ul className="list-cards">
                      {research.map((item) => (
                        <li className="list-cards__item" key={item.title}>
                          <ListCard {...item} />
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>
        ),
      });
    }

    if (reconstruction.length > 0) {
      list.push({
        key: 'reconstruction',
        tone: 'black',
        node: (
          <section className="help fullSection">
            <div className="wrapper">
              <div className="help__wrapper">
                <div className="row align-items-end">
                  <div className="col-lg-4 col-md-4 col-12">
                    <SectionIntro
                      title="Assistance in reconstruction"
                      text="Scientific infrastructure damaged during the war. Each entry lists what the institution needs and who to reach."
                      link={{ label: 'All projects', href: ROUTES.infrastructures }}
                    />
                  </div>
                  <div className="offset-md-1 col-md-7 col-12">
                    <header className="help__header">
                      <p className="help__text">Institution and object</p>
                      <p className="help__text">Required amount</p>
                    </header>
                    <ul className="list-cards">
                      {reconstruction.map((item) => (
                        <li className="list-cards__item" key={item.title}>
                          <ListCard {...item} />
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>
        ),
      });
    }

    list.push({ key: 'footer', tone: 'white', node: <SiteFooter groups={supporters} /> });
    return list;
  }, [popular, heroLinks, stories, research, reconstruction, supporters]);

  return (
    <>
      <SiteHeader
        nav={nav}
        social={social}
        languages={languages}
        tone={tone}
        fixed
        divider={false}
        background={HOME_HERO_BG}
      />

      <SectionDeck sections={sections} onToneChange={setTone} enabled={deckScroll} />
    </>
  );
}
