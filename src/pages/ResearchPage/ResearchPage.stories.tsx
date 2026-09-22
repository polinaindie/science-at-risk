import type { Meta, StoryObj } from '@storybook/react-vite';
import { ResearchPage } from './ResearchPage';
import { withRouter } from '../pageDecorator';

const meta = {
  title: 'Pages/ResearchPage',
  component: ResearchPage,
  parameters: { layout: 'fullscreen' },
  decorators: [withRouter],
} satisfies Meta<typeof ResearchPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
