import type { ResumeContent } from './model';

export const en = {
  title: 'SHIN DONGJU Résumé',
  description: "SHIN DONGJU's education, machine learning projects, and technical skills.",
  categories: { education: 'Education', projects: 'Projects', skills: 'Skills' },
  education: {
    title: 'Dongguk University',
    period: 'Mar 2020 – Aug 2026 · Graduated',
    note: 'Division of AI Software Convergence · Multimedia Software Engineering',
    side: 'GPA 4.14 / 4.5',
  },
  projects: {
    'clear-net': {
      title: 'CLEAR-Net',
      subtitle: 'SAR-optical satellite cloud removal (Sentinel-1/2)',
      linksLabel: 'CLEAR-Net resources',
      linkLabels: { model: 'Model code', weights: 'Weights', training: 'Training package', dataset: 'Dataset' },
      items: [
        { lines: ['Designed and implemented an ACA-CRNet-based restoration model', 'Bandwise masks blend original and restored images to limit changes in cloud-free areas'] },
        { lines: ['Rebuilt and published SEN12MS-CR (389 GB → 240 GB)', 'Streaming loader for training without storing the full dataset locally'] },
        { lines: ['Built a shared training and evaluation package to compare four candidate models', '4-GPU DDP training; unified metric computation'] },
        { lines: ['Reimplemented contextual attention with PyTorch SDPA for the final model', 'Feature-decomposition experiment, inference: VRAM 6,264 → 724 MB; 4.63 → 7.88 img/s'] },
      ],
    },
    clickbait: {
      title: 'Click-bait Seeker',
      subtitle: 'Chrome extension for clickbait classification',
      linksLabel: 'Click-bait Seeker resources',
      linkLabels: { code: 'Project code', store: 'Chrome Web Store' },
      items: [
        { lines: ['Trained Jamo-level FastText on a separate Korean corpus for typo robustness', 'Preprocessed about 730K AI Hub articles; trained a Transformer classifier'] },
        { lines: ['Modified the PyTorch Transformer classifier to return per-layer attention', 'Selected key sentences with attention rollout and highlighted them in the article'] },
        { lines: ['Built a Python inference server integrated with the Spring Boot server', 'Displayed classification results and GPT commentary in the extension'] },
      ],
    },
  },
  skills: [
    'Python · C/C++ · PyTorch · Git · Linux · Docker',
    'Computer vision · NLP · Distributed training · Large-scale data processing',
  ],
} as const satisfies ResumeContent;
