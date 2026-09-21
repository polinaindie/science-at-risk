import type { Meta, StoryObj } from '@storybook/react-vite';
import { Gallery } from './Gallery';

const meta = {
  title: 'Sections/Gallery',
  component: Gallery,
  args: {
    images: [
      { src: '/img/story-1.jpg', alt: 'Lviv mathematicians', caption: 'Lviv, 2024' },
      { src: '/img/story-2.png', alt: 'Kherson museum' },
      { src: '/img/story-3.png', alt: 'Institute of Agricultural Microbiology' },
    ],
  },
  decorators: [
    (Story) => (
      <div className="wrapper" style={{ padding: 32 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Gallery>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const SingleImage: Story = {
  args: { images: [{ src: '/img/story-1.jpg', alt: 'Lviv mathematicians' }] },
};
