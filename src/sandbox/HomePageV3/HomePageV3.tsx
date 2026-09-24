import { HomeMonoblockV3, type HomeMonoblockV3Props } from '@/sandbox/HomeMonoblockV3';
import { countSections, socialLinks, utilityLinks } from './sections';

export interface HomePageV3Props {
  monoblock?: HomeMonoblockV3Props;
  className?: string;
}

/**
 * V3 experiment — the homepage as a single screen that routes to every other
 * section, instead of a scroll through the content itself.
 */
export function HomePageV3({ monoblock, className = '' }: HomePageV3Props) {
  return (
    <HomeMonoblockV3
      sections={countSections}
      utilityLinks={utilityLinks}
      socialLinks={socialLinks}
      className={className}
      {...monoblock}
    />
  );
}

export default HomePageV3;
