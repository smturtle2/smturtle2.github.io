# smturtle2.github.io

신동주의 개인 홈페이지입니다.
Astro 정적 출력과 TypeScript, CSS를 사용합니다.

## 개발

Node.js 24와 npm을 사용합니다.

```sh
npm ci
npm run dev
```

## 빌드와 미리보기

```sh
npm run build
npm run preview
```

빌드는 타입 검사 후 `dist/`에 정적 파일을 생성합니다.
현재 구현 범위는 한국어·영어 홈 화면입니다.
`/`에서는 저장된 언어 선택을 우선 적용하고, 선택이 없으면 브라우저 기본 언어가 한국어일 때 `/ko/`, 그 외에는 `/en/`으로 이동합니다.
`/ko/`와 `/en/`으로 직접 방문하면 해당 언어를 유지합니다.
KO·EN 링크로 고른 언어는 같은 브라우저에 저장되며, 저장소 접근이 차단되어도 링크 이동은 가능합니다.
언어 판별에 위치 정보나 외부 API를 사용하지 않습니다.

`/ko/resume/`, `/en/resume/`, `/ko/portfolio/`, `/en/portfolio/`는 후속 문서 페이지의 경로입니다.
현재는 홈 화면을 먼저 공개하며, 이력서와 포트폴리오 본문은 아직 구현하지 않았습니다.

## 배포

사이트 주소: https://smturtle2.github.io/

`main`에 푸시하면 GitHub Actions가 의존성을 설치하고 타입 검사·정적 빌드 후 GitHub Pages에 배포합니다.
생성된 `dist/`는 커밋하지 않습니다.
