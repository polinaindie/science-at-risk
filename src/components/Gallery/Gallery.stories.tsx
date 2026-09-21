import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Gallery } from './Gallery';

const meta = {
  title: 'Components/Gallery',
  component: Gallery,
  tags: ['autodocs'],
} satisfies Meta<typeof Gallery>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    alt: 'Експозиція музею',
    current: 1,
    total: 3,
  },
};

export const Interactive: Story = {
  render: function InteractiveGallery() {
    const [current, setCurrent] = useState(1);
    const total = 3;
    return (
      <Gallery
        alt="Експозиція музею"
        current={current}
        total={total}
        onPrev={() => setCurrent((c) => Math.max(1, c - 1))}
        onNext={() => setCurrent((c) => Math.min(total, c + 1))}
      />
    );
  },
};
