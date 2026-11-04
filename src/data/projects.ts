import type { Locale } from '../i18n';

interface ProjectFacts {
  period: Record<Locale, string>;
  context: Record<Locale, string>;
  links: Record<string, string>;
}

export const projects = {
  'clear-net': {
    period: { ko: '2026.03 ~ 2026.06', en: 'Mar 2026 – Jun 2026' },
    context: {
      ko: '동국대학교 종합설계1 · 4인 팀 · 최우수상',
      en: 'Dongguk University Capstone Design 1 · Team of 4 · Award of Excellence',
    },
    links: {
      model: 'https://github.com/smturtle2/cr-project',
      weights: 'https://huggingface.co/Hermanni/clear-net-sen12mscr',
      training: 'https://github.com/smturtle2/cr-train',
      dataset: 'https://huggingface.co/datasets/Hermanni/sen12mscr-v2',
    },
  },
  clickbait: {
    period: { ko: '2024.09 ~ 2024.12', en: 'Sep 2024 – Dec 2024' },
    context: {
      ko: '동국대학교 공개SW프로젝트 · 4인 팀',
      en: 'Dongguk University Open Source Software Project · Team of 4',
    },
    links: {
      code: 'https://github.com/CSID-DGU/2024-02-CSC4004-2-2-NewEngineeringCenterGhost',
      store: 'https://chromewebstore.google.com/detail/blcclfjholbpgmmbnghodhlkagepjbbh',
    },
  },
} as const satisfies Record<string, ProjectFacts>;

export type ProjectId = keyof typeof projects;
export type ProjectLinkId<P extends ProjectId> = keyof (typeof projects)[P]['links'];
