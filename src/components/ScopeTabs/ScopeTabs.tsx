import { useId } from 'react';

export interface ScopeTab<V extends string = string> {
  value: V;
  label: string;
  /** Set on every tab for the links form (each list is its own page); leave out for the radios form. */
  href?: string;
}

export interface ScopeTabsProps<V extends string = string> {
  tabs: ScopeTab<V>[];
  /** The open tab. */
  value: V;
  /** Radios form: called with the tab the reader picks. */
  onChange?: (value: V) => void;
  /** Spoken name of the group, e.g. "Search in". */
  label: string;
  className?: string;
}

/**
 * The Scientists | Societies switch, drawn once for every place that has it: two words in mono 20/28 (24/32 from
 * `md`), medium, the open one underlined 3px. On the home page it is two native radios (the block changes in place);
 * on the list pages it is two links (each list is its own page). The static pages draw the same thing from
 * `.scope-tabs` in `public/css/pages/listing-hero.css` — change both together.
 */
export function ScopeTabs<V extends string = string>({
  tabs,
  value,
  onChange,
  label,
  className = '',
}: ScopeTabsProps<V>) {
  const name = useId();
  const word =
    'block border-b-[3px] border-transparent pb-1 font-mono text-[1.25rem] font-medium leading-[1.75rem] text-brand-muted transition-colors md:text-[1.5rem] md:leading-[2rem]';

  if (tabs.every((tab) => tab.href)) {
    return (
      <nav aria-label={label} className={`flex gap-8 ${className}`.trim()}>
        {tabs.map((tab) => (
          <a
            key={tab.value}
            href={tab.href}
            aria-current={tab.value === value ? 'page' : undefined}
            className="group py-2 no-underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-black"
          >
            <span
              className={`${word} group-hover:border-brand-line-muted group-hover:text-brand-black group-aria-[current=page]:border-brand-black group-aria-[current=page]:text-brand-black`}
            >
              {tab.label}
            </span>
          </a>
        ))}
      </nav>
    );
  }

  return (
    <fieldset className={`m-0 flex gap-8 border-0 p-0 ${className}`.trim()}>
      <legend className="sr-only">{label}</legend>
      {tabs.map((tab) => (
        <label key={tab.value} className="group cursor-pointer py-2">
          <input
            type="radio"
            name={name}
            value={tab.value}
            checked={tab.value === value}
            onChange={() => onChange?.(tab.value)}
            className="peer sr-only"
          />
          <span
            className={`${word} group-hover:border-brand-line-muted group-hover:text-brand-black peer-checked:border-brand-black peer-checked:text-brand-black peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-4 peer-focus-visible:outline-brand-black`}
          >
            {tab.label}
          </span>
        </label>
      ))}
    </fieldset>
  );
}

export default ScopeTabs;
