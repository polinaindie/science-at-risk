import type { Meta, StoryObj } from '@storybook/react-vite';
import { Tag } from './Tag';

const meta = {
  title: 'Atoms/Tag',
  component: Tag,
  args: { label: 'Biochemistry' },
} satisfies Meta<typeof Tag>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithCount: Story = { args: { label: 'Teaching', count: 101 } };

export const AsLink: Story = { args: { label: 'Biology', count: 57, href: '#' } };

export const List: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
      {[
        ['Teaching', 101],
        ['Science popularization', 86],
        ['Biology', 57],
        ['Natural sciences', 55],
        ['Biochemistry', 41],
      ].map(([label, count]) => (
        <Tag key={label as string} label={label as string} count={count as number} />
      ))}
    </div>
  ),
};
