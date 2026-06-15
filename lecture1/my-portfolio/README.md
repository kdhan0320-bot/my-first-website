# 김도한 | UX/UI 기반 웹디자인 포트폴리오

사용자 흐름을 정리하고 실제 작동하는 웹서비스 화면으로 구현하는 것을 목표로 제작한 UX/UI 기반 웹디자인 포트폴리오입니다.

배포 주소: https://kdhan0320-bot.github.io/my-first-website/my-portfolio/

---

## 목표 직무

- UX/UI 기반 웹디자이너
- 웹퍼블리셔 (HTML·CSS 기반 화면 구현)
- React 기반 웹서비스 화면 구현

---

## 주요 기술

| 분류 | 기술 |
|------|------|
| Frontend | HTML, CSS, JavaScript |
| Framework | React 18, MUI (Material UI v9) |
| Design | Figma |
| Backend / DB | Supabase |
| Tool | GitHub, GitHub Pages |
| Workflow | AI Tools (Claude, ChatGPT) |

---

## 주요 기능

- **다크모드 / 라이트모드 토글** — localStorage 저장, 시스템 테마 자동 감지, 깜빡임 방지
- **스크롤 기반 네비게이션** — 현재 섹션 자동 감지 및 헤더 하이라이트
- **스크롤 등장 애니메이션** — IntersectionObserver 기반 1회 실행, prefers-reduced-motion 대응
- **방명록 (Guestbook)** — Supabase CRUD, 이모지 / 별점 / 키워드, 편집·삭제 토큰 인증
- **프로젝트 목록** — Supabase 실시간 조회, 스켈레톤 로딩, 배포·GitHub 링크 연결
- **반응형 레이아웃** — 360px ~ 1440px 전 구간 대응, 모바일 Drawer 메뉴
- **읽기 진행률 바** — 스크롤 위치 기반 Navbar 상단 표시

---

## 프로젝트 구조

```
src/
├── components/
│   ├── common/       CustomCursor, MorphingKeyword, RevealOnScroll, ThemeToggle
│   ├── guestbook/    GuestbookCard, GuestbookForm
│   ├── layout/       Navbar
│   └── sections/     HeroSection, AboutSection, SkillTreeSection, ProjectsSection, ContactSection
├── context/          PortfolioContext, ThemeModeContext
├── hooks/            useCountUp, useInViewOnce, useScrollNav
├── lib/              supabase, guestbookTokens
├── pages/            HomePage, AboutPage, ProjectsPage
└── theme.js          MUI 라이트/다크 테마 토큰 정의
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

# GitHub Pages 배포
npx gh-pages -d dist --dest my-portfolio -r https://github.com/kdhan0320-bot/my-first-website.git -b gh-pages
```

---

## 개선 예정

- 프로젝트 상세 케이스스터디 페이지 추가
- 이력서 PDF 다운로드 링크 연결
- Open Graph 이미지 설정
- 기업 홈페이지 리뉴얼 프로젝트 추가

---

## 기술 스택 상세

- **React 18** + **Vite 5** — 컴포넌트 기반 화면 구성 및 빠른 빌드
- **MUI v9** — 디자인 시스템 기반 UI 컴포넌트 및 테마 토큰
- **React Router v7** — HashRouter 기반 SPA 라우팅 (GitHub Pages 호환)
- **Supabase** — 프로젝트·방명록 데이터 실시간 조회 및 CRUD
- **GitHub Actions** — Supabase 연결 유지 자동화 (Keep Alive)
