import type { Meta, StoryObj } from '@storybook/react-vite';
import { HeaderBarV4 } from './HeaderBarV4';

const meta = {
  title: 'Sandbox/HeaderBar V4',
  component: HeaderBarV4,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Fork of the shared Header with a Search control beside the hamburger. The control is the word "Search" — the icon set has no magnifier, and a word suits a site built out of type.',
      },
    },
  },
} satisfies Meta<typeof HeaderBarV4>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Dark: Story = {
  args: { tone: 'dark' },
  parameters: { backgrounds: { default: 'dark' } },
};

/** While searching, the slot takes the whole bar — the height never changes. */
export const SearchExpanded: Story = {
  args: {
    searchExpanded: true,
    searchSlot: <div className="w-full font-mono text-breadcrumbs">search slot goes here</div>,
  },
};
