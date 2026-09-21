import type { Meta, StoryObj } from '@storybook/react-vite';
import { SiteFooter } from './SiteFooter';

const meta = {
  title: 'Sections/SiteFooter',
  component: SiteFooter,
  parameters: { layout: 'fullscreen' },
  args: {
    groups: [
      {
        title: 'The project is supported by:',
        links: [
          { label: 'Press, Education and Culture Department of the US Embassy in Ukraine', href: '#' },
          { label: 'Alfred P. Sloan Foundation', href: '#' },
          { label: 'Ministry of Education and Science of Ukraine', href: '#' },
          { label: 'National research fund', href: '#' },
        ],
      },
      {
        title: 'Responsible for project implementation:',
        links: [{ label: 'NGO "Kunsht"', href: '#' }],
      },
    ],
  },
} satisfies Meta<typeof SiteFooter>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Ukrainian: Story = {
  args: {
    title: 'Хочете допомогти?',
    formTitle: 'Заповніть форму або зв’яжіться з нами',
    submitLabel: 'Відправити',
    labels: { name: 'Ім’я', email: 'Електронна пошта', topic: 'Тема', text: 'Текст' },
  },
};
