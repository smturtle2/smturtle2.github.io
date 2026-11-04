import type { PortfolioContent } from '../structure';
import { paragraph, list, figure, gallery, table, equation } from '../../core/blocks';
import { code, link } from '../../core/rich';
import { assets, dataTables, blending } from '../assets';

export const en = {
  title: 'SHIN DONGJU Portfolio',
  description: 'SHIN DONGJU\'s work on satellite image restoration models, shared training tools, and an article classification service.',
  projects: {
    'clear-net': {
      title: 'CLEAR-Net',
      subtitle: 'Cloud removal from SAR–optical satellite imagery',
      linkLabels: { model: 'Model code', weights: 'Model weights', training: 'Training package', dataset: 'Public dataset' },
      intro: [
        paragraph('Restoring cloud-obscured optical imagery while aiming to preserve the original input in clear regions', { lead: true }),
        list([
          'Optical imagery captures surface color and spectral information, but clouds hide parts of it',
          'SAR imagery is less affected by clouds and supplies terrain structure to help reconstruct a cloud-free optical image',
        ]),
        gallery('sequence', [
          { asset: assets.sceneBefore, alt: 'Optical input scene obscured by clouds', label: 'Cloudy optical input' },
          { asset: assets.sceneMid, alt: 'Intermediate scene with some patches restored and others still cloudy', label: 'Patchwise progress' },
          { asset: assets.sceneAfter, alt: 'Full-scene output assembled from CLEAR-Net patch predictions', label: 'CLEAR-Net output' },
        ], { caption: [link('https://github.com/smturtle2/cr-project/blob/main/modules/util/clear_net_scene_demo.py', 'Full-scene inference demo'), ' restoring 784 patches sequentially'] }),
      ],
      topics: {
        restoration: {
          title: 'Designing cloud removal around input preservation',
          steps: {
            problem: {
              title: 'Removing clouds while preserving clear input regions',
              blocks: [
                list([
                  'Ground truth (GT) is a cloud-free image acquired at another time; changes in the surface or observation conditions can make it differ from the input even in clear regions',
                  'The goal was to remove clouds while retaining information already visible in the input, but ACA-CRNet adds a correction across the whole image and can also alter clear regions',
                ]),
              ],
            },
            approach: {
              title: 'Predicting the restoration candidate and mask separately',
              blocks: [
                list([
                  'Used ACA-CRNet, selected by the team for inference speed and training stability, as the restoration backbone and added a path that carries the original input to the output',
                  'Predicted the restoration candidate separately from the mask that blends it with the input, so low mask values leave the input largely unchanged',
                ]),
              ],
            },
            execution: {
              title: 'Decomposing features by their role in restoration',
              blocks: [
                list([
                  'Designed, built, and compared four model architectures: LCR, FDT, FDT-CCA, and CLEAR-Net',
                  'Replaced FDT\'s shared and sensor-specific decomposition with restoration and cloud components to align the split with what the candidate and mask each need',
                  'Also considered possible optical bias in shared features (13 optical vs. 2 SAR channels) with a teammate when choosing the split',
                ]),
                figure(assets.architecture, {
                  variant: 'wide',
                  alt: 'CLEAR-Net architecture: a restoration path generates a candidate from SAR and optical features, while a separate mask path controls blending with the original input',
                  caption: 'Restoration candidate path (bottom) and blending mask path (top)',
                }),
                list([
                  'Extracted the restoration component from combined SAR–optical features, then the cloud component from the remainder',
                  'Fed the restoration component and dedicated SAR features to ACA-CRNet for the candidate; used the cloud component for the mask',
                ]),
                figure(assets.decomposition, {
                  variant: 'detail',
                  alt: 'Example intermediate features separated into restoration and cloud components, followed by candidate and mask generation',
                  caption: 'Intermediate feature visualization for one input',
                }),
                list([
                  'Mixed 64 learned 13-band vectors with per-pixel weights from the cloud component to form the mask',
                ]),
                equation(blending, {
                  id: 'input-candidate-blending',
                  href: 'https://github.com/smturtle2/cr-project/blob/decdb3342954d21ea8132efd6722b04fc33050f4/modules/model/CLEAR_Net/clear_net.py#L140',
                  explanation: 'For each pixel and band, a mask near 0 favors the input; a mask near 1 favors the candidate',
                }),
                list([
                  'Supervised the candidate and auxiliary outputs to connect the decomposed features to restoration',
                ]),
                table({
                  columns: ['Training target', 'Loss', 'Purpose'],
                  id: 'restoration-losses',
                  variant: 'descriptive',
                  rows: [
                    { cells: ['Final output', 'L1+SSIM', 'Penalize pixel and structural differences'] },
                    { cells: ['Candidate / auxiliary', 'L1+SSIM', 'Supervise restoration before blending and in intermediate features'] },
                    { cells: ['Mask weights', 'Balancing', 'Discourage concentration on a few band vectors'] },
                  ],
                }),
              ],
            },
            outcome: {
              title: 'Full-scene restoration and comparison against GT',
              blocks: [
                list([
                  'Visualized the trained model\'s intermediate features and masks, and built a full-scene inference demo restoring 784 patches from a validation scene',
                  'Against GT across whole images, CLEAR-Net achieved slightly higher SSIM than ACA-CRNet; ACA-CRNet performed better on MAE, PSNR, and SAM',
                ]),
                table({
                  columns: ['Model', 'MAE ↓', 'PSNR ↑', 'SSIM ↑', 'SAM ↓'],
                  variant: 'numeric',
                  caption: 'SEN12MS-CR test set: 7,899 images · Trained for 120 epochs (~76 hours) on 4× A6000 with DDP and bf16',
                  asset: dataTables.restoration,
                }),
                gallery('comparison', [
                  { asset: assets.patch1, alt: 'Cloudy optical input', label: 'Optical input' },
                  { asset: assets.patch3, alt: 'ACA-CRNet restoration result', label: 'ACA-CRNet' },
                  { asset: assets.patch4, alt: 'CLEAR-Net restoration result', label: 'CLEAR-Net', selected: true },
                  { asset: assets.patch5, alt: 'GT: cloud-free optical image acquired at another time', label: 'GT' },
                ], { caption: 'A restoration example with more distinct river and road shapes than ACA-CRNet' }),
              ],
            },
          },
        },
        attention: {
          title: 'Reducing attention memory use',
          steps: {
            problem: {
              title: 'Over 6GB of VRAM for inference',
              blocks: [
                list([
                  'The feature-decomposition experiment used over 6GB of VRAM for inference alone',
                  'Found that contextual attention stored all pairwise similarities, making memory grow quadratically with the number of positions',
                ]),
              ],
            },
            approach: {
              title: 'PyTorch SDPA for efficient attention',
              blocks: [
                list([
                  'Chose SDPA for compatibility with memory-efficient kernels such as FlashAttention, avoiding an explicit similarity matrix',
                ]),
              ],
            },
            execution: {
              title: 'Rebuilding contextual attention with SDPA',
              blocks: [
                list([
                  'Reimplemented the operation with SDPA, measured before/after in the feature-decomposition experiment, and reused it in the final CLEAR-Net',
                ]),
              ],
            },
            outcome: {
              title: '~88% less VRAM and ~1.7× throughput on the experimental model',
              blocks: [
                table({
                  columns: ['Model', 'VRAM', 'Throughput'],
                  variant: 'compact',
                  asset: dataTables.attention,
                }),
              ],
            },
          },
        },
        streaming: {
          title: 'Streaming a large training dataset',
          steps: {
            problem: {
              title: 'A 389GB dataset stored by scene',
              blocks: [
                list([
                  'The original 389GB dataset stored each scene as one parquet file (175 files averaging 2.2GB), making per-server or Colab copies impractical and mixing samples across scenes difficult',
                ]),
              ],
            },
            approach: {
              title: 'Small compressed blocks as the transfer unit',
              blocks: [
                list([
                  'Chose small compressed blocks over scene files to mix scenes without a full local copy',
                ]),
                table({
                  columns: ['Approach', 'Selection and order', 'Local storage'],
                  id: 'streaming-approaches',
                  variant: 'descriptive',
                  rows: [
                    { cells: ['HF streaming', 'Shuffle/termination issues in the initial implementation', 'No full copy needed'] },
                    { cells: ['Seeded block cache', 'Repeatable selection and order', 'Selected data copy'] },
                    { cells: ['Compressed blocks', 'Cross-scene mixing, fixed order', 'Needed blocks only'], selected: true },
                  ],
                }),
              ],
            },
            execution: {
              title: 'Sample-based compression and a streaming loader',
              blocks: [
                list([
                  ['Each sample pairs 256×256 SAR and cloudy optical input patches with cloud-free optical GT at the same location; packed up to 32 same-scene samples into each zstd ', code('.crpack'), ' block'],
                  'Built a seeded loader to mix samples across blocks, prefetch in parallel, and delete used blocks',
                ]),
              ],
            },
            outcome: {
              title: 'Training across scenes with a small local footprint',
              blocks: [
                list([
                  'Republished 389GB as 240GB; trained on mixed-scene samples with about 5GB of local storage',
                ]),
              ],
            },
          },
        },
        collaboration: {
          title: 'Separating model experiments from shared training code',
          steps: {
            problem: {
              title: 'Agent edits could change teammates\' training conditions',
              blocks: [
                list([
                  'Everyone used coding agents with varying experience; agent edits to shared code could let one person\'s experiment alter teammates\' training conditions',
                ]),
              ],
            },
            approach: {
              title: 'A shared package and a separate model repository',
              blocks: [
                list([
                  ['Packaged preprocessing, training, and evaluation; kept model and setting changes in ', code('cr-project')],
                ]),
              ],
            },
            execution: {
              title: 'Responsibilities and change rules for cr-train and cr-project',
              blocks: [
                list([
                  ['Owned ', code('cr-train'), ': data loading, DDP training, evaluation, and metric logging in one package'],
                  'Managed shared code on main and experiments on branches; added a hook restricting shared runner-script commits to main',
                ]),
              ],
            },
            outcome: {
              title: 'The same training and evaluation procedure across models',
              blocks: [
                list([
                  'Team members ran experiments on the shared package and compared four candidate models',
                ]),
              ],
            },
          },
        },
      },
    },
    clickbait: {
      title: 'Click-bait Seeker',
      subtitle: 'Clickbait classification for Chrome',
      linkLabels: { code: 'Project code', store: 'Chrome Web Store' },
      intro: [
        paragraph('A Chrome extension that pairs clickbait probability with key sentences to inspect and GPT commentary', { lead: true }),
        paragraph('Hovering over a link shows its clickbait probability; analyzing an article page or selection shows the probability and GPT commentary and highlights key sentences in the article'),
        figure(assets.analysisDiagram, {
          variant: 'wide',
        }),
      ],
      topics: {
        'sentence-selection': {
          title: 'Selecting key sentences with the article classifier',
          steps: {
            problem: {
              title: 'A probability alone does not show where to look',
              blocks: [
                list([
                  'Wanted to show sentences worth inspecting alongside the probability, but the training data had only article-level labels, making supervised sentence selection and evaluation difficult',
                ]),
              ],
            },
            approach: {
              title: 'Reusing the classifier\'s layer attention',
              blocks: [
                list([
                  'Used attention from the trained Transformer classifier to select sentences without sentence labels',
                  'Considered final-layer attention and attention rollout, which combines attention across layers',
                ]),
              ],
            },
            execution: {
              title: 'Exposing layer attention and comparing sentence selections',
              blocks: [
                list([
                  'Owned article preprocessing and classifier training; joined titles, subtitles, and bodies from about 730K AI Hub articles with SEP and trained with inputs of up to 3,584 tokens',
                  'Modified the trained classifier\'s TransformerEncoder to return layer attention; read and compared sentences selected by final-layer attention and rollout, then adopted rollout',
                  'Returned sentences containing high-scoring tokens, capping selection at five tokens to avoid excessive highlighting',
                ]),
              ],
            },
            outcome: {
              title: 'Returning a probability and key sentences together',
              blocks: [
                list([
                  'The model trained on article-level clickbait labels supplied both a classification probability and key sentences to inspect',
                ]),
              ],
            },
          },
        },
        'jamo-embedding': {
          title: 'Learning jamo embeddings to handle Korean typos',
          steps: {
            problem: {
              title: 'Typos change syllables and word representations',
              blocks: [
                list([
                  'Typos such as ‘스맡폰’ and ‘ㅏㅣ폰’ share few syllable-level pieces with their intended words, making it difficult to obtain similar word representations',
                ]),
              ],
            },
            approach: {
              title: 'Combining jamo decomposition with FastText subwords',
              blocks: [
                list([
                  'Chose jamo decomposition with FastText\'s substring-based embeddings because splitting Korean into consonants and vowels preserves shared pieces even when syllables change',
                ]),
              ],
            },
            execution: {
              title: 'Training embeddings on a separate Korean corpus',
              blocks: [
                list([
                  'Owned embedding training: decomposed a separate Korean corpus into jamo and trained FastText with Gensim',
                  'Used the embeddings as classifier inputs and compared nearest words for the same typos with and without jamo decomposition',
                ]),
              ],
            },
            outcome: {
              title: 'Intended words ranked highly for three example typos',
              blocks: [
                list([
                  'All three example typos had unrelated nearest words before decomposition; afterward, intended words such as ‘스마트폰’ (smartphone), ‘아이폰’ (iPhone), and ‘햄버거’ (hamburger) ranked near the top',
                ]),
                table({
                  columns: ['Input', 'Without jamo decomposition', 'With jamo decomposition'],
                  variant: 'comparison',
                  caption: 'Nearest words (cosine similarity)',
                  asset: dataTables.typos,
                }),
              ],
            },
          },
        },
        serving: {
          title: 'Connecting Python inference to the article interface',
          steps: {
            problem: {
              title: 'Placeholder probabilities close to the deadline',
              blocks: [
                list([
                  'By late November, model training was nearly complete, but the extension still showed placeholder probabilities; the Python model, Spring Boot server, and extension had yet to be connected through real responses',
                ]),
              ],
            },
            approach: {
              title: 'Keeping the model loaded in a persistent Python process',
              blocks: [
                list([
                  'Kept the model in a persistent Python process to avoid reloading it for each request; connected a teammate\'s Spring Boot server to that process through a request helper and Unix socket',
                ]),
              ],
            },
            execution: {
              title: 'Building inference and taking on frontend integration',
              blocks: [
                list([
                  'Built the Python inference server, then took on result display and GPT commentary integration late in the project, using a coding agent to understand and work with the existing frontend',
                ]),
                figure(assets.serviceDiagram, {
                  variant: 'wide',
                  caption: 'Highlighted: parts I connected · Spring Boot: teammate',
                }),
                list([
                  'Implemented per-link caching, a request queue, and duplicate-request suppression to reduce repeated analysis and requests for the same link',
                  'Matched extracted sentences, which lost spaces when rebuilt from tokens, against the space-stripped body using longest common substring (LCS), then mapped matches back to the original text for highlighting',
                  ['Connected the article interface to display probability and commentary generated by the team backend, which sent the article body and key sentences to ', code('gpt-4o-mini')],
                ]),
              ],
            },
            outcome: {
              title: 'Live analysis results and Chrome Web Store release',
              blocks: [
                list([
                  'Replaced placeholder probabilities with real server responses, completing probability display, sentence highlighting, and GPT commentary; the team released the extension on the Chrome Web Store',
                ]),
                figure(assets.hover, {
                  alt: 'Clickbait probability displayed when hovering over an article link',
                }),
                figure(assets.seeker, {
                  variant: 'screen',
                  alt: 'Article interface with a clickbait probability and GPT commentary banner above highlighted key sentences',
                }),
              ],
            },
          },
        },
      },
    },
  },
} satisfies PortfolioContent;
