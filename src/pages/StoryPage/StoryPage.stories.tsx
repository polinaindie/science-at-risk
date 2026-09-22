import type { Meta, StoryObj } from '@storybook/react-vite';
import { StoryPage } from './StoryPage';
import { withRouter } from '../pageDecorator';

const meta = {
  title: 'Pages/StoryPage',
  component: StoryPage,
  parameters: {
    layout: 'fullscreen',
    route: '/stories/lost-worlds-how-the-russian-strike-ruined-the-chornobyl-museum-in-kyiv',
  },
  decorators: [withRouter],
} satisfies Meta<typeof StoryPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
