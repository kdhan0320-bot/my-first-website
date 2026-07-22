# Human Signal — 디자인 참고 문서

이 문서는 `projects/my-portfolio/CLAUDE.md`의 디자인 방향을 구현 수준까지
풀어놓은 참고 자료다. 복제용 스펙이 아니라 판단 기준이며, Figma 파일
`53Ppn2hIgrvs9Jra3eejFs`("Human Signal v8")를 1차 소스로 삼아 정리했다.
세부 수치(hex, px, 초)는 Figma 원본이 우선하고, 이 문서는 그 수치를
코드에 어떻게 적용했는지 설명한다.

이전 디자인 시스템(Ordered Signal, 큰 한글 타이포 + 신호점/신호선 모티프)은
사용자 승인 아래 Human Signal로 교체됐다. Header/Navigation/모바일 메뉴/404/
D2 로고/전역 토큰(Phase 1)에 이어, Hero/About/Selected Projects/More Works/
Contact 5개 Home 섹션과 `/projects`·`/projects/:slug`까지 Phase 2~3C에
걸쳐 전환을 마쳤다 — 저장소 전체가 Human Signal 한 체계로 통일된 상태다.
`theme.js`의 옛 `COLORS`/`getDesignTokens`(Ordered Signal 6색, MUI dark
palette)는 더 이상 어느 컴포넌트에서도 참조하지 않는 미사용 코드로 남아
있다(삭제 여부는 별도 정리 회차에서 판단).

## 콘셉트

"HUMAN SIGNAL": Field(현장) → Structure(구조) → Build(구현) → Verify(검증)로
이어지는 작업 방식을 "정리 · 연결 · 검증" 태그라인과 D2 로고, 세이지/오렌지
신호 포인트로 보여주는 포트폴리오. Ordered Signal의 어두운 단일 톤 대신
Warm Paper(밝은 종이 질감 배경)와 Ink Navy/Deep Harbor(어두운 섹션)가
번갈아 나오는 2톤 구성이다.

## 색상 시스템

Figma에는 Variables가 바인딩돼 있지 않아(`get_variable_defs` 빈 값) 아래
값은 Human Signal v8 실제 프레임에서 직접 확인한 hex다(Hero 180:500, About
180:546, Contact 180:698, Interaction/Navigation States 220:7, Mobile Menu
221:27, 404 223:47). `src/theme.js`의 `HUMAN_SIGNAL` 객체와 1:1로 대응한다.

| 이름 | Hex | 용도 | 확인 근거 |
|---|---|---|---|
| Ink Navy | `#0C1420` | 기본 다크 텍스트, D2 onLight primary | Header 텍스트, D2, 404 텍스트 |
| Deep Harbor | `#172432` | 보조 다크 표면(카드/섹션 배경) | Hero copy plane·product stage plane, Contact 배경, 모바일 메뉴 배경 |
| Warm Paper | `#F2EDE3` | 기본 밝은 배경 | About BACKGROUND blockquote 텍스트 색, Projects/404 배경 |
| Paper Deep | `#E2D9CC` | 밝은 배경 위 보더/디바이더 | Header 보더, 404 헤더/푸터 라인 |
| Soft White | `#FFFDF8` | 밝은 섹션 카드/버튼 배경 | Header 카드, 모바일 메일 CTA, 404 CTA |
| Ink text | `#27313B` | 밝은 배경 위 보조 텍스트(본문) | Hero 서브카피 |
| Burnt Orange | `#A74224` | **밝은 배경(Warm Paper/Soft White) 위 작은 텍스트·기호**, focus-visible 링 색 | Hero 라벨, About BACKGROUND 라벨, Header hover, 404 eyebrow/REQUEST/보조 버튼 화살표 |
| Bright Orange | `#D85C32` | 큰 강조 텍스트, 비텍스트 장식(밑줄 인디케이터 등) — 배경과 무관하게 사용 가능 | Nav active 밑줄(220:54), Hero 헤드라인 강조 |
| Bright Orange on Dark | `#EC6B3D` | **어두운 배경(Deep Harbor/Ink Navy) 위 작은 텍스트·기호** | 모바일 메뉴 NAVIGATION/active 번호, 404 primary 버튼 아이콘, Hero canvas PROOF 라벨/signal node 번호, Contact 라벨 |
| Muted Sage | `#90A58B` | 포인트 세이지(도트/비활성 번호) | Origin Sage, Field Pill 도트, 모바일 메뉴 비활성 번호 |
| Steel Mist | `#AAB7C4` | 다크 배경 위 보조 텍스트/디바이더 베이스 | About Step Desc, 모바일 메뉴 설명/상태 텍스트 |
| Deep Sage | `[확인 필요]` | — | 이번 회차 구현 범위(Header/Nav/404) 프레임에 solid fill로 등장하지 않음. 임의 값을 넣지 않았다 |

**사용 규칙 (Figma 접근성 점검 기준, 이번 회차에 코드 반영 완료)**
- 작은 텍스트·기호는 배경에 따라 색을 나눠 쓴다: Warm Paper/Soft White(밝은
  배경) 위에는 `burntOrange(#A74224)`, Deep Harbor/Ink Navy(어두운 배경)
  위에는 `brightOrangeOnDark(#EC6B3D)`를 쓴다. `brightOrange(#D85C32)`를
  작은 텍스트에 쓰지 않는다 — Figma 활성 페이지 대비 점검에서 두 배경 모두
  `#D85C32` 작은 텍스트가 규칙 위반으로 확인됐다.
