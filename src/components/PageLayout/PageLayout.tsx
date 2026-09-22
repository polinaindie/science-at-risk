import type { ReactNode } from 'react';
import { SiteHeader } from '../SiteHeader/SiteHeader';
import { SiteFooter } from '../SiteFooter/SiteFooter';
import { nav, social, languages, supporters } from '../../content/site';
import type { Crumb } from '../Breadcrumbs/Breadcrumbs';
import { Breadcrumbs } from '../Breadcrumbs/Breadcrumbs';

export interface PageLayoutProps {
  children: ReactNode;
  /** The trail above the page title; "Home" is prepended for every page. */
  crumbs?: Crumb[];
  /**
   * The site's own `.page` modifier — `story`, `expert`, `infrastructures` and
   * so on. It carries that template's spacing.
   */
  variant?: string;
  /** Wraps the crumbs and the page in `.wrapper`; sections that bleed opt out. */
  wrap?: boolean;
}

/**
 * The frame every page but the home page sits in: the bar, the breadcrumbs and
 * the footer. `indentHeader` is the site's own class for clearing the header,
 * which is positioned over the page rather than above it.
 */
export function PageLayout({ children, crumbs = [], variant, wrap = true }: PageLayoutProps) {
  const trail: Crumb[] = [{ label: 'Home', href: '/' }, ...crumbs];

  return (
    <>
      <SiteHeader nav={nav} social={social} languages={languages} tone="black" fixed />
      <main className={`page indentHeader${variant ? ` ${variant}` : ''}`}>
        {wrap ? (
          <div className="wrapper">
            <Breadcrumbs items={trail} />
            {children}
          </div>
        ) : (
          <>
            <div className="wrapper">
              <Breadcrumbs items={trail} />
            </div>
            {children}
          </>
        )}
      </main>
      <SiteFooter groups={supporters} />
    </>
  );
}
