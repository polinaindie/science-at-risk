import type { HomeHeroV4FinalProps } from '@/sandbox/HomeHeroV4Final';
import { defaultHomeHeroV4FinalStories } from '@/sandbox/HomeHeroV4Final';
import type { InfrastructuresSectionProps, ResearchSectionProps } from '@/components/InfoSection';
import type { HomeScientistsBlockProps } from './HomeScientistsBlock';

export type HomeLocale = 'en' | 'uk';

const live = (path: string) => `${import.meta.env.BASE_URL}${path}`;

/** The Ukrainian words of the nine stories of the hero, in the same order as the English ones; the
 *  addresses and the covers are theirs. The story pages themselves are still English. */
const storiesUk: { title: string; description: string; imageAlt: string }[] = [
  {
    title: 'Розкриті могили. Як Львів повертає пам’ять про математичну школу',
    description: 'Карта поховань повертає пам’ять про забутих львівських математиків',
    imageAlt: 'Надгробок професора Володимира Левицького та Софії Левицької зі свічками',
  },
  {
    title: 'Удар надто близько. Що сталося з Інститутом біохімії після атаки дрона',
    description: 'Як Інститут біохімії відновлюється після атаки?',
    imageAlt: 'Чоловік стоїть у дверях пошкодженої кімнати з вирваною проводкою',
  },
  {
    title: '«Втрачені світи». Як російський удар зруйнував Чорнобильський музей у Києві',
    description: 'Ми побували в Чорнобильському музеї після російського удару, щоб побачити, як зберігають експонати та пам’ять',
    imageAlt: 'Музейна зала з розбитою стелею та уламками на підлозі',
  },
  {
    title: '«Сіятимемо пшеницю й вирощуватимемо хліб»: підводні камені гуманітарного розмінування в Україні',
    description: 'Як працює гуманітарне розмінування в Україні',
    imageAlt: 'Сапер обстежує поле металошукачем',
  },
  {
    title: 'Залишки вибухів на наших столах. Як війна впливає на довкілля і чому це важко досліджувати',
    description: 'Як Україна документує екологічні наслідки російської агресії',
    imageAlt: 'Двоє дослідників стоять поруч в офісі',
  },
  {
    title: 'Перегони з війною: як Леонід Марущак і волонтери рятують українську культурну спадщину',
    description: 'Як рятувати музейні колекції під час повномасштабного вторгнення Росії і хто це робить',
    imageAlt: 'Леонід Марущак у кепці під каштаном',
  },
  {
    title: 'Ближче до космосу: як Чорногірська обсерваторія відновлює роботу',
    description: 'Відродження обсерваторії на горі Піп Іван',
    imageAlt: 'Обсерваторія на засніженій вершині Піп Івана на заході сонця',
  },
  {
    title: 'Пам’ятаючи забуття. Як Одеський національний художній музей урятував колекцію від російської атаки',
    description: 'Як Одеський національний художній музей пережив російську атаку',
    imageAlt: 'Музейна зала з порожніми рамами на стінах і уламками у вітринах',
  },
  {
    title: 'Психоделічна терапія: кому вона допомагає і як робити це правильно',
    description: 'Що показують дослідження про психоделіки в лікуванні ПТСР і депресії',
    imageAlt: 'Ілюстрація солдата, чия голова — горщик з апельсиновими деревами',
  },
];

const heroEn: HomeHeroV4FinalProps = {
  locale: 'en',
  tagline: 'Centre of Excellence on Science at Risk, Ukraine',
  storiesLabel: 'Stories',
  readLabel: 'Read Story',
  otherLabel: 'Other Stories',
  backLabel: '< Previous',
  nextLabel: 'Next >',
};

const heroUk: HomeHeroV4FinalProps = {
  locale: 'uk',
  tagline: 'Центр досконалості «Наука в небезпеці», Україна',
  stories: defaultHomeHeroV4FinalStories.map((s, i) => ({ ...s, ...storiesUk[i] })),
  storiesLabel: 'Історії',
  readLabel: 'Читати історію',
  otherLabel: 'Інші історії',
  backLabel: '< Назад',
  nextLabel: 'Далі >',
};

