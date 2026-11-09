/**
 * Every word in the cabinet, in both languages. Components take a `locale`
 * and read from here, so the backend can lift this file as the source for its
 * own translation files (same contract as `authCopy`).
 */
export type CabinetLocale = 'en' | 'uk';
export type CabinetSection = 'profile' | 'notifications' | 'collaboration' | 'opportunities' | 'settings';
export type ProfileStatus = 'draft' | 'pending' | 'approved';

export interface SettingsCopy {
  title: string;
  lede: string;
  email: { title: string; text: string; change: string; newLabel: string; send: string; cancel: string; sent: (e: string) => string; invalid: string };
  password: {
    title: string;
    text: string;
    current: string;
    next: string;
    repeat: string;
    show: string;
    hide: string;
    rulesTitle: string;
    rules: { length: string; letter: string; digit: string };
    submit: string;
    saved: string;
    failed: string;
    busy: string;
    close: string;
    errors: { current: string; wrong: string; same: string; weak: string; mismatch: string };
  };
  letters: { title: string; text: string; items: { requests: string; team: string; opportunities: string }; saved: string };
  language: { title: string; text: string; uk: string; en: string };
  delete: { title: string; text: string; action: string; askTitle: string; askText: string; confirm: string; keep: string; doneTitle: string; doneText: string };
}

export interface CabinetCopy {
  nav: { label: string; items: Record<CabinetSection, string>; new: string; logout: string };
  status: Record<
    ProfileStatus,
    { label: string; text: string }
  >;
  profile: {
    title: string;
    edit: string;
    editLocked: string;
    withdraw: string;
    openOnSite: string;
    pendingNote: string;
    sections: Record<
      'activity' | 'area' | 'experience' | 'expert' | 'publications' | 'keywords' | 'projects' | 'otherProjects' | 'societies',
      string
    >;
    aside: { languages: string; links: string };
    change: string;
    add: string;
    parts: Record<'photo' | 'links' | 'name', string>;
    empty: string;
    unsent: {
      send: string;
      discard: string;
      bar: string;
      discardTitle: string;
      discardText: string;
      discardKeep: string;
      discardConfirm: string;
    };
  };
  edit: {
    title: string;
    partTitle: string;
    lede: string;
    required: string;
    groups: Record<'photo' | 'contacts' | 'science' | 'publications' | 'keywords' | 'societies' | 'links', string>;
    fields: Record<string, string>;
    hints: Record<string, string>;
    societies: { hint: string; search: string; none: string; selected: (n: number) => string };
    picker: { otherOption: string; otherLabel: string; otherHint: string; field: string; select: string; specialties: string; specialtiesHint: string; firstField: string; extraHint: string; addField: string; moreTitle: (n: number) => string; removeField: string; errField: string; errSpecialty: string };
    linkRemove: { aria: string; title: string; text: (label: string) => string; confirm: string };
    photoRemove: string;
    options: { degree: string[]; rank: string[]; activity: string[] };
    select: string;
    addPublication: string;
    addActivity: string;
    fromAccount: string;
    errors: Record<'required' | 'nameEn' | 'orcid' | 'linkedin' | 'facebook' | 'url' | 'year', string>;
    experience: { year: string; position: string; place: string; yearHint: string; positionHint: string; placeHint: string; addJob: string; addExpert: string };
    publication: {
      titles: [string, string, string];
      fields: Record<'title' | 'authors' | 'journal' | 'year' | 'pages' | 'role' | 'url', string>;
      hints: Record<'authors' | 'pages' | 'url', string>;
      roles: Record<'author' | 'lead' | 'coauthor', string>;
      remove: string;
      preview: string;
      roleIs: string;
      open: string;
    };
    project: {
      fields: Record<'title' | 'description' | 'role' | 'url', string>;
      hints: Record<'title' | 'description' | 'role', string>;
      addScience: string;
      addOther: string;
      open: string;
    };
    bar: { save: string; cancel: string; unsaved: string; saved: string; sending: string };
    cancelTitle: string;
    cancelText: string;
    cancelKeep: string;
    cancelDiscard: string;
  };
  confirm: {
    title: string;
    text: string;
    steps: [string, string, string];
    close: string;
    toProfile: string;
  };
  photoDialog: {
    title: string;
    drop: string;
    or: string;
    choose: string;
    another: string;
    tipsTitle: string;
    tips: string[];
    save: string;
    cancel: string;
    errType: string;
    errSize: string;
    errSmall: (min: number) => string;
    errRead: string;
    preview: string;
  };
  approved: { title: string; text: string; link: string; close: string };
  collab: {
    title: string;
    lede: string;
    search: string;
    find: string;
    shared: string;
    request: string;
    requested: string;
    retry: string;
    errorText: string;
    emptyTitle: string;
    emptyText: string;
    emptyAction: string;
    noResultsTitle: string;
    noResultsText: string;
    requestSent: string;
    accepted: string;
    acceptedText: string;
    demoAccepted: string;
    writeTitle: (name: string) => string;
    writeLabel: string;
    writeHint: string;
    writeEmpty: string;
    send: string;
    cancel: string;
    count: (n: number) => string;
  };
  opp: {
    title: string;
    lede: string;
    tabs: { courses: string; grants: string };
    courses: { lede: string; provider: string; open: string; emptyTitle: string; emptyText: string };
    grants: {
      lede: string;
      open: string;
      deadline: string;
      field: string;
      soon: (days: number) => string;
      emptyTitle: string;
      emptyText: string;
      emptyAction: string;
    };
  };
  notifications: {
    title: string;
    lede: string;
    listLabel: string;
    unreadMark: string;
    unreadCount: (n: number) => string;
    allRead: string;
    markAllRead: string;
    markedAllRead: string;
    requestTitle: string;
    requestText: string;
    teamTitle: string;
    teamName: string;
    colleagueTitle: string;
    from: string;
    colleague: string;
    accept: string;
    decline: string;
    youAccepted: string;
    youDeclined: string;
    writeTo: string;
    markRead: string;
    declinedNote: string;
    acceptAgain: string;
    profileOf: (name: string) => string;
    staleCancelled: string;
    staleDeleted: string;
    unreadEmpty: string;
    emptyTab: string;
    more: string;
    moreLoading: string;
    allShown: string;
    deleteAction: string;
    actions: string;
    deletedToast: string;
    deletedSaid: string;
    tabs: { label: string; all: string; unread: string };
    mutual: (names: string[]) => string;
    declinedToast: string;
    undo: string;
    closeToast: string;
    undoneSaid: string;
    acceptedTitle: string;
    acceptedSaid: string;
    declinedSaid: string;
    subject: string;
    sender: string;
    emptyTitle: string;
    emptyText: string;
    pager: { label: string; prev: string; next: string };
  };
  settings: SettingsCopy;
  demo: { label: string; status: string; section: string; state: string };
}

