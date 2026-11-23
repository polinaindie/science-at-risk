import type { Meta, StoryObj } from '@storybook/react-vite';
import { ListCard } from './ListCard';

const meta = {
  title: 'Components/ListCard',
  component: ListCard,
  tags: ['autodocs'],
} satisfies Meta<typeof ListCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'Will restore cryopreservation of cell cultures and biological collections',
    entity: 'Institute for Problems of Cryobiology and Cryomedicine',
    text: 'Low-temperature equipment and storage lines for living research materials.',
    price: '~ 11 000 USD',
  },
};

/** Legacy need framing — amount as the headline story. */
export const NeedFraming: Story = {
  args: {
    title: 'Institute for Problems of Cryobiology and Cryomedicine',
    text: 'Institute for Problems of Cryobiology and Cryomedicine',
    price: '~ 11 000 USD',
    amountLabel: 'Required amount',
  },
};
