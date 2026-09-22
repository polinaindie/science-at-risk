import type { Meta, StoryObj } from '@storybook/react-vite';
import { ExpertPage } from './ExpertPage';
import { withRouter } from '../pageDecorator';

const meta = {
  title: 'Pages/ExpertPage',
  component: ExpertPage,
  parameters: { layout: 'fullscreen', route: '/experts/komarov-ihor-volodymyrovych' },
  decorators: [withRouter],
} satisfies Meta<typeof ExpertPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
