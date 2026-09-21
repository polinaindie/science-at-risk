import type { Preview } from '@storybook/react-vite';
import '../src/styles/site.css';
import '../src/styles/squircle.css';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      test: 'todo',
    },
    options: {
      storySort: {
        order: [
          'Foundations',
          'Atoms',
          'Molecules',
          'Cards',
          'Sections',
        ],
      },
    },
  },
  decorators: [
    // The site scopes a number of rules under `.isDefault`, and the dark
    // sections rely on a `black` ancestor, so stories render inside the same
    // wrapper the real pages use.
    (Story) => (
      <div className="isDefault">
        <Story />
      </div>
    ),
  ],
};

export default preview;
