import { useId, useMemo } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import './StoriesSlider.css';
import { Button } from '../Button/Button';

/** One slide per view, and 1.05 from 1280px so the next one peeks in — the
 *  site's own breakpoints. Hoisted: `swiper/react` compares props by identity
 *  and a fresh object each render makes it update in a loop. */
const BREAKPOINTS = {
  320: { slidesPerView: 1 },
  1280: { slidesPerView: 1.05 },
};

const MODULES = [Navigation];

export interface StorySlide {
  title: string;
  text?: string;
  image: string;
  href: string;
  /** Kicker above the title; the site prints "Stories" on every slide. */
  suptitle?: string;
}

export interface StoriesSliderProps {
  slides: StorySlide[];
  readLabel?: string;
  prevLabel?: string;
  nextLabel?: string;
  otherLink?: { label: string; href: string };
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
  prevLabel = 'Back',
  nextLabel = 'Next',
  otherLink,
}: StoriesSliderProps) {
  // Swiper resolves these selectors itself, at init and on every update. Refs
  // would be null on the first render, and feeding Swiper a null navigation
  // element makes it retry on each update and lock the page up.
  const id = useId().replace(/[^a-zA-Z0-9]/g, '');
  const prevId = `stories-prev-${id}`;
  const nextId = `stories-next-${id}`;
  const navigation = useMemo(() => ({ prevEl: `#${prevId}`, nextEl: `#${nextId}` }), [prevId, nextId]);

  return (
    <section className="stories fullSection">
      <Swiper
        className="stories__top my-slider"
        wrapperClass="swiper-wrapper"
        modules={MODULES}
        speed={1500}
        loop
        breakpoints={BREAKPOINTS}
        navigation={navigation}
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
          <div className="stories__navigation">
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
          </div>
        </div>
      </div>
    </section>
  );
}
