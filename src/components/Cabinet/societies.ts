/**
 * The scientific societies that have a page on the site: what a scientist picks
 * from in the profile, and what the profile then links to. `slug` is the end of
 * the society's address (society/<slug>); the name is as the site prints it.
 * One flat list, so the developers can replace it with the real register.
 */
export interface Society {
  slug: string;
  name: string;
}

export const societies: Society[] = [
  { slug: "asotsiatsiia-hinekolohiv-endokrynolohiv-ukrainy", name: "Association of Gynecologists and Endocrinologists of Ukraine" },
  { slug: "ho-bioinformatyka-dlia-ukrainy", name: "Bioinformatics for Ukraine" },
  { slug: "tsentr-doslidzhen-ta-konsultatsii", name: "Center of Research and Consultation" },
  { slug: "khimiko-farmatsevtychne-tovarystvo", name: "Chemical and Pharmaceutical Society" },
  { slug: "diushenna-ukrainy", name: "Duchenne Ukraine" },
  { slug: "ukrainske-materialoznavche-tovarystvo-im-im-frantsevycha", name: "Frantsevich Ukrainian Materials Research Society" },
  { slug: "hidroekolohichne-tovarystvo-ukrainy", name: "Hydroecological Society of Ukraine" },
  { slug: "internatsionalna-spilka-innovatoriv-ta-doslidnykiv", name: "International Union of Innovators and Researchers" },
  { slug: "lvivske-matematychne-tovarystvo", name: "Lviv Mathematical Society" },
  { slug: "lvivska-oblasna-orhanizatsiia-ukrainskoho-tovarystva-okhorony-pamiatok-istorii-ta-kultury", name: "Lviv regional organization of the Ukrainian Society for the Protection of Historical and Cultural Monuments" },
  { slug: "vseukrainska-asotsiatsiia-likariv-ta-psykholohiv-rozlady-kharchovoi-povedinky-terapiia-ta-preventsiia", name: "National Association оf Physicians \"Psychologists Eating Disorders: Therapy and Prevention\"" },
  { slug: "ho-vseukrainska-asotsiatsiia-klinichnoi-khimii-ta-laboratornoi-medytsyny-vakkhlm", name: "NGO “Association of Clinical Chemistry and Laboratory Medicine of Ukraine”" },
  { slug: "ho-nauka-i-pryroda", name: "NGO “Science and Nature”" },
  { slug: "ho-ukrainska-asotsiatsiia-doslidzhen-zhinochoi-istorii-uadzhi", name: "NGO “Ukrainian Association for Research in Women’s History”" },
  { slug: "ho-ukrainska-asotsiatsiia-personalizovanoi-medytsyny", name: "NGO “Ukrainian Association of Personalized Medicine”" },
  { slug: "profesiina-liha-travmaterapevtiv", name: "Professional League of Trauma Therapists" },
  { slug: "naukove-tovarystvo-z-ievrointehratsiinoi-polityky", name: "Scientific Society for European Integration Policy" },
  { slug: "naukove-tovarystvo-z-farmatsevtychnoi-analityky", name: "Scientific Society for Pharmaceutical Analytics" },
  { slug: "tovarystvo-mikrobiolohiv-ukrainy-im-sm-vynohradskoho-tmu", name: "Serhii Vynohradskyi society of microbiologists of Ukraine" },
  { slug: "naukove-tovarystvo-z-doslidzhen-vidnovlennia-promyslovosti-ta-rezylientnosti-terytorialnykh-hromad", name: "Society for Industrial Recovery & Community Resilience Studies (SICRS)" },
  { slug: "tovarystvo-mikrobiolohiv-ukrainy-im-sm-vynohradskoho", name: "Society of Microbiologists of Ukraine named after S.M. Vinogradsky" },
  { slug: "spilka-arkheolohiv-ukrainy", name: "The Ukrainian Association of Archaeologists" },
  { slug: "ukrainska-asotsiatsiia-terapevtiv-movy-ta-movlennia", name: "The Ukrainian Association of Speech and Language Therapists" },
  { slug: "vseukrainska-hromadska-orhanizatsiia-ukrainska-asotsiatsiia-likariv-psykholohiv", name: "Ukrainian Association of Doctors-Psychologists" },
  { slug: "ukrainska-asotsiatsiia-neiropsykholohii", name: "Ukrainian Association of Neuropsychology" },
  { slug: "vseukrainska-asotsiatsiia-likariv-profpatolohiv-ta-likariv-medytsyny-pratsi", name: "Ukrainian association of occupational therapists and doctors of occupational medicine" },
  { slug: "ukrainske-biofizychne-tovarystvo-ubft", name: "Ukrainian Biophysical Society (UBS)" },
  { slug: "ukrainske-botanichne-tovarystvo", name: "Ukrainian Botanical Society" },
  { slug: "rada-naukovykh-redaktoriv-ukrainy", name: "Ukrainian Council Of Science Editors" },
  { slug: "ukrainske-herpetolohichne-tovarystvo", name: "Ukrainian Herpetological Society" },
  { slug: "ukrainske-mineralohichne-tovarystvo", name: "Ukrainian Mineralogical Society" },
  { slug: "ukrainske-iaderne-tovarystvo", name: "Ukrainian Nuclear Society" },
  { slug: "ukrainske-paleontolohichne-tovarystvo-natsionalnoi-akademii-nauk-ukrainy", name: "Ukrainian Paleontological Society of the National Academy of Sciences of Ukraine" },
  { slug: "ukrainske-fizychne-tovarystvo", name: "Ukrainian physical society" },
  { slug: "ukrainska-merezha-vidtvoriuvanosti", name: "Ukrainian Reproducibility Network (UARN)" },
  { slug: "ukrainske-naukove-tovarystvo-parazytolohiv", name: "Ukrainian Scientific Society of Parasitologists" },
  { slug: "ukrainske-tovarystvo-z-mekhaniky-ruinuvannia-materialiv", name: "Ukrainian Society of Fracture Mechanics" },
];

export const societyBySlug = (slug: string): Society | undefined =>
  societies.find((s) => s.slug === slug);
