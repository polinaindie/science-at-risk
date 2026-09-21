import type { Meta, StoryObj } from '@storybook/react-vite';
import { Nothing } from './Nothing';

const meta = {
  title: 'Components/Nothing',
  component: Nothing,
  tags: ['autodocs'],
} satisfies Meta<typeof Nothing>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Default: text-only — no duplicate popular tags from SearchHero. */
export const Default: Story = {
  args: {
    title: 'Ми нічого не знайшли за вашим запитом',
    text: 'Спробуйте інше ключове слово або скиньте фільтр і пошукайте ще раз.',
    suggestions: [],
  },
};

/** Rare case: alternate suggestions that are NOT the hero popular set. */
export const WithAlternateSuggestions: Story = {
  args: {
    title: 'Nothing found',
    text: 'Try a related field instead:',
    suggestions: ['Chemistry', 'Physics'],
  },
};
