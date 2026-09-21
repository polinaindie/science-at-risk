import { useState } from 'react';
import { HomeHeroSandbox, type HomeHeroSandboxProps } from '@/sandbox/HomeHeroSandbox';
import { HomeHeroSearch, type HomeHeroSearchProps } from '@/sandbox/HomeHeroSearch';
import { SearchHero, type SearchHeroProps } from '@/components/SearchHero';
import {
  InfoSection,
  InfrastructuresSection,
  type InfoSectionProps,
  type InfrastructuresSectionProps,
} from '@/components/InfoSection';
import { StoriesSlide, type StoriesSlideProps } from '@/components/StoriesSlide';
import { Footer, type FooterProps } from '@/components/Footer';

export interface HomePageProps {
  /**
   * 'carousel' (default): story-carousel hero, then Search, White Papers, Footer.
   * 'search': hero+search combined variant (HomeHeroSearch), followed by
   * Stories, White Papers, Damaged Infrastructure, then Footer.
   */
  heroVariant?: 'carousel' | 'search';
  hero?: HomeHeroSandboxProps;
  heroSearch?: HomeHeroSearchProps;
  search?: SearchHeroProps;
  stories?: StoriesSlideProps[];
  whitepapers?: InfoSectionProps;
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

const defaultStories: StoriesSlideProps[] = [
  {
    title: 'Science in Chernobyl: occupation, recovery, and future challenges',
    text: 'How Ukrainian researchers continue field work in the Exclusion Zone despite occupation, infrastructure loss, and the long shadow of the 1986 disaster.',
    href: '/story/science-in-chernobyl',
    imageSrc:
      'https://scienceatrisk.org/storage/lp/138/35bad048a94c9d66ebfeffe80817af579e4a2290.png',
  },
  {
    title: 'Stolen museum. Kherson',
    text: 'What did the Russians steal from the Kherson Local History Museum during the retreat from the city and how did the director-collaborator contribute to this?',
    href: '/story/stolen-museum-kherson',
    imageSrc: 'https://scienceatrisk.org/storage/lp/13/1c9d9f1dc389e5e2561ede474b210a5b32d7ec01.png',
  },
  {
    title: "Test Tubes in the Count's Estate",
    text: 'The main building of the Institute of Agricultural Microbiology and Industrial Production is located in Count Glebov’s “castle.” Read how the institute has been functioning since the outbreak of full-scale war.',
    href: '/story/test-tubes-in-the-counts-estate',
    imageSrc: 'https://scienceatrisk.org/storage/lp/131/9463255b2210d4cbe1c460b411ada8ec0bca54cd.png',
  },
];

const defaultWhitepapers: InfoSectionProps = {
  title: 'White Papers',
  text: 'Formalized and organized experience of Ukrainian scientists in the preservation of scientific works, collections and institutions',
  linkLabel: 'Show all studies',
  linkHref: '/whitepapers',
};

const defaultInfrastructure: InfrastructuresSectionProps = {
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

/** Homepage stories section — cycles a small set of featured stories. */
function HomeStoriesSection({ stories = defaultStories }: { stories?: StoriesSlideProps[] }) {
  const [index, setIndex] = useState(0);
  const total = stories.length;
  if (!total) return null;
  const goTo = (delta: number) => setIndex((i) => (i + delta + total) % total);

  return (
    <StoriesSlide {...stories[index]} onPrev={() => goTo(-1)} onNext={() => goTo(1)} />
  );
}

/**
 * Homepage draft. Two orderings depending on `heroVariant`:
 * - 'carousel': hero (with its own story carousel), Search, White Papers, Footer.
 * - 'search': hero+search combined, Stories, White Papers, Damaged Infrastructure, Footer.
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
          <HomeStoriesSection stories={stories} />
        </div>
      ) : (
        <div className="sticky top-0 z-20 flex min-h-[100svh] snap-start flex-col justify-center bg-brand-accent-blue">
          <SearchHero {...search} />
        </div>
      )}

      <div className="sticky top-0 z-30 flex min-h-[100svh] snap-start flex-col justify-center bg-brand-white">
        <InfoSection {...whitepapers} />
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
