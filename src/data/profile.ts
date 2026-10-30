import type { Locale } from '../i18n';

interface Profile {
  names: Record<Locale, string>;
  role: string;
  email: string;
  github: `https://${string}`;
  huggingface: `https://${string}`;
}

export const profile = {
  names: {
    ko: '신동주',
    en: 'SHIN DONGJU',
  },
  role: 'AI/ML Engineer',
  email: 'smturtle2@kakao.com',
  github: 'https://github.com/smturtle2',
  huggingface: 'https://huggingface.co/Hermanni',
} as const satisfies Profile;
