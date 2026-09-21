import type { Meta, StoryObj } from '@storybook/react-vite';
import { HomeHeroSandboxPage } from './HomeHeroSandboxPage';

const meta = {
  title: 'Sandbox/HomeHero',
  component: HomeHeroSandboxPage,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Homepage hero — Figma Main frame with story meta, lead card, wordmark, and site nav.',
      },
    },
  },
} satisfies Meta<typeof HomeHeroSandboxPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Ukrainian: Story = {
  args: {
    locale: 'UA',
    activeNavHref: '/uk/infrastructures',
    stories: [
      {
        tabTitle: 'Фізики з Харкова відновили нейтронне джерело',
        tabSubtitle:
          'Вони знову запустили джерело — і продовжують дослідження попри блекаути.',
        title: 'Наука в Чорнобилі: окупація, відновлення та виклики майбутнього',
        text: 'Як українські дослідники продовжують польові роботи в Зоні відчуження попри окупацію, втрату інфраструктури та наслідки катастрофи 1986 року.',
        href: '/uk/story/nauka-v-chornobyl',
        images: [
          {
            src: 'https://scienceatrisk.org/storage/lp/138/35bad048a94c9d66ebfeffe80817af579e4a2290.png',
            alt: 'Дuga біля Чорнобиля',
          },
        ],
      },
      {
        tabTitle: 'Вкрадений музей. Херсон',
        tabSubtitle: 'Що росіяни вивезли з Херсонського краєзнавчого музею під час відступу?',
        title: 'Вкрадений музей. Херсон',
        text: 'Що росіяни вивезли з Херсонського краєзнавчого музею під час відступу з міста і як до цього доклалася директорка, що співпрацювала з окупантами.',
        href: '/uk/story/vkradenyi-muzei-kherson',
        images: [
          {
            src: 'https://scienceatrisk.org/storage/lp/13/1c9d9f1dc389e5e2561ede474b210a5b32d7ec01.png',
            alt: 'Вкрадений музей. Херсон',
          },
        ],
      },
      {
        tabTitle: 'Пробірки в маєтку графа',
        tabSubtitle: 'Інститут працює в «замку» графа Глебова з початку повномасштабної війни.',
        title: 'Пробірки в маєтку графа',
        text: 'Головний корпус Інституту сільськогосподарської мікробіології та агропромислового виробництва розташований у «замку» графа Глебова.',
        href: '/uk/story/probirky-v-maiatku-grafa',
        images: [
          {
            src: 'https://scienceatrisk.org/storage/lp/131/9463255b2210d4cbe1c460b411ada8ec0bca54cd.png',
            alt: 'Пробірки в маєтку графа',
          },
        ],
      },
    ],
  },
};
