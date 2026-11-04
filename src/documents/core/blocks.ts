import type {
  DiagramAsset, EquationBlock, FigureBlock, GalleryBlock, ImageAsset,
  ListBlock, ParagraphBlock, RichText, TableBlock,
} from './model';

export function paragraph(content: RichText, options: Pick<ParagraphBlock, 'id' | 'lead'> = {}): ParagraphBlock {
  return { kind: 'paragraph', content, ...options };
}

export function list(items: ListBlock['items'], options: Pick<ListBlock, 'id'> = {}): ListBlock {
  return { kind: 'list', items, ...options };
}

type FigureOptions = Pick<FigureBlock, 'caption' | 'variant'>;

export function figure(asset: ImageAsset, options: FigureOptions & { alt: string }): FigureBlock;
export function figure(asset: DiagramAsset, options?: FigureOptions): FigureBlock;
export function figure(asset: ImageAsset | DiagramAsset, options: FigureOptions & { alt?: string } = {}): FigureBlock {
  if (asset.kind === 'image') {
    if (options.alt === undefined) throw new Error(`Image ${asset.id} requires alternative text`);
    return { ...options, kind: 'figure', asset, alt: options.alt };
  }
  return { kind: 'figure', asset, caption: options.caption, variant: options.variant };
}

export function gallery(variant: GalleryBlock['variant'], items: GalleryBlock['items'], options: Pick<GalleryBlock, 'caption'> = {}): GalleryBlock {
  return { kind: 'gallery', variant, items, ...options };
}

type WithoutKind<T> = T extends { kind: string } ? Omit<T, 'kind'> : never;

export function table(options: WithoutKind<TableBlock>): TableBlock {
  return { kind: 'table', ...options };
}

export function equation(expression: string, options: Pick<EquationBlock, 'id' | 'href' | 'explanation'>): EquationBlock {
  return { kind: 'equation', expression, ...options };
}
