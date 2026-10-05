import { useState, type MouseEvent } from 'react';
import { Button } from '@/components/Button';
import { Wrapper } from '@/components/Layout';

export interface FilmstripScientist {
  name: string;
  nameUk?: string;
  /** Profile in the scientists database. */
  href: string;
}

export interface FilmstripStory {
  /** Reportage page. */
  href: string;
  /** `V` is 3:4, `H` is 3:2 — both are drawn at the same height. */
  orientation: 'V' | 'H';
  image: string;
  /** What the photograph shows: the object layer 1 names. */
  imageAlt: string;
  /** Place and year, instead of a publication date. */
  meta: string;
  metaUk?: string;
  /** Layer 1 — up to 30 characters, one concrete detail. */
  caption: string;
  captionUk?: string;
  /** Layer 2 — one sentence, up to 140 characters. */
  sentence: string;
  sentenceUk?: string;
  scientists: FilmstripScientist[];
}

export interface HomeHeroFilmstripProps {
  stories?: FilmstripStory[];
  locale?: 'en' | 'uk';
  /** Under the wordmark. The client supplies the final line. */
  descriptor?: string;
  searchLabel?: string;
  searchHref?: string;
  className?: string;
}

/* The five reportages with captions ready. The photographs are stand-ins from
   the mirror until the real ones, each showing the object its caption names,
   are cut in; profile links are placeholders until the database slugs are
   confirmed. */
export const filmstripStories: FilmstripStory[] = [
  {
    href: '/story/qr-code-on-banachs-grave',
    orientation: 'V',
    image: '/assets/mirror/expert.jpg',
    imageAlt: 'QR code on a headstone in Lychakiv Cemetery',
    meta: 'Lviv · Lychakiv Cemetery',
    metaUk: 'Львів · Личаківський цвинтар',
    caption: "A QR code on Banach's grave",
    captionUk: 'QR-код на могилі Банаха',
    sentence:
      'Two mathematicians are mapping the forgotten graves of the Lviv School — one lost headstone turned up under moss a century later.',
    sentenceUk:
      'Двоє математикинь наносять на мапу забуті могили Львівської школи — один втрачений надгробок знайшовся під мохом через сто років.',
    scientists: [
      { name: 'Iryna Banakh', nameUk: 'Ірина Банах', href: '/experts/iryna-banakh' },
      { name: 'Olena Hryniv', nameUk: 'Олена Гринів', href: '/experts/olena-hryniv' },
    ],
  },
  {
    href: '/story/national-heritage-in-test-tubes',
    orientation: 'V',
    image: '/assets/mirror/test-tubes.png',
    imageAlt: 'Test tubes with cell collections',
    meta: 'Kyiv · 2026',
    metaUk: 'Київ · 2026',
    caption: 'National heritage in test tubes',
    captionUk: 'Національне надбання в пробірках',
    sentence:
      'A drone strike hit the Palladin Institute of Biochemistry a week after Denys Kolybo became its director, destroying labs and cell collections.',
    sentenceUk:
      'Дрон влучив в Інститут біохімії ім. Палладіна за тиждень після того, як Денис Колибо очолив його, — зруйновано лабораторії та колекції клітин.',
    scientists: [{ name: 'Denys Kolybo', nameUk: 'Денис Колибо', href: '/experts/denys-kolybo' }],
  },
  {
    href: '/story/observatory-at-2028-m',
    orientation: 'H',
    image: '/assets/mirror/story.jpg',
    imageAlt: 'Chornohora Observatory on Pip Ivan',
    meta: 'Carpathians · Pip Ivan',
    metaUk: 'Карпати · Піп Іван',
    caption: 'An observatory at 2,028 m',
    captionUk: 'Обсерваторія на висоті 2028 м',
    sentence:
      'Opened in 1938 and abandoned within a year, the Chornohora Observatory is getting a telescope that can be run remotely.',
    sentenceUk:
      'Відкрита 1938 року й покинута за рік, обсерваторія на Чорногорі отримає телескоп, яким можна керувати дистанційно.',
    scientists: [
      { name: 'Volodymyr Troyanskyi', nameUk: 'Володимир Троянський', href: '/experts/volodymyr-troyanskyi' },
      { name: 'Ihor Tsependa', nameUk: 'Ігор Цепенда', href: '/experts/ihor-tsependa' },
    ],
  },
  {
    href: '/story/a-jar-with-no-dust-on-it',
    orientation: 'V',
    image: '/assets/mirror/stolen-museum.png',
    imageAlt: 'A jar in the Chornobyl Museum',
    meta: 'Kyiv · Podil',
    metaUk: 'Київ · Поділ',
    caption: 'A jar with no dust on it',
    captionUk: 'Глечик без пилу',
    sentence:
      "The Chornobyl Museum reopened for the disaster's 40th anniversary — less than a month later, a missile strike tore through it.",
    sentenceUk:
      'Чорнобильський музей відкрився до 40-річчя катастрофи — менш ніж за місяць ракетний удар пробив його наскрізь.',
    scientists: [
      { name: 'Vitalina Martynovska', nameUk: 'Віталіна Мартиновська', href: '/experts/vitalina-martynovska' },
    ],
  },
  {
    href: '/story/17000-km-on-dry-ice',
    orientation: 'H',
    image: '/assets/mirror/herbarium.png',
    imageAlt: 'Antarctic samples packed in dry ice',
    meta: 'Kyiv · Southern Ocean',
    metaUk: 'Київ · Південний океан',
    caption: '17,000 km on dry ice',
    captionUk: '17 000 км на сухому льоду',
    sentence:
      "Samples from Antarctica reach a new Kyiv lab via Chile and Warsaw, where Maria Pavlovska's team reads their DNA.",
    sentenceUk:
      'Зразки з Антарктики потрапляють до нової київської лабораторії через Чилі та Варшаву — там команда Марії Павловської читає їхню ДНК.',
    scientists: [
      { name: 'Maria Pavlovska', nameUk: 'Марія Павловська', href: '/experts/maria-pavlovska' },
    ],
  },
];

