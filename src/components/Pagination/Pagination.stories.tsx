import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Pagination } from './Pagination';

const meta = {
  title: 'Components/Pagination',
  component: Pagination,
  tags: ['autodocs'],
} satisfies Meta<typeof Pagination>;

export default meta;
type Story = StoryObj<typeof meta>;

export const FewPages: Story = {
  args: { currentPage: 1, totalPages: 3 },
};

export const Start: Story = {
  args: { currentPage: 1, totalPages: 10 },
};

export const Middle: Story = {
  args: { currentPage: 7, totalPages: 10 },
};

export const End: Story = {
  args: { currentPage: 10, totalPages: 10 },
};

export const Interactive: Story = {
  args: { currentPage: 1, totalPages: 11 },
  render: function InteractivePagination(args) {
    const [page, setPage] = useState(args.currentPage);
    return (
      <Pagination
        {...args}
        currentPage={page}
        onPageChange={setPage}
      />
    );
  },
};
