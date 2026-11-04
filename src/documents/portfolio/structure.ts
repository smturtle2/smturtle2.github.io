import type { Block } from '../core/model';
import type { ProjectLinkId } from '../../data/projects';

export const FLOW = ['problem', 'approach', 'execution', 'outcome'] as const;
export type StepId = (typeof FLOW)[number];

export const topicOrder = {
  'clear-net': ['restoration', 'attention', 'streaming', 'collaboration'],
  clickbait: ['sentence-selection', 'jamo-embedding', 'serving'],
} as const;
export const projectOrder = ['clear-net', 'clickbait'] as const;
export type PortfolioProjectId = (typeof projectOrder)[number];
export type TopicId<P extends PortfolioProjectId = PortfolioProjectId> = (typeof topicOrder)[P][number];

export interface StepContent {
  title: string;
  blocks: readonly Block[];
}
export interface TopicContent {
  title: string;
  steps: Record<StepId, StepContent>;
}
export type ProjectContent<P extends PortfolioProjectId> = {
  title: string;
  subtitle: string;
  linkLabels: Record<ProjectLinkId<P>, string>;
  intro: readonly Block[];
  topics: Record<TopicId<P>, TopicContent>;
};
export interface PortfolioContent {
  title: string;
  description: string;
  projects: { [P in PortfolioProjectId]: ProjectContent<P> };
}
