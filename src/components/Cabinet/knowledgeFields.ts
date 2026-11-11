/**
 * The official list of fields of knowledge and their specialities, as the team
 * supplied it ("Теги.pdf", tag 2). One field, then its specialities.
 * Plain data: the Go side can load the same JSON.
 */
export interface KnowledgeField {
  field: string;
  specialties: string[];
}

export const knowledgeFields: KnowledgeField[] = [
  {
    "field": "Освіта",
    "specialties": [
      "Педагогічні науки",
      "Дошкільна освіта",
      "Початкова освіта",
      "Середня освіта",
      "Професійна освіта",
      "Спеціальна освіта",
      "Фізична культура і спорт"
    ]
  },
  {
    "field": "Культура і мистецтво",
    "specialties": [
      "Аудіовізуальне мистецтво",
      "Дизайн",
      "Образотворче мистецтво, декоративне мистецтво, реставрація",
      "Хореографія",
      "Музичне мистецтво",
      "Сценічне мистецтво",
      "Музеєзнавство, пам’яткознавство",
      "Менеджмент соціокультурної діяльності",
      "Інформаційна, бібліотечна та архівна справа"
    ]
  },
  {
    "field": "Гуманітарні науки",
    "specialties": [
      "Релігієзнавство",
      "Історія та археологія",
      "Філософія",
      "Культурологія",
      "Філологія"
    ]
  },
  {
    "field": "Богослов’я",
    "specialties": [
      "Богослов’я"
    ]
  },
  {
    "field": "Соціальні та поведінкові науки",
    "specialties": [
      "Економіка",
      "Політологія",
      "Психологія",
      "Соціологія"
    ]
  },
  {
    "field": "Журналістика",
    "specialties": [
      "Журналістика"
    ]
  },
  {
    "field": "Управління та адміністрування",
    "specialties": [
      "Облік і оподаткування",
      "Фінанси, банківська справа, страхування та фондовий ринок",
      "Менеджмент",
      "Маркетинг",
      "Підприємництво та торгівля"
    ]
  },
  {
    "field": "Право",
    "specialties": [
      "Право"
    ]
  },
  {
    "field": "Біологія",
    "specialties": [
      "Біологія та біохімія"
    ]
  },
  {
    "field": "Природничі науки",
    "specialties": [
      "Екологія",
      "Хімія",
      "Науки про Землю",
      "Фізика та астрономія",
      "Прикладна фізика та наноматеріали",
      "Географія"
    ]
  },
  {
    "field": "Математика та статистика",
    "specialties": [
      "Математика",
      "Статистика",
      "Прикладна математика"
    ]
  },
  {
    "field": "Інформаційні технології",
    "specialties": [
      "Інженерія програмного забезпечення",
      "Комп’ютерні науки",
      "Комп’ютерна інженерія",
      "Системний аналіз",
      "Кібербезпека та захист інформації"
    ]
  },
  {
    "field": "Механічна інженерія",
    "specialties": [
      "Матеріалознавство",
      "Галузеве машинобудування",
      "Авіаційна та ракетно-космічна техніка",
      "Суднобудування",
      "Металургія"
    ]
  },
  {
    "field": "Електрична інженерія",
    "specialties": [
      "Електроенергетика, електротехніка та електромеханіка",
      "Енергетичне машинобудування",
      "Атомна енергетика",
      "Теплоенергетика",
      "Відновлювані джерела енергії та гідроенергетика"
    ]
  },
  {
    "field": "Хімічна інженерія та біоінженерія",
    "specialties": [
      "Хімічні технології та інженерія",
      "Біотехнології та біоінженерія",
      "Біомедична інженерія"
    ]
  },
  {
    "field": "Електроніка, автоматизація та електронні комунікації",
    "specialties": [
      "Електроніка",
      "Електронні комунікації та радіотехніка",
      "Авіоніка",
      "Автоматизація, комп’ютерно-інтегровані технології та робототехніка",
      "Інформаційно-вимірювальні технології",
      "Мікро- та наносистемна техніка"
    ]
  },
  {
    "field": "Виробництво та технології",
    "specialties": [
      "Харчові технології",
      "Технології легкої промисловості",
      "Технології захисту навколишнього середовища",
      "Гірництво",
      "Нафтогазова інженерія та технології",
      "Видавництво та поліграфія",
      "Деревообробні та меблеві технології"
    ]
  },
  {
    "field": "Архітектура та будівництво",
    "specialties": [
      "Архітектура та містобудування",
      "Будівництво та цивільна інженерія",
      "Геодезія та землеустрій",
      "Гідротехнічне будівництво, водна інженерія та водні технології"
    ]
  },
  {
    "field": "Аграрні науки та продовольство",
    "specialties": [
      "Агрономія",
      "Захист і карантин рослин",
      "Садівництво, плодоовочівництво та виноградарство",
      "Технологія виробництва і переробки продукції тваринництва",
      "Лісове господарство",
      "Садово-паркове господарство",
      "Водні біоресурси та аквакультура",
      "Агроінженерія"
    ]
  },
  {
    "field": "Ветеринарія",
    "specialties": [
      "Ветеринарна медицина"
    ]
  },
  {
    "field": "Охорона здоров’я",
    "specialties": [
      "Стоматологія",
      "Медицина",
      "Медсестринство",
      "Технології медичної діагностики та лікування",
      "Медична психологія",
      "Фармація, промислова фармація",
      "Терапія та реабілітація",
      "Педіатрія",
      "Громадське здоров’я"
    ]
  },
  {
    "field": "Соціальна робота",
    "specialties": [
      "Соціальна робота",
      "Соціальне забезпечення"
    ]
  },
  {
    "field": "Сфера обслуговування",
    "specialties": [
      "Готельно-ресторанна справа",
      "Туризм і рекреація"
    ]
  },
  {
    "field": "Воєнні науки, національна безпека, безпека державного кордону",
    "specialties": [
      "Державна безпека",
      "Безпека державного кордону",
      "Військове управління (за видами збройних сил)",
      "Забезпечення військ (сил)",
      "Озброєння та військова техніка",
      "Національна безпека",
      "Управління інформаційною безпекою"
    ]
  },
  {
    "field": "Цивільна безпека",
    "specialties": [
      "Пожежна безпека",
      "Правоохоронна діяльність",
      "Цивільна безпека"
    ]
  },
  {
    "field": "Транспорт",
    "specialties": [
      "Морський та внутрішній водний транспорт",
      "Авіаційний транспорт",
      "Залізничний транспорт",
      "Автомобільний транспорт",
      "Транспортні технології"
    ]
  },
  {
    "field": "Публічне управління та адміністрування",
    "specialties": [
      "Публічне управління та адміністрування"
    ]
  },
  {
    "field": "Міжнародні відносини",
    "specialties": [
      "Міжнародні відносини, суспільні комунікації та регіональні студії",
      "Міжнародні економічні відносини",
      "Міжнародне право"
    ]
  }
];

