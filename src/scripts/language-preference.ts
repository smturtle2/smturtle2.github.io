import { isLocale, type Locale } from '../i18n';

const preferenceKey = 'site-language';

export function readLanguagePreference(): Locale | undefined {
  try {
    const saved = localStorage.getItem(preferenceKey);
    return isLocale(saved) ? saved : undefined;
  } catch {
    return undefined;
  }
}

function rememberLanguage(locale: Locale): void {
  try {
    localStorage.setItem(preferenceKey, locale);
  } catch {
    // The localized URL still works when browser storage is unavailable.
  }
}

export function initLanguageLinks(): void {
  const links = document.querySelectorAll<HTMLAnchorElement>('a[data-language]');

  const updateAnchors = (): void => {
    for (const link of links) link.hash = window.location.hash;
  };

  updateAnchors();
  window.addEventListener('hashchange', updateAnchors);

  for (const link of links) {
    const locale = link.dataset.language;
    if (isLocale(locale)) {
      link.addEventListener('click', () => rememberLanguage(locale));
    }
  }
}
