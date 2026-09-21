import { Fragment } from 'react';

export interface Crumb {
  label: string;
  href?: string;
}

export interface BreadcrumbsProps {
  items: Crumb[];
}

/** The site's `.breadcrumbs`, including its schema.org BreadcrumbList markup. */
export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <div className="breadcrumbs">
      <ul itemScope itemType="http://schema.org/BreadcrumbList" className="breadcrumbs__list">
        {items.map((item, i) => (
          <Fragment key={item.label}>
            {i > 0 && <li className="breadcrumbs__divider">/</li>}
            <li
              itemProp="itemListElement"
              itemScope
              itemType="http://schema.org/ListItem"
              className={`breadcrumbs__item${item.href ? '' : ' breadcrumbs__link--disabled'}`}
            >
              {item.href ? (
                <a href={item.href} itemProp="item" className="breadcrumbs__link">
                  <span itemProp="name">{item.label}</span>
                </a>
              ) : (
                <span itemProp="item">
                  <span itemProp="name">{item.label}</span>
                </span>
              )}
              <meta itemProp="position" content={String(i + 1)} />
            </li>
          </Fragment>
        ))}
      </ul>
    </div>
  );
}
