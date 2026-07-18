# Ordered Signal — 디자인 참고 문서

이 문서는 `projects/my-portfolio/CLAUDE.md`의 디자인 방향을 구현 수준까지
풀어놓은 참고 자료다. 복제용 스펙이 아니라 판단 기준이며, Figma 파일
`53Ppn2hIgrvs9Jra3eejFs`("ORDERED SIGNAL / STYLE GUIDE")을 1차 소스로 삼아
정리했다. 세부 수치(hex, px, 초)는 Figma 원본이 우선하고, 이 문서는 그
수치를 코드에 어떻게 적용했는지 설명한다.

이전 디자인 시스템("Dohan.K Flow Blueprint" — 다크 네이비 + cyan/blue/
emerald/violet)은 이 문서와 함께 전면 교체되었다. Figma 자체가 이미
확정한 스타일 가이드(색상/타이포/모션 규칙 노드)를 갖추고 있었고, 사용자
승인 아래 진행했다.

## 콘셉트

"ORDERED SIGNAL": 흩어진 정보를 정리해(Scattered) 정렬하고(Align),
구현 가능한 화면으로 만드는(Final) 과정을 큰 한글 타이포 + 신호(신호점/
신호선) 모티프로 보여주는 포트폴리오. 포인트 컬러(Signal Orange)는 전체
화면 면적의 5~8% 이내로만 쓴다.

## 색상 시스템

Figma Style Guide(`19:233`) 원본 6색. 새 색상을 추가하지 않는다.

| 이름 | Hex | 용도 |
|---|---|---|
| Ink Black | `#0B0F14` | 기본 다크 배경(Hero/Projects/Contact/Header) |
| Deep Slate | `#151B23` | 카드/Mock 배경, 다크 표면 |
| Warm Ivory | `#F4F1EA` | 밝은 배경 섹션(About), 밝은 카드(More Works/Archive 교차) |
| Light Secondary | `#B8C1CB` | 다크 배경 위 보조 텍스트 |
| Dark Secondary | `#4D5966` | 밝은 배경 위 보조 텍스트 |
| Signal Orange | `#FF6B3D` | CTA, 강조 포인트, active 상태 |
| (밝은 배경 강조 텍스트) | `#B93A17` | 밝은 배경 위 작은 주황 텍스트 전용(Signal Orange 대비 확보용) |

**사용 규칙**
- 밝은 배경(Warm Ivory) 위 작은 라벨/숫자 텍스트는 `#B93A17`을 쓴다.
  `#FF6B3D`는 대비가 낮아 밝은 배경의 작은 텍스트에는 쓰지 않는다.
- `#FF6B3D`는 CTA 버튼, Hero/Contact/Projects의 라벨 강조, active
  signal 등 큰 포인트 위주로 쓴다.
- More Works 섹션의 주황 풀블리드 배경은 Figma 원안 그대로 유지한다
  (임의로 축소하지 않는다). 실제 브라우저 렌더링에서 대표 프로젝트
  섹션보다 시각적으로 과해 보이는지는 완료 보고서에서 별도 평가한다.

## 타이포그래피

- **IBM Plex Sans KR** — 한글 제목/본문(Bold=제목, Regular/Medium=본문).
  `theme.js`의 `typography.fontFamily` 기본값.
- **IBM Plex Mono** — 라벨/번호/메타데이터(예: `01 / ORDERED SIGNAL`,
  `USER FLOW`, `VIEW PROJECT →`). `theme.js`에서 내보내는 `FONT_MONO`
  상수를 필요한 곳에 `sx={{ fontFamily: FONT_MONO }}`로 적용한다(MUI
  테마에는 보조 폰트 슬롯이 없어 컴포넌트별 inline 적용 방식을 쓴다).
- 폰트 로딩은 Google Fonts CDN `<link>`(`index.html`)로 하고 새 npm
  의존성을 추가하지 않는다(기존 Pretendard CDN 링크 방식과 동일 패턴).

## 모션 원칙

- **Hero 진입 모션**: Figma Motion States(Scattered `19:277` → Align
  `19:288` → Final `19:296`) 3단계를 기준으로 한다. 헤드라인 각 줄이
  약간 흩어진 위치에서 정렬되고, Signal Panel 각 행이 순서대로 나타나며,
  CTA 버튼이 가장 마지막에 나타난다. 최초 진입 1회, 총 1.5~2.2초,
  `animation-iteration-count:1`(반복 없음). 레이아웃 시프트가 없도록
  최종 상태 기준 공간을 미리 확보한다.
- **Contact 마무리 모션**: Hero의 정렬 개념을 아주 약하게 되받아치는
  정도로, 신호점 3개 + 얇은 선이 흩어진 위치에서 정렬되어 메일 CTA 쪽에서
  멈춘다. 0.6~0.9초, 1회. 버튼 자체는 크게 움직이지 않는다.