- `brightOrange(#D85C32)`는 큰 강조 텍스트와 비텍스트 장식(active 밑줄
  인디케이터 등)에는 배경과 무관하게 그대로 쓸 수 있다.
- focus-visible 링은 Bright Orange가 아니라 **Burnt Orange** 2px다(hover와
  구분되는 색).
- `src/theme.js`의 기존 `COLORS`(Ordered Signal 6색)는 그대로 남아 있다 —
  HeroSection/AboutSection/ProjectsSection/MoreWorksSection/ContactSection이
  아직 이 값을 직접 참조하므로, Phase 2에서 해당 섹션을 Human Signal로
  옮기기 전까지는 지우거나 값을 바꾸지 않는다.

## 타이포그래피

Ordered Signal과 동일하게 유지한다.
- **IBM Plex Sans KR** — 한글 제목/본문. `theme.js`의 `FONT_SANS`.
- **IBM Plex Mono** — 라벨/번호/메타데이터. `theme.js`의 `FONT_MONO`.
- Google Fonts CDN(`index.html`)로 로딩, 새 npm 의존성 없음.

## 레이아웃/구조 (Phase 1 구현 범위)

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
- **Desktop 메뉴**: PROJECTS / ABOUT / GITHUB / MAIL, 각 44px 이상 hit
  area. Home에서 Projects/About는 스크롤 위치 기반 scrollspy로 active,
  `/projects`·`/projects/:slug`에서는 PROJECTS가 라우트 기준으로 active.
  GitHub/Mail은 active 처리하지 않는다. Active/hover 밑줄은 24px/12px
  Bright Orange(비텍스트 장식이라 배경 무관하게 사용). hover 시 글자색은
  Warm Paper 위 작은 텍스트라 Burnt Orange로 바뀐다(active 기본 글자색은
  Ink Navy 유지).
- **모바일 메뉴**: MUI Drawer(전체 화면), 배경 Deep Harbor. 순서 Projects /
  About / GitHub / Mail, 항목별 설명(전체 작업/배경과 방식/코드 보기 ↗/
  연락하기 ↗)과 번호(active는 Bright Orange on Dark, 비활성은 Muted Sage)를
  함께 보여준다. NAVIGATION 라벨도 Deep Harbor 위 작은 텍스트라 Bright
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
- **Ultra-wide(2560)**: 1440 레이아웃의 단순 확대가 아니라 콘텐츠
  `max-width: 1680px` 규칙을 쓴다(Figma QHD 프레임 181:919의 `Centered
  1680` 자식 프레임에서 직접 확인). `theme.js`의
  `ULTRAWIDE_CONTENT_MAX_WIDTH` 상수로 노출해뒀다.

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

## Home 섹션 전환 이후 방향 (Phase 3C 기준)

`HeroSection.jsx`, `AboutSection.jsx`, `ProjectsSection.jsx`,
`MoreWorksSection.jsx`, `ContactSection.jsx`, `/projects`, `/projects/:slug`
모두 Human Signal `HUMAN_SIGNAL` 토큰만 참조하도록 전환을 마쳤다(Ordered
Signal `COLORS` 참조 없음). Phase 3C에서 추가된 구조:
- **Hero**: 좌 55%(QHD 52%) identity plane(D2+`DOHAN KIM`+역할 카피+H1+CTA) /
  우 45%(QHD 48%) canvas plane(D2 origin→정리·연결·검증 signal node 3개→
  축소된 JobFlow proof window).
- **About**: 상단 좌/우 비대칭(헤드라인/origin 문장), 정리·연결·검증 1개
  밴드(zone 3개), "Capability Studio"(좌 역량 설명 + 우 DESIGN/BUILD/VERIFY
  3레인, Deep Harbor dark 표면 — About 안의 유일한 dark 표면), 5단계 프로세스는
  CSS 점·선 connector로 최소화.
- **Contact**: 좌 32% Deep Harbor identity plane(D2+`DOHAN KIM`+정리·연결·
  검증+OPEN TO WORK) / 우 68% Soft White action plane(heading+Mail primary+
  GitHub·PDF secondary+지원 분야), 하단 별도 Deep Harbor footer strip.

영문 이름 표기는 `DOHAN KIM`(이름 성 순서)으로 통일 확정됐다(사용자 확정).
Navbar 로고, Hero identity, Contact identity·footer, ProjectsPage footer,
NotFoundPage footer 전부 `DOHAN KIM`을 쓴다 — `KIM DOHAN`(성 이름 순서)은
더 이상 쓰지 않는다.

## Figma 노드 레퍼런스 (Human Signal v8, 파일 `53Ppn2hIgrvs9Jra3eejFs`)

| 영역 | 노드 |
|---|---|
| Home Desktop 1440 | `180:499` |
| Home Wide 1920 | `181:594` |
| Home QHD 2560 | `181:919` |
| Home Compact 1024 | `181:1249` |
| Home Tablet 768/820 | `181:1565` / `181:1884` |
| Home Mobile 390 | `181:2203` |
| Interaction / Navigation States | `220:7` |
| Interaction / Mobile Menu | `221:2` |
| Interaction / Routing Rules | `223:2` |
| 404 Desktop / Mobile | `223:47` / `224:2` |
| Interaction / Edge Rules | `224:25` |
| Interaction / Accessibility QA | `227:3` |
| Motion / Hero B medium storyboard | `172:286` |
| Motion / Implementation timeline | `184:162` |
| Motion / Contact | `173:164` |
