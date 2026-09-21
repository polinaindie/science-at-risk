export interface StoryCardProps {
  title: string;
  text?: string;
  /** Rendered as-is; the site prints a short `dd.mm.yy` date. */
  date?: string;
  image?: string;
  href: string;
}

/** The `.story-card` used on the stories list and the home page. */
export function StoryCard({ title, text, date, image, href }: StoryCardProps) {
  return (
    <a href={href} className="story-card">
      <article className="story-card__wrapper">
        {image && (
          <header className="story-card__header">
            <picture className="story-card__img">
              <img src={image} alt={title} title={title} loading="lazy" />
            </picture>
          </header>
        )}
        <main className="story-card__main">
          <h2 className="story-card__title">
            <span className="hover hover--black">{title}</span>
          </h2>
          {text && <p className="story-card__text">{text}</p>}
        </main>
        {date && (
          <footer className="story-card__footer">
            <p className="story-card__data">{date}</p>
          </footer>
        )}
      </article>
    </a>
  );
}
