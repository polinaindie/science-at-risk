import { useCallback, useEffect, useRef, useState } from 'react';
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
import { HomeSiteHeader, type HomeSiteHeaderProps } from '@/sandbox/HomeSiteHeader';

export interface HomePageProps {
  /**
   * 'carousel' (default): story-carousel hero, then Search, White Papers, Footer.
   * 'search': hero+search combined variant (HomeHeroSearch), followed by
   * Stories, Researches, Damaged Infrastructure, then Footer (Figma node 21:4755).
   */
  heroVariant?: 'carousel' | 'search';
  hero?: HomeHeroSandboxProps;
  heroSearch?: HomeHeroSearchProps;
  /** The bar that stands over every block on the search ordering. */
  header?: HomeSiteHeaderProps;
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
/**
 * The blocks of the search ordering, each with the ground the bar takes while
 * standing on it and whether its ink turns white there.
 */
const SEARCH_BLOCKS = [
  { ground: 'bg-brand-accent-blue', inverted: false },
  { ground: 'bg-brand-black', inverted: true },
  { ground: 'bg-brand-accent-yellow', inverted: false },
  { ground: 'bg-brand-white', inverted: false },
  { ground: 'bg-brand-black', inverted: true },
] as const;

/** Close enough to the end of the flight to call it landed — a snap point can
 *  settle a fraction of a pixel short of the block's top. */
const LANDED = 0.995;

export function HomePage({
  heroVariant = 'carousel',
  hero,
  heroSearch,
  header,
  search = defaultSearch,
  stories = defaultStories,
  whitepapers = defaultWhitepapers,
  researches = defaultResearches,
  infrastructure = defaultInfrastructure,
  footer,
  className = '',
}: HomePageProps) {
  const isSearchHero = heroVariant === 'search';

  /** How far the wordmark has come from the hero into the bar, 0..1. It is the
   *  scroll itself: the stories block rides up over the hero in exactly one
   *  hero's height, and the wordmark makes its whole journey in that time. */
  const [logo, setLogo] = useState(0);
  /** Which block the bar is standing on. */
  const [on, setOn] = useState(0);

  const scrollRef = useRef<HTMLDivElement>(null);
  const blockRefs = useRef<(HTMLDivElement | null)[]>([]);
  const barRef = useRef<HTMLDivElement>(null);
  const barLogoRef = useRef<HTMLImageElement>(null);
  const wordmarkRef = useRef<HTMLHeadingElement>(null);
  const flierRef = useRef<HTMLImageElement>(null);

  const setBlock = (i: number) => (node: HTMLDivElement | null) => {
    blockRefs.current[i] = node;
  };

  /** Reads the scroll and puts the bar and the travelling wordmark where it
   *  says they are. */
  const read = useCallback(() => {
    const scroller = scrollRef.current;
    const bar = barRef.current;
    if (!scroller || !bar) return;
    const top = scroller.scrollTop;
    const blocks = blockRefs.current;
    const heroH = blocks[0]?.offsetHeight || window.innerHeight;
    const barH = bar.offsetHeight;

    let p = Math.min(1, Math.max(0, top / heroH));
    if (p > LANDED) p = 1;

    // The blocks are sticky, so where one stands on screen says nothing about
    // where it sits in the page. Their heights do: each one starts where the
    // ones before it end, and it is under the bar once its top has passed the
    // middle of the bar.
    let under = 0;
    let start = 0;
    blocks.forEach((node, i) => {
      if (!node) return;
      if (start - top <= barH / 2) under = i;
      start += node.offsetHeight;
    });

    setLogo(p);
    setOn(under);

    // The hero's own wordmark steps aside the moment the copy takes off: at
    // that moment the two are the same picture in the same place.
    const heading = wordmarkRef.current;
    const flier = flierRef.current;
    if (heading) heading.style.opacity = p > 0 ? '0' : '1';
    if (!flier) return;
    const img = heading?.querySelector('img');
    const slot = barLogoRef.current;
    if (!img || !slot || p === 0 || p === 1) {
      flier.style.display = 'none';
      return;
    }

    // The hero is sticky at the top of the screen, so its wordmark stands in
    // the same place however far the page has scrolled; the slot in the bar
    // does too. Both ends of the flight can be read straight off the screen.
    const from = img.getBoundingClientRect();
    const to = slot.getBoundingClientRect();
    const scale = 1 + (to.height / from.height - 1) * p;
    const x = from.left + (to.left - from.left) * p;
    const y = from.top + (to.top - from.top) * p;

    // White over anything dark: the stories block as it comes up underneath,
    // and the bar once it has taken that block's ink.
    const middle = y + (from.height * scale) / 2;
    const storiesTop = heroH - top;
    const inverted =
      middle < barH ? SEARCH_BLOCKS[under].inverted : middle > storiesTop && SEARCH_BLOCKS[1].inverted;

    flier.style.display = 'block';
    flier.style.left = `${from.left}px`;
    flier.style.top = `${from.top}px`;
    flier.style.height = `${from.height}px`;
    flier.style.transform = `translate(${x - from.left}px, ${y - from.top}px) scale(${scale})`;
    flier.style.filter = inverted ? 'brightness(0) invert(1)' : '';
  }, []);

  useEffect(() => {
    if (!isSearchHero) return;
    const scroller = scrollRef.current;
    if (!scroller) return;
    let frame = 0;
    const schedule = () => {
      if (!frame) {
        frame = requestAnimationFrame(() => {
          frame = 0;
          read();
        });
      }
    };
    read();
    scroller.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      scroller.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
    };
  }, [isSearchHero, read]);

