import type { Meta, StoryObj } from '@storybook/react-vite';
import { SiteHeader } from './SiteHeader';

const meta = {
  title: 'Components/SiteHeader',
  component: SiteHeader,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof SiteHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const StickyOnLongPage: Story = {
  args: { locale: 'UA', tone: 'light' },
  render: (args) => (
    <div className="min-h-[200vh] bg-brand-white">
      <SiteHeader {...args} />
      <main className="mx-auto max-w-[1360px] px-6 py-10 md:px-10">
        <h1 className="font-serif text-h1-desktop">Довга сторінка</h1>
        <p className="mt-4 font-ukraine text-text2-desktop font-light">
          Прокрутіть вниз — хедер лишається зверху на всьому скролі (fixed, не sticky).
          Бургер відкриває меню; воно не закривається від скролу.
        </p>
        {Array.from({ length: 12 }).map((_, i) => (
          <p key={i} className="mt-6 font-ukraine text-text2-desktop font-light">
            Абзац {i + 1}. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>
        ))}
      </main>
    </div>
  ),
};

export const Dark: Story = {
  args: { locale: 'EN', tone: 'dark' },
  render: (args) => (
    <div className="min-h-[120vh] bg-brand-black text-white">
      <SiteHeader {...args} />
      <p className="p-10 font-mono">
        Dark sticky header — open the menu (Escape closes). Panel inverts to white on dark.
      </p>
    </div>
  ),
};
