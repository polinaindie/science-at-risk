import type { Meta, StoryObj } from '@storybook/react-vite';
import { AboutPage } from './AboutPage';
import { withRouter } from '../pageDecorator';

const meta = {
  title: 'Pages/AboutPage',
  component: AboutPage,
  parameters: { layout: 'fullscreen' },
  decorators: [withRouter],
} satisfies Meta<typeof AboutPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
