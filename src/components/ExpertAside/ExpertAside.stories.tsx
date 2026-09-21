import type { Meta, StoryObj } from '@storybook/react-vite';
import { ExpertAside } from './ExpertAside';

const meta = {
  title: 'Components/ExpertAside',
  component: ExpertAside,
  tags: ['autodocs'],
} satisfies Meta<typeof ExpertAside>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    name: 'Oleksandra Antoniuk',
    contacts: [
      { label: 'Email', href: 'mailto:example@scienceatrisk.org' },
      { label: 'ORCID', href: '#' },
    ],
    languages: 'UA, EN',
  },
};
