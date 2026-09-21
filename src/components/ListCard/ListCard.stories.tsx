import type { Meta, StoryObj } from '@storybook/react-vite';
import { ListCard } from './ListCard';

const meta = {
  title: 'Cards/ListCard',
  component: ListCard,
  args: {
    title: 'Institute for Problems of Cryobiology and Cryomedicine',
    text: 'Institute for Problems of Cryobiology and Cryomedicine',
    price: '~ 500000 UAH',
    href: '#',
  },
  decorators: [
    (Story) => (
      <div className="wrapper" style={{ padding: 32 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ListCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithoutPrice: Story = { args: { price: undefined } };

export const Stacked: Story = {
  render: (args) => (
    <div className="list-cards">
      <ListCard {...args} />
      <ListCard {...args} title="Berdiansk State Pedagogical University" price="~ 1200000 UAH" />
    </div>
  ),
};
