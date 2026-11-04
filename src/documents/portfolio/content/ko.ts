import type { PortfolioContent } from '../structure';
import { paragraph, list, figure, gallery, table, equation } from '../../core/blocks';
import { code, link, nowrap } from '../../core/rich';
import { assets, dataTables, blending } from '../assets';

export const ko = {
  title: '신동주 포트폴리오',
  description: '신동주의 위성영상 복원 모델, 공용 학습 환경, 기사 분류 서비스 개발 경험.',
  projects: {
    'clear-net': {
      title: 'CLEAR-Net',
      subtitle: 'SAR·광학 위성영상 구름 제거',
      linkLabels: { model: '모델 코드', weights: '모델 가중치', training: '학습 패키지', dataset: '공개 데이터셋' },
      intro: [
        paragraph('구름에 가린 광학 영상을 복원하며, 구름 없는 영역의 원본 보존을 목표로 한 모델', { lead: true }),
        list([
          '광학 영상은 지표의 색·분광 정보를 담지만, 구름에 가린 부분은 활용하기 어려움',
          '구름의 영향을 적게 받는 SAR 영상으로 가려진 지형의 윤곽을 보완해, 구름 없는 광학 영상을 복원하는 과제',
        ]),
        gallery('sequence', [
          { asset: assets.sceneBefore, alt: '구름이 지표면을 가린 광학 입력 장면', label: '구름 낀 광학 입력' },
          { asset: assets.sceneMid, alt: '일부 패치의 구름 제거가 끝나고 나머지를 복원 중인 중간 장면', label: '패치별 복원 진행' },
          { asset: assets.sceneAfter, alt: 'CLEAR-Net으로 패치를 이어 복원한 장면 단위 출력', label: 'CLEAR-Net 출력' },
        ], { caption: ['784개 패치를 차례로 복원한 ', link('https://github.com/smturtle2/cr-project/blob/main/modules/util/clear_net_scene_demo.py', '장면 단위 추론 데모')] }),
      ],
      topics: {
        restoration: {
          title: '원본 보존을 고려한 구름 제거 모델 설계',
          steps: {
            problem: {
              title: '구름 없는 입력 정보도 보존해야 하는 복원',
              blocks: [
                list([
                  'GT는 다른 시점에 촬영한 구름 없는 영상으로, 지표나 관측 조건이 달라 구름 없는 영역에서도 입력과 차이가 생길 수 있음',
                  '입력에 남아 있는 정보는 유지하며 구름을 제거하는 것이 목표였지만, ACA-CRNet은 영상 전체에 보정값을 더해 구름 없는 영역까지 바뀔 수 있는 구조',
                ]),
              ],
            },
            approach: {
              title: '복원 후보와 혼합 비중을 따로 예측',
              blocks: [
                list([
                  '팀에서 추론 속도와 학습 안정성을 고려해 고른 ACA-CRNet을 복원 본체로 사용하되, 원본을 출력에 남기는 경로를 추가',
                  '새로 만든 ‘복원 후보’와 원본·후보를 섞는 비율인 ‘마스크’를 따로 예측하는 방식을 택해, 마스크가 낮은 곳은 입력이 거의 그대로 출력되도록 함',
                ]),
              ],
            },
            execution: {
              title: '복원 역할에 따라 바꾼 특징 분해 기준',
              blocks: [
                list([
                  '모델 설계·구현을 맡아 후보 구조 4종(LCR·FDT·FDT-CCA·CLEAR-Net)을 구현·비교',
                  'FDT의 SAR·광학 공통·고유 성분 분해를 검토하며, 두 센서의 공통점을 찾는 기준보다 복원 후보와 마스크가 각각 쓸 정보를 나누는 편이 과제에 더 직접적이라고 판단',
                  '광학 13채널과 SAR 2채널의 차이로 공통 성분이 광학 쪽으로 치우칠 가능성도 팀원과 검토하고, 분해 기준을 복원용·구름 성분으로 변경',
                ]),
                figure(assets.architecture, {
                  variant: 'wide',
                  alt: 'SAR·광학 특징에서 복원 후보를 만들고, 별도 마스크 경로가 원본과 후보의 혼합 비중을 정하는 CLEAR-Net 구조',
                  caption: '복원 후보를 만드는 경로(아래)와 혼합 비중을 정하는 마스크 경로(위)',
                }),
                list([
                  'SAR·광학 결합 특징에서 복원용 성분을 먼저 뽑고, 원래 특징에서 이를 뺀 나머지에서 구름 성분 추출',
                  '복원용 성분은 SAR 전용 특징과 합쳐 ACA-CRNet 본체로 복원 후보를 만들고, 구름 성분은 마스크 생성에 사용',
                ]),
                figure(assets.decomposition, {
                  variant: 'detail',
                  alt: '중간 특징을 복원용·구름 성분으로 나누고 후보와 마스크를 생성한 시각화 예시',
                  caption: '한 입력의 중간 특징 시각화 예시',
                }),
                list([
                  '학습 가능한 64개 밴드 벡터를 두고, 구름 성분에서 예측한 픽셀별 비중으로 섞어 13개 밴드의 마스크를 만듦',
                ]),
                equation(blending, {
                  id: 'input-candidate-blending',
                  href: 'https://github.com/smturtle2/cr-project/blob/decdb3342954d21ea8132efd6722b04fc33050f4/modules/model/CLEAR_Net/clear_net.py#L140',
                  explanation: '픽셀·밴드마다 마스크가 0에 가까우면 원본을, 1에 가까우면 복원 후보를 더 많이 반영',
                }),
                list([
                  '분해한 특징이 복원 목표와 이어지도록, 혼합 전 복원 후보와 보조 출력에도 복원 손실을 둠',
                ]),
                table({
                  columns: ['학습 대상', '손실', '목적'],
                  id: 'restoration-losses',
                  variant: 'descriptive',
                  rows: [
                    { cells: ['혼합한 최종 출력', 'L1+SSIM', '최종 영상의 픽셀 오차와 구조 차이 반영'] },
                    { cells: ['복원 후보·보조 출력', 'L1+SSIM', '혼합 전 후보와 중간 특징에도 복원 목표 부여'] },
                    { cells: ['마스크 혼합 가중치', '균형 손실', '일부 밴드 벡터에 가중치가 몰리지 않도록 구성'] },
                  ],
                }),
              ],
            },
            outcome: {
              title: '장면 단위 복원과 GT 기준 지표 비교',
              blocks: [
                list([
                  '학습한 모델의 중간 특징·마스크를 시각화하고, 검증 장면 784개 패치를 이어 복원하는 장면 단위 추론 데모 구현',
                  'GT 기준 전체 영상에서 SSIM은 ACA-CRNet보다 소폭 높았고, MAE·PSNR·SAM은 ACA-CRNet이 우세',
                ]),
                table({
                  columns: ['모델', 'MAE ↓', 'PSNR ↑', 'SSIM ↑', 'SAM ↓'],
                  variant: 'numeric',
                  caption: 'SEN12MS-CR 테스트셋 7,899장 · A6000 4장 DDP·bf16, 120 epoch(약 76시간) 학습',
                  asset: dataTables.restoration,
                }),
                gallery('comparison', [
                  { asset: assets.patch1, alt: '구름 낀 광학 입력', label: '광학 입력' },
                  { asset: assets.patch3, alt: 'ACA-CRNet 복원 결과', label: 'ACA-CRNet' },
                  { asset: assets.patch4, alt: 'CLEAR-Net 복원 결과', label: 'CLEAR-Net', selected: true },
                  { asset: assets.patch5, alt: 'GT: 다른 시점에 촬영한 구름 없는 광학 영상', label: 'GT' },
                ], { caption: 'ACA-CRNet보다 강과 길의 형태가 뚜렷하게 나타난 복원 예시' }),
              ],
            },
          },
        },
        attention: {
          title: 'attention 메모리 사용량 절감',
          steps: {
            problem: {
              title: '특징 분해 모델에서 추론 VRAM 6GB 초과',
              blocks: [
                list([
                  '특징 분해 모듈을 붙인 실험 모델에서 추론에만 6GB가 넘는 VRAM 사용',
                  '연산을 확인하니 contextual attention이 모든 위치 쌍의 유사도를 행렬로 만들어 저장하고 있었고, 위치 수가 늘수록 저장량이 제곱으로 증가',
                ]),
              ],
            },
            approach: {
              title: '메모리 효율 커널과 호환되는 PyTorch SDPA',
              blocks: [
                list([
                  '유사도 행렬을 코드에서 직접 만들지 않고, Flash Attention 등 메모리 효율 커널과 호환되는 PyTorch SDPA에 attention 연산을 맡기기로 함',
                ]),
              ],
            },
            execution: {
              title: 'contextual attention 재구현과 최종 모델 적용',
              blocks: [
                list([
                  '기존 contextual attention을 SDPA 호출 구조로 다시 구현하고, 특징 분해 실험 모델에서 변경 전후를 측정한 뒤 최종 CLEAR-Net에도 같은 구현 적용',
                ]),
              ],
            },
            outcome: {
              title: '실험 모델 기준 VRAM 약 88% 절감, 처리량 약 1.7배',
              blocks: [
                table({
                  columns: ['모델', 'VRAM', '처리량'],
                  variant: 'compact',
                  asset: dataTables.attention,
                }),
              ],
            },
          },
        },
        streaming: {
          title: '대용량 학습 데이터 스트리밍 구현',
          steps: {
            problem: {
              title: '장면 단위로 묶인 389GB 원본',
              blocks: [
                list([
                  '원본 389GB는 장면 하나를 parquet 파일 하나(평균 2.2GB)로 묶은 175개 파일이어서, 서버·Colab마다 복제하기 어렵고 여러 장면의 샘플을 섞어 학습하기도 어려웠음',
                ]),
              ],
            },
            approach: {
              title: '장면 파일 대신 작은 압축 블록을 전송 단위로',
              blocks: [
                list([
                  '여러 장면을 섞되 전체 사본은 두지 않도록, 장면 파일 대신 작은 압축 블록을 전송 단위로 선택',
                ]),
                table({
                  columns: ['검토한 방식', '데이터 선택·읽기', '로컬 보관'],
                  id: 'streaming-approaches',
                  variant: 'descriptive',
                  rows: [
                    { cells: ['Hugging Face 직접 스트리밍', '초기 구현에서 셔플·종료 처리 불안정', '전체 사본 불필요'] },
                    { cells: ['seed 기반 블록 캐시', '선택한 데이터와 순서 재현', '선택 데이터의 사본 필요'] },
                    { cells: ['압축 블록 스트리밍', '장면 간 혼합·순서 고정', '필요한 블록만 임시 보관'], selected: true },
                  ],
                }),
              ],
            },
            execution: {
              title: '학습 샘플 단위 압축 블록과 스트리밍 로더',
              blocks: [
                list([
                  ['학습 샘플 하나는 같은 지점의 입력(SAR·구름 낀 광학)과 GT(구름 없는 광학) 패치(256×256 픽셀)로 구성되며, 같은 장면의 샘플을 최대 32개씩 묶어 zstd 압축 블록(', code('.crpack'), ')으로 재구성'],
                  '로더는 seed로 여러 블록의 샘플을 섞어 읽고, 다음 블록을 병렬로 미리 받아 쓴 블록은 지우도록 직접 구현',
                ]),
              ],
            },
            outcome: {
              title: '작은 로컬 공간에서 여러 장면을 섞어 학습',
              blocks: [
                list([
                  '389GB를 240GB로 재구성해 공개하고, 약 5GB의 로컬 공간에서 여러 장면의 샘플이 섞인 순서로 학습',
                ]),
              ],
            },
          },
        },
        collaboration: {
          title: '모델 실험 코드와 공용 학습·평가 코드 분리',
          steps: {
            problem: {
              title: '에이전트가 공용 코드까지 수정할 수 있는 협업 환경',
              blocks: [
                list([
                  '팀원 모두 코딩 에이전트로 실험 코드를 썼지만 활용 경험은 달랐고, 에이전트가 공용 코드까지 수정하면 한 사람의 실험이 다른 사람의 학습 조건도 바꿀 수 있었음',
                ]),
              ],
            },
            approach: {
              title: '공용 절차는 패키지로, 실험은 모델 저장소로',
              blocks: [
                list([
                  '전처리·학습·평가는 설치해 쓰는 별도 패키지로 두고, 팀원은 모델 저장소에서 모델과 설정만 바꾸도록 분리',
                ]),
              ],
            },
            execution: {
              title: 'cr-train·cr-project의 책임과 변경 규칙',
              blocks: [
                list([
                  ['학습 파이프라인을 맡아 데이터 로딩·DDP 학습·평가·지표 기록을 ', code('cr-train'), '에 통합'],
                  '공용 코드 변경은 main에서 직접 관리하고, 모델 실험은 브랜치별로 진행하되 공용 실행 스크립트는 main에서만 커밋되도록 훅 적용',
                ]),
              ],
            },
            outcome: {
              title: '모델을 바꿔도 같은 절차로 학습·평가',
              blocks: [
                list([
                  '공용 패키지 위에서 팀원별 모델 실험을 진행해 후보 모델 4종을 비교',
                ]),
              ],
            },
          },
        },
      },
    },
    clickbait: {
      title: 'Click-bait Seeker',
      subtitle: '낚시성 기사 분류 확장 프로그램',
      linkLabels: { code: '프로젝트 코드', store: 'Chrome 웹 스토어' },
      intro: [
        paragraph('낚시성 확률과 함께, 기사에서 살펴볼 주요 문장과 GPT 해설을 보여 주는 Chrome 확장 프로그램', { lead: true }),
        paragraph('링크에 마우스를 올리면 낚시성 확률을, 기사 페이지나 선택 영역을 분석하면 확률과 GPT 해설을 보여 주고, 기사 본문에는 주요 문장을 강조'),
        figure(assets.analysisDiagram, {
          variant: 'wide',
        }),
      ],
      topics: {
        'sentence-selection': {
          title: '기사 분류 모델을 활용한 주요 문장 추출',
          steps: {
            problem: {
              title: '확률만으로는 알 수 없는 기사 속 확인 지점',
              blocks: [
                list([
                  '낚시성 확률과 함께 기사에서 살펴볼 문장도 보여 주고자 했지만, 학습 데이터에는 기사 단위 라벨만 있어 문장별 정답을 이용한 학습·평가는 어려웠음',
                ]),
              ],
            },
            approach: {
              title: '분류 모델의 층별 attention을 문장 선정에 활용',
              blocks: [
                list([
                  '문장 라벨 없이도 문장을 고를 수 있도록, 학습한 Transformer 분류 모델의 attention을 활용',
                  '후보는 마지막 층 attention과, 여러 층을 결합하는 attention rollout',
                ]),
              ],
            },
            execution: {
              title: '층별 attention을 반환하도록 고친 분류 모델',
              blocks: [
                list([
                  '기사 데이터 전처리와 분류 모델 학습을 맡아, AI Hub 기사 약 73만 건의 제목·부제·본문을 SEP로 연결하고 최대 3,584토큰 입력으로 학습',
                  '학습한 분류 모델의 TransformerEncoder가 층별 attention을 반환하도록 수정하고, 마지막 층만 쓰는 방식과 rollout이 고른 문장을 직접 읽어 비교한 뒤 rollout 채택',
                  '점수가 높은 토큰이 속한 문장을 반환하되, 본문이 과도하게 강조되지 않도록 선정 토큰은 최대 5개로 제한',
                ]),
              ],
            },
            outcome: {
              title: '분류 확률과 주요 문장을 함께 반환',
              blocks: [
                list([
                  '기사별 낚시성 라벨만으로 학습한 모델에서 분류 확률과 살펴볼 주요 문장을 함께 제공',
                ]),
              ],
            },
          },
        },
        'jamo-embedding': {
          title: '오탈자를 고려한 자모 임베딩 학습',
          steps: {
            problem: {
              title: '오탈자로 바뀐 음절과 단어 표현',
              blocks: [
                list([
                  '‘스맡폰’·‘ㅏㅣ폰’ 같은 오탈자는 음절 단위로 나누면 원래 단어와 겹치는 조각이 적어, 원래 단어와 가까운 표현을 얻기 어려움',
                ]),
              ],
            },
            approach: {
              title: '자모와 부분 문자열을 활용하는 FastText',
              blocks: [
                list([
                  '단어를 자음·모음으로 풀면 음절이 달라져도 원래 단어와 많은 조각을 공유하므로, 자모 분해와 부분 문자열 기반 FastText를 결합하는 방식 선택',
                ]),
              ],
            },
            execution: {
              title: '별도 한국어 코퍼스로 임베딩 학습',
              blocks: [
                list([
                  '자모 임베딩 학습을 맡아 별도 한국어 코퍼스를 자모 단위로 분해하고 Gensim으로 FastText 학습',
                  '학습한 임베딩을 기사 분류 모델의 입력에 사용하고, 같은 오탈자에 대해 자모 분해 전후의 최근접 단어 비교',
                ]),
              ],
            },
            outcome: {
              title: '세 가지 오탈자의 최근접 단어 비교',
              blocks: [
                list([
                  '예시로 넣은 세 오탈자 모두, 자모 분해 전에는 관련 없는 단어가 가까웠지만 분해 후에는 ‘스마트폰’·‘아이폰’·‘햄버거’ 같은 원래 단어가 상위에 나타남',
                ]),
                table({
                  columns: ['입력', '자모 분해 없이', '자모 분해 후'],
                  variant: 'comparison',
                  caption: '최근접 단어(코사인 유사도)',
                  asset: dataTables.typos,
                }),
              ],
            },
          },
        },
        serving: {
          title: 'Python 추론 서버 구현과 기사 화면 연동',
          steps: {
            problem: {
              title: '마감 직전까지 임의 확률을 표시하던 화면',
              blocks: [
                list([
                  '마감을 앞둔 11월 말, 모델 학습은 거의 끝났지만 확장 프로그램은 서버 결과 대신 임의의 확률을 표시하고 있어, Python 모델·Spring Boot 서버·확장 프로그램을 실제 응답으로 잇는 작업이 남아 있었음',
                ]),
              ],
            },
            approach: {
              title: '요청마다 다시 불러오지 않는 상주 추론 프로세스',
              blocks: [
                list([
                  '요청마다 모델을 다시 불러오지 않도록 모델을 Python 프로세스에 상주시키고, 팀원의 Spring Boot 서버가 요청 헬퍼와 Unix 소켓을 거쳐 이 프로세스를 호출하도록 연결',
                ]),
              ],
            },
            execution: {
              title: '추론 서버 개발과 추가로 맡은 화면 연동',
              blocks: [
                list([
                  'Python 추론 서버를 개발하고, 후반에는 확장 프로그램의 결과 표시·GPT 해설 연동까지 추가로 맡아 코딩 에이전트로 기존 프런트엔드를 파악하며 구현',
                ]),
                figure(assets.serviceDiagram, {
                  variant: 'wide',
                  caption: '강조: 직접 연결한 부분 · Spring Boot는 팀원 담당',
                }),
                list([
                  '같은 링크의 재분석과 중복 요청을 줄이도록 확장 프로그램에 링크별 캐시·대기열·중복 요청 방지 구현',
                  '추출 문장은 토큰을 이어 붙여 복원한 것이라 띄어쓰기가 없어, 공백을 뺀 본문과 최장 공통 부분 문자열(LCS)로 대조해 원문 위치를 찾아 강조',
                  ['팀 백엔드가 기사 본문·주요 문장을 ', code('gpt-4o-mini'), '에 전달해 생성한 해설을 낚시성 확률과 함께 기사 화면에 표시하도록 연결'],
                ]),
              ],
            },
            outcome: {
              title: '실제 분석 결과 표시와 Chrome 웹 스토어 배포',
              blocks: [
                list([
                  ['임의 확률을 표시하던 화면을 실제 서버 응답에 연결해 낚시성 확률·주요 문장 ', nowrap('강조·GPT'), ' 해설 표시를 완성하고, 팀에서 Chrome 웹 스토어에 배포'],
                ]),
                figure(assets.hover, {
                  alt: '기사 링크에 마우스를 올리면 낚시성 확률이 표시되는 화면',
                }),
                figure(assets.seeker, {
                  variant: 'screen',
                  alt: '기사 상단의 낚시성 확률·GPT 해설 배너와 본문 주요 문장 강조 표시',
                }),
              ],
            },
          },
        },
      },
    },
  },
} satisfies PortfolioContent;
