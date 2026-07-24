# Human Signal — 디자인 참고 문서

이 문서는 `projects/my-portfolio/README.md`의 디자인 방향을 구현 수준까지
풀어놓은 참고 자료다. 복제용 스펙이 아니라 판단 기준이며, Figma 파일
`53Ppn2hIgrvs9Jra3eejFs`를 1차 소스로 삼아 정리했다. 세부 수치(hex, px, 초)는
Figma 원본이 우선하고, 이 문서는 그 수치를 코드에 어떻게 적용했는지 설명한다.

이전 디자인 시스템(Ordered Signal, 큰 한글 타이포 + 신호점/신호선 모티프)은
사용자 승인 아래 Human Signal로 교체됐다. Header/Navigation/모바일 메뉴/404/
D2 로고/전역 토큰에 이어, Hero/About/Featured Projects/Selected Works/
Contact 5개 Home 섹션·QHD 전용 장식(Ambient Signal, Section Index)까지
Phase 4F로 완료 후보다 — 검증된 회귀(자동 검사 실패/실제 PNG 회귀/깨진
링크/접근성 결함/최신 승인 Figma와 명백한 불일치)가 없으면 다시 미세
조정하지 않는다.

`/projects`·`/projects/:slug`(`ProjectsPage.jsx`/`ProjectDetailPage.jsx`)도
이미 Human Signal `HUMAN_SIGNAL` 토큰으로 구현돼 있다 — 다음 작업은 최신
Figma의 해당 Page를 다시 찾아 실제 코드와의 차이(delta)만 확인하는 단계다.

`theme.js`의 옛 Ordered Signal `COLORS` 팔레트(MUI `palette.mode:'dark'`
기반)는 Phase 4F에서 완전히 삭제했다 — 저장소 전체에서 참조가 0건이 된
뒤 지웠다(직접 사용처가 없었고, MUI 기본 팔레트를 통해서만 간접 참조되고
있었다). `getDesignTokens()`는 이제 `mode:'light'` + `HUMAN_SIGNAL` 토큰
기반이다(아래 "전역 MUI 테마" 참고).

## 콘셉트

"HUMAN SIGNAL": Field(현장) → Structure(구조) → Build(구현) → Verify(검증)로
이어지는 작업 방식을 "정리 · 연결 · 검증" 태그라인과 D2 로고, 세이지/오렌지
신호 포인트로 보여주는 포트폴리오. Ordered Signal의 어두운 단일 톤 대신
Warm Paper(밝은 종이 질감 배경)와 Ink Navy/Deep Harbor(어두운 섹션)가
번갈아 나오는 2톤 구성이다.

## 색상 시스템

Figma에는 Variables가 바인딩돼 있지 않아(`get_variable_defs` 빈 값) 아래
값은 Phase 4A에서 Foundations(447:2), Navigation States(220:7), Home
Desktop 1440(254:3) 프레임을 다시 조회해 확인한 hex다. `src/theme.js`의
`HUMAN_SIGNAL` 객체와 1:1로 대응한다.

| 이름 | Hex | 용도 | 확인 근거 |
|---|---|---|---|
| Ink Navy | `#0C1420` | 기본 다크 텍스트, D2 onLight primary | Header 텍스트, D2, 404 텍스트 |
| Deep Harbor | `#172432` | 보조 다크 표면(카드/섹션 배경) | Hero 배경·Signal Stage 카드, Contact identity plane, 모바일 메뉴 배경 |
| Warm Paper | `#F2EDE3` | 카드형 "종이" 표면(섹션 배경 아님) | About Origin 카드·Skill Matrix 패널, Projects/404 배경 |
| Paper Deep | `#E2D9CC` | 밝은 배경 위 보더/디바이더 | Header 보더, 404 헤더/푸터 라인, Skill Card 보더 |
| Soft White | `#FFFDF8` | 밝은 섹션 배경, 카드/버튼 배경 | About 섹션 배경, Header 카드, Skill Card 배경, 404 CTA |
| Ink text | `#27313B` | 밝은 배경 위 보조 텍스트(본문) | Hero 서브카피, Skill Card purpose |
| Burnt Orange | `#A84325` | **밝은 배경(Warm Paper/Soft White) 위 작은 텍스트·기호**, focus-visible 링 색 | Foundations LIGHT META, Hero eyebrow, About eyebrow, Header hover, 404 eyebrow/REQUEST |
| Bright Orange | `#D85C32` | 큰 강조 텍스트, 비텍스트 장식(밑줄 인디케이터 등) — 배경과 무관하게 사용 가능 | Nav active 밑줄(220:54), Foundations Brand Signal, Skill Card 03 accent |
| Bright Orange on Dark | `#EC6B3D` | **어두운 배경(Deep Harbor/Ink Navy) 위 작은 텍스트·기호** | 모바일 메뉴 NAVIGATION/active 번호, 404 primary 버튼 아이콘, Contact 라벨 |
| Muted Sage | `#90A58B` | 포인트 세이지(도트/비활성 번호) | Foundations MUTED SAGE, 모바일 메뉴 비활성 번호, Skill Card 01 accent |
| Steel Mist | `#AAB7C4` | 다크 배경 위 보조 텍스트/디바이더 베이스 | 모바일 메뉴 설명/상태 텍스트, Skill Card 02 accent |
| Deep Sage | `#496149` | **밝은 배경 위 비활성(disabled) 텍스트** | Header `PORTFOLIO PDF` 비활성 라벨(220:22) — Phase 4A에서 처음 solid fill로 확인, 이전 회차 `[확인 필요]` 해소 |
| Muted Ink | `#59636E` | 밝은 배경 위 회색 계열 보조 본문(steelMist보다 어둡고 inkText보다 옅음) | Foundations 설명 문단(447:6/447:20), Skill Matrix intro body, Featured/Selected 섹션 설명 |

