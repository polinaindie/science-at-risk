import type { Meta, StoryObj } from '@storybook/react-vite';

/**
 * The palette the site actually paints with, counted from its stylesheet:
 * black and white carry the layout, `#B5C6CD` marks tags and the loader,
 * `#F0EEBE` and `#FF5114` are the two accents.
 */
const palette = [
  { name: 'Black', value: '#000000', usage: 'Text, dark sections, primary button' },
  { name: 'White', value: '#FFFFFF', usage: 'Page background, inverted button' },
  { name: 'Mist', value: '#B5C6CD', usage: 'Tags, loader, muted surfaces' },
  { name: 'Sand', value: '#F0EEBE', usage: 'Accent background' },
  { name: 'Signal', value: '#FF5114', usage: 'Accent / highlight' },
  { name: 'Ink', value: '#121416', usage: 'Deep surface' },
];

function Swatch({ name, value, usage }: (typeof palette)[number]) {
  return (
    <div style={{ width: 200 }}>
      <div
        style={{
          height: 96,
          background: value,
          border: '1px solid rgba(0,0,0,.12)',
          borderRadius: 12,
        }}
      />
      <p className="main-text main-text--mono" style={{ margin: '8px 0 0' }}>
        {name}
      </p>
      <p className="main-text main-text--mono" style={{ margin: 0, opacity: 0.6 }}>
        {value}
      </p>
      <p className="main-text" style={{ margin: '4px 0 0', fontSize: 13, opacity: 0.7 }}>
        {usage}
      </p>
    </div>
  );
}

const meta = {
  title: 'Foundations/Colors',
  parameters: { layout: 'padded' },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Palette: Story = {
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24, padding: 24 }}>
      {palette.map((c) => (
        <Swatch key={c.name} {...c} />
      ))}
    </div>
  ),
};
