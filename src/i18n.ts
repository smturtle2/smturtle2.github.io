export const locales = ['ko', 'en'] as const;
export type Locale = (typeof locales)[number];
export type PageKey = 'home' | 'resume' | 'portfolio';

interface Messages {
  documents: string;
  email: string;
  resumeTitle: string;
  portfolioTitle: string;
  languageLabel: string;
  rolePrompt: (defaultRole: string) => string;
  description: (name: string) => string;
}

export const messages = {
  ko: {
    documents: '문서',
    email: '이메일',
    resumeTitle: '이력서',
    portfolioTitle: '포트폴리오',
    languageLabel: '언어 선택',
    rolePrompt: (defaultRole: string) => `직무명 (비우면 ${defaultRole})`,
    description: (name: string) => `${name}의 이력서와 포트폴리오.`,
  },
  en: {
    documents: 'Documents',
    email: 'Email',
    resumeTitle: 'Résumé',
    portfolioTitle: 'Portfolio',
    languageLabel: 'Language selection',
    rolePrompt: (defaultRole: string) => `Job title (leave blank for ${defaultRole})`,
    description: (name: string) => `Résumé and portfolio of ${name}.`,
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
