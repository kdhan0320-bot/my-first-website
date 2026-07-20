# 김도한 | UX/UI · 웹퍼블리싱 포트폴리오

사용자 흐름과 정보 구조를 정리하고, Figma 설계와 React/MUI 구현으로 연결하는 신입 UX/UI 웹디자이너·웹퍼블리셔 포트폴리오입니다.

배포 주소: https://kdhan0320-bot.github.io/dohan-portfolio/my-portfolio/

---

## 목표 직무

- 신입 UX/UI 웹디자이너
- 웹퍼블리셔 (HTML·CSS 기반 화면 구현)
- 서비스기획형 프론트엔드 주니어

---

## 주요 기술

| 분류 | 기술 |
|------|------|
| Frontend | HTML, CSS, JavaScript |
| Framework | React 18, MUI (Material UI v9) |
| Design | Figma |
| Routing | React Router v7 |
| Tool | GitHub, GitHub Pages, GitHub Actions |
| Workflow | AI 도구(Claude 등)를 문장 정리·코드 점검·개선안 비교에 보조적으로 활용 |

---

## 페이지 구조

- `/` — Header(고정) → Hero → About(About Snapshot 1개 섹션) → Selected Projects(대표 프로젝트 3개 카드 + 전용 상세 페이지) → More Works(공개 플래그가 있는 항목만 표시) → Contact
- `/about` — 별도 페이지가 아니라 Home의 About 섹션으로 리다이렉트됩니다(`App.jsx`의 `<Navigate>` + `HomePage.jsx`의 `location.state.scrollTo` 재사용).
- `/projects` — Featured 3개(Home과 동일 대표 프로젝트, 카드형, 상세 라우트로 이동)와 Archive 목록(기존 모달)으로 구성됩니다. Archive 프로젝트는 같은 목록 안에서 모달로 상세 내용을 확인합니다.
- `/projects/:slug` — 대표 프로젝트(JobFlow·버스 도착정보 앱·Portfolio Feedback Hub) 전용 상세 페이지. `ProjectDetailPage.jsx` 템플릿 하나를 재사용합니다.

More Works 섹션은 데이터에 공개 플래그(`moreWorksPublished: true`)가 있는 프로젝트만 렌더링하며, 공개 항목이 없으면 섹션 자체가 나타나지 않습니다(현재는 OTT Service 1개).

프로젝트 목록과 상세 정보는 `src/data/projectsFallbackData.js`를 기본 소스로 사용하고, `src/data/projectsData.js`에서 정렬·썸네일·상세 표시 구조를 조합합니다. 포트폴리오는 정적 프로젝트 데이터를 사용하며 실제 API 연동은 없습니다.

---

## 프로젝트 구조

```
src/
├── components/
│   ├── layout/        Navbar
│   ├── projects/      EvidenceBadges
│   ├── sections/       HeroSection, AboutSection, ProjectsSection, MoreWorksSection, ContactSection
│   └── ui/             RevealOnScroll
├── data/                projectsFallbackData.js, projectsData.js
├── hooks/               useInViewOnce, useScrollNav
├── pages/               HomePage, ProjectsPage, ProjectDetailPage
└── theme.js             MUI 다크 테마 토큰 정의
```

---

## 실행 방법

```bash
# 의존성 설치
npm install

# 개발 서버 실행 (http://localhost:5173)
npm run dev

# 프로덕션 빌드
npm run build
```

배포는 저장소 루트의 GitHub Actions 워크플로(`.github/workflows/deploy.yml`)가 `main` 브랜치 push 시 자동으로 빌드해 GitHub Pages에 반영합니다.

---

## 접근성 / 반응형

- heading 계층(h1 → h2 → h3) 유지
- 터치 영역 44px 이상, 모바일 본문 14px 이상, line-height 1.6 이상
- 장식용 SVG는 `aria-hidden`/`focusable="false"` 처리, `prefers-reduced-motion` 대응
- 375px ~ 2560px 반응형 확인
