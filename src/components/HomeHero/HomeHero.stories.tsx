import type { Meta, StoryObj } from '@storybook/react-vite';
import { SiteHeader } from '@/components/SiteHeader';
import { HomeHero } from './HomeHero';

const meta = {
  title: 'Components/HomeHero',
  component: HomeHero,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof HomeHero>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <div className="bg-brand-white">
      <SiteHeader progress={1} locale="EN" />
      <HomeHero {...args} />
    </div>
  ),
};

export const Ukrainian: Story = {
  args: {
    text: 'Допомога українським вченим, які постраждали від війни',
    links: [
      {
        label: 'Допомога у відбудові наукової інфраструктури',
        href: '/uk/infrastructures',
      },
      {
        label: 'Пошук та залучення вчених до проєктів',
        href: '/uk/scientists',
      },
      { label: 'White Papers', href: '/uk/whitepapers' },
    ],
  },
  render: (args) => (
    <div className="bg-brand-white">
      <SiteHeader progress={1} locale="UA" />
      <HomeHero {...args} />
    </div>
  ),
};
