/**
 * Every word on the cabinet's sign-in screens and in its letters, in both
 * languages. The components take a `locale` and read from here, so the backend
 * can lift this file as the source for its own translation files.
 */
export type AuthLocale = 'en' | 'uk';

export interface AuthCopy {
  /** The everyday sign-in: email and password. */
  login: {
    title: string;
    lede: string;
    email: string;
    password: string;
    show: string;
    hide: string;
    submit: string;
    forgot: string;
    firstTime: string;
    noInviteTitle: string;
    noInvite: string;
    noInviteLink: string;
    errors: {
      emailRequired: string;
      emailInvalid: string;
      passwordRequired: string;
      invalid: string;
    };
  };
  /** First sign-in from the invitation letter: email and one-time password. */
  firstLogin: {
    title: string;
    lede: string;
    email: string;
    otp: string;
    otpHint: string;
    submit: string;
    lost: string;
    haveAccount: string;
    errors: {
      emailRequired: string;
      emailInvalid: string;
      otpRequired: string;
      invalid: string;
      expired: string;
    };
  };
  setPassword: {
    title: string;
    lede: string;
    password: string;
    repeat: string;
    show: string;
    hide: string;
    requirementsTitle: string;
    rules: { length: string; letter: string; digit: string };
    strength: { label: string; levels: [string, string, string, string] };
    submit: string;
    errors: { required: string; tooWeak: string; repeatRequired: string; mismatch: string };
  };
  forgot: {
    title: string;
    lede: string;
    email: string;
    submit: string;
    back: string;
    errors: { emailRequired: string; emailInvalid: string };
  };
  sent: {
    title: string;
    text: string;
    spam: string;
    back: string;
    again: string;
  };
  saved: {
    title: string;
    text: string;
    cta: string;
  };
  loading: string;
  email: {
    subjectInvite: string;
    subjectNewLink: string;
    preheaderInvite: string;
    preheaderNewLink: string;
    greeting: string;
    inviteLead: string;
    newLinkLead: string;
    steps: [string, string, string];
    otpLabel: string;
    cta: string;
    expiry: string;
    linkFallback: string;
    notYou: string;
    signature: string;
    footer: string;
  };
}

