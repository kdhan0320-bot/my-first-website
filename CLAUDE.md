# my_ai_web 장기 작업실 운영 규칙

## 목적
`my_ai_web`은 AI로 만든 웹 작품, 포트폴리오, 광고, 홈페이지, 랜딩페이지, UI 시안,
실험작, 디자인 문서, 점검 보고서를 모아두는 장기 작업실입니다.
취업용 포트폴리오뿐 아니라 다양한 성격의 작업물을 함께 관리합니다.

작업은 ChatGPT(리뷰·점검용, `tools/site-audit-kit`이 결과를 zip으로 묶어 올리는
용도), Figma(Claude/ChatGPT와 연동해 디자인 작업, `works/`에 결과물을 둠),
VS Code + Claude(코드 작업, 지금 이 환경)를 조합해서 진행합니다.

## 폴더 구조
아래 폴더 중 일부는 아직 실제로 존재하지 않을 수 있습니다. `works/`, `docs/`,
`audits/`, `_inbox/`는 필요한 시점에 승인 없이 바로 만들어 사용합니다(아래
"작업 승인 기준"의 "바로 진행 가능한 작업"에 해당). 그 외 `assets/`, `archive/`,
`_private/`를 처음 만들 때는 만들기 전에 사용자에게 알립니다.

- `projects/` — 공개 배포하거나 취업 포트폴리오에 올릴 대표 프로젝트 영역.
  `.github/workflows/deploy.yml`을 통해 실제 GitHub Pages로 배포됩니다.
- `works/` — AI 실험작, 광고, 홈페이지 초안, 랜딩페이지, Figma/Claude 결과물 영역.
  아직 대표작으로 확정되지 않은 작업물을 둡니다.
- `docs/` — 디자인 시스템, 포트폴리오 문장, 기획서, 회고, 프롬프트 정리 영역.
- `audits/` — Playwright/Claude 점검 보고서와 스크린샷 영역.
- `assets/` — 여러 프로젝트가 공유하는 공통 이미지, 아이콘, 썸네일 원본 영역.
- `tools/` — 검사 자동화, Playwright, 배포 전 점검 스크립트 영역.
- `archive/` — 더 이상 활발히 작업하지 않는 오래된 작업물을 보관하는 영역.
- `_inbox/` — 분류하기 전 파일을 임시로 모아두는 수집함. 완성작으로 취급하지 않습니다.
- `_private/` — 토큰, env 백업, 계정 정보, 비공개 자료를 보관하는 영역이며
  **Git 추적을 금지**합니다.

새로 만든 작업물을 어디에 둘지 판단할 때는 다음 기준을 따릅니다.
- 공개 배포할 완성작 → `projects/`
- 아직 실험 중이거나 공개하지 않는 작업물 → `works/`
- 분류가 애매하면 일단 `_inbox/`에 두고 나중에 정리

## 파일/폴더 정리 및 용량 관리 기준
시간이 지나면서 빌드 산출물, 임시 파일, 테스트 파일, 압축본, 스크린샷,
node_modules, dist 등이 쌓일 수 있으므로 아래 기준으로 관리합니다.

### 파일 성격 분류
- source — 실제 코드, 문서, 디자인 기준, 포트폴리오에 필요한 파일
- generated — dist, build, .vite, .cache, coverage 등 재생성 가능한 산출물
- dependency — node_modules 같은 설치 의존성
- temporary — 임시 다운로드, zip, 테스트 파일, Claude 출력물
- audit — 점검 보고서, 스크린샷, QA 결과 (`audits/`에 대응)
- private — env, token, API key, 계정 정보 (`_private/`에 대응)
- archive — 지금은 안 쓰지만 기록으로 남길 작업물 (`archive/`에 대응)

### 정리 후보로 보는 대상
`node_modules/`, `dist/`, `build/`, `.vite/`, `.cache/`, `coverage/`,
`playwright-report/`, `test-results/`, `*.tmp`, `*.log`, 임시 zip 파일,
사용처가 확인되지 않은 중복/백업 폴더.

### 삭제 전 필수 확인
아래를 모두 확인하기 전에는 삭제를 제안하지 않습니다.
- git status 및 git 추적 여부
- 코드 import/reference 검색
- package.json scripts 참조 여부
- `.github/workflows/deploy.yml` 등 배포 workflow 참조 여부
- README/docs에서의 참조 여부
- 다시 생성 가능한지 여부
- 삭제 후 필요하면 build로 검증

### 절대 보호 항목 (삭제·이동 안 함, 내용 출력도 안 함)
`.git`, `.github`, `.env`, `.env.local`, `_private/` 전체.

### 삭제·이동 전 승인이 필요한 항목
`src/`, `public/`, `package.json`, `vite.config.js`, `index.html`,
`README.md`, `CLAUDE.md`, `.github/workflows/`, Supabase 관련 설정,
프로젝트 썸네일·포트폴리오 이미지·문서 자료. `projects/` 하위 배포 관련
파일은 아래 "projects/ — 배포 대상 규칙"을 그대로 따릅니다.

### 정리 방식
- 확실한 generated/dependency 파일 → "삭제 후보"로 분류 가능
- 애매한 파일 → 삭제하지 않고 "보류"로 분류
- 보관 가치가 있는 작업물 → `archive/`로 이동 후보
- 분류 전 임시 자료 → `_inbox/`로 이동 후보
- private 성격 자료 → `_private/`로 이동 후보
- 실제 삭제·이동은 아래 "작업 승인 기준"에 따라 사용자 승인 후에만 진행합니다.