**사용 규칙 (Figma 접근성 점검 기준)**
- 작은 텍스트·기호는 배경에 따라 색을 나눠 쓴다: Warm Paper/Soft White(밝은
  배경) 위에는 `burntOrange(#A84325)`, Deep Harbor/Ink Navy(어두운 배경)
  위에는 `brightOrangeOnDark(#EC6B3D)`를 쓴다. `brightOrange(#D85C32)`를
  작은 텍스트에 쓰지 않는다 — Figma 활성 페이지 대비 점검에서 두 배경 모두
  `#D85C32` 작은 텍스트가 규칙 위반으로 확인됐다.
- `brightOrange(#D85C32)`는 큰 강조 텍스트와 비텍스트 장식(active 밑줄
  인디케이터 등)에는 배경과 무관하게 그대로 쓸 수 있다.
- focus-visible 링은 Bright Orange가 아니라 **Burnt Orange** 2px다(hover와
  구분되는 색).

## 전역 MUI 테마 (`getDesignTokens()`, Phase 4F)

이 저장소의 모든 화면은 각 컴포넌트가 `HUMAN_SIGNAL.*` 토큰을 직접 `sx`로
지정한다(dark section도 명시적으로 deepHarbor/inkNavy를 쓴다) — 그래서
MUI 기본 팔레트는 실제 화면에 거의 드러나지 않지만, `sx`로 색을 지정하지
않는 MUI 기본 컴포넌트(CssBaseline 기본 배경, 향후 추가될 Dialog/
TextField 등)가 상속하는 기본값 역할을 한다.

- `palette.mode: 'light'`, `background.default: warmPaper`,
  `background.paper: softWhite`, `text.primary: inkNavy`,
  `text.secondary: inkText`, `divider: paperDeep`.
- `primary.main: burntOrange`(밝은 배경 위 작은 텍스트에 안전한 대비 —
  brightOrange를 기본 primary로 쓰지 않는다), `secondary.main: inkNavy`.
  실제 사용처는 `MuiTextField`의 focus 보더가 유일하다(앱 안에 TextField
  자체가 아직 없음).
- `MuiTooltip`은 배경과 무관하게 어두운 chip으로 띄우는 패턴을 유지하되
  색은 `deepHarbor`/`softWhite`로 바꿨다(실제 `<Tooltip>` 사용처는 아직
  없음, rg 결과 0건).
- `:root { color-scheme: light }`(`index.css`) — 네이티브 form 요소가
  없어(rg 결과 0건) dark section 안에 별도 `color-scheme: dark`를 걸
  대상도 없다.

## 타이포그래피

- **SUIT Variable** — 한글 제목/본문(`@sun-typeface/suit`, SIL OFL-1.1,
  npm 패키지에서 variable WOFF2 1개만 `main.jsx`가 import). `theme.js`의
  `FONT_SANS`. Foundations(447:2)의 Type 패널은 참고용으로 Noto Sans KR을
  쓰지만, 실제 코드 폰트는 SUIT Variable을 기준으로 검증한다(Foundations
  Rules 447:52 "Note"에도 동일하게 명시돼 있다).
- **IBM Plex Mono** — 라벨/번호/메타데이터. `theme.js`의 `FONT_MONO`.
  Google Fonts CDN(`index.html`)으로 로딩한다.
