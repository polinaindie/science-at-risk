import { Button } from '@/components/Button';

export interface StoryAsideItem {
  label: string;
  value: string;
}

export interface StoryAsideProps {
  items?: StoryAsideItem[];
  note?: string;
  ctaLabel?: string;
  ctaHref?: string;
  className?: string;
}

/** Story / about meta aside (`.storyAside`). */
export function StoryAside({
  items = [
    { label: 'Author', value: 'Science at Risk' },
    { label: 'Date', value: '12.11.2023' },
  ],
  note,
  ctaLabel,
  ctaHref = '#',
  className = '',
}: StoryAsideProps) {
  return (
    <aside className={`flex flex-col gap-6 ${className}`.trim()}>
      {items.map((item) => (
        <div key={item.label}>
          <p className="font-mono text-breadcrumbs text-brand-black">{item.label}</p>
          <p className="mt-1 font-ukraine text-text2-desktop font-light">{item.value}</p>
        </div>
      ))}
      {note ? (
        <p className="font-ukraine text-text2-desktop font-light text-brand-muted">{note}</p>
      ) : null}
      {ctaLabel ? (
        <a href={ctaHref}>
          <Button variant="bordered">{ctaLabel}</Button>
        </a>
      ) : null}
    </aside>
  );
}

export default StoryAside;
