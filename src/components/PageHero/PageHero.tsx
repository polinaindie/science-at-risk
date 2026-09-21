import { Breadcrumbs, type BreadcrumbItem } from '@/components/Breadcrumbs';
import { Select, type SelectOption } from '@/components/Select';

export type PageHeroVariant = 'blue' | 'cream' | 'plain';

export interface PageHeroProps {
  title: string;
  text?: string;
  breadcrumbs?: BreadcrumbItem[];
  variant?: PageHeroVariant;
  selectOptions?: SelectOption[];
  selectPlaceholder?: string;
  className?: string;
}

/** Listing page hero (infrastructures / papers / stories). */
export function PageHero({
  title,
  text,
  breadcrumbs,
  variant = 'blue',
  selectOptions,
  selectPlaceholder,
  className = '',
}: PageHeroProps) {
  const bg =
    variant === 'blue'
      ? 'bg-brand-accent-blue'
      : variant === 'cream'
        ? 'bg-brand-accent-yellow'
        : 'bg-brand-white';

  return (
    <section className={`${bg} px-6 pb-12 pt-2 md:px-10 md:pb-16 md:pt-12 ${className}`.trim()}>
      {breadcrumbs?.length ? <Breadcrumbs items={breadcrumbs} /> : null}
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div className="max-w-3xl">
          <h1 className="font-serif text-h1-mobile md:text-h1-desktop">{title}</h1>
          {text ? (
            <p className="mt-4 max-w-xl font-mono text-h3-desktop">{text}</p>
          ) : null}
        </div>
        {selectOptions?.length ? (
          <Select options={selectOptions} placeholder={selectPlaceholder} />
        ) : null}
      </div>
    </section>
  );
}

export default PageHero;
