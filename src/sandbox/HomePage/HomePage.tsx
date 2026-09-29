import { HomeHeroSandbox, type HomeHeroSandboxProps } from '@/sandbox/HomeHeroSandbox';
import { HomeHeroSearch, type HomeHeroSearchProps } from '@/sandbox/HomeHeroSearch';
import { SearchHero, type SearchHeroProps } from '@/components/SearchHero';
import {
  InfoSection,
  ResearchSection,
  InfrastructuresSection,
  type InfoSectionProps,
  type ResearchSectionProps,
  type InfrastructuresSectionProps,
} from '@/components/InfoSection';
import {
  HomeStoriesFinal,
  defaultHomeStoriesFinal,
  type HomeStoriesFinalStory,
} from '@/sandbox/HomeStoriesFinal';
import { Footer, type FooterProps } from '@/components/Footer';

export interface HomePageProps {
  /**
   * 'carousel' (default): story-carousel hero, then Search, White Papers, Footer.
   * 'search': hero+search combined variant (HomeHeroSearch), followed by
   * Stories, Researches, Damaged Infrastructure, then Footer (Figma node 21:4755).
   */
  heroVariant?: 'carousel' | 'search';
  hero?: HomeHeroSandboxProps;
  heroSearch?: HomeHeroSearchProps;
  search?: SearchHeroProps;
  /** Stories for the search variant's second block, paged three at a time. */
  stories?: HomeStoriesFinalStory[];
  whitepapers?: InfoSectionProps;
  researches?: ResearchSectionProps;
  infrastructure?: InfrastructuresSectionProps;
  footer?: FooterProps;
  className?: string;
}

const defaultSearch: SearchHeroProps = {
  title: 'Find Ukrainian scientists for collaboration',
  headingLevel: 2,
  placeholder: 'Scientific field or name',
  buttonLabel: 'Find a scientist',
  note: 'Mark the scientific field that interests you - find and involve Ukrainian scientists in your own projects',
  noteLinkLabel: 'To the full database of scientists',
  noteHref: '/experts',
  popularTags: [
    { label: 'Teaching', count: 101, value: 'teaching', href: '/experts?tag=teaching' },
    {
      label: 'Science popularization',
      count: 86,
      value: 'science-popularization',
      href: '/experts?tag=science-popularization',
    },
    { label: 'Biology', count: 57, value: 'biology', href: '/experts?tag=biology' },
    {
      label: 'Natural sciences',
      count: 55,
      value: 'natural-sciences',
      href: '/experts?tag=natural-sciences',
    },
    { label: 'Biochemistry', count: 41, value: 'biochemistry', href: '/experts?tag=biochemistry' },
  ],
};

/** The three featured stories from the live site, then three more so the
 *  pager has a second set to turn to. */
const defaultStories: HomeStoriesFinalStory[] = defaultHomeStoriesFinal;

const defaultWhitepapers: InfoSectionProps = {
  title: 'White Papers',
  text: 'Formalized and organized experience of Ukrainian scientists in the preservation of scientific works, collections and institutions',
  linkLabel: 'Show all studies',
  linkHref: '/whitepapers',
};

/** Figma node 21:4854 — yellow "Researches" band, 3 repeated papers. */
export const defaultResearches: ResearchSectionProps = {
  info: {
    title: 'Researches',
    text: 'Formalized and organized experience of Ukrainian scientists in the preservation of scientific works, collections and institutions',
    linkLabel: 'Show all researches',
    linkHref: '/research',
  },
  papers: [
    {
      title: 'Preserving science during the war',
      description:
        'The results of the study formed recommendations for preserving Ukrainian science under wartime conditions',
      href: '/research/preserving-science-during-the-war',
      downloadHref: '/research/preserving-science-during-the-war.pdf',
      downloadLabel: 'Download',
    },
    {
      title: 'Preserving science during the war',
      description:
        'The results of the study formed recommendations for preserving Ukrainian science under wartime conditions',
      href: '/research/preserving-science-during-the-war-2',
      downloadHref: '/research/preserving-science-during-the-war-2.pdf',
      downloadLabel: 'Download',
    },
    {
      title: 'Preserving science during the war',
      description:
        'The results of the study formed recommendations for preserving Ukrainian science under wartime conditions',
      href: '/research/preserving-science-during-the-war-3',
      downloadHref: '/research/preserving-science-during-the-war-3.pdf',
      downloadLabel: 'Download',
    },
  ],
};

