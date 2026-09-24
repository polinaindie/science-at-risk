import type { Meta, StoryObj } from '@storybook/react-vite';
import { HomeHeroStoriesIndexV4 } from './HomeHeroStoriesIndexV4';

const meta = {
  title: 'Sandbox/HomeHeroStoriesIndex V4',
  component: HomeHeroStoriesIndexV4,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'The hero as an index of stories: numbered titles on the left, one preview photograph on the right belonging to whichever row is lit. Hover and keyboard focus both move it. No timer — this one is read at the reader’s pace. On touch the preview column is dropped and each row carries its own thumbnail.',
      },
    },
  },
} satisfies Meta<typeof HomeHeroStoriesIndexV4>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** Third row active — what focus or hover lands on mid-list. */
export const ThirdActive: Story = {
  args: { defaultActive: 2 },
};

export const Mobile: Story = {
  parameters: { viewport: { defaultViewport: 'mobile' } },
};
