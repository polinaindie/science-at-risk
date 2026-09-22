import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router';
import { HomePage } from '../pages/HomePage/HomePage';
import { homePageContent } from '../pages/HomePage/homePageContent';
import { ExpertsPage } from '../pages/ExpertsPage/ExpertsPage';
import { ExpertPage } from '../pages/ExpertPage/ExpertPage';
import { InfrastructuresPage } from '../pages/InfrastructuresPage/InfrastructuresPage';
import { InfrastructurePage } from '../pages/InfrastructurePage/InfrastructurePage';
import { SocietiesPage } from '../pages/SocietiesPage/SocietiesPage';
import { SocietyPage } from '../pages/SocietyPage/SocietyPage';
import { StoriesPage } from '../pages/StoriesPage/StoriesPage';
import { StoryPage } from '../pages/StoryPage/StoryPage';
import { ResearchPage } from '../pages/ResearchPage/ResearchPage';
import { ResearchPaperPage } from '../pages/ResearchPaperPage/ResearchPaperPage';
import { AboutPage } from '../pages/AboutPage/AboutPage';
import { ContactsPage } from '../pages/ContactsPage/ContactsPage';
import { NotFoundPage } from '../pages/NotFoundPage/NotFoundPage';

/**
 * The components in this library are plain markup — they render `<a href>`
 * rather than a router's link, which is what keeps them usable outside React.
 * So the app catches clicks on its own links here instead, one listener for
 * the whole tree, and hands them to the router.
 *
 * Everything a browser treats as "not a plain navigation" is left alone:
 * modified clicks, non-left buttons, `target`, `download`, and any href that
 * leaves the site.
 */
function useInternalLinks() {
  const navigate = useNavigate();

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const link = (event.target as Element | null)?.closest?.('a');
      if (!(link instanceof HTMLAnchorElement)) return;
      if (link.target && link.target !== '_self') return;
      if (link.hasAttribute('download')) return;
      const href = link.getAttribute('href');
      // "#" is the library's placeholder for a link that has no page yet.
      if (!href || href.startsWith('#')) return;
      const url = new URL(href, window.location.href);
      if (url.origin !== window.location.origin) return;
      event.preventDefault();
      navigate(url.pathname + url.search);
    };

    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, [navigate]);
}

/** Each page starts at its own top, the way a fresh document would. */
function useScrollReset(pathname: string) {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
}

function Shell() {
  useInternalLinks();
  useScrollReset(window.location.pathname);

  return (
    <Routes>
      <Route path="/" element={<HomePage {...homePageContent} />} />
      <Route path="/experts" element={<ExpertsPage />} />
      <Route path="/experts/:slug" element={<ExpertPage />} />
      <Route path="/infrastructures" element={<InfrastructuresPage />} />
      <Route path="/infrastructures/:slug" element={<InfrastructurePage />} />
      <Route path="/societies" element={<SocietiesPage />} />
      <Route path="/societies/:slug" element={<SocietyPage />} />
      <Route path="/stories" element={<StoriesPage />} />
      <Route path="/stories/:slug" element={<StoryPage />} />
      <Route path="/research" element={<ResearchPage />} />
      <Route path="/research/:slug" element={<ResearchPaperPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/contacts" element={<ContactsPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export function App() {
  return (
    // Vite's base, minus the trailing slash: '/' at home, '/science-at-risk'
    // once the build is published to a GitHub project page.
    <BrowserRouter basename={import.meta.env.BASE_URL.replace(/\/$/, '')}>
      <Shell />
    </BrowserRouter>
  );
}
