export const languages = {
  en: 'English',
  vi: 'Tiếng Việt',
} as const;

export const defaultLang = 'en' as const;
export const showDefaultLang = false;

export const ui = {
  en: {
    'nav.home': 'Home',
    'nav.about': 'About',
    'nav.projects': 'Projects',
    'nav.contact': 'Contact',
    'hero.greeting': "Hi, I'm a Developer 👋",
    'hero.title': 'Building modern web experiences',
    'hero.subtitle': 'Welcome to my portfolio! Explore my latest projects, technical stack, and articles.',
    'hero.viewProjects': 'View Projects',
    'hero.contactMe': 'Contact Me',
    'footer.rights': 'All rights reserved.',
  },
  vi: {
    'nav.home': 'Trang chủ',
    'nav.about': 'Giới thiệu',
    'nav.projects': 'Dự án',
    'nav.contact': 'Liên hệ',
    'hero.greeting': 'Xin chào, tôi là Developer 👋',
    'hero.title': 'Xây dựng trải nghiệm web hiện đại',
    'hero.subtitle': 'Chào mừng đến với portfolio của tôi! Khám phá các dự án mới nhất, công nghệ và bài viết.',
    'hero.viewProjects': 'Xem dự án',
    'hero.contactMe': 'Liên hệ với tôi',
    'footer.rights': 'Bảo lưu mọi quyền.',
  },
} as const;
