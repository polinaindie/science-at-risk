import type { Meta, StoryObj } from '@storybook/react-vite';
import { KeywordList } from './KeywordList';

const meta = {
  title: 'Components/KeywordList',
  component: KeywordList,
  tags: ['autodocs'],
} satisfies Meta<typeof KeywordList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ExpertKeywords: Story = {
  args: {
    title: 'Ключові слова:',
    keywords: [
      { label: 'Математика', href: '/uk/experts?tag=mathematics', value: 'mathematics' },
      {
        label: 'Природничі науки',
        href: '/uk/experts?tag=natural-sciences',
        value: 'natural-sciences',
      },
      {
        label: 'Трансфер інновацій',
        href: '/uk/experts?tag=innovation-transfer',
        value: 'innovation-transfer',
      },
    ],
  },
};
