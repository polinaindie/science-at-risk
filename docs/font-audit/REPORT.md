# Шрифти сайту: що є зараз і як привести до спільного знаменника

Дані: Playwright-обхід `http://localhost:5174/`, 531 сторінок, два вʼюпорти (1440×900 і 390×844). Дата: 2026-11-20.
Скрипт: `scripts/font-audit.mjs` (збір), `scripts/font-audit-report.py` (цей документ). Повні дані: `docs/font-audit/raw-*.json`, таблиця `docs/font-audit/entities.csv`.

**Шрифтова сутність** = комбінація: гарнітура + розмір + насиченість + нахил + інтерліньяж + трекінг + регістр. Одна й та сама роль (скажімо, «підпис у картці») на різних сторінках часто виходить різною сутністю.

## 1. Підсумок

| Що міряли | Десктоп 1440 | Телефон 390 |
|---|---|---|
| Унікальних розмірів шрифту (px) | **51** | **38** |
| Унікальних сутностей (гарнітура+розмір+вага+lh+трекінг+регістр) | **139** | 126 |
| Унікальних значень line-height | 87 | n/a |
| Унікальних значень letter-spacing (в em) | 7 | n/a |

Гарнітури за обсягом тексту: IBM Plex Mono 88.1%, Noto Serif 9.7%, monospace 2.2%, arial 0.0%. Ваги: 400 (99.1%), 300 (0.5%), 700 (0.4%), 500 (0.0%).

Гарнітур усього дві (IBM Plex Mono і Noto Serif), це добре і так і лишати. Проблема не в гарнітурах, а в **розмірах, інтерліньяжі, трекінгу і двох кореневих розмірах**.

### Головні знахідки

1. **Одна роль, два розміри.** `html` скрізь 18px (`satr-base.css`: `font-size: 112.5%`), але шкала написана під 16px. Fluid-кроки (`--step-*`, `text-heading-*`) на React-сторінках (головна, кабінет) рендеряться на 12,5% більшими, ніж на статичних, а фіксовані px-значення у статичних CSS не масштабуються. Тому те саме місце виходить: 16 ↔ 18, 18 ↔ 20,25, 22 ↔ 24,75, 28 ↔ 31,5, 36 ↔ 40,5, 48 ↔ 54, 72 ↔ 81. Звідти більшість «дивних» чисел (20,25; 24,75; 31,5; 40,5; 54) і це open question 36 у `public/handoff/open-questions.md`. Документація каже, що профілі науковця на 16px root (питання 40), але виміряно: `html` 18px і там теж, а 16px там це px-літерали.
2. **Дробові розміри з fluid-кліпів.** 28 з 51 розмірів не цілі (14,9994; 22,9; 34,35; 36,64…). Користувач бачить «приблизно 15», а в стилях сидить 14,9994. Сторінки статей мають свою власну шкалу (`18.32`, `22.9`, `34.35`, `36.64`, `28.625`), якої немає ніде більше.
3. **Один розмір, різний міжряддя.** Наприклад 18px зустрічається з line-height 18, 25,9999, 26, 27, 27,9, 28, 28,0008, 29,25, 31,5. 16px: 0, 21,9996, 22, 23,2, 24, 24,8, 26, 28. Різниця невидима по одній, але разом дає «нерівну» сторінку.
4. **Трекінг:** `-0.03em` на «ui», `normal` на тексті, але є ui-елементи з `normal` (`story-card__type`, `exp-place`, `exp-pos`, `project-card__year`), `-0.01em` (підкреслені лінки на головній і в кабінеті), `-0.013em`, `-0.02em`, `-0.027em`, `-0.034em`.
5. **Ваги:** 400 домінує, 300 на лейблах полів і частині тексту, 500 тільки на табах «Scientists/Societies», 700 на `strong/b`, на «Мій профіль» в кабінеті і ще кількох місцях. Всі 4 ваги Plex Mono підвантажуються, тобто 500 і 700 коштують трафіку заради кількох слів.
6. **Сторонні шрифти:** `arial` («Made with fullPage.js» на `/uk.html`), `monospace` (код у hand-off). На продакшні сайті це лише fullPage.js.
7. **Назви ролей з документації не збігаються з тим, що в рендері.** `typography.md` каже, що `text` це Light 300. Фактично абзаци статей і профілів рендеряться вагою 400, а 300 стоїть лише на лейблах полів і кількох інформаційних текстах.

## 2. Пропозиція: одна шкала

Принцип: **роль визначає розмір, сторінка роль не змінює.** Токенів стає менше, ніж зараз розмірів, і кожен має одну висоту рядка. Шкала описана в px (варіант з пункту 2.1).

### 2.1. Спершу: одна база

Рішення потрібне одне: або шкала = «design numbers» (16-базова, те, що зараз рендерять статичні сторінки), або шкала = те, що рендерить React (×1,125). Рекомендація: **design numbers**, бо за ними вже зроблено 531 статичну сторінку, hand-off і Hugo-партіали, а React-частина єдина, де виходить більше. Практично: задати токени в px (або rem від 16px) і не залежати від `html { font-size: 112.5% }`; React-сторінки зменшаться на ~11%. Нижче шкала дана в цих числах.

### 2.2. Шкала

| Токен | Гарнітура | Розмір / міжряддя | Трекінг | Вага | Для чого |
|---|---|---|---|---|---|
| `ui-s` | Mono | 14 / 20 | -0.03em | 400 | хлібні крихти, дата, тип у картці, лічильники, підписи під фото, виноски |
| `ui-m` | Mono | 16 / 24 | -0.03em | 400 | теги, чипи, рядки метаданих (місце, посада, рік), мініатюри в асайді, посилання в асайді |
| `ui-l` | Mono | 18 / 28 | -0.03em | 400 | кнопки, навігація, лейбли форм, підзаголовки карток, `h4`-підписи |
| `text-l` | Mono | 22 / 34 | 0 | 400 (300 лише якщо дозавантажити/вирішити питання 26) | основний текст: стаття, профіль, лід на сторінках; підпис «Want to help?» |
| `ui-xl` | Mono | 28 / 36 | -0.03em | 400 | таби «Scientists/Societies», великі підкреслені лінки на головній (`Усі проєкти`) |
| `h3` | Serif | 28 / 36 | -0.02em | 400 | імена в картках, назви картки (історія, стаття, проєкт), суми в `infra-plate` |
| `h2` | Serif | 36 / 44 | -0.02em | 400 | секція сторінки, лід історії (зараз 34,35/53), заголовок цитати |
| `h1-entity` | Serif | 48 / 56 | -0.02em | 400 | заголовок профілю, інфраструктури, логін, кабінет |
| `h1` | Serif | 72 / 76 (fluid 32–72) | -0.02em | 400 | заголовок сторінки / hero, «Want to help?» |

Разом **9 токенів** замість 51 різних розмірів, 87 значень line-height і 7 значень трекінгу (десктоп).

Правила, які закривають решту розбіжностей:

- **Один токен = один line-height.** Місце, де потрібен «щільніший» рядок, береться з іншого токена, а не з окремого значення (при розмірі 16 є `.exp-year` з lh 22 і `project-card__year` з lh 28: висоту блока підганяли міжряддям).
- **Трекінг прив’язаний до гарнітури:** Mono-ui `-0.03em`, Mono-text `0`, Serif `-0.02em`. Ніяких `-0.01em`, `-0.013em`, `-0.027em`, `-0.034em`.
- **Ваги:** 400 скрізь, 700 лише в `strong/b` в основному тексті. 500 (таби) і 300 (лейбли полів) прибрати або свідомо залишити одну з них. Тоді `@font-face` Mono скорочується до 400 і 700 (мінус два файли на кожне відкриття сторінки).
- **Цілі px.** Fluid-кліпи (`clamp`) тільки для `h1`/`h1-entity` і `h2`; тіло тексту фіксоване. Дробові розміри 14,9994 / 22,9 / 34,35 / 36,64 / 18,32 зникають.
- **Сторінки статей не мають своєї шкали.** `.paragraph` 22,9 → `text-l`; `.story-lead` 34,35 → `h2`; `.heading--h2` 36,64 → `h2`; `.heading--h3` 28,625 → `h3`; `figcaption` 18,32 → `ui-s` (14) або `ui-m` (16); `ul/li` 18,32 → `text-l`.
- **Виключення прописані в одному місці:** логотип (27px Serif, 528 сторінок, лишається окремо як brand mark), `!!!`-знак на сторінках `link-sent`/`password-saved` (56px), hero-цифри на головній (`h1` 60–95px).

### 2.3. Хто куди переходить (найбільш поширені розбіжності)

| Зараз (px, desktop) | Де | → Токен |
|---|---|---|
| 14 / 14,0004 | хлібні крихти, `story-card__type`, лічильники, number-теги | `ui-s` |
| 14,9994 / 15 / 15,75 / 16 / 16,0002 / 16,2 / 16,875 / 16,9992 | теги, `exp-place`, `exp-pos`, `aside-mini__line`, society `p`, `infra-plate__label`, кабінет | `ui-m` (у society 16,2 → 22 `text-l`, це текст) |
| 18 / 18,0974 / 18,26 / 18,32 / 18,941 / 19,998 / 20 / 20,25 | кнопки, nav, лейбли, `storyAside__text`, e-mail у society, підписи під фото, `1 / 3` | `ui-l` (текстові блоки з 18,32 → `text-l`) |
| 21,9996 / 22 / 22,8 / 22,9 / 23,7 / 24,26 / 24,75 / 25,2 | футер, пагінація, абзаци статей і профілів, інфо-текст hero, кабінет-меню | `text-l` (навігація: `ui-l`, див. нижче) |
| 27 / 28 / 28,0008 / 28,625 / 31,5 | таби, імена, `h3`, суми, кабінет `h3` | `ui-xl` для табів, `h3` для заголовків |
| 34,3 / 34,35 / 36 / 36,64 / 40,5 | лід історії, `h2`, цитата | `h2` |
| 48 / 54 | `h1.expert__header`, `satr-auth__title`, кабінет `h1` | `h1-entity` |
| 60 / 63,9 / 68,5 / 71 / 72 / 74 / 91 / 94,6 | hero, `h2.text-h1` на головній, `h1` сторінок | `h1` (fluid 32–72; hero на головній (до 95px) вирішити окремо) |

Відкриті рішення (потрібне ваше слово): (1) база: design numbers чи React ×1,125; (2) чи лишати табам 500; (3) чи `text` 300 (за документацією) чи 400 (за фактом); (4) чи вводити окремий `ui-xl` 28, чи звести таби до `ui-l`; (5) чи лишати fullPage.js-кредит в arial (його можна прибрати зі статичного `/uk.html` після міграції на Hugo).

## 3. Порядок робіт

1. Закрити питання бази (п. 2.1) і перевірити, що `tokens.css` це єдине джерело шкали. Ввести в `tokens.css` лише 9 токенів вище (поруч з існуючими `--heading-*` і `--font-*`).
2. Зробити токени змінними з одним `line-height` на крок (`--text-ui-m: 16px/24px`).
3. Пройтися по сторінкових CSS у порядку «скільки сторінок зачіпає»: `expert*` (294), `story*` (73), `society*` (37), `scientists*` (29), `infrastructure*` (23). Кожен перехід це заміна значення на змінну без зміни розмітки.
4. Перегенерувати цей звіт (`node scripts/font-audit.mjs && python3 -I scripts/font-audit-report.py`) і перевірити: ≤ 9 унікальних розмірів Mono/Serif + 2 виключення; 0 дробових; 0 сторонніх гарнітур. Це і є критерій «готово».
5. Додати цю перевірку в `check:pages` (падає, якщо зʼявився розмір поза шкалою).

Розподіл тексту за запропонованими токенами (кількість символів на всіх сторінках, десктоп):

| Токен | Частка тексту |
|---|---|
| text-l 22/34 | 55.8% |
| ui-m 16/24 | 16.1% |
| ui-s 14/20 | 9.9% |
| ui-l 18/28 | 6.4% |
| h3 28/36 | 6.1% |
| h2 36/44 | 2.3% |
| ПРИБРАТИ (чужий шрифт) | 2.2% |
| h1 72/76 | 0.7% |
| логотип (окремо) | 0.4% |
| h1-entity 48/56 | 0.2% |
| ui-xl 28/36 | 0.0% |
| sr-only (не видно) | 0.0% |
| display-знак (!!!, окремо) | 0.0% |

## 4. Сутності по сторінках

Колонки: **Сутність** (гарнітура розмір/міжряддя, вага, трекінг, регістр) · **Де** (елементи, що її використовують) · **Сторінок** (скільки сторінок групи її мають) · **Приклад тексту** · **→ Токен** (куди її вести). Десктоп 1440. Розмір на телефоні (де відрізняється, бо fluid) рахується окремо під кожною таблицею. Дробові розміри округлені до 0,1.

Сторінки одного шаблону (профілі науковців, історії, товариства…) мають практично однаковий набір сутностей, тому вони згруповані. Один рядок у таблиці = одна сутність; вона може траплятись не на всіх сторінках групи (стовпчик «Сторінок»).

### Головна (React): `/` та `/uk`

Сторінок: 2: `/`, `/uk`

