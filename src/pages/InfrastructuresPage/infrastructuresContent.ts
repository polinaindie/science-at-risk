import type { ListCardProps } from '../../components/ListCard/ListCard';
import type { SocietyCardProps } from '../../components/SocietyCard/SocietyCard';

/** Damaged research infrastructure asking for help, as the site lists it. */
export interface InfrastructureEntry extends SocietyCardProps {
  /** Funding still needed, already formatted. */
  amount: string;
}

export const infrastructures: InfrastructureEntry[] = [
  {
    title:
      'Research and technology complex "Institute of Single Crystals" of the National Academy of Sciences of Ukraine',
    text: 'Research and technology complex "Institute of Single Crystals" of the National Academy of Sciences of Ukraine',
    domain: 'Materials science, chemistry, physics, biomedicine, pharmacy, technologies',
    amount: '~ 100 000 UAH',
    href: '/infrastructures/instytut-monokrystaliv',
  },
  {
    title: 'Radio Astronomy Institute of the National Academy of Sciences of Ukraine (RAINASU)',
    text: 'Radio Astronomy Institute of the National Academy of Sciences of Ukraine (RAINASU)',
    domain: 'Physical sciences',
    amount: '~ 50 000 000 UAH',
    href: '/infrastructures/radioastronomichnyi-instytut',
  },
  {
    title:
      'Institute of Agricultural Microbiology and Agro-Industrial Production of the National Academy of Agrarian Sciences of Ukraine',
    text: 'Institute of Agricultural Microbiology and Agro-Industrial Production of the National Academy of Agrarian Sciences of Ukraine',
    domain: 'Agricultural sciences',
    amount: '~ 16 437 UAH',
    href: '/infrastructures/instytut-silskohospodarskoi-mikrobiolohii',
  },
  {
    title: 'Berdiansk State Pedagogical University',
    text: 'Berdiansk State Pedagogical University',
    domain: 'Social sciences, humanities',
    amount: '~ 1 200 000 UAH',
    href: '/infrastructures/berdianskyi-derzhavnyi-pedahohichnyi-universytet',
  },
];

/**
 * The same entries as the home page's `Assistance in reconstruction` block
 * wants them — so the front page and `/infrastructures` cannot drift apart.
 */
export function pickReconstruction(count = 2): ListCardProps[] {
  return infrastructures.slice(0, count).map((entry) => ({
    title: entry.title,
    text: entry.text,
    price: entry.amount,
    href: entry.href,
  }));
}
