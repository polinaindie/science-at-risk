import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { SectionDeck, type HeaderTone, type SectionDeckProps } from './SectionDeck';

const panel = (label: string, background: string, color: string) => (
  <section
    className="fullSection"
    style={{ background, color, justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}
  >
    <p className="main-text main-text--mono">{label}</p>
  </section>
);

const sections = [
  { key: 'one', tone: 'black' as HeaderTone, node: panel('One — scroll down', '#b5c6cd', '#000') },
  { key: 'two', tone: 'white' as HeaderTone, node: panel('Two', '#000', '#fff') },
  { key: 'three', tone: 'black' as HeaderTone, node: panel('Three', '#f0eebe', '#000') },
];

const meta = {
  title: 'Layout/SectionDeck',
  component: SectionDeck,
  parameters: { layout: 'fullscreen' },
  args: { sections },
} satisfies Meta<typeof SectionDeck>;

export default meta;
type Story = StoryObj<typeof meta>;

/** A gesture moves one section; the next slides up over the one you leave. */
export const Default: Story = {};

function ToneReadout(args: SectionDeckProps) {
  const [tone, setTone] = useState<HeaderTone>('black');
  return (
    <>
      <p
        className="main-text main-text--mono"
        style={{ position: 'fixed', top: 16, left: 16, zIndex: 100, color: tone }}
      >
        tone: {tone}
      </p>
      <SectionDeck {...args} onToneChange={setTone} />
    </>
  );
}

/** The tone each section asks the header for, reported as you move. */
export const ReportsTone: Story = {
  render: (args) => <ToneReadout {...args} />,
};

/** Off the deck the sections simply stack down the page. */
export const Flow: Story = { args: { enabled: false } };
