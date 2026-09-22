import { PageLayout } from '../../components/PageLayout/PageLayout';

const EMAIL = 'info@scienceatrisk.org';

/** `/contacts` — how to reach the project. */
export function ContactsPage() {
  return (
    <PageLayout variant="story" crumbs={[{ label: 'Contacts' }]}>
      <div className="row flex-md-row flex-column-reverse">
        <div className="col-md-9 col-12">
          <h2 className="heading heading--h2 mt-0">Project contacts</h2>
          <p className="paragraph">For general inquiries:</p>
          <p className="paragraph">
            <a className="hover hover--underline" href={`mailto:${EMAIL}`}>
              {EMAIL}
            </a>
          </p>
        </div>
      </div>
    </PageLayout>
  );
}
