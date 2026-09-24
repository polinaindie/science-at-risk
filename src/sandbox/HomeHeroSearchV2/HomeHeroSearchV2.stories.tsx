import type { Meta, StoryObj } from '@storybook/react-vite';
import { HomeHeroSearchV2 } from './HomeHeroSearchV2';

const meta = {
  title: 'Sandbox/HomeHeroSearch V2',
  component: HomeHeroSearchV2,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Homepage hero variant — inline search and site-wide stat links (Stories / Societies / Researches / Infrastructure) instead of the story carousel.',
      },
    },
  },
} satisfies Meta<typeof HomeHeroSearchV2>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