- `index.html`이 예전에 함께 로딩하던 IBM Plex Sans KR CDN은 실제로 어느
  컴포넌트도 참조하지 않아 Phase 4A에서 제거했다(IBM Plex Mono는 유지).

## 레이아웃/구조

- **Header**: `Navbar.jsx`. Ordered Signal의 hide-on-scroll을 없애고 Top /
  Sticky Compact 두 상태만 오간다(항상 화면에 남는다). 배경은 항상
  Warm Paper 계열 불투명 채움이다 — Header가 `/projects`처럼 아직 어두운
  Ordered Signal 배경 위에 뜨는 라우트도 있어, Hero처럼 투명하게 비우면
  다크 배경에서 Ink Navy 텍스트가 거의 안 보인다(대비 문제라 투명 대신
  항상 불투명 배경을 쓰기로 판단). Top 상태는 이름+역할(UX/UI · WEB
  PUBLISHING)을 함께 보여주고, Sticky Compact는 역할 텍스트를 숨기고
  높이를 살짝 줄인다.
- **로고**: `components/brand/DMark.jsx`(D2) + `DOHAN KIM` + `UX/UI · WEB
  PUBLISHING`. Figma 노드 `220:12`(D Mark / 밝은 Header)의 실제 vector 4개
  (왼쪽 세로 Primary shape, D ring Primary shape, Sage lower shape, Orange
  point)를 좌표 그대로 옮겨 구현했다. 배경 배지나 둥근 사각형 없이 SVG
  배경은 투명하고, 밝은/어두운 배경에서 형태·비율은 완전히 동일하며 primary
  색만 바뀐다(사용자 승인 B안): `onLight`는 Ink Navy + Muted Sage + Bright
  Orange, `onDark`는 Soft White + Muted Sage + Bright Orange. `onDark`는
  Figma `105:53`/`221:30`에도 반영돼 있다.
- **Desktop 메뉴**: PROJECTS / PORTFOLIO PDF(SOON, 비활성) / GITHUB / MAIL,
  각 44px 이상 hit area. About 메뉴 항목은 없다 — Home이 one-page 구조라
  About는 스크롤로 자연스럽게 보이고, Hero의 "기술 역량 보기" CTA가 같은
  이동을 제공한다(`id="about"` 섹션과 `/about` redirect는 유지). PROJECTS는
  Home에서 스크롤 위치 기반 scrollspy로, `/projects`·`/projects/:slug`에서는
  라우트 기준으로 active. GitHub/Mail은 active 처리하지 않는다. PORTFOLIO
  PDF는 실제 파일이 생기기 전까지 `button`/`a`가 아닌 `role="group"
  aria-disabled="true"` 비인터랙티브 그룹이며 tab 순서에서 제외된다
  (Implementation Notes 220:94 "ORDER": Skip link → Logo → Projects →
  GitHub → Mail, PDF는 순서에 없음). 라벨 색은 밝은 배경 위 비활성 텍스트라
  Deep Sage(`#496149`), SOON 배지는 Deep Harbor 배경 + Steel Mist 텍스트.
  Active/hover 밑줄은 24px/12px Bright Orange(비텍스트 장식이라 배경 무관하게
  사용). hover 시 글자색은 Warm Paper 위 작은 텍스트라 Burnt Orange로
  바뀐다(active 기본 글자색은 Ink Navy 유지).
- **모바일 메뉴**: MUI Drawer(전체 화면), 배경 Deep Harbor. 순서 01
  PROJECTS(전체 작업) / 02 PORTFOLIO PDF(준비 중 · 비활성, 클릭·포커스
  대상 아님) / 03 GITHUB(코드 보기 ↗) — Mail은 목록 대신 하단 CTA로만
  제공한다(목록에 함께 두면 390px에서 두 요소가 맞닿아 중복으로 보였다,
  실측 확인). 항목 번호는 active가 Bright Orange on Dark, 비활성은 Muted
  Sage, PDF 라벨/설명은 각각 `#788593`/`#8E9AA6`(Figma Mobile Open
  221:48/221:49 실측값, 다크 배경 전용 비활성 톤이라 별도 토큰화하지
  않음). Drawer 상단 역할 문구는 Header 닫힌 상태와 달리 "HUMAN SIGNAL"로
  표기한다(221:36). NAVIGATION 라벨은 Deep Harbor 위 작은 텍스트라 Bright
  Orange on Dark. 하단 Mail CTA(Soft White 배경, ↗는 Burnt Orange)와 Open
  to Work 상태, 닫기 힌트. 닫힌 뒤 메뉴 버튼으로 focus가 돌아간다(최초
  진입에서는 자동 focus 없음). reduced-motion에서는 Drawer 슬라이드 대신
  즉시 opacity 전환(Fade, duration 0)을 쓴다.
