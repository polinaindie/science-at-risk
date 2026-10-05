import type { Meta, StoryObj } from '@storybook/react-vite';
import { HomeHeroFilmstrip } from './HomeHeroFilmstrip';

const meta = {
  title: 'Sandbox/HomeHero Filmstrip (G2)',
  component: HomeHeroFilmstrip,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof HomeHeroFilmstrip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Ukrainian: Story = { args: { locale: 'uk' } };

export const Mobile: Story = {
  parameters: { viewport: { defaultViewport: 'mobile' } },
  globals: { viewport: { value: 'mobile', isRotated: false } },
};