### 정기 점검 시점
- 큰 작업이 끝난 뒤 한 번 정리 감사
- 배포 성공 후 dist/node_modules/임시 파일 점검
- zip으로 공유하기 전 node_modules/.git/dist 등 제외 여부 점검
- 매번 바로 삭제하지 않고 "유지 / 삭제 / 이동 / 보류"로 먼저 분류합니다.

## projects/ — 배포 대상 규칙
- `projects/` 하위에 어떤 프로젝트가 있는지는 이 문서에 이름을 고정해 적어두지
  않습니다. 실제 폴더 구조와 `.github/workflows/deploy.yml`의 빌드 대상을
  기준으로 그때그때 판단합니다.
- 각 프로젝트의 `package.json`, `vite.config.js`, `index.html`, `src/`, `public/`는
  배포에 직결되므로, 삭제·이동·이름 변경 전에는 반드시 참조 여부를 확인하고
  사용자 승인을 받습니다.
- 프로젝트를 `projects/`에서 빼거나 `archive/`로 옮길 때는 `deploy.yml`,
  포트폴리오 카드 데이터, GitHub 소스 링크에 미치는 영향을 먼저 분석해서 보고합니다.

## 승인 필수 항목 (임의로 변경하지 않음)
아래는 이름은 "금지"지만 실제로는 "매번 승인 필요"입니다 — 조사·진단·읽기는
자유롭게 하되, 실제 변경은 항상 사용자 승인을 먼저 받습니다.
- Supabase 프로젝트/테이블/Storage/Auth 사용자/API 키 삭제 또는 재발급
- GitHub Secrets 삭제 또는 수정
- GitHub Actions workflow의 트리거, 권한, environment 설정 변경
- 배포 설정(base 경로, Pages 소스 등) 변경

## 보안 규칙
- `.env`, `.env.local`, `_private/`의 내용은 절대 출력하지 않습니다. 존재 여부와
  git 추적 여부만 확인해서 보고합니다.
- Supabase 키, API 키, 토큰, 비밀번호는 절대 노출하지 않습니다. 필요하면 이름만
  표시하고 값은 마스킹하거나 "값 비공개"로 표시합니다.

## 작업 승인 기준
**바로 진행 가능한 작업**
- `works/`, `docs/`, `audits/`, `_inbox/` 안에서 새 파일을 만들거나 초안을
  작성하고 다듬는 작업
- `projects/`, `.github/`, GitHub Secrets, Supabase에 영향이 없는 조사·진단·
  보고서 작성

**계획을 먼저 제시하고 승인받은 뒤 진행하는 작업**
- `projects/` 하위 코드나 설정 수정
- 파일·폴더 삭제, 이동, 이름 변경
- git commit, push, PR 생성, merge
- `.github/workflows/*`, GitHub Secrets, Supabase, package(의존성) 관련 변경

## 프로젝트·폴더별 세부 규칙 우선순위
각 프로젝트나 폴더에 자체 `CLAUDE.md` 또는 `README.md`가 있으면, 그 규칙을 이
루트 문서보다 우선해서 따릅니다(예: `projects/my-portfolio/CLAUDE.md`).

## CLAUDE.md 관리 원칙
CLAUDE.md는 매 세션에 필요한 핵심 작업 규칙만 담습니다. 작업 이력, 회차별
기록, 과거 대화 로그는 넣지 않고, 세부 디자인 스펙·색상 hex·px·초 단위
모션값은 각 프로젝트의 `docs/` 문서로 분리합니다. 보안/GitHub/Supabase/
commit·push 승인 규칙은 이 루트 문서에서만 관리하며, 하위 CLAUDE.md에서
반복하지 않습니다. 같은 의미의 금지 규칙을 여러 곳에 중복해서 적지
않습니다.

새 규칙을 추가하기 전에는 "앞으로도 반복적으로 필요한 규칙인가",
"Claude가 실제로 두 번 이상 같은 실수를 했는가", "README/docs/audits가
아니라 CLAUDE.md에 있어야만 하는가"를 확인하고, 통과하지 못하면 README,
docs, audits, design-reference, archive 문서로 분리합니다.

분량 목표: 루트 CLAUDE.md는 150~200줄 이하, 프로젝트별 CLAUDE.md는
80~160줄 이하를 유지합니다. 큰 작업이 끝난 뒤 CLAUDE.md가 길어졌다면
"유지/삭제/문서 이동/보류" 기준으로 정리 감사를 진행합니다.

## 취업용 포트폴리오 표현 기준
`projects/` 안의 취업용 포트폴리오 관련 작업물에는 아래 표현 기준을 유지합니다.
- 거짓말, 과장, 검증되지 않은 성과 수치를 쓰지 않습니다.
- 실제 API 연동이 없으면 "데모", "프로토타입", "예시 데이터 기반"으로 표시합니다.
- AI 활용 사실을 숨기거나 축소하지 않습니다. "AI를 썼다/안 썼다"보다
  "AI를 어떻게 방향 짓고 무엇을 직접 검증·수정했는가"(설계 판단, 아키텍처
  선택 이유, 버그 수정, AI 결과물을 반려·수정한 사례)를 구체적으로 드러내는
  쪽을 우선합니다(2026년 채용 트렌드 기준 근거, 문구 예시는 각 프로젝트
  CLAUDE.md/README를 따름).

## 작업 보고 형식
작업 후 상황에 맞게 짧고 실무적으로 보고합니다.
1. 무엇을 했는지 (생성/수정/삭제/조사)
2. 영향받은 파일·폴더
3. 위험 요소 또는 승인이 필요한 다음 단계
4. 변경이 있었다면 git status 요약

## 언어 설정
- 모든 답변과 보고는 한국어로 작성합니다.
- 정중하고 친근한 말투를 사용합니다.
- 기술적인 내용은 쉽게 설명합니다.
