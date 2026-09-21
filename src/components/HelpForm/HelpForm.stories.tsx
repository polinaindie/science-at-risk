import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Button } from '@/components/Button';
import { HelpForm } from './HelpForm';

const meta = {
  title: 'Components/HelpForm',
  component: HelpForm,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof HelpForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Open: Story = {
  args: { open: true },
};

export const Interactive: Story = {
  args: { open: false },
  render: function InteractiveHelp() {
    const [open, setOpen] = useState(false);
    return (
      <div className="min-h-[400px] p-8">
        <Button onClick={() => setOpen(true)}>Want to help?</Button>
        <HelpForm open={open} onClose={() => setOpen(false)} />
      </div>
    );
  },
};
