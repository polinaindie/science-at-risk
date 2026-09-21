import type { Meta, StoryObj } from '@storybook/react-vite';
import { BackToTop } from './BackToTop';

const meta = {
  title: 'Components/BackToTop',
  component: BackToTop,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof BackToTop>;

export default meta;
type Story = StoryObj<typeof meta>;

export const OnLongPage: Story = {
  args: { label: 'Повернутися нагору', threshold: 200 },
  render: (args) => (
    <div className="min-h-[250vh] bg-brand-white p-10">
      <h1 className="font-serif text-h1-desktop">Довга стаття</h1>
      <p className="mt-4 font-ukraine text-text2-desktop font-light">
        Прокрутіть вниз — зʼявиться кнопка «нагору».
      </p>
      {Array.from({ length: 20 }).map((_, i) => (
        <p key={i} className="mt-6 font-ukraine text-text2-desktop font-light">
          Абзац {i + 1}. Ut enim ad minim veniam, quis nostrud exercitation ullamco
          laboris nisi ut aliquip ex ea commodo consequat.
        </p>
      ))}
      <BackToTop {...args} />
    </div>
  ),
};

export const EnglishLabel: Story = {
  args: { label: 'Back to top', threshold: 100 },
  render: OnLongPage.render,
};
