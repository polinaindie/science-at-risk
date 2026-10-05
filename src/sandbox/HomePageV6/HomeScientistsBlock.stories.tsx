import type { Meta, StoryObj } from '@storybook/react-vite';
import { HomeScientistsBlock } from './HomeScientistsBlock';

const meta = {
  title: 'Sandbox/HomePage V6/Scientists block',
  component: HomeScientistsBlock,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
  decorators: [
    (Story) => (
      <div className="bg-brand-accent-blue">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof HomeScientistsBlock>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Scientists: Story = {};

export const Societies: Story = { args: { defaultScope: 'societies' } };

export const Mobile: Story = {
  parameters: { viewport: { defaultViewport: 'mobile' } },
  globals: { viewport: { value: 'mobile', isRotated: false } },
};
