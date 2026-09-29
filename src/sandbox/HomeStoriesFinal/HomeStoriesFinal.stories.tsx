import type { Meta, StoryObj } from '@storybook/react-vite';
import { HomeStoriesFinal } from './HomeStoriesFinal';

const meta = {
  title: 'Sandbox/HomeStoriesFinal',
  component: HomeStoriesFinal,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Homepage stories block — Figma frame "Stories-final" (node 94:10608). Three stories across; Back / Forward page through them in threes and wrap.',
      },
    },
  },
} satisfies Meta<typeof HomeStoriesFinal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
