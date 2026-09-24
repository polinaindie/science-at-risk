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
          'One header in two states: at rest the wordmark is 141px in the content with a full-width search line; scrolled, both fold into the sticky bar (wordmark 22px, search 300px). All five sections and their counts stay on screen the whole way down — there is no burger. Scroll the preview to see the change.',
      },
    },
  },
} satisfies Meta<typeof HomePageV5>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