/**
 * The same names in English, keyed by the Ukrainian name. The Ukrainian name
 * stays the stored value (and what the Go side matches on); the English one
 * is only what an English page shows.
 */
const knowledgeEn: Record<string, string> = {
  'Освіта': 'Education',
  'Педагогічні науки': 'Pedagogical sciences',
  'Дошкільна освіта': 'Preschool education',
  'Початкова освіта': 'Primary education',
  'Середня освіта': 'Secondary education',
  'Професійна освіта': 'Vocational education',
  'Спеціальна освіта': 'Special education',
  'Фізична культура і спорт': 'Physical education and sport',
  'Культура і мистецтво': 'Culture and arts',
  'Аудіовізуальне мистецтво': 'Audiovisual arts',
  'Дизайн': 'Design',
  'Образотворче мистецтво, декоративне мистецтво, реставрація': 'Fine arts, decorative arts, restoration',
  'Хореографія': 'Choreography',
  'Музичне мистецтво': 'Music',
  'Сценічне мистецтво': 'Performing arts',
  'Музеєзнавство, пам’яткознавство': 'Museum studies, heritage studies',
  'Менеджмент соціокультурної діяльності': 'Sociocultural management',
  'Інформаційна, бібліотечна та архівна справа': 'Information, library and archival studies',
  'Гуманітарні науки': 'Humanities',
  'Релігієзнавство': 'Religious studies',
  'Історія та археологія': 'History and archaeology',
  'Філософія': 'Philosophy',
  'Культурологія': 'Cultural studies',
  'Філологія': 'Philology',
  'Богослов’я': 'Theology',
  'Соціальні та поведінкові науки': 'Social and behavioural sciences',
  'Економіка': 'Economics',
  'Політологія': 'Political science',
  'Психологія': 'Psychology',
  'Соціологія': 'Sociology',
  'Журналістика': 'Journalism',
  'Управління та адміністрування': 'Management and administration',
  'Облік і оподаткування': 'Accounting and taxation',
  'Фінанси, банківська справа, страхування та фондовий ринок': 'Finance, banking, insurance and the stock market',
  'Менеджмент': 'Management',
  'Маркетинг': 'Marketing',
  'Підприємництво та торгівля': 'Entrepreneurship and trade',
  'Право': 'Law',
  'Біологія': 'Biology',
  'Біологія та біохімія': 'Biology and biochemistry',
  'Природничі науки': 'Natural sciences',
  'Екологія': 'Ecology',
  'Хімія': 'Chemistry',
  'Науки про Землю': 'Earth sciences',
  'Фізика та астрономія': 'Physics and astronomy',
  'Прикладна фізика та наноматеріали': 'Applied physics and nanomaterials',
  'Географія': 'Geography',
  'Математика та статистика': 'Mathematics and statistics',
  'Математика': 'Mathematics',
  'Статистика': 'Statistics',
  'Прикладна математика': 'Applied mathematics',
  'Інформаційні технології': 'Information technology',
  'Інженерія програмного забезпечення': 'Software engineering',
  'Комп’ютерні науки': 'Computer science',
  'Комп’ютерна інженерія': 'Computer engineering',
  'Системний аналіз': 'Systems analysis',
  'Кібербезпека та захист інформації': 'Cybersecurity and information protection',
  'Механічна інженерія': 'Mechanical engineering',
  'Матеріалознавство': 'Materials science',
  'Галузеве машинобудування': 'Industrial machinery engineering',
  'Авіаційна та ракетно-космічна техніка': 'Aerospace engineering',
  'Суднобудування': 'Shipbuilding',
  'Металургія': 'Metallurgy',
  'Електрична інженерія': 'Electrical engineering',
  'Електроенергетика, електротехніка та електромеханіка': 'Electric power, electrical engineering and electromechanics',
  'Енергетичне машинобудування': 'Power machinery engineering',
  'Атомна енергетика': 'Nuclear power',
  'Теплоенергетика': 'Thermal power',
  'Відновлювані джерела енергії та гідроенергетика': 'Renewable energy and hydropower',
  'Хімічна інженерія та біоінженерія': 'Chemical engineering and bioengineering',
  'Хімічні технології та інженерія': 'Chemical technology and engineering',
  'Біотехнології та біоінженерія': 'Biotechnology and bioengineering',
  'Біомедична інженерія': 'Biomedical engineering',
  'Електроніка, автоматизація та електронні комунікації': 'Electronics, automation and electronic communications',
  'Електроніка': 'Electronics',
  'Електронні комунікації та радіотехніка': 'Electronic communications and radio engineering',
  'Авіоніка': 'Avionics',
  'Автоматизація, комп’ютерно-інтегровані технології та робототехніка': 'Automation, computer-integrated technologies and robotics',
  'Інформаційно-вимірювальні технології': 'Information and measurement technologies',
  'Мікро- та наносистемна техніка': 'Micro- and nanosystem engineering',
  'Виробництво та технології': 'Manufacturing and technology',
  'Харчові технології': 'Food technology',
  'Технології легкої промисловості': 'Light industry technology',
  'Технології захисту навколишнього середовища': 'Environmental protection technology',
  'Гірництво': 'Mining',
  'Нафтогазова інженерія та технології': 'Oil and gas engineering and technology',
  'Видавництво та поліграфія': 'Publishing and printing',
  'Деревообробні та меблеві технології': 'Wood processing and furniture technology',
  'Архітектура та будівництво': 'Architecture and construction',
  'Архітектура та містобудування': 'Architecture and urban planning',
  'Будівництво та цивільна інженерія': 'Construction and civil engineering',
  'Геодезія та землеустрій': 'Geodesy and land management',
  'Гідротехнічне будівництво, водна інженерія та водні технології': 'Hydraulic construction, water engineering and water technology',
  'Аграрні науки та продовольство': 'Agricultural sciences and food',
  'Агрономія': 'Agronomy',
  'Захист і карантин рослин': 'Plant protection and quarantine',
  'Садівництво, плодоовочівництво та виноградарство': 'Horticulture, fruit and vegetable growing, and viticulture',
  'Технологія виробництва і переробки продукції тваринництва': 'Livestock production and processing technology',
  'Лісове господарство': 'Forestry',
  'Садово-паркове господарство': 'Landscape gardening',
  'Водні біоресурси та аквакультура': 'Aquatic bioresources and aquaculture',
  'Агроінженерія': 'Agricultural engineering',
  'Ветеринарія': 'Veterinary science',
  'Ветеринарна медицина': 'Veterinary medicine',
  'Охорона здоров’я': 'Health care',
  'Стоматологія': 'Dentistry',
  'Медицина': 'Medicine',
  'Медсестринство': 'Nursing',
  'Технології медичної діагностики та лікування': 'Medical diagnostic and treatment technologies',
  'Медична психологія': 'Medical psychology',
  'Фармація, промислова фармація': 'Pharmacy, industrial pharmacy',
  'Терапія та реабілітація': 'Therapy and rehabilitation',
  'Педіатрія': 'Paediatrics',
  'Громадське здоров’я': 'Public health',
  'Соціальна робота': 'Social work',
  'Соціальне забезпечення': 'Social security',
  'Сфера обслуговування': 'Services',
  'Готельно-ресторанна справа': 'Hotel and restaurant business',
  'Туризм і рекреація': 'Tourism and recreation',
  'Воєнні науки, національна безпека, безпека державного кордону': 'Military sciences, national security, state border security',
  'Державна безпека': 'State security',
  'Безпека державного кордону': 'State border security',
  'Військове управління (за видами збройних сил)': 'Military command (by armed service)',
  'Забезпечення військ (сил)': 'Support of troops (forces)',
  'Озброєння та військова техніка': 'Weapons and military equipment',
  'Національна безпека': 'National security',
  'Управління інформаційною безпекою': 'Information security management',
  'Цивільна безпека': 'Civil security',
  'Пожежна безпека': 'Fire safety',
  'Правоохоронна діяльність': 'Law enforcement',
  'Транспорт': 'Transport',
  'Морський та внутрішній водний транспорт': 'Maritime and inland water transport',
  'Авіаційний транспорт': 'Air transport',
  'Залізничний транспорт': 'Rail transport',
  'Автомобільний транспорт': 'Road transport',
  'Транспортні технології': 'Transport technology',
  'Публічне управління та адміністрування': 'Public management and administration',
  'Міжнародні відносини': 'International relations',
  'Міжнародні відносини, суспільні комунікації та регіональні студії': 'International relations, public communications and regional studies',
  'Міжнародні економічні відносини': 'International economic relations',
  'Міжнародне право': 'International law',
};

/** The name to show: Ukrainian as stored, or its English version on an English page. */
export function knowledgeLabel(value: string, locale: 'en' | 'uk'): string {
  return locale === 'en' ? (knowledgeEn[value] ?? value) : value;
}
