import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from './Button';

const meta = {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['black', 'white', 'bordered'],
    },
    disabled: { control: 'boolean' },
    children: { control: 'text' },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Black: Story = {
  args: { variant: 'black', children: 'Детальніше' },
};

export const BlackHover: Story = {
  args: { variant: 'black', children: 'Детальніше' },
  parameters: { pseudo: { hover: true } },
};

export const BlackDisabled: Story = {
  args: { variant: 'black', children: 'Детальніше', disabled: true },
};

export const White: Story = {
  args: { variant: 'white', children: 'Детальніше' },
  parameters: {
    backgrounds: { default: 'dark' },
  },
  decorators: [
    (Story) => (
      <div className="bg-brand-black p-8">
        <Story />
      </div>
    ),
  ],
};

export const WhiteDisabled: Story = {
  args: { variant: 'white', children: 'Детальніше', disabled: true },
  decorators: [
    (Story) => (
      <div className="bg-brand-black p-8">
        <Story />
      </div>
    ),
  ],
};

export const Bordered: Story = {
  args: { variant: 'bordered', children: 'Детальніше' },
};

export const AllStates: Story = {
  render: () => (
    <div className="flex flex-col gap-12 p-8">
      <section>
        <p className="mb-4 font-ukraine text-[18px] font-light text-brand-muted">Black</p>
        <div className="flex flex-wrap items-center gap-6">
          <Button variant="black">Детальніше</Button>
          <Button variant="black" disabled>
            Детальніше
          </Button>
        </div>
      </section>
      <section className="bg-brand-black p-6">
        <p className="mb-4 font-ukraine text-[18px] font-light text-white/70">White</p>
        <div className="flex flex-wrap items-center gap-6">
          <Button variant="white">Детальніше</Button>
          <Button variant="white" disabled>
            Детальніше
          </Button>
        </div>
      </section>
      <section>
        <p className="mb-4 font-ukraine text-[18px] font-light text-brand-muted">Bordered</p>
        <div className="flex flex-wrap items-center gap-6">
          <Button variant="bordered">Детальніше</Button>
          <Button variant="bordered" disabled>
            Детальніше
          </Button>
        </div>
      </section>
      <p className="max-w-xl font-ukraine text-[18px] font-light text-brand-muted">
        Кнопки — це сквіркли. Не прямокутники з закругленими кутами.
      </p>
    </div>
  ),
};
