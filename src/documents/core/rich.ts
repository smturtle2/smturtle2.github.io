import type { Inline, RichText } from './model';

export const link = (href: string, children: RichText): Inline => ({ kind: 'link', href, children });
export const code = (text: string): Inline => ({ kind: 'code', text });
export const strong = (children: RichText): Inline => ({ kind: 'strong', children });
export const nowrap = (children: RichText): Inline => ({ kind: 'nowrap', children });
