import type { Preview } from '@storybook/react-vite';
import '../src/styles/globals.css';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    layout: 'fullscreen',
    backgrounds: {
      default: 'brand',
      values: [
        { name: 'brand', value: '#ffffff' },
        { name: 'dark', value: '#000000' },
        { name: 'accent-blue', value: '#b5c6cd' },
        { name: 'accent-yellow', value: '#f0eebe' },
      ],
    },
    viewport: {
      options: {
        mobile: {
          name: 'Mobile',
          styles: { width: '375px', height: '812px' },
          type: 'mobile',
        },
        desktop: {
          name: 'Desktop',
          styles: { width: '1440px', height: '900px' },
          type: 'desktop',
        },
      },
    },
    docs: {
      toc: true,
    },
    a11y: {
      test: 'todo',
    },
    options: {
      storySort: {
        order: [
          'Sandbox',
          ['HomeHero'],
          'Foundations',
          ['Typography', 'Colors'],
          'Components',
          [
            'Button',
            'Link',
            'Tag',
            'TextField',
            'Select',
            'Breadcrumbs',
            'Pagination',
            'Header',
            'MobileNav',
            'Footer',
            'SearchHero',
            'PageHero',
            'HomeHero',
            'ExpertCard',
            'InfrastructuresCard',
            'PaperCard',
            'StoryCard',
            'ListCard',
            'ProjectCard',
            'PersonCard',
            'ExpertAside',
            'HelpForm',
            'Gallery',
            'StoriesSlide',
            'FullImage',
            'Quote',
            'DateLabel',
            'ShareLinks',
            'StoryAside',
            'InfoSection',
            'Loader',
            'Nothing',
          ],
          '*',
        ],
      },
    },
  },
  initialGlobals: {
    viewport: { value: 'desktop', isRotated: false },
  },
};

export default preview;
