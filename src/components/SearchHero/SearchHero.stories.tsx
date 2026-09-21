import type { Meta, StoryObj } from '@storybook/react-vite';
import { SearchHero } from './SearchHero';

const meta = {
  title: 'Sections/SearchHero',
  component: SearchHero,
  parameters: { layout: 'fullscreen' },
  args: {
    title: 'Find Ukrainian scientists for collaboration',
    fieldLabel: 'Scientific field or name',
    submitLabel: 'Find a scientist',
    note: 'Mark the scientific field that interests you — find and involve Ukrainian scientists in your own projects',
    noteLink: { label: 'To the full database of scientists', href: '#' },
    popular: [
      { label: 'Teaching', count: 101 },
      { label: 'Science popularization', count: 86 },
      { label: 'Biology', count: 57 },
      { label: 'Natural sciences', count: 55 },
      { label: 'Biochemistry', count: 41 },
    ],
  },
} satisfies Meta<typeof SearchHero>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithoutPopular: Story = { args: { popular: [] } };
