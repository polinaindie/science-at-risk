import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  ApprovedBanner,
  CabinetDemo,
  CabinetLayout,
  CollaborationScreen,
  OnboardingWizard,
  NotificationsScreen,
  OpportunitiesScreen,
  ProfileEditForm,
  ProfileView,
  SubmitConfirmModal,
  emptyProfile,
  emptyPublication,
  sampleCourses,
  sampleGrants,
  sampleManyNotifications,
  sampleMatches,
  sampleNotifications,
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
  section: 'profile' | 'notifications' | 'collaboration' | 'courses' | 'grants' = 'profile',
  blue = false,
  unread = 3,
) => (
  <CabinetLayout
    locale="uk"
    name={blue ? undefined : sampleProfile.uk.nameUk}
    ground={blue ? 'blue' : 'white'}
    section={section}
    unread={unread}
    marked={['collaboration', 'courses', 'grants']}
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
export const EditLeaveSheet: Story = {
  render: () =>
    frame(<ProfileEditForm locale="uk" initial={sampleProfile.uk} confirmingCancel />),
};

/* Saved changes that are not sent yet: one send for all of them */
export const ProfileUnsent: Story = {
  render: () =>
    frame(
      <ProfileView
        locale="uk"
        profile={sampleProfile.uk}
        status="approved"
        unsent
        onSend={() => {}}
        onDiscard={() => {}}
        onPhoto={() => {}}
      />,
      'profile',
      true,
    ),
};
export const ProfileUnsentSending: Story = {
  render: () =>
    frame(
      <ProfileView locale="uk" profile={sampleProfile.uk} status="approved" unsent sending onSend={() => {}} onDiscard={() => {}} />,
      'profile',
      true,
    ),
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
export const CollaborationRequestAccepted: Story = {
  render: () =>
    frame(
      <CollaborationScreen locale="uk" scientists={sampleMatches.uk} requests={{ m1: 'accepted' }} />,
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
      'courses',
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
      'grants',
    ),
};
export const GrantsEmpty: Story = {
  render: () =>
    frame(
      <OpportunitiesScreen locale="uk" courses={sampleCourses.uk} grants={[]} tab="grants" />,
      'grants',
    ),
};
export const CoursesEmpty: Story = {
  render: () =>
    frame(<OpportunitiesScreen locale="uk" courses={[]} grants={sampleGrants.uk} />, 'courses'),
};

/* Notifications: copies of visitors' requests and team messages. Reply happens by email. */
const allRead = (list: typeof sampleNotifications.uk) => list.map((n) => ({ ...n, read: true }));

export const NotificationsList: Story = {
  render: () =>
    frame(
      <NotificationsScreen locale="uk" notifications={sampleNotifications.uk} />,
      'notifications',
    ),
};
export const NotificationsAllRead: Story = {
  render: () =>
    frame(
      <NotificationsScreen locale="uk" notifications={allRead(sampleNotifications.uk)} />,
      'notifications',
      false,
      0,
    ),
};
export const NotificationsEmpty: Story = {
  render: () =>
    frame(<NotificationsScreen locale="uk" notifications={[]} />, 'notifications', false, 0),
};
/** Forty-seven: ten to a page. */
export const NotificationsManyPages: Story = {
  render: () =>
    frame(
      <NotificationsScreen locale="uk" notifications={sampleManyNotifications.uk} />,
      'notifications',
      false,
      5,
    ),
};
export const NotificationsLastPage: Story = {
  render: () =>
    frame(
      <NotificationsScreen locale="uk" notifications={sampleManyNotifications.uk} page={5} />,
      'notifications',
      false,
      5,
    ),
};
export const NotificationsEnglish: Story = {
  render: () =>
    frame(
      <NotificationsScreen
        locale="en"
        notifications={sampleNotifications.en}
      />,
      'notifications',
    ),
};

/* ------------------------------------------------- first sign-in: the wizard */

const firstProfile = emptyProfile(sampleProfile.uk.email);
/** Everything but the field of knowledge and the recommenders: the review has something left to say. */
const almostFilled = { ...sampleProfile.uk, field: '', specialties: [], activities: [], recommenders: [], consents: { personalData: false, publish: '' as const } };

export const FirstLoginWelcome: Story = {
  render: () => <OnboardingWizard locale="uk" initial={firstProfile} />,
};
export const FirstLoginStepAbout: Story = {
  render: () => <OnboardingWizard locale="uk" initial={firstProfile} initialStep={0} />,
};
export const FirstLoginStepAboutErrors: Story = {
  render: () => <OnboardingWizard locale="uk" initial={firstProfile} initialStep={0} showErrors />,
};
export const FirstLoginStepField: Story = {
  render: () => <OnboardingWizard locale="uk" initial={firstProfile} initialStep={3} />,
};
export const FirstLoginStepCareer: Story = {
  render: () => <OnboardingWizard locale="uk" initial={firstProfile} initialStep={4} />,
};
export const FirstLoginStepRecommenders: Story = {
  render: () => <OnboardingWizard locale="uk" initial={firstProfile} initialStep={7} />,
};
export const FirstLoginReviewIncomplete: Story = {
  render: () => <OnboardingWizard locale="uk" initial={almostFilled} initialStep={8} />,
};
export const FirstLoginReviewReady: Story = {
  render: () => <OnboardingWizard locale="uk" initial={sampleProfile.uk} initialStep={8} />,
};
export const FirstLoginEnglish: Story = {
  render: () => <OnboardingWizard locale="en" initial={emptyProfile(sampleProfile.en.email)} initialStep={1} />,
};
export const FirstLoginWholeFlow: Story = {
  render: () => <CabinetDemo locale="uk" firstLogin controls />,
};
