export interface ResearchPaperEntry {
  slug: string;
  title: string;
  /**
   * The authors alone. The kind of document is a label the card prints for
   * itself — the section is called Research, so nothing here says "White
   * Paper" any more.
   */
  authors: string;
  /** Opening paragraphs, as the detail page prints them. */
  summary?: string[];
  fileSize?: string;
}

export const researchPapers: ResearchPaperEntry[] = [
  {
    slug: 'impact-of-the-war-on-different-categories-of-ukrainian-scholars',
    title: 'Impact of the War on Different Categories of Ukrainian Scholars',
    authors: 'Olena Kozak, Lidia Kuzemska, Yevheniia Polishchuk, Kateryna Chuyeva',
    fileSize: '1.2 MB',
  },
  {
    slug: 'support-mechanisms-for-researchers-at-risk',
    title:
      'Support Mechanisms for Researchers at Risk: Historical Development, Survey Evidence, and Policy Lessons from Wartime Ukraine',
    authors: 'Ilona Sviezhentseva, Igor Lyman',
    fileSize: '2.1 MB',
  },
  {
    slug: 'strategic-priority-setting-in-research-in-times-of-crisis',
    title:
      'Strategic priority-setting in research in times of crisis: how to optimise decision-making for societal resilience',
    authors:
      "Pavel Gol'din, Oleksiy Kolezhuk, Vitaliy Omelyanenko, Anna Vorontsova, Svitlana Tarasenko",
    fileSize: '1.8 MB',
  },
  {
    slug: 'scientific-diaspora-a-unique-asset-for-post-war-recovery-of-ukraine',
    title: 'Scientific diaspora — a unique asset for post-war recovery of Ukraine',
    authors: 'Oleksandr Skorokhod',
    fileSize: '900 KB',
  },
  {
    slug: 'preserving-museum-archival-library-and-scientific-collections-during-the-war',
    title: 'Preserving Museum, Archival, Library, and Scientific Collections During the War',
    authors:
      "Pavlo Gol'din, Olena Zhukova, Olha Klymenko, Leonid Horobets, Tetiana Nykyrsa, Viktoria Konstantinova, Yevhen Nikolaiev",
    fileSize: '3.4 MB',
  },
];