const en: CabinetCopy = {
  nav: {
    label: 'Cabinet',
    items: {
      profile: 'My profile',
      notifications: 'My notifications',
      collaboration: 'Collaboration',
      opportunities: 'Opportunities',
      settings: 'Settings',
    },
    new: 'New',
    logout: 'Log out',
  },
  status: {
    draft: {
      label: 'Draft',
      text: 'You have changes that have not been sent. The site still shows the last approved version.',
    },
    pending: {
      label: 'Under review',
      text: 'The team is checking your changes. The site shows the previous version until they are approved.',
    },
    approved: {
      label: 'Approved',
      text: '',
    },
  },
  profile: {
    title: 'My profile',
    edit: 'Edit',
    editLocked: 'Editing is paused while the team reviews your changes.',
    withdraw: 'Withdraw and keep editing',
    openOnSite: 'Open on the site',
    change: 'Change',
    add: 'Add',
    parts: { photo: 'photo', links: 'links', name: 'name and position' },
    pendingNote: 'This is the version you sent. It is not on the site yet.',
    sections: { activity: 'Main activity:', area: 'Description of the field of scientific research:', experience: 'Professional experience:', expert: 'Expert experience:', publications: 'Key publications:', keywords: 'Keywords:', projects: 'Scientific projects:', otherProjects: 'Other projects:', societies: 'Scientific societies:' },
    aside: { languages: 'Languages for professional communication:', links: 'Links:' },
    empty: 'Not filled in yet',
    unsent: {
      send: 'Send changes',
      discard: 'Discard changes',
      bar: 'Unsent changes',
      discardTitle: 'Discard unsent changes?',
      discardText: 'Every change you saved but did not send will be lost. The site keeps the previous version.',
      discardKeep: 'Keep them',
      discardConfirm: 'Discard',
    },
  },
  edit: {
    title: 'Edit profile',
    partTitle: 'Change',
    lede: 'Everything you filled in at registration is here. Change what has moved on and add what is new. Save as you go, then send all the changes together. The team checks them at once, and they appear on the site only after the check.',
    required: '* required',
    groups: { photo: 'Photo', contacts: 'Contact details', science: 'Scientific profile', publications: 'Key publications (1 to 3)', keywords: 'Keywords and activity', societies: 'Scientific societies', links: 'Contacts and links' },
    fields: { photoChange: 'Change photo', nameUk: 'Full name in Ukrainian', nameEn: 'Full name in English', email: 'Email', phone: 'Mobile phone', orcid: 'ORCID link', facebook: 'Facebook link', linkedin: 'LinkedIn link', degree: 'Scientific degree', degreeOther: 'Which degree exactly', activityOther: 'Which activity exactly', rank: 'Academic title', institution: 'Official full name of the institution', languages: 'Foreign languages', activity: 'Main activity', area: 'Field of scientific research', experience: 'Professional experience', expert: 'Expert experience', field: 'Field of knowledge and speciality', extraFields: 'Suggest another field or speciality', act1: 'Additional activity 1', act2: 'Additional activity 2', act3: 'Additional activity 3', extraActivities: 'Other activities', scienceProjects: 'Participation in scientific projects', otherProjects: 'Participation in other projects', societies: 'Scientific societies' },
    societies: { hint: 'Tick the societies you belong to; the profile will link to their pages on the site.', search: 'Search the societies', none: 'No society found.', selected: (n) => `Selected: ${n}` },
    picker: { otherOption: 'Not in the list', otherLabel: 'Your field or speciality', otherHint: 'The editors will look at it before it is added.', field: 'Field of knowledge', select: 'Select', specialties: 'Specialities', specialtiesHint: 'Tick one or several.', firstField: 'First choose the field of knowledge.', addField: 'Add a field', moreTitle: (n) => `Another field ${n}`, removeField: 'Remove this field', extraHint: 'Not in the list? Write your own field here; the editors will look at it before it is added.', errField: 'Pick a field of knowledge from the list.', errSpecialty: 'Pick at least one speciality.' },
    linkRemove: { aria: 'Remove link', title: 'Remove this link?', text: (l) => `${l} will be removed from your profile after you send it.`, confirm: 'Remove' },
    photoRemove: 'Remove photo',
    hints: { photo: 'A square picture, JPEG or PNG, up to 10 MB. About 420×420 px on a plain background.', phone: 'Not published on the site.', email: 'Taken from your account. To change it, email us.', nameUk: 'Taken from your account. To change it, email us.', activity: 'In the first person, a few sentences; the editors will turn them into the text for your page. For example: “I am a PhD student in research policy at Lund University (Sweden). I am interested in how modern research infrastructures are governed.”', area: 'A list separated by semicolons; a double space types one for you. The editors will turn it into the text for your page. For example: gemological study of Ukrainian gemstones; pricing and valuation of precious stones; expert assessment and diagnostics of gems.', experience: 'One line per post: “year – position, place of work”.', expert: 'In the same format.', field: 'From the list of fields and specialities.' },
    options: { degree: ['Candidate of Sciences / PhD', 'Doctor of Sciences', 'Other'], rank: ['None', 'Associate Professor', 'Senior Researcher', 'Professor'], activity: ['Science popularisation / science communication', 'Science policy', 'Programming', 'Public speaking', 'Writing books', 'Networking', 'Project management', 'Entrepreneurship', 'Grant writing / fundraising', 'Patenting', 'Commercialisation of scientific inventions', 'Research ethics', 'Academic integrity', 'Working with databases', 'Teaching', 'Other'] },
    select: 'Choose',
    addPublication: 'Add a publication',
    addActivity: 'Add an activity',
    fromAccount: 'From your account',
    errors: {
      required: 'Fill this in.',
      nameEn: 'Latin letters only, surname and first name: Volodymyr Shevchenko.',
      orcid: 'This should be a link to your orcid.org page, like https://orcid.org/0000-0000-0000-0000.',
      linkedin: 'This should be a link to a page on linkedin.com.',
      facebook: 'This should be a link to a page on facebook.com.',
      url: 'A link starts with https://',
      year: 'The year is four digits, for example 2022.',
    },
    experience: { year: 'Year', position: 'Position', place: 'Place of work', yearHint: '2021 or 2018–2021', positionHint: 'Head of department', placeHint: 'Kharkiv University', addJob: 'Add a place of work', addExpert: 'Add a role' },
    publication: {
      titles: ['The most important publication', 'Second important publication', 'Third important publication'],
      fields: { title: 'Title of the publication', authors: 'Authors', journal: 'Journal or publisher', year: 'Year', pages: 'Pages', role: 'Your role', url: 'Link to the publication' },
      hints: { authors: 'Pavlyuk N., Dmytriv G.', pages: 'For example: 1–13', url: 'Where it can be read or found. A DOI link works.' },
      roles: { author: 'Author', lead: 'Lead author', coauthor: 'Co-author' },
      remove: 'Remove',
      preview: 'How it will look on the site:',
      roleIs: 'Role',
      open: 'Read the publication',
    },
    project: {
      fields: { title: 'Project name', description: 'Short description', role: 'Your role', url: 'Link to the project' },
      hints: { title: 'ERASMUS+ SUNRISE', description: 'What the project is about', role: 'Coordinator at the university' },
      addScience: 'Add a project',
      addOther: 'Add a project',
      open: 'Open the project',
    },
    bar: { save: 'Save changes', cancel: 'Cancel', unsaved: 'Unsaved changes', saved: 'No changes yet', sending: 'Sending' },
    cancelTitle: 'Leave without saving?',
    cancelText: 'Unsaved edits will be lost. Changes you have already saved stay in your profile until you send them.',
    cancelKeep: 'Keep editing',
    cancelDiscard: 'Discard changes',
  },
  confirm: {
    title: 'Changes sent to the SaR team',
    text: 'They will appear on the site after the check.',
    steps: [
      'The team reads your changes, usually within a few working days.',
      'You get a notification here when they are approved.',
      'Until then the site shows the previous version of your profile.',
    ],
    close: 'Close',
    toProfile: 'Back to my profile',
  },
  photoDialog: {
    title: 'Change photo',
    drop: 'Drag a photo here',
    or: 'or',
    choose: 'Choose a file on your computer',
    another: 'Choose another file',
    tipsTitle: 'What makes a good photo',
    tips: [
      'Square: the site crops the photo to a centred square.',
      'At least 420×420 px, ideally 840×840 px, so it stays sharp on large screens.',
      'JPEG or PNG, up to 10 MB.',
      'Face in the middle, shoulders visible, looking at the camera.',
      'Plain light background, no collages, logos or filters.',
      'It should be you and recent: every visitor of the site will see it.',
    ],
    save: 'Save photo',
    cancel: 'Cancel',
    errType: 'The file must be a JPEG or PNG.',
    errSize: 'The file is too large: up to 10 MB.',
    errSmall: (min) => `The photo is too small: at least ${min}×${min} px.`,
    errRead: 'Could not read the file. Try another one.',
    preview: 'How it will look on the site',
  },
  approved: {
    title: 'Your changes are approved',
    text: 'The new version of your profile is now on the site.',
    link: 'Open on the site',
    close: 'Dismiss',
  },
  collab: {
    title: 'Find a colleague to collaborate with',
    lede: 'Colleagues who work in the same fields as you. Write first. If the colleague agrees to talk, you will see their email and can continue by email.',
    search: 'Search by name, university or topic',
    find: 'Search',
    shared: 'Fields and topics',
    request: 'Start a conversation',
    requested: 'Message sent',
    retry: 'Try again',
    errorText: 'The message was not sent. Check the connection and try again.',
    emptyTitle: 'No matches yet',
    emptyText:
      'No one shares your tags so far. Add more keywords to your profile, and matches will appear here.',
    emptyAction: 'Edit keywords',
    noResultsTitle: 'Nothing found',
    noResultsText: 'Try a shorter query or clear the search.',
    requestSent: 'The colleague sees it in their cabinet. If they agree, their email opens up here.',
    accepted: 'The colleague agreed to talk',
    acceptedText: 'Write by email:',
    demoAccepted: 'Colleague accepted',
    writeTitle: (name) => `Message to ${name}`,
    writeLabel: 'Your message',
    writeHint: 'Say hi and tell them what you’d like to work on together. If they’re up for it, you’ll get their email.',
    writeEmpty: 'Write a few words to start the conversation.',
    send: 'Send',
    cancel: 'Cancel',
    count: (n) => (n === 1 ? '1 scientist' : `${n} scientists`),
  },
  opp: {
    title: 'Opportunities',
    lede: 'Courses to learn from and grants to apply for, picked just for you.',
    tabs: { courses: 'Educational courses', grants: 'Grants and opportunities' },
    courses: {
      lede: 'For now these are courses on Diia.Osvita.',
      provider: 'Provider',
      open: 'Open the course',
      emptyTitle: 'No courses yet',
      emptyText: 'We will add courses here as soon as they are published.',
    },
    grants: {
      lede: 'Shown only to scientists they fit, and also sent to you by email.',
      open: 'Learn more',
      deadline: 'Deadline',
      field: 'Field',
      soon: (days) => (days <= 0 ? 'Deadline is today' : days === 1 ? '1 day left' : `${days} days left`),
      emptyTitle: 'No grants for you yet',
      emptyText:
        'When a call matches your keywords, it appears here and in your email. Keywords are set in your profile.',
      emptyAction: 'Edit keywords',
    },
  },
  notifications: {
    title: 'My notifications',
    lede: 'Here are requests to talk from colleagues, replies to your messages, copies of letters from visitors to the site and messages from the Science at Risk team. Letters from visitors come to your email, and that is where you answer them.',
    listLabel: 'Notifications',
    unreadMark: 'Unread',
    unreadCount: (n) => `Unread: ${n}`,
    allRead: 'Everything is read',
    markAllRead: 'Read all',
    markedAllRead: 'All notifications are marked as read',
    requestTitle: 'A letter for you',
    requestText: 'Check your mailbox: the letter is already there.',
    teamTitle: 'A message for you',
    teamName: 'Science at Risk team',
    colleagueTitle: 'A request to talk',
    from: 'From',
    colleague: 'Colleague',
    accept: 'Accept',
    decline: 'Decline',
    youAccepted: 'You accepted the request.',
    youDeclined: 'You declined the request.',
    writeTo: 'Email for correspondence:',
    markRead: 'Mark as read',
    declinedNote: 'You declined this request. If you changed your mind, you can still accept it.',
    acceptAgain: 'Accept the request',
    profileOf: (name) => `Profile: ${name}`,
    staleCancelled: 'The sender withdrew this request.',
    staleDeleted: 'This account no longer exists.',
    unreadEmpty: 'No new notifications',
    emptyTab: 'When something new arrives, it will appear here.',
    more: 'Show more',
    moreLoading: 'Loading',
    allShown: 'These are all the notifications',
    deleteAction: 'Delete',
    actions: 'Actions for this notification',
    deletedToast: 'Notification deleted.',
    deletedSaid: 'Notification deleted',
    tabs: { label: 'Show', all: 'All', unread: 'Unread' },
    mutual: (names) => `Mutual contacts: ${names.join(', ')}`,
    declinedToast: 'Request declined.',
    undo: 'Undo',
    closeToast: 'Close',
    undoneSaid: 'Decline undone, the request is back',
    acceptedTitle: 'A colleague accepted your request',
    acceptedSaid: 'You agreed to talk',
    declinedSaid: 'The request is declined',
    subject: 'Subject',
    sender: 'Sender',
    emptyTitle: 'No notifications yet',
    emptyText:
      'When a visitor writes to you through the site, or the team sends a message, a copy appears here. The letter also comes to your email.',
    pager: { label: 'Notification pages', prev: 'Previous', next: 'Next' },
  },
  settings: {
    title: 'Account settings',
    lede: 'Your sign-in details and how we write to you.',
    email: {
      title: 'Sign-in email',
      text: 'This is the address you sign in with and where letters reach you.',
      change: 'Change email',
      newLabel: 'New email',
      send: 'Send confirmation',
      cancel: 'Cancel',
      sent: (e) => `We sent a letter to ${e}. Follow the link in it to confirm the new address; until then the old one stays.`,
      invalid: 'Enter an email like name@example.com',
    },
    password: {
      title: 'Password',
      text: 'Choose a new password. You stay signed in on this device.',
      current: 'Current password',
      next: 'New password',
      repeat: 'Repeat the new password',
      show: 'Show',
      hide: 'Hide',
      rulesTitle: 'The password must have',
      rules: { length: 'at least 10 characters', letter: 'a letter', digit: 'a digit' },
      submit: 'Change password',
      saved: 'Password changed successfully',
      failed: 'Could not change the password. Check your connection and try again.',
      busy: 'Saving',
      close: 'Close',
      errors: {
        current: 'Enter your current password',
        wrong: 'The current password is incorrect',
        same: 'The new password must differ from the current one',
        weak: 'The new password does not meet the requirements yet',
        mismatch: 'The passwords do not match',
      },
    },
    letters: {
      title: 'Letters',
      text: 'What we may write to you about.',
      items: {
        requests: 'A letter when someone asks to contact me',
        team: 'Messages from the Science at Risk team',
        opportunities: 'New courses and grants for my fields',
      },
      saved: 'Saved',
    },
    language: {
      title: 'Language of letters',
      text: 'The language we write to you in.',
      uk: 'Ukrainian',
      en: 'English',
    },
    delete: {
      title: 'Delete account',
      text: 'Your profile will be taken off the site and your data deleted. This cannot be undone.',
      action: 'Delete account',
      askTitle: 'Delete the account?',
      askText: 'The profile, notifications and requests will be deleted for good. You will be signed out.',
      confirm: 'Yes, delete',
      keep: 'Keep the account',
      doneTitle: 'Request received',
      doneText: 'The team will delete the account within a few days and write to you by email.',
    },
  },
  demo: { label: 'Preview controls', status: 'Profile status', section: 'Screen', state: 'State' },
};

