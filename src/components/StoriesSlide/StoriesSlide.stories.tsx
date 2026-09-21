import type { Meta, StoryObj } from '@storybook/react-vite';
import { StoriesSlide } from './StoriesSlide';

const meta = {
  title: 'Components/StoriesSlide',
  component: StoriesSlide,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof StoriesSlide>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'Stolen museum. Kherson',
    text: 'What did the Russians steal from the Kherson Local History Museum during the retreat from the city and how did the director-collaborator contribute to this?',
    imageSrc: '/assets/mirror/stolen-museum.png',
    href: '/story/stolen-museum-kherson',
  },
};

/** Homepage usage: localised carousel labels and height reduced by the fixed header. */
export const UkrainianUnderHeader: Story = {
  args: {
    suptitle: 'Історії',
    title: '«451 за Фаренгейтом»: як херсонська бібліотека виживає під обстрілами',
    text: 'Обласна наукова бібліотека працює за кілька сотень метрів від позицій росіян — і зберігає фонди.',
    ctaLabel: 'Читати',
    otherLabel: 'Інші історії',
    otherHref: '/uk/stories',
    prevLabel: '< Назад',
    nextLabel: 'Далі >',
    heightClass: 'min-h-[calc(100svh-66px)]',
  },
};
