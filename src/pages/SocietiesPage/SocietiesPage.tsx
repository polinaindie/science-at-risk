import { PageLayout } from '../../components/PageLayout/PageLayout';
import { SocietyCard } from '../../components/SocietyCard/SocietyCard';
import { Pagination } from '../../components/Pagination/Pagination';
import { societies } from './societiesContent';

/**
 * `/societies` — scientific societies. The same `.infrastructures-card` list
 * as the damaged-infrastructure page, without the funding column.
 */
export function SocietiesPage() {
  return (
    <PageLayout crumbs={[{ label: 'Scientific societies' }]} variant="infrastructures" wrap={false}>
      <section className="infrastructures-hero">
        <div className="wrapper">
          <div className="row justify-content-between">
            <div className="col-md-8 col-12">
              <h1 className="infrastructures-hero__title">Scientific societies</h1>
              <p className="infrastructures-hero__text">
                Find Ukrainian scientific society for collaboration
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="infrastructures__wrapper">
        <div className="wrapper">
          <div className="infrastructures__header row">
            <div className="col-7">
              <p className="infrastructures__text-left">Society</p>
            </div>
            <div className="col-5">
              <div className="infrastructures__right">
                <p className="infrastructures__text-left">Science Domain</p>
              </div>
            </div>
          </div>

          <div className="infrastructures__list">
            {societies.map((society) => (
              <SocietyCard key={society.href} {...society} />
            ))}
          </div>

          <Pagination current={1} total={5} hrefFor={(p) => `/societies?page=${p}`} />
        </div>
      </section>
    </PageLayout>
  );
}
