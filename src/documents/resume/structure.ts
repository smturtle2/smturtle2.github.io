import type { ProjectId } from '../../data/projects';

export const categoryOrder = ['education', 'projects', 'skills'] as const;
export type CategoryId = (typeof categoryOrder)[number];
export const projectOrder = ['clear-net', 'clickbait'] as const satisfies readonly ProjectId[];
