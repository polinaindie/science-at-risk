import type { Meta, StoryObj } from '@storybook/react-vite';
import { PersonCard } from './PersonCard';

const meta = {
  title: 'Components/PersonCard',
  component: PersonCard,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof PersonCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    name: 'Oleksandra Antoniuk',
    position: 'Ph.D., researcher',
    contactHref: 'mailto:example@scienceatrisk.org',
    onHelpClick: () => undefined,
  },
};
