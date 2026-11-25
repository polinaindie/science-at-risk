#!/usr/bin/env python3
"""Turns docs/font-audit/raw-*.json (from scripts/font-audit.mjs) into docs/font-audit/REPORT.md + entities.csv.

    python3 -I scripts/font-audit-report.py
"""
import json, re, csv, collections, pathlib, datetime

ROOT = pathlib.Path(__file__).resolve().parent.parent
OUT = ROOT / 'docs' / 'font-audit'
desk = json.load(open(OUT / 'raw-1440x900.json'))['pages']
phone = json.load(open(OUT / 'raw-390x844.json'))['pages']
desk = {p: v for p, v in desk.items() if 'entities' in v}
phone = {p: v for p, v in phone.items() if 'entities' in v}

# ---------------------------------------------------------------- helpers
def num(s):
    return float(s.replace('px', '')) if s not in ('normal',) else 0.0

def is_react(p):
    return p in ('/', '/uk') or p.startswith('/cabinet') or p == '/handoff/index.html'

def group(p):
    if p.startswith('/cabinet') and p != '/cabinet-screens.html':
        return 'cabinet'
    if p.startswith('/handoff'):
        return 'handoff'
    if p in ('/', '/uk'):
        return 'home'
    m = re.match(r'/([a-z]+)/', p)
    return m.group(1) if m else p

GROUP_TITLE = {
    'home': 'Головна (React): `/` та `/uk`',
    'cabinet': 'Кабінет (React): `/cabinet/*`',
    'expert': 'Профіль науковця `/expert/*`',
    'story': 'Історія / стаття `/story/*`',
    'society': 'Наукове товариство `/society/*`',
    'scientists': 'Список науковців, сторінки пагінації `/scientists/*`',
    'infrastructure': 'Інфраструктура `/infrastructure/*`',
    'research': 'Дослідження `/research/*`',
    'stories': 'Список історій, пагінація `/stories/*`',
    'societies': 'Список товариств, пагінація `/societies/*`',
    'uk': 'Українські версії `/uk/*`',
    'handoff': 'Hand-off пакет `/handoff/*` (внутрішній, не сайт)',
}

def short_family(f):
    return {'IBM Plex Mono': 'Mono', 'Noto Serif': 'Serif'}.get(f, f)

# --------------------------------------------------------- proposed scale
# Proposed scale in "design" px (16px root). React pages are rendered at 18px root (x1.125), so they are divided first.
MONO = [(14, '14/20'), (16, '16/24'), (18, '18/28'), (22, '22/34'), (28, '28/36')]
SERIF = [(28, '28/36'), (36, '36/44'), (48, '48/56'), (72, '72/76')]
MONO_NAME = {14: 'ui-s', 16: 'ui-m', 18: 'ui-l', 22: 'text-l', 28: 'ui-xl'}
SERIF_NAME = {28: 'h3', 36: 'h2', 48: 'h1-entity', 72: 'h1'}

def nearest(x, steps):
    return min(steps, key=lambda s: (abs(s[0] - x), -s[0]))

def propose(e, page):
    fam = e['family']
    size = num(e['size'])
    if fam == 'Noto Serif':
        norm = size / 1.125 if is_react(page) else size
        if size == 27 and e['letterSpacing'] != 'normal' and e['lineHeight'] == '27px':
            return 'логотип (окремо)'
        if size <= 20:  # sr-only
            return 'sr-only (не видно)'
        step = nearest(norm, SERIF)
        return f"{SERIF_NAME[step[0]]} {step[1]}"
    if fam == 'IBM Plex Mono':
        norm = size / 1.125 if is_react(page) else size
        if size >= 50:
            return 'display-знак (!!!, окремо)'
        step = nearest(norm, MONO)
        name = MONO_NAME[step[0]]
        return f"{name} {step[1]}"
    return 'ПРИБРАТИ (чужий шрифт)'

def ls_em(e):
    ls = e['letterSpacing']
    if ls == 'normal':
        return '0'
    s = num(ls)
    sz = num(e['size'])
    return f"{round(s / sz, 3):g}em"

def fmt(x):
    x = round(num(x) if isinstance(x, str) else x, 1)
    return f"{x:g}"

