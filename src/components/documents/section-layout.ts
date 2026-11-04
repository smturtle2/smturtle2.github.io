import type { PairedChild } from '../../documents/core/pairing';

/** Allowed boundaries split a sequence into contiguous, preferred print units. */
export function printGroups(children: readonly PairedChild[], allowBreakAfter: readonly string[]): readonly (readonly PairedChild[])[] {
  const boundaries = new Set(allowBreakAfter);
  const groups: PairedChild[][] = [];
  let current: PairedChild[] = [];
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
