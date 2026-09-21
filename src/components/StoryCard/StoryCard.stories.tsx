import type { Meta, StoryObj } from '@storybook/react-vite';
import { StoryCard } from './StoryCard';

const meta = {
  title: 'Cards/StoryCard',
  component: StoryCard,
  args: {
    title: 'Uncovered Graves. How Lviv restores its memory about the school of mathematics',
    text: 'A Map of Burial Sites Revives the Memory of Lviv’s Forgotten Mathematicians',
    date: '12.08.26',
    image: '/img/story-1.jpg',
    href: '#',
  },
  decorators: [
    (Story) => (
      <div style={{ padding: 32, maxWidth: 420 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof StoryCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithoutImage: Story = { args: { image: undefined } };

export const Grid: Story = {
  decorators: [
    (Story) => (
      <div className="wrapper" style={{ padding: 32 }}>
        <Story />
      </div>
    ),
  ],
  render: (args) => (
    <div className="row">
      {[
        { ...args, image: '/img/story-1.jpg' },
        { ...args, title: 'Stolen museum. Kherson', image: '/img/story-2.png', date: '03.02.26' },
        { ...args, title: 'Test Tubes in the Count’s Estate', image: '/img/story-3.png', date: '19.11.25' },
      ].map((s, i) => (
        <div className="col-md-4 col-12" key={i}>
          <StoryCard {...s} />
        </div>
      ))}
    </div>
  ),
};
