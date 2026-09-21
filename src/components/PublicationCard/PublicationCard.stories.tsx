import type { Meta, StoryObj } from '@storybook/react-vite';
import { PublicationCard } from './PublicationCard';

const meta = {
  title: 'Cards/PublicationCard',
  component: PublicationCard,
  args: {
    title:
      'Occasionalism as a Mean for Creating Comic Effect in Ukrainian Humorous and Satirical Poetry of the 1950s–1980s',
    meta: 'Author: Sofiia Fedzhora, Journal: Studia Linguistica, Year: 2020, Vol. 16, Pages: 129–142',
    role: 'Role: Author',
    href: '#',
  },
  decorators: [
    (Story) => (
      <div className="wrapper" style={{ padding: 32 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof PublicationCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const TitleOnly: Story = { args: { meta: undefined, role: undefined } };
