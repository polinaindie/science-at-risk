import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  "stories": [
    "../src/**/*.mdx",
    "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"
  ],
  "addons": [
    "@chromatic-com/storybook",
    "@storybook/addon-vitest",
    "@storybook/addon-a11y",
    "@storybook/addon-docs",
    "@storybook/addon-mcp"
  ],
  "framework": "@storybook/react-vite",
  /**
   * Storybook is published beside the site, under `<base>/storybook/`, so its
   * own assets need that prefix too.
   */
  viteFinal: async (config) => ({
    ...config,
    base: process.env.STORYBOOK_BASE ?? config.base,
  }),
};
export default config;