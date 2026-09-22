import type { Meta, StoryObj } from '@storybook/react-vite';
import { ContactsPage } from './ContactsPage';
import { withRouter } from '../pageDecorator';

const meta = {
  title: 'Pages/ContactsPage',
  component: ContactsPage,
  parameters: { layout: 'fullscreen' },
  decorators: [withRouter],
} satisfies Meta<typeof ContactsPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
