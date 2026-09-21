export interface ShareLinkItem {
  label: string;
  href: string;
}

export interface ShareLinksProps {
  title?: string;
  items?: ShareLinkItem[];
  className?: string;
}

/** Story share row (`.link`). */
export function ShareLinks({
  title = 'Share with help:',
  items = [
    { label: 'Facebook', href: '#' },
    { label: 'Twitter', href: '#' },
    { label: 'Telegram', href: '#' },
  ],
  className = '',
}: ShareLinksProps) {
  return (
    <div className={`font-mono text-text1-desktop ${className}`.trim()}>
      <p className="mb-4">{title}</p>
      <ul className="m-0 flex list-none flex-wrap gap-8 p-0">
        {items.map((item) => (
          <li key={item.label}>
            <a href={item.href} className="satr-hover-underline text-brand-black">
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ShareLinks;
