import type { Block, Header } from '../../documents/core/model';
import type { PairedChild, PairedContent } from '../../documents/core/pairing';

/** Styling facts only: the stylesheet owns the actual spacing values. */
export function blockKinds(block: Block | undefined): readonly string[] {
  if (!block) return [];
  switch (block.kind) {
    case 'paragraph': return block.lead ? ['paragraph', 'lead'] : ['paragraph'];
    case 'figure': return [`figure-${block.variant ?? 'wide'}`];
    case 'gallery': return [`gallery-${block.variant}`];
    case 'table': return [`table-${block.variant}`];
    case 'equation': return [block.explanation === undefined ? 'equation' : 'equation-explained'];
    default: return [block.kind];
  }
}

export function headerKinds(header: Header): readonly string[] {
  const detailed = header.subtitle !== undefined || header.period !== undefined || header.note !== undefined || header.side !== undefined || header.links !== undefined;
  return ['header', detailed ? 'header-detailed' : 'header-simple'];
}

/** A leaf pays once; a parent pays only for its own introductory content. */
export function reserveContent(children: readonly PairedChild[]): PairedContent | undefined {
  const firstSection = children.findIndex((child) => child.kind === 'section');
  const ownContent = firstSection < 0 ? children : children.slice(0, firstSection);
  return ownContent.findLast((child): child is PairedContent => child.kind === 'content');
}
