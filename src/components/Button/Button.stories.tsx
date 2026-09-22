import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from './Button';

const meta = {
  title: 'Atoms/Button',
  component: Button,
  argTypes: {
    variant: { control: 'inline-radio', options: ['black', 'white', 'bordered'] },
  },
  args: { children: 'More details', variant: 'black' },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Black: Story = {};

export const Bordered: Story = { args: { variant: 'bordered' } };

export const White: Story = {
  args: { variant: 'white', children: 'Send' },
  // `btn--white` is only used on the dark footer and inside the modal.
  decorators: [
    (Story) => (
      <div style={{ background: '#000', padding: 40 }}>
        <Story />
      </div>
    ),
  ],
};

export const AsLink: Story = {
  args: { href: '#', children: 'Read' },
};

/**
 * Some of the site's blocks style `.btn a` as a full-size overlay — the stories
 * slider does. There the label has to sit outside the anchor, or it would be
 * lifted out of flow with it.
 */
export const OverlayLink: Story = {
  args: { href: '#', overlayLink: true, variant: 'white', children: 'Read' },
  decorators: [
    (Story) => (
      <div style={{ background: '#000', padding: 40 }}>
        <Story />
      </div>
    ),
  ],
};

export const Disabled: Story = {
  args: { disabled: true },
};

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
      <Button variant="black">Black</Button>
      <Button variant="bordered">Bordered</Button>
      <Button variant="black" disabled>
        Disabled
      </Button>
    </div>
  ),
};
