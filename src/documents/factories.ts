import { locales, type Locale } from '../i18n';
import { documentIds, type DocumentId } from './registry';
import type { DocumentModel } from './core/model';
import { validateTranslations } from './core/validate';
import { createPortfolio } from './portfolio/document';
import { createResume } from './resume/document';

/** Build-only: never import this map from browser scripts or the document list. */
const factories = {
  resume: createResume,
  portfolio: createPortfolio,
} satisfies Record<DocumentId, (locale: Locale) => DocumentModel>;

export function buildDocuments() {
  return documentIds.flatMap((id) => {
    const translations = locales.map((locale) => factories[id](locale));
    for (const model of translations) {
      if (model.id !== id) throw new Error(`Document factory ${id} returned ${model.id}`);
    }
    validateTranslations(translations);
    return translations.map((model) => ({ id, locale: model.locale, model }));
  });
}