# --------------------------------------------------------------- collect
class Ent:
    __slots__ = ('e', 'pages', 'chars', 'el', 'sample', 'phone_sizes')
    def __init__(self, e):
        self.e = e; self.pages = set(); self.chars = 0; self.el = collections.Counter(); self.sample = e['samples'][0] if e['samples'] else ''
        self.phone_sizes = set()

def key(e):
    return (e['family'], fmt(e['size']), e['weight'], e['style'], fmt(e['lineHeight']) if e['lineHeight'] != 'normal' else 'n', ls_em(e), e['transform'])

by_group = collections.defaultdict(lambda: collections.defaultdict(Ent))
group_pages = collections.defaultdict(list)
for p, v in desk.items():
    g = group(p)
    group_pages[g].append(p)
    for e in v['entities']:
        k = key(e)
        x = by_group[g].get(k) or by_group[g].setdefault(k, Ent(e))
        x.pages.add(p); x.chars += e['chars']
        for a, b in e['elements'].items():
            x.el[a.split(' ‹ ')[0]] += b

# singletons: root-level pages each get their own section
singles = [g for g in group_pages if len(group_pages[g]) == 1 and g.startswith('/')]
merged_single = {}
for g in singles:
    merged_single[g] = by_group.pop(g)
    group_pages.pop(g)

# phone sizes per group
phone_by_group = collections.defaultdict(collections.Counter)
for p, v in phone.items():
    g = group(p) if (group(p) in group_pages) else p
    for e in v['entities']:
        phone_by_group[g][(short_family(e['family']), fmt(e['size']), e['weight'])] += e['chars']

# ---------------------------------------------------------------- global stats
all_ent = {}
for p, v in desk.items():
    for e in v['entities']:
        all_ent.setdefault(key(e), 0)
        all_ent[key(e)] += e['chars']
raw_sizes = sorted({num(e['size']) for v in desk.values() for e in v['entities']})
phone_sizes = sorted({num(e['size']) for v in phone.values() for e in v['entities']})
raw_lh = {e['lineHeight'] for v in desk.values() for e in v['entities']}
raw_ls = {ls_em(e) for v in desk.values() for e in v['entities']}
weights = collections.Counter()
fams = collections.Counter()
for v in desk.values():
    for e in v['entities']:
        weights[e['weight']] += e['chars']; fams[e['family']] += e['chars']
total = sum(fams.values())

proposed_all = collections.Counter()
for p, v in desk.items():
    for e in v['entities']:
        proposed_all[propose(e, p)] += e['chars']

# ------------------------------------------------------------------ csv
with open(OUT / 'entities.csv', 'w', newline='') as f:
    w = csv.writer(f)
    w.writerow(['page', 'viewport', 'family', 'size_px', 'weight', 'style', 'line_height', 'letter_spacing', 'text_transform', 'chars', 'elements', 'sample', 'proposed'])
    for vp, data in (('1440', desk), ('390', phone)):
        for p, v in sorted(data.items()):
            for e in sorted(v['entities'], key=lambda e: (e['family'], num(e['size']))):
                w.writerow([p, vp, e['family'], fmt(e['size']), e['weight'], e['style'], e['lineHeight'], e['letterSpacing'], e['transform'], e['chars'],
                            ' '.join(a.split(' ‹ ')[0] for a in list(e['elements'])[:3]), e['samples'][0] if e['samples'] else '', propose(e, p) if vp == '1440' else ''])

