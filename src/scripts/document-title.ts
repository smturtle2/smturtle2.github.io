import { profile } from '../data/profile';
import type { Locale } from '../i18n';
import { documentRegistry, type DocumentId } from '../documents/registry';

function filenamePart(value: string): string {
  return value
    .normalize('NFC')
    .trim()
    .replace(/[<>:"/\\|?*\u0000-\u001f\u007f-\u009f\s]+/gu, '_')
    .replace(/_+/g, '_')
    .replace(/^[._]+|[._]+$/g, '');
}

export function buildDocumentTitle(locale: Locale, page: DocumentId, role: string): string {
  const rolePart = filenamePart(role) || filenamePart(profile.role);

  return [filenamePart(profile.names[locale]), rolePart, filenamePart(documentRegistry[page][locale].filename)].join('_');
}
