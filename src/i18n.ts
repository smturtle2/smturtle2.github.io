export const locales = ['ko', 'en'] as const;
export type Locale = (typeof locales)[number];
export type PageKey = 'home' | 'resume' | 'portfolio';

interface Messages {
  documents: string;
  email: string;
  resumeTitle: string;
  resumeDescription: string;
  portfolioTitle: string;
  portfolioDescription: string;
  languageLabel: string;
  description: (name: string) => string;
}

export const messages = {
  ko: {
    documents: '문서',
    email: '이메일',
    resumeTitle: '이력서',
    resumeDescription: '학력, 프로젝트 경험, 기술',
    portfolioTitle: '포트폴리오',
    portfolioDescription: '설계 과정과 구현 결과',
    languageLabel: '언어 선택',
    description: (name: string) => `${name}의 이력서와 포트폴리오.`,
  },
  en: {
    documents: 'Documents',
    email: 'Email',
    resumeTitle: 'Resume',
    resumeDescription: 'Education, projects, and skills',
    portfolioTitle: 'Portfolio',
    portfolioDescription: 'Design process and implementation results',
    languageLabel: 'Language selection',
    description: (name: string) => `Resume and portfolio of ${name}.`,
  },
} satisfies Record<Locale, Messages>;

export function isLocale(value: unknown): value is Locale {
  return value === 'ko' || value === 'en';
}

export function localeFromBrowser(language: string): Locale {
  return language.split('-')[0].toLowerCase() === 'ko' ? 'ko' : 'en';
}

export function localePath(locale: Locale, page: PageKey = 'home'): string {
  return page === 'home' ? `/${locale}/` : `/${locale}/${page}/`;
}
