import type { Meta, StoryObj } from '@storybook/react-vite';
import { SocietyPage } from './SocietyPage';
import { withRouter } from '../pageDecorator';

const meta = {
  title: 'Pages/SocietyPage',
  component: SocietyPage,
  parameters: { layout: 'fullscreen', route: '/societies/ukrainska-merezha-vidtvoriuvanosti' },
  decorators: [withRouter],
} satisfies Meta<typeof SocietyPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
