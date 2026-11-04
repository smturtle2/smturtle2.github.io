import type { DocumentChild, DocumentModel, Section } from './model';

type Outline = Map<string, readonly string[]>;

function fail(document: DocumentModel, path: string, message: string): never {
  throw new Error(`[${document.id}/${document.locale}${path}] ${message}`);
}

function anchors(child: DocumentChild): string[] {
  switch (child.kind) {
    case 'section': return [`section:${child.id}`];
    case 'figure': return [`asset:${child.asset.id}`];
    case 'gallery': return child.items.map((item) => `asset:${item.asset.id}`);
    case 'table': return child.asset ? [`asset:${child.asset.id}`] : [];
    default: return [];
  }
}

/** Validate structure and layout independently of document IDs and section roles. */
export function inspectDocument(document: DocumentModel): Outline {
  const outline: Outline = new Map();

  function visit(children: readonly DocumentChild[], path: string, headingDepth: number): void {
    const ids = new Set<string>();
    outline.set(path, children.flatMap(anchors));

    for (const child of children) {
      if (child.kind !== 'section') continue;
      if (!child.id || /[\/\s]/u.test(child.id)) fail(document, path, `Invalid section ID: ${child.id}`);
      if (ids.has(child.id)) fail(document, path, `Duplicate sibling section ID: ${child.id}`);
      ids.add(child.id);
      const childPath = `${path}/${child.id}`;
      const childDepth = headingDepth + (child.header ? 1 : 0);
      if (childDepth > 6) fail(document, childPath, 'Titled section nesting exceeds h6');
      inspectLayout(child, childPath);
      visit(child.children, childPath, childDepth);
    }
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

/** Text blocks may differ by locale; section/media order must remain shared. */
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
      if (!actual || actual.length !== expected.length || actual.some((anchor, index) => anchor !== expected[index])) {
        fail(document, path, `Section/asset order differs from ${reference.locale}`);
      }
    }
  }
}
