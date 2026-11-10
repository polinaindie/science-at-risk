export type FooterLocale = 'en' | 'uk';

/** The foot of the page in each language: nothing of the other one shows. */
export const footerCopy = {
  en: {
    title: 'Want\nto help?',
    subtitle: 'Fill out the form or contact us',
    submit: 'Send',
    partnersTitle: 'The project is supported by:',
    implementerTitle: 'Responsible for project implementation:',
    implementerLabel: 'NGO "Kunsht"',
    overLimit: 'Please shorten your inquiry.',
    thanks: 'Thanks — we received your message.',
    fields: { name: 'Name', email: 'Email', topic: 'Topic', text: 'Text' },
    login: 'Log in',
    cabinet: 'My cabinet',
    logout: 'Log out',
    partners: [
      'Press, Education and Culture Department of the US Embassy in Ukraine',
      'Alfred P. Sloan Foundation',
      'Ministry of Education and Science of Ukraine',
      'National research fund',
    ],
  },
  uk: {
    title: 'Хочете\nдопомогти?',
    subtitle: 'Заповніть форму або зв’яжіться з нами',
    submit: 'Надіслати',
    partnersTitle: 'Проєкт підтримують:',
    implementerTitle: 'Відповідальні за реалізацію проєкту:',
    implementerLabel: 'ГО «Куншт»',
    overLimit: 'Будь ласка, скоротіть ваше звернення.',
    thanks: 'Дякуємо, ми отримали ваше повідомлення.',
    fields: { name: 'Ім’я', email: 'Електронна пошта', topic: 'Тема', text: 'Повідомлення' },
    login: 'Увійти',
    cabinet: 'Мій кабінет',
    logout: 'Вийти',
    partners: [
      'Відділ преси, освіти та культури Посольства США в Україні',
      'Фонд Альфреда П. Слоуна',
      'Міністерство освіти і науки України',
      'Національний фонд досліджень України',
    ],
  },
} as const;
