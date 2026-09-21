import type { Meta, StoryObj } from '@storybook/react-vite';
import { InfoSection, ResearchSection } from './InfoSection';

const meta = {
  title: 'Components/InfoSection',
  component: InfoSection,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof InfoSection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithResearch: Story = {
  args: {},
  render: () => (
    <ResearchSection
      info={{
        title: 'Research & policy',
        text: 'Formalized wartime expertise you can cite, share, and build on.',
        linkLabel: 'Show all studies',
        linkHref: '/research',
      }}
      papers={[
        {
          title:
            'Support Mechanisms for Researchers at Risk: Historical Development, Survey Evidence, and Policy Lessons from Wartime Ukraine',
          topic: 'Researcher mobility & protection',
          usefulFor: 'Funders and university risk offices',
          citedBy: 'Cited in EU researcher-at-risk policy briefs',
          href: '/research/support-mechanisms',
          fileType: '.pdf',
        },
        {
          title:
            'Strategic priority-setting in research in times of crisis: how to optimise decision-making for societal resilience',
          topic: 'Research policy',
          usefulFor: 'Science ministries reallocating R&D budgets under crisis',
          downloads: 'Open PDF · policy toolkit',
          href: '/research/strategic-priority-setting',
          fileType: '.pdf',
        },
        {
          title:
            'Systematization of practices and recommendations of Ukrainian institutions with damaged and destroyed research infrastructure',
          topic: 'Infrastructure recovery',
          usefulFor: 'Labs planning reconstruction; donors matching equipment to plans',
          href: '/research/infrastructure-practices',
          fileType: '.pdf',
        },
      ]}
    />
  ),
};
