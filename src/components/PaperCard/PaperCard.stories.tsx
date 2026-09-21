import type { Meta, StoryObj } from '@storybook/react-vite';
import { PaperCard } from './PaperCard';

const meta = {
  title: 'Components/PaperCard',
  component: PaperCard,
  tags: ['autodocs'],
} satisfies Meta<typeof PaperCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title:
      'Support Mechanisms for Researchers at Risk: Historical Development, Survey Evidence, and Policy Lessons from Wartime Ukraine',
    topic: 'Researcher mobility & protection',
    usefulFor: 'Funders, university risk offices, and ministries designing scholar-at-risk schemes',
    citedBy: 'Cited in EU researcher-at-risk policy briefs',
    fileType: '.pdf',
    downloadHref: '#',
    borderedTop: true,
  },
};

export const WithDownloads: Story = {
  args: {
    title:
      'Strategic priority-setting in research in times of crisis: how to optimise decision-making for societal resilience',
    topic: 'Research policy',
    usefulFor: 'Science ministries and agencies reallocating R&D budgets under crisis',
    downloads: 'Open PDF · policy toolkit',
    fileType: '.pdf',
    borderedTop: true,
  },
};