# ------------------------------------------------------------------ md
L = []
A = L.append
A('# Шрифти сайту: що є зараз і як привести до спільного знаменника')
A('')
A(f'Дані: Playwright-обхід `http://localhost:5174/`, {len(desk)} сторінок, два вʼюпорти (1440×900 і 390×844). Дата: {datetime.date.today()}.')
A('Скрипт: `scripts/font-audit.mjs` (збір), `scripts/font-audit-report.py` (цей документ). Повні дані: `docs/font-audit/raw-*.json`, таблиця `docs/font-audit/entities.csv`.')
A('')
A('**Шрифтова сутність** = комбінація: гарнітура + розмір + насиченість + нахил + інтерліньяж + трекінг + регістр. Одна й та сама роль (скажімо, «підпис у картці») на різних сторінках часто виходить різною сутністю.')
A('')
A('## 1. Підсумок')
A('')
A('| Що міряли | Десктоп 1440 | Телефон 390 |')
A('|---|---|---|')
A(f'| Унікальних розмірів шрифту (px) | **{len(raw_sizes)}** | **{len(phone_sizes)}** |')
A(f'| Унікальних сутностей (гарнітура+розмір+вага+lh+трекінг+регістр) | **{len(all_ent)}** | {len({(e["family"], fmt(e["size"]), e["weight"], e["lineHeight"], ls_em(e)) for v in phone.values() for e in v["entities"]})} |')
A(f'| Унікальних значень line-height | {len(raw_lh)} | n/a |')
A(f'| Унікальних значень letter-spacing (в em) | {len(raw_ls)} | n/a |')
A('')
A('Гарнітури за обсягом тексту: ' + ', '.join(f'{f} {c * 100 / total:.1f}%' for f, c in fams.most_common()) + '. Ваги: ' + ', '.join(f'{w} ({c * 100 / total:.1f}%)' for w, c in weights.most_common()) + '.')
A('')
A('Гарнітур усього дві (IBM Plex Mono і Noto Serif), це добре і так і лишати. Проблема не в гарнітурах, а в **розмірах, інтерліньяжі, трекінгу і двох кореневих розмірах**.')
A('')
A('### Головні знахідки')
A('')
A('1. **Одна роль, два розміри.** `html` скрізь 18px (`satr-base.css`: `font-size: 112.5%`), але шкала написана під 16px. Fluid-кроки (`--step-*`, `text-heading-*`) на React-сторінках (головна, кабінет) рендеряться на 12,5% більшими, ніж на статичних, а фіксовані px-значення у статичних CSS не масштабуються. Тому те саме місце виходить: 16 ↔ 18, 18 ↔ 20,25, 22 ↔ 24,75, 28 ↔ 31,5, 36 ↔ 40,5, 48 ↔ 54, 72 ↔ 81. Звідти більшість «дивних» чисел (20,25; 24,75; 31,5; 40,5; 54) і це open question 36 у `public/handoff/open-questions.md`. Документація каже, що профілі науковця на 16px root (питання 40), але виміряно: `html` 18px і там теж, а 16px там це px-літерали.')
A(f'2. **Дробові розміри з fluid-кліпів.** {sum(1 for s in raw_sizes if abs(s - round(s)) > 0.01)} з {len(raw_sizes)} розмірів не цілі (14,9994; 22,9; 34,35; 36,64…). Користувач бачить «приблизно 15», а в стилях сидить 14,9994. Сторінки статей мають свою власну шкалу (`18.32`, `22.9`, `34.35`, `36.64`, `28.625`), якої немає ніде більше.')
A('3. **Один розмір, різний міжряддя.** Наприклад 18px зустрічається з line-height 18, 25,9999, 26, 27, 27,9, 28, 28,0008, 29,25, 31,5. 16px: 0, 21,9996, 22, 23,2, 24, 24,8, 26, 28. Різниця невидима по одній, але разом дає «нерівну» сторінку.')
A('4. **Трекінг:** `-0.03em` на «ui», `normal` на тексті, але є ui-елементи з `normal` (`story-card__type`, `exp-place`, `exp-pos`, `project-card__year`), `-0.01em` (підкреслені лінки на головній і в кабінеті), `-0.013em`, `-0.02em`, `-0.027em`, `-0.034em`.')
A('5. **Ваги:** 400 домінує, 300 на лейблах полів і частині тексту, 500 тільки на табах «Scientists/Societies», 700 на `strong/b`, на «Мій профіль» в кабінеті і ще кількох місцях. Всі 4 ваги Plex Mono підвантажуються, тобто 500 і 700 коштують трафіку заради кількох слів.')
A('6. **Сторонні шрифти:** `arial` («Made with fullPage.js» на `/uk.html`), `monospace` (код у hand-off). На продакшні сайті це лише fullPage.js.')
A('7. **Назви ролей з документації не збігаються з тим, що в рендері.** `typography.md` каже, що `text` це Light 300. Фактично абзаци статей і профілів рендеряться вагою 400, а 300 стоїть лише на лейблах полів і кількох інформаційних текстах.')
A('')
A('## 2. Пропозиція: одна шкала')
A('')
A('Принцип: **роль визначає розмір, сторінка роль не змінює.** Токенів стає менше, ніж зараз розмірів, і кожен має одну висоту рядка. Шкала описана в px (варіант з пункту 2.1).')
A('')
A('### 2.1. Спершу: одна база')
A('')
A('Рішення потрібне одне: або шкала = «design numbers» (16-базова, те, що зараз рендерять статичні сторінки), або шкала = те, що рендерить React (×1,125). Рекомендація: **design numbers**, бо за ними вже зроблено 531 статичну сторінку, hand-off і Hugo-партіали, а React-частина єдина, де виходить більше. Практично: задати токени в px (або rem від 16px) і не залежати від `html { font-size: 112.5% }`; React-сторінки зменшаться на ~11%. Нижче шкала дана в цих числах.')
A('')
A('### 2.2. Шкала')
A('')
A('| Токен | Гарнітура | Розмір / міжряддя | Трекінг | Вага | Для чого |')
A('|---|---|---|---|---|---|')
A('| `ui-s` | Mono | 14 / 20 | -0.03em | 400 | хлібні крихти, дата, тип у картці, лічильники, підписи під фото, виноски |')
A('| `ui-m` | Mono | 16 / 24 | -0.03em | 400 | теги, чипи, рядки метаданих (місце, посада, рік), мініатюри в асайді, посилання в асайді |')
A('| `ui-l` | Mono | 18 / 28 | -0.03em | 400 | кнопки, навігація, лейбли форм, підзаголовки карток, `h4`-підписи |')
A('| `text-l` | Mono | 22 / 34 | 0 | 400 (300 лише якщо дозавантажити/вирішити питання 26) | основний текст: стаття, профіль, лід на сторінках; підпис «Want to help?» |')
A('| `ui-xl` | Mono | 28 / 36 | -0.03em | 400 | таби «Scientists/Societies», великі підкреслені лінки на головній (`Усі проєкти`) |')
A('| `h3` | Serif | 28 / 36 | -0.02em | 400 | імена в картках, назви картки (історія, стаття, проєкт), суми в `infra-plate` |')
A('| `h2` | Serif | 36 / 44 | -0.02em | 400 | секція сторінки, лід історії (зараз 34,35/53), заголовок цитати |')
A('| `h1-entity` | Serif | 48 / 56 | -0.02em | 400 | заголовок профілю, інфраструктури, логін, кабінет |')
A('| `h1` | Serif | 72 / 76 (fluid 32–72) | -0.02em | 400 | заголовок сторінки / hero, «Want to help?» |')
A('')
A(f'Разом **9 токенів** замість {len(raw_sizes)} різних розмірів, {len(raw_lh)} значень line-height і {len(raw_ls)} значень трекінгу (десктоп).')
A('')
A('Правила, які закривають решту розбіжностей:')
A('')
A('- **Один токен = один line-height.** Місце, де потрібен «щільніший» рядок, береться з іншого токена, а не з окремого значення (при розмірі 16 є `.exp-year` з lh 22 і `project-card__year` з lh 28: висоту блока підганяли міжряддям).')
A('- **Трекінг прив’язаний до гарнітури:** Mono-ui `-0.03em`, Mono-text `0`, Serif `-0.02em`. Ніяких `-0.01em`, `-0.013em`, `-0.027em`, `-0.034em`.')
A('- **Ваги:** 400 скрізь, 700 лише в `strong/b` в основному тексті. 500 (таби) і 300 (лейбли полів) прибрати або свідомо залишити одну з них. Тоді `@font-face` Mono скорочується до 400 і 700 (мінус два файли на кожне відкриття сторінки).')
A('- **Цілі px.** Fluid-кліпи (`clamp`) тільки для `h1`/`h1-entity` і `h2`; тіло тексту фіксоване. Дробові розміри 14,9994 / 22,9 / 34,35 / 36,64 / 18,32 зникають.')
A('- **Сторінки статей не мають своєї шкали.** `.paragraph` 22,9 → `text-l`; `.story-lead` 34,35 → `h2`; `.heading--h2` 36,64 → `h2`; `.heading--h3` 28,625 → `h3`; `figcaption` 18,32 → `ui-s` (14) або `ui-m` (16); `ul/li` 18,32 → `text-l`.')
A('- **Виключення прописані в одному місці:** логотип (27px Serif, 528 сторінок, лишається окремо як brand mark), `!!!`-знак на сторінках `link-sent`/`password-saved` (56px), hero-цифри на головній (`h1` 60–95px).')
A('')
A('### 2.3. Хто куди переходить (найбільш поширені розбіжності)')
A('')
A('| Зараз (px, desktop) | Де | → Токен |')
A('|---|---|---|')
A('| 14 / 14,0004 | хлібні крихти, `story-card__type`, лічильники, number-теги | `ui-s` |')
A('| 14,9994 / 15 / 15,75 / 16 / 16,0002 / 16,2 / 16,875 / 16,9992 | теги, `exp-place`, `exp-pos`, `aside-mini__line`, society `p`, `infra-plate__label`, кабінет | `ui-m` (у society 16,2 → 22 `text-l`, це текст) |')
A('| 18 / 18,0974 / 18,26 / 18,32 / 18,941 / 19,998 / 20 / 20,25 | кнопки, nav, лейбли, `storyAside__text`, e-mail у society, підписи під фото, `1 / 3` | `ui-l` (текстові блоки з 18,32 → `text-l`) |')
A('| 21,9996 / 22 / 22,8 / 22,9 / 23,7 / 24,26 / 24,75 / 25,2 | футер, пагінація, абзаци статей і профілів, інфо-текст hero, кабінет-меню | `text-l` (навігація: `ui-l`, див. нижче) |')
A('| 27 / 28 / 28,0008 / 28,625 / 31,5 | таби, імена, `h3`, суми, кабінет `h3` | `ui-xl` для табів, `h3` для заголовків |')
A('| 34,3 / 34,35 / 36 / 36,64 / 40,5 | лід історії, `h2`, цитата | `h2` |')
A('| 48 / 54 | `h1.expert__header`, `satr-auth__title`, кабінет `h1` | `h1-entity` |')
A('| 60 / 63,9 / 68,5 / 71 / 72 / 74 / 91 / 94,6 | hero, `h2.text-h1` на головній, `h1` сторінок | `h1` (fluid 32–72; hero на головній (до 95px) вирішити окремо) |')
A('')
A('Відкриті рішення (потрібне ваше слово): (1) база: design numbers чи React ×1,125; (2) чи лишати табам 500; (3) чи `text` 300 (за документацією) чи 400 (за фактом); (4) чи вводити окремий `ui-xl` 28, чи звести таби до `ui-l`; (5) чи лишати fullPage.js-кредит в arial (його можна прибрати зі статичного `/uk.html` після міграції на Hugo).')
A('')
A('## 3. Порядок робіт')
A('')
A('1. Закрити питання бази (п. 2.1) і перевірити, що `tokens.css` це єдине джерело шкали. Ввести в `tokens.css` лише 9 токенів вище (поруч з існуючими `--heading-*` і `--font-*`).')
A('2. Зробити токени змінними з одним `line-height` на крок (`--text-ui-m: 16px/24px`).')
A('3. Пройтися по сторінкових CSS у порядку «скільки сторінок зачіпає»: `expert*` (294), `story*` (73), `society*` (37), `scientists*` (29), `infrastructure*` (23). Кожен перехід це заміна значення на змінну без зміни розмітки.')
A('4. Перегенерувати цей звіт (`node scripts/font-audit.mjs && python3 -I scripts/font-audit-report.py`) і перевірити: ≤ 9 унікальних розмірів Mono/Serif + 2 виключення; 0 дробових; 0 сторонніх гарнітур. Це і є критерій «готово».')
A('5. Додати цю перевірку в `check:pages` (падає, якщо зʼявився розмір поза шкалою).')
A('')
A('Розподіл тексту за запропонованими токенами (кількість символів на всіх сторінках, десктоп):')
A('')
A('| Токен | Частка тексту |')
A('|---|---|')
tot2 = sum(proposed_all.values())
for t, c in proposed_all.most_common():
    A(f'| {t} | {c * 100 / tot2:.1f}% |')
