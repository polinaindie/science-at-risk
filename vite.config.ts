/// <reference types="vitest/config" />
import { defineConfig, type PluginOption } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import { playwright } from '@vitest/browser-playwright';

const dirname = import.meta.dirname ?? path.dirname(fileURLToPath(import.meta.url));

/**
 * The app names the files in `public/` by their root-absolute path, which is
 * what they are wherever the site is served from its own root. A build for a
 * project page is not: Vite puts the prefix on the paths it can see — the ones
 * in the HTML and in CSS `url()` — but the ones inside components are ordinary
 * strings it never looks at, so the wordmark and the photographs would 404.
 * This puts the prefix on those too, and only for a based build.
 */
const rebaseAssetStrings = (base: string): PluginOption => ({
  name: 'rebase-asset-strings',
  apply: 'build',
  transform(code: string, id: string) {
    if (!/\.[jt]sx?$/.test(id)) return null;
    if (!code.includes('/assets/')) return null;
    return { code: code.replace(/(["'`])\/assets\//g, `$1${base}assets/`), map: null };
  },
});


/**
 * Dev only: when a component or a stylesheet source changes, regenerate what is built from them (the hand-off specimens,
 * the header and footer on the static pages) and reload the page. Shared CSS (public/css, public/js) needs no step: the
 * hand-off links the same files. Output goes to public/, which is not watched here, so there is no loop.
 */
const handoffSync = (): PluginOption => ({
  name: 'handoff-sync',
  apply: 'serve',
  configureServer(server) {
    let timer: ReturnType<typeof setTimeout> | undefined;
    let running = false;
    let again = false;
    let full = false;
    const run = () => {
      if (running) {
        again = true;
        return;
      }
      running = true;
      const args = ['scripts/sync.mjs', ...(full ? [] : ['--only=handoff'])];
      full = false;
      const child = spawn(process.execPath, args, { cwd: dirname, stdio: ['ignore', 'pipe', 'pipe'] });
      let out = '';
      child.stdout.on('data', (d) => (out += d));
      child.stderr.on('data', (d) => (out += d));
      child.on('close', (code) => {
        running = false;
        server.config.logger.info(
          `[handoff-sync] ${code === 0 ? 'hand-off regenerated' : 'FAILED\n' + out.trim()}`,
          { timestamp: true },
        );
        server.ws.send({ type: 'full-reload' });
        if (again) {
          again = false;
          run();
        }
      });
    };
    server.watcher.on('change', (file) => {
      const rel = path.relative(dirname, file).split(path.sep).join('/');
      if (!/^src\/(components|styles)\//.test(rel) || /\.(stories|test)\.tsx?$/.test(rel)) return;
      if (/^src\/components\/(SiteHeader|MobileNav|Footer|SquircleLink)\//.test(rel) || rel.startsWith('src/styles/')) full = true;
      clearTimeout(timer);
      timer = setTimeout(run, 600);
    });
  },
});

const base = process.env.PAGES_BASE ?? '/';

export default defineConfig({
  /**
   * A GitHub project page is served from `/<repo>/`, not from the root, so a
   * build for it has to be told that prefix. The dev server and the local
   * preview keep the root.
   */
  base,
  plugins: [react(), tailwindcss(), handoffSync(), ...(base === '/' ? [] : [rebaseAssetStrings(base)])],
  resolve: {
    alias: {
      '@': path.resolve(dirname, './src'),
    },
  },
  test: {
    projects: [
      {
        extends: true,
        plugins: [
          storybookTest({
            configDir: path.join(dirname, '.storybook'),
          }),
        ],
        test: {
          name: 'storybook',
          browser: {
            enabled: true,
            headless: true,
            provider: playwright({}),
            instances: [{ browser: 'chromium' }],
          },
        },
      },
    ],
  },
});
