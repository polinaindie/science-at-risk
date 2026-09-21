import type { Meta, StoryObj } from '@storybook/react-vite';
import { MobileNav, navItemsEn } from './MobileNav';

const meta = {
  title: 'Components/MobileNav',
  component: MobileNav,
  tags: ['autodocs'],
  parameters: {
    backgrounds: { default: 'dark' },
  },
} satisfies Meta<typeof MobileNav>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { open: true },
  parameters: { backgrounds: { default: 'brand' } },
};

/** Over a dark page the panel inverts, otherwise it reads as bare text. */
export const OnDarkPage: Story = {
  args: { open: true, tone: 'dark' },
  parameters: { backgrounds: { default: 'dark' } },
};

export const EnglishLabels: Story = {
  args: { open: true, items: navItemsEn },
  parameters: { backgrounds: { default: 'brand' } },
};
