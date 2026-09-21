export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

/** Site breadcrumbs (`.breadcrumbs`) — IBM Plex Mono 12/16. */
export function Breadcrumbs({ items, className = '' }: BreadcrumbsProps) {
  return (
    <nav className={`mb-2.5 md:mb-4 ${className}`.trim()} aria-label="Breadcrumb">
      <ol className="m-0 flex list-none flex-nowrap items-center gap-0 overflow-x-auto p-0 font-mono text-breadcrumbs text-brand-black">
        {items.map((item, index) => {
          const last = index === items.length - 1;
          return (
            <li key={`${item.label}-${index}`} className="flex items-center">
              {index > 0 ? (
                <span className="mx-1" aria-hidden>
                  /
                </span>
              ) : null}
              {last || !item.href ? (
                <span aria-current={last ? 'page' : undefined}>{item.label}</span>
              ) : (
                <a href={item.href} className="text-brand-black no-underline hover:opacity-70">
                  {item.label}
                </a>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export default Breadcrumbs;