export const authCopy: Record<AuthLocale, AuthCopy> = {
  en: {
    login: {
      title: 'Log in',
      lede: 'Enter the email and the password you chose for the cabinet.',
      email: 'Email',
      password: 'Password',
      show: 'Show',
      hide: 'Hide',
      submit: 'Log in',
      forgot: 'Forgot password?',
      firstTime: 'First time here? Log in with the one-time password from your letter.',
      noInviteTitle: 'Entry is by invitation only',
      noInvite:
        'The cabinet is for members of a closed community. If nobody has invited you yet, write to the project team.',
      noInviteLink: 'Contact the team',
      errors: {
        emailRequired: 'Enter your email.',
        emailInvalid: 'Enter a valid email, like name@example.org.',
        passwordRequired: 'Enter your password.',
        invalid: 'The email or the password is not right. Try again, or reset the password.',
      },
    },
    firstLogin: {
      title: 'First log in',
      lede: 'Use the email address your invitation was sent to and the one-time password from that letter.',
      email: 'Email',
      otp: 'One-time password',
      otpHint: 'Copy it from the letter. It works once.',
      submit: 'Continue',
      lost: 'Lost the letter or the password does not work?',
      haveAccount: 'Already chose a password? Log in',
      errors: {
        emailRequired: 'Enter your email.',
        emailInvalid: 'Enter a valid email, like name@example.org.',
        otpRequired: 'Enter the one-time password from the letter.',
        invalid: 'The email or the one-time password is not right. Check the letter, or ask for a new one.',
        expired: 'This one-time password has expired. Ask for a new letter.',
      },
    },
    setPassword: {
      title: 'Choose your password',
      lede: 'This is your first time in the cabinet. Pick a password you will use from now on.',
      password: 'New password',
      repeat: 'Repeat the password',
      show: 'Show',
      hide: 'Hide',
      requirementsTitle: 'The password needs:',
      rules: { length: 'at least 10 characters', letter: 'a letter', digit: 'a digit' },
      strength: { label: 'Strength', levels: ['Weak', 'Fair', 'Good', 'Strong'] },
      submit: 'Save password',
      errors: {
        required: 'Choose a password.',
        tooWeak: 'The password does not meet the requirements yet.',
        repeatRequired: 'Repeat the password.',
        mismatch: 'The passwords do not match.',
      },
    },
    forgot: {
      title: 'Forgot your password?',
      lede: 'Enter your email. If you were invited, we will send a new letter with a link and a one-time password.',
      email: 'Email',
      submit: 'Send the letter',
      back: 'Back to log in',
      errors: {
        emailRequired: 'Enter your email.',
        emailInvalid: 'Enter a valid email, like name@example.org.',
      },
    },
    sent: {
      title: 'Check your email',
      text: 'If this address is in the system, we have sent a letter.',
      spam: 'It can take a few minutes. If it does not come, look in Spam.',
      back: 'Back to log in',
      again: 'Try another address',
    },
    saved: {
      title: 'Password saved',
      text: 'You are in. Welcome to the community.',
      cta: 'Go to my cabinet',
    },
    loading: 'Please wait',
    email: {
      subjectInvite: 'You are invited to the Science At Risk cabinet',
      subjectNewLink: 'A new link to the Science At Risk cabinet',
      preheaderInvite: 'Your one-time password and the link to log in.',
      preheaderNewLink: 'You asked for a new link. Your one-time password is inside.',
      greeting: 'Hello,',
      inviteLead:
        'You are invited to the cabinet of Science At Risk, a closed community of Ukrainian scientists and those who support them.',
      newLinkLead:
        'You asked for a new link to the Science At Risk cabinet. The old one-time password no longer works.',
      steps: [
        'Open the link below.',
        'Enter this email and the one-time password.',
        'Choose a password of your own.',
      ],
      otpLabel: 'Your one-time password',
      cta: 'Log in',
      expiry: 'The password works once and expires in 24 hours.',
      linkFallback: 'If the button does not work, copy this address into your browser:',
      notYou:
        'If you did not ask for this letter, you can ignore it. Nothing will change, and nobody can log in without the password.',
      signature: 'The Science At Risk team',
      footer: 'Science At Risk! Help for Ukrainian scientists affected by the war.',
    },
  },
  uk: {
    login: {
      title: 'Вхід',
      lede: 'Вкажіть email і пароль, які ви обрали для кабінету.',
      email: 'Електронна пошта',
      password: 'Пароль',
      show: 'Показати',
      hide: 'Сховати',
      submit: 'Увійти',
      forgot: 'Забули пароль?',
      firstTime: 'Вперше тут? Увійдіть з одноразовим паролем із листа.',
      noInviteTitle: 'Вхід лише за запрошенням',
      noInvite:
        'Кабінет призначений для учасників закритої спільноти. Якщо вас ще ніхто не запросив, напишіть команді проєкту.',
      noInviteLink: 'Зв’язатися з командою',
      errors: {
        emailRequired: 'Введіть email.',
        emailInvalid: 'Введіть коректний email, наприклад name@example.org.',
        passwordRequired: 'Введіть пароль.',
        invalid: 'Email або пароль неправильні. Спробуйте ще раз або скиньте пароль.',
      },
    },
    firstLogin: {
      title: 'Перший вхід',
      lede: 'Вкажіть email, на який надійшло запрошення, і одноразовий пароль із того листа.',
      email: 'Електронна пошта',
      otp: 'Одноразовий пароль',
      otpHint: 'Скопіюйте його з листа. Він діє один раз.',
      submit: 'Продовжити',
      lost: 'Загубили лист або пароль не підходить?',
      haveAccount: 'Вже обрали пароль? Увійти',
      errors: {
        emailRequired: 'Введіть email.',
        emailInvalid: 'Введіть коректний email, наприклад name@example.org.',
        otpRequired: 'Введіть одноразовий пароль із листа.',
        invalid: 'Email або одноразовий пароль неправильні. Перевірте лист або попросіть новий.',
        expired: 'Термін дії одноразового пароля минув. Попросіть новий лист.',
      },
    },
    setPassword: {
      title: 'Створіть свій пароль',
      lede: 'Ви вперше в кабінеті. Оберіть пароль, яким користуватиметесь надалі.',
      password: 'Новий пароль',
      repeat: 'Повторіть пароль',
      show: 'Показати',
      hide: 'Сховати',
      requirementsTitle: 'У паролі має бути:',
      rules: { length: 'щонайменше 10 символів', letter: 'літера', digit: 'цифра' },
      strength: { label: 'Надійність', levels: ['Слабкий', 'Посередній', 'Добрий', 'Надійний'] },
      submit: 'Зберегти пароль',
      errors: {
        required: 'Придумайте пароль.',
        tooWeak: 'Пароль ще не відповідає вимогам.',
        repeatRequired: 'Повторіть пароль.',
        mismatch: 'Паролі не збігаються.',
      },
    },
    forgot: {
      title: 'Забули пароль?',
      lede: 'Вкажіть email. Якщо вас запрошено, ми надішлемо новий лист із посиланням і одноразовим паролем.',
      email: 'Електронна пошта',
      submit: 'Надіслати лист',
      back: 'Назад до входу',
      errors: {
        emailRequired: 'Введіть email.',
        emailInvalid: 'Введіть коректний email, наприклад name@example.org.',
      },
    },
    sent: {
      title: 'Перевірте пошту',
      text: 'Якщо ця адреса є в системі, ми надіслали лист.',
      spam: 'Це може зайняти кілька хвилин. Якщо листа немає, зазирніть у «Спам».',
      back: 'Назад до входу',
      again: 'Спробувати іншу адресу',
    },
    saved: {
      title: 'Пароль збережено',
      text: 'Ви в кабінеті. Вітаємо в спільноті.',
      cta: 'Перейти до кабінету',
    },
    loading: 'Зачекайте',
    email: {
      subjectInvite: 'Вас запрошено до кабінету Science At Risk',
      subjectNewLink: 'Нове посилання до кабінету Science At Risk',
      preheaderInvite: 'Ваш одноразовий пароль і посилання для входу.',
      preheaderNewLink: 'Ви попросили нове посилання. Одноразовий пароль у листі.',
      greeting: 'Вітаємо!',
      inviteLead:
        'Вас запрошено до кабінету Science At Risk — закритої спільноти українських науковців і тих, хто їх підтримує.',
      newLinkLead:
        'Ви попросили нове посилання до кабінету Science At Risk. Попередній одноразовий пароль уже не діє.',
      steps: [
        'Відкрийте посилання нижче.',
        'Введіть цей email і одноразовий пароль.',
        'Придумайте власний пароль.',
      ],
      otpLabel: 'Ваш одноразовий пароль',
      cta: 'Увійти',
      expiry: 'Пароль діє один раз і втрачає чинність за 24 години.',
      linkFallback: 'Якщо кнопка не працює, скопіюйте цю адресу в браузер:',
      notYou:
        'Якщо ви не просили цього листа, просто проігноруйте його. Нічого не зміниться, а без пароля ніхто не зможе увійти.',
      signature: 'Команда Science At Risk',
      footer: 'Science At Risk! Допомога українським вченим, які постраждали від війни.',
    },
  },
};