const scientistsUk: HomeScientistsBlockProps = {
  title: 'Знайдіть партнерів в українській науці',
  scopeLabel: 'Шукати серед',
  popularLabel: 'Популярні галузі',
  modes: {
    scientists: {
      label: 'Науковці',
      popularLabel: 'Популярні запити',
      placeholder: 'Введіть наукову галузь або ім’я',
      buttonLabel: 'Знайти науковців',
      note: 'Позначте наукову галузь, що вас цікавить, — знайдіть і залучайте українських науковців до власних проєктів',
      noteLinkLabel: 'До повної бази науковців',
      noteHref: live('scientists.html'),
      tags: [
        { label: 'Викладання', count: 100, href: live('scientists.html?tag=teaching') },
        { label: 'Популяризація науки', count: 86, href: live('scientists.html?tag=science-popularization') },
        { label: 'Біологія', count: 57, href: live('scientists.html?tag=biology') },
        { label: 'Природничі науки', count: 55, href: live('scientists.html?tag=natural-sciences') },
        { label: 'Біохімія', count: 41, href: live('scientists.html?tag=biochemistry') },
      ],
      action: live('scientists.html'),
    },
    societies: {
      label: 'Товариства',
      placeholder: 'Введіть галузь або назву товариства',
      buttonLabel: 'Знайти товариства',
      note: 'Охопіть одразу цілу спільноту — наукові товариства об’єднують науковців однієї галузі',
      noteLinkLabel: 'До всіх наукових товариств',
      noteHref: live('societies.html'),
      tags: [
        { label: 'Медицина', count: 6, href: '/societies?tag=medicine' },
        { label: 'Психологія', count: 3, href: '/societies?tag=psychology' },
        { label: 'Екологія', count: 3, href: '/societies?tag=ecology' },
        { label: 'Економіка', count: 2, href: '/societies?tag=economics' },
        { label: 'Технології', count: 2, href: '/societies?tag=technology' },
      ],
      action: live('societies.html'),
    },
  },
};

const researchUk: ResearchSectionProps = {
  info: {
    title: 'Дослідження',
    text: 'Формалізований і систематизований досвід українських науковців зі збереження наукових праць, колекцій та установ',
    linkLabel: 'Усі дослідження',
    linkHref: live('research.html'),
  },
  papers: [
    {
      title: 'Вплив війни на різні категорії українських науковців',
      description: 'Дослідження: Олена Козак, Лідія Куземська, Євгенія Поліщук, Катерина Чуєва',
      href: live('research/impact-of-the-war-on-different-categories-of-ukrainian-scholars.html'),
      downloadHref: '/research/impact-of-the-war-on-different-categories-of-ukrainian-scholars.pdf',
      ctaLabel: 'Докладніше',
      downloadLabel: 'Завантажити',
    },
    {
      title:
        'Механізми підтримки науковців, які опинилися під загрозою: історичний розвиток, дані опитування та уроки політики з воєнної України',
      description: 'Дослідження: Ілона Свєженцева, Ігор Лиман',
      href: live('research/support-mechanisms-for-researchers-at-risk-historical-development-survey-evidence-and-policy-lessons-from-wartimeukraine.html'),
      downloadHref: '/research/support-mechanisms-for-researchers-at-risk.pdf',
      ctaLabel: 'Докладніше',
      downloadLabel: 'Завантажити',
    },
    {
      title:
        'Стратегічне визначення пріоритетів у дослідженнях під час кризи: як оптимізувати ухвалення рішень заради стійкості суспільства',
      description:
        'Дослідження: Павло Гольдін, Олексій Колежук, Віталій Омельяненко, Анна Воронцова, Світлана Тарасенко',
      href: live('research/strategic-priority-setting-in-research-in-times-of-crisis-how-to-optimise-decision-making-for-societal-resilience.html'),
      downloadHref: '/research/strategic-priority-setting-in-research.pdf',
      ctaLabel: 'Докладніше',
      downloadLabel: 'Завантажити',
    },
  ],
};

const infrastructureUk: InfrastructuresSectionProps = {
  info: {
    title: 'Відновлення інфраструктури',
    text: 'Наукова інфраструктура, пошкоджена під час війни',
    linkLabel: 'Усі проєкти',
    linkHref: live('infrastructures.html'),
  },
  cards: [
    {
      title: 'Інститут проблем кріобіології і кріомедицини',
      amount: '~ 500 000 грн',
      href: live('infrastructure/instytut-problem-kriobiolohii-i-kriomedytsyny.html'),
    },
    {
      title: 'Інститут проблем ендокринної патології імені В. Я. Данилевського НАМН України',
      amount: '~ 3 478 972 грн',
      href: live('infrastructure/instytut-problem-endokrynnoi-patolohii-im-vya-danylevskoho-namn-ukrainy.html'),
    },
    {
      title: 'Інститут проблем безпеки атомних електростанцій',
      amount: '~ 366 627 780 грн',
      href: live('infrastructure/instytut-problem-bezpeky-atomnykh-elektrostantsii.html'),
    },
  ].map((c) => ({
    ...c,
    showMetaLabels: true,
    ctaLabel: 'Докладніше',
    domainLabel: 'Галузь науки',
    amountLabel: 'Потрібна сума',
  })),
};

/** What the home page says in Ukrainian; English is the page's own defaults. */
export const homeCopyUk = {
  hero: heroUk,
  scientists: scientistsUk,
  research: researchUk,
  infrastructure: infrastructureUk,
};

export const homeHeroEn = heroEn;
