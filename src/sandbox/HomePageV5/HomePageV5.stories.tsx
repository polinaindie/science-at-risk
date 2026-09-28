import type { Meta, StoryObj } from '@storybook/react-vite';
import { HomePageV5 } from './HomePageV5';

const meta = {
  title: 'Sandbox/HomePage V5',
  component: HomePageV5,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'One header in two states, over a deck of four screens. At rest the wordmark stands in the content with a full-width search line under it; leaving the first screen flies the wordmark into the sticky bar at 20px and folds the search line in with it. The first screen keeps the hero and the stories together: the sets are paged in place, so the search line never leaves while the stories change under it. Wider than 1024 and taller than 750 the screens are stacked and a gesture moves one at a time; below either the page is an ordinary scrolling document.',
      },
    },
  },
} satisfies Meta<typeof HomePageV5>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