const copy = {
  en: {
    strip: 'Featured reportages',
    reportage: 'Reportage →',
    by: 'Scientists in this story',
    search: 'Search scientists',
  },
  uk: {
    strip: 'Репортажі',
    reportage: 'Репортаж →',
    by: 'Науковці з цієї історії',
    search: 'Пошук науковців',
  },
} as const;

/** Where the client said "the descriptor is theirs to give" — this is a
 *  placeholder and reads as one. */
const defaultDescriptor = 'Center of Excellence';

const focusRing =
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-black';

/**
 * Homepage hero, direction Г2 — after secondstory.info: a strip of photographs
 * at one height and mixed proportions (3:4 and 3:2), the wordmark large above
 * it, a descriptor line, and a search button.
 *
 * Three layers of caption. Layer 1 sits under each photograph and is always
 * there. Hovering or focusing a photograph makes layer 2 — one sentence, the
 * scientists with links to their profiles, and "Reportage →" — replace the
 * label under the strip. Layer 3 is the click through to the reportage.
 * On a touch screen the first photograph is the active one; a tap on another
 * only activates it, and the label's link is what opens the reportage.
 *
 * The strip is desaturated and only the active photograph is in colour.
 */
export function HomeHeroFilmstrip({
  stories = filmstripStories,
  locale = 'en',
  descriptor = defaultDescriptor,
  searchLabel,
  searchHref = '/experts',
  className = '',
}: HomeHeroFilmstripProps) {
  const [active, setActive] = useState(0);
  const t = copy[locale];
  const isUk = locale === 'uk';
  if (!stories.length) return null;
  const current = stories[active];

  /** No hover on the device: the first tap activates, it does not navigate. */
  const onTileClick = (event: MouseEvent<HTMLAnchorElement>, index: number) => {
    const noHover = window.matchMedia('(hover: none)').matches;
    if (noHover && index !== active) {
      event.preventDefault();
      setActive(index);
    }
  };

  /* A vertical photograph is 3 units of width to 4 of height, a horizontal 3
     to 2. Weighting each tile by its width at unit height lets one row of
     flex items share the width and land on a common height with no
     arithmetic in the layout. */
  const weight = (o: FilmstripStory['orientation']) => (o === 'V' ? 0.75 : 1.5);

  return (
    <section
      className={`bg-brand-white pt-[64px] pb-10 lg:pt-[100px] lg:pb-14 ${className}`.trim()}
      aria-label={t.strip}
    >
      <Wrapper>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between lg:gap-10">
          <div className="min-w-0 lg:flex-1">
            <h1 className="font-serif leading-none" data-hero-wordmark>
              <span className="sr-only">Science At Risk</span>
              <img
                src="/assets/ui/wordmark-hero.svg"
                alt=""
                width={1360}
                height={130}
                className="block h-auto w-full"
              />
            </h1>
            <p className="mt-4 font-mono text-h3-mobile text-brand-black md:text-h3-desktop">
              {descriptor}
            </p>
          </div>
          <Button
            type="button"
            variant="black"
            className="self-start lg:shrink-0 lg:self-end lg:px-[36px]"
            onClick={() => window.location.assign(searchHref)}
          >
            {searchLabel ?? t.search}
          </Button>
        </div>

        <ul
          className="mt-8 flex list-none gap-2 overflow-x-auto p-0 snap-x snap-mandatory lg:mt-12 lg:gap-4 lg:overflow-visible [&::-webkit-scrollbar]:hidden"
          style={{ scrollbarWidth: 'none' }}
        >
          {stories.map((story, index) => {
            const isActive = index === active;
            const caption = (isUk && story.captionUk) || story.caption;
            const w = weight(story.orientation);
            return (
              <li
                key={story.href}
                className="min-w-0 snap-start"
                style={{
                  /* Below `lg` the strip scrolls at a fixed 220px height; from
                     `lg` the tiles share the row's width by their weights. */
                  flex: `${w} 1 0`,
                  minWidth: `calc(220px * ${w})`,
                }}
              >
                <a
                  href={story.href}
                  onMouseEnter={() => setActive(index)}
                  onFocus={() => setActive(index)}
                  onClick={(e) => onTileClick(e, index)}
                  aria-current={isActive ? 'true' : undefined}
                  className={`group block ${focusRing}`}
                >
                  <div
                    className={`relative w-full overflow-hidden bg-brand-line-muted ${
                      story.orientation === 'V' ? 'aspect-[3/4]' : 'aspect-[3/2]'
                    }`}
                    /* Same height across a row of different widths: the
                       vertical tile is half the width of the horizontal one,
                       so 3:4 and 3:2 come out level. */
                    style={{ aspectRatio: story.orientation === 'V' ? '3 / 4' : '3 / 2' }}
                  >
                    <img
                      src={story.image}
                      alt={story.imageAlt}
                      loading={index < 3 ? 'eager' : 'lazy'}
                      className={`absolute inset-0 size-full object-cover transition-[filter] duration-500 motion-reduce:transition-none ${
                        isActive ? 'grayscale-0' : 'grayscale'
                      }`}
                    />
                  </div>
                  <p className="mt-3 flex gap-2 font-mono text-text1-mobile text-brand-black md:text-[14px] md:leading-[20px]">
                    <span aria-hidden className="text-brand-muted">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span className="min-h-[36px] md:min-h-[40px]">{caption}</span>
                  </p>
                </a>
              </li>
            );
          })}
        </ul>

        {/* Layer 2 — replaces itself as the active photograph changes. */}
        <div
          className="mt-6 grid gap-y-3 border-t-2 border-brand-black pt-5 md:grid-cols-3 md:gap-x-8"
          aria-live="polite"
        >
          <p className="font-mono text-breadcrumbs text-brand-muted md:pt-1">
            {(isUk && current.metaUk) || current.meta}
          </p>
          <p className="font-ukraine text-text2-mobile font-light text-brand-black md:col-span-2 md:text-text2-desktop">
            {(isUk && current.sentenceUk) || current.sentence}
          </p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-1 md:col-span-2 md:col-start-2">
            <span className="sr-only">{t.by}</span>
            {current.scientists.map((s) => (
              <a
                key={s.href}
                href={s.href}
                className={`satr-link ${focusRing}`}
              >
                {(isUk && s.nameUk) || s.name}
              </a>
            ))}
            <a
              href={current.href}
              className={`ml-auto inline-flex min-h-11 items-center font-mono text-h3-mobile text-brand-black no-underline md:text-h3-desktop ${focusRing}`}
            >
              <span className="satr-hover-underline">{t.reportage}</span>
            </a>
          </div>
        </div>
      </Wrapper>
    </section>
  );
}

export default HomeHeroFilmstrip;
