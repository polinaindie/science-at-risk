import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  ApprovedBanner,
  CabinetDemo,
  CabinetLayout,
  CollaborationScreen,
  OpportunitiesScreen,
  ProfileEditForm,
  ProfileView,
  SubmitConfirmModal,
  emptyPublication,
  sampleCourses,
  sampleGrants,
  sampleMatches,
  sampleProfile,
} from './index';

const meta = {
  title: 'Cabinet/My cabinet',
  parameters: { layout: 'fullscreen' },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const frame = (
  node: React.ReactNode,
  section: 'profile' | 'collaboration' | 'opportunities' = 'profile',
  blue = false,
) => (
  <CabinetLayout
    locale="uk"
    name={blue ? undefined : sampleProfile.uk.nameUk}
    ground={blue ? 'blue' : 'white'}
    section={section}
    unread={3}
    marked={['collaboration', 'opportunities']}
    status="approved"
  >
    {node}
  </CabinetLayout>
);

/* The whole thing, wired: edit → send → sheet → under review. */
export const WholeCabinetUkrainian: Story = { render: () => <CabinetDemo locale="uk" /> };
export const WholeCabinetEnglish: Story = { render: () => <CabinetDemo locale="en" /> };

/* My profile: view in each status */
export const ProfileApproved: Story = {
  render: () => frame(<ProfileView locale="uk" profile={sampleProfile.uk} status="approved" onPhoto={() => {}} />, 'profile', true),
};
export const ProfileDraft: Story = {
  render: () => frame(<ProfileView locale="uk" profile={sampleProfile.uk} status="draft" />, 'profile', true),
};
export const ProfilePending: Story = {
  render: () =>
    frame(<ProfileView locale="uk" profile={sampleProfile.uk} status="pending" onWithdraw={() => {}} />, 'profile', true),
};
export const ProfileApprovedEnglish: Story = {
  render: () => frame(<ProfileView locale="en" profile={sampleProfile.en} status="approved" />, 'profile', true),
};

/* Edit, with the fixed bar, with errors, with the leave-sheet */
export const Edit: Story = {
  render: () => frame(<ProfileEditForm locale="uk" initial={sampleProfile.uk} />),
};
export const EditWithErrors: Story = {
  render: () =>
    frame(
      <ProfileEditForm
        locale="uk"
        initial={{ ...sampleProfile.uk, nameUk: '', institution: '', activity: '' }}
        showErrors
      />,
    ),
};
/** Wrong formats: Cyrillic English name, a Facebook link in the ORCID field, a half-filled publication. */
export const EditFormatErrors: Story = {
  render: () =>
    frame(
      <ProfileEditForm
        locale="uk"
        initial={{
          ...sampleProfile.uk,
          nameEn: 'Андрій Ачасов',
          orcid: 'https://facebook.com/achasov',
          publications: [
            { ...emptyPublication, title: 'Моделювання ерозії ґрунтів', year: '22', url: 'doi.org/abc' },
          ],
        }}
        showErrors
      />,
    ),
};
export const EditSending: Story = {
  render: () => frame(<ProfileEditForm locale="en" initial={sampleProfile.en} sending />),
};
export const EditLeaveSheet: Story = {
  render: () =>
    frame(<ProfileEditForm locale="uk" initial={sampleProfile.uk} confirmingCancel />),
};

/* After sending, and after approval */
export const SubmitSheet: Story = {
  render: () => (
    <>
      {frame(<ProfileView locale="uk" profile={sampleProfile.uk} status="pending" />, 'profile', true)}
      <SubmitConfirmModal locale="uk" />
    </>
  ),
};
export const ApprovedBannerStory: Story = {
  name: 'Approved banner',
  render: () =>
    frame(
      <div className="space-y-6">
        <ApprovedBanner locale="uk" onClose={() => {}} />
        <ProfileView locale="uk" profile={sampleProfile.uk} status="approved" />
      </div>,
    ),
};

/* Collaboration */
export const CollaborationList: Story = {
  render: () =>
    frame(<CollaborationScreen locale="uk" scientists={sampleMatches.uk} />, 'collaboration'),
};
export const CollaborationRequestSent: Story = {
  render: () =>
    frame(
      <CollaborationScreen locale="uk" scientists={sampleMatches.uk} requests={{ m1: 'sent' }} />,
      'collaboration',
    ),
};
export const CollaborationRequestError: Story = {
  render: () =>
    frame(
      <CollaborationScreen locale="uk" scientists={sampleMatches.uk} requests={{ m1: 'error' }} />,
      'collaboration',
    ),
};
export const CollaborationNoMatches: Story = {
  render: () => frame(<CollaborationScreen locale="uk" scientists={[]} />, 'collaboration'),
};
export const CollaborationNothingFound: Story = {
  render: () =>
    frame(
      <CollaborationScreen locale="uk" scientists={sampleMatches.uk} query="zzz" />,
      'collaboration',
    ),
};

/* Opportunities */
export const Courses: Story = {
  render: () =>
    frame(
      <OpportunitiesScreen locale="uk" courses={sampleCourses.uk} grants={sampleGrants.uk} />,
      'opportunities',
    ),
};
export const Grants: Story = {
  render: () =>
    frame(
      <OpportunitiesScreen
        locale="uk"
        courses={sampleCourses.uk}
        grants={sampleGrants.uk}
        tab="grants"
      />,
      'opportunities',
    ),
};
export const GrantsEmpty: Story = {
  render: () =>
    frame(
      <OpportunitiesScreen locale="uk" courses={sampleCourses.uk} grants={[]} tab="grants" />,
      'opportunities',
    ),
};
export const CoursesEmpty: Story = {
  render: () =>
    frame(<OpportunitiesScreen locale="uk" courses={[]} grants={sampleGrants.uk} />, 'opportunities'),
};
