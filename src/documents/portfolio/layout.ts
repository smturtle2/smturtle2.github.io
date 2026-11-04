import type { SectionLayout } from '../core/model';
import type { StepId, TopicId } from './structure';
import { assets } from './assets';

export const topicLayouts = {
  restoration: { kind: 'linear', allowBreakAfter: ['problem', 'approach', 'execution'] },
  attention: { kind: 'columns', asideSection: 'outcome' },
  streaming: { kind: 'linear', allowBreakAfter: [] },
  collaboration: { kind: 'linear', allowBreakAfter: [] },
  'sentence-selection': { kind: 'linear', allowBreakAfter: [] },
  'jamo-embedding': { kind: 'linear', allowBreakAfter: [] },
  serving: { kind: 'linear', allowBreakAfter: ['approach'] },
} as const satisfies Record<TopicId, SectionLayout<StepId>>;

export const stepLayouts: Partial<Record<TopicId, Partial<Record<StepId, SectionLayout>>>> = {
  serving: { outcome: { kind: 'image-aside', asset: assets.hover.id } },
};
