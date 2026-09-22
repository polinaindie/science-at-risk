import { useState } from 'react';
import { PageLayout } from '../../components/PageLayout/PageLayout';
import { StoryCard } from '../../components/StoryCard/StoryCard';
import { Select } from '../../components/Select/Select';
import { Pagination } from '../../components/Pagination/Pagination';
import { stories } from './storiesContent';

const STREAMS = ['Stories', 'Blogs'] as const;

/**
 * `/stories` — the archive. The site splits it into two streams behind a
 * select, `?theme=stories` and `?theme=blogs`.
 */
export function StoriesPage() {
  const [stream, setStream] = useState<(typeof STREAMS)[number]>('Stories');
  const shown = stories.filter((story) => story.stream === stream);

  return (
    <PageLayout crumbs={[{ label: 'Stories' }]} variant="pageStories">
      <div className="row justify-content-between align-items-center">
        <div className="col-md-8 col-12">
          <h1 className="pageStories__title">Stories</h1>
        </div>
        <div className="col-md-4 col-12">
          <Select
            className="pageStories__select"
            value={stream}
            options={STREAMS.map((label) => ({ label }))}
            onSelect={(label) => setStream(label as (typeof STREAMS)[number])}
          />
        </div>
      </div>

      <div className="pageStories__wrapper row">
        {shown.map((story) => (
          <div className="col-lg-4 col-md-6 col-12" key={story.slug}>
            <StoryCard {...story} />
          </div>
        ))}
      </div>

      <Pagination current={1} total={3} hrefFor={(p) => `/stories?page=${p}`} />
    </PageLayout>
  );
}
