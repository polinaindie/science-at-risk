import type { Meta, StoryObj } from '@storybook/react-vite';
import { SearchHero } from './SearchHero';

const meta = {
  title: 'Components/SearchHero',
  component: SearchHero,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof SearchHero>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Experts: Story = {
  args: {
    title: 'Find a collaborator',
    breadcrumbs: [
      { label: 'Main', href: '/' },
      { label: 'Experts' },
    ],
    placeholder: 'Field, method, or researcher name',
    buttonLabel: 'Search experts',
    exampleLabel: 'Try a query like',
    exampleQuery: 'soil contamination data exchange for a joint Horizon Europe proposal',
    popularTags: [
      { label: 'Teaching', count: 101, value: 'teaching', href: '/experts?tag=teaching' },
      {
        label: 'Science popularization',
        count: 86,
        value: 'science-popularization',
        href: '/experts?tag=science-popularization',
      },
      { label: 'Biology', count: 57, value: 'biology', href: '/experts?tag=biology' },
      {
        label: 'Natural sciences',
        count: 55,
        value: 'natural-sciences',
        href: '/experts?tag=natural-sciences',
      },
      {
        label: 'Biochemistry',
        count: 41,
        value: 'biochemistry',
        href: '/experts?tag=biochemistry',
      },
    ],
  },
};

export const WithSelectedTag: Story = {
  args: {
    ...Experts.args,
    selectedTag: 'biology',
    defaultQuery: '',
  },
};

/** Homepage block: explainer column on the left, popular requests on the right. */
export const WithNote: Story = {
  args: {
    ...Experts.args,
    breadcrumbs: undefined,
    headingLevel: 2,
    note: 'This is a collaboration database — match methods, labs, and joint-grant partners, not a list of people to rescue.',
    noteLinkLabel: 'Open the full expert base',
    noteHref: '/experts',
  },
};
