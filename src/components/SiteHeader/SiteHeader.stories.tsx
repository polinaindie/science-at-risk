import type { Meta, StoryObj } from '@storybook/react-vite';
import { SiteHeader } from './SiteHeader';

const meta = {
  title: 'Components/SiteHeader',
  component: SiteHeader,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
  args: { progress: 1 },
} satisfies Meta<typeof SiteHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The one menu: the same bar on every page, English or Ukrainian. */
export const English: Story = { args: { locale: 'EN' } };

export const Ukrainian: Story = { args: { locale: 'UA' } };

/** Signed in: My cabinet and Log out take the place of Log in (see #14). */
export const SignedInEnglish: Story = { args: { locale: 'EN', account: 'member' } };

export const SignedInUkrainian: Story = { args: { locale: 'UA', account: 'member' } };

/** On a dark block the bar takes white ink. */
export const OnDark: Story = {
  args: { ground: 'bg-brand-black', inverted: true },
  decorators: [(Story) => <div className="bg-brand-black"><Story /></div>],
};
