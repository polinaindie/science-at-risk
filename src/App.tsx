import { HomePage } from '@/sandbox/HomePage';
import { HomePageV2 } from '@/sandbox/HomePageV2';
import { HomePageV3 } from '@/sandbox/HomePageV3';
import { HomePageV4 } from '@/sandbox/HomePageV4';
import { HomePageV5 } from '@/sandbox/HomePageV5';

/**
 * Standalone preview of the homepage drafts, outside Storybook. One draft per
 * path so they can be compared side by side; no router — this is a preview app.
 */
export function App() {
  // Read against the base the site is served from: on a project page every
  // address carries a `/<repo>/` prefix, and a draft would never be found by
  // its own name. `BASE_URL` is `/` everywhere else, so this changes nothing
  // locally.
  const base = import.meta.env.BASE_URL.replace(/\/+$/, '');
  const path = window.location.pathname.replace(/\/+$/, '').slice(base.length) || '/';

  if (path === '/v5') return <HomePageV5 />;
  if (path === '/v4') return <HomePageV4 />;
  if (path === '/v3') return <HomePageV3 />;
  if (path === '/v2') return <HomePageV2 />;
  return <HomePage heroVariant="search" />;
}

export default App;
