import type { Meta, StoryObj } from '@storybook/react-vite';
import { HomeHeroSearch } from './HomeHeroSearch';

const meta = {
  title: 'Sandbox/HomeHeroSearch',
  component: HomeHeroSearch,
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
} satisfies Meta<typeof HomeHeroSearch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
