import type { Meta, StoryObj } from '@storybook/react-vite';
import { HomePage } from './HomePage';

const meta = {
  title: 'Sandbox/HomePage',
  component: HomePage,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Full homepage — Figma node 21:4755. Hero (search variant), then Stories, Researches, Damaged Infrastructure, and the contact/partners footer, in that order.',
      },
    },
  },
} satisfies Meta<typeof HomePage>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Current homepage: hero+search combined (HomeHeroSearch), then Stories, White Papers, Damaged Infrastructure, Footer. */
export const Default: Story = {
  args: { heroVariant: 'search' },
};

/** Older variant — story-carousel hero, then a separate Search section, White Papers, Footer. */
export const CarouselHero: Story = {
  args: { heroVariant: 'carousel' },
};
