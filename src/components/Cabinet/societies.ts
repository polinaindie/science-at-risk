/**
 * The scientific societies that have a page on the site: what a scientist picks
 * from in the profile, and what the profile then links to. `slug` is the end of
 * the society's address (society/<slug>); the name is as the site prints it.
 * One flat list, so the developers can replace it with the real register.
 */
export interface Society {
  slug: string;
  /** The name in English, as the site prints it. */
  name: string;
  /** The same in Ukrainian. */
  nameUk: string;
}

export const societies: Society[] = [
  { slug: "asotsiatsiia-hinekolohiv-endokrynolohiv-ukrainy", name: "Association of Gynecologists and Endocrinologists of Ukraine", nameUk: "Асоціація гінекологів-ендокринологів України" },
  { slug: "ho-bioinformatyka-dlia-ukrainy", name: "Bioinformatics for Ukraine", nameUk: "ГО «Біоінформатика для України»" },
  { slug: "tsentr-doslidzhen-ta-konsultatsii", name: "Center of Research and Consultation", nameUk: "Центр досліджень та консультацій" },
  { slug: "khimiko-farmatsevtychne-tovarystvo", name: "Chemical and Pharmaceutical Society", nameUk: "Хіміко-фармацевтичне товариство" },
  { slug: "diushenna-ukrainy", name: "Duchenne Ukraine", nameUk: "Дюшенн Україна" },
  { slug: "ukrainske-materialoznavche-tovarystvo-im-im-frantsevycha", name: "Frantsevich Ukrainian Materials Research Society", nameUk: "Українське матеріалознавче товариство імені І. М. Францевича" },
  { slug: "hidroekolohichne-tovarystvo-ukrainy", name: "Hydroecological Society of Ukraine", nameUk: "Гідроекологічне товариство України" },
  { slug: "internatsionalna-spilka-innovatoriv-ta-doslidnykiv", name: "International Union of Innovators and Researchers", nameUk: "Міжнародна спілка інноваторів та дослідників" },
  { slug: "lvivske-matematychne-tovarystvo", name: "Lviv Mathematical Society", nameUk: "Львівське математичне товариство" },
  { slug: "lvivska-oblasna-orhanizatsiia-ukrainskoho-tovarystva-okhorony-pamiatok-istorii-ta-kultury", name: "Lviv regional organization of the Ukrainian Society for the Protection of Historical and Cultural Monuments", nameUk: "Львівська обласна організація Українського товариства охорони пам’яток історії та культури" },
  { slug: "vseukrainska-asotsiatsiia-likariv-ta-psykholohiv-rozlady-kharchovoi-povedinky-terapiia-ta-preventsiia", name: "National Association оf Physicians \"Psychologists Eating Disorders: Therapy and Prevention\"", nameUk: "Всеукраїнська асоціація лікарів та психологів розладів харчової поведінки: терапія та превенція" },
  { slug: "ho-vseukrainska-asotsiatsiia-klinichnoi-khimii-ta-laboratornoi-medytsyny-vakkhlm", name: "NGO “Association of Clinical Chemistry and Laboratory Medicine of Ukraine”", nameUk: "ГО «Всеукраїнська асоціація клінічної хімії та лабораторної медицини» (ВАКХЛМ)" },
  { slug: "ho-nauka-i-pryroda", name: "NGO “Science and Nature”", nameUk: "ГО «Наука і природа»" },
  { slug: "ho-ukrainska-asotsiatsiia-doslidzhen-zhinochoi-istorii-uadzhi", name: "NGO “Ukrainian Association for Research in Women’s History”", nameUk: "ГО «Українська асоціація досліджень жіночої історії» (УАДЖІ)" },
  { slug: "ho-ukrainska-asotsiatsiia-personalizovanoi-medytsyny", name: "NGO “Ukrainian Association of Personalized Medicine”", nameUk: "ГО «Українська асоціація персоналізованої медицини»" },
  { slug: "profesiina-liha-travmaterapevtiv", name: "Professional League of Trauma Therapists", nameUk: "Професійна ліга травмотерапевтів" },
  { slug: "naukove-tovarystvo-z-ievrointehratsiinoi-polityky", name: "Scientific Society for European Integration Policy", nameUk: "Наукове товариство з євроінтеграційної політики" },
  { slug: "naukove-tovarystvo-z-farmatsevtychnoi-analityky", name: "Scientific Society for Pharmaceutical Analytics", nameUk: "Наукове товариство з фармацевтичної аналітики" },
  { slug: "tovarystvo-mikrobiolohiv-ukrainy-im-sm-vynohradskoho-tmu", name: "Serhii Vynohradskyi society of microbiologists of Ukraine", nameUk: "Товариство мікробіологів України імені С. М. Виноградського (ТМУ)" },
  { slug: "naukove-tovarystvo-z-doslidzhen-vidnovlennia-promyslovosti-ta-rezylientnosti-terytorialnykh-hromad", name: "Society for Industrial Recovery & Community Resilience Studies (SICRS)", nameUk: "Наукове товариство з досліджень відновлення промисловості та резильєнтності територіальних громад" },
  { slug: "tovarystvo-mikrobiolohiv-ukrainy-im-sm-vynohradskoho", name: "Society of Microbiologists of Ukraine named after S.M. Vinogradsky", nameUk: "Товариство мікробіологів України імені С. М. Виноградського" },
  { slug: "spilka-arkheolohiv-ukrainy", name: "The Ukrainian Association of Archaeologists", nameUk: "Спілка археологів України" },
  { slug: "ukrainska-asotsiatsiia-terapevtiv-movy-ta-movlennia", name: "The Ukrainian Association of Speech and Language Therapists", nameUk: "Українська асоціація терапевтів мови та мовлення" },
  { slug: "vseukrainska-hromadska-orhanizatsiia-ukrainska-asotsiatsiia-likariv-psykholohiv", name: "Ukrainian Association of Doctors-Psychologists", nameUk: "Всеукраїнська громадська організація «Українська асоціація лікарів-психологів»" },
  { slug: "ukrainska-asotsiatsiia-neiropsykholohii", name: "Ukrainian Association of Neuropsychology", nameUk: "Українська асоціація нейропсихології" },
  { slug: "vseukrainska-asotsiatsiia-likariv-profpatolohiv-ta-likariv-medytsyny-pratsi", name: "Ukrainian association of occupational therapists and doctors of occupational medicine", nameUk: "Всеукраїнська асоціація лікарів-профпатологів та лікарів медицини праці" },
  { slug: "ukrainske-biofizychne-tovarystvo-ubft", name: "Ukrainian Biophysical Society (UBS)", nameUk: "Українське біофізичне товариство (УБФТ)" },
  { slug: "ukrainske-botanichne-tovarystvo", name: "Ukrainian Botanical Society", nameUk: "Українське ботанічне товариство" },
  { slug: "rada-naukovykh-redaktoriv-ukrainy", name: "Ukrainian Council Of Science Editors", nameUk: "Рада наукових редакторів України" },
  { slug: "ukrainske-herpetolohichne-tovarystvo", name: "Ukrainian Herpetological Society", nameUk: "Українське герпетологічне товариство" },
  { slug: "ukrainske-mineralohichne-tovarystvo", name: "Ukrainian Mineralogical Society", nameUk: "Українське мінералогічне товариство" },
  { slug: "ukrainske-iaderne-tovarystvo", name: "Ukrainian Nuclear Society", nameUk: "Українське ядерне товариство" },
  { slug: "ukrainske-paleontolohichne-tovarystvo-natsionalnoi-akademii-nauk-ukrainy", name: "Ukrainian Paleontological Society of the National Academy of Sciences of Ukraine", nameUk: "Українське палеонтологічне товариство Національної академії наук України" },
  { slug: "ukrainske-fizychne-tovarystvo", name: "Ukrainian physical society", nameUk: "Українське фізичне товариство" },
  { slug: "ukrainska-merezha-vidtvoriuvanosti", name: "Ukrainian Reproducibility Network (UARN)", nameUk: "Українська мережа відтворюваності" },
  { slug: "ukrainske-naukove-tovarystvo-parazytolohiv", name: "Ukrainian Scientific Society of Parasitologists", nameUk: "Українське наукове товариство паразитологів" },
  { slug: "ukrainske-tovarystvo-z-mekhaniky-ruinuvannia-materialiv", name: "Ukrainian Society of Fracture Mechanics", nameUk: "Українське товариство з механіки руйнування матеріалів" },
];

export const societyBySlug = (slug: string): Society | undefined =>
  societies.find((s) => s.slug === slug);

/** The society's name in the language of the page. */
export const societyName = (s: Society, locale: 'en' | 'uk'): string => (locale === 'uk' ? s.nameUk : s.name);