A('')
A('## 4. Сутності по сторінках')
A('')
A('Колонки: **Сутність** (гарнітура розмір/міжряддя, вага, трекінг, регістр) · **Де** (елементи, що її використовують) · **Сторінок** (скільки сторінок групи її мають) · **Приклад тексту** · **→ Токен** (куди її вести). Десктоп 1440. Розмір на телефоні (де відрізняється, бо fluid) рахується окремо під кожною таблицею. Дробові розміри округлені до 0,1.')
A('')
A('Сторінки одного шаблону (профілі науковців, історії, товариства…) мають практично однаковий набір сутностей, тому вони згруповані. Один рядок у таблиці = одна сутність; вона може траплятись не на всіх сторінках групи (стовпчик «Сторінок»).')
A('')

def render_table(ents, n_pages, page_for_prop):
    A('| Сутність | Де | Сторінок | Приклад | → Токен |')
    A('|---|---|---|---|---|')
    rows = sorted(ents.items(), key=lambda kv: (kv[0][0] != 'Noto Serif', float(kv[0][1]), kv[0][2], -kv[1].chars))
    for k, x in rows:
        fam, size, weight, style, lh, ls, tr = k
        ent = x.e
        label = f"{short_family(fam)} {size}/{lh if lh != 'n' else 'auto'}, {weight}{' italic' if style == 'italic' else ''}, {ls}{', ' + tr if tr != 'none' else ''}"
        where = ', '.join(f'`{a[:34]}`' for a, _ in x.el.most_common(2))
        sample = x.sample.replace('|', '/').replace('`', "'")
        pg = len(x.pages)
        prop = propose(ent, next(iter(x.pages)))
        A(f"| {label} | {where} | {pg}/{n_pages} | {sample[:34]} | {prop} |")
    A('')

