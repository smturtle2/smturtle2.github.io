import { anchorOf } from './anchors';
import type { DocumentChild, DocumentModel, Section, SectionLayout } from './model';

interface OutlineEntry {
  anchors: readonly string[];
  shapes: readonly string[];
  section?: Section;
}
type Outline = Map<string, OutlineEntry>;

function fail(document: DocumentModel, path: string, message: string): never {
  throw new Error(`[${document.id}/${document.locale}${path}] ${message}`);
}

function validId(value: unknown): value is string {
  return typeof value === 'string' && value.length > 0 && !/[\/\s]/u.test(value);
}

function layoutSignature(layout: SectionLayout | undefined): string {
  if (!layout) return 'flow';
  switch (layout.kind) {
    case 'linear': return layout.allowBreakAfter === undefined ? 'flow' : JSON.stringify(['linear', layout.allowBreakAfter]);
    case 'columns': return JSON.stringify(['columns', layout.asideSection]);
    case 'image-aside': return JSON.stringify(['image-aside', layout.asset]);
  }
}

function anchorShape(child: DocumentChild): string {
  switch (child.kind) {
    case 'section': return 'section';
    case 'figure': return JSON.stringify(['figure', child.asset.kind, child.variant ?? 'wide']);
    case 'gallery': return JSON.stringify(['gallery', child.variant]);
    case 'table': return JSON.stringify(['table', child.variant, child.columns.length]);
    case 'equation': return 'equation';
    case 'paragraph':
    case 'list': return 'prose';
  }
}

/** Validate structure and layout independently of document IDs and section roles. */
export function inspectDocument(document: DocumentModel): Outline {
  const outline: Outline = new Map();
  if (!validId(document.id)) fail(document, '', `Invalid document ID: ${document.id}`);

  function visit(children: readonly DocumentChild[], path: string, headingDepth: number, section?: Section): void {
    const keys = new Set<string>();
    const anchors: string[] = [];
    const shapes: string[] = [];
    for (const child of children) {
      const anchor = anchorOf(child);
      if (anchor) {
        if (anchor.ids.length === 0 || anchor.ids.some((id) => !validId(id))) {
          fail(document, path, `Invalid or missing anchor ID: ${anchor.key}`);
        }
        if (new Set(anchor.ids).size !== anchor.ids.length) fail(document, path, `Repeated asset in anchor: ${anchor.key}`);
        if (keys.has(anchor.key)) fail(document, path, `Duplicate sibling anchor: ${anchor.key}`);
        keys.add(anchor.key);
        anchors.push(anchor.key);
        shapes.push(anchorShape(child));
      }
      if (child.kind !== 'section') continue;
      const childPath = `${path}/${child.id}`;
      const childDepth = headingDepth + (child.header ? 1 : 0);
      if (childDepth > 6) fail(document, childPath, 'Titled section nesting exceeds h6');
      inspectLayout(child, childPath);
      visit(child.children, childPath, childDepth, child);
    }
    outline.set(path, { anchors, shapes, section });
  }

  function inspectLayout(section: Section, path: string): void {
    const layout = section.layout;
    if (!layout) return;
    const sectionChildren = section.children.filter((child) => child.kind === 'section');
    const sectionIds = new Set(sectionChildren.map((child) => child.id));

    if (layout.kind === 'columns') {
      const last = section.children.at(-1);
      if (section.children.length < 2 || last?.kind !== 'section' || last.id !== layout.asideSection) {
        fail(document, path, 'The side section must be the last child, with preceding content');
      }
      return;
    }

    if (layout.kind === 'image-aside') {
      const matches = section.children.filter((child) => child.kind === 'figure' && child.asset.id === layout.asset);
      if (matches.length !== 1) fail(document, path, `Side asset must identify exactly one direct figure: ${layout.asset}`);
      return;
    }

    if (layout.allowBreakAfter) {
      const cuts = new Set<string>();
      for (const id of layout.allowBreakAfter) {
        if (!sectionIds.has(id)) fail(document, path, `Page-break reference is not a child section: ${id}`);
        if (cuts.has(id)) fail(document, path, `Duplicate page-break reference: ${id}`);
        cuts.add(id);
      }
    }
  }

  visit(document.children, '', 1);
  return outline;
}

/** Free prose may differ; anchors and the layout tree must remain shared. */
export function validateTranslations(documents: readonly DocumentModel[]): void {
  const reference = documents[0];
  if (!reference) throw new Error('A document needs at least one locale');
  const referenceOutline = inspectDocument(reference);
  const locales = new Set<string>([reference.locale]);

  for (const document of documents.slice(1)) {
    if (document.id !== reference.id) throw new Error('Translation validation requires one document ID');
    if (locales.has(document.locale)) fail(document, '', 'Duplicate locale');
    locales.add(document.locale);
    const outline = inspectDocument(document);
    if (outline.size !== referenceOutline.size) fail(document, '', 'Section structure differs between locales');
    for (const [path, expected] of referenceOutline) {
      const actual = outline.get(path);
      if (!actual || actual.anchors.length !== expected.anchors.length || actual.anchors.some((anchor, index) => anchor !== expected.anchors[index])) {
        fail(document, path, `Anchor order differs from ${reference.locale}`);
      }
      if (actual.shapes.some((shape, index) => shape !== expected.shapes[index])) {
        fail(document, path, `Anchored block layout differs from ${reference.locale}`);
      }
      if (actual.section && expected.section) {
        if (actual.section.role !== expected.section.role || Boolean(actual.section.header) !== Boolean(expected.section.header)) {
          fail(document, path, `Section role or heading presence differs from ${reference.locale}`);
        }
        if (Boolean(actual.section.numberSections) !== Boolean(expected.section.numberSections)) {
          fail(document, path, `Section numbering differs from ${reference.locale}`);
        }
        if (layoutSignature(actual.section.layout) !== layoutSignature(expected.section.layout)) {
          fail(document, path, `Section layout differs from ${reference.locale}`);
        }
      }
    }
  }
}
