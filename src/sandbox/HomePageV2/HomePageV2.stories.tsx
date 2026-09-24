import type { Meta, StoryObj } from '@storybook/react-vite';
import { HomePageV2 } from './HomePageV2';

const meta = {
  title: 'Sandbox/HomePage V2',
  component: HomePageV2,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Experimental V2 copy of the homepage — free to diverge from Sandbox/HomePage. Hero (HomeHeroSearch V2, quick links ordered Stories / Experts / Research), then Stories, Research, Damaged Infrastructure, and the contact/partners footer.',
      },
    },
  },
} satisfies Meta<typeof HomePageV2>;

export default meta;
type Story = StoryObj<typeof meta>;

/** V2: hero leads with Stories, then the Stories section, Research, Damaged Infrastructure, Footer. */
export const Default: Story = {};
