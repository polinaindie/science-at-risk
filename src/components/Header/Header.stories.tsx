import type { Meta, StoryObj } from '@storybook/react-vite';
import { Header } from './Header';

const meta = {
  title: 'Components/Header',
  component: Header,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
} satisfies Meta<typeof Header>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Homepage at top — compact mark while hero wordmark is on screen. */
export const Mark: Story = {
  args: { tone: 'light', locale: 'EN', brandMode: 'mark', menuExpanded: false },
};

/** After scroll or on inner pages — hero wordmark scaled into the header. */
export const Wordmark: Story = {
  args: { tone: 'light', locale: 'EN', brandMode: 'wordmark', menuExpanded: false },
};

export const Dark: Story = {
  args: { tone: 'dark', locale: 'EN' },
  decorators: [
    (Story) => (
      <div className="bg-brand-black p-8">
        <Story />
      </div>
    ),
  ],
};

export const Ukrainian: Story = {
  args: { tone: 'light', locale: 'UA', menuExpanded: false },
};

export const MenuOpen: Story = {
  args: { tone: 'light', locale: 'EN', menuExpanded: true, menuControls: 'nav-panel' },
};
