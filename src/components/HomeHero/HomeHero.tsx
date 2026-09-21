export interface HomeHeroLink {
  label: string;
  href: string;
}

export interface HomeHeroProps {
  text?: string;
  links?: HomeHeroLink[];
  className?: string;
}

/** Homepage hero — context line, wordmark, and route links. */
export function HomeHero({
  text = 'Aid to Ukrainian scientists who suffered from the war',
  links = [
    {
      label: 'Assistance in rebuilding scientific infrastructure',
      href: '/infrastructures',
    },
    {
      label: 'Find Ukrainian scientists for collaboration',
      href: '/experts',
    },
    { label: 'White Papers', href: '/whitepapers' },
  ],
  className = '',
}: HomeHeroProps) {
  return (
    <section
      className={`flex min-h-[100svh] flex-col bg-brand-white px-6 pt-28 pb-8 md:px-10 md:pt-20 md:pb-5 ${className}`.trim()}
    >
      <div>
        <p className="satr-hero-context max-w-3xl font-mono text-text1-mobile md:text-text1-desktop">
          {text}
        </p>
        <h1 className="mt-4 w-full font-serif leading-none" data-hero-wordmark>
          <span className="sr-only">Science At Risk</span>
          <img
            src="/assets/ui/wordmark-hero.svg"
            alt=""
            width={1360}
            height={130}
            className="block h-auto w-full max-w-[1360px]"
          />
        </h1>
        <ul className="satr-hero-section-rule m-0 list-none p-0">
          {links.map((link) => (
            <li
              key={link.href}
              className="flex max-w-[270px] gap-2 border-b-2 border-brand-black py-6 md:inline-flex md:w-[270px] md:border-b-0 md:border-r-2 md:pr-6 md:pl-0"
            >
              <span className="font-mono" aria-hidden>
                &gt;&gt;
              </span>
              <a
                href={link.href}
                className="satr-hover-underline font-mono text-text1-mobile text-brand-black md:text-text1-desktop"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default HomeHero;
