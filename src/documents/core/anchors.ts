import type { Block, DocumentChild } from './model';

export interface Anchor {
  key: string;
  ids: readonly string[];
}

/** The same identities drive both translation validation and content pairing. */
export function anchorOf(child: DocumentChild): Anchor | undefined {
  switch (child.kind) {
    case 'section': return { key: `section:${child.id}`, ids: [child.id] };
    case 'figure': return { key: `figure:${child.asset.id}`, ids: [child.asset.id] };
    case 'gallery': {
      const ids = child.items.map((item) => item.asset.id);
      return { key: `gallery:${JSON.stringify(ids)}`, ids };
    }
    case 'table': {
      const id = child.asset ? child.asset.id : child.id;
      return { key: `table:${id}`, ids: [id] };
    }
    case 'equation': return { key: `equation:${child.id}`, ids: [child.id] };
    case 'paragraph':
    case 'list': return child.id === undefined ? undefined : { key: `prose:${child.id}`, ids: [child.id] };
  }
}

export interface AnchoredChild {
  anchor: Anchor;
  child: DocumentChild;
}

export interface ContentPartition {
  /** One free-prose run before, between, and after the anchors. */
  runs: readonly (readonly Block[])[];
  anchors: readonly AnchoredChild[];
}

export function partitionChildren(children: readonly DocumentChild[]): ContentPartition {
  const runs: Block[][] = [[]];
  const anchors: AnchoredChild[] = [];
  for (const child of children) {
    const anchor = anchorOf(child);
    if (anchor) {
      anchors.push({ anchor, child });
      runs.push([]);
    } else if (child.kind !== 'section') {
      runs[runs.length - 1].push(child);
    }
  }
  return { runs, anchors };
}
