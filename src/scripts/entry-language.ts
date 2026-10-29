import { localeFromBrowser, localePath } from '../i18n';
import { readLanguagePreference } from './language-preference';

const locale = readLanguagePreference() ?? localeFromBrowser(navigator.language);
window.location.replace(localePath(locale) + window.location.hash);