- **무한 반복 애니메이션 금지**. Hero/Contact의 위 두 진입 모션은 모두
  1회성이며 예외가 아니다(이 시스템에는 Flow Blueprint 시절의 "Hero
  ambient 12~18초 루프" 같은 예외를 두지 않는다).
- 3D, 파티클, 글리치, 마우스 추적, 강한 blur를 쓰지 않는다.
- 모바일에서는 이동 거리와 요소 수를 줄인다(Hero 헤드라인 scatter
  오프셋을 데스크톱보다 작게 적용).
- `prefers-reduced-motion: reduce`에서는 Final 상태를 즉시 표시한다.
  `index.css`의 전역 규칙이 `animation-duration`뿐 아니라
  `animation-delay`/`transition-delay`도 0으로 만든다 — delay만 살아
  있으면 지연이 긴 요소(예: Hero CTA)가 몇 초 뒤에야 나타나 "즉시 표시"
  요구를 어기게 되므로 반드시 함께 처리한다.

## 레이아웃/구조

- **Header**: 로고(텍스트 "D" + "Dohan.K") · PROJECTS · GITHUB(새 탭) ·
  PDF PORTFOLIO(`PORTFOLIO_PDF_URL`이 있을 때만 노출) · Mail CTA(실제
  이메일 `mailto:`). 모바일은 전체 화면 메뉴(Figma `48:2`)로 전환하며
  포커스 트랩/Escape/스크롤 잠금은 MUI `Drawer`(Modal 기반) 기본 동작을
  그대로 활용한다. 제출용 PDF가 없는 동안에는 PDF 관련 안내 문구도
  공개 화면에 노출하지 않는다("숨긴다"는 사실 자체가 개발/QA 관점의
  설명이라 방문자에게는 불필요하다) — 헤더/모바일 메뉴/Contact 어디에도
  "PDF는 ... 숨깁니다" 같은 문장을 남기지 않는다.
- **Home 섹션 순서**: Header(고정) → Hero → About → Selected Projects →
  More Works(공개 항목이 있을 때만) → Contact. 예전에 있던 별도 `/about`
  페이지는 삭제했다 — `/about` 접근은 Home의 About 섹션으로 리다이렉트된다
  (`App.jsx`의 `<Navigate>` + `HomePage.jsx`의 `location.state.scrollTo`
  재사용). Home의 About Snapshot이 이제 유일한 "소개" 화면이다.
- **Hero**: 하단에는 "SCROLL / 01—05"만 남기고, "1회 정렬 모션 · 반복
  없음 · reduced-motion 대응" 같은 개발/QA 설명 문구는 공개 화면에 넣지
  않는다. 모션 구현(코드/훅) 자체는 그대로 유지한다.
- **Selected Projects**: 실제 대표 프로젝트 3개(JobFlow / 버스 도착정보
  앱 UI / Portfolio Feedback Hub)를 Mock(브라우저 크롬 + 실제 프로젝트
  이미지)과 Copy(제목/설명/ROLE/DATA/상세보기)가 좌우 교차 배치되는
  구조로 보여준다. Figma의 추상 차트/리스트 목업은 브라우저 크롬 장식만
  차용하고, 내부 콘텐츠는 실제 프로젝트 썸네일 이미지로 채운다(Figma
  단순 목업을 최종 이미지로 쓰지 않는다). JobFlow 설명은 "AI 프로젝트"를
  먼저 내세우지 않고 프로젝트 자체 → 문제 → 담당 범위 → 데이터 범위 →
  AI 보조 순으로 정리한다(AI 활용 사실은 숨기지 않되 맨 앞에 두지 않는다).
- **More Works**: 실제로 조사해서 공개 가능하다고 판단한 프로젝트만
  `moreWorksPublished: true` 데이터 플래그로 표시하고, 그 항목만
  렌더링한다(현재는 OTT Service 1개). 공개 항목이 없으면 섹션 전체를
  렌더링하지 않는다. 이전 라운드의 WEB PORTFOLIO/OTHER WORKS 임시 카드는
  삭제했다 — 준비 중/공개 예정 카드나 빈 슬롯은 만들지 않는다.
- **대표 프로젝트 상세**: JobFlow·버스 도착정보 앱·Portfolio Feedback
  Hub 3개는 모달이 아니라 고유 URL(`/projects/jobflow`,
  `/projects/bus-arrival`, `/projects/feedback-hub`, `ProjectDetailPage.jsx`
  템플릿 하나 재사용)로 이동한다. Home과 `/projects`의 "상세보기"/
  "VIEW CASE"는 모두 이 라우트로 이동하고, 이 3개 전용 모달은 제거했다.
  나머지 Archive 프로젝트는 여전히 `/projects`의 기존 모달(`DetailModal`)로
  본다 — 전체 전환 대상이 아니다.
- **`/projects` 페이지**: Featured 3개(Home과 동일 프로젝트, 더 짧은
  카드형, 상세 라우트로 이동)와 Archive 목록(기존 모달)으로 구성한다.
  Figma 목업은 Archive 예시로 3개 행만 보여주지만, 실제 archive 태그
  프로젝트는 더 많으므로(현재 7개) 같은 행 스타일로 실제 개수만큼 반복
  렌더링한다 — 항목을 임의로 줄이지 않는다. 필터 Tabs는 Figma에 없고
  프로젝트 수도 적어 추가하지 않는다.
- 모든 반응형 여백: Desktop(1440) 좌우 64px / Tablet(1024) 좌우 48px /
  Mobile(390) 좌우 24px. 버튼/링크 터치 영역 44px 이상. 정보 전달 목적의
  Mono 라벨(ROLE/DATA/VIEW PROJECT 등)은 모바일에서 최소 12px, 순수 장식
  번호나 위치 표식(카드 번호, SCROLL 표기 등)은 Figma대로 11px을 유지한다.

## 정리된 이전 시스템 잔재

Flow Blueprint 시절 컴포넌트 중 1차 교체 이후로도 어디서도 import되지
않는 파일(`FlowCanvasIllustration.jsx`, `DMark.jsx`, `FlowNode.jsx`,
`ProjectsPreviewMonitor.jsx`, `LogoSymbol.jsx`)은 여전히 삭제 후보로
남아 있다(완료 보고 참고, 삭제는 별도 승인 필요). `AboutPage.jsx`는
이번 라운드에 실제로 삭제했다(참조 없음 확인 후 진행).
