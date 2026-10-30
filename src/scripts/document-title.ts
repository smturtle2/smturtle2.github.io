import { profile } from '../data/profile';
import type { Locale, PageKey } from '../i18n';

export type DocumentPage = Exclude<PageKey, 'home'>;

const documentNames = {
  ko: { resume: '이력서', portfolio: '포트폴리오' },
  en: { resume: 'Resume', portfolio: 'Portfolio' },
} as const satisfies Record<Locale, Record<DocumentPage, string>>;

function filenamePart(value: string): string {
  return value
    .normalize('NFC')
    .trim()
    .replace(/[<>:"/\\|?*\u0000-\u001f\u007f-\u009f\s]+/gu, '_')
    .replace(/_+/g, '_')
    .replace(/^[._]+|[._]+$/g, '');
}

export function buildDocumentTitle(locale: Locale, page: DocumentPage, role: string): string {
  const rolePart = filenamePart(role) || filenamePart(profile.role);

  return [filenamePart(profile.names[locale]), rolePart, documentNames[locale][page]].join('_');
}
