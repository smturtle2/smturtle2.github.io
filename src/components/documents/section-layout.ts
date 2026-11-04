import type { DocumentChild } from '../../documents/core/model';

/** Allowed boundaries split a sequence into contiguous, preferred print units. */
export function printGroups(children: readonly DocumentChild[], allowBreakAfter: readonly string[]): readonly (readonly DocumentChild[])[] {
  const boundaries = new Set(allowBreakAfter);
  const groups: DocumentChild[][] = [];
  let current: DocumentChild[] = [];
  for (const child of children) {
    current.push(child);
    if (child.kind === 'section' && boundaries.has(child.id)) {
      groups.push(current);
      current = [];
    }
  }
  if (current.length || groups.length === 0) groups.push(current);
  return groups;
}
