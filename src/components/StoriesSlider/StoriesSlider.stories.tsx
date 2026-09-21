import type { Meta, StoryObj } from '@storybook/react-vite';
import { StoriesSlider } from './StoriesSlider';

const slides = [
  {
    suptitle: 'Stories',
    title: 'Stolen museum. Kherson',
    text: 'What did the Russians steal from the Kherson Local History Museum during the retreat from the city and how did the director-collaborator contribute to this?',
    image: '/img/story-2.png',
    href: '#',
  },
  {
    suptitle: 'Stories',
    title: 'Test Tubes in the Count’s Estate',
    text: 'The main building of the Institute of Agricultural Microbiology sits in Count Glebov’s "castle". Read how the institute has kept working since the outbreak of full-scale war.',
    image: '/img/story-3.png',
    href: '#',
  },
  {
    suptitle: 'Stories',
    title: 'Uncovered Graves. How Lviv restores its memory about the school of mathematics',
    text: 'A Map of Burial Sites Revives the Memory of Lviv’s Forgotten Mathematicians.',
    image: '/img/story-1.jpg',
    href: '#',
  },
];

const meta = {
  title: 'Sections/StoriesSlider',
  component: StoriesSlider,
  parameters: { layout: 'fullscreen' },
  args: {
    slides,
    otherLink: { label: 'Other stories', href: '#' },
  },
} satisfies Meta<typeof StoriesSlider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const SingleSlide: Story = { args: { slides: [slides[0]] } };

export const Ukrainian: Story = {
  args: {
    readLabel: 'Читати',
    prevLabel: 'Назад',
    nextLabel: 'Далі',
    otherLink: { label: 'Інші історії', href: '#' },
    slides: slides.map((s) => ({ ...s, suptitle: 'Історії' })),
  },
};
