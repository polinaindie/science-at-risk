import { HomeHeroSearchV2, type HomeHeroSearchV2Props } from '@/sandbox/HomeHeroSearchV2';
import {
  ResearchSection,
  InfrastructuresSection,
  type ResearchSectionProps,
  type InfrastructuresSectionProps,
} from '@/components/InfoSection';
import { Footer, type FooterProps } from '@/components/Footer';

export interface HomePageV2Props {
  hero?: HomeHeroSearchV2Props;
  research?: ResearchSectionProps;
  infrastructure?: InfrastructuresSectionProps;
  footer?: FooterProps;
  className?: string;
}

/** Figma node 21:4854 — yellow "Research" band (was "Whitepapers"), 3 repeated papers. */
const defaultResearch: ResearchSectionProps = {
  info: {
    title: 'Research',
    text: 'Formalized and organized experience of Ukrainian scientists in the preservation of scientific works, collections and institutions',
    linkLabel: 'Show all research',
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

/**
 * V2 homepage experiment. The featured stories live inside the hero itself
 * (HomeHeroSearchV2), so the first screen hooks visitors with the storytelling;
 * its quick-link row leads with Stories, then Experts, then Research. The old
 * "Whitepapers" band is now "Research".
 *
 * Sections are `position: sticky` at `top: 0` with increasing z-index and
 * an opaque background, so each one pins to the top of the viewport and the
 * next section's opaque background visually covers it as it scrolls up —
 * the same "block over block" effect as the live site's fullPage.js sections,
 * done with plain CSS (scroll-snap + sticky) instead of a scroll-hijacking library.
 */
export function HomePageV2({
  hero,
  research = defaultResearch,
  infrastructure = defaultInfrastructure,
  footer,
  className = '',
}: HomePageV2Props) {
  return (
    <div
      className={`h-[100svh] snap-y snap-proximity overflow-y-auto bg-brand-white ${className}`.trim()}
    >
      <div className="sticky top-0 z-10 flex min-h-[100svh] snap-start flex-col bg-brand-white">
        <HomeHeroSearchV2 {...hero} />
      </div>

      <div className="sticky top-0 z-30 flex min-h-[100svh] snap-start flex-col justify-center bg-brand-accent-yellow">
        <ResearchSection {...research} />
      </div>

      <div className="sticky top-0 z-40 flex min-h-[100svh] snap-start flex-col justify-center bg-brand-white">
        <InfrastructuresSection {...infrastructure} />
      </div>

      <div className="sticky top-0 z-50 flex min-h-[100svh] snap-start flex-col justify-center bg-brand-black">
        <Footer {...footer} />
      </div>
    </div>
  );
}

export default HomePageV2;
