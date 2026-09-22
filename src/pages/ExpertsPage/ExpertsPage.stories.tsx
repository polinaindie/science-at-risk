import type { Meta, StoryObj } from '@storybook/react-vite';
import { ExpertsPage } from './ExpertsPage';
import { withRouter } from '../pageDecorator';

const meta = {
  title: 'Pages/ExpertsPage',
  component: ExpertsPage,
  parameters: { layout: 'fullscreen' },
  decorators: [withRouter],
} satisfies Meta<typeof ExpertsPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
