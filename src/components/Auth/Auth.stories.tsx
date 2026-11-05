import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  FirstLoginForm,
  ForgotPasswordForm,
  InvitationEmail,
  LinkSentNotice,
  LoginForm,
  PasswordSavedNotice,
  SetPasswordForm,
} from './index';
import { authCopy } from './authCopy';

const meta = {
  title: 'Cabinet/Sign-in screens',
  parameters: { layout: 'padded' },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const page = (node: React.ReactNode) => <div className="mx-auto max-w-[1744px] px-4 xl:px-10">{node}</div>;

/* 1 · login: email and password */
export const LoginEnglish: Story = { render: () => page(<LoginForm locale="en" />) };
export const LoginUkrainian: Story = { render: () => page(<LoginForm locale="uk" />) };
export const LoginWrongPassword: Story = {
  render: () => page(<LoginForm locale="uk" error="invalid" email="name@university.edu.ua" />),
};
export const LoginEmptyFields: Story = {
  render: () =>
    page(
      <LoginForm
        locale="en"
        emailError={authCopy.en.login.errors.emailRequired}
        passwordError={authCopy.en.login.errors.passwordRequired}
      />,
    ),
};
export const LoginLoading: Story = {
  render: () => page(<LoginForm locale="en" loading email="name@university.edu.ua" />),
};

/* 1b · first log in from the letter: email and one-time password */
export const FirstLoginEnglish: Story = { render: () => page(<FirstLoginForm locale="en" />) };
export const FirstLoginUkrainian: Story = { render: () => page(<FirstLoginForm locale="uk" />) };
export const FirstLoginWrongPassword: Story = {
  render: () => page(<FirstLoginForm locale="en" error="invalid" email="name@university.edu.ua" />),
};
export const FirstLoginExpiredPassword: Story = {
  render: () => page(<FirstLoginForm locale="uk" error="expired" email="name@university.edu.ua" />),
};
export const FirstLoginEmptyFields: Story = {
  render: () =>
    page(
      <FirstLoginForm
        locale="uk"
        emailError={authCopy.uk.firstLogin.errors.emailRequired}
        otpError={authCopy.uk.firstLogin.errors.otpRequired}
      />,
    ),
};

/* 2 · set password */
export const SetPasswordEnglish: Story = { render: () => page(<SetPasswordForm locale="en" />) };
export const SetPasswordUkrainian: Story = { render: () => page(<SetPasswordForm locale="uk" />) };
export const SetPasswordWeak: Story = {
  render: () => page(<SetPasswordForm locale="en" previewPassword="science1" />),
};
export const SetPasswordStrong: Story = {
  render: () => page(<SetPasswordForm locale="uk" previewPassword="Наука-проти-війни-2026!" />),
};
export const SetPasswordMismatch: Story = {
  render: () =>
    page(
      <SetPasswordForm
        locale="en"
        previewPassword="science-is-for-all-24"
        repeatError={authCopy.en.setPassword.errors.mismatch}
      />,
    ),
};
export const SetPasswordLoading: Story = {
  render: () => page(<SetPasswordForm locale="uk" loading previewPassword="Наука-проти-війни-2026!" />),
};

/* 3 · forgot password */
export const ForgotEnglish: Story = { render: () => page(<ForgotPasswordForm locale="en" />) };
export const ForgotUkrainian: Story = { render: () => page(<ForgotPasswordForm locale="uk" />) };
export const ForgotEmptyEmail: Story = {
  render: () => page(<ForgotPasswordForm locale="en" emailError={authCopy.en.forgot.errors.emailRequired} />),
};

/* 4 · "letter sent" */
export const SentEnglish: Story = { render: () => page(<LinkSentNotice locale="en" />) };
export const SentUkrainian: Story = { render: () => page(<LinkSentNotice locale="uk" />) };

/* 5 · the letter */
export const EmailNewLinkEnglish: Story = {
  parameters: { layout: 'fullscreen' },
  render: () => <InvitationEmail locale="en" kind="newLink" />,
};
export const EmailNewLinkUkrainian: Story = {
  parameters: { layout: 'fullscreen' },
  render: () => <InvitationEmail locale="uk" kind="newLink" />,
};
export const EmailInvitationEnglish: Story = {
  parameters: { layout: 'fullscreen' },
  render: () => <InvitationEmail locale="en" kind="invite" />,
};
export const EmailInvitationUkrainian: Story = {
  parameters: { layout: 'fullscreen' },
  render: () => <InvitationEmail locale="uk" kind="invite" />,
};

/* 6 · saved */
export const SavedEnglish: Story = { render: () => page(<PasswordSavedNotice locale="en" />) };
export const SavedUkrainian: Story = { render: () => page(<PasswordSavedNotice locale="uk" />) };
