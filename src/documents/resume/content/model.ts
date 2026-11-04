import type { ProjectId, ProjectLinkId } from '../../../data/projects';
import type { Header, RichText } from '../../core/model';
import type { CategoryId } from '../structure';

export interface ResumeProjectContent<P extends ProjectId> {
  title: string;
  subtitle: string;
  linksLabel: string;
  linkLabels: Record<ProjectLinkId<P>, string>;
  items: readonly { lines: readonly RichText[] }[];
}

export interface ResumeContent {
  title: string;
  description: string;
  categories: Record<CategoryId, string>;
  education: Header;
  projects: { [P in ProjectId]: ResumeProjectContent<P> };
  skills: readonly RichText[];
}
