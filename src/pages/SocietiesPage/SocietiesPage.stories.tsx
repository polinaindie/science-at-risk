import type { Meta, StoryObj } from '@storybook/react-vite';
import { SocietiesPage } from './SocietiesPage';
import { withRouter } from '../pageDecorator';

const meta = {
  title: 'Pages/SocietiesPage',
  component: SocietiesPage,
  parameters: { layout: 'fullscreen' },
  decorators: [withRouter],
} satisfies Meta<typeof SocietiesPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
