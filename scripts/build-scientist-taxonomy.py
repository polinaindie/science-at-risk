#!/usr/bin/env python3
"""Puts the scientists' free tags into the official fields of knowledge (src/components/Cabinet/knowledgeFields.ts).

Reads   public/scientists.html + public/scientists/page-N.html  (the cards and their tags)
Writes  public/js/scientists-index.json     one row per scientist: card, text, old tags, fields, specialities
        public/js/scientists-taxonomy.json  fields -> specialities with the number of scientists (what the filters draw)
        scripts/tag-mapping-review.csv      every old tag: where it was put and how sure the script is — for the team to check

Run from the project root:  python3 scripts/build-scientist-taxonomy.py
A tag is `exact` when its English name is a field or speciality of the list, `guess` when a rule below put it there,
`activity` when it names what the scientist does (teaching, fundraising…), not a field, `unmapped` otherwise.
Edit RULES / ACTIVITY and run again."""
import re, json, glob, html, collections, csv

ROOT = '.'
KF = open(f'{ROOT}/src/components/Cabinet/knowledgeFields.ts').read()
FIELDS = [(m.group(1), re.findall(r'"([^"]+)"', m.group(2)))
          for m in re.finditer(r'"field": "([^"]+)",\s*"specialties": \[(.*?)\]', KF, re.S)]
EN = dict(re.findall(r"^  '([^']+)': '([^']+)',$", KF, re.M))
slug = lambda t: re.sub(r'[^a-z0-9]+', '-', t.lower()).strip('-')
norm = lambda t: re.sub(r'[^a-z0-9]+', ' ', t.lower()).strip()
en = lambda uk: EN.get(uk, uk)

F_BY_EN = {norm(en(f)): f for f, _ in FIELDS}
S_BY_EN = {}
for f, ss in FIELDS:
    for s in ss:
        S_BY_EN.setdefault(norm(en(s)), (f, s))
# the one speciality that shares its name with its field keeps the field only
for k in list(S_BY_EN):
    if k in F_BY_EN and S_BY_EN[k][0] == F_BY_EN[k] and S_BY_EN[k][1] == F_BY_EN[k]:
        del S_BY_EN[k]

# what the scientist does, not a field of knowledge — not shown in the field filters
ACTIVITY = re.compile(r'^(teaching|science popularization|science communications?|book writing|fundraising|public speaking|project management|'
                      r'expert consulting|patenting|commercialization.*|innovation transfer|technology transfer|scientific ethics|academic integrity|'
                      r'science polic.*|science of science|sdg|grants management|crisis management|heritage management|digital transformation|'
                      r'digitalisation|recovery|infrastructure|demining|technology|social media analysis)$', re.I)

# (pattern on the English tag, field, speciality or None) — first match wins; everything here is a guess to be checked
B, N = 'Біологія', 'Природничі науки'
RULES = [
    (r'biochem|molecular biology|genetic|cell biology|neuro|immunolog|evolution|botan|zoolog|palaeont|batrach|phylogeny|biophysics|^biology$', B, 'Біологія та біохімія'),
    (r'^ecology$|industrial ecology|climate change', N, 'Екологія'),
    (r'environmental management|waste treatment|water resources|water management', 'Виробництво та технології', 'Технології захисту навколишнього середовища'),
    (r'sustainable development', N, 'Екологія'),
    (r'chemical engineering', 'Хімічна інженерія та біоінженерія', 'Хімічні технології та інженерія'),
    (r'chemistry|catalysis|photochem|colloid|hydrogel|electrochem', N, 'Хімія'),
    (r'applied physic|nanomaterial|nanoart|2d materials|mxene|max phase|surface (science|engineering)|energy storage', N, 'Прикладна фізика та наноматеріали'),
    (r'physic|astronom|astrophys|plasma', N, 'Фізика та астрономія'),
    (r'food', 'Виробництво та технології', 'Харчові технології'),
    (r'agricultural', 'Аграрні науки та продовольство', None),
    (r'forest', 'Аграрні науки та продовольство', 'Лісове господарство'),
    (r'history|archeolog|imperial', 'Гуманітарні науки', 'Історія та археологія'),
    (r'museum|cultural heritage|monument', 'Культура і мистецтво', 'Музеєзнавство, пам’яткознавство'),
    (r'art history|arts and crafts|art education', 'Культура і мистецтво', 'Образотворче мистецтво, декоративне мистецтво, реставрація'),
    (r'library|archive', 'Культура і мистецтво', 'Інформаційна, бібліотечна та архівна справа'),
    (r'philolog|literar|literature|linguistic|discourse', 'Гуманітарні науки', 'Філологія'),
    (r'anthropolog|cultural stud', 'Гуманітарні науки', 'Культурологія'),
    (r'digital economy|taxation|investment|econom', 'Соціальні та поведінкові науки', 'Економіка'),
    (r'commodity|identification of goods', 'Управління та адміністрування', 'Підприємництво та торгівля'),
    (r'management', 'Управління та адміністрування', 'Менеджмент'),
    (r'biomedicine|medicine|healthcare', 'Охорона здоров’я', 'Медицина'),
    (r'public health', 'Охорона здоров’я', 'Громадське здоров’я'),
    (r'artificial intelligence|programming|computer|database|information (system|technolog)', 'Інформаційні технології', 'Комп’ютерні науки'),
    (r'electronic communications', 'Електроніка, автоматизація та електронні комунікації', 'Електронні комунікації та радіотехніка'),
    (r'electric power|electromechanic', 'Електрична інженерія', 'Електроенергетика, електротехніка та електромеханіка'),
    (r'gemolog|gemstone', N, 'Науки про Землю'),
    (r'energ|nuclear', 'Електрична інженерія', None),
    (r'applied mechanics', 'Механічна інженерія', None),
    (r'media|mass communication|journalis', 'Журналістика', None),
    (r'tourism', 'Сфера обслуговування', 'Туризм і рекреація'),
    (r'physical culture', 'Освіта', 'Фізична культура і спорт'),
    (r'regional studies|geopolitic|social science', 'Соціальні та поведінкові науки', None),
    (r'production and technology', 'Виробництво та технології', None),
]

