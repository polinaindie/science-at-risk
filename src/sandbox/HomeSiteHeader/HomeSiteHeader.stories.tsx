import type { Meta, StoryObj } from '@storybook/react-vite';
import { HomeSiteHeader } from './HomeSiteHeader';

const meta = {
  title: 'Sandbox/HomeSiteHeader',
  component: HomeSiteHeader,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Home page bar (Figma node 230:5498). On the hero it holds the sections and the language switch; `logo` brings the wordmark in and moves the sections to the middle.',
      },
    },
  },
  argTypes: {
    logo: { control: { type: 'range', min: 0, max: 1, step: 0.01 } },
  },
} satisfies Meta<typeof HomeSiteHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const OnHero: Story = { args: { logo: 0 } };
export const WithWordmark: Story = { args: { logo: 1 } };
export const OnDark: Story = { args: { logo: 1, inverted: true, ground: 'bg-brand-black' } };
