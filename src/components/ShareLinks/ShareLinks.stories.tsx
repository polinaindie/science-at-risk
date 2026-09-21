import type { Meta, StoryObj } from '@storybook/react-vite';
import { ShareLinks } from './ShareLinks';

const meta = {
  title: 'Components/ShareLinks',
  component: ShareLinks,
  tags: ['autodocs'],
} satisfies Meta<typeof ShareLinks>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
