import type { Meta, StoryObj } from '@storybook/react-vite';
import { InfrastructuresCard } from './InfrastructuresCard';

const meta = {
  title: 'Components/InfrastructuresCard',
  component: InfrastructuresCard,
  tags: ['autodocs'],
} satisfies Meta<typeof InfrastructuresCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title:
      'Research and technology complex "Institute of Single Crystals" of the National Academy of Sciences of Ukraine',
    description:
      'Research and technology complex "Institute of Single Crystals" of the National Academy of Sciences of Ukraine',
    domain: 'Materials science, chemistry, physics, biomedicine, pharmacy, technologies',
    amount: '~ 100000 UAH',
    borderedTop: true,
  },
};

export const Society: Story = {
  args: {
    title: 'Association of Gynecologists-Endocrinologists of Ukraine',
    description: 'Scientific society',
    domain: 'Medicine',
    domainHref: '/societies?tag=medicine',
    amount: undefined,
    imageSrc: undefined,
    domainLabel: 'Field',
  },
};
