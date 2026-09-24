export interface ExpertEntryV4 {
  id: string;
  name: string;
  /** Second line of the option — field and institution. */
  meta?: string;
  href: string;
  /** Extra terms to match on, beyond the name. */
  keywords?: string[];
}

/**
 * Stand-in for the expert catalogue. The live site has no search API — the real
 * form is a plain `GET /experts?search=`, and the catalogue is rendered server
 * side — so these entries exist only to show what the header's suggestions feel
 * like. Free-text submit still goes to `/experts`, exactly as on the live site.
 */
export const expertsIndexV4: ExpertEntryV4[] = [
  {
    id: 'kovalenko-olha',
    name: 'Olha Kovalenko',
    meta: 'Biochemistry · Palladin Institute of Biochemistry',
    href: '/expert/olha-kovalenko',
    keywords: ['біохімія', 'protein', 'enzymes'],
  },
  {
    id: 'shevchuk-andrii',
    name: 'Andrii Shevchuk',
    meta: 'Nuclear safety · Institute for Safety Problems of NPP',
    href: '/expert/andrii-shevchuk',
    keywords: ['ядерна безпека', 'reactor', 'chernobyl'],
  },
  {
    id: 'bondarenko-maria',
    name: 'Maria Bondarenko',
    meta: 'Botany · M.G. Kholodny Institute of Botany',
    href: '/expert/maria-bondarenko',
    keywords: ['ботаніка', 'herbarium', 'plants'],
  },
  {
    id: 'lysenko-taras',
    name: 'Taras Lysenko',
    meta: 'Cryobiology · Institute for Problems of Cryobiology',
    href: '/expert/taras-lysenko',
    keywords: ['кріобіологія', 'cells', 'freezing'],
  },
  {
    id: 'moroz-kateryna',
    name: 'Kateryna Moroz',
    meta: 'Science popularization · Kyiv Academic University',
    href: '/expert/kateryna-moroz',
    keywords: ['популяризація науки', 'outreach', 'teaching'],
  },
  {
    id: 'dovzhenko-ihor',
    name: 'Ihor Dovzhenko',
    meta: 'Agricultural microbiology · Institute of Agricultural Microbiology',
    href: '/expert/ihor-dovzhenko',
    keywords: ['мікробіологія', 'soil', 'agriculture'],
  },
  {
    id: 'hrytsenko-nadiia',
    name: 'Nadiia Hrytsenko',
    meta: 'Endocrinology · Danilevsky Institute for Endocrine Pathology',
    href: '/expert/nadiia-hrytsenko',
    keywords: ['ендокринологія', 'hormones', 'medicine'],
  },
  {
    id: 'pavlenko-serhii',
    name: 'Serhii Pavlenko',
    meta: 'Physics · Kharkiv Institute of Physics and Technology',
    href: '/expert/serhii-pavlenko',
    keywords: ['фізика', 'neutron', 'materials'],
  },
];

/** Strips case and diacritics so "Херсон" and "kherson" behave the same. */
const normalize = (value: string) =>
  value
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .trim();

/**
 * Substring match over name, field and keywords. Deliberately dumb: the point
 * is the interaction, not the ranking.
 */
export function searchExpertsV4(
  query: string,
  { limit = 6, index = expertsIndexV4 }: { limit?: number; index?: ExpertEntryV4[] } = {},
): ExpertEntryV4[] {
  const q = normalize(query);
  if (!q) return [];

  return index
    .filter((entry) =>
      [entry.name, entry.meta ?? '', ...(entry.keywords ?? [])].some((field) =>
        normalize(field).includes(q),
      ),
    )
    .slice(0, limit);
}
