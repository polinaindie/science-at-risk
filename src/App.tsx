import { useEffect } from 'react';
import { HomePageV6 } from '@/sandbox/HomePageV6';
import { CabinetDemo, type CabinetSection } from '@/components/Cabinet';

const SECTIONS: CabinetSection[] = ['profile', 'notifications', 'collaboration', 'opportunities', 'settings'];

/**
 * Standalone preview, outside Storybook. No router: the home page is what
 * every address shows, except `/cabinet[/section]`, which opens the cabinet
 * (the sign-in screens send people there).
 */
export function App() {
  useEffect(() => {
    // The document says which language it is in, for readers and for the browser.
    document.documentElement.lang = /^\/uk\/?$/.test(window.location.pathname.replace(import.meta.env.BASE_URL, '/')) ? 'uk' : 'en';
  }, []);
  const path = window.location.pathname.replace(import.meta.env.BASE_URL, '/');
  const match = path.match(/^\/cabinet(?:\/([a-z]+))?\/?$/);
  if (match) {
    const section = SECTIONS.find((s) => s === match[1]) ?? 'profile';
    return (
      <CabinetDemo
        section={section}
        // `/cabinet/welcome` is where the first sign-in lands: an empty profile and the wizard.
        firstLogin={match[1] === 'welcome'}
        // `?controls` shows the review strip: statuses, empty and many-record states, language.
        controls={new URLSearchParams(window.location.search).has('controls')}
        onSectionChange={(s) =>
          window.history.pushState(null, '', `${import.meta.env.BASE_URL}cabinet/${s}`)
        }
      />
    );
  }
  // `/uk` is the Ukrainian home page: the same page, in Ukrainian.
  const uk = /^\/uk\/?$/.test(path);
  return <HomePageV6 locale={uk ? 'uk' : 'en'} />;
}

export default App;
