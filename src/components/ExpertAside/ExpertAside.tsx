export interface ExpertAsideProps {
  photo?: string;
  name?: string;
  contactLabel?: string;
  /** Languages the scientist works in, already joined into one line. */
  languagesTitle?: string;
  languages?: string;
  links?: { label: string; href: string }[];
  onContact?: () => void;
}

/** The `.aside` column on an expert profile: photo, contact button, links. */
export function ExpertAside({
  photo,
  name = '',
  contactLabel = 'Get in touch',
  languagesTitle,
  languages,
  links = [],
  onContact,
}: ExpertAsideProps) {
  return (
    <aside className="aside">
      {photo && (
        <picture className="aside__img">
          <img src={photo} alt={name} loading="lazy" />
        </picture>
      )}
      <button className="aside__contact btn btn--black" type="button" onClick={onContact}>
        {contactLabel}
      </button>
      {languagesTitle && <h4 className="aside__title">{languagesTitle}</h4>}
      {languages && <p className="aside__lang-text">{languages}</p>}
      {links.length > 0 && (
        <ul className="aside__links">
          {links.map((link) => (
            <li className="aside__links-item" key={link.label}>
              <a
                target="_blank"
                className="aside__item-link hover hover--underline"
                href={link.href}
                rel="nofollow"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      )}
    </aside>
  );
}
