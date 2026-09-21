import type { Meta, StoryObj } from '@storybook/react-vite';
import { Quote } from './Quote';

const quoteText =
  'В останньому їм допомогла директорка-колаборантка Тетяна Братченко. Коли окупанти захоплювали місто, вона не дотрималася інструкцій і не перенесла найцінніші експонати в фондосховище, натомість розпорядилася демонтувати експозицію, присвячену АТО.';

const meta = {
  title: 'Components/Quote',
  component: Quote,
  tags: ['autodocs'],
  args: { children: quoteText },
} satisfies Meta<typeof Quote>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Plain: Story = {};

export const WithAuthor: Story = {
  args: {
    author: 'Тарас Чмут',
    role: 'директор фонду “Повернись Живим”',
  },
};
