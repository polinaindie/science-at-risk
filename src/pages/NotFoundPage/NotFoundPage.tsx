import { PageLayout } from '../../components/PageLayout/PageLayout';
import { Button } from '../../components/Button/Button';

/** Anything the router cannot place, in the site's own `.errors` template. */
export function NotFoundPage() {
  return (
    <PageLayout variant="errors" crumbs={[{ label: 'Page not found' }]}>
      <div className="errors">
        <h1 className="errors__main-title">404</h1>
        <p className="errors__text errors__description">
          This page has moved or never existed. The sections above are all still here.
        </p>
        <div className="d-flex justify-content-center">
          <Button href="/">Back to the home page</Button>
        </div>
      </div>
    </PageLayout>
  );
}
