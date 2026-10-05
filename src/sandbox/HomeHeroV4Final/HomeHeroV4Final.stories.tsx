import type { Meta, StoryObj } from '@storybook/react-vite';
import { HomeHeroV4Final } from './HomeHeroV4Final';

const meta = {
  title: 'Sandbox/HomeHero V4 Final',
  component: HomeHeroV4Final,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof HomeHeroV4Final>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Ukrainian: Story = { args: { locale: 'uk', localeHref: '/' } };

export const Mobile: Story = {
  parameters: { viewport: { defaultViewport: 'mobile' } },
  globals: { viewport: { value: 'mobile', isRotated: false } },
};
