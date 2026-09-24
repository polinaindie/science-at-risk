import type { Meta, StoryObj } from '@storybook/react-vite';
import { SiteHeaderV5 } from './SiteHeaderV5';

const meta = {
  title: 'Sandbox/SiteHeader V5',
  component: SiteHeaderV5,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'The two states of the V5 header, driven by the `progress` prop (0 to 1). On the page a sentinel at the end of the hero flips it; here you can look at each state on its own.',
      },
    },
  },
} satisfies Meta<typeof SiteHeaderV5>;

export default meta;
type Story = StoryObj<typeof meta>;

/** At the top of the page: navigation only — wordmark and search live in the hero. */
export const Expanded: Story = {};

/** Mid-scroll: the wordmark and the search are half way into the bar. */
export const Morphing: Story = {
  args: { progress: 0.5 },
};

/** Scrolled: wordmark folded in at 22px, search at 300px, bar inverted. */
export const Compact: Story = {
  args: { progress: 1 },
};
