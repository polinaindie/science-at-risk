import { Button } from '@/components/Button';

export interface StoriesSlideProps {
  title: string;
  text?: string;
  suptitle?: string;
  href?: string;
  imageSrc?: string;
  imageAlt?: string;
  ctaLabel?: string;
  /** Footer link to the full stories listing. */
  otherLabel?: string;
  otherHref?: string;
  prevLabel?: string;
  nextLabel?: string;
  /** Height utility — lower it when the slide sits under fixed page chrome. */
  heightClass?: string;
  onPrev?: () => void;
  onNext?: () => void;
  className?: string;
}

/** Homepage stories slide (`.stories__slide` + `.stories__navigation`). */
export function StoriesSlide({
  title,
  text,
  suptitle = 'Stories',
  href = '#',
  imageSrc = '/assets/mirror/story.jpg',
  imageAlt,
  ctaLabel = 'Read',
  otherLabel = 'Other stories',
  otherHref = '/stories',
  prevLabel = '< Back',
  nextLabel = 'Next >',
  heightClass = 'min-h-[100svh]',
  onPrev,
  onNext,
  className = '',
}: StoriesSlideProps) {
  const alt = imageAlt ?? title;
  const navButton =
    'min-h-11 border-0 bg-transparent p-0 font-mono text-h3-mobile text-white md:text-h3-desktop focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white';

  return (
    <section
      className={`flex ${heightClass} flex-col justify-end bg-brand-black text-white ${className}`.trim()}
    >
      <div className="mx-4 md:mx-9 xl:mr-0">
        <div className="md:flex md:items-end">
          <div className="relative block w-full max-w-[800px] pt-[64%] md:max-w-[800px] md:pt-[38.9%] xl:max-w-[900px]">
            <img src={imageSrc} alt={alt} className="absolute inset-0 size-full object-cover" />
          </div>
          <div className="mt-4 md:ml-7 md:mt-0 md:max-w-[302px] lg:ml-5 xl:ml-[1.89rem] xl:max-w-[326px] 2xl:max-w-[414px]">
            <p className="mb-1 font-mono text-text1-mobile text-white md:text-text1-desktop">{suptitle}</p>
            <h2 className="mb-3 font-serif text-h2-mobile text-white md:mb-5 md:text-h2-desktop lg:mb-4">
              <span className="satr-hover-underline satr-hover-underline--white">{title}</span>
            </h2>
            {text ? (
              <p className="mb-7 font-ukraine text-text2-mobile font-light text-white md:mb-8 md:text-text2-desktop lg:mb-7">
                {text}
              </p>
            ) : null}
            <div className="relative w-full">
              <a href={href} aria-label={`${ctaLabel}: ${title}`}>
                <Button variant="white">{ctaLabel}</Button>
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-4 mt-10 pb-10 md:mx-9 md:mt-12 lg:mt-10 xl:mt-7 2xl:mt-[4.72rem]">
        <nav
          className="flex items-center justify-between border-b-2 border-white pb-4 md:pb-4"
          aria-label="Stories carousel"
        >
          <button type="button" className={navButton} onClick={onPrev}>
            {prevLabel}
          </button>
          <a
            href={otherHref}
            className="satr-hover-underline satr-hover-underline--white font-mono text-h3-mobile text-white md:text-h3-desktop"
          >
            {otherLabel}
          </a>
          <button type="button" className={navButton} onClick={onNext}>
            {nextLabel}
          </button>
        </nav>
      </div>
    </section>
  );
}

export default StoriesSlide;
