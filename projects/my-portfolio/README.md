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

- `/` — Hero(Work Flow 보드), About(작업 방식 4카드), Projects(대표 프로젝트 3개 카드 + 상세 모달), Contact
- `/about` — 기본 정보, 작업 방식 소개, Skills(기술 학습 적용도 카드)
- `/projects` — 전체 프로젝트 목록(필터 탭 + 카드)

프로젝트 데이터는 `src/data/projectsFallbackData.js`를 기본 소스로 사용하며, Supabase 연결이 가능한 경우에 한해 프로젝트 목록을 추가로 조회합니다(연결 실패 시 정적 데이터로 자동 대체).

---

## 프로젝트 구조

```
src/
├── components/
│   ├── layout/        Navbar
│   ├── projects/      ProjectThumbnailArt
│   ├── sections/       HeroSection, AboutSection, ProjectsSection, ContactSection, SkillsSection
│   └── ui/             RevealOnScroll
├── context/            PortfolioContext (소개/Skills 데이터)
├── data/                projectsFallbackData.js, projectsData.js
├── hooks/               useCountUp, useInViewOnce, useScrollNav
├── lib/                 supabase.js
├── pages/               HomePage, AboutPage, ProjectsPage
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
- 375px ~ 1440px 반응형 확인
