import { useParams } from 'react-router';
import { PageLayout } from '../../components/PageLayout/PageLayout';
import { FullImage } from '../../components/FullImage/FullImage';
import { StoryCard } from '../../components/StoryCard/StoryCard';
import { findStory, storyArticles } from './storyArticles';

const SHARE = [
  { label: 'Facebook', href: '#' },
  { label: 'Twitter', href: '#' },
  { label: 'Telegram', href: '#' },
];

/** `/stories/:slug` — one story: cover, body, sharing, and what to read next. */
export function StoryPage() {
  const { slug } = useParams();
  const story = findStory(slug);
  const more = storyArticles.filter((item) => item.slug !== story.slug).slice(0, 3);

  return (
    <PageLayout
      variant="story"
      crumbs={[{ label: 'Stories', href: '/stories' }, { label: story.title }]}
    >
      {story.image && <FullImage src={story.image} alt={story.title} />}

      <div className="row">
        <div className="col-md-9 col-12">
          <h1 className="story__main-title">{story.title}</h1>
          <p className="data">{story.date}</p>
        </div>
      </div>

      <div className="row flex-md-row flex-column-reverse">
        <div className="col-md-9 col-12">
          {story.body.map((block, i) =>
            block.kind === 'heading' ? (
              <h2 className="heading heading--h2" key={i}>
                {block.text}
              </h2>
            ) : (
              <p className="paragraph" key={i}>
                {block.text}
              </p>
            ),
          )}

          <div className="link">
            <p className="link__title">Share with help:</p>
            <ul className="link__wrap">
              {SHARE.map((item) => (
                <li className="link__item" key={item.label}>
                  <a href={item.href} className="hover hover--underline">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="offset-xl-1 col-xl-2 col-md-3 col-12">
          <aside className="storyAside">
            <div className="storyAside__text-wrap">
              <p className="storyAside__title">Keywords</p>
              <p className="storyAside__text">{story.tags.join(', ')}</p>
            </div>
          </aside>
        </div>
      </div>

      {more.length > 0 && (
        <>
          <h2 className="heading heading--h2">Other stories</h2>
          <div className="row">
            {more.map((item) => (
              <div className="col-lg-4 col-md-6 col-12" key={item.slug}>
                <StoryCard {...item} />
              </div>
            ))}
          </div>
        </>
      )}
    </PageLayout>
  );
}
