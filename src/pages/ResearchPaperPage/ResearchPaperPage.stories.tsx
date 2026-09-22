import type { Meta, StoryObj } from '@storybook/react-vite';
import { ResearchPaperPage } from './ResearchPaperPage';
import { withRouter } from '../pageDecorator';

const meta = {
  title: 'Pages/ResearchPaperPage',
  component: ResearchPaperPage,
  parameters: {
    layout: 'fullscreen',
    route: '/research/scientific-diaspora-a-unique-asset-for-post-war-recovery-of-ukraine',
  },
  decorators: [withRouter],
} satisfies Meta<typeof ResearchPaperPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
