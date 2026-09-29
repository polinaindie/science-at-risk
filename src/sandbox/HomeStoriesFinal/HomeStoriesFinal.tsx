import { useState } from 'react';
import { Wrapper } from '@/components/Layout';

export interface HomeStoriesFinalStory {
  title: string;
  href: string;
  imageSrc: string;
  imageAlt?: string;
  /** The line over the headline. Falls back to `categoryLabel`. */
  category?: string;
}

export interface HomeStoriesFinalProps {
  heading?: string;
  subtitle?: string;
  /** Shown three at a time; Back / Forward step through the sets and wrap. */
  stories?: HomeStoriesFinalStory[];
  /** Where "Other Stories" goes. */
  otherHref?: string;
  backLabel?: string;
  forwardLabel?: string;
  otherLabel?: string;
  /** Rubric for a story that carries no `category` of its own. */
  categoryLabel?: string;
  className?: string;
}

const PER_PAGE = 3;

const focusRing =
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white';

export const defaultHomeStoriesFinal: HomeStoriesFinalStory[] = [
  {
    title: 'Science in Chernobyl: occupation, recovery, and future challenges',
    href: '/story/science-in-chernobyl',
    imageSrc:
      'https://scienceatrisk.org/storage/lp/138/35bad048a94c9d66ebfeffe80817af579e4a2290.png',
  },
  {
    title: 'Stolen museum. Kherson',
    href: '/story/stolen-museum-kherson',
    imageSrc: 'https://scienceatrisk.org/storage/lp/13/1c9d9f1dc389e5e2561ede474b210a5b32d7ec01.png',
  },
  {
    title: "Test Tubes in the Count's Estate",
    href: '/story/test-tubes-in-the-counts-estate',
    imageSrc: 'https://scienceatrisk.org/storage/lp/131/9463255b2210d4cbe1c460b411ada8ec0bca54cd.png',
  },
  {
    title: 'What a Herbarium Loses When the Power Goes Out',
    href: '/story/herbarium',
    imageSrc: '/assets/mirror/herbarium.png',
  },
  {
    title: "Counting the Cost of Ukraine's Damaged Research Infrastructure",
    href: '/story/damaged-infrastructure',
    imageSrc: '/assets/mirror/infra.jpg',
  },
  {
    title: 'Keeping the Samples Cold Through a Blackout',
    href: '/story/cold-chain',
    imageSrc: '/assets/mirror/test-tubes.png',
  },
];

function PagerStep({
  label,
  arrow,
  onClick,
}: {
  label: string;
  arrow: 'prev' | 'next';
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex cursor-pointer items-center gap-[1ch] border-0 bg-transparent p-0 font-mono text-h3-mobile text-white md:text-h3-desktop ${focusRing}`}
    >
      {arrow === 'prev' ? <span aria-hidden>{'<'}</span> : null}
      <span className="satr-hover-underline satr-hover-underline--white">{label}</span>
      {arrow === 'next' ? <span aria-hidden>{'>'}</span> : null}
    </button>
  );
}

/**
 * The homepage's stories block — Figma frame "Stories-final" (node 94:10608).
 * Heading and subtitle, three stories across, then a full-width rule and the
 * Back / Other Stories / Forward row. Back and Forward page through the
 * stories three at a time and wrap, so both are always live.
 *
 * The frame carries a copy of the site header at its top; that is not drawn
 * here — the page's header lives in the hero. The block fills a screen and
 * sits its content on the bottom edge, as the frame does.
 */
export function HomeStoriesFinal({
  heading = 'Stories',
  subtitle = 'Documenting the impact of the war',
  stories = defaultHomeStoriesFinal,
  otherHref = '/stories',
  backLabel = 'Back',
  forwardLabel = 'Forward',
  otherLabel = 'Other Stories',
  categoryLabel = 'Stories',
  className = '',
}: HomeStoriesFinalProps) {
  const pageCount = Math.max(1, Math.ceil(stories.length / PER_PAGE));
  const [page, setPage] = useState(0);
  const current = Math.min(page, pageCount - 1);
  const step = (by: number) => setPage((current + by + pageCount) % pageCount);
  const visible = stories.slice(current * PER_PAGE, current * PER_PAGE + PER_PAGE);

  return (
    <section
      className={`satr-on-dark flex min-h-[100svh] flex-col justify-end bg-brand-black pt-[120px] pb-[40px] text-white ${className}`.trim()}
    >
      <Wrapper className="flex flex-col gap-[40px]">
        <div className="flex flex-col gap-[14px]">
          <h2 className="m-0 font-serif text-h1 font-normal text-white">{heading}</h2>
          {/* #a7a7a7 is the frame's own grey; no muted-on-dark token exists. */}
          <p className="m-0 font-mono text-text1-mobile text-[#a7a7a7] md:text-text1-desktop">
            {subtitle}
          </p>
        </div>

        <ul
          className="m-0 grid list-none grid-cols-1 gap-[36px] p-0 md:grid-cols-3"
          aria-live="polite"
        >
          {visible.map((story, i) => (
            <li key={`${current}-${story.href}-${i}`} className="flex flex-col">
              <a
                href={story.href}
                className={`group flex flex-col gap-[20px] text-white no-underline ${focusRing}`}
              >
                {/* 429 by 235 at 1440, the frame's crop. */}
                <span className="block overflow-hidden">
                  <img
                    src={story.imageSrc}
                    alt={story.imageAlt ?? ''}
                    loading="lazy"
                    className="block aspect-[429/235] w-full object-cover motion-safe:transition-transform motion-safe:duration-500 group-hover:scale-[1.02]"
                  />
                </span>
                <span className="flex flex-col gap-[20px]">
                  <span className="block font-mono text-text1-mobile md:text-text1-desktop">
                    {story.category ?? categoryLabel}
                  </span>
                  {/* 28/32 at -0.02em (-0.56px) in the frame; the h2 mobile step below md. */}
                  <span className="block font-serif text-h2-mobile md:text-[28px] md:leading-[32px] md:tracking-[-0.02em]">
                    <span className="satr-hover-underline satr-hover-underline--white group-hover:[background-size:100%_1px] group-focus-visible:[background-size:100%_1px]">
                      {story.title}
                    </span>
                  </span>
                </span>
              </a>
            </li>
          ))}
        </ul>

        <div className="flex flex-col gap-[36px]">
          <hr className="m-0 h-[2px] w-full border-0 bg-white" />
          <div className="grid grid-cols-3 items-center gap-4 font-mono text-h3-mobile text-white md:text-h3-desktop">
            <span className="justify-self-start">
              <PagerStep label={backLabel} arrow="prev" onClick={() => step(-1)} />
            </span>
            <a
              href={otherHref}
              className={`justify-self-center text-center text-white underline underline-offset-4 ${focusRing}`}
            >
              {otherLabel}
            </a>
            <span className="justify-self-end">
              <PagerStep label={forwardLabel} arrow="next" onClick={() => step(1)} />
            </span>
          </div>
        </div>
      </Wrapper>
    </section>
  );
}

export default HomeStoriesFinal;