- **404**: `pages/NotFoundPage.jsx`. Desktop/Mobile을 한 반응형 컴포넌트로
  구현했다. 복구 행동은 홈 / 전체 프로젝트 두 가지뿐이고, 비공개·draft
  slug가 있다는 사실을 암시하는 문구는 넣지 않았다. 요청 경로를 그대로
  보여주는 REQUEST 박스가 있다. eyebrow/REQUEST 라벨과 Soft White 보조
  버튼 화살표는 밝은 배경 위 작은 텍스트라 Burnt Orange, Ink Navy primary
  버튼 안 화살표는 어두운 배경 위라 Bright Orange on Dark를 쓴다.
- **Action icon 규칙(Phase 3C, `components/ui/ActionIcon.jsx`)**: 문자
  화살표(`→`/`↗`/`←`)를 전부 MUI 아이콘 컴포넌트로 교체했다 — `internal`
  (`ArrowForwardRounded`, 내부 스크롤·라우트 이동·메일 전송, 뒤로가기는
  180도 회전해 재사용), `external`(`NorthEastRounded`, GitHub 등 외부
  사이트 새 탭), `download`(`DownloadRounded`, PDF 포트폴리오). 프로젝트
  진행 과정을 설명하는 `projectsFallbackData.js`의 `process` 필드 문자열은
  UI 내비게이션이 아닌 사실 데이터라 이 규칙 대상이 아니다(문자 그대로 유지).
- **Ultra-wide(2560)**: Phase 4A에서 QHD 2560 프레임(347:383)을 직접
  재측정한 결과, "Content Master" 프레임이 2560 캔버스 안에서도 1440
  Desktop과 동일한 1440px 폭(내부 콘텐츠 1312px)으로 중앙에 고정되고,
  그 바깥 여백에는 별도의 저대비 "Ambient Signal" 장식만 확장되는
  구조였다 — 1440 레이아웃의 단순 확대가 아니라는 원래 원칙은 맞지만,
  이전 회차가 썼던 1680/2080/1960px 상수는 옛 QHD 프레임 기준이라 폐기했다.
  `theme.js`의 `ULTRAWIDE_CONTENT_MAX_WIDTH`(1312) / `HOME_WIDE_MAX_WIDTH`
  (1440, Container 자체 CSS max-width) / `HOME_PROJECT_MAX_WIDTH`(1312)로
  갱신했다. Header/Hero/About/Featured/Selected/Contact 전부 이 상수로
  콘텐츠 폭을 고정한다 — Contact의 좌 32%/우 68% 2-plane 분할도 1440까지는
  100vw 풀블리드, 1920+에서는 `HOME_WIDE_MAX_WIDTH`(1440) shell로 캡핑된다
  (Phase 4B에서 구현). QHD Ambient Signal 장식(`QhdAmbientSignal.jsx`)은
  Hero(432:303)·About(432:313)·Featured(432:323)·Selected(432:333)·
  Contact(442:166) 5곳 전부 구현됐다 — Figma direct node ID 실측 픽셀
  좌표 + `scene`(360×620 또는 560×560) 기준으로 렌더하며(Phase 4D), 1920px
  이상에서만 표시되고 1440 이하에서는 DOM에 있어도 `display:none`이다.
  Phase 4C에서는 원이 세로로 늘어난 타원으로 렌더되는 기하 버그가 있었는데
  (컴포넌트 root 높이가 섹션의 임의 실제 높이를 따라가 360:620 비율이
  깨졌던 것), Phase 4D에서 고정 aspect-ratio + 원본 픽셀 좌표 기반 렌더로
  교정했다(직접 렌더 측정으로 원 width/height 차이 1px 이하 확인). Phase 4D는
  원 비율만 고쳤을 뿐 세로 위치(`top`)는 그대로 0으로 남아 있어 Figma
  실측과 어긋나 있었다 — Phase 4E에서 실제 문서 좌표를 기준으로 교정했다.
  - Hero Left: 문서(viewport) 기준 top 250px. Header가 `position:fixed`라
    Hero section 흐름 밖에 있어(`App.jsx`의 `NAVBAR_HEIGHT` 스페이서만큼
    실제로 밀림), `HeroSection.jsx`가 `getBoundingClientRect()`로 Hero
    section의 실제 문서 top을 재서 section-relative top을 그때그때 역산한다
    (하드코딩 시 Header 높이가 바뀌면 조용히 어긋나는 걸 방지).
  - About Right: About section 기준 section-relative top 260px(Figma
    y=1120, About section 시작 860 기준).
  - Featured Left: Featured section 기준 section-relative top 1278px
    (Figma y=3000, Featured section 시작 1722 기준) — Bus Arrival(두 번째
    project row) 부근에 오도록 고정값을 쓴다. project row에 직접 anchor하는
    방식도 검토했으나 row 높이가 콘텐츠에 따라 바뀔 수 있어 Figma 좌표
    기준 고정값을 우선 후보로 선택했다.
  - Selected Right: Selected section 기준 section-relative top -123px
    (Figma y=3900, Selected section 시작 4023 기준) — 이전 Featured 섹션
    위로 123px 넘어가고 Selected 안으로 497px(620-123) 이어진다.
    `MoreWorksSection.jsx`의 section은 `overflowX:'hidden'`만 지정하고
    overflowY는 지정하지 않아(기본 visible) 이 음수 top이 잘리지 않는다.
  - Contact Left/Right: Contact section 기준 top 0(section 자체 좌우
    identity/action plane 분할과 무관). 너비는 `gutterWidth = calc((100vw -
    HOME_WIDE_MAX_WIDTH) / 2)`, `maxWidth: 560`을 그대로 쓴다 — 2560에서
    560px, 1920에서 240px 정사각형이며, 이전에 쓰던 `maxWidth: 400` +
    `CONTACT_SHELL_SPLIT_OFFSET` 기반 복잡한 식은 1920에서 실제 gutter보다
    넓게 렌더돼 중앙 1440 shell과 겹치는(`overlapsContent:true`) 버그가
    있어 제거했다. `CONTACT_RIGHT_VARIANT`의 내부 자식 좌표(원/line/fragment/
    점)도 Phase 4D까지는 "기존 비율 추정 유지"였는데, Phase 4E에서
    `get_metadata`로 442:166을 직접 재조회해 실제 절대 좌표(`local x =
    absolute x - 2000`)로 교체했다 — Left에는 없는 두 번째 line(가로
    Terminal Path)이 있어 `line2`로 추가했다.
  - 모든 수치는 `npm run audit:detailed`의 `qhdSignalGeometry` 단계가
    `expect.soft()`로 직접 검증한다(오차 허용: 위치 ±2px, 크기 ±1px).
