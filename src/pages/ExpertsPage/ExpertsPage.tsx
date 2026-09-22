import { useMemo, useState } from 'react';
import { PageLayout } from '../../components/PageLayout/PageLayout';
import { SearchHero } from '../../components/SearchHero/SearchHero';
import { ExpertCard } from '../../components/ExpertCard/ExpertCard';
import { EmptyState } from '../../components/EmptyState/EmptyState';
import { Pagination } from '../../components/Pagination/Pagination';
import { experts, expertRequests } from './expertsContent';

/**
 * `/experts` — the site's search page for scientists: the search hero, the
 * popular queries, and the list of matching cards.
 *
 * The filtering is done here over the sample list, the way the site's own
 * `_searchScientists` form does it over its API, so the empty state and the
 * tag shortcuts are real rather than decorative.
 */
export function ExpertsPage() {
  const [query, setQuery] = useState('');

  const results = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return experts;
    return experts.filter((expert) =>
      [expert.name, expert.affiliation, expert.summary, ...(expert.tags ?? [])]
        .filter(Boolean)
        .some((field) => String(field).toLowerCase().includes(needle)),
    );
  }, [query]);

  return (
    <PageLayout crumbs={[{ label: 'Experts' }]} wrap={false}>
      <SearchHero
        title="Find Ukrainian scientists for collaboration"
        fieldLabel="Scientific field or name"
        submitLabel="Find a scientist"
        popular={expertRequests}
        full={false}
        onSearch={setQuery}
        onTagSelect={setQuery}
      />

      <section className="experts">
        <div className="wrapper">
          {results.length === 0 ? (
            <EmptyState
              suggestions={expertRequests.map((request) => request.label)}
              onSelect={setQuery}
            />
          ) : (
            <ul className="experts__list">
              {results.map((expert) => (
                <li className="experts__item" key={expert.href}>
                  <ExpertCard {...expert} onTagClick={setQuery} />
                </li>
              ))}
            </ul>
          )}

          {results.length > 0 && <Pagination current={1} total={3} hrefFor={(p) => `/experts?page=${p}`} />}
        </div>
      </section>
    </PageLayout>
  );
}
