import type { Meta, StoryObj } from '@storybook/react-vite';
import { HomePage } from './HomePage';
import { homePageContent } from './homePageContent';

const meta = {
  title: 'Pages/HomePage',
  component: HomePage,
  parameters: { layout: 'fullscreen' },
  args: homePageContent,
} satisfies Meta<typeof HomePage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** Just the first screen, as the page loads. */
export const HeroOnly: Story = {
  args: { stories: [], reconstruction: [] },
};
