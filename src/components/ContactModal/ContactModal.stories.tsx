import type { Meta, StoryObj } from '@storybook/react-vite';
import { ContactModal } from './ContactModal';

const meta = {
  title: 'Sections/ContactModal',
  component: ContactModal,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof ContactModal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Ukrainian: Story = {
  args: {
    title: 'Зв’яжіться з експертом/експерткою',
    text: 'Заповніть цю форму, щоб надіслати повідомлення науковцю/науковиці',
    labels: { name: 'Ім’я', email: 'Електронна пошта', text: 'Текст' },
    submitLabel: 'Відправити',
    closeLabel: 'Закрити',
  },
};
