import type { Meta, StoryObj } from '@storybook/react-vite';
import { Pagination } from './Pagination';

const meta = {
  title: 'Molecules/Pagination',
  component: Pagination,
  args: { current: 1, total: 7 },
  decorators: [
    (Story) => (
      <div className="wrapper" style={{ padding: 24 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Pagination>;

export default meta;
type Story = StoryObj<typeof meta>;

export const FirstPage: Story = {};

export const MiddlePage: Story = { args: { current: 4 } };

export const LastPage: Story = { args: { current: 7 } };