const uk: CabinetCopy = {
  nav: {
    label: 'Кабінет',
    items: {
      profile: 'Мій профіль',
      notifications: 'Мої сповіщення',
      collaboration: 'Співпраця',
      opportunities: 'Можливості',
      settings: 'Налаштування',
    },
    new: 'Нове',
    logout: 'Вийти',
  },
  status: {
    draft: {
      label: 'Чернетка',
      text: 'Є зміни, які ще не надіслано. На сайті досі остання схвалена версія.',
    },
    pending: {
      label: 'На затвердженні',
      text: 'Команда перевіряє ваші зміни. Поки їх не схвалено, на сайті попередня версія.',
    },
    approved: {
      label: 'Схвалено',
      text: '',
    },
  },
  profile: {
    title: 'Мій профіль',
    edit: 'Редагувати',
    editLocked: 'Редагування призупинено, поки команда перевіряє ваші зміни.',
    withdraw: 'Відкликати й редагувати далі',
    openOnSite: 'Відкрити на сайті',
    change: 'Редагувати',
    add: 'Додати',
    parts: { photo: 'фото', links: 'посилання', name: 'ім’я та посада' },
    pendingNote: 'Це версія, яку ви надіслали. На сайті її ще немає.',
    sections: { activity: 'Суть основної діяльності:', area: 'Сфера наукових досліджень:', experience: 'Професійний досвід:', expert: 'Досвід експертної діяльності:', publications: 'Основні наукові публікації:', keywords: 'Ключові слова:', projects: 'Наукові проєкти:', otherProjects: 'Інші проєкти:', societies: 'Наукові товариства:' },
    aside: { languages: 'Мови для професійного спілкування:', links: 'Посилання:' },
    empty: 'Ще не заповнено',
    unsent: {
      send: 'Надіслати зміни',
      discard: 'Відкинути зміни',
      bar: 'Є ненадіслані зміни',
      discardTitle: 'Відкинути ненадіслані зміни?',
      discardText: 'Усі зміни, які ви зберегли, але не надіслали, буде втрачено. На сайті залишиться попередня версія.',
      discardKeep: 'Залишити',
      discardConfirm: 'Відкинути',
    },
  },
  edit: {
    title: 'Редагування профілю',
    partTitle: 'Редагування',
    lede: 'Тут усе, що ви заповнили під час реєстрації. Змініть те, що застаріло, і додайте нове. Зберігайте зміни по мірі роботи, а коли все буде готово, надішліть їх разом. Команда перевіряє їх одним пакетом, і на сайті вони з’являться лише після перевірки.',
    required: '* обов’язкове поле',
    groups: { photo: 'Фото', contacts: 'Контактні дані', science: 'Науковий профіль', publications: 'Основні наукові публікації (від 1 до 3)', keywords: 'Ключові слова та діяльність', societies: 'Наукові товариства', links: 'Контакти й посилання' },
    fields: { photoChange: 'Змінити фото', nameUk: 'Прізвище, ім’я, по батькові', nameEn: 'Прізвище та ім’я англійською', email: 'Адреса електронної пошти', phone: 'Номер мобільного телефону', orcid: 'Посилання на ORCID', facebook: 'Посилання на Facebook', linkedin: 'Посилання на LinkedIn', degree: 'Науковий ступінь', degreeOther: 'Вкажіть, який саме ступінь', activityOther: 'Вкажіть, яка саме діяльність', rank: 'Вчене звання', institution: 'Офіційна повна назва установи', languages: 'Іноземні мови', activity: 'Суть основної діяльності', area: 'Сфера наукових досліджень', experience: 'Професійний досвід', expert: 'Досвід експертної діяльності', field: 'Галузь знань і спеціальність', extraFields: 'Запропонувати іншу галузь або спеціальність', act1: 'Додаткова діяльність 1', act2: 'Додаткова діяльність 2', act3: 'Додаткова діяльність 3', extraActivities: 'Інша додаткова діяльність', scienceProjects: 'Участь у наукових проєктах', otherProjects: 'Участь в інших проєктах', societies: 'Наукові товариства' },
    societies: { hint: 'Позначте товариства, до яких ви належите; профіль матиме посилання на їхні сторінки на сайті.', search: 'Пошук серед товариств', none: 'Нічого не знайдено.', selected: (n) => `Обрано: ${n}` },
    picker: { otherOption: 'Немає у переліку', otherLabel: 'Ваша галузь або спеціальність', otherHint: 'Редактори розглянуть її перед додаванням.', field: 'Галузь знань', select: 'Оберіть', specialties: 'Спеціальності', specialtiesHint: 'Позначте одну або кілька.', firstField: 'Спочатку оберіть галузь знань.', addField: 'Додати галузь', moreTitle: (n) => `Ще одна галузь ${n}`, removeField: 'Прибрати цю галузь', extraHint: 'Немає у переліку? Напишіть свою галузь тут, редактори розглянуть її перед додаванням.', errField: 'Оберіть галузь знань зі списку.', errSpecialty: 'Оберіть хоча б одну спеціальність.' },
    linkRemove: { aria: 'Видалити посилання', title: 'Видалити це посилання?', text: (l) => `${l} зникне з вашого профілю після надсилання.`, confirm: 'Видалити' },
    photoRemove: 'Прибрати фото',
    hints: { photo: 'Квадратне фото, JPEG або PNG, до 10 MB. Бажано 420×420 px, однотонний фон.', phone: 'На сайті не публікується.', email: 'Береться з вашого акаунта. Щоб поредагувати, напишіть нам на email.', nameUk: 'Береться з вашого акаунта. Щоб поредагувати, напишіть нам на email.', activity: 'Кілька речень від першої особи; редактори складуть з них текст для вашої сторінки. Наприклад: «Я аспірантка у галузі дослідницької політики в Лундському університеті (Швеція). Мене цікавить тема керування сучасними дослідницькими інфраструктурами.»', area: 'Список через крапку з комою; подвійний пробіл поставить її за вас. З нього редактори складуть текст для вашої сторінки. Наприклад: гемологічне вивчення самоцвітів України; особливості ціноутворення і визначення вартості коштовного каміння; експертиза і діагностика дорогоцінного каміння.', experience: 'Один рядок на посаду: «рік – посада, місце роботи».', expert: 'У тому самому форматі.', field: 'За переліком галузей і спеціальностей.' },
    options: { degree: ['Кандидат наук / Доктор філософії', 'Доктор наук', 'Інше'], rank: ['Немає', 'Доцент', 'Старший дослідник', 'Професор'], activity: ['Популяризація науки / наукові комунікації', 'Політики в галузі науки', 'Програмування', 'Публічні виступи', 'Написання книжок', 'Нетворкінг', 'Менеджмент проєктів', 'Підприємництво', 'Написання грантових заявок / фандрейзинг', 'Патентування', 'Комерціалізація наукових винаходів', 'Наукова етика', 'Академічна доброчесність', 'Робота з базами даних', 'Викладання', 'Інше'] },
    select: 'Оберіть',
    addPublication: 'Додати публікацію',
    addActivity: 'Додати діяльність',
    fromAccount: 'З вашого акаунта',
    errors: {
      required: 'Заповніть це поле.',
      nameEn: 'Лише латиницею, прізвище та ім’я: Volodymyr Shevchenko.',
      orcid: 'Це має бути посилання на вашу сторінку в orcid.org, наприклад https://orcid.org/0000-0000-0000-0000.',
      linkedin: 'Це має бути посилання на сторінку в linkedin.com.',
      facebook: 'Це має бути посилання на сторінку у facebook.com.',
      url: 'Посилання починається з https://',
      year: 'Рік складається з чотирьох цифр, наприклад 2022.',
    },
    experience: { year: 'Рік', position: 'Посада', place: 'Місце роботи', yearHint: '2021 або 2018–2021', positionHint: 'Завідувач кафедри', placeHint: 'ХНУ імені В. Н. Каразіна', addJob: 'Додати місце роботи', addExpert: 'Додати діяльність' },
    publication: {
      titles: ['Найважливіша публікація', 'Друга важлива публікація', 'Третя важлива публікація'],
      fields: { title: 'Назва публікації', authors: 'Автори', journal: 'Журнал або видавництво', year: 'Рік', pages: 'Сторінки', role: 'Ваша роль', url: 'Посилання на публікацію' },
      hints: { authors: 'Pavlyuk N., Dmytriv G.', pages: 'Наприклад: 1–13', url: 'Де її можна прочитати чи знайти. Підійде посилання на DOI.' },
      roles: { author: 'Автор', lead: 'Провідний автор', coauthor: 'Співавтор' },
      remove: 'Прибрати',
      preview: 'Так це побачать на сайті:',
      roleIs: 'Роль',
      open: 'Читати публікацію',
    },
    project: {
      fields: { title: 'Назва проєкту', description: 'Короткий опис', role: 'Ваша роль', url: 'Посилання на проєкт' },
      hints: { title: 'ERASMUS+ SUNRISE', description: 'Про що цей проєкт', role: 'Координатор від університету' },
      addScience: 'Додати проєкт',
      addOther: 'Додати проєкт',
      open: 'Відкрити проєкт',
    },
    bar: { save: 'Зберегти зміни', cancel: 'Скасувати', unsaved: 'Є незбережені зміни', saved: 'Змін поки немає', sending: 'Надсилаємо' },
    cancelTitle: 'Вийти без збереження?',
    cancelText: 'Незбережені правки буде втрачено. Вже збережені зміни залишаться в профілі, доки ви їх не надішлете.',
    cancelKeep: 'Продовжити редагування',
    cancelDiscard: 'Відкинути зміни',
  },
  confirm: {
    title: 'Зміни надіслано команді SaR',
    text: 'На сайті вони з’являться після перевірки.',
    steps: [
      'Команда прочитає зміни, зазвичай протягом кількох робочих днів.',
      'Коли їх схвалять, тут з’явиться сповіщення.',
      'До того на сайті показується попередня версія вашого профілю.',
    ],
    close: 'Закрити',
    toProfile: 'Назад до профілю',
  },
  photoDialog: {
    title: 'Змінити фото',
    drop: 'Перетягніть фото сюди',
    or: 'або',
    choose: 'Обрати файл на комп’ютері',
    another: 'Обрати інший файл',
    tipsTitle: 'Яке фото підійде',
    tips: [
      'Квадрат: сайт обрізає фото до квадрата по центру.',
      'Від 420×420 px, краще 840×840 px, щоб фото було чітким на великих екранах.',
      'JPEG або PNG, не більше 10 MB.',
      'Обличчя посередині, плечі видно, погляд у камеру.',
      'Однотонний світлий фон, без колажів, логотипів і фільтрів.',
      'Фото має бути ваше й свіже: його побачать усі відвідувачі сайту.',
    ],
    save: 'Зберегти фото',
    cancel: 'Скасувати',
    errType: 'Потрібен файл JPEG або PNG.',
    errSize: 'Файл завеликий: до 10 MB.',
    errSmall: (min) => `Фото замале: щонайменше ${min}×${min} px.`,
    errRead: 'Не вдалося прочитати файл. Спробуйте інший.',
    preview: 'Так фото побачать на сайті',
  },
  approved: {
    title: 'Зміни схвалено',
    text: 'Нова версія вашого профілю вже на сайті.',
    link: 'Відкрити на сайті',
    close: 'Закрити',
  },
  collab: {
    title: 'Знайдіть колегу для співпраці',
    lede: 'Колеги, які працюють у тих самих галузях, що й ви. Напишіть першими. Якщо колега погодиться поспілкуватися, ви побачите пошту колеги й продовжите розмову листами.',
    search: 'Пошук за іменем, університетом або темою',
    find: 'Знайти',
    shared: 'Галузі та теми',
    request: 'Почати спілкування',
    requested: 'Повідомлення надіслано',
    retry: 'Спробувати ще раз',
    errorText: 'Повідомлення не надіслано. Перевірте з’єднання й спробуйте ще раз.',
    emptyTitle: 'Збігів поки немає',
    emptyText:
      'Поки ніхто не має спільних із вами тегів. Додайте більше ключових слів у профіль, і збіги з’являться тут.',
    emptyAction: 'Редагувати ключові слова',
    noResultsTitle: 'Нічого не знайдено',
    noResultsText: 'Спробуйте коротший запит або очистьте пошук.',
    requestSent: 'Колега побачить його у своєму кабінеті. Якщо погодиться, тут відкриється пошта колеги.',
    accepted: 'Колега погодився поспілкуватися',
    acceptedText: 'Написати на пошту:',
    demoAccepted: 'Колега прийняв запит',
    writeTitle: (name) => `Повідомлення для ${name}`,
    writeLabel: 'Ваше повідомлення',
    writeHint: 'Привітайтеся й напишіть, над чим хотіли б попрацювати разом. Якщо колега відгукнеться, ви побачите його пошту.',
    writeEmpty: 'Напишіть кілька слів, щоб почати розмову.',
    send: 'Надіслати',
    cancel: 'Скасувати',
    count: (n) => {
      const last = n % 10;
      const tens = n % 100;
      const word =
        last === 1 && tens !== 11
          ? 'науковець'
          : last >= 2 && last <= 4 && (tens < 10 || tens >= 20)
            ? 'науковці'
            : 'науковців';
      return `${n} ${word}`;
    },
  },
  opp: {
    title: 'Можливості',
    lede: 'Курси, на яких можна повчитися, і гранти, на які можна податися, підібрані саме для вас.',
    tabs: { courses: 'Освітні курси', grants: 'Гранти та можливості' },
    courses: {
      lede: 'Поки це курси на Дія.Освіта.',
      provider: 'Провайдер',
      open: 'Перейти до курсу',
      emptyTitle: 'Курсів поки немає',
      emptyText: 'Ми додамо курси сюди, щойно їх опублікують.',
    },
    grants: {
      lede: 'Показуються лише тим науковцям, кому вони підходять, і дублюються розсилкою.',
      open: 'Дізнатись більше',
      deadline: 'Дедлайн',
      field: 'Галузь',
      soon: (days) => {
        if (days <= 0) return 'Дедлайн сьогодні';
        const last = days % 10;
        const tens = days % 100;
        const word = last === 1 && tens !== 11 ? 'день' : last >= 2 && last <= 4 && (tens < 10 || tens >= 20) ? 'дні' : 'днів';
        return `Залишилось ${days} ${word}`;
      },
      emptyTitle: 'Грантів для вас поки немає',
      emptyText:
        'Коли конкурс збігатиметься з вашими ключовими словами, він з’явиться тут і в розсилці. Ключові слова задаються в профілі.',
      emptyAction: 'Редагувати ключові слова',
    },
  },
  notifications: {
    title: 'Мої сповіщення',
    lede: 'Тут запити на спілкування від колег, відповіді на ваші повідомлення, копії листів від відвідувачів сайту й повідомлення від команди Science at Risk. Листи від відвідувачів приходять на вашу пошту, і відповідати на них потрібно там.',
    listLabel: 'Сповіщення',
    unreadMark: 'Непрочитане',
    unreadCount: (n) => `Непрочитаних: ${n}`,
    allRead: 'Усе прочитано',
    markAllRead: 'Прочитати всі',
    markedAllRead: 'Усі сповіщення позначено прочитаними',
    requestTitle: 'Вам лист',
    requestText: 'Перевірте свою пошту: лист уже там.',
    teamTitle: 'Вам повідомлення',
    teamName: 'Команда Science at Risk',
    colleagueTitle: 'Запит на спілкування',
    from: 'Від',
    colleague: 'Колега',
    accept: 'Прийняти',
    decline: 'Відхилити',
    youAccepted: 'Ви прийняли запит.',
    youDeclined: 'Ви відхилили запит.',
    writeTo: 'Пошта для листування:',
    markRead: 'Позначити прочитаним',
    declinedNote: 'Ви відхилили запит. Якщо передумали, можете його прийняти.',
    acceptAgain: 'Прийняти запит',
    profileOf: (name) => `Профіль: ${name}`,
    staleCancelled: 'Відправник скасував цей запит.',
    staleDeleted: 'Цього акаунта більше немає.',
    unreadEmpty: 'Нових сповіщень немає',
    emptyTab: 'Коли надійде щось нове, воно з’явиться тут.',
    more: 'Показати ще',
    moreLoading: 'Завантажуємо',
    allShown: 'Це всі сповіщення',
    deleteAction: 'Видалити',
    actions: 'Дії зі сповіщенням',
    deletedToast: 'Сповіщення видалено.',
    deletedSaid: 'Сповіщення видалено',
    tabs: { label: 'Показати', all: 'Усі', unread: 'Непрочитані' },
    mutual: (names) => `Спільні контакти: ${names.join(', ')}`,
    declinedToast: 'Запит відхилено.',
    undo: 'Скасувати',
    closeToast: 'Закрити',
    undoneSaid: 'Відхилення скасовано, запит повернувся',
    acceptedTitle: 'Колега прийняв ваш запит',
    acceptedSaid: 'Ви погодилися поспілкуватися',
    declinedSaid: 'Запит відхилено',
    subject: 'Тема листа',
    sender: 'Відправник',
    emptyTitle: 'Сповіщень поки немає',
    emptyText:
      'Коли вам напише відвідувач сайту або команда, тут з’явиться копія повідомлення. Сам лист також прийде на вашу пошту.',
    pager: { label: 'Сторінки сповіщень', prev: 'Попередня', next: 'Наступна' },
  },
  settings: {
    title: 'Налаштування акаунта',
    lede: 'Дані для входу та те, як ми вам пишемо.',
    email: {
      title: 'Електронна пошта для входу',
      text: 'З цією адресою ви входите в кабінет, і на неї приходять листи.',
      change: 'Змінити пошту',
      newLabel: 'Нова електронна пошта',
      send: 'Надіслати підтвердження',
      cancel: 'Скасувати',
      sent: (e) => `Ми надіслали лист на ${e}. Перейдіть за посиланням у ньому, щоб підтвердити нову адресу; до того часу діє стара.`,
      invalid: 'Введіть пошту у форматі name@example.com',
    },
    password: {
      title: 'Пароль',
      text: 'Придумайте новий пароль. На цьому пристрої ви залишитесь у кабінеті.',
      current: 'Поточний пароль',
      next: 'Новий пароль',
      repeat: 'Повторіть новий пароль',
      show: 'Показати',
      hide: 'Сховати',
      rulesTitle: 'У паролі має бути',
      rules: { length: 'щонайменше 10 символів', letter: 'літера', digit: 'цифра' },
      submit: 'Змінити пароль',
      saved: 'Пароль успішно змінено',
      failed: 'Не вдалося змінити пароль. Перевірте з’єднання й спробуйте ще раз.',
      busy: 'Зберігаємо',
      close: 'Закрити',
      errors: {
        current: 'Введіть поточний пароль',
        wrong: 'Поточний пароль неправильний',
        same: 'Новий пароль має відрізнятися від поточного',
        weak: 'Новий пароль ще не відповідає вимогам',
        mismatch: 'Паролі не збігаються',
      },
    },
    letters: {
      title: 'Листи',
      text: 'Про що ми можемо вам писати.',
      items: {
        requests: 'Лист, коли хтось просить зв’язатися зі мною',
        team: 'Повідомлення від команди Science at Risk',
        opportunities: 'Нові курси та гранти за моїми галузями',
      },
      saved: 'Збережено',
    },
    language: {
      title: 'Мова листів',
      text: 'Якою мовою ми вам пишемо.',
      uk: 'Українська',
      en: 'English',
    },
    delete: {
      title: 'Видалити акаунт',
      text: 'Ваш профіль знімуть із сайту, а дані видалять. Цю дію не можна скасувати.',
      action: 'Видалити акаунт',
      askTitle: 'Видалити акаунт?',
      askText: 'Профіль, сповіщення та запити буде видалено назавжди. Ви вийдете з кабінету.',
      confirm: 'Так, видалити',
      keep: 'Залишити акаунт',
      doneTitle: 'Запит прийнято',
      doneText: 'Команда видалить акаунт протягом кількох днів і напише вам на пошту.',
    },
  },
  demo: { label: 'Керування переглядом', status: 'Статус профілю', section: 'Екран', state: 'Стан' },
};

export const cabinetCopy: Record<CabinetLocale, CabinetCopy> = { en, uk };
