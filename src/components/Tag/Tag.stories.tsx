import type { Meta, StoryObj } from '@storybook/react-vite';
import { Tag } from './Tag';

const meta = {
  title: 'Components/Tag',
  component: Tag,
  tags: ['autodocs'],
} satisfies Meta<typeof Tag>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { children: 'Chemistry' },
};

export const WithCount: Story = {
  args: { children: 'Teaching', count: 101 },
};

export const Accent: Story = {
  args: { children: 'Biochemistry', variant: 'accent' },
};

export const Label: Story = {
  args: { as: 'span', appearance: 'label', children: 'Practice' },
};

export const WithCircle: Story = {
  args: { children: 'Natural sciences', circle: true },
};

export const AsLink: Story = {
  args: {
    as: 'a',
    href: '/experts?tag=teaching',
    children: 'Teaching',
    count: 101,
  },
};

export const PopularRequests: Story = {
  args: { children: 'Teaching', count: 101 },
  render: () => (
    <div className="bg-brand-accent-blue p-8">
      <p className="mb-4 font-mono text-text1-desktop">Popular requests</p>
      <div className="flex flex-wrap gap-2.5">
        <Tag as="a" href="/experts?tag=teaching" count={101}>
          Teaching
        </Tag>
        <Tag as="a" href="/experts?tag=science-popularization" count={86}>
          Science popularization
        </Tag>
        <Tag as="a" href="/experts?tag=biology" count={57}>
          Biology
        </Tag>
        <Tag as="a" href="/experts?tag=natural-sciences" count={55}>
          Natural sciences
        </Tag>
        <Tag as="a" href="/experts?tag=biochemistry" count={41}>
          Biochemistry
        </Tag>
      </div>
    </div>
  ),
};
