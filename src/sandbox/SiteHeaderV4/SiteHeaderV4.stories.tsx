import type { Meta, StoryObj } from '@storybook/react-vite';
import { SiteHeaderV4 } from './SiteHeaderV4';

const meta = {
  title: 'Sandbox/SiteHeader V4',
  component: SiteHeaderV4,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Fixed chrome carrying both the menu and the expert search. The two are mutually exclusive — opening one closes the other, so they never fight over Escape or the backdrop. `/` and Cmd/Ctrl-K open the search unless the reader is typing elsewhere.',
      },
    },
  },
} satisfies Meta<typeof SiteHeaderV4>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Dark: Story = {
  args: { tone: 'dark' },
};
