import { profile } from '../data/profile';
import { isLocale, messages } from '../i18n';
import { buildDocumentTitle } from './document-title';

export function initRoleEditor(): void {
  const root = document.querySelector<HTMLElement>('[data-document-page]');
  const locale = root?.dataset.documentLocale;
  const page = root?.dataset.documentPage;

  if (!root || !isLocale(locale) || (page !== 'resume' && page !== 'portfolio')) return;

  const roleElements = root.querySelectorAll<HTMLElement>('[data-profile-role]');
  if (roleElements.length === 0) return;

  const updateRole = (role: string): void => {
    for (const element of roleElements) element.textContent = role;
    document.title = buildDocumentTitle(locale, page, role);
  };

  updateRole(profile.role);
  let promptOpen = false;

  document.addEventListener('keydown', (event: KeyboardEvent) => {
    if (
      event.defaultPrevented ||
      event.repeat ||
      event.isComposing ||
      promptOpen ||
      !event.altKey ||
      event.ctrlKey ||
      event.metaKey ||
      event.shiftKey ||
      event.getModifierState('AltGraph') ||
      event.code !== 'KeyN'
    ) return;

    const target = event.target;
    if (
      target instanceof HTMLElement &&
      (target.isContentEditable || target.closest('input, textarea, select'))
    ) return;

    event.preventDefault();
    promptOpen = true;

    try {
      const currentRole = roleElements[0].textContent?.trim() || profile.role;
      const input = window.prompt(messages[locale].rolePrompt(profile.role), currentRole);

      if (input !== null) updateRole(input.trim() || profile.role);
    } finally {
      promptOpen = false;
    }
  });
}
