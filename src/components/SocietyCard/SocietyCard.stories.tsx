import type { Meta, StoryObj } from '@storybook/react-vite';
import { SocietyCard } from './SocietyCard';

const meta = {
  title: 'Cards/SocietyCard',
  component: SocietyCard,
  args: {
    title: 'International Union of Innovators and Researchers',
    text:
      'The organisation carries out educational, scientific, cultural, and outreach activities aimed at supporting and developing education and research at the local, regional, and international levels.',
    domain: 'Natural sciences',
    href: '#',
  },
  decorators: [
    (Story) => (
      <div className="wrapper" style={{ padding: 32 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof SocietyCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithoutDomain: Story = { args: { domain: undefined } };
