import type { Meta, StoryObj } from '@storybook/react-vite';

/**
 * Three families carry the whole site: Noto Serif for titles, e-Ukraine for
 * body copy, IBM Plex Mono for labels, dates and tags.
 */
const meta = {
  title: 'Foundations/Typography',
  parameters: { layout: 'padded' },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Scale: Story = {
  render: () => (
    <div className="wrapper" style={{ padding: 32, display: 'grid', gap: 32 }}>
      <div>
        <p className="main-text main-text--mono" style={{ opacity: 0.6 }}>
          main-title — Noto Serif
        </p>
        <h1 className="main-title">Find Ukrainian scientists for collaboration</h1>
      </div>
      <div>
        <p className="main-text main-text--mono" style={{ opacity: 0.6 }}>
          main-title--h2
        </p>
        <h2 className="main-title main-title--h2">Assistance in reconstruction</h2>
      </div>
      <div>
        <p className="main-text main-text--mono" style={{ opacity: 0.6 }}>
          main-text — e-Ukraine
        </p>
        <p className="main-text">
          Scientific infrastructure damaged during the war. Mark the scientific field that interests you and
          involve Ukrainian scientists in your own projects.
        </p>
      </div>
      <div>
        <p className="main-text main-text--mono" style={{ opacity: 0.6 }}>
          main-text--mono — IBM Plex Mono
        </p>
        <p className="main-text main-text--mono">12.08.26 · Popular requests · Science Domain</p>
      </div>
      <div>
        <p className="main-text main-text--mono" style={{ opacity: 0.6 }}>
          paragraph — long-form body inside a story
        </p>
        <div className="story">
          <p className="paragraph">
            At the time of the invasion, a unique herbarium was kept at Kherson University — one of the largest
            in Ukraine. It began to be collected in 1945, because the original specimens were lost during the
            Second World War.
          </p>
        </div>
      </div>
    </div>
  ),
};
