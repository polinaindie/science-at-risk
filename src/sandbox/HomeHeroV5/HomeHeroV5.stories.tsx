import type { Meta, StoryObj } from '@storybook/react-vite';
import { HomeHeroV5 } from './HomeHeroV5';

const meta = {
  title: 'Sandbox/HomeHero V5',
  component: HomeHeroV5,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof HomeHeroV5>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