| Сутність | Де | Сторінок | Приклад | → Токен |
|---|---|---|---|---|
| Serif 18/18, 400, 0 | `span.sr-only` | 2/2 | Science At Risk | sr-only (не видно) |
| Serif 27/27, 400, -0.013em | `span.block.whitespace-nowrap.font-` | 2/2 | SC!ENCE AT R!SK! | логотип (окремо) |
| Serif 31.5/47.2, 400, -0.02em | `a.satr-dim.absolute.left-0` | 2/2 | !!! | h3 28/36 |
| Serif 36/42, 400, -0.02em | `a.satr-hover-underline.text-brand-` | 2/2 | Uncovered Graves. How Lviv restore | h2 36/44 |
| Serif 40.5/47.2, 400, -0.02em | `span.satr-hover-underline` | 2/2 | Impact of the War on Different Cat | h2 36/44 |
| Serif 60/64.2, 400, -0.02em | `h2.m-0.max-w-[18ch].font-heading` | 2/2 | Find partners in Ukrainian science | h1-entity 48/56 |
| Serif 63.9/68.4, 400, -0.02em | `h2.mb-4.font-heading.text-h1` | 2/2 | Want to help? | h1-entity 48/56 |
| Serif 68.5/73.3, 400, -0.02em | `h2.font-heading.text-h1.hyphens-au` | 1/2 | Відновлення інфраструктури | h1 72/76 |
| Serif 71/76, 400, -0.02em | `h2.font-heading.text-h1.hyphens-au` | 1/2 | Infrastructure recovery | h1 72/76 |
| Serif 91/97.4, 400, -0.02em | `h2.font-heading.text-h1.hyphens-au` | 1/2 | Research | h1 72/76 |
| Serif 94.6/101.2, 400, -0.02em | `h2.font-heading.text-h1.hyphens-au` | 1/2 | Дослідження | h1 72/76 |
| Mono 14/14, 400, -0.03em | `span.satr-tag__number` | 2/2 | 100 | ui-s 14/20 |
| Mono 15/22, 400, 0 | `a.satr-squircle-link` | 2/2 | Log in | ui-s 14/20 |
| Mono 15.8/27, 400, 0 | `span.satr-underlined`, `span` | 2/2 | ENG | ui-s 14/20 |
| Mono 18/28, 300, 0 | `span.satr-float__label.max-w-full.` | 2/2 | Enter scientific field or name | ui-m 16/24 |
| Mono 18/26, 300, 0 | `label.satr-float__label.font-text.` | 2/2 | Name | ui-m 16/24 |
| Mono 18/28, 400, -0.03em | `button.satr-squircle.satr-squircle`, `span` | 2/2 | Read Story | ui-m 16/24 |
| Mono 18/29.2, 400, 0 | `p.m-0.font-text.text-[0.9375rem]` | 2/2 | A Map of Burial Sites Revives the  | ui-m 16/24 |
| Mono 18/27, 400, -0.03em | `p.mb-3.font-text.text-text1-mobile` | 2/2 | Popular requests | ui-m 16/24 |
| Mono 18/18, 400, 0 | `legend.sr-only` | 2/2 | Search in | ui-m 16/24 |
| Mono 18.3/26.2, 400, -0.01em | `p.mt-4.max-w-2xl.font-text` | 1/2 | Наукова інфраструктура, пошкоджена | ui-m 16/24 |
| Mono 18.3/26.2, 400, 0 | `p.font-text.text-text2-desktop` | 1/2 | ~ 500 000 грн | ui-m 16/24 |
| Mono 18.3/28.5, 400, -0.03em | `p.mb-1.font-ui.text-text1-mobile` | 1/2 | Потрібна сума | ui-m 16/24 |
| Mono 18.9/27.2, 400, -0.01em | `p.mt-4.max-w-2xl.font-text` | 1/2 | Scientific infrastructure damaged  | ui-m 16/24 |
| Mono 18.9/29.6, 400, -0.03em | `p.mb-1.font-ui.text-text1-mobile` | 1/2 | Required amount | ui-m 16/24 |
| Mono 18.9/27.2, 400, 0 | `p.font-text.text-text2-desktop` | 1/2 | ~ 500 000 UAH | ui-m 16/24 |
| Mono 20/30, 400, -0.01em | `p.m-0.font-text.text-brand-black`, `span.satr-underlined` | 2/2 | Mark the scientific field that int | ui-l 18/28 |
| Mono 20.2/31.5, 400, -0.03em | `span.ml-auto.text-white/85`, `p.font-ui.text-text1-mobile.text-w` | 2/2 | Stories | ui-l 18/28 |
| Mono 22.8/34.2, 400, -0.01em | `span.satr-underlined` | 1/2 | Усі проєкти | text-l 22/34 |
| Mono 23.7/35.5, 400, -0.01em | `span.satr-underlined` | 1/2 | All projects | text-l 22/34 |
| Mono 24.3/37.9, 400, -0.03em | `p.mt-4.font-text.text-text1-deskto` | 1/2 | Author(-s): Olena Kozak, Lidia Kuz | text-l 22/34 |
| Mono 24.3/34.9, 400, -0.01em | `p.mt-4.max-w-2xl.font-text` | 1/2 | Formalized and organized experienc | text-l 22/34 |
| Mono 24.3/34.9, 400, 0 | `p.font-text.text-text2-desktop` | 1/2 | .pdf | text-l 22/34 |
| Mono 24.8/31.5, 400, -0.03em | `a.satr-hover-underline.satr-hover-`, `p.mb-4.max-w-[280px].font-ui` | 2/2 | Centre of Excellence on Science at | text-l 22/34 |
| Mono 25.2/39.4, 400, -0.03em | `p.mt-4.font-text.text-text1-deskto` | 1/2 | Автор(и): Олена Козак, Лідія Кузем | text-l 22/34 |
| Mono 25.2/36.2, 400, -0.01em | `p.mt-4.max-w-2xl.font-text` | 1/2 | Формалізований і систематизований  | text-l 22/34 |
| Mono 25.2/36.2, 400, 0 | `p.font-text.text-text2-desktop` | 1/2 | .pdf | text-l 22/34 |
| Mono 27/36, 500, 0 | `span.block.border-b-[3px].border-t` | 2/2 | Scientists | text-l 22/34 |
| Mono 30.3/45.5, 400, -0.01em | `span.satr-underlined` | 1/2 | Show all studies | ui-xl 28/36 |
| Mono 31.5/47.3, 400, -0.01em | `span.satr-underlined` | 1/2 | Усі дослідження | ui-xl 28/36 |

Розміри на телефоні 390: 14, 15.8, 16, 16.9, 18, 18.7, 20.2, 22.5, 24, 31.5, 32. На десктопі: 24 розмірів, на телефоні 11.

### Кабінет (React): `/cabinet/*`

Сторінок: 7: `/cabinet/collaboration`, `/cabinet/courses`, `/cabinet/grants`, `/cabinet/notifications`, `/cabinet/profile`, `/cabinet/settings`, `/cabinet/welcome`

| Сутність | Де | Сторінок | Приклад | → Токен |
|---|---|---|---|---|
| Serif 27/27, 400, -0.013em | `span.block.whitespace-nowrap.font-` | 7/7 | SC!ENCE AT R!SK! | логотип (окремо) |
| Serif 31.5/38.2, 400, -0.02em | `h3.m-0.mt-4.font-heading`, `h3.m-0.font-heading.text-heading-3` | 2/7 | ERASMUS+ SUNRISE | h3 28/36 |
| Serif 40.5/47.2, 400, -0.02em | `h4.font-heading.text-heading-2.fon`, `h3.font-heading.text-h2-mobile.md:` | 5/7 | Посилання | h2 36/44 |
| Serif 54/60.8, 400, -0.02em | `h1.m-0.font-heading.tracking-[-0.0` | 1/7 | Ачасов Андрій Борисович | h1-entity 48/56 |
| Serif 74.2/79.1, 400, -0.02em | `h1.font-heading.text-h1-mobile.md:`, `h1.mx-auto.max-w-[760px].font-head` | 6/7 | Вітаємо. Створімо вашу сторінку | h1 72/76 |
| Mono 14/19.6, 400, -0.03em | `time.whitespace-nowrap.font-ui.tex`, `p.m-0.mt-2.font-ui` | 6/7 | 5 | ui-s 14/20 |
| Mono 15.8/24.8, 400, -0.03em | `span` | 1/7 | Природничі науки | ui-s 14/20 |
| Mono 15.8/22.5, 400, -0.03em | `span.satr-underlined` | 1/7 | Редагувати | ui-s 14/20 |
| Mono 15.8/27, 400, 0 | `a.satr-hover-underline.no-underlin`, `span` | 7/7 | ENG | ui-s 14/20 |
| Mono 15.8/22.5, 400, -0.01em | `span.satr-underlined` | 1/7 | Відкрити на сайті | ui-s 14/20 |
| Mono 16.9/28.1, 400, 0 | `p.m-0.mt-4.font-text`, `a.satr-underlined` | 1/7 | Підтримка наступного покоління укр | ui-m 16/24 |
| Mono 16.9/24.8, 400, 0 | `span.mt-1.block.font-ui`, `p.m-0.mt-1.text-brand-muted` | 1/7 | Харківський національний університ | ui-m 16/24 |
| Mono 18/26, 300, 0 | `label.satr-float__label.font-text.` | 2/7 | Пошук за іменем, університетом, те | ui-m 16/24 |
| Mono 18/29.2, 400, 0 | `p.mt-4.max-w-[760px].font-text`, `p.mt-2.font-text.text-text2-mobile` | 7/7 | Orcid | ui-m 16/24 |
| Mono 18/28, 400, -0.03em | `span`, `button.satr-squircle.satr-squircle` | 6/7 | Почати | ui-m 16/24 |
| Mono 18/27, 400, 0 | `span.block.font-text.text-[1rem]`, `span.[@media(hover:none)]:bg-brand` | 1/7 | Змінити фото | ui-m 16/24 |
| Mono 18/18, 400, -0.01em | `span.satr-underlined` | 1/7 | Прочитати всі | ui-m 16/24 |
| Mono 18/18, 400, 0 | `span.sr-only`, `p.sr-only` | 2/7 | 3 науковці | ui-m 16/24 |
| Mono 18/28, 400, -0.01em | `span.satr-underlined` | 1/7 | m1@university.example | ui-m 16/24 |
| Mono 18/28, 400, 0 | `p.m-0.font-ui.text-[18px]` | 1/7 | Написати на пошту: | ui-m 16/24 |
| Mono 18/24.8, 400, 0 | `span.pt-[2px].text-[0.875rem].lead` | 1/7 | 1994 | ui-m 16/24 |
| Mono 18/31.5, 400, 0 | `span.font-ui.text-[1rem].leading-[` | 1/7 | 2022 | ui-m 16/24 |
| Mono 20.2/31.5, 400, -0.03em | `p.m-0`, `span` | 7/7 | Схвалено | ui-l 18/28 |
| Mono 20.2/29.2, 400, 0 | `p.mt-3.font-text.text-[1rem]`, `p.m-0.font-text.text-[1rem]` | 2/7 | Доктор наук, Професор | ui-l 18/28 |
| Mono 20.2/33.8, 400, 0 | `p`, `p.m-0.font-text.text-[1rem]` | 1/7 | українська, англійська, німецька | ui-l 18/28 |
| Mono 20.2/31.5, 400, -0.01em | `span.satr-underlined` | 1/7 | m1@university.example | ui-l 18/28 |
| Mono 20.2/31.5, 700, -0.03em | `p.m-0.font-ui.text-text1-mobile`, `strong.font-bold` | 2/7 | Арбузова Світлана Борисівна | ui-l 18/28 |
| Mono 24.8/31.5, 400, -0.03em | `span`, `button.flex.w-fit.items-center` | 5/7 | Мої сповіщення | text-l 22/34 |
| Mono 24.8/31.5, 700, -0.03em | `span`, `button.flex.w-fit.items-center` | 5/7 | Мій профіль | text-l 22/34 |

Розміри на телефоні 390: 14, 15.8, 16.9, 18, 20.2, 22.5, 27, 36, 40.5. На десктопі: 11 розмірів, на телефоні 9.

### Профіль науковця `/expert/*`

Сторінок: 294 (напр. `/expert/achasov-andrii-borysovych.html`)

| Сутність | Де | Сторінок | Приклад | → Токен |
|---|---|---|---|---|
| Serif 27/27, 400, -0.013em | `span.block.whitespace-nowrap.font-` | 294/294 | SC!ENCE AT R!SK! | логотип (окремо) |
| Serif 28/34, 400, -0.02em | `span`, `h4.aside__title` | 294/294 | Working languages | h3 28/36 |
| Serif 28/43.4, 400, -0.02em | `p.aside-mini__name` | 294/294 | Volodymyr Akhmetov | h3 28/36 |
| Serif 36/42, 400, -0.02em | `h2.expertTitle.expertTitle--h4` | 294/294 | Research field | h2 36/44 |
| Serif 48/54, 400, -0.02em | `h1.expert__header` | 294/294 | Volodymyr Akhmetov | h1-entity 48/56 |
| Serif 72/76, 400, -0.02em | `h2.mb-4.font-heading.text-h1` | 294/294 | Want to help? | h1 72/76 |
| Mono 14/20, 400, -0.03em | `p.sr-only`, `span.ml-auto.text-white/85` | 294/294 | Please shorten your inquiry. | ui-s 14/20 |
| Mono 14/19.6, 400, -0.03em | `span` | 294/294 | Main | ui-s 14/20 |
| Mono 14/21.7, 400, -0.03em | `li.breadcrumbs__divider` | 294/294 | / | ui-s 14/20 |
| Mono 15/22, 400, 0 | `span.exp-place`, `a.satr-squircle-link` | 294/294 | Log in | ui-m 16/24 |
| Mono 15/23.2, 400, 0 | `p.aside-mini__line.aside-mini__pla` | 292/294 | Main Astronomical Observatory of t | ui-s 14/20 |
| Mono 15/23.2, 400, -0.03em | `p.tag` | 287/294 | Astrophysics | ui-s 14/20 |
| Mono 15.8/27, 400, 0 | `span.satr-underlined`, `span` | 294/294 | ENG | ui-m 16/24 |
| Mono 16/24.8, 400, 0 | `p.project-card__text`, `p.aside-mini__line` | 294/294 | Doctor of Sciences | ui-m 16/24 |
| Mono 16/24, 400, 0 | `span.exp-pos` | 294/294 | Leading Researcher | ui-m 16/24 |
| Mono 16/22, 400, 0 | `span.exp-year` | 279/294 | Since 2025 | ui-m 16/24 |
| Mono 16/24, 400, -0.03em | `a.aside__item-link.hover.hover--un` | 272/294 | Orcid | ui-m 16/24 |
| Mono 16/28, 400, 0 | `span.project-card__year` | 270/294 | 2017 | ui-m 16/24 |
| Mono 16/22, 700, 0 | `span.exp-year` | 1/294 | Since 2017 | ui-m 16/24 |
| Mono 18/26, 300, 0 | `label.satr-float__label.font-text.` | 294/294 | Name | ui-l 18/28 |
| Mono 18/28, 400, -0.03em | `button.aside__contact.btn.btn--bla`, `button.satr-squircle.satr-squircle` | 294/294 | Write to Volodymyr | ui-l 18/28 |
| Mono 18/27.9, 400, 0 | `p.aside__lang-text` | 294/294 | English | ui-l 18/28 |
| Mono 22/28, 400, -0.03em | `a.satr-hover-underline.satr-hover-`, `p.mb-4.max-w-[280px].font-ui` | 294/294 | Fill out the form or contact us | text-l 22/34 |
| Mono 22.9/35.5, 400, 0 | `p.expertParagraph`, `p.expertParagraph.expertParagraph-` | 294/294 | Doctor of Sciences | text-l 22/34 |
| Mono 22.9/35.5, 400 italic, 0 | `i` | 2/294 | Mushrooms, Coffins, and Dissertati | text-l 22/34 |
| Mono 22.9/35.5, 700, 0 | `b` | 1/294 | " | text-l 22/34 |

Розміри на телефоні 390: 14, 15, 15.1, 16, 18, 20.2, 20.3, 24.1, 32, 36.2. На десктопі: 12 розмірів, на телефоні 10.

### Історія / стаття `/story/*`

Сторінок: 73 (напр. `/story/a-conversation-with-maksymovych.html`)

