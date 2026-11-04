import type { Locale } from '../../i18n';
import { profileHeader, projectHeader } from '../shared/headers';
import type { DocumentModel, ParagraphBlock, Section } from '../core/model';
import { categoryOrder, projectOrder } from './structure';
import type { ResumeContent } from './content/model';
import { ko } from './content/ko';
import { en } from './content/en';

const content = { ko, en } satisfies Record<Locale, ResumeContent>;

export function createResume(locale: Locale): DocumentModel {
  const text = content[locale];
  const categories: Record<(typeof categoryOrder)[number], Section> = {
    education: {
      kind: 'section',
      id: 'education',
      role: 'category',
      header: { title: text.categories.education },
      children: [{ kind: 'section', id: 'dongguk', role: 'entry', header: text.education, children: [] }],
    },
    projects: {
      kind: 'section',
      id: 'projects',
      role: 'category',
      header: { title: text.categories.projects },
      children: projectOrder.map((id): Section => {
        const project = text.projects[id];
        return {
          kind: 'section',
          id,
          role: 'entry',
          header: projectHeader(id, locale, project),
          children: [{ kind: 'list', items: project.items }],
        };
      }),
    },
    skills: {
      kind: 'section',
      id: 'skills',
      role: 'category',
      header: { title: text.categories.skills },
      children: text.skills.map((item): ParagraphBlock => ({ kind: 'paragraph', content: item })),
    },
  };

  return {
    id: 'resume',
    locale,
    title: text.title,
    description: text.description,
    header: profileHeader(locale),
    children: categoryOrder.map((id) => categories[id]),
  };
}
