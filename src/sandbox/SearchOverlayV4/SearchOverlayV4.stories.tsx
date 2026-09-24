import type { Meta, StoryObj } from '@storybook/react-vite';
import { SearchOverlayV4 } from './SearchOverlayV4';

const meta = {
  title: 'Sandbox/SearchOverlay V4',
  component: SearchOverlayV4,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Site-wide expert search. Free text submits to `/experts?search=` — the same GET form the live site uses, so it works without JavaScript. Suggestions come from a sandbox mock; the live site has no search API. A combobox, not a dialog: focus stays in the field and the active option is named by aria-activedescendant.',
      },
    },
  },
} satisfies Meta<typeof SearchOverlayV4>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Open: Story = {
  args: { open: true },
};

/** The Loader state, which a static prototype would otherwise never show. */
export const Loading: Story = {
  args: { open: true, searchDelayMs: 1200 },
};

export const Ukrainian: Story = {
  args: { open: true, locale: 'UA' },
};
