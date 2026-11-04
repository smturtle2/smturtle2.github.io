import type { ImageMetadata } from 'astro';
import type { Locale } from '../../i18n';

export type RichText = string | readonly Inline[];
export type Inline = string
  | { kind: 'link'; href: string; children: RichText }
  | { kind: 'code'; text: string }
  | { kind: 'strong' | 'nowrap'; children: RichText };

export interface Link { label: string; href: string; }
export interface Header {
  title: RichText;
  subtitle?: RichText;
  period?: string;
  note?: RichText;
  side?: RichText;
  links?: readonly Link[];
  linksLabel?: string;
}
export interface DocumentHeader {
  title: RichText;
  profileRole?: string;
  contacts?: readonly Link[];
}

export interface ImageAsset {
  kind: 'image';
  id: string;
  source: ImageMetadata;
  format?: 'png' | 'webp';
}
export interface DiagramAsset {
  kind: 'diagram';
  id: string;
  component: (props: { locale: Locale; idPrefix?: string }) => unknown;
}
export interface Cell { content: RichText; accent?: boolean; }
export interface TableRow { cells: readonly (RichText | Cell)[]; selected?: boolean; }
export interface TableAsset { id: string; rows: readonly TableRow[]; }

export type ParagraphBlock = { kind: 'paragraph'; id?: string; content: RichText; lead?: boolean };
export type ListBlock = {
  kind: 'list';
  id?: string;
  items: readonly (RichText | { lines: readonly RichText[] })[];
};
export type FigureBlock = {
  kind: 'figure';
  caption?: RichText;
  variant?: 'wide' | 'detail' | 'screen';
} & ({ asset: ImageAsset; alt: string } | { asset: DiagramAsset; alt?: never });
export interface GalleryItem { asset: ImageAsset; alt: string; label: string; selected?: boolean; }
export type GalleryBlock = {
  kind: 'gallery';
  items: readonly GalleryItem[];
  caption?: RichText;
  variant: 'sequence' | 'comparison';
};
export type TableBlock = {
  kind: 'table';
  columns: readonly RichText[];
  caption?: RichText;
  variant: 'numeric' | 'compact' | 'comparison' | 'descriptive';
} & ({ asset: TableAsset; rows?: never; id?: never } | { id: string; rows: readonly TableRow[]; asset?: never });
export type EquationBlock = { kind: 'equation'; id: string; expression: string; href?: string; explanation?: RichText };
export type Block = ParagraphBlock | ListBlock | FigureBlock | GalleryBlock | TableBlock | EquationBlock;

export type SectionLayout<ChildId extends string = string> =
  | { kind: 'linear'; allowBreakAfter?: readonly ChildId[] }
  | { kind: 'columns'; asideSection: ChildId }
  | { kind: 'image-aside'; asset: string };

export interface Section {
  kind: 'section';
  id: string;
  role: string;
  header?: Header;
  children: readonly DocumentChild[];
  numberSections?: boolean;
  layout?: SectionLayout;
}
export type DocumentChild = Section | Block;

export interface DocumentModel {
  id: string;
  locale: Locale;
  title: string;
  description: string;
  header: DocumentHeader;
  children: readonly DocumentChild[];
}
