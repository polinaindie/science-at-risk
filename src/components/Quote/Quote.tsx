export interface QuoteProps {
  /** Speaker name, printed above the quote on the site. */
  name: string;
  text: string;
  position?: string;
}

/** The `.quote` block used inside stories. */
export function Quote({ name, text, position }: QuoteProps) {
  return (
    <section className="quote">
      <h2 className="quote__title">{name}</h2>
      <div className="quote__author">
        <div className="quote__info">
          <h4 className="quote__name">{text}</h4>
          {position && <p className="quote__position">{position}</p>}
        </div>
      </div>
    </section>
  );
}
