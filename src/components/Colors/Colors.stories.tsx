import type { Meta, StoryObj } from '@storybook/react-vite';
import { Colors } from './Colors';

const meta = {
  title: 'Foundations/Colors',
  component: Colors,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Brand color palette from Figma node 292:1481 — white, black, and two accent colors with Ukrainian usage notes.',
      },
    },
  },
} satisfies Meta<typeof Colors>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