- **QHD Section Index(`QhdSectionIndex.jsx`, Phase 4F)**: Figma QHD Home
  (347:383)의 "Wide Index / Wide Label" 4쌍(396:199~206) — Human Signal의
  "단계·구조·검증" 정체성을 QHD 여백에 설명하는 승인된 요소다. Ambient
  Signal(원/선/점)과 역할이 달라 별도 컴포넌트로 분리했다. 1920px+에서만
  표시, 1440 이하는 `display:none`.
  - 스타일은 direct node `get_design_context` 실측 그대로: index 숫자는
    Noto Sans KR Bold 170px opacity 0.05 inkNavy(Figma Type 패널의 Noto
    Sans KR은 이 저장소에서 항상 실제 코드 폰트 SUIT Variable로 치환해
    검증한다 — 위 "타이포그래피" 절과 동일 규칙), label은 IBM Plex Mono
    SemiBold 11px opacity 0.56 burntOrange.
  - 위치(section-relative top, 뷰포트 폭과 무관하게 항상 같다):
    01 About(left) index 220 / label 380,
    02 Featured(right) index 1619 / label 1779,
    03 Selected(left) index 117 / label 277,
    04 Contact(right) index -5 / label 173.
  - 수평 위치는 중앙 1440(`HOME_WIDE_MAX_WIDTH`) shell 기준 Figma gutter
    간격을 그대로 보존한 calc식이다 — 2560에서 left index x=58/label
    x=126, right index x=2218/label x=2148과 정확히 맞는다(1920에서는
    화면 밖으로 일부 잘리는 걸 허용, 중앙 shell 침범은 금지).
  - **구현 중 발견한 버그**: Featured/Contact처럼 opaque full-bleed(100vw)
    배경 블록(project band, Contact 2-pane split/footer strip)이 있는
    섹션에서, `QhdSectionIndex`를 그 블록들보다 DOM에서 앞에 두면 완전히
    가려진다(그 블록들이 나중에 페인트돼 덮어씀 — `elementFromPoint`로
    재현·확인). 두 섹션 모두 `QhdSectionIndex`를 해당 블록들보다 뒤에
    배치해 해결했다. 숫자는 1440 content shell 바깥 여백에만 있어 이렇게
    옮겨도 실제 텍스트/CTA 위로 올라오지 않는다.
  - 모든 수치는 `npm run audit:detailed`의 `qhdIndexGeometry` 단계가
    `expect.soft()`로 검증한다(section-relative top 허용 오차 ±2px,
    중앙 1440 shell `overlapsContent:false` 필수).

