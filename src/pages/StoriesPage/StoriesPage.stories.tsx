import type { Meta, StoryObj } from '@storybook/react-vite';
import { StoriesPage } from './StoriesPage';
import { withRouter } from '../pageDecorator';

const meta = {
  title: 'Pages/StoriesPage',
  component: StoriesPage,
  parameters: { layout: 'fullscreen' },
  decorators: [withRouter],
} satisfies Meta<typeof StoriesPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
