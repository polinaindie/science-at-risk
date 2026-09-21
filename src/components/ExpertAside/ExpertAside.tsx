export interface ExpertAsideLink {
  label: string;
  href: string;
}

export interface ExpertAsideProps {
  name: string;
  imageSrc?: string;
  imageAlt?: string;
  contacts?: ExpertAsideLink[];
  languages?: string;
  className?: string;
}

/** Expert profile sticky aside (`.aside`). */
export function ExpertAside({
  name,
  imageSrc = '/assets/mirror/expert.jpg',
  imageAlt = '',
  contacts = [],
  languages,
  className = '',
}: ExpertAsideProps) {
  return (
    <aside className={`max-w-[260px] ${className}`.trim()}>
      <div className="relative w-full overflow-hidden" style={{ paddingTop: '100%' }}>
        <img src={imageSrc} alt={imageAlt} className="absolute inset-0 size-full object-cover" />
      </div>
      <h2 className="mt-4 font-mono text-h3-mobile md:text-[13px] md:leading-[18px]">{name}</h2>
      {contacts.length ? (
        <ul className="mt-4 m-0 list-none space-y-2 p-0">
          {contacts.map((c) => (
            <li key={c.href}>
              <a href={c.href} className="satr-hover-underline font-mono text-breadcrumbs">
                {c.label}
              </a>
            </li>
          ))}
        </ul>
      ) : null}
      {languages ? (
        <p className="mt-4 font-mono text-breadcrumbs text-brand-muted">{languages}</p>
      ) : null}
    </aside>
  );
}

export default ExpertAside;
