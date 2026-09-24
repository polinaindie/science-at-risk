import type { Meta, StoryObj } from '@storybook/react-vite';
import { HomeMonoblockV3 } from './HomeMonoblockV3';
import { countSections, descriptorSections, utilityLinks, socialLinks, ukSections, ukUtilityLinks } from '@/sandbox/HomePageV3/sections';

const meta = {
  title: 'Sandbox/HomeMonoblock V3',
  component: HomeMonoblockV3,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'The homepage as one screen — an index of the site rather than a page of content. Typographic by design: the hover preview belongs to the V4 experiment. Section counts are static figures taken from the site mirror on a single date; wire them to real data or switch to the descriptor variant before shipping.',
      },
    },
  },
} satisfies Meta<typeof HomeMonoblockV3>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Counts in the meta column — the numbers are static and will go stale. */
export const Default: Story = {
  args: { sections: countSections, utilityLinks, socialLinks },
};

/** Descriptors instead of counts — nothing to keep up to date. */
export const Descriptors: Story = {
  args: { sections: descriptorSections, utilityLinks, socialLinks },
};

export const Ukrainian: Story = {
  args: {
    sections: ukSections,
    utilityLinks: ukUtilityLinks,
    socialLinks,
    locale: 'UA',
    localeHref: '/',
    tagline: 'Дослідження та експертиза з наукового фронту України',
    placeholder: 'Наукова галузь або імʼя',
    buttonLabel: 'Знайти науковця',
  },
};

/** Below `md` the monoblock honestly becomes a short page instead of faking one screen. */
export const Mobile: Story = {
  args: { sections: countSections, utilityLinks, socialLinks },
  parameters: { viewport: { defaultViewport: 'mobile' } },
};
