import { PageLayout } from '../../components/PageLayout/PageLayout';
import { SocietyCard } from '../../components/SocietyCard/SocietyCard';
import { Pagination } from '../../components/Pagination/Pagination';
import { infrastructures } from './infrastructuresContent';

/**
 * `/infrastructures` — damaged research infrastructure. The site's own
 * `.infrastructures-card` carries a science domain and the amount still
 * needed, with a column header naming both.
 */
export function InfrastructuresPage() {
  return (
    <PageLayout crumbs={[{ label: 'Damaged infrastructure' }]} variant="infrastructures" wrap={false}>
      <section className="infrastructures-hero">
        <div className="wrapper">
          <div className="row justify-content-between">
            <div className="col-md-8 col-12">
              <h1 className="infrastructures-hero__title">Assistance in reconstruction</h1>
              <p className="infrastructures-hero__text">
                Scientific infrastructure damaged during the war
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="infrastructures__wrapper">
        <div className="wrapper">
          <div className="infrastructures__header row">
            <div className="col-7">
              <p className="infrastructures__text-left">Institution and object</p>
            </div>
            <div className="col-5">
              <div className="infrastructures__right">
                <p className="infrastructures__text-left">Science Domain</p>
                <p className="infrastructures__text-right">Required amount</p>
              </div>
            </div>
          </div>

          <div className="infrastructures__list">
            {infrastructures.map(({ amount, ...entry }) => (
              <SocietyCard
                key={entry.href}
                {...entry}
                domainLabel="Science Domain"
                amountLabel="Required amount"
                amount={amount}
              />
            ))}
          </div>

          <Pagination current={1} total={4} hrefFor={(p) => `/infrastructures?page=${p}`} />
        </div>
      </section>
    </PageLayout>
  );
}
