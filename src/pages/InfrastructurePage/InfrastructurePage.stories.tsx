import type { Meta, StoryObj } from '@storybook/react-vite';
import { InfrastructurePage } from './InfrastructurePage';
import { withRouter } from '../pageDecorator';

const meta = {
  title: 'Pages/InfrastructurePage',
  component: InfrastructurePage,
  parameters: {
    layout: 'fullscreen',
    route: '/infrastructures/berdianskyi-derzhavnyi-pedahohichnyi-universytet',
  },
  decorators: [withRouter],
} satisfies Meta<typeof InfrastructurePage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
