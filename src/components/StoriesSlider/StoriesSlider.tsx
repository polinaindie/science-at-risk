import { useEffect, useId, useMemo, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation } from 'swiper/modules';
import type { Swiper as SwiperInstance } from 'swiper';
import 'swiper/css';
import './StoriesSlider.css';
import { Button } from '../Button/Button';
import type { StoryTag } from './storyTags';

/** One slide per view, and 1.05 from 1280px so the next one peeks in — the
 *  site's own breakpoints. Hoisted: `swiper/react` compares props by identity
 *  and a fresh object each render makes it update in a loop. */
const BREAKPOINTS = {
  320: { slidesPerView: 1 },
  1280: { slidesPerView: 1.05 },
};

const MODULES = [Navigation, Autoplay];

/** How long a slide holds before the slider moves on, in milliseconds. */
const AUTOPLAY_DELAY = 6000;

export interface StorySlide {
  title: string;
  text?: string;
  image: string;
  href: string;
  /** Kicker above the title; the site prints "Stories" on every slide. */
  suptitle?: string;
  /** Themes this story is filed under — see `STORY_TAGS`. */
  tags?: StoryTag[];
}

export interface StoriesSliderProps {
  slides: StorySlide[];
  readLabel?: string;
  /** Prefix in front of a story's themes, the way a paper labels its keywords. */
  tagsLabel?: string;
  prevLabel?: string;
  nextLabel?: string;
  otherLink?: { label: string; href: string };
  /**
   * Advance on a timer, with the rule under the controls filling up as the
   * slide's time runs out. Off for a reader who asks for reduced motion, and
   * paused whenever the slider is off screen or under the pointer.
   */
  autoplay?: boolean;
  /** Milliseconds a slide holds before the slider moves on. */
  autoplayDelay?: number;
}

/**
 * The `.stories` section from the home page — a full-bleed Swiper of story
 * slides on black, with Back / Next and a link to the full list.
 *
 * Configured exactly as the site configures it: speed 1500, looping, and one
 * slide per view until 1280px, where it shows 1.05 so the next slide peeks in.
 * The site also passes `calculateHeight`, which is not a Swiper option and does
 * nothing, so it is left out rather than copied.
 *
 * Two deliberate departures from the site:
 *
 * - The site runs Swiper 8.4.7, which falls inside a critical
 *   prototype-pollution advisory (GHSA-hmx5-qpq5-p643, fixed in 12.1.2). This
 *   uses a patched release; the options above are identical between them.
 * - It uses `swiper/react` rather than driving the core API from an effect.
 *   From Swiper 9 on, loop mode reorders the real slide nodes instead of
 *   cloning them, so the core API and React end up fighting over the same DOM
 *   and the page locks up. The React build is built to cooperate.
 *
 * Navigation is bound to this instance's own buttons by id, so several sliders
 * can share a page — the site's global `.prev` / `.next` selectors could not.
 */
export function StoriesSlider({
  slides,
  readLabel = 'Read',
  tagsLabel = 'Keywords',
  prevLabel = 'Back',
  nextLabel = 'Next',
  otherLink,
  autoplay = true,
  autoplayDelay = AUTOPLAY_DELAY,
}: StoriesSliderProps) {
  // Swiper resolves these selectors itself, at init and on every update. Refs
  // would be null on the first render, and feeding Swiper a null navigation
  // element makes it retry on each update and lock the page up.
  const id = useId().replace(/[^a-zA-Z0-9]/g, '');
  const prevId = `stories-prev-${id}`;
  const nextId = `stories-next-${id}`;
  const navigation = useMemo(() => ({ prevEl: `#${prevId}`, nextEl: `#${nextId}` }), [prevId, nextId]);

  const sectionRef = useRef<HTMLElement>(null);
  const progressRef = useRef<HTMLSpanElement>(null);
  const swiperRef = useRef<SwiperInstance | null>(null);

  const calm =
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const running = autoplay && !calm;

  const autoplayOptions = useMemo(
    () =>
      running
        ? { delay: autoplayDelay, disableOnInteraction: false, pauseOnMouseEnter: true }
        : (false as const),
    [running, autoplayDelay],
  );

  // On the home page the slider spends most of its life parked off screen in
  // the section deck. Running the timer there would mean coming back to a
  // slide the reader never saw, so it only counts while the section is in view.
  useEffect(() => {
    const section = sectionRef.current;
    if (!running || !section) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        const swiper = swiperRef.current?.autoplay;
        if (!swiper) return;
        if (entry.isIntersecting) swiper.start();
        else swiper.stop();
      },
      { threshold: 0.2 },
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, [running]);

  return (
    <section className="stories fullSection" ref={sectionRef}>
      <Swiper
        className="stories__top my-slider"
        wrapperClass="swiper-wrapper"
        modules={MODULES}
        speed={1500}
        loop
        breakpoints={BREAKPOINTS}
        navigation={navigation}
        autoplay={autoplayOptions}
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
        }}
        // Swiper counts down, so the rule fills as `progress` falls to 0. The
        // width is written straight to the element: this fires every frame,
        // and a re-render per frame is a re-render of every slide.
        onAutoplayTimeLeft={(_swiper, _time, progress) => {
          if (progressRef.current) {
            progressRef.current.style.transform = `scaleX(${1 - progress})`;
          }
        }}
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.href + slide.title}>
            <div className="stories__slide">
              <picture className="stories__img">
                <img src={slide.image} alt="" loading="lazy" />
                <div className="stories__bg-img" />
              </picture>
              <div className="stories__info">
                {slide.suptitle && <p className="stories__suptitle">{slide.suptitle}</p>}
                <h2 className="stories__title">
                  <span className="hover hover--white">{slide.title}</span>
                </h2>
                {slide.text && <p className="stories__text">{slide.text}</p>}
                {slide.tags && slide.tags.length > 0 && (
                  <p className="stories__tags">
                    <span className="stories__tags-label">{tagsLabel}:</span>{' '}
                    {slide.tags.map((tag, i) => (
                      <span key={tag}>
                        {i > 0 && ', '}
                        <span className="stories__tag">{tag}</span>
                      </span>
                    ))}
                  </p>
                )}
                <Button className="stories__btn" variant="white" href={slide.href} overlayLink>
                  {readLabel}
                </Button>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="wrapper">
        <div className="stories__wrapper">
          <div className={`stories__navigation${running ? ' stories__navigation--timed' : ''}`}>
            <button id={prevId} className="prev stories__nav-btn stories__nav-btn--left" type="button">
              &lt;<span className="hover hover--white">{prevLabel}</span>
            </button>
            <button id={nextId} className="next stories__nav-btn stories__nav-btn--right" type="button">
              <span className="hover hover--white">{nextLabel}</span> &gt;
            </button>
            {otherLink && (
              <span>
                <a href={otherLink.href} className="stories__other hover hover--underline hover--white">
                  {otherLink.label}
                </a>
              </span>
            )}
            {running && <span className="stories__progress" ref={progressRef} aria-hidden="true" />}
          </div>
        </div>
      </div>
    </section>
  );
}