  if (isSearchHero) {
    const block = SEARCH_BLOCKS[on];
    return (
      <div
        ref={scrollRef}
        className={`h-[100svh] snap-y snap-proximity overflow-y-auto bg-brand-white ${className}`.trim()}
      >
        {/* The bar stays at the top of the screen over every block and takes
            the ground and ink of the one it is standing on. It is sticky in a
            box of no height, so it takes no room from the blocks under it. */}
        <div className="sticky top-0 z-[60] h-0">
          <div ref={barRef}>
            <HomeSiteHeader
              logo={logo}
              ground={block.ground}
              inverted={block.inverted}
              logoRef={barLogoRef}
              {...header}
            />
          </div>
        </div>

        <div ref={setBlock(0)} className="sticky top-0 z-10 flex min-h-[100svh] snap-start flex-col bg-brand-white">
          <HomeHeroSearch wordmarkRef={wordmarkRef} {...heroSearch} />
        </div>

        <div ref={setBlock(1)} className="sticky top-0 z-20 flex min-h-[100svh] snap-start flex-col bg-brand-black">
          {/* Figma frame "Stories-final" (node 94:10608). */}
          <HomeStoriesFinal stories={stories} className="flex-1" />
        </div>

        <div
          ref={setBlock(2)}
          className="sticky top-0 z-30 flex min-h-[100svh] snap-start flex-col justify-center bg-brand-accent-yellow pt-[86px]"
        >
          <ResearchSection {...researches} />
        </div>

        <div
          ref={setBlock(3)}
          className="sticky top-0 z-40 flex min-h-[100svh] snap-start flex-col justify-center bg-brand-white pt-[86px]"
        >
          <InfrastructuresSection {...infrastructure} />
        </div>

        <div
          ref={setBlock(4)}
          className="sticky top-0 z-50 flex min-h-[100svh] snap-start flex-col justify-center bg-brand-black pt-[86px]"
        >
          <Footer {...footer} />
        </div>

        {/* The travelling wordmark. It only exists between its two homes, over
            everything else including the bar it is heading for. */}
        <img
          ref={flierRef}
          src="/assets/ui/wordmark-hero.svg"
          alt=""
          aria-hidden
          className="pointer-events-none fixed z-[70] w-auto max-w-none"
          style={{ display: 'none', transformOrigin: 'left top' }}
        />
      </div>
    );
  }

  return (
    <div
      className={`h-[100svh] snap-y snap-proximity overflow-y-auto bg-brand-white ${className}`.trim()}
    >
      <div className="sticky top-0 z-10 flex min-h-[100svh] snap-start flex-col bg-brand-white">
        <HomeHeroSandbox {...hero} />
      </div>

      <div className="sticky top-0 z-20 flex min-h-[100svh] snap-start flex-col justify-center bg-brand-accent-blue">
        <SearchHero {...search} />
      </div>

      <div className="sticky top-0 z-30 flex min-h-[100svh] snap-start flex-col justify-center bg-brand-white">
        <InfoSection {...whitepapers} />
      </div>

      <div className="sticky top-0 z-40 flex min-h-[100svh] snap-start flex-col justify-center bg-brand-black">
        <Footer {...footer} />
      </div>
    </div>
  );
}

export default HomePage;
