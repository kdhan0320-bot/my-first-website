# 김도한 | UX/UI · 웹퍼블리싱 포트폴리오

사용자 흐름과 정보 구조를 정리하고, Figma 설계와 React/MUI 구현으로 연결하는 신입 UX/UI 웹디자이너·웹퍼블리셔 포트폴리오입니다.

배포 주소: https://kdhan0320-bot.github.io/dohan-portfolio/my-portfolio/

---

## 목표 직무

- 신입 UX/UI 웹디자이너
- 웹퍼블리셔 (HTML·CSS 기반 화면 구현)
- 서비스기획형 프론트엔드 주니어
- AI 활용 UX/UI 포트폴리오
- B2B/업무툴 UI 구현형 주니어

---

## 판단 기준

포트폴리오 관련 판단은 아래 순서를 우선한다.

1. 채용자가 빠르게 이해하는가
2. 가독성/정렬이 명확한가
3. 사실에 기반하는가(과장·미구현 기능 없음)
4. 기능/반응형/접근성이 실제로 동작하는가
5. 개인성과 UI/UX 흐름을 반영하는가
6. 장식/모션이 위 기준을 해치지 않는가

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

- `/` — Header(고정) → Hero → About(소개·기술 스택) → Featured Projects(대표 프로젝트 3개 카드 + 전용 상세 페이지) → Selected Works(공개 플래그가 있는 항목만 표시) → Contact
- `/about` — 별도 페이지가 아니라 Home의 About 섹션으로 리다이렉트됩니다(`App.jsx`의 `<Navigate>` + `HomePage.jsx`의 `location.state.scrollTo` 재사용).
- `/projects` — Hero(작업 소개 + 실제 공개 수치를 보여주는 dark View Guide 패널) →
  Featured(대표 3개를 동일 구조 카드로 비교, 상세 라우트로 이동) → More Works(공개
  플래그가 있는 항목만, 현재 OTT Service 1개) → Footer(홈/메일 이동) 순서로 구성됩니다.
  View Guide의 FEATURED/MORE WORKS 숫자는 고정 문구가 아니라 실제 데이터에서 계산합니다.
  별도 Archive 모달은 없습니다 — 공개 판단이 끝난 프로젝트만 데이터의
  `moreWorksPublished` 플래그로 표시하고, 판단 전인 내부 초안은 공개 화면 어디에도
  노출되지 않습니다. CSS viewport 2480px 이상에서는 Featured/More Works/Footer
  여백에 QHD 01–03 section index 워터마크가 추가로 표시됩니다(`aria-hidden`,
  클릭 불가 — 2480 미만은 장식이 부분적으로 잘리는 대신 아예 숨깁니다). Featured
  카드는 900px 미만 세로 1열, 900~1199px 가로형 row 1열, 1200px 이상 3열로
  배치되고, More Works가 공개 1개일 때는 900px 이상에서 media/content 가로형
  single-feature 카드로 렌더됩니다.
- `/projects/:slug` — 대표 프로젝트(JobFlow·버스 도착정보 앱·Portfolio Feedback Hub) 전용 상세 페이지. `ProjectDetailPage.jsx` 템플릿 하나를 재사용합니다. 이 페이지는 아직 최신 Figma Detail 구조와 완전히 동기화되지 않았습니다(다음 단계는 프로젝트별 실제 자산 inventory 이후 진행).

More Works 섹션은 데이터에 공개 플래그(`moreWorksPublished: true`)가 있는 프로젝트만 렌더링하며, 공개 항목이 없으면 섹션 자체가 나타나지 않습니다(현재는 OTT Service 1개).

프로젝트 목록과 상세 정보는 `src/data/projectsFallbackData.js`를 기본 소스로 사용하고, `src/data/projectsData.js`에서 정렬·썸네일·상세 표시 구조를 조합합니다. 포트폴리오는 정적 프로젝트 데이터를 사용하며 실제 API 연동은 없습니다.

고정된 내부 경로 이동(홈으로 돌아가기, 대표 프로젝트 상세 보기, 이전/다음 프로젝트, 404의 홈/전체 프로젝트)은 모두 React Router `Link`로 구현해 실제 `<a href>`를 렌더합니다(새 탭 열기·주소 복사·기본 브라우저 동작 지원). 조건에 따라 다른 곳으로 이동하는 Detail의 "스마트 뒤로가기"만 버튼으로 유지합니다.

---

## 프로젝트 구조

```
src/
├── components/
│   ├── brand/          DMark
│   ├── layout/         Navbar, RouteEffects
│   ├── projects/       EvidenceBadges
│   ├── sections/       HeroSection, AboutSection, ProjectsSection, MoreWorksSection, ContactSection
│   └── ui/              ActionIcon, RevealOnScroll, QhdAmbientSignal(1920px+ 전용 QHD 외곽 원/선/점 장식),
│                        QhdSectionIndex(1920px+ 전용 QHD "01~04" 대형 섹션 인덱스·라벨)
├── constants/           site.js
├── data/                 projectsFallbackData.js, projectsData.js, portfolioMeta.js
├── hooks/                useInViewOnce, useScrollNav
├── pages/                HomePage, ProjectsPage, ProjectDetailPage, NotFoundPage
└── theme.js              Human Signal 디자인 토큰(HUMAN_SIGNAL) + MUI light 기반 테마(getDesignTokens) —
                         mode:'light', background/text/divider 전부 HUMAN_SIGNAL 토큰. Hero·Contact identity
                         plane·모바일 Drawer 같은 dark section은 각 컴포넌트가 명시적으로 deepHarbor/inkNavy를
                         지정해 전역 테마와 무관하게 어두운 배경을 유지한다.
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
- 장식용 요소는 `aria-hidden`/`pointer-events:none` 처리, `prefers-reduced-motion` 대응
- 390px ~ 2560px(390/430/768/820/1024/1366/1440/1920/2560 9개 기준 viewport) 반응형 확인 —
  `tools/site-audit-kit`의 `npm run audit:detailed`가 이 9개를 자동 점검한다.