export const defaultInfrastructure: InfrastructuresSectionProps = {
  cards: [
    {
      title: 'Institute for Problems of Cryobiology and Cryomedicine',
      amount: '~ 500 000 UAH',
      href: '/infrastructures/cryobiology-cryomedicine',
      showMetaLabels: true,
    },
    {
      title:
        'Danilevsky Institute for Endocrine Pathology Problems of the National Academy of Medical Sciences of Ukraine',
      amount: '~ 3 478 972 UAH',
      href: '/infrastructures/danilevsky-institute',
      showMetaLabels: true,
    },
    {
      title: 'Institute for Safety Problems of Nuclear Power Plants',
      amount: '~ 366 627 780 UAH',
      href: '/infrastructures/nuclear-safety-institute',
      showMetaLabels: true,
    },
  ],
};

/**
 * Homepage draft. Two orderings depending on `heroVariant`:
 * - 'carousel': hero (with its own story carousel), Search, White Papers, Footer.
 * - 'search': hero+search combined, Stories, Researches, Damaged Infrastructure, Footer
 *   (Figma node 21:4755).
 *
 * Sections are `position: sticky` at `top: 0` with increasing z-index and
 * an opaque background, so each one pins to the top of the viewport and the
 * next section's opaque background visually covers it as it scrolls up —
 * the same "block over block" effect as the live site's fullPage.js sections,
 * done with plain CSS (scroll-snap + sticky) instead of a scroll-hijacking library.
 */
export function HomePage({
  heroVariant = 'carousel',
  hero,
  heroSearch,
  search = defaultSearch,
  stories = defaultStories,
  whitepapers = defaultWhitepapers,
  researches = defaultResearches,
  infrastructure = defaultInfrastructure,
  footer,
  className = '',
}: HomePageProps) {
  const isSearchHero = heroVariant === 'search';

  return (
    <div
      className={`h-[100svh] snap-y snap-proximity overflow-y-auto bg-brand-white ${className}`.trim()}
    >
      <div className="sticky top-0 z-10 flex min-h-[100svh] snap-start flex-col bg-brand-white">
        {isSearchHero ? <HomeHeroSearch {...heroSearch} /> : <HomeHeroSandbox {...hero} />}
      </div>

      {isSearchHero ? (
        <div className="sticky top-0 z-20 flex min-h-[100svh] snap-start flex-col bg-brand-black">
          {/* Figma frame "Stories-final" (node 94:10608). */}
          <HomeStoriesFinal stories={stories} className="flex-1" />
        </div>
      ) : (
        <div className="sticky top-0 z-20 flex min-h-[100svh] snap-start flex-col justify-center bg-brand-accent-blue">
          <SearchHero {...search} />
        </div>
      )}

      <div
        className={`sticky top-0 z-30 flex min-h-[100svh] snap-start flex-col justify-center ${
          isSearchHero ? 'bg-brand-accent-yellow' : 'bg-brand-white'
        }`}
      >
        {isSearchHero ? <ResearchSection {...researches} /> : <InfoSection {...whitepapers} />}
      </div>

      {isSearchHero ? (
        <div className="sticky top-0 z-40 flex min-h-[100svh] snap-start flex-col justify-center bg-brand-white">
          <InfrastructuresSection {...infrastructure} />
        </div>
      ) : null}

      <div
        className={`sticky top-0 flex min-h-[100svh] snap-start flex-col justify-center bg-brand-black ${
          isSearchHero ? 'z-50' : 'z-40'
        }`}
      >
        <Footer {...footer} />
      </div>
    </div>
  );
}

export default HomePage;
