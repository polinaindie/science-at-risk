import type { Meta, StoryObj } from '@storybook/react-vite';
import { Quote } from './Quote';

const meta = {
  title: 'Molecules/Quote',
  component: Quote,
  args: {
    name: 'Serhii Plokhii',
    text:
      'The Ukrainian scientists on the portraits painted by the official artist of the Nobel Prize Committee will never receive a Nobel Prize.',
    position: 'Director of the Ukrainian Research Institute at Harvard',
  },
  decorators: [
    (Story) => (
      <div className="wrapper" style={{ padding: 32 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Quote>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithoutPosition: Story = { args: { position: undefined } };
