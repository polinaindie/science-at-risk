import type { Meta, StoryObj } from '@storybook/react-vite';
import { Typography } from './Typography';

const meta = {
  title: 'Foundations/Typography',
  component: Typography,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Typography scale from Figma node 292:1454 (SAtR UI concept). Desktop and mobile sizes for H1–H3, Text 1–2, and Breadcrumbs.',
      },
    },
  },
  argTypes: {
    sampleText: {
      control: 'text',
      description: 'Override sample labels (defaults to style name: H1, H2, …)',
    },
  },
} satisfies Meta<typeof Typography>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    sampleText: '',
    columns: 'both',
  },
};

export const Desktop: Story = {
  args: {
    columns: ['desktop'],
  },
  globals: {
    viewport: { value: 'desktop', isRotated: false },
  },
};

export const Mobile: Story = {
  args: {
    columns: ['mobile'],
  },
  globals: {
    viewport: { value: 'mobile', isRotated: false },
  },
};

export const CustomSample: Story = {
  args: {
    sampleText: 'Science at risk',
    columns: 'both',
  },
};
