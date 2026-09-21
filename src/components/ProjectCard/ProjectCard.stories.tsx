import type { Meta, StoryObj } from '@storybook/react-vite';
import { ProjectCard } from './ProjectCard';

const meta = {
  title: 'Components/ProjectCard',
  component: ProjectCard,
  tags: ['autodocs'],
} satisfies Meta<typeof ProjectCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'Development of new antibacterial agents',
    texts: [
      'Joint research project with European partners.',
      'Focus on synthetic chemistry and high technologies.',
    ],
  },
};
