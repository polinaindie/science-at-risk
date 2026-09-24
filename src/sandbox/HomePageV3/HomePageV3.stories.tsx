import type { Meta, StoryObj } from '@storybook/react-vite';
import { HomePageV3 } from './HomePageV3';

const meta = {
  title: 'Sandbox/HomePage V3',
  component: HomePageV3,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Monoblock homepage: one screen that routes to every section of the site. Section counts are static figures from the site mirror — see Sandbox/HomeMonoblock V3 → Descriptors for the variant that needs no upkeep.',
      },
    },
  },
} satisfies Meta<typeof HomePageV3>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
