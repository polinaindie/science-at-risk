import type { Meta, StoryObj } from '@storybook/react-vite';
import { HomePageV4 } from './HomePageV4';

const meta = {
  title: 'Sandbox/HomePage V4',
  component: HomePageV4,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Search in the header, hero given entirely to the stories, then the footer. Research and damaged infrastructure live behind their links rather than as sections of the homepage.',
      },
    },
  },
} satisfies Meta<typeof HomePageV4>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