def label_of(tag_slug, labels):
    return labels.get(tag_slug, tag_slug)

def classify(tag_slug, label):
    n = norm(label)
    if n in F_BY_EN: return F_BY_EN[n], None, 'exact'
    if n in S_BY_EN: f, s = S_BY_EN[n]; return f, s, 'exact'
    if ACTIVITY.match(label.strip().rstrip('.')): return None, None, 'activity'
    low = label.lower()
    for pat, f, s in RULES:
        if re.search(pat, low): return f, s, 'guess'
    return None, None, 'unmapped'

# ---- read the 294 cards
pages = ['public/scientists.html'] + sorted(glob.glob('public/scientists/page-*.html'), key=lambda x: int(re.search(r'(\d+)', x.split('/')[-1]).group(1)))
cards, labels, counts = [], {}, collections.Counter()
for f in pages:
    s = open(f).read()
    a = s.index('<ul class="experts__list">') + len('<ul class="experts__list">')
    body = s[a:s.rindex('</li>', a) + 5]
    for chunk in body.split('<li class="experts__item">')[1:]:
        card = re.sub(r'(href|src)="\.\./', r'\1="', chunk[:chunk.rindex('</li>')].strip())
        tags = re.findall(r'data-try-tag="([^"]+)" class="expert-card__tag tag">([^<]+)<', card)
        for sl, lb in tags: labels[sl] = lb.strip()
        cards.append((card, [t[0] for t in tags]))
        for sl, _ in tags: counts[sl] += 1

mapping = {sl: classify(sl, lb) for sl, lb in labels.items()}

# ---- index + taxonomy
f_slug = {f: slug(en(f)) for f, _ in FIELDS}
s_slug = {(f, s): slug(en(s)) for f, ss in FIELDS for s in ss}
rows, f_cnt, s_cnt, none = [], collections.Counter(), collections.Counter(), 0
for card, tags in cards:
    fs, ss = set(), set()
    for t in tags:
        f, s, kind = mapping[t]
        if f: fs.add(f)
        if f and s: ss.add((f, s))
    for f in fs: f_cnt[f] += 1
    for k in ss: s_cnt[k] += 1
    none += 0 if fs else 1
    text = re.sub(r'\s+', ' ', html.unescape(re.sub(r'<[^>]+>', ' ', card))).strip().lower()
    # the search also finds a scientist by the names of their fields and specialities (English and Ukrainian)
    text += ' ' + ' '.join((en(f) + ' ' + f).lower() for f in fs) + ' ' + ' '.join((en(s_) + ' ' + s_).lower() for f, s_ in ss)
    rows.append({'h': card, 't': text, 'g': tags, 'f': sorted(f_slug[f] for f in fs), 's': sorted(f_slug[f] + '/' + s_slug[(f, s)] for f, s in ss)})
json.dump(rows, open('public/js/scientists-index.json', 'w'), ensure_ascii=False, separators=(',', ':'))
tax = [{'slug': f_slug[f], 'en': en(f), 'uk': f, 'count': f_cnt[f],
        'specs': [{'slug': s_slug[(f, s)], 'en': en(s), 'uk': s, 'count': s_cnt[(f, s)]} for s in ss if s_cnt[(f, s)]]}
       for f, ss in FIELDS if f_cnt[f]]
tax.sort(key=lambda x: -x['count'])
for t in tax: t['specs'].sort(key=lambda x: -x['count'])
json.dump(tax, open('public/js/scientists-taxonomy.json', 'w'), ensure_ascii=False, indent=1)

with open('scripts/tag-mapping-review.csv', 'w', newline='') as fh:
    w = csv.writer(fh); w.writerow(['scientists', 'old tag', 'how sure', 'field of knowledge', 'speciality'])
    for sl, c in counts.most_common():
        f, s, kind = mapping[sl]
        w.writerow([c, labels[sl], kind, en(f) if f else '', en(s) if s else ''])
k = collections.Counter(v[2] for v in mapping.values())
print(len(rows), 'scientists;', dict(k), '; without any field:', none, '; fields shown:', len(tax))
