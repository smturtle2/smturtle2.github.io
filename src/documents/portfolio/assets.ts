import type { ImageAsset, DiagramAsset, TableAsset } from '../core/model';
import ClickbaitAnalysisDiagram from '../../components/documents/ClickbaitAnalysisDiagram.astro';
import ClickbaitFlowDiagram from '../../components/documents/ClickbaitFlowDiagram.astro';
import architecture from '../../assets/portfolio/architecture.png';
import decomposition from '../../assets/portfolio/decomp.jpg';
import patch1 from '../../assets/portfolio/patch_1.jpg';
import patch3 from '../../assets/portfolio/patch_3.jpg';
import patch4 from '../../assets/portfolio/patch_4.jpg';
import patch5 from '../../assets/portfolio/patch_5.jpg';
import sceneBefore from '../../assets/portfolio/scene_before.jpg';
import sceneMid from '../../assets/portfolio/scene_mid.jpg';
import sceneAfter from '../../assets/portfolio/scene_after.jpg';
import seeker from '../../assets/portfolio/seeker.png';
import hover from '../../assets/portfolio/hover.png';
import { strong } from '../core/rich';

export const assets = {
  architecture: { kind: 'image', id: 'clear-architecture', source: architecture },
  decomposition: { kind: 'image', id: 'clear-decomposition', source: decomposition },
  patch1: { kind: 'image', id: 'patch-input', source: patch1 },
  patch3: { kind: 'image', id: 'patch-aca', source: patch3 },
  patch4: { kind: 'image', id: 'patch-clear', source: patch4 },
  patch5: { kind: 'image', id: 'patch-gt', source: patch5 },
  sceneBefore: { kind: 'image', id: 'scene-before', source: sceneBefore },
  sceneMid: { kind: 'image', id: 'scene-mid', source: sceneMid },
  sceneAfter: { kind: 'image', id: 'scene-after', source: sceneAfter },
  seeker: { kind: 'image', id: 'seeker-screen', source: seeker, format: 'png' },
  hover: { kind: 'image', id: 'seeker-hover', source: hover, format: 'png' },
  analysisDiagram: { kind: 'diagram', id: 'clickbait-analysis', component: ClickbaitAnalysisDiagram },
  serviceDiagram: { kind: 'diagram', id: 'clickbait-service', component: ClickbaitFlowDiagram },
} satisfies Record<string, ImageAsset | DiagramAsset>;

export const dataTables = {
  restoration: {
    id: 'portfolio-restoration',
    rows: [
      { cells: ['ACA-CRNet', [strong('0.0265')], [strong('29.41')], '0.8909', [strong('7.910')]] },
      { cells: ['CLEAR-Net', '0.0274', '28.46', { content: [strong('0.8936')], accent: true }, '8.244'] },
    ],
  },
  attention: {
    id: 'portfolio-attention',
    rows: [
      { cells: ['EMRDM (Diffusion)', '2,782 MB', '1.28 img/s'] },
      { cells: ['ACA-CRNet', '6,264 MB', '4.63 img/s'] },
      { cells: ['proposed', [strong('724 MB')], [strong('7.88 img/s')]] },
    ],
  },
  typos: {
    id: 'portfolio-typos',
    rows: [
      { cells: ['스맡폰', '이 0.20 · 증기 0.20', [strong('스마트 0.84 · 스마트폰 0.81')]] },
      { cells: ['ㅏㅣ폰', '매료 0.19 · 베이지 0.18', [strong('아이폰 0.83'), ' · 폰 0.81']] },
      { cells: ['햄벅', '해질 0.21 · 낙관 0.20', [strong('햄버거 0.86'), ' · 핫도그 0.68']] },
    ],
  },
} satisfies Record<string, TableAsset>;

export const blending = 'prediction = cloudy * (1.0 - mask) + candidate * mask';