| Сутність | Де | Сторінок | Приклад | → Токен |
|---|---|---|---|---|
| Serif 27/27, 400, -0.013em | `span.block.whitespace-nowrap.font-` | 73/73 | SC!ENCE AT R!SK! | логотип (окремо) |
| Serif 28/34, 400, -0.02em | `span.hover.hover--black` | 73/73 | Uncovered Graves. How Lviv restore | h3 28/36 |
| Serif 28.6/37.2, 400, -0.02em | `h3.heading.heading--h3` | 18/73 | One hundred years of research | h3 28/36 |
| Serif 34.4/53.2, 400, 0 | `p.paragraph.story-lead`, `p.story-lead` | 35/73 | The Okhtyrka Municipal Local Histo | h2 36/44 |
| Serif 34.4/46.4, 400, 0 | `h4.quote__name` | 11/73 | The Ukrainian scientists on the po | h2 36/44 |
| Serif 36/42, 400, -0.02em | `h2.heading.heading--h2`, `h2.quote__title` | 73/73 | Other stories | h2 36/44 |
| Serif 36.6/45.8, 400, -0.02em | `h2.heading.heading--h2`, `h2.heading.heading--h2.mt-0` | 16/73 | A heading of the first level | h2 36/44 |
| Serif 36.6/36.6, 700, -0.02em | `a` | 1/73 | ² | h2 36/44 |
| Serif 72/76, 400, -0.02em | `h1.story__main-title`, `h2.mb-4.font-heading.text-h1` | 73/73 | A Conversation with Maksymovych | h1 72/76 |
| Mono 14/19.6, 400, -0.03em | `span` | 73/73 | Main | ui-s 14/20 |
| Mono 14/20, 400, -0.03em | `p.sr-only`, `span.ml-auto.text-white/85` | 73/73 | Please shorten your inquiry. | ui-s 14/20 |
| Mono 14/18.2, 400, 0 | `span.story-card__type` | 73/73 | Stories | ui-s 14/20 |
| Mono 14/21.7, 400, -0.03em | `li.breadcrumbs__divider` | 73/73 | / | ui-s 14/20 |
| Mono 15/22.5, 400, 0 | `h4.storyAside__title`, `a.story__type` | 73/73 | Stories | ui-s 14/20 |
| Mono 15/22, 400, 0 | `a.satr-squircle-link` | 73/73 | Log in | ui-m 16/24 |
| Mono 15.8/27, 400, 0 | `span.satr-underlined`, `span` | 73/73 | ENG | ui-m 16/24 |
| Mono 16/24.8, 400, -0.03em | `p.quote__position` | 3/73 | Director of the Ukrainian Research | ui-m 16/24 |
| Mono 16/24.8, 400, 0 | `p.embed__consent` | 1/73 | This video is hosted on YouTube. I | ui-m 16/24 |
| Mono 18/26, 300, 0 | `label.satr-float__label.font-text.` | 73/73 | Name | ui-l 18/28 |
| Mono 18/27.9, 400, -0.03em | `p.story-card__data`, `p.link__title` | 73/73 | Share with help: | ui-l 18/28 |
| Mono 18/27, 400, -0.03em | `a._sharer.hover.hover--underline` | 73/73 | Facebook | ui-l 18/28 |
| Mono 18/28, 400, -0.03em | `button.satr-squircle.satr-squircle`, `span.hover.hover--black` | 73/73 | Send | ui-l 18/28 |
| Mono 18/18, 400, 0 | `div.counter`, `a.embed__play` | 15/73 | 1/10 | ui-l 18/28 |
| Mono 18.3/28.4, 400 italic, 0 | `li`, `i` | 49/73 | Kharkiv was the first capital of t | ui-l 18/28 |
| Mono 18.3/27.5, 400, -0.03em | `figcaption.image__figcaption` | 13/73 | Gonchar Library after the latest s | ui-l 18/28 |
| Mono 18.3/28.4, 400, 0 | `a.footnote-back`, `p.infra-caption` | 11/73 | ↩ | ui-l 18/28 |
| Mono 18.3/27.5, 400, 0 | `figcaption.figure__caption` | 1/73 | A lamp with a QR code beside a gra | ui-l 18/28 |
| Mono 18.3/27.5, 400 italic, 0 | `p.satr-note` | 1/73 | The reportage is published with th | ui-l 18/28 |
| Mono 18.3/28, 400, -0.03em | `div.counter` | 1/73 | 1 / 3 | ui-l 18/28 |
| Mono 20/31, 400, 0 | `p.storyAside__text` | 65/73 | Les Beley | ui-l 18/28 |
| Mono 22/28, 400, -0.03em | `a.satr-hover-underline.satr-hover-`, `p.mb-4.max-w-[280px].font-ui` | 73/73 | Fill out the form or contact us | text-l 22/34 |
| Mono 22.9/35.5, 400, 0 | `p.paragraph`, `a` | 73/73 | The Maksymovych Science Library wa | text-l 22/34 |
| Mono 22.9/35.5, 400 italic, 0 | `i` | 14/73 | (books from the early period of bo | text-l 22/34 |
| Mono 22.9/35.5, 700, 0 | `b` | 17/73 | incunabula | text-l 22/34 |
| Mono 22.9/22.9, 700, 0 | `a` | 10/73 | ¹ | text-l 22/34 |

Розміри на телефоні 390: 14, 14.4, 15, 15.1, 16, 18, 20, 20.2, 20.3, 22.5, 24.1, 27, 28.8, 32, 32.6. На десктопі: 16 розмірів, на телефоні 15.

### Наукове товариство `/society/*`

Сторінок: 37 (напр. `/society/asotsiatsiia-hinekolohiv-endokrynolohiv-ukrainy.html`)

| Сутність | Де | Сторінок | Приклад | → Токен |
|---|---|---|---|---|
| Serif 27/27, 400, -0.013em | `span.block.whitespace-nowrap.font-` | 37/37 | SC!ENCE AT R!SK! | логотип (окремо) |
| Serif 36/42, 400, -0.02em | `h2.indent-top`, `h2` | 37/37 | Basic information | h2 36/44 |
| Serif 72/76, 400, -0.02em | `h1.search-hero__title`, `h2.mb-4.font-heading.text-h1` | 37/37 | Association of Gynecologists and E | h1 72/76 |
| Mono 14/19.6, 400, -0.03em | `span` | 37/37 | Main | ui-s 14/20 |
| Mono 14/20, 400, -0.03em | `p.sr-only`, `span.ml-auto.text-white/85` | 37/37 | Please shorten your inquiry. | ui-s 14/20 |
| Mono 14/21.7, 400, -0.03em | `li.breadcrumbs__divider` | 37/37 | / | ui-s 14/20 |
| Mono 15/22.5, 400, 0 | `h2` | 37/37 | President | ui-s 14/20 |
| Mono 15/22, 400, 0 | `a.satr-squircle-link` | 37/37 | Log in | ui-m 16/24 |
| Mono 15.8/27, 400, 0 | `span.satr-underlined`, `span` | 37/37 | ENG | ui-m 16/24 |
| Mono 16.2/25.1, 400, 0 | `p` | 37/37 | Association of Gynecologists and E | ui-m 16/24 |
| Mono 16.2/25.1, 400 italic, 0 | `i` | 1/37 | HighMatTech | ui-m 16/24 |
| Mono 16.2/25.1, 700, 0 | `b` | 1/37 | Introduction to Bulk RNA-seq Analy | ui-m 16/24 |
| Mono 18/26, 300, 0 | `label.satr-float__label.font-text.` | 37/37 | Name | ui-l 18/28 |
| Mono 18/27.9, 400, 0 | `p.popular-requests__text`, `p.mt-3` | 22/37 | The Association's primary goal is  | ui-l 18/28 |
| Mono 18/28, 400, -0.03em | `a.hover.hover--underline.scientifi`, `button.satr-squircle.satr-squircle` | 37/37 | Health Hub | ui-l 18/28 |
| Mono 18/26, 400, -0.03em | `button.popular-requests__tags.tag` | 22/37 | Health care | ui-l 18/28 |
| Mono 20/30, 400, -0.03em | `a` | 36/37 | prof.tatarchuk@gmail.com | ui-l 18/28 |
| Mono 20/31, 400, 0 | `p` | 37/37 | Tatarchuk Tatiana | ui-l 18/28 |
| Mono 22/28, 400, -0.03em | `a.satr-hover-underline.satr-hover-`, `p.mb-4.max-w-[280px].font-ui` | 37/37 | Fill out the form or contact us | text-l 22/34 |

Розміри на телефоні 390: 14, 15, 15.1, 16, 18, 20, 20.2, 20.3, 32, 32.6. На десктопі: 10 розмірів, на телефоні 10.

### Список науковців, сторінки пагінації `/scientists/*`

Сторінок: 29 (напр. `/scientists/page-10.html`)

| Сутність | Де | Сторінок | Приклад | → Токен |
|---|---|---|---|---|
| Serif 27/27, 400, -0.013em | `span.block.whitespace-nowrap.font-` | 29/29 | SC!ENCE AT R!SK! | логотип (окремо) |
| Serif 28/34, 400, -0.02em | `span` | 29/29 | Maryna Gorokhovatska | h3 28/36 |
| Serif 72/76, 400, -0.02em | `h1.search-hero__title`, `h2.mb-4.font-heading.text-h1` | 29/29 | Find partners in Ukrainian science | h1 72/76 |
| Mono 14/20, 400, -0.03em | `p.sr-only`, `span.ml-auto.text-white/85` | 29/29 | Please shorten your inquiry. | ui-s 14/20 |
| Mono 14/19.6, 400, -0.03em | `span` | 29/29 | Main | ui-s 14/20 |
| Mono 14/21.7, 400, -0.03em | `li.breadcrumbs__divider` | 29/29 | / | ui-s 14/20 |
| Mono 15/23.2, 400, 0 | `p.expert-card__text`, `span.expert-card__societies-label` | 29/29 | The National Academy of Sciences o | ui-s 14/20 |
| Mono 15/22, 400, 0 | `a.satr-squircle-link` | 29/29 | Log in | ui-m 16/24 |
| Mono 15.8/27, 400, 0 | `span.satr-underlined`, `span` | 29/29 | ENG | ui-m 16/24 |
| Mono 16/0, 400, -0.03em | `span.tag__number` | 29/29 | 100 | ui-m 16/24 |
| Mono 16/24.8, 400, 0 | `p.popular-requests__text` | 11/29 | Popular requests | ui-m 16/24 |
| Mono 18/26, 300, 0 | `label.satr-float__label.font-text.`, `span.satr-float__label` | 29/29 | Enter name, scientific field or sp | ui-l 18/28 |
| Mono 18/28, 400, -0.03em | `button.expert-card__tag.tag`, `button.btn.btn--black` | 29/29 | Find scientists | ui-l 18/28 |
| Mono 18/27.9, 400, 0 | `p.expert-card__subtitle`, `p.popular-requests__text` | 29/29 | Ph.D. | ui-l 18/28 |
| Mono 18/26, 400, -0.03em | `button.popular-requests__tags.tag` | 29/29 | Teaching | ui-l 18/28 |
| Mono 22/26, 300, 0 | `span.satr-float__label` | 18/29 | Enter name, scientific field or sp | text-l 22/34 |
| Mono 22/28, 400, -0.03em | `a.satr-hover-underline.satr-hover-`, `span.hover.hover--black` | 29/29 | Previous | text-l 22/34 |
| Mono 22/0, 400, -0.03em | `a.pagination__number`, `span.pagination__number.pagination` | 29/29 | 1 | text-l 22/34 |
| Mono 22.9/35.5, 400, 0 | `p.paragraph` | 29/29 | Maryna is the Scientific Manager o | text-l 22/34 |
| Mono 27/36, 500, 0 | `span.scope-tabs__word` | 29/29 | Scientists | ui-xl 28/36 |

Розміри на телефоні 390: 14, 15.1, 16, 18, 20.2, 22.5, 24.1, 32, 32.6. На десктопі: 10 розмірів, на телефоні 9.

### Інфраструктура `/infrastructure/*`

Сторінок: 23 (напр. `/infrastructure/berdianskyi-derzhavnyi-pedahohichnyi-universytet.html`)

| Сутність | Де | Сторінок | Приклад | → Токен |
|---|---|---|---|---|
| Serif 27/27, 400, -0.013em | `span.block.whitespace-nowrap.font-` | 23/23 | SC!ENCE AT R!SK! | логотип (окремо) |
| Serif 28/34, 400, -0.02em | `h2.person-card__title` | 23/23 | Yulia Bazeliuk | h3 28/36 |
| Serif 31.5/48.8, 400, -0.02em | `p.infra-plate__amount` | 19/23 | ~ 440 000 000 UAH | h3 28/36 |
| Serif 48/54, 400, -0.02em | `h1.infrastructure__header.font-min` | 23/23 | Ecocenter | h1-entity 48/56 |
| Serif 72/76, 400, -0.02em | `h2.mb-4.font-heading.text-h1` | 23/23 | Want to help? | h1 72/76 |
| Mono 14/20, 400, -0.03em | `p.sr-only`, `span.ml-auto.text-white/85` | 23/23 | Please shorten your inquiry. | ui-s 14/20 |
| Mono 14/19.6, 400, -0.03em | `span` | 23/23 | Main | ui-s 14/20 |
| Mono 14/21.7, 400, -0.03em | `li.breadcrumbs__divider` | 23/23 | / | ui-s 14/20 |
| Mono 15/22, 400, 0 | `a.satr-squircle-link` | 23/23 | Log in | ui-m 16/24 |
| Mono 15.8/27, 400, 0 | `span.satr-underlined`, `span` | 23/23 | ENG | ui-m 16/24 |
| Mono 16/24.8, 400, 0 | `p.infra-contact__alt`, `span.hover.hover--black` | 23/23 | State Specialized Enterprise "Ecoc | ui-m 16/24 |
| Mono 16/23.2, 400, -0.03em | `span.tag.expert-card__tag` | 23/23 | Natural sciences | ui-m 16/24 |
| Mono 17/22.1, 400, 0 | `span.infra-plate__label` | 19/23 | Needed | ui-m 16/24 |
| Mono 18/26, 300, 0 | `label.satr-float__label.font-text.`, `span.hover.hover--black` | 23/23 | Name | ui-l 18/28 |
| Mono 18/27.9, 400, 0 | `p.infra-plate__purpose`, `p.infra-help-note` | 23/23 | We need equipment to detect radioa | ui-l 18/28 |
| Mono 18/28, 400, -0.03em | `h4.infrastructure__sec-title`, `button._mailto.person-card__btn.bt` | 23/23 | City | ui-l 18/28 |
| Mono 20.2/27, 400, -0.03em | `span.hover.hover--black`, `button._swiper_prev.prev.infrastru` | 16/23 | < | text-l 22/34 |
| Mono 20.2/28, 400, -0.027em | `div.counter` | 18/23 | 1 / 4 | text-l 22/34 |
| Mono 22/28, 400, -0.03em | `a.satr-hover-underline.satr-hover-`, `p.mb-4.max-w-[280px].font-ui` | 23/23 | Fill out the form or contact us | text-l 22/34 |
| Mono 22.9/35.5, 400, 0 | `h4.infrastructure__sec-text`, `p.infrastructure__text` | 23/23 | Areas of activity of the enterpris | text-l 22/34 |
| Mono 22.9/35.5, 700, 0 | `b` | 1/23 | Geomagnetic Observatory Dimer | text-l 22/34 |

Розміри на телефоні 390: 14, 15.1, 16, 17, 18, 20.2, 24.1, 32, 38.2. На десктопі: 14 розмірів, на телефоні 9.

### Дослідження `/research/*`

Сторінок: 16 (напр. `/research/communicating-science-at-risk.html`)

| Сутність | Де | Сторінок | Приклад | → Токен |
|---|---|---|---|---|
| Serif 27/27, 400, -0.013em | `span.block.whitespace-nowrap.font-` | 16/16 | SC!ENCE AT R!SK! | логотип (окремо) |
| Serif 36/42, 400, -0.02em | `h2.heading.heading--h2.mt-0` | 4/16 | Current Situation | h2 36/44 |
| Serif 72/76, 400, -0.02em | `h1.paper__main-title`, `h2.mb-4.font-heading.text-h1` | 16/16 | Communicating Science at Risk | h1 72/76 |
| Mono 14/19.6, 400, -0.03em | `span` | 16/16 | Main | ui-s 14/20 |
| Mono 14/20, 400, -0.03em | `p.sr-only`, `span.ml-auto.text-white/85` | 16/16 | Please shorten your inquiry. | ui-s 14/20 |
| Mono 14/21.7, 400, -0.03em | `li.breadcrumbs__divider` | 16/16 | / | ui-s 14/20 |
| Mono 15/22, 400, 0 | `a.satr-squircle-link` | 16/16 | Log in | ui-m 16/24 |
| Mono 15.8/27, 400, 0 | `span.satr-underlined`, `span` | 16/16 | ENG | ui-m 16/24 |
| Mono 16/24, 400, 0 | `div.mb-5` | 16/16 | Author(-s): | ui-m 16/24 |
| Mono 18/26, 300, 0 | `label.satr-float__label.font-text.` | 16/16 | Name | ui-l 18/28 |
| Mono 18/27.9, 400, 0 | `p.paper-aside__text.paper-aside__s` | 16/16 | .pdf, 183.57 KB | ui-l 18/28 |
| Mono 18/28, 400, -0.03em | `div.paper-aside__download.btn.btn-`, `button.satr-squircle.satr-squircle` | 16/16 | Download | ui-l 18/28 |
| Mono 18.3/28.4, 400 italic, 0 | `i` | 3/16 | *Leapfrogging — a concept used in  | ui-l 18/28 |
| Mono 22/28, 400, -0.03em | `a.satr-hover-underline.satr-hover-`, `p.mb-4.max-w-[280px].font-ui` | 16/16 | Fill out the form or contact us | text-l 22/34 |
| Mono 22.9/35.5, 400, 0 | `p.paragraph`, `a.hover.hover--underline` | 16/16 | Nataliia Zinevych, Olha Kaida, Rom | text-l 22/34 |
| Mono 22.9/35.5, 700, 0 | `strong.paper-point__title`, `b` | 13/16 | 35% | text-l 22/34 |

Розміри на телефоні 390: 14, 14.4, 15.1, 16, 18, 20.2, 20.3, 32, 32.6. На десктопі: 11 розмірів, на телефоні 9.

### Список історій, пагінація `/stories/*`

Сторінок: 14 (напр. `/stories/page-2-theme-blogs.html`)

| Сутність | Де | Сторінок | Приклад | → Токен |
|---|---|---|---|---|
| Serif 27/27, 400, -0.013em | `span.block.whitespace-nowrap.font-` | 14/14 | SC!ENCE AT R!SK! | логотип (окремо) |
| Serif 28/34, 400, -0.02em | `span.hover.hover--black` | 14/14 | Citizen Science in Ukraine: Olena  | h3 28/36 |
| Serif 72/76, 400, -0.02em | `h1.pageStories__title`, `h2.mb-4.font-heading.text-h1` | 14/14 | Stories | h1 72/76 |
| Mono 14/20, 400, -0.03em | `p.sr-only`, `span.ml-auto.text-white/85` | 14/14 | Please shorten your inquiry. | ui-s 14/20 |
| Mono 14/18.2, 400, 0 | `span.story-card__type` | 14/14 | Blogs | ui-s 14/20 |
| Mono 14/19.6, 400, -0.03em | `span` | 14/14 | Main | ui-s 14/20 |
| Mono 14/24, 400, -0.034em | `span.stories-tags__count` | 14/14 | 72 | ui-s 14/20 |
| Mono 14/21.7, 400, -0.03em | `li.breadcrumbs__divider` | 14/14 | / | ui-s 14/20 |
| Mono 15/22, 400, 0 | `a.satr-squircle-link` | 14/14 | Log in | ui-m 16/24 |
| Mono 15.8/27, 400, 0 | `span.satr-underlined`, `span` | 14/14 | ENG | ui-m 16/24 |
| Mono 16/24, 400, -0.03em | `div.stories-tags__tag.btn.btn--bor` | 14/14 | All | ui-m 16/24 |
| Mono 18/26, 300, 0 | `label.satr-float__label.font-text.` | 14/14 | Name | ui-l 18/28 |
| Mono 18/27.9, 400, 0 | `p.story-card__text` | 14/14 | Citizen science holds tremendous p | ui-l 18/28 |
| Mono 18/27.9, 400, -0.03em | `p.story-card__data` | 14/14 | 05.09.23 | ui-l 18/28 |
| Mono 18/28, 400, -0.03em | `button.satr-squircle.satr-squircle` | 14/14 | Send | ui-l 18/28 |
| Mono 22/28, 400, -0.03em | `a.satr-hover-underline.satr-hover-`, `span.hover.hover--black` | 14/14 | Previous | text-l 22/34 |
| Mono 22/0, 400, -0.03em | `a.pagination__number`, `span.pagination__number.pagination` | 14/14 | 1 | text-l 22/34 |

Розміри на телефоні 390: 14, 15.1, 16, 18, 20.2, 24.1, 32, 32.6. На десктопі: 9 розмірів, на телефоні 8.

### Список товариств, пагінація `/societies/*`

Сторінок: 3 (напр. `/societies/page-2.html`)

| Сутність | Де | Сторінок | Приклад | → Токен |
|---|---|---|---|---|
| Serif 27/27, 400, -0.013em | `span.block.whitespace-nowrap.font-` | 3/3 | SC!ENCE AT R!SK! | логотип (окремо) |
| Serif 28/34, 400, -0.02em | `span` | 3/3 | Society for Industrial Recovery &  | h3 28/36 |
| Serif 72/76, 400, -0.02em | `h1.search-hero__title`, `h2.mb-4.font-heading.text-h1` | 3/3 | Find partners in Ukrainian science | h1 72/76 |
| Mono 14/20, 400, -0.03em | `p.sr-only`, `span.ml-auto.text-white/85` | 3/3 | Please shorten your inquiry. | ui-s 14/20 |
| Mono 14/19.6, 400, -0.03em | `span` | 3/3 | Main | ui-s 14/20 |
| Mono 14/21.7, 400, -0.03em | `li.breadcrumbs__divider` | 3/3 | / | ui-s 14/20 |
| Mono 15/23.2, 400, 0 | `p.infrastructures__text-left` | 3/3 | Science domain | ui-s 14/20 |
| Mono 15/22, 400, 0 | `a.satr-squircle-link` | 3/3 | Log in | ui-m 16/24 |
| Mono 15.8/27, 400, 0 | `span.satr-underlined`, `span` | 3/3 | ENG | ui-m 16/24 |
| Mono 16/23.2, 400, -0.03em | `span.tag.expert-card__tag` | 3/3 | Social and behavioural sciences | ui-m 16/24 |
| Mono 16/0, 400, -0.03em | `span.tag__number` | 3/3 | 8 | ui-m 16/24 |
| Mono 18/26, 300, 0 | `label.satr-float__label.font-text.`, `span.satr-float__label` | 3/3 | Society name or domain, e.g. Medic | ui-l 18/28 |
| Mono 18/27.9, 400, 0 | `p.infrastructures-card__text`, `p.popular-requests__text` | 3/3 | Popular domains | ui-l 18/28 |
| Mono 18/26, 400, -0.03em | `button.popular-requests__tags.tag` | 3/3 | Natural sciences | ui-l 18/28 |
| Mono 18/28, 400, -0.03em | `button.btn.btn--black`, `button.satr-squircle.satr-squircle` | 3/3 | Find societies | ui-l 18/28 |
| Mono 18.1/26, 300, 0 | `span.satr-float__label` | 1/3 | Society name or domain, e.g. Medic | ui-l 18/28 |
| Mono 22/28, 400, -0.03em | `a.satr-hover-underline.satr-hover-`, `span.hover.hover--black` | 3/3 | Previous | text-l 22/34 |
| Mono 22/0, 400, -0.03em | `a.pagination__number`, `span.pagination__number.pagination` | 3/3 | 1 | text-l 22/34 |
| Mono 27/36, 500, 0 | `span.scope-tabs__word` | 3/3 | Scientists | ui-xl 28/36 |

Розміри на телефоні 390: 14, 15.1, 16, 18, 20.2, 22.5, 24.1, 32, 32.6. На десктопі: 10 розмірів, на телефоні 9.

### Українські версії `/uk/*`

Сторінок: 6 (напр. `/uk/first-login.html`)

| Сутність | Де | Сторінок | Приклад | → Токен |
|---|---|---|---|---|
| Serif 27/27, 400, -0.013em | `span.block.whitespace-nowrap.font-` | 6/6 | SC!ENCE AT R!SK! | логотип (окремо) |
| Serif 48/54, 400, -0.02em | `h1.satr-auth__title` | 6/6 | Перший вхід | h1-entity 48/56 |
| Serif 72/76, 400, -0.02em | `h2.mb-4.font-heading.text-h1` | 6/6 | Хочете допомогти? | h1 72/76 |
| Mono 14/20, 400, -0.03em | `p.sr-only`, `span.ml-auto.text-white/85` | 6/6 | Будь ласка, скоротіть ваше звернен | ui-s 14/20 |
| Mono 14/20, 400, 0 | `span`, `p.satr-auth__under` | 3/6 | Скопіюйте його з листа. Він діє од | ui-s 14/20 |
| Mono 14/22, 400, 0 | `li.satr-auth__rule`, `p.satr-auth__rules-title` | 1/6 | У паролі має бути: | ui-s 14/20 |
| Mono 14/14, 400, -0.03em | `button.satr-auth__reveal` | 2/6 | Показати | ui-s 14/20 |
| Mono 15/22, 400, 0 | `a.satr-squircle-link` | 6/6 | Увійти | ui-m 16/24 |
| Mono 15.8/27, 400, 0 | `a.satr-hover-underline.no-underlin`, `span` | 6/6 | ENG | ui-m 16/24 |
| Mono 16/24, 400, 0 | `a.satr-auth__link`, `p` | 4/6 | Загубили лист або пароль не підход | ui-m 16/24 |
| Mono 18/26, 300, 0 | `label.satr-float__label.font-text.`, `label.satr-float__label.font-ukrai` | 6/6 | Електронна пошта | ui-l 18/28 |
| Mono 18/28, 400, 0 | `p.satr-auth__lede` | 6/6 | Вкажіть email, на який надійшло за | ui-l 18/28 |
| Mono 18/28, 400, -0.03em | `button.satr-squircle.satr-squircle`, `button.satr-auth__btn` | 6/6 | Продовжити | ui-l 18/28 |
| Mono 18/26, 400, 0 | `p.satr-auth__aside-title` | 2/6 | Вхід лише за запрошенням | ui-l 18/28 |
| Mono 22/28, 400, -0.03em | `a.satr-hover-underline.satr-hover-`, `p.mb-4.max-w-[280px].font-ui` | 6/6 | Заповніть форму або зв’яжіться з н | text-l 22/34 |
| Mono 56/56, 400, 0 | `p.satr-auth__mark` | 2/6 | !!! | display-знак (!!!, окремо) |

Розміри на телефоні 390: 14, 15.1, 16, 18, 20.2, 32, 36.2, 56. На десктопі: 10 розмірів, на телефоні 8.

### Hand-off пакет `/handoff/*` (внутрішній, не сайт)

Сторінок: 4 (напр. `/handoff/index.html`)

| Сутність | Де | Сторінок | Приклад | → Токен |
|---|---|---|---|---|
| Serif 18/18, 400, 0 | `span.sr-only` | 1/4 | Science At Risk | sr-only (не видно) |
| Serif 27/27, 400, -0.013em | `span.block.whitespace-nowrap.font-` | 2/4 | SC!ENCE AT R!SK! | логотип (окремо) |
| Serif 28/34, 400, -0.02em | `span`, `span.hover.hover--black` | 1/4 | Igor Komarov | h3 28/36 |
| Serif 28/34, 400, 0 | `h2`, `h2.hf-h2` | 2/4 | Start here | h3 28/36 |
| Serif 31.5/47.2, 400, -0.02em | `a.satr-dim.absolute.left-0` | 1/4 | !!! | h3 28/36 |
| Serif 34.3/40, 400, -0.02em | `a.satr-hover-underline.text-brand-` | 1/4 | Remembering the Oblivion. How the  | h2 36/44 |
| Serif 36/42, 400, -0.02em | `h2.nothing__title` | 1/4 | We didn't find anything for your q | h2 36/44 |
| Serif 40.5/47.2, 400, -0.02em | `h2.h2`, `span.satr-hover-underline` | 2/4 | Impact of the War on Different Cat | h2 36/44 |
| Serif 40.5/47.2, 400, 0 | `h3.block-404__title` | 1/4 | This page does not exist | h2 36/44 |
| Serif 56/61.6, 400, 0 | `h1`, `h1.hf-title` | 2/4 | Hand-off package | h1-entity 48/56 |
| Serif 60/64.2, 400, -0.02em | `h2.m-0.max-w-[18ch].font-heading` | 1/4 | Find partners in Ukrainian science | h1 72/76 |
| Serif 63.9/68.4, 400, -0.02em | `h2.mb-4.font-heading.text-h1` | 1/4 | Want to help? | h1 72/76 |
| Serif 71/76, 400, -0.02em | `h2.font-heading.text-h1.hyphens-au` | 1/4 | Infrastructure recovery | h1 72/76 |
| Serif 72/76, 400, -0.02em | `h1.search-hero__title` | 1/4 | Find partners in Ukrainian science | h1 72/76 |
| Serif 74.2/79.1, 400, -0.02em | `h2.mb-4.font-heading.text-h1`, `h1.h1` | 1/4 | Component states | h1 72/76 |
| Serif 91/97.4, 400, -0.02em | `h2.font-heading.text-h1.hyphens-au` | 1/4 | Research | h1 72/76 |
| monospace 12/18, 400, 0 | `code` | 1/4 | <div class="breadcrumbs"> <ul item | ПРИБРАТИ (чужий шрифт) |
| Mono 12/16.8, 400, -0.03em | `span` | 1/4 | Stories | ui-s 14/20 |
| Mono 14/20, 400, 0 | `figcaption.hf-label` | 1/4 | Breadcrumbs (scientists.html) | ui-s 14/20 |
| Mono 14/20, 400, -0.03em | `a`, `p.satr-field-error` | 2/4 | Science at Risk | ui-s 14/20 |
| Mono 14/14, 400, 0 | `summary` | 1/4 | Markup | ui-s 14/20 |
| Mono 14/21.7, 400, -0.03em | `a`, `li.breadcrumbs__divider` | 1/4 | Science at Risk | ui-s 14/20 |
| Mono 14/19.6, 400, -0.03em | `span` | 1/4 | Main | ui-s 14/20 |
| Mono 14/14, 400, -0.03em | `span.satr-tag__number` | 2/4 | 100 | ui-s 14/20 |
| Mono 14/18.2, 400, 0 | `span.story-card__type` | 1/4 | Stories | ui-s 14/20 |
| Mono 14/18.2, 400, -0.03em | `span.tag.research-card__new` | 1/4 | New | ui-s 14/20 |
| Mono 15/23.2, 400, 0 | `p.expert-card__text`, `p.infrastructures__text-left` | 1/4 | Educational and Scientific Institu | ui-s 14/20 |
| Mono 15/22, 400, 0 | `a.satr-squircle-link`, `a.satr-squircle-link.satr-squircle` | 2/4 | Log in | ui-m 16/24 |
| Mono 15/19.5, 400, 0 | `time.research-card__date` | 1/4 | 30.07.26 | ui-s 14/20 |
| Mono 15.8/27, 400, 0 | `span.satr-underlined`, `span` | 2/4 | ENG | ui-m 16/24 |
| Mono 16/24, 400, 0 | `span`, `p.hf-note` | 2/4 | What is in the package, what is th | ui-m 16/24 |
| Mono 16/24.8, 400, 0 | `a`, `p.hf-lede` | 1/4 | Cut out of the live pages, with th | ui-m 16/24 |
| Mono 16/23.2, 400, -0.03em | `span.tag.expert-card__tag` | 1/4 | Natural sciences | ui-m 16/24 |
| Mono 16/0, 400, -0.03em | `span.tag__number` | 1/4 | 100 | ui-m 16/24 |
| Mono 16.9/24.8, 400, 0 | `figcaption.spec__label`, `p.outdated__text` | 1/4 | Black | ui-m 16/24 |
| Mono 18/29.2, 300, 0 | `p.doc__lede.text`, `p.text` | 1/4 | The components of the live site wi | ui-l 18/28 |
| Mono 18/26, 300, 0 | `label.satr-float__label.font-text.`, `label.satr-float__label.font-text.` | 2/4 | Name | ui-l 18/28 |
| Mono 18/27.9, 300, 0 | `p.loader__text` | 1/4 | We are looking for scientists. | ui-l 18/28 |
| Mono 18/28, 300, 0 | `span.satr-float__label.max-w-full.` | 1/4 | Enter scientific field or name | ui-l 18/28 |
| monospace 18/29.2, 300, 0 | `code` | 1/4 | src/components | ПРИБРАТИ (чужий шрифт) |
| Mono 18/27.9, 400, 0 | `button.nothing__tag-link`, `p.paper-card__text` | 1/4 | Ph.D., professor | ui-l 18/28 |
| Mono 18/28, 400, 0 | `a`, `p` | 1/4 | For the developers building the Hu | ui-m 16/24 |
| Mono 18/28, 400, -0.03em | `span`, `button.satr-squircle.satr-squircle` | 3/4 | Read Story | ui-l 18/28 |
| Mono 18/29.2, 400, 0 | `p.m-0.font-text.text-[0.9375rem]` | 1/4 | How the Odesa National Fine Arts M | ui-l 18/28 |
| Mono 18/26, 400, -0.03em | `button.popular-requests__tags.tag` | 1/4 | Teaching | ui-l 18/28 |
| Mono 18/18, 400, 0 | `span.satr-underlined`, `legend.sr-only` | 2/4 | Search in | ui-l 18/28 |
| Mono 18/27, 400, -0.03em | `p.mb-3.font-text.text-text1-mobile` | 1/4 | Popular requests | ui-l 18/28 |
| Mono 18/18, 400, 0, uppercase | `span.satr-underlined` | 1/4 | All projects | ui-l 18/28 |
| Mono 18/27.9, 400, -0.03em | `p.story-card__data` | 1/4 | 12.08.26 | ui-l 18/28 |
| Mono 18.9/27.2, 400, -0.01em | `p.mt-4.max-w-2xl.font-text` | 1/4 | Scientific infrastructure damaged  | ui-l 18/28 |
| Mono 18.9/29.6, 400, -0.03em | `p.mb-1.font-ui.text-text1-mobile` | 1/4 | Required amount | ui-l 18/28 |
| Mono 18.9/27.2, 400, 0 | `p.font-text.text-text2-desktop` | 1/4 | ~ 500 000 UAH | ui-l 18/28 |
| Mono 20/30, 400, -0.01em | `p.m-0.font-text.text-brand-black`, `span.satr-underlined` | 1/4 | Mark the scientific field that int | text-l 22/34 |
| monospace 20.2/31.5, 400, 0 | `code` | 1/4 | src/components/Button | ПРИБРАТИ (чужий шрифт) |
| Mono 20.2/31.5, 400, 0 | `summary`, `p.spec__note` | 1/4 | Skip to content | text-l 22/34 |
| Mono 20.2/31.5, 400, -0.03em | `span.ml-auto.text-white/85`, `p.font-ui.text-text1-mobile.text-w` | 1/4 | Stories | text-l 22/34 |
| Mono 20.2/31.5, 700, 0 | `p.outdated__title` | 1/4 | English version may be out of date | text-l 22/34 |
| Mono 22/26, 300, 0 | `span.satr-float__label` | 1/4 | Enter name, scientific field or sp | text-l 22/34 |
| Mono 22/0, 400, -0.03em | `a.pagination__number`, `span.pagination__number.pagination` | 1/4 | 1 | text-l 22/34 |
| Mono 22/28, 400, -0.03em | `span.hover.hover--black` | 1/4 | Previous | text-l 22/34 |
| Mono 22.9/35.5, 400, 0 | `p.paragraph` | 1/4 | Igor leads the Institute of High T | text-l 22/34 |
| Mono 23.7/35.5, 400, -0.01em | `span.satr-underlined` | 1/4 | All projects | text-l 22/34 |
| Mono 24.3/37.9, 400, -0.03em | `p.mt-4.font-text.text-text1-deskto` | 1/4 | Author(-s): Olena Kozak, Lidia Kuz | text-l 22/34 |
| Mono 24.3/34.9, 400, -0.01em | `p.mt-4.max-w-2xl.font-text` | 1/4 | Formalized and organized experienc | text-l 22/34 |
| Mono 24.3/34.9, 400, 0 | `p.font-text.text-text2-desktop` | 1/4 | .pdf | text-l 22/34 |
| Mono 24.8/31.5, 400, -0.03em | `a.satr-hover-underline.satr-hover-`, `p.mb-4.max-w-[280px].font-ui` | 2/4 | Centre of Excellence on Science at | text-l 22/34 |
| Mono 27/36, 400, 0 | `span.block.border-b-[3px].border-t` | 1/4 | Scientists | ui-xl 28/36 |
| Mono 27/36, 500, 0 | `span.block.border-b-[3px].border-t`, `span.scope-tabs__word` | 2/4 | Scientists | ui-xl 28/36 |
| Mono 30.3/45.5, 400, -0.01em | `span.satr-underlined` | 1/4 | Show all studies | ui-xl 28/36 |

Розміри на телефоні 390: 12, 14, 15, 15.8, 16, 16.9, 18, 18.7, 20, 20.2, 22.5, 24, 24.1, 28, 31.5, 32, 32.6, 36. На десктопі: 29 розмірів, на телефоні 18.

### Окремі сторінки

#### `/about.html` (About us)

| Сутність | Де | Сторінок | Приклад | → Токен |
|---|---|---|---|---|
| Serif 27/27, 400, -0.013em | `span.block.whitespace-nowrap.font-` | 1/1 | SC!ENCE AT R!SK! | логотип (окремо) |
| Serif 28.6/37.2, 400, -0.02em | `h3.heading.heading--h3` | 1/1 | Our mission | h3 28/36 |
| Serif 72/76, 400, -0.02em | `h1.story__main-title`, `h2.mb-4.font-heading.text-h1` | 1/1 | About us | h1 72/76 |
| Mono 14/20, 400, -0.03em | `p.sr-only`, `span.ml-auto.text-white/85` | 1/1 | Please shorten your inquiry. | ui-s 14/20 |
| Mono 14/19.6, 400, -0.03em | `span` | 1/1 | Main | ui-s 14/20 |
| Mono 14/21.7, 400, -0.03em | `li.breadcrumbs__divider` | 1/1 | / | ui-s 14/20 |
| Mono 15/22, 400, 0 | `a.satr-squircle-link` | 1/1 | Log in | ui-m 16/24 |
| Mono 15.8/27, 400, 0 | `span.satr-underlined`, `span` | 1/1 | ENG | ui-m 16/24 |
| Mono 18/26, 300, 0 | `label.satr-float__label.font-text.` | 1/1 | Name | ui-l 18/28 |
| Mono 18/28, 400, -0.03em | `button.satr-squircle.satr-squircle` | 1/1 | Send | ui-l 18/28 |
| Mono 18.3/28.4, 400 italic, 0 | `i` | 1/1 | The project is supported by Press, | ui-l 18/28 |
| Mono 22/28, 400, -0.03em | `a.satr-hover-underline.satr-hover-`, `p.mb-4.max-w-[280px].font-ui` | 1/1 | Fill out the form or contact us | text-l 22/34 |
| Mono 22.9/35.5, 400, 0 | `p.paragraph`, `a` | 1/1 | Science at Risk | text-l 22/34 |
| Mono 22.9/35.5, 700, 0 | `b` | 1/1 | Directions of work | text-l 22/34 |

Розміри на телефоні 390: 14, 14.4, 15.1, 18, 20.2, 22.5, 32, 32.6.

#### `/cabinet-screens.html` (Cabinet screens — review)

| Сутність | Де | Сторінок | Приклад | → Токен |
|---|---|---|---|---|
| Serif 32/38, 400, 0 | `h1` | 1/1 | Cabinet: sign-in screens | h3 28/36 |
| Mono 14/20, 400, 0 | `small` | 1/1 | Try the password “wrong”, or open  | ui-s 14/20 |
| Mono 16/26, 400, 0 | `a`, `td` | 1/1 | The flow: letter → log in → choose | ui-s 14/20 |

Розміри на телефоні 390: 14, 16, 32.

#### `/contacts.html` (About us)

| Сутність | Де | Сторінок | Приклад | → Токен |
|---|---|---|---|---|
| Serif 27/27, 400, -0.013em | `span.block.whitespace-nowrap.font-` | 1/1 | SC!ENCE AT R!SK! | логотип (окремо) |
| Serif 28.6/37.2, 400, -0.02em | `h3.heading.heading--h3` | 1/1 | Our mission | h3 28/36 |
| Serif 72/76, 400, -0.02em | `h1.story__main-title`, `h2.mb-4.font-heading.text-h1` | 1/1 | About us | h1 72/76 |
| Mono 14/20, 400, -0.03em | `p.sr-only`, `span.ml-auto.text-white/85` | 1/1 | Please shorten your inquiry. | ui-s 14/20 |
| Mono 14/19.6, 400, -0.03em | `span` | 1/1 | Main | ui-s 14/20 |
| Mono 14/21.7, 400, -0.03em | `li.breadcrumbs__divider` | 1/1 | / | ui-s 14/20 |
| Mono 15/22, 400, 0 | `a.satr-squircle-link` | 1/1 | Log in | ui-m 16/24 |
| Mono 15.8/27, 400, 0 | `span.satr-underlined`, `span` | 1/1 | ENG | ui-m 16/24 |
| Mono 18/26, 300, 0 | `label.satr-float__label.font-text.` | 1/1 | Name | ui-l 18/28 |
| Mono 18/28, 400, -0.03em | `button.satr-squircle.satr-squircle` | 1/1 | Send | ui-l 18/28 |
| Mono 18.3/28.4, 400 italic, 0 | `i` | 1/1 | The project is supported by Press, | ui-l 18/28 |
| Mono 22/28, 400, -0.03em | `a.satr-hover-underline.satr-hover-`, `p.mb-4.max-w-[280px].font-ui` | 1/1 | Fill out the form or contact us | text-l 22/34 |
| Mono 22.9/35.5, 400, 0 | `p.paragraph`, `a` | 1/1 | Science at Risk | text-l 22/34 |
| Mono 22.9/35.5, 700, 0 | `b` | 1/1 | Directions of work | text-l 22/34 |

Розміри на телефоні 390: 14, 14.4, 15.1, 18, 20.2, 22.5, 32, 32.6.

#### `/first-login.html` (First log in — Science At Risk)

| Сутність | Де | Сторінок | Приклад | → Токен |
|---|---|---|---|---|
| Serif 27/27, 400, -0.013em | `span.block.whitespace-nowrap.font-` | 1/1 | SC!ENCE AT R!SK! | логотип (окремо) |
| Serif 48/54, 400, -0.02em | `h1.satr-auth__title` | 1/1 | First log in | h1-entity 48/56 |
| Serif 72/76, 400, -0.02em | `h2.mb-4.font-heading.text-h1` | 1/1 | Want to help? | h1 72/76 |
| Mono 14/20, 400, -0.03em | `p.sr-only`, `span.ml-auto.text-white/85` | 1/1 | Please shorten your inquiry. | ui-s 14/20 |
| Mono 14/20, 400, 0 | `span` | 1/1 | Copy it from the letter. It works  | ui-s 14/20 |
| Mono 15/22, 400, 0 | `a.satr-squircle-link` | 1/1 | Log in | ui-m 16/24 |
| Mono 15.8/27, 400, 0 | `span.satr-underlined`, `span` | 1/1 | ENG | ui-m 16/24 |
| Mono 16/24, 400, 0 | `a.satr-auth__link`, `p` | 1/1 | Lost the letter or the password do | ui-m 16/24 |
| Mono 18/26, 300, 0 | `label.satr-float__label.font-text.`, `label.satr-float__label.font-ukrai` | 1/1 | Email | ui-l 18/28 |
| Mono 18/28, 400, 0 | `p.satr-auth__lede` | 1/1 | Use the email address your invitat | ui-l 18/28 |
| Mono 18/26, 400, 0 | `p.satr-auth__aside-title` | 1/1 | Entry is by invitation only | ui-l 18/28 |
| Mono 18/28, 400, -0.03em | `button.satr-auth__btn`, `button.satr-squircle.satr-squircle` | 1/1 | Continue | ui-l 18/28 |
| Mono 22/28, 400, -0.03em | `a.satr-hover-underline.satr-hover-`, `p.mb-4.max-w-[280px].font-ui` | 1/1 | Fill out the form or contact us | text-l 22/34 |

Розміри на телефоні 390: 14, 15.1, 16, 18, 20.2, 32, 36.2.

#### `/forgot-password.html` (Forgot your password? — Science At Risk)

| Сутність | Де | Сторінок | Приклад | → Токен |
|---|---|---|---|---|
| Serif 27/27, 400, -0.013em | `span.block.whitespace-nowrap.font-` | 1/1 | SC!ENCE AT R!SK! | логотип (окремо) |
| Serif 48/54, 400, -0.02em | `h1.satr-auth__title` | 1/1 | Forgot your password? | h1-entity 48/56 |
| Serif 72/76, 400, -0.02em | `h2.mb-4.font-heading.text-h1` | 1/1 | Want to help? | h1 72/76 |
| Mono 14/20, 400, -0.03em | `p.sr-only`, `span.ml-auto.text-white/85` | 1/1 | Please shorten your inquiry. | ui-s 14/20 |
| Mono 15/22, 400, 0 | `a.satr-squircle-link` | 1/1 | Log in | ui-m 16/24 |
| Mono 15.8/27, 400, 0 | `span.satr-underlined`, `span` | 1/1 | ENG | ui-m 16/24 |
| Mono 16/24, 400, 0 | `a.satr-auth__link` | 1/1 | Back to log in | ui-m 16/24 |
| Mono 18/26, 300, 0 | `label.satr-float__label.font-text.`, `label.satr-float__label.font-ukrai` | 1/1 | Email | ui-l 18/28 |
| Mono 18/28, 400, 0 | `p.satr-auth__lede` | 1/1 | Enter your email. If you were invi | ui-l 18/28 |
| Mono 18/28, 400, -0.03em | `button.satr-auth__btn`, `button.satr-squircle.satr-squircle` | 1/1 | Send the letter | ui-l 18/28 |
| Mono 22/28, 400, -0.03em | `a.satr-hover-underline.satr-hover-`, `p.mb-4.max-w-[280px].font-ui` | 1/1 | Fill out the form or contact us | text-l 22/34 |

Розміри на телефоні 390: 14, 15.1, 16, 18, 20.2, 32, 36.2.

#### `/infrastructures.html` (Infrastructures)

| Сутність | Де | Сторінок | Приклад | → Токен |
|---|---|---|---|---|
| Serif 27/27, 400, -0.013em | `span.block.whitespace-nowrap.font-` | 1/1 | SC!ENCE AT R!SK! | логотип (окремо) |
| Serif 28/34, 400, -0.02em | `span` | 1/1 | Research and technology complex "I | h3 28/36 |
| Serif 72/76, 400, -0.02em | `h1.infrastructures-hero__title`, `h2.mb-4.font-heading.text-h1` | 1/1 | Assistance in reconstruction | h1 72/76 |
| Mono 14/20, 400, -0.03em | `p.sr-only`, `span.ml-auto.text-white/85` | 1/1 | Please shorten your inquiry. | ui-s 14/20 |
| Mono 14/19.6, 400, -0.03em | `span` | 1/1 | Main | ui-s 14/20 |
| Mono 14/21.7, 400, -0.03em | `li.breadcrumbs__divider` | 1/1 | / | ui-s 14/20 |
| Mono 15/23.2, 400, 0 | `p.infrastructures__text-left`, `p.infrastructures__text-right` | 1/1 | Science Domain | ui-s 14/20 |
| Mono 15/22, 400, 0 | `a.satr-squircle-link` | 1/1 | Log in | ui-m 16/24 |
| Mono 15.8/27, 400, 0 | `span.satr-underlined`, `span` | 1/1 | ENG | ui-m 16/24 |
| Mono 16/23.2, 400, -0.03em | `span.tag.expert-card__tag` | 1/1 | Natural sciences | ui-m 16/24 |
| Mono 18/26, 300, 0 | `label.satr-float__label.font-text.` | 1/1 | Name | ui-l 18/28 |
| Mono 18/27.9, 400, 0 | `p.infrastructures-card__text`, `p` | 1/1 | Research and technology complex "I | ui-l 18/28 |
| Mono 18/27.9, 400, -0.03em | `p` | 1/1 | Institution and object | ui-l 18/28 |
| Mono 18/28, 400, -0.03em | `button.satr-squircle.satr-squircle` | 1/1 | Send | ui-l 18/28 |
| Mono 22/28, 400, -0.03em | `a.satr-hover-underline.satr-hover-`, `p.mb-4.max-w-[280px].font-ui` | 1/1 | Fill out the form or contact us | text-l 22/34 |
| Mono 22/34.1, 400, 0 | `p.infrastructures-hero__text` | 1/1 | Scientific infrastructure damaged  | text-l 22/34 |

Розміри на телефоні 390: 14, 15, 15.1, 18, 20.2, 24.1, 32, 32.6.

#### `/link-sent.html` (Check your email — Science At Risk)

| Сутність | Де | Сторінок | Приклад | → Токен |
|---|---|---|---|---|
| Serif 27/27, 400, -0.013em | `span.block.whitespace-nowrap.font-` | 1/1 | SC!ENCE AT R!SK! | логотип (окремо) |
| Serif 48/54, 400, -0.02em | `h1.satr-auth__title` | 1/1 | Check your email | h1-entity 48/56 |
| Serif 72/76, 400, -0.02em | `h2.mb-4.font-heading.text-h1` | 1/1 | Want to help? | h1 72/76 |
| Mono 14/20, 400, 0 | `p.satr-auth__under` | 1/1 | It can take a few minutes. If it d | ui-s 14/20 |
| Mono 14/20, 400, -0.03em | `p.sr-only`, `span.ml-auto.text-white/85` | 1/1 | Please shorten your inquiry. | ui-s 14/20 |
| Mono 15/22, 400, 0 | `a.satr-squircle-link` | 1/1 | Log in | ui-m 16/24 |
| Mono 15.8/27, 400, 0 | `span.satr-underlined`, `span` | 1/1 | ENG | ui-m 16/24 |
| Mono 16/24, 400, 0 | `a.satr-auth__link` | 1/1 | Try another address | ui-m 16/24 |
| Mono 18/26, 300, 0 | `label.satr-float__label.font-text.` | 1/1 | Name | ui-l 18/28 |
| Mono 18/28, 400, 0 | `p.satr-auth__lede` | 1/1 | If this address is in the system,  | ui-l 18/28 |
| Mono 18/28, 400, -0.03em | `a.satr-auth__btn`, `button.satr-squircle.satr-squircle` | 1/1 | Back to log in | ui-l 18/28 |
| Mono 22/28, 400, -0.03em | `a.satr-hover-underline.satr-hover-`, `p.mb-4.max-w-[280px].font-ui` | 1/1 | Fill out the form or contact us | text-l 22/34 |
| Mono 56/56, 400, 0 | `p.satr-auth__mark` | 1/1 | !!! | display-знак (!!!, окремо) |

Розміри на телефоні 390: 14, 15.1, 16, 18, 20.2, 32, 36.2, 56.

#### `/login.html` (Log in — Science At Risk)

| Сутність | Де | Сторінок | Приклад | → Токен |
|---|---|---|---|---|
| Serif 27/27, 400, -0.013em | `span.block.whitespace-nowrap.font-` | 1/1 | SC!ENCE AT R!SK! | логотип (окремо) |
| Serif 48/54, 400, -0.02em | `h1.satr-auth__title` | 1/1 | Log in | h1-entity 48/56 |
| Serif 72/76, 400, -0.02em | `h2.mb-4.font-heading.text-h1` | 1/1 | Want to help? | h1 72/76 |
| Mono 14/20, 400, -0.03em | `p.sr-only`, `span.ml-auto.text-white/85` | 1/1 | Please shorten your inquiry. | ui-s 14/20 |
| Mono 14/14, 400, -0.03em | `button.satr-auth__reveal` | 1/1 | Show | ui-s 14/20 |
| Mono 15/22, 400, 0 | `a.satr-squircle-link` | 1/1 | Log in | ui-m 16/24 |
| Mono 15.8/27, 400, 0 | `span.satr-underlined`, `span` | 1/1 | ENG | ui-m 16/24 |
| Mono 16/24, 400, 0 | `a.satr-auth__link`, `p` | 1/1 | Forgot password? | ui-m 16/24 |
| Mono 18/26, 300, 0 | `label.satr-float__label.font-text.`, `label.satr-float__label.font-ukrai` | 1/1 | Email | ui-l 18/28 |
| Mono 18/28, 400, 0 | `p.satr-auth__lede` | 1/1 | Enter the email and the password y | ui-l 18/28 |
| Mono 18/26, 400, 0 | `p.satr-auth__aside-title` | 1/1 | Entry is by invitation only | ui-l 18/28 |
| Mono 18/28, 400, -0.03em | `button.satr-auth__btn`, `button.satr-squircle.satr-squircle` | 1/1 | Log in | ui-l 18/28 |
| Mono 22/28, 400, -0.03em | `a.satr-hover-underline.satr-hover-`, `p.mb-4.max-w-[280px].font-ui` | 1/1 | Fill out the form or contact us | text-l 22/34 |

Розміри на телефоні 390: 14, 15.1, 16, 18, 20.2, 32, 36.2.

#### `/password-saved.html` (Password saved — Science At Risk)

| Сутність | Де | Сторінок | Приклад | → Токен |
|---|---|---|---|---|
| Serif 27/27, 400, -0.013em | `span.block.whitespace-nowrap.font-` | 1/1 | SC!ENCE AT R!SK! | логотип (окремо) |
| Serif 48/54, 400, -0.02em | `h1.satr-auth__title` | 1/1 | Password saved | h1-entity 48/56 |
| Serif 72/76, 400, -0.02em | `h2.mb-4.font-heading.text-h1` | 1/1 | Want to help? | h1 72/76 |
| Mono 14/20, 400, -0.03em | `p.sr-only`, `span.ml-auto.text-white/85` | 1/1 | Please shorten your inquiry. | ui-s 14/20 |
| Mono 15/22, 400, 0 | `a.satr-squircle-link` | 1/1 | Log in | ui-m 16/24 |
| Mono 15.8/27, 400, 0 | `span.satr-underlined`, `span` | 1/1 | ENG | ui-m 16/24 |
| Mono 18/26, 300, 0 | `label.satr-float__label.font-text.` | 1/1 | Name | ui-l 18/28 |
| Mono 18/28, 400, 0 | `p.satr-auth__lede` | 1/1 | You are in. Welcome to the communi | ui-l 18/28 |
| Mono 18/28, 400, -0.03em | `a.satr-auth__btn`, `button.satr-squircle.satr-squircle` | 1/1 | Go to my cabinet | ui-l 18/28 |
| Mono 22/28, 400, -0.03em | `a.satr-hover-underline.satr-hover-`, `p.mb-4.max-w-[280px].font-ui` | 1/1 | Fill out the form or contact us | text-l 22/34 |
| Mono 56/56, 400, 0 | `p.satr-auth__mark` | 1/1 | !!! | display-знак (!!!, окремо) |

Розміри на телефоні 390: 14, 15.1, 16, 18, 20.2, 32, 36.2, 56.

#### `/research.html` (Research)

| Сутність | Де | Сторінок | Приклад | → Токен |
|---|---|---|---|---|
| Serif 27/27, 400, -0.013em | `span.block.whitespace-nowrap.font-` | 1/1 | SC!ENCE AT R!SK! | логотип (окремо) |
| Serif 28/34, 400, -0.02em | `span` | 1/1 | Impact of the War on Different Cat | h3 28/36 |
| Serif 72/76, 400, -0.02em | `h1.papers-hero__title`, `h2.mb-4.font-heading.text-h1` | 1/1 | Research | h1 72/76 |
| Mono 14/20, 400, -0.03em | `p.sr-only`, `span.ml-auto.text-white/85` | 1/1 | Please shorten your inquiry. | ui-s 14/20 |
| Mono 14/19.6, 400, -0.03em | `span` | 1/1 | Main | ui-s 14/20 |
| Mono 14/24, 400, -0.034em | `span.research-filter__count` | 1/1 | 16 | ui-s 14/20 |
| Mono 14/18.2, 400, -0.03em | `span.tag.research-card__new` | 1/1 | New | ui-s 14/20 |
| Mono 14/21.7, 400, -0.03em | `li.breadcrumbs__divider` | 1/1 | / | ui-s 14/20 |
| Mono 15/19.5, 400, 0 | `time.research-card__date` | 1/1 | 30.07.26 | ui-s 14/20 |
| Mono 15/22, 400, 0 | `a.satr-squircle-link` | 1/1 | Log in | ui-m 16/24 |
| Mono 15.8/27, 400, 0 | `span.satr-underlined`, `span` | 1/1 | ENG | ui-m 16/24 |
| Mono 16/24, 400, -0.03em | `button.research-filter__tag.btn.bt` | 1/1 | All topics | ui-m 16/24 |
| Mono 18/26, 300, 0 | `label.satr-float__label.font-text.` | 1/1 | Name | ui-l 18/28 |
| Mono 18/27.9, 400, 0 | `p.paper-card__text`, `a.research-card__author.hover.hove` | 1/1 | Showing 16 of 16 | ui-l 18/28 |
| Mono 18/28, 400, -0.03em | `button.satr-squircle.satr-squircle` | 1/1 | Send | ui-l 18/28 |
| Mono 22/28, 400, -0.03em | `a.satr-hover-underline.satr-hover-`, `span.hover.hover--black` | 1/1 | Previous | text-l 22/34 |
| Mono 22/34.1, 400, 0 | `p.papers-hero__text` | 1/1 | Formalized and organized experienc | text-l 22/34 |
| Mono 22/0, 400, -0.03em | `span.pagination__number.pagination`, `a.pagination__number` | 1/1 | 1 | text-l 22/34 |

Розміри на телефоні 390: 14, 15, 15.1, 16, 18, 20.2, 24.1, 32, 32.6.

#### `/scientists-tag-biochemistry.html` (Find Ukrainian scientists for collaboration)

| Сутність | Де | Сторінок | Приклад | → Токен |
|---|---|---|---|---|
| Serif 27/27, 400, -0.013em | `span.block.whitespace-nowrap.font-` | 1/1 | SC!ENCE AT R!SK! | логотип (окремо) |
| Serif 28/34, 400, -0.02em | `span` | 1/1 | Igor Komarov | h3 28/36 |
| Serif 72/76, 400, -0.02em | `h1.search-hero__title`, `h2.mb-4.font-heading.text-h1` | 1/1 | Find partners in Ukrainian science | h1 72/76 |
| Mono 14/20, 400, -0.03em | `p.sr-only`, `span.ml-auto.text-white/85` | 1/1 | Please shorten your inquiry. | ui-s 14/20 |
| Mono 14/19.6, 400, -0.03em | `span` | 1/1 | Main | ui-s 14/20 |
| Mono 14/21.7, 400, -0.03em | `li.breadcrumbs__divider` | 1/1 | / | ui-s 14/20 |
| Mono 15/23.2, 400, 0 | `p.expert-card__text` | 1/1 | Educational and Scientific Institu | ui-s 14/20 |
| Mono 15/22, 400, 0 | `a.satr-squircle-link` | 1/1 | Log in | ui-m 16/24 |
| Mono 15.8/27, 400, 0 | `span.satr-underlined`, `span` | 1/1 | ENG | ui-m 16/24 |
| Mono 16/24.8, 400, 0 | `p.popular-requests__text` | 1/1 | Popular requests | ui-m 16/24 |
| Mono 16/0, 400, -0.03em | `span.tag__number` | 1/1 | 100 | ui-m 16/24 |
| Mono 18/26, 300, 0 | `label.satr-float__label.font-text.`, `span.satr-float__label` | 1/1 | Enter name, scientific field or sp | ui-l 18/28 |
| Mono 18/28, 400, -0.03em | `button.expert-card__tag.tag`, `button.btn.btn--black` | 1/1 | Find scientists | ui-l 18/28 |
| Mono 18/27.9, 400, 0 | `p.expert-card__subtitle` | 1/1 | Ph.D., professor | ui-l 18/28 |
| Mono 18/26, 400, -0.03em | `button.popular-requests__tags.tag` | 1/1 | Teaching | ui-l 18/28 |
| Mono 22/28, 400, -0.03em | `a.satr-hover-underline.satr-hover-`, `span.hover.hover--black` | 1/1 | Previous | text-l 22/34 |
| Mono 22/0, 400, -0.03em | `a.pagination__number`, `span.pagination__number.pagination` | 1/1 | 1 | text-l 22/34 |
| Mono 22.9/35.5, 400, 0 | `p.paragraph` | 1/1 | Igor leads the Institute of High T | text-l 22/34 |
| Mono 27/36, 500, 0 | `span.scope-tabs__word` | 1/1 | Scientists | ui-xl 28/36 |

Розміри на телефоні 390: 14, 15.1, 16, 18, 20.2, 22.5, 24.1, 32, 32.6.

#### `/scientists-tag-biology.html` (Find Ukrainian scientists for collaboration)

| Сутність | Де | Сторінок | Приклад | → Токен |
|---|---|---|---|---|
| Serif 27/27, 400, -0.013em | `span.block.whitespace-nowrap.font-` | 1/1 | SC!ENCE AT R!SK! | логотип (окремо) |
| Serif 28/34, 400, -0.02em | `span` | 1/1 | Molodchenkova Olga | h3 28/36 |
| Serif 72/76, 400, -0.02em | `h1.search-hero__title`, `h2.mb-4.font-heading.text-h1` | 1/1 | Find partners in Ukrainian science | h1 72/76 |
| Mono 14/20, 400, -0.03em | `p.sr-only`, `span.ml-auto.text-white/85` | 1/1 | Please shorten your inquiry. | ui-s 14/20 |
| Mono 14/19.6, 400, -0.03em | `span` | 1/1 | Main | ui-s 14/20 |
| Mono 14/21.7, 400, -0.03em | `li.breadcrumbs__divider` | 1/1 | / | ui-s 14/20 |
| Mono 15/23.2, 400, 0 | `p.expert-card__text` | 1/1 | Plant Breeding & Genetics Institut | ui-s 14/20 |
| Mono 15/22, 400, 0 | `a.satr-squircle-link` | 1/1 | Log in | ui-m 16/24 |
| Mono 15.8/27, 400, 0 | `span.satr-underlined`, `span` | 1/1 | ENG | ui-m 16/24 |
| Mono 16/24.8, 400, 0 | `p.popular-requests__text` | 1/1 | Popular requests | ui-m 16/24 |
| Mono 16/0, 400, -0.03em | `span.tag__number` | 1/1 | 100 | ui-m 16/24 |
| Mono 18/26, 300, 0 | `label.satr-float__label.font-text.`, `span.satr-float__label` | 1/1 | Enter name, scientific field or sp | ui-l 18/28 |
| Mono 18/28, 400, -0.03em | `button.expert-card__tag.tag`, `button.btn.btn--black` | 1/1 | Find scientists | ui-l 18/28 |
| Mono 18/27.9, 400, 0 | `p.expert-card__subtitle` | 1/1 | Doctor of Biological Sciences, ass | ui-l 18/28 |
| Mono 18/26, 400, -0.03em | `button.popular-requests__tags.tag` | 1/1 | Teaching | ui-l 18/28 |
| Mono 22/28, 400, -0.03em | `a.satr-hover-underline.satr-hover-`, `span.hover.hover--black` | 1/1 | Previous | text-l 22/34 |
| Mono 22/0, 400, -0.03em | `a.pagination__number`, `span.pagination__number.pagination` | 1/1 | 1 | text-l 22/34 |
| Mono 22.9/35.5, 400, 0 | `p.paragraph` | 1/1 | Olga's main activity is biochemica | text-l 22/34 |
| Mono 27/36, 500, 0 | `span.scope-tabs__word` | 1/1 | Scientists | ui-xl 28/36 |

Розміри на телефоні 390: 14, 15.1, 16, 18, 20.2, 22.5, 24.1, 32, 32.6.

#### `/scientists-tag-natural-sciences.html` (Find Ukrainian scientists for collaboration)

| Сутність | Де | Сторінок | Приклад | → Токен |
|---|---|---|---|---|
| Serif 27/27, 400, -0.013em | `span.block.whitespace-nowrap.font-` | 1/1 | SC!ENCE AT R!SK! | логотип (окремо) |
| Serif 28/34, 400, -0.02em | `span` | 1/1 | Igor Komarov | h3 28/36 |
| Serif 72/76, 400, -0.02em | `h1.search-hero__title`, `h2.mb-4.font-heading.text-h1` | 1/1 | Find partners in Ukrainian science | h1 72/76 |
| Mono 14/20, 400, -0.03em | `p.sr-only`, `span.ml-auto.text-white/85` | 1/1 | Please shorten your inquiry. | ui-s 14/20 |
| Mono 14/19.6, 400, -0.03em | `span` | 1/1 | Main | ui-s 14/20 |
| Mono 14/21.7, 400, -0.03em | `li.breadcrumbs__divider` | 1/1 | / | ui-s 14/20 |
| Mono 15/23.2, 400, 0 | `p.expert-card__text` | 1/1 | Educational and Scientific Institu | ui-s 14/20 |
| Mono 15/22, 400, 0 | `a.satr-squircle-link` | 1/1 | Log in | ui-m 16/24 |
| Mono 15.8/27, 400, 0 | `span.satr-underlined`, `span` | 1/1 | ENG | ui-m 16/24 |
| Mono 16/24.8, 400, 0 | `p.popular-requests__text` | 1/1 | Popular requests | ui-m 16/24 |
| Mono 16/0, 400, -0.03em | `span.tag__number` | 1/1 | 100 | ui-m 16/24 |
| Mono 18/26, 300, 0 | `label.satr-float__label.font-text.`, `span.satr-float__label` | 1/1 | Enter name, scientific field or sp | ui-l 18/28 |
| Mono 18/28, 400, -0.03em | `button.expert-card__tag.tag`, `button.btn.btn--black` | 1/1 | Find scientists | ui-l 18/28 |
| Mono 18/27.9, 400, 0 | `p.expert-card__subtitle` | 1/1 | Ph.D., professor | ui-l 18/28 |
| Mono 18/26, 400, -0.03em | `button.popular-requests__tags.tag` | 1/1 | Teaching | ui-l 18/28 |
| Mono 22/28, 400, -0.03em | `a.satr-hover-underline.satr-hover-`, `span.hover.hover--black` | 1/1 | Previous | text-l 22/34 |
| Mono 22/0, 400, -0.03em | `a.pagination__number`, `span.pagination__number.pagination` | 1/1 | 1 | text-l 22/34 |
| Mono 22.9/35.5, 400, 0 | `p.paragraph` | 1/1 | Igor leads the Institute of High T | text-l 22/34 |
| Mono 27/36, 500, 0 | `span.scope-tabs__word` | 1/1 | Scientists | ui-xl 28/36 |

Розміри на телефоні 390: 14, 15.1, 16, 18, 20.2, 22.5, 24.1, 32, 32.6.

#### `/scientists-tag-science-popularization.html` (Find Ukrainian scientists for collaboration)

| Сутність | Де | Сторінок | Приклад | → Токен |
|---|---|---|---|---|
| Serif 27/27, 400, -0.013em | `span.block.whitespace-nowrap.font-` | 1/1 | SC!ENCE AT R!SK! | логотип (окремо) |
| Serif 28/34, 400, -0.02em | `span` | 1/1 | Igor Komarov | h3 28/36 |
| Serif 72/76, 400, -0.02em | `h1.search-hero__title`, `h2.mb-4.font-heading.text-h1` | 1/1 | Find partners in Ukrainian science | h1 72/76 |
| Mono 14/20, 400, -0.03em | `p.sr-only`, `span.ml-auto.text-white/85` | 1/1 | Please shorten your inquiry. | ui-s 14/20 |
| Mono 14/19.6, 400, -0.03em | `span` | 1/1 | Main | ui-s 14/20 |
| Mono 14/21.7, 400, -0.03em | `li.breadcrumbs__divider` | 1/1 | / | ui-s 14/20 |
| Mono 15/23.2, 400, 0 | `p.expert-card__text`, `span.expert-card__societies-label` | 1/1 | Educational and Scientific Institu | ui-s 14/20 |
| Mono 15/22, 400, 0 | `a.satr-squircle-link` | 1/1 | Log in | ui-m 16/24 |
| Mono 15.8/27, 400, 0 | `span.satr-underlined`, `span` | 1/1 | ENG | ui-m 16/24 |
| Mono 16/24.8, 400, 0 | `p.popular-requests__text` | 1/1 | Popular requests | ui-m 16/24 |
| Mono 16/0, 400, -0.03em | `span.tag__number` | 1/1 | 100 | ui-m 16/24 |
| Mono 18/26, 300, 0 | `label.satr-float__label.font-text.`, `span.satr-float__label` | 1/1 | Enter name, scientific field or sp | ui-l 18/28 |
| Mono 18/28, 400, -0.03em | `button.expert-card__tag.tag`, `button.btn.btn--black` | 1/1 | Find scientists | ui-l 18/28 |
| Mono 18/27.9, 400, 0 | `p.expert-card__subtitle` | 1/1 | Ph.D., professor | ui-l 18/28 |
| Mono 18/26, 400, -0.03em | `button.popular-requests__tags.tag` | 1/1 | Teaching | ui-l 18/28 |
| Mono 22/28, 400, -0.03em | `a.satr-hover-underline.satr-hover-`, `span.hover.hover--black` | 1/1 | Previous | text-l 22/34 |
| Mono 22/0, 400, -0.03em | `a.pagination__number`, `span.pagination__number.pagination` | 1/1 | 1 | text-l 22/34 |
| Mono 22.9/35.5, 400, 0 | `p.paragraph` | 1/1 | Igor leads the Institute of High T | text-l 22/34 |
| Mono 27/36, 500, 0 | `span.scope-tabs__word` | 1/1 | Scientists | ui-xl 28/36 |

Розміри на телефоні 390: 14, 15.1, 16, 18, 20.2, 22.5, 24.1, 32, 32.6.

#### `/scientists-tag-teaching.html` (Find Ukrainian scientists for collaboration)

| Сутність | Де | Сторінок | Приклад | → Токен |
|---|---|---|---|---|
| Serif 27/27, 400, -0.013em | `span.block.whitespace-nowrap.font-` | 1/1 | SC!ENCE AT R!SK! | логотип (окремо) |
| Serif 28/34, 400, -0.02em | `span` | 1/1 | Blazheyevskiy M.Ye. | h3 28/36 |
| Serif 72/76, 400, -0.02em | `h1.search-hero__title`, `h2.mb-4.font-heading.text-h1` | 1/1 | Find partners in Ukrainian science | h1 72/76 |
| Mono 14/20, 400, -0.03em | `p.sr-only`, `span.ml-auto.text-white/85` | 1/1 | Please shorten your inquiry. | ui-s 14/20 |
| Mono 14/19.6, 400, -0.03em | `span` | 1/1 | Main | ui-s 14/20 |
| Mono 14/21.7, 400, -0.03em | `li.breadcrumbs__divider` | 1/1 | / | ui-s 14/20 |
| Mono 15/23.2, 400, 0 | `p.expert-card__text` | 1/1 | National University of Pharmacy | ui-s 14/20 |
| Mono 15/22, 400, 0 | `a.satr-squircle-link` | 1/1 | Log in | ui-m 16/24 |
| Mono 15.8/27, 400, 0 | `span.satr-underlined`, `span` | 1/1 | ENG | ui-m 16/24 |
| Mono 16/24.8, 400, 0 | `p.popular-requests__text` | 1/1 | Popular requests | ui-m 16/24 |
| Mono 16/0, 400, -0.03em | `span.tag__number` | 1/1 | 100 | ui-m 16/24 |
| Mono 18/26, 300, 0 | `label.satr-float__label.font-text.`, `span.satr-float__label` | 1/1 | Enter name, scientific field or sp | ui-l 18/28 |
| Mono 18/28, 400, -0.03em | `button.expert-card__tag.tag`, `button.btn.btn--black` | 1/1 | Find scientists | ui-l 18/28 |
| Mono 18/27.9, 400, 0 | `p.expert-card__subtitle` | 1/1 | Ph.D., associate professor | ui-l 18/28 |
| Mono 18/26, 400, -0.03em | `button.popular-requests__tags.tag` | 1/1 | Teaching | ui-l 18/28 |
| Mono 22/28, 400, -0.03em | `a.satr-hover-underline.satr-hover-`, `span.hover.hover--black` | 1/1 | Previous | text-l 22/34 |
| Mono 22/0, 400, -0.03em | `a.pagination__number`, `span.pagination__number.pagination` | 1/1 | 1 | text-l 22/34 |
| Mono 22.9/35.5, 400, 0 | `p.paragraph` | 1/1 | Analytical chemist, Doctor of Chem | text-l 22/34 |
| Mono 27/36, 500, 0 | `span.scope-tabs__word` | 1/1 | Scientists | ui-xl 28/36 |

Розміри на телефоні 390: 14, 15.1, 16, 18, 20.2, 22.5, 24.1, 32, 32.6.

#### `/scientists.html` (Find Ukrainian scientists for collaboration)

| Сутність | Де | Сторінок | Приклад | → Токен |
|---|---|---|---|---|
| Serif 27/27, 400, -0.013em | `span.block.whitespace-nowrap.font-` | 1/1 | SC!ENCE AT R!SK! | логотип (окремо) |
| Serif 28/34, 400, -0.02em | `span` | 1/1 | Igor Komarov | h3 28/36 |
| Serif 72/76, 400, -0.02em | `h1.search-hero__title`, `h2.mb-4.font-heading.text-h1` | 1/1 | Find partners in Ukrainian science | h1 72/76 |
| Mono 14/20, 400, -0.03em | `p.sr-only`, `span.ml-auto.text-white/85` | 1/1 | Please shorten your inquiry. | ui-s 14/20 |
| Mono 14/19.6, 400, -0.03em | `span` | 1/1 | Main | ui-s 14/20 |
| Mono 14/21.7, 400, -0.03em | `li.breadcrumbs__divider` | 1/1 | / | ui-s 14/20 |
| Mono 15/23.2, 400, 0 | `p.expert-card__text` | 1/1 | Educational and Scientific Institu | ui-s 14/20 |
| Mono 15/22, 400, 0 | `a.satr-squircle-link` | 1/1 | Log in | ui-m 16/24 |
| Mono 15.8/27, 400, 0 | `span.satr-underlined`, `span` | 1/1 | ENG | ui-m 16/24 |
| Mono 16/24.8, 400, 0 | `p.popular-requests__text` | 1/1 | Popular requests | ui-m 16/24 |
| Mono 16/0, 400, -0.03em | `span.tag__number` | 1/1 | 100 | ui-m 16/24 |
| Mono 18/26, 300, 0 | `label.satr-float__label.font-text.`, `span.satr-float__label` | 1/1 | Enter name, scientific field or sp | ui-l 18/28 |
| Mono 18/28, 400, -0.03em | `button.expert-card__tag.tag`, `button.btn.btn--black` | 1/1 | Find scientists | ui-l 18/28 |
| Mono 18/27.9, 400, 0 | `p.expert-card__subtitle` | 1/1 | Ph.D., professor | ui-l 18/28 |
| Mono 18/26, 400, -0.03em | `button.popular-requests__tags.tag` | 1/1 | Teaching | ui-l 18/28 |
| Mono 22/28, 400, -0.03em | `a.satr-hover-underline.satr-hover-`, `span.hover.hover--black` | 1/1 | Previous | text-l 22/34 |
| Mono 22/0, 400, -0.03em | `a.pagination__number`, `span.pagination__number.pagination` | 1/1 | 1 | text-l 22/34 |
| Mono 22.9/35.5, 400, 0 | `p.paragraph` | 1/1 | Igor leads the Institute of High T | text-l 22/34 |
| Mono 27/36, 500, 0 | `span.scope-tabs__word` | 1/1 | Scientists | ui-xl 28/36 |

Розміри на телефоні 390: 14, 15.1, 16, 18, 20.2, 22.5, 24.1, 32, 32.6.

#### `/set-password.html` (Choose your password — Science At Risk)

| Сутність | Де | Сторінок | Приклад | → Токен |
|---|---|---|---|---|
| Serif 27/27, 400, -0.013em | `span.block.whitespace-nowrap.font-` | 1/1 | SC!ENCE AT R!SK! | логотип (окремо) |
| Serif 48/54, 400, -0.02em | `h1.satr-auth__title` | 1/1 | Choose your password | h1-entity 48/56 |
| Serif 72/76, 400, -0.02em | `h2.mb-4.font-heading.text-h1` | 1/1 | Want to help? | h1 72/76 |
| Mono 14/20, 400, -0.03em | `p.sr-only`, `span.ml-auto.text-white/85` | 1/1 | Please shorten your inquiry. | ui-s 14/20 |
| Mono 14/22, 400, 0 | `li.satr-auth__rule`, `p.satr-auth__rules-title` | 1/1 | The password needs: | ui-s 14/20 |
| Mono 14/20, 400, 0 | `span`, `span.satr-auth__meter-label` | 1/1 | Strength | ui-s 14/20 |
| Mono 14/14, 400, -0.03em | `button.satr-auth__reveal` | 1/1 | Show | ui-s 14/20 |
| Mono 15/22, 400, 0 | `a.satr-squircle-link` | 1/1 | Log in | ui-m 16/24 |
| Mono 15.8/27, 400, 0 | `span.satr-underlined`, `span` | 1/1 | ENG | ui-m 16/24 |
| Mono 18/26, 300, 0 | `label.satr-float__label.font-text.`, `label.satr-float__label.font-ukrai` | 1/1 | New password | ui-l 18/28 |
| Mono 18/28, 400, 0 | `p.satr-auth__lede` | 1/1 | This is your first time in the cab | ui-l 18/28 |
| Mono 18/28, 400, -0.03em | `button.satr-auth__btn`, `button.satr-squircle.satr-squircle` | 1/1 | Save password | ui-l 18/28 |
| Mono 22/28, 400, -0.03em | `a.satr-hover-underline.satr-hover-`, `p.mb-4.max-w-[280px].font-ui` | 1/1 | Fill out the form or contact us | text-l 22/34 |

Розміри на телефоні 390: 14, 15.1, 16, 18, 20.2, 32, 36.2.

#### `/societies.html` (Scientific societies)

| Сутність | Де | Сторінок | Приклад | → Токен |
|---|---|---|---|---|
| Serif 27/27, 400, -0.013em | `span.block.whitespace-nowrap.font-` | 1/1 | SC!ENCE AT R!SK! | логотип (окремо) |
| Serif 28/34, 400, -0.02em | `span` | 1/1 | International Union of Innovators  | h3 28/36 |
| Serif 72/76, 400, -0.02em | `h1.search-hero__title`, `h2.mb-4.font-heading.text-h1` | 1/1 | Find partners in Ukrainian science | h1 72/76 |
| Mono 14/20, 400, -0.03em | `p.sr-only`, `span.ml-auto.text-white/85` | 1/1 | Please shorten your inquiry. | ui-s 14/20 |
| Mono 14/19.6, 400, -0.03em | `span` | 1/1 | Main | ui-s 14/20 |
| Mono 14/21.7, 400, -0.03em | `li.breadcrumbs__divider` | 1/1 | / | ui-s 14/20 |
| Mono 15/23.2, 400, 0 | `p.infrastructures__text-left` | 1/1 | Science domain | ui-s 14/20 |
| Mono 15/22, 400, 0 | `a.satr-squircle-link` | 1/1 | Log in | ui-m 16/24 |
| Mono 15.8/27, 400, 0 | `span.satr-underlined`, `span` | 1/1 | ENG | ui-m 16/24 |
| Mono 16/23.2, 400, -0.03em | `span.tag.expert-card__tag` | 1/1 | Education | ui-m 16/24 |
| Mono 16/0, 400, -0.03em | `span.tag__number` | 1/1 | 8 | ui-m 16/24 |
| Mono 18/26, 300, 0 | `label.satr-float__label.font-text.`, `span.satr-float__label` | 1/1 | Society name or domain, e.g. Medic | ui-l 18/28 |
| Mono 18/27.9, 400, 0 | `p.infrastructures-card__text`, `p.popular-requests__text` | 1/1 | Popular domains | ui-l 18/28 |
| Mono 18/26, 400, -0.03em | `button.popular-requests__tags.tag` | 1/1 | Natural sciences | ui-l 18/28 |
| Mono 18/28, 400, -0.03em | `button.btn.btn--black`, `button.satr-squircle.satr-squircle` | 1/1 | Find societies | ui-l 18/28 |
| Mono 22/28, 400, -0.03em | `a.satr-hover-underline.satr-hover-`, `span.hover.hover--black` | 1/1 | Previous | text-l 22/34 |
| Mono 22/0, 400, -0.03em | `a.pagination__number`, `span.pagination__number.pagination` | 1/1 | 1 | text-l 22/34 |
| Mono 27/36, 500, 0 | `span.scope-tabs__word` | 1/1 | Scientists | ui-xl 28/36 |

Розміри на телефоні 390: 14, 15.1, 16, 18, 20.2, 22.5, 24.1, 32, 32.6.

#### `/stories-theme-blogs.html` (Stories)

| Сутність | Де | Сторінок | Приклад | → Токен |
|---|---|---|---|---|
| Serif 27/27, 400, -0.013em | `span.block.whitespace-nowrap.font-` | 1/1 | SC!ENCE AT R!SK! | логотип (окремо) |
| Serif 28/34, 400, -0.02em | `span.hover.hover--black` | 1/1 | Free educational series "Scientifi | h3 28/36 |
| Serif 72/76, 400, -0.02em | `h1.pageStories__title`, `h2.mb-4.font-heading.text-h1` | 1/1 | Stories | h1 72/76 |
| Mono 14/20, 400, -0.03em | `p.sr-only`, `span.ml-auto.text-white/85` | 1/1 | Please shorten your inquiry. | ui-s 14/20 |
| Mono 14/18.2, 400, 0 | `span.story-card__type` | 1/1 | Blogs | ui-s 14/20 |
| Mono 14/19.6, 400, -0.03em | `span` | 1/1 | Main | ui-s 14/20 |
| Mono 14/24, 400, -0.034em | `span.stories-tags__count` | 1/1 | 72 | ui-s 14/20 |
| Mono 14/21.7, 400, -0.03em | `li.breadcrumbs__divider` | 1/1 | / | ui-s 14/20 |
| Mono 15/22, 400, 0 | `a.satr-squircle-link` | 1/1 | Log in | ui-m 16/24 |
| Mono 15.8/27, 400, 0 | `span.satr-underlined`, `span` | 1/1 | ENG | ui-m 16/24 |
| Mono 16/24, 400, -0.03em | `div.stories-tags__tag.btn.btn--bor` | 1/1 | All | ui-m 16/24 |
| Mono 18/26, 300, 0 | `label.satr-float__label.font-text.` | 1/1 | Name | ui-l 18/28 |
| Mono 18/27.9, 400, 0 | `p.story-card__text` | 1/1 | How researchers unite, develop com | ui-l 18/28 |
| Mono 18/27.9, 400, -0.03em | `p.story-card__data` | 1/1 | 24.03.26 | ui-l 18/28 |
| Mono 18/28, 400, -0.03em | `button.satr-squircle.satr-squircle` | 1/1 | Send | ui-l 18/28 |
| Mono 22/28, 400, -0.03em | `a.satr-hover-underline.satr-hover-`, `span.hover.hover--black` | 1/1 | Previous | text-l 22/34 |
| Mono 22/0, 400, -0.03em | `span.pagination__number.pagination`, `a.pagination__number` | 1/1 | 1 | text-l 22/34 |

Розміри на телефоні 390: 14, 15.1, 16, 18, 20.2, 24.1, 32, 32.6.

#### `/stories-theme-news.html` (Stories)

| Сутність | Де | Сторінок | Приклад | → Токен |
|---|---|---|---|---|
| Serif 27/27, 400, -0.013em | `span.block.whitespace-nowrap.font-` | 1/1 | SC!ENCE AT R!SK! | логотип (окремо) |
| Serif 28/34, 400, -0.02em | `span.hover.hover--black` | 1/1 | A Hit Too Close To Home. What happ | h3 28/36 |
| Serif 72/76, 400, -0.02em | `h1.pageStories__title`, `h2.mb-4.font-heading.text-h1` | 1/1 | Stories | h1 72/76 |
| Mono 14/20, 400, -0.03em | `p.sr-only`, `span.ml-auto.text-white/85` | 1/1 | Please shorten your inquiry. | ui-s 14/20 |
| Mono 14/18.2, 400, 0 | `span.story-card__type` | 1/1 | News | ui-s 14/20 |
| Mono 14/19.6, 400, -0.03em | `span` | 1/1 | Main | ui-s 14/20 |
| Mono 14/24, 400, -0.034em | `span.stories-tags__count` | 1/1 | 72 | ui-s 14/20 |
| Mono 14/21.7, 400, -0.03em | `li.breadcrumbs__divider` | 1/1 | / | ui-s 14/20 |
| Mono 15/22, 400, 0 | `a.satr-squircle-link` | 1/1 | Log in | ui-m 16/24 |
| Mono 15.8/27, 400, 0 | `span.satr-underlined`, `span` | 1/1 | ENG | ui-m 16/24 |
| Mono 16/24, 400, -0.03em | `div.stories-tags__tag.btn.btn--bor` | 1/1 | All | ui-m 16/24 |
| Mono 18/26, 300, 0 | `label.satr-float__label.font-text.` | 1/1 | Name | ui-l 18/28 |
| Mono 18/27.9, 400, 0 | `p.story-card__text` | 1/1 | How is the Institute of Biochemist | ui-l 18/28 |
| Mono 18/27.9, 400, -0.03em | `p.story-card__data` | 1/1 | 12.08.26 | ui-l 18/28 |
| Mono 18/28, 400, -0.03em | `button.satr-squircle.satr-squircle` | 1/1 | Send | ui-l 18/28 |
| Mono 22/28, 400, -0.03em | `a.satr-hover-underline.satr-hover-`, `span.hover.hover--black` | 1/1 | Previous | text-l 22/34 |
| Mono 22/0, 400, -0.03em | `span.pagination__number.pagination`, `a.pagination__number` | 1/1 | 1 | text-l 22/34 |

Розміри на телефоні 390: 14, 15.1, 16, 18, 20.2, 24.1, 32, 32.6.

#### `/stories-theme-stories.html` (Stories)

| Сутність | Де | Сторінок | Приклад | → Токен |
|---|---|---|---|---|
| Serif 27/27, 400, -0.013em | `span.block.whitespace-nowrap.font-` | 1/1 | SC!ENCE AT R!SK! | логотип (окремо) |
| Serif 28/34, 400, -0.02em | `span.hover.hover--black` | 1/1 | Uncovered Graves. How Lviv restore | h3 28/36 |
| Serif 72/76, 400, -0.02em | `h1.pageStories__title`, `h2.mb-4.font-heading.text-h1` | 1/1 | Stories | h1 72/76 |
| Mono 14/18.2, 400, 0 | `span.story-card__type` | 1/1 | Stories | ui-s 14/20 |
| Mono 14/20, 400, -0.03em | `p.sr-only`, `span.ml-auto.text-white/85` | 1/1 | Please shorten your inquiry. | ui-s 14/20 |
| Mono 14/19.6, 400, -0.03em | `span` | 1/1 | Main | ui-s 14/20 |
| Mono 14/24, 400, -0.034em | `span.stories-tags__count` | 1/1 | 72 | ui-s 14/20 |
| Mono 14/21.7, 400, -0.03em | `li.breadcrumbs__divider` | 1/1 | / | ui-s 14/20 |
| Mono 15/22, 400, 0 | `a.satr-squircle-link` | 1/1 | Log in | ui-m 16/24 |
| Mono 15.8/27, 400, 0 | `span.satr-underlined`, `span` | 1/1 | ENG | ui-m 16/24 |
| Mono 16/24, 400, -0.03em | `div.stories-tags__tag.btn.btn--bor` | 1/1 | All | ui-m 16/24 |
| Mono 18/26, 300, 0 | `label.satr-float__label.font-text.` | 1/1 | Name | ui-l 18/28 |
| Mono 18/27.9, 400, 0 | `p.story-card__text` | 1/1 | A Map of Burial Sites Revives the  | ui-l 18/28 |
| Mono 18/27.9, 400, -0.03em | `p.story-card__data` | 1/1 | 12.08.26 | ui-l 18/28 |
| Mono 18/28, 400, -0.03em | `button.satr-squircle.satr-squircle` | 1/1 | Send | ui-l 18/28 |
| Mono 22/28, 400, -0.03em | `a.satr-hover-underline.satr-hover-`, `span.hover.hover--black` | 1/1 | Previous | text-l 22/34 |
| Mono 22/0, 400, -0.03em | `a.pagination__number`, `span.pagination__number.pagination` | 1/1 | 1 | text-l 22/34 |

Розміри на телефоні 390: 14, 15.1, 16, 18, 20.2, 24.1, 32, 32.6.

#### `/stories.html` (Stories)

| Сутність | Де | Сторінок | Приклад | → Токен |
|---|---|---|---|---|
| Serif 27/27, 400, -0.013em | `span.block.whitespace-nowrap.font-` | 1/1 | SC!ENCE AT R!SK! | логотип (окремо) |
| Serif 28/34, 400, -0.02em | `span.hover.hover--black` | 1/1 | Uncovered Graves. How Lviv restore | h3 28/36 |
| Serif 72/76, 400, -0.02em | `h1.pageStories__title`, `h2.mb-4.font-heading.text-h1` | 1/1 | Stories | h1 72/76 |
| Mono 14/18.2, 400, 0 | `span.story-card__type` | 1/1 | Stories | ui-s 14/20 |
| Mono 14/20, 400, -0.03em | `p.sr-only`, `span.ml-auto.text-white/85` | 1/1 | Please shorten your inquiry. | ui-s 14/20 |
| Mono 14/19.6, 400, -0.03em | `span` | 1/1 | Main | ui-s 14/20 |
| Mono 14/24, 400, -0.034em | `span.stories-tags__count` | 1/1 | 72 | ui-s 14/20 |
| Mono 14/21.7, 400, -0.03em | `li.breadcrumbs__divider` | 1/1 | / | ui-s 14/20 |
| Mono 15/22, 400, 0 | `a.satr-squircle-link` | 1/1 | Log in | ui-m 16/24 |
| Mono 15.8/27, 400, 0 | `span.satr-underlined`, `span` | 1/1 | ENG | ui-m 16/24 |
| Mono 16/24, 400, -0.03em | `div.stories-tags__tag.btn.btn--bor` | 1/1 | All | ui-m 16/24 |
| Mono 18/26, 300, 0 | `label.satr-float__label.font-text.` | 1/1 | Name | ui-l 18/28 |
| Mono 18/27.9, 400, 0 | `p.story-card__text` | 1/1 | A Map of Burial Sites Revives the  | ui-l 18/28 |
| Mono 18/27.9, 400, -0.03em | `p.story-card__data` | 1/1 | 12.08.26 | ui-l 18/28 |
| Mono 18/28, 400, -0.03em | `button.satr-squircle.satr-squircle` | 1/1 | Send | ui-l 18/28 |
| Mono 22/28, 400, -0.03em | `a.satr-hover-underline.satr-hover-`, `span.hover.hover--black` | 1/1 | Previous | text-l 22/34 |
| Mono 22/0, 400, -0.03em | `a.pagination__number`, `span.pagination__number.pagination` | 1/1 | 1 | text-l 22/34 |

Розміри на телефоні 390: 14, 15.1, 16, 18, 20.2, 24.1, 32, 32.6.

#### `/uk.html` (Science At Risk! - допомога українським вченим)

| Сутність | Де | Сторінок | Приклад | → Токен |
|---|---|---|---|---|
| Serif 27/27, 400, -0.013em | `span.block.whitespace-nowrap.font-` | 1/1 | SC!ENCE AT R!SK! | логотип (окремо) |
| Serif 36/42, 400, -0.02em | `span.hover.hover--white`, `span` | 1/1 | Безкоштовний освітній серіал «Наук | h2 36/44 |
| Serif 72/76, 400, -0.02em | `h1.info__title`, `h2.mb-4.font-heading.text-h1` | 1/1 | Допомога у відбудові | h1 72/76 |
| Mono 14/20, 400, -0.03em | `p.sr-only`, `span.ml-auto.text-white/85` | 1/1 | Будь ласка, скоротіть ваше звернен | ui-s 14/20 |
| arial 14/14, 400, 0 | `a` | 1/1 | Made with fullPage.js | ПРИБРАТИ (чужий шрифт) |
| Mono 15/22, 400, 0 | `a.satr-squircle-link` | 1/1 | Увійти | ui-m 16/24 |
| Mono 15.8/27, 400, 0 | `a.satr-hover-underline.no-underlin`, `span` | 1/1 | ENG | ui-m 16/24 |
| Mono 16/0, 400, -0.03em | `span.tag__number` | 1/1 | 101 | ui-m 16/24 |
| Mono 18/27.9, 300, 0 | `p.list-card__price.d-md-block.d-no` | 1/1 | ~ 500000 грн | ui-l 18/28 |
| Mono 18/26, 300, 0 | `label.satr-float__label.font-text.` | 1/1 | Ім’я | ui-l 18/28 |
| Mono 18/26, 400, 0 | `p.stories__text` | 1/1 | Як дослідники об’єднуються, розвив | ui-l 18/28 |
| Mono 18/28, 400, -0.03em | `p.stories__suptitle`, `div.stories__btn.btn.btn--white` | 1/1 | Історії | ui-l 18/28 |
| Mono 18/27.9, 400, 0 | `p.list-card__text`, `p.list-card__text.list-card__text-` | 1/1 | Інститут проблем кріобіології і кр | ui-l 18/28 |
| Mono 18/26, 400, -0.03em | `div.popular-requests__tags.tag.pos` | 1/1 | Викладання | ui-l 18/28 |
| Mono 18/27.9, 400, -0.03em | `p.help__text` | 1/1 | Заклад та об’єкт | ui-l 18/28 |
| Mono 22/26, 300, 0 | `span.satr-float__label` | 1/1 | Наукова галузь / Імʼя | text-l 22/34 |
| Mono 22/34.1, 400, 0 | `p.info__info-text`, `p.hero__text` | 1/1 | Допомога українським вченим, які п | text-l 22/34 |
| Mono 22/28, 400, -0.03em | `a.satr-hover-underline.satr-hover-`, `p.mb-4.max-w-[280px].font-ui` | 1/1 | Заповніть форму або зв’яжіться з н | text-l 22/34 |
| Mono 22/26, 400, -0.03em | `a.hero__list-link.hover.hover--und`, `span.hover.hover--underline` | 1/1 | Допомога у відбудові наукової інфр | text-l 22/34 |
| Mono 22/26, 400, 0 | `span.hover.hover--white`, `button.prev.stories__nav-btn.stori` | 1/1 | < | text-l 22/34 |
| Mono 22/34.1, 400, -0.03em | `span` | 1/1 | >> | text-l 22/34 |
| Mono 22.9/35.5, 400, 0 | `span.hover.hover--underline` | 1/1 | До повної бази науковців | text-l 22/34 |

Розміри на телефоні 390: 14, 15, 15.1, 16, 18, 20, 20.2, 32, 32.6.

## 5. Додатки

- `docs/font-audit/entities.csv`: кожна сутність на кожній сторінці (532 сторінки × 2 вʼюпорти), з колонкою `proposed` для десктопа. Можна відфільтрувати в таблиці по сторінці або токену.
- `docs/font-audit/raw-1440x900.json`, `raw-390x844.json`: сирі дані обходу (включно з кольорами, прикладами, переліком завантажених шрифтів).
- `/research/page-2.html` не вдалось прочитати (сторінка перенавантажується скриптом); решта 531 сторінка успішно.