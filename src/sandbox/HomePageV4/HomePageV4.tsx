import { SiteHeaderV4, type SiteHeaderV4Props } from '@/sandbox/SiteHeaderV4';
import {
  HomeHeroStoriesIndexV4,
  type HomeHeroStoriesIndexV4Props,
} from '@/sandbox/HomeHeroStoriesIndexV4';
import { Footer, type FooterProps } from '@/components/Footer';

export interface HomePageV4Props {
  header?: SiteHeaderV4Props;
  hero?: HomeHeroStoriesIndexV4Props;
  footer?: FooterProps;
  className?: string;
}

/**
 * V4 experiment — search moves into the header, where it is reachable from any
 * page, and the whole hero goes to the stories as an index with a preview.
 * Research and infrastructure live behind their links rather than as sections.
 *
 * `withSpacer` is off: the hero sizes itself against the fixed chrome
 * (`100svh - 66px` plus its own top padding), so a spacer would add the 66px
 * twice and push the first screen down.
 */
export function HomePageV4({ header, hero, footer, className = '' }: HomePageV4Props) {
  return (
    <div className={`bg-brand-white ${className}`.trim()}>
      <SiteHeaderV4 withSpacer={false} {...header} />
      <HomeHeroStoriesIndexV4 {...hero} />
      <Footer {...footer} />
    </div>
  );
}

export default HomePageV4;