## 접근성

- 전역 `:focus-visible` 안전망(Burnt Orange 2px, `index.css`) — 이미 개별
  `&:focus-visible` sx를 둔 요소는 그쪽이 우선 적용되고, skip link처럼
  개별 규칙이 없는 요소만 이 전역 규칙을 받는다.
- Skip link(`.skip-link`, `index.css`) — 평소 화면 밖에 있다가 포커스 시
  좌상단에 나타난다. `App.jsx`의 `<main id="main-content">`로 이동한다.
- 주요 상호작용 영역 44×44px 이상.
- `prefers-reduced-motion: reduce`: 기존 전역 규칙(`index.css`, duration/
  delay를 0에 가깝게)은 그대로 두고, 모바일 메뉴처럼 JS 트랜지션(MUI
  Drawer의 Slide)을 쓰는 새 컴포넌트는 개별적으로 감지해 opacity 전환으로
  바꿨다. Hero 등 transform 기반 진입 모션 자체의 reduced-motion 처리는
  다음 회차(Hero B 모션 구현) 범위다.

## Quiet Structural Depth

`components/ui/QuietSignalBackground.jsx` — radial-gradient 블롭 2개 +
blur 한 겹만 쓰는 단순 배경 레이어(pointer-events: none, aria-hidden,
모바일에서 크기/불투명도 축소). 이번 회차는 404 페이지에만 적용했고,
나머지 자리에 쓸지는 Phase 2에서 판단한다.

## Home 섹션 구조 (Phase 4A 기준)

`HeroSection.jsx`, `AboutSection.jsx`, `ProjectsSection.jsx`,
`MoreWorksSection.jsx`, `ContactSection.jsx` 모두 Human Signal
`HUMAN_SIGNAL` 토큰만 참조한다(Ordered Signal `COLORS` 참조 없음). Home
섹션 순서는 Header → Hero → About → Featured Projects → Selected Works →
Contact다(Home Desktop 1440 254:3 y좌표 순서로 재확인). Phase 4A에서
확정된 구조:
- **Hero**: 배경은 섹션 전체 Ink Navy 단일 톤(좌우 색 분할 없음), 콘텐츠는
  다른 섹션과 같은 표준 max-width 컨테이너 안에서 55/45(QHD 52/48)로
  나뉜다. 좌측은 eyebrow("DOHAN KIM / HUMAN SIGNAL", Header의 D2+이름을
  반복하지 않음) + H1 2줄(Soft White 단색, 강조색 분리 없음) + 설명 +
  CTA 2개. 우측은 실제 화면(JobFlow) 대신 D2 중심 Signal Stage 카드
  (동심원 2개 + 격자 + 코너 chip 4개 + 점 5개 + 하단 3분할 signal bar).
  IDENTITY(0–220ms, 이름/헤드라인 등장) → SCATTER(220–720ms, 격자·점·chip이
  흐리게 등장) → ALIGN(720–1180ms, chip이 실제 색으로 정렬) → SETTLE
  (1180–1460ms, D2와 하단 bar가 완성되며 멈춤) 4단계, 총 1.46초, 1회
  재생 후 반복 없음(Motion Guide 286:3, 키프레임 323:3/92/181/270 실측).
