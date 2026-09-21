export interface QuoteProps {
  children: string;
  author?: string;
  role?: string;
  avatarSrc?: string;
  className?: string;
}

/**
 * Block quote with optional attribution — Figma Quote (292:1692).
 */
export function Quote({
  children,
  author,
  role,
  avatarSrc = '/assets/ui/quote-avatar.png',
  className = '',
}: QuoteProps) {
  const withAuthor = Boolean(author);

  return (
    <blockquote
      className={`m-0 flex gap-5 border-0 ${className}`.trim()}
      cite={author}
    >
      <div
        className={`w-1 shrink-0 bg-brand-black ${withAuthor ? 'self-stretch' : 'min-h-[252px]'}`}
        aria-hidden
      />
      <div className="flex max-w-[991px] flex-col gap-6">
        <p className="font-serif text-h2-desktop text-brand-black">{children}</p>
        {withAuthor ? (
          <footer className="flex items-center gap-4">
            <img
              src={avatarSrc}
              alt=""
              width={60}
              height={60}
              className="size-[60px] rounded-full object-cover"
            />
            <div>
              <cite className="not-italic font-ukraine text-text2-desktop font-light text-brand-black">
                {author}
              </cite>
              {role ? (
                <p className="mt-1 font-mono text-text1-desktop text-brand-black">{role}</p>
              ) : null}
            </div>
          </footer>
        ) : null}
      </div>
    </blockquote>
  );
}

export default Quote;
