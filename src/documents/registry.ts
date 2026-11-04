import type { Locale } from '../i18n';

interface DocumentLabels {
  display: string;
  filename: string;
}

// Browser-safe metadata only. Document factories and content belong in the build-only map.
export const documentRegistry = {
  resume: {
    ko: { display: '이력서', filename: '이력서' },
    en: { display: 'Résumé', filename: 'Resume' },
  },
  portfolio: {
    ko: { display: '포트폴리오', filename: '포트폴리오' },
    en: { display: 'Portfolio', filename: 'Portfolio' },
  },
} as const satisfies Record<string, Record<Locale, DocumentLabels>>;

export type DocumentId = keyof typeof documentRegistry;
export const documentIds: readonly DocumentId[] = Object.keys(documentRegistry) as DocumentId[];

export function isDocumentId(value: unknown): value is DocumentId {
  return typeof value === 'string' && Object.hasOwn(documentRegistry, value);
}