def phone_line(counter):
    items = sorted(counter.items(), key=lambda kv: (kv[0][0] != 'Serif', float(kv[0][1])))
    return ', '.join(f"{f} {s}" for (f, s, w), _ in items)

order = ['home', 'cabinet', 'expert', 'story', 'society', 'scientists', 'infrastructure', 'research', 'stories', 'societies', 'uk', 'handoff']
for g in order:
    if g not in group_pages:
        continue
    pages = group_pages[g]
    A(f'### {GROUP_TITLE[g]}')
    A('')
    ex = sorted(pages)[:2]
    A(f'Сторінок: {len(pages)}' + (f' (напр. `{ex[0]}`)' if g not in ('home', 'cabinet') else ': ' + ', '.join(f'`{p}`' for p in sorted(pages))))
    A('')
    render_table(by_group[g], len(pages), None)
    ps = phone_by_group[g]
    sizes_d = sorted({k[1] for k in by_group[g]}, key=float)
    sizes_p = sorted({k[1] for k in ps}, key=float)
    A(f'Розміри на телефоні 390: {", ".join(sizes_p)}. На десктопі: {len(sizes_d)} розмірів, на телефоні {len(sizes_p)}.')
    A('')

A('### Окремі сторінки')
A('')
for p in sorted(merged_single):
    A(f'#### `{p}` ({desk[p].get("title", "")})')
    A('')
    render_table(merged_single[p], 1, None)
    ps = phone_by_group.get(p)
    if ps:
        A(f'Розміри на телефоні 390: {", ".join(sorted({k[1] for k in ps}, key=float))}.')
        A('')

A('## 5. Додатки')
A('')
A('- `docs/font-audit/entities.csv`: кожна сутність на кожній сторінці (532 сторінки × 2 вʼюпорти), з колонкою `proposed` для десктопа. Можна відфільтрувати в таблиці по сторінці або токену.')
A('- `docs/font-audit/raw-1440x900.json`, `raw-390x844.json`: сирі дані обходу (включно з кольорами, прикладами, переліком завантажених шрифтів).')
A('- `/research/page-2.html` не вдалось прочитати (сторінка перенавантажується скриптом); решта 531 сторінка успішно.')
(OUT / 'REPORT.md').write_text('\n'.join(L))
print('written', len(L), 'lines;', len(all_ent), 'entities;', len(raw_sizes), 'sizes;', len(raw_lh), 'lh;', len(raw_ls), 'ls')
