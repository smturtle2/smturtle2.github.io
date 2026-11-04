/** Encode the supplied semantic path without losing identity or URL safety. */
export function diagramId(prefix: string | undefined, localId: string): string {
  if (!prefix) return localId;
  const namespace = Array.from(prefix, (character) => character.codePointAt(0)!.toString(16)).join('-');
  return `diagram-${namespace}-${localId}`;
}
