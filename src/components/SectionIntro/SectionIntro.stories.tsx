import type { Meta, StoryObj } from '@storybook/react-vite';
import { SectionIntro } from './SectionIntro';

const meta = {
  title: 'Molecules/SectionIntro',
  component: SectionIntro,
  args: {
    title: 'Assistance in reconstruction',
    text: 'Scientific infrastructure damaged during the war',
    link: { label: 'All projects', href: '#' },
  },
  decorators: [
    (Story) => (
      <div className="wrapper" style={{ padding: 32 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof SectionIntro>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const AsPageTitle: Story = { args: { as: 'h1' } };

export const TitleOnly: Story = { args: { text: undefined, link: undefined } };
