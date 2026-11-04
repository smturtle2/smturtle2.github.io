import type { ResumeContent } from './model';

export const ko = {
  title: '신동주 이력서',
  description: '신동주의 학력, 머신러닝 프로젝트 경험과 사용 기술.',
  categories: { education: '학력', projects: '프로젝트', skills: '기술' },
  education: {
    title: '동국대학교',
    period: '2020.03 ~ 2026.08 졸업',
    note: 'AI소프트웨어융합학부 멀티미디어소프트웨어공학전공',
    side: '학점 4.14 / 4.5',
  },
  projects: {
    'clear-net': {
      title: 'CLEAR-Net',
      subtitle: 'SAR·광학 위성영상 구름 제거(Sentinel-1/2)',
      linksLabel: 'CLEAR-Net 관련 자료',
      linkLabels: { model: '모델 코드', weights: '모델 가중치', training: '학습 패키지', dataset: '공개 데이터셋' },
      items: [
        { lines: ['ACA-CRNet 기반 복원 모델 설계·구현', '구름 없는 영역의 변경을 줄이도록 밴드별 마스크로 원본과 복원 영상 혼합'] },
        { lines: ['SEN12MS-CR 데이터셋 재구성·공개(389GB → 240GB)', '전체 데이터를 로컬에 보관하지 않고 학습할 수 있도록 스트리밍 로더 개발'] },
        { lines: ['팀 공용 학습·평가 패키지를 개발해 후보 모델 4종 비교에 활용', '4-GPU DDP 분산 학습, 평가 지표 계산 방식 통일'] },
        { lines: ['contextual attention을 PyTorch SDPA로 재구현해 최종 모델에 적용', '특징 분해 실험 모델 추론: VRAM 6,264MB → 724MB, 처리량 4.63 → 7.88 img/s'] },
      ],
    },
    clickbait: {
      title: 'Click-bait Seeker',
      subtitle: '낚시성 기사 분류 Chrome 확장 프로그램',
      linksLabel: 'Click-bait Seeker 관련 자료',
      linkLabels: { code: '프로젝트 코드', store: 'Chrome 웹 스토어' },
      items: [
        { lines: ['오탈자에 대응하도록 별도 한국어 코퍼스로 자모 단위 FastText 임베딩 학습', 'AI Hub 기사 약 73만 건 전처리, Transformer 분류 모델 학습'] },
        { lines: ['PyTorch Transformer 기반 분류 모델이 층별 attention을 반환하도록 수정', 'attention rollout으로 주요 문장 선정 및 기사 본문 강조'] },
        { lines: ['Python 추론 서버 개발, Spring Boot 서버와 연동', '확장 프로그램에 분류 결과·GPT 해설 표시 기능 구현'] },
      ],
    },
  },
  skills: [
    'Python · C/C++ · PyTorch · Git · Linux · Docker',
    '컴퓨터 비전 · 자연어 처리 · 분산 학습 · 대용량 데이터 처리',
  ],
} as const satisfies ResumeContent;
