/** Sample content for the home page, taken from the live site. */
import type { HomePageProps } from './HomePage';
import { ROUTES, nav, social, languages, supporters } from '../../content/site';
import { pickFeaturedStories } from '../StoriesPage/storiesContent';
import { pickReconstruction } from '../InfrastructuresPage/infrastructuresContent';
import { experts } from '../ExpertsPage/expertsContent';
import { societies } from '../SocietiesPage/societiesContent';
import { stories } from '../StoriesPage/storiesContent';
import { researchPapers } from '../ResearchPage/researchContent';

export const homePageContent: HomePageProps = {
  languages,
  nav,
  social,
  popular: [
    { label: 'Physical sciences', count: 12 },
    { label: 'Social sciences', count: 5 },
    { label: 'Technology', count: 8 },
    { label: 'Arts & humanities', count: 1 },
    { label: 'Life sciences & biomedicine', count: 22 },
  ],
  /**
   * One entry point per section, each counted the same way: how many records
   * that section holds. The societies sit next to the experts, as the second
   * way into the same community.
   */
  heroLinks: [
    { label: 'To all scientists', href: ROUTES.experts, count: experts.length },
    { label: 'Scientific societies', href: ROUTES.societies, count: societies.length },
    { label: 'Read stories', href: ROUTES.stories, count: stories.length },
    { label: 'Browse research', href: ROUTES.research, count: researchPapers.length },
  ],
  // Drawn from the archive on `/stories`, and redrawn on every visit.
  stories: pickFeaturedStories(3),
  research: [
    {
      title: 'Impact of the War on Different Categories of Ukrainian Scholars',
      text: 'Olena Kozak, Lidia Kuzemska, Yevheniia Polishchuk, Kateryna Chuyeva',
      href: '/research/impact-of-the-war-on-different-categories-of-ukrainian-scholars',
    },
    {
      title: 'Scientific diaspora — a unique asset for post-war recovery of Ukraine',
      text: 'Oleksandr Skorokhod',
      href: '/research/scientific-diaspora-a-unique-asset-for-post-war-recovery-of-ukraine',
    },
  ],
  // The first entries from `/infrastructures`, so the two never disagree.
  reconstruction: pickReconstruction(2),
  supporters,
};