- **About**: 섹션 배경은 Soft White(Warm Paper 아님, 266:53 실측). 상단
  Intro(좌 헤드라인 "제가 할 수 있는 일을, 실제 결과물 기준으로
  보여드립니다." / 우 Warm Paper Origin 카드), 하단 Skill Matrix — Warm
  Paper 패널 하나 안에 좌측 소개("설계하고, 구현하고, 검증합니다.") + 우측
  Skill Card 3개(01 UX/UI·그래픽 설계 / 02 반응형 구현 / 03 품질 검증,
  Soft White 카드, 인덱스+accent bar+제목+purpose+divider+tools). Phase 3C의
  정리·연결·검증 밴드, Capability Studio(dark 3레인), 5단계 Working
  Process는 최신 Figma에 없어 제거했다.
- **Featured Projects**: 이전 구조 유지(JobFlow/버스 도착정보 앱/Portfolio
  Feedback Hub 3개 row, 이미지·설명 교차 배치, 실제 데이터). 헤딩 카피만
  Figma 실측으로 갱신("서로 다른 문제를, 같은 기준으로 풀었습니다.").
- **Selected Works**: 이전 구조 유지(`moreWorksPublished` 플래그 기반 단일
  카드, 현재 OTT Service 1개). 헤딩 카피만 갱신("다른 작업도, 같은
  기준으로 정리했습니다.").
- **Contact**: 좌 32% Deep Harbor identity plane(D2+`DOHAN KIM`+정리·연결·
  검증+OPEN TO WORK) / 우 68% Soft White action plane(heading+Mail primary+
  GitHub secondary+지원 분야, PDF 버튼 없음 — 268:65 확인), 하단 별도
  Deep Harbor footer strip(한 줄: `DOHAN KIM · HUMAN SIGNAL / {year}
  PORTFOLIO`). 좌우 분할은 1440까지 100vw 풀블리드를 유지하고, 1920+에서는
  `HOME_WIDE_MAX_WIDTH`(1440) shell로 캡핑되며 그 바깥 여백에 Contact
  Closing Signal(442:166)이 렌더된다(위 Ultra-wide 절 참고).

영문 이름 표기는 `DOHAN KIM`(이름 성 순서)으로 통일 확정됐다(사용자 확정).
Navbar 로고, Hero eyebrow, Contact identity·footer, ProjectsPage footer,
NotFoundPage footer 전부 `DOHAN KIM`을 쓴다 — `KIM DOHAN`(성 이름 순서)은
더 이상 쓰지 않는다.

## Figma 노드 레퍼런스 (파일 `53Ppn2hIgrvs9Jra3eejFs`, Phase 4A 재확인)

| 영역 | 노드 |
|---|---|
| Foundations & Tokens | `447:2` |
| Reusable Media Components | `183:3` |
| Home Desktop 1440 | `254:3` |
| Home Compact 1024 | `365:126` |
| Home Mobile 390 | `254:4` |
| Home QHD 2560 | `347:383` |
| Hero Motion Guide | `286:3` |
| Hero Motion IDENTITY / SCATTER / ALIGN / SETTLE | `323:3` / `323:92` / `323:181` / `323:270` |
| Interaction / Navigation States | `220:7` |
| Interaction / Mobile Menu | `221:2` |
| Interaction / Card & Link States | `222:2` |
| Interaction / Routing Rules | `223:2` |
| 404 Desktop / Mobile | `223:47` / `224:2` |
| Interaction / Edge Rules | `224:25` |
| Interaction / Accessibility QA | `227:3` |

위 표는 Phase 4A 시점에 조회한 Home/404 노드다. `/projects`(Projects Index) 노드는
아래 Phase 5A 절을 따른다. `/projects/:slug`(Detail)는 아직 재동기화하지 않았다.

## Projects Index Figma delta sync (Phase 5A)

Figma file `53Ppn2hIgrvs9Jra3eejFs`, Page `04_최종화면_Projects`(node `206:2`).

| 영역 | 노드 |
|---|---|
| Desktop 1440 | `206:5` (Hero `206:6` · Featured `206:41` · Rules `206:4`) |
| QHD 2560 | `208:2` (Hero `208:3` · Featured `208:38`) |
| Compact 1024 | `209:2` (Hero `209:3` · Featured `209:38`) |
| Tablet 768 | `210:2` (Hero `210:3` · Featured `210:38`) |
| Mobile 390 | `212:2` (Hero `212:3` · Featured `212:42`) |
| Footer(1440/QHD/Compact/Tablet/Mobile) | `207:81` / `208:177` / `209:177` / `210:177` / `212:181` |
| QHD Signal Field(01–03 index 좌표 출처) | `381:257` |

**공개 사실성 우선 규칙**: Figma가 실제 공개 데이터와 다르면(예: More Works 카드 수),
Figma placeholder 문구를 그대로 베끼지 않고 코드 데이터(`moreWorksPublished === true`
필터)에서 계산한 값을 쓴다. Figma 쪽이 실제와 다르면 Figma를 실제에 맞춰 고친다(코드에
미승인 항목을 새로 공개하지 않는다) — Phase 5A에서 Mini SNS가 이 규칙으로 처리된
실제 사례다(`system/project-publication-inventory.md`, Desktop handoff 참고).

**단일 More Work 레이아웃**: 공개 항목이 1개뿐일 때 빈 두 번째 칸을 placeholder로
채우지 않는다. `MoreWorks` 컴포넌트는 `MORE_WORKS.length === 0`이면 섹션 자체를
렌더하지 않고, 1개면 좌측 정렬된 카드 1개만 렌더한다(전폭으로 늘리지 않음).

**QHD 01–03 index**: Home과 같은 `QhdSectionIndex.jsx`를 재사용하되, Projects
전용 시각 프롭(`indexColor`/`indexFontSize`/`labelOpacity`/`indexOffset`/`labelOffset`)을
넘긴다. 다크 full-bleed 섹션(Featured `01`, Footer `03`)에서는 `indexColor`를
`HUMAN_SIGNAL.softWhite`로 써야 배경(`inkNavy`)과 대비가 생긴다 — `deepHarbor`를
쓰면 opacity 0.05에서 사실상 안 보이는 실제 버그였다(Phase 5A에서 스크린샷으로
발견·수정). 라이트 섹션(More Works `02`)은 `deepHarbor`가 맞다.

**내부 고정 route는 Link**: 홈으로 돌아가기, Featured 상세 보기, Footer 홈,
Detail 이전/다음 프로젝트, 404 홈/전체 프로젝트는 전부 `RouterLink`로 실제
`<a href>`를 렌더한다. Detail의 스마트 뒤로가기(history 유무에 따라 다른 곳으로
이동)만 버튼으로 유지한다.

**Detail placeholder 금지 원칙**: `/projects/:slug`는 프로젝트별 실제 이미지 수가
1장뿐인 경우가 있다. 실제 asset inventory 없이 Figma의 여러 media slot을 그대로
구현하면 같은 이미지를 반복 배치해 "여러 증거"처럼 보이는 거짓 표현이 된다 —
Phase 5B에서 프로젝트별 실제 자산을 먼저 조사한 뒤에만 슬롯을 채운다.

## QHD 장식 표시 기준 재정의 (Phase 5A-R)

사용자가 실제 2560 모니터에서 QHD 장식(`QhdAmbientSignal`/`QhdSectionIndex`)이
잘려 보인다고 보고했다. 원인은 두 가지였다.

1. 표시 기준이 `1920px`이었지만, gutter offset 계산상 index/label 전체가
   viewport 안에 들어오려면 실제로는 최소 2444px가 필요했다 — 1920~2320px대
   CSS viewport(실제 2560 모니터도 OS 배율 125%/150%를 걸면 이 범위로 내려간다)
   에서는 장식의 일부가 화면 밖으로 구조적으로 잘렸다.
2. "1920에서는 필요하면 화면 밖으로 clip된다"는 이전 원칙 자체가 부분 잘림을
   허용하고 있었다.

두 원칙 모두 폐기하고, `theme.js`의 `QHD_DECORATION_MIN_WIDTH = 2480`(계산값
2444에 안전 여백) 미만에서는 장식을 통째로 숨긴다. `QhdAmbientSignal.jsx`/
`QhdSectionIndex.jsx`가 이 상수 하나만 공유해서 쓴다(각 파일에 값을 따로
하드코딩하지 않음). Contact gutter scene도 같은 기준을 적용한다(Home/Projects
표시 기준 통일).

## Projects 반응형 breakpoint 재정의 (Phase 5A-R)

Figma Compact 1024(209:3/209:38)를 실제 코드와 대조한 결과, `ProjectsHero`/
`FeaturedProjects`가 MUI 기본 `md`(900px)에서 2-column/3-column으로 전환하고
있어 1024가 "너무 좁은 2-column"과 "3-column" 사이에 끼여 headline이 3줄로
깨지고 카드 폭이 좁아지는 문제가 있었다(사용자가 실제 화면에서 발견).

- Hero: `flexDirection`을 `md`가 아니라 `lg`(1200px)에서 전환 — 1024는 copy가
  위, View Guide가 아래 full width로 쌓인다.
- Featured: `<900` 세로 카드 1열 → `900~1199` 세로 카드가 아니라 카드 자체가
  media(45%)+content(55%) 가로형 row로 바뀐 상태로 1열 → `1200+` 3열 세로 카드.
  grid는 `lg`에서만 3-column으로 전환하고, 카드 내부 `flexDirection`이
  `{xs:column, md:row, lg:column}`으로 세 단계를 표현한다.

## More Works single-feature 카드 (Phase 5A-R)

공개 항목이 1개뿐일 때 기존 `maxWidth:632` 좌측정렬 카드는 QHD 1312px shell
안에서 절반 이상을 빈 공간으로 남겼다(사용자가 "빠진 두 번째 카드 자리"처럼
느낌). `900px` 이상에서는 media 58%/content 42%인 가로형 카드로 바꾸고
(`maxWidth: 1100`, shell 폭을 넉넉히 사용하되 Featured 3개보다 과장되지
않도록 shell 전체까지는 늘리지 않음), `900px` 미만은 기존처럼 세로 전체폭
카드를 유지한다. 빈 두 번째 칸을 placeholder로 채우지 않는다는 원칙은 그대로다.
