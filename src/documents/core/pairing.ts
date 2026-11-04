import { locales as localeOrder, type Locale } from '../../i18n';
import { partitionChildren } from './anchors';
import type { Block, DocumentChild, DocumentHeader, DocumentModel, Header, Section, SectionLayout } from './model';
import { validateTranslations } from './validate';

export interface LocaleVariant<T> { locale: Locale; value: T; }

export interface PairedContent {
  kind: 'content';
  id: string;
  variants: readonly LocaleVariant<readonly Block[]>[];
  /** Absent only for free prose between two shared anchors. */
  anchor?: string;
}

export interface PairedSection {
  kind: 'section';
  id: string;
  role: string;
  headers?: readonly LocaleVariant<Header>[];
  children: readonly PairedChild[];
  numberSections?: boolean;
  layout?: SectionLayout;
}

export type PairedChild = PairedSection | PairedContent;

export interface PairedDocument {
  id: string;
  locales: readonly Locale[];
  headers: readonly LocaleVariant<DocumentHeader>[];
  children: readonly PairedChild[];
}

function pairChildren(variants: readonly LocaleVariant<readonly DocumentChild[]>[]): PairedChild[] {
  const partitions = variants.map(({ locale, value }) => ({ locale, value: partitionChildren(value) }));
  const reference = partitions[0].value;
  const children: PairedChild[] = [];

  for (let index = 0; index <= reference.anchors.length; index++) {
    const runs = partitions.map(({ locale, value }) => ({ locale, value: value.runs[index] }));
    if (runs.some(({ value }) => value.length > 0)) {
      const previous = reference.anchors[index - 1]?.anchor.key;
      children.push({ kind: 'content', id: previous ? `run:after:${previous}` : 'run:start', variants: runs });
    }

    const entry = reference.anchors[index];
    if (!entry) continue;
    const anchored = partitions.map(({ locale, value }) => ({ locale, value: value.anchors[index].child }));
    if (entry.child.kind === 'section') {
      // Validation established the same section anchor at this position in every locale.
      const sections = anchored as readonly LocaleVariant<Section>[];
      const section = entry.child;
      children.push({
        kind: 'section',
        id: section.id,
        role: section.role,
        headers: section.header ? sections.map(({ locale, value }) => ({ locale, value: value.header! })) : undefined,
        children: pairChildren(sections.map(({ locale, value }) => ({ locale, value: value.children }))),
        numberSections: section.numberSections,
        layout: section.layout,
      });
    } else {
      // Section anchors and block anchors cannot match; each entry is a Block here.
      const blocks = anchored as readonly LocaleVariant<Block>[];
      children.push({
        kind: 'content',
        id: entry.anchor.key,
        anchor: entry.anchor.key,
        variants: blocks.map(({ locale, value }) => ({ locale, value: [value] })),
      });
    }
  }

  return children;
}

/** Produces one canonical layout tree, independent of the displayed locale. */
export function pairDocuments(documents: readonly DocumentModel[]): PairedDocument {
  validateTranslations(documents);
  const ordered = [...documents].sort((left, right) => localeOrder.indexOf(left.locale) - localeOrder.indexOf(right.locale));
  return {
    id: ordered[0].id,
    locales: ordered.map(({ locale }) => locale),
    headers: ordered.map(({ locale, header }) => ({ locale, value: header })),
    children: pairChildren(ordered.map(({ locale, children }) => ({ locale, value: children }))),
  };
}
