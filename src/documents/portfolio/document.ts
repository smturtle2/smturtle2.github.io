import type { Locale } from '../../i18n';
import type { DocumentModel, Section } from '../core/model';
import { profileHeader, projectHeader } from '../shared/headers';
import { en } from './content/en';
import { ko } from './content/ko';
import { topicLayouts, stepLayouts } from './layout';
import { FLOW, projectOrder, topicOrder, type PortfolioContent, type PortfolioProjectId, type TopicContent, type TopicId } from './structure';

const content = { ko, en } satisfies Record<Locale, PortfolioContent>;

function topic(id: TopicId, source: TopicContent): Section {
  return {
    kind: 'section',
    id,
    role: 'topic',
    header: { title: source.title },
    numberSections: true,
    layout: topicLayouts[id],
    children: FLOW.map((step): Section => ({
      kind: 'section',
      id: step,
      role: 'step',
      header: { title: source.steps[step].title },
      children: source.steps[step].blocks,
      layout: stepLayouts[id]?.[step],
    })),
  };
}

function project<P extends PortfolioProjectId>(id: P, source: PortfolioContent['projects'][P], locale: Locale): Section {
  // Both lookups use the same project key; retain that association across Array.map.
  const orderedTopicIds = topicOrder[id] as readonly TopicId<P>[];
  const topics = source.topics as Record<TopicId<P>, TopicContent>;

  return {
    kind: 'section',
    id,
    role: 'project',
    header: projectHeader(id, locale, source),
    children: [
      ...source.intro,
      ...orderedTopicIds.map((topicId) => topic(topicId, topics[topicId])),
    ],
  };
}

export function createPortfolio(locale: Locale): DocumentModel {
  const source: PortfolioContent = content[locale];
  return {
    id: 'portfolio',
    locale,
    title: source.title,
    description: source.description,
    header: profileHeader(locale),
    children: projectOrder.map((id) => project(id, source.projects[id], locale)),
  };
}
