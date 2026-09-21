export interface SectionIntroProps {
  title: string;
  text?: string;
  link?: { label: string; href: string };
  /** Renders an `h1` instead of the default `h2` when this is the page title. */
  as?: 'h1' | 'h2';
}

/** The `.info` block that introduces a section and links to its full list. */
export function SectionIntro({ title, text, link, as: Tag = 'h2' }: SectionIntroProps) {
  return (
    <div className="info">
      <Tag className="info__title">{title}</Tag>
      {text && <p className="info__info-text">{text}</p>}
      {link && (
        <a href={link.href} className="info__link">
          <span className="hover hover--underline">{link.label}</span>
        </a>
      )}
    </div>
  );
}
