import type { Meta, StoryObj } from '@storybook/react-vite';
import { InfrastructuresPage } from './InfrastructuresPage';
import { withRouter } from '../pageDecorator';

const meta = {
  title: 'Pages/InfrastructuresPage',
  component: InfrastructuresPage,
  parameters: { layout: 'fullscreen' },
  decorators: [withRouter],
} satisfies Meta<typeof InfrastructuresPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
