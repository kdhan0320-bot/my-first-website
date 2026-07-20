# my_ai_web

AI 활용 UX/UI·웹퍼블리싱 작업을 장기간 관리하는 개인 작업실 저장소입니다.

## 목적

이 저장소는 취업용 포트폴리오만을 위한 폴더가 아니라, 다음 작업을 함께
관리하는 장기 AI/UX/UI 작업실입니다.

- AI 활용 UX/UI 프로젝트
- 웹디자인·웹퍼블리싱 작업
- 서비스기획형 프론트엔드 프로젝트
- Figma 디자인과 프로토타입
- 개인 웹 작품과 실험작
- 광고·랜딩페이지·홈페이지 시안
- 취업용 웹 포트폴리오
- 프로젝트 기획·디자인·회고 문서
- 사이트 검사·접근성·반응형 QA 도구

취업용 웹 포트폴리오(`projects/my-portfolio`)는 이 작업실에서 관리하는
여러 프로젝트 중 하나이며, 저장소 전체를 대표하지 않습니다.

## 공개 프로젝트

| 프로젝트 | 배포 주소 |
|---|---|
| my-portfolio | https://kdhan0320-bot.github.io/dohan-portfolio/my-portfolio/ |
| jobflow-dashboard | https://kdhan0320-bot.github.io/dohan-portfolio/jobflow-dashboard/ |
| my-community | https://kdhan0320-bot.github.io/dohan-portfolio/my-community/ |
| mini_sns | https://kdhan0320-bot.github.io/dohan-portfolio/mini-sns/ |
| OTT Service | https://kdhan0320-bot.github.io/dohan-portfolio/ott-service/ |

## 프로젝트별 데이터·연동 방식

**my-portfolio** — 취업용 웹 포트폴리오. 정적 프로젝트 데이터를 사용하며,
실제 API 연동은 없습니다.

**jobflow-dashboard** — Supabase Auth + PostgreSQL 실제 연동. 게스트
모드에서는 샘플 데이터로 주요 화면을 체험할 수 있습니다.

**my-community** — Supabase Auth + PostgreSQL 실제 연동. 테스트 계정으로
로그인하거나, 게스트 모드로 로그인 없이 주요 화면을 확인할 수 있습니다.

**mini_sns** — mock 데이터와 브라우저 메모리 상태로 동작합니다. 실제
백엔드는 없으며, 새로고침하면 초기 데이터로 복원됩니다.

**OTT Service** — 정적 HTML/CSS/JavaScript로 만든 UI 데모입니다. 실제
API·로그인·결제·스트리밍 기능은 없습니다.

## 폴더 구조

- `.github/` — GitHub Actions와 GitHub Pages 배포 workflow
- `projects/` — 공개 배포하거나 공개 프로젝트로 관리하는 작업
  (`.github/workflows/deploy.yml`을 통해 GitHub Pages로 배포)
- `works/` — 아직 대표작으로 확정되지 않은 실험작·시안
- `docs/` — 디자인 시스템, 기획서, 회고, AI 협업 문서
- `audits/` — Playwright·Claude 검사 과정에서 생성되는 로컬 보고서, 스크린샷,
  ZIP 산출물 영역. 대용량·회차별 산출물은 기본적으로 Git 추적에서 제외하고,
  장기 보관 가치가 있는 결론·기준만 선별해 `docs/`의 작은 Markdown 문서로 정리
- `supabase/` — 실제 Supabase 연동 프로젝트의 로컬 설정과 migration
  (`.temp/`, `.branches/` 같은 CLI 내부 상태는 Git 추적 제외)
- `tools/` — 검사 자동화 스크립트 (`tools/site-audit-kit` 등)
- `_private/` — 토큰·계정 정보 등 비공개 자료 (Git 추적 제외)

일부 작업 영역은 필요해지는 시점에 생성하며, 빈 폴더를 미리 만들지 않습니다.

## 로컬 실행 방법

각 프로젝트 폴더에서 다음을 실행합니다.

```bash
npm install
npm run dev
npm run build
```

`OTT Service`는 정적 페이지이므로 별도 설치 없이 `index.html`을 열어
확인합니다.

## GitHub Actions 배포

`main` 브랜치에 push하면 `.github/workflows/deploy.yml`이 각 프로젝트를
빌드해 GitHub Pages(`_site/`)로 배포합니다. Supabase를 사용하는
프로젝트(my-community, jobflow-dashboard)는 빌드 시 저장소 Secrets 값을
환경변수로 주입받습니다.

## AI 협업 방식

이 저장소는 ChatGPT, Figma, VS Code + Claude를 함께 사용해 관리합니다.
세부 역할 분담은 `CLAUDE.md`의 "AI 협업 역할 분담" 섹션과
`docs/ai-workflow/AI_COLLABORATION_PROTOCOL.md`를 따릅니다.

## 비공개 파일과 환경변수 관리

`.env`, `.env.local`, `_private/`는 Git 추적에서 제외됩니다. Supabase
연동 프로젝트는 `.env.example`을 참고해 로컬 `.env`를 구성하고, 실제 키
값은 저장소에 커밋하지 않습니다.
