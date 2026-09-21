import type { Meta, StoryObj } from '@storybook/react-vite';
import { ExpertAside } from './ExpertAside';

const meta = {
  title: 'Sections/ExpertAside',
  component: ExpertAside,
  args: {
    photo: '/img/person-2.jpg',
    name: 'Sofiia Fedzhora',
    languagesTitle: 'Languages for professional communication:',
    languages: 'English, Polish, Spanish, German',
    links: [
      { label: 'Facebook', href: '#' },
      { label: 'Linkedin', href: '#' },
    ],
  },
  decorators: [
    (Story) => (
      <div style={{ padding: 32, maxWidth: 380 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ExpertAside>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Ukrainian: Story = {
  args: {
    contactLabel: 'Зв’язатися',
    languagesTitle: 'Мови для професійного спілкування:',
    languages: 'Англійська, польська, іспанська, німецька',
  },
};

export const WithoutLinks: Story = { args: { links: [] } };
