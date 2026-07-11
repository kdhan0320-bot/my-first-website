# Dohan.K Flow Blueprint — 디자인 참고 문서

이 문서는 `projects/my-portfolio/CLAUDE.md`의 "디자인 방향" 핵심 원칙을
구현 수준까지 풀어놓은 참고 자료다. 복제용 스펙이 아니라 판단 기준이며,
사용자가 명시적으로 재변경을 요청하지 않는 한 아래 정의를 기준으로만
다듬는다.

## 콘셉트

"Dohan.K Flow Blueprint": 복잡한 정보를 정리하고, 화면 구조를 설계하고,
React/MUI로 구현하고, 반응형과 한계를 검증하는 흐름을 배경의 선·노드·
도면·모션으로 보여주는 포트폴리오. Hero에서 시작한 흐름이 About timeline
→ Projects stage → Footer brand ending으로 이어지는 배경 시스템이다.

핵심 시각 요소 6가지: **Flow Path / Interface Blueprint / Timeline Node /
Project Stage / Evidence Badge / Brand Ending**.

2025~2026 참고 방향은 정돈감보다 개인성·장면감·진정성·구현 흐름을
우선한다.

## 색상 역할

배경 장식 레이어(Flow Path/Interface Blueprint/받는 글로우 등)는 아래
4가지 역할만 따르고, 새 색상을 추가하지 않는다.

- **cyan** (`#38BDF8`, `rgba(56,189,248,…)`) — 흐름(Flow Path), CTA,
  active 상태 전용.
- **blue** (`#3B82F6`, `rgba(59,130,246,…)`) — 구조/frame/Interface
  Blueprint(그리드, 와이어프레임 라인) 전용.
- **emerald** (`#34D399`~`#A7F3D0`) — Evidence Badge의 검증/완료 의미에만
  제한적으로 사용.
- **violet** (`#7C3AED`/`#818CF8`) — depth glow(2차 그라디언트 stop 등)에만
  아주 약하게 사용.

About의 4단계 timeline/역량카드 색상(cyan/violet/blue/emerald 4색 배정)은
이미 확립된 별도 시스템이므로 이 규칙 적용 대상이 아니다 — 그대로 유지한다.

Selected Projects/Works 카드의 top-border, hover glow, Preview의 카테고리
pill·인디케이터 dot 같은 공통 chrome 요소는 프로젝트마다 다른
`accentColor`를 쓰지 않고 고정 cyan(`#38BDF8`)으로 통일한다. 즉 "프로젝트별
무작위 accent color 금지"를 실제로 적용한 상태다.
`projectsFallbackData.js`의 `accentColor` 필드 자체는 삭제하지 않되,
카드/Preview 렌더링에서는 참조하지 않는다.

### cyan 사용 세부 기준

- cyan(`primary.main`)은 H1 강조, 주요 CTA 버튼, active 상태, Flow Core
  중심부(개인 브랜드 마크)에만 사용한다.
- 보조 라벨, 카드 eyebrow(카테고리 라벨 등), 반복되는 패널 테두리, 작은
  장식 아이콘, 과한 glow에는 cyan을 남발하지 않는다. 이런 자리는 중립
  톤(slate/gray 계열)을 기본으로 하고, 강조가 필요하면 프로젝트별
  accentColor 등 문맥에 맞는 색을 쓴다.
- 색이 있는 텍스트 라벨은 배경 대비 최소 4.5:1을 목표로 한다. 대비가
  애매하면 텍스트 자체를 색칠하기보다 옅은 배경 pill + 기본 텍스트
  색(`text.primary`) 조합으로 대비 문제를 구조적으로 없앤다.

## 컴포넌트 정의

### Route Line 표준화
섹션 하단 커넥터 + 다음 섹션 상단 "받는" 글로우 + `FlowNode` 마커는
Hero→About→Projects→Contact 전 구간에서 동일한 규격을 쓴다: 받는 글로우는
320×220·opacity 0.13으로 통일하고, 섹션마다 크기를 다르게 만들지 않는다.
`FlowNode`(8px cyan 원+glow)는 "보내는" 섹션의 하단 경계에 하나씩 두어
흐름이 이어지는 지점을 표시한다. Projects의 Preview Monitor 뒤 "stage
focus" 스포트라이트처럼 목적이 다른 글로우는 이 표준화 대상이 아니다.

### Flow Path
섹션 하단의 옅은 세로 그라디언트 커넥터(Hero 하단 패턴)와, 다음 섹션
상단의 "받는" radial glow(라인이 번져 들어가는 것처럼 보이는 소프트
확산)를 짝지어 Hero→About→Projects→Contact가 한 흐름으로 이어지는 느낌을
준다. 무한 반복 애니메이션 없이 정적으로만 사용하고, 하드 라인 하나만으로
경계를 긋지 않는다(섹션 경계가 선처럼 끊겨 보이면 실패로 간주). Timeline
connector는 node 내부를 지나가 보이면 안 된다 — node 반지름만큼 gap을
두거나 node 배경을 완전 불투명하게 처리한다. CTA/Button 뒤로 장식선이
직접 겹치지 않게, 버튼 블록 다음 정상 흐름에 배치한다.

### Evidence Badge
`EvidenceBadges` 컴포넌트가 프로젝트 상세 모달 상단에 표시하는 검증
배지(구현/설계 완료, 한계 명시, 반응형 확인 등). `status`, `limitation`,
`is_figma_project` 같은 실제 데이터 필드에서만 도출하고, 검증되지 않은
문구는 넣지 않는다. 카드 좌상단의 "대표 작업" 배지는 별도 패턴으로 카드에
유지한다.

### Project Stage
Selected Works 썸네일을 감싸는 상단 chrome bar + window dots + 얇은
border + inner shadow 프레임. 이미지 비율은 항상 `contain`을 유지하고
`cover`로 바꾸지 않는다.

### Footer Brand Ending
Footer의 `LogoSymbol` + "Dohan.K" + "Design to Web Interface" 조합을
마지막 장면으로 강화한 마감. Dohan.K 텍스트 크기/weight/letter-spacing을
Footer 안에서 가장 강한 타이포로 두고, 상단 accent line과 브랜드 glow로
경계를 분명히 한다.

### D Mark
`LogoSymbol`(원형 그라디언트 D)은 Hero Flow Core, Navbar, Footer Brand
Ending 전용 "실물" 마크다. `DMark`(옅은 원 + 큰 D 글자 워터마크)는
About/Projects 배경에 아주 낮은 opacity로 반복되는 workmark다. 두 종류를
섞어 쓰지 않고, 한 섹션에 2개 이상 넣지 않는다. Footer는 실물 로고만 쓰고
DMark를 겹쳐 넣지 않는다(로고 중복 방지).

### Contact 모션 예외
Contact CTA 카드는 Flow Motion의 마지막 행동 지점이므로, 카드 배경에
한해 24~36초 이상의 아주 느린 diagonal drift 애니메이션을 예외적으로
허용한다(Hero 예외와 동급). opacity는 낮게 유지하고 텍스트/버튼 위를
직접 지나가 가독성을 해치면 안 되며, 데스크톱 전용으로만 적용하고
모바일에서는 표시하지 않는다. `index.css`의 전역 reduced-motion
규칙(`*, *::before, *::after`)이 모든 `animation`에 자동 적용되므로 별도
처리는 불필요하다.

## 모션 원칙

- 무한 반복 애니메이션은 원칙적으로 금지. Hero 섹션 한정, 완전히
  prefers-reduced-motion에서 제거되는 조건 하에 12~18초 주기의 아주 약한
  ambient motion(connector line 위 highlight 이동, spotlight opacity의
  미세한 호흡, status strip border의 은은한 shimmer)만 허용한다. Hero
  밖에서는 무한 반복 모션을 넣지 않는다.
- 배경 장식 효과는 우주/은하/별/궤도 이미지가 아니라 "Flow Stream"(얇은
  대각선/곡선 라이트 리본, opacity 0.06~0.18, blur 24~36px, 18~28초의
  느린 이동)으로 표현한다. 섹션마다 강도는 다를 수 있고 Hero 밖에서는
  정적으로만(무한 반복 없이) 사용한다. 별/입자/은하 텍스처는 넣지 않는다.
- 텍스트 자체가 계속 움직이는 애니메이션은 금지(진입 시 1회 fade/translate
  는 허용). 반복되는 ambient 모션은 배경 라인, spotlight, 카드 reveal,
  hover 효과에만 사용한다.
- Hero CTA 버튼 그룹의 진입 모션은 필수다. 부모 Stack/Box에만
  opacity·animation을 걸면 버튼 각각의 computed style에는 반영되지 않아
  "모션 없음"으로 보일 수 있으므로, 각 Button 요소 자체에 opacity 0→1,
  translateY(10~14px)→0 애니메이션을 직접 적용한다.

## 레이아웃/구조 세부

- **Header 내비게이션**: Home에 About Snapshot이 있으므로 헤더 nav에서
  "소개"를 별도 항목으로 두지 않는다. 기본 nav는 프로젝트 / 연락처 /
  GitHub 3개(데스크톱·모바일 Drawer 동일). Hero의 "작업 방식 보기" CTA는
  About 섹션 스크롤 진입점으로 유지한다. 로고 클릭은 Home 최상단 이동.
- **Home 중심 구조**: Home 한 화면 흐름 안에서 지원자 소개, 작업 기준,
  대표 프로젝트를 모두 이해할 수 있어야 한다. `/about` 같은 별도 페이지가
  있어도 Home의 About Snapshot(소개/지원 방향/작업 기준/사용 도구/한계
  요약)을 비워두지 않는다. Projects Preview(쇼케이스)와 Projects
  List(상세 진입 카드)는 역할이 다르므로 List에 Preview와 동일한 긴 설명을
  반복하지 않는다.
- **페이지 접근성(네비게이션)**: Home에 Snapshot이 있는 섹션은 별도
  페이지 링크보다 Home 내 스크롤 앵커 연결을 기본으로 한다. 별도
  라우트(`/about` 등)는 nav 핵심 항목에서 빠지더라도 페이지 자체는
  삭제하지 않는다(직접 URL·검색엔진 노출 등 다른 경로로 유효). nav 항목
  추가/변경 시 기존 항목의 동작·톤(active 색상, hover, 터치 영역 44×44px
  이상)을 따른다.
- **Projects Preview 구조**: "현재 선택된 프로젝트 1개의 상세 정보(이름/
  유형/문제/구현 범위/한계) + 오른쪽 큰 모니터 썸네일" 구조가 원칙이다.
  프로젝트 전환 컨트롤(카운터, Prev/Next, dot)은 모니터 쪽에 작게
  배치하고, 왼쪽 설명 영역에 3개 프로젝트 정보를 동시에 펼치지 않는다.
  Preview 아래 상세 카드 3개는 여백/divider+제목으로 시각적으로 구분한다.
- 시각적으로 작은 컨트롤(인디케이터 점 등)도 실제 클릭/터치 hit area는
  44×44px 이상 확보한다(시각적 크기는 유지, 패딩으로 영역만 확장).
- Flow Core의 orbit 링은 라벨(Figma/React·MUI/Responsive QA/AI Assist)
  위치에서 실제로 선이 끊긴 상태를 유지해야 한다. 라벨 뒤로 링 라인이
  다시 보이면 회귀로 간주하고 즉시 고친다.
- Hero/Flow Core 크기·구조, Projects Preview("선택 1개 + 모니터 썸네일")
  구조는 여러 라운드에 걸쳐 자리 잡은 결과이므로, 사용자가 명시적으로
  재변경을 요청하지 않는 한 그대로 유지한다.

## 레퍼런스 적용 위치 (섹션별)

같은 레퍼런스 구조(예: 모니터형 프리뷰)라도 사용자가 지정한 섹션이 아니면
다른 섹션에 넣지 않는다.

- **Hero**: FEConf류 — 큰 타이포그래피, 하나의 중심 오브젝트, 느리고 약한
  ambient motion, 첫 화면 시선 집중. "과한 3D/glassmorphism/네온 금지"
  원칙은 Hero 한정으로 강한 타이포그래피, glass board(약한 유리질 패널),
  grid, spotlight, line draw, stagger motion(단계별 순차 등장)에는
  적용하지 않는다. Hero 이외 섹션(About/Projects/Contact)에는 그대로
  적용된다.
- **Projects("02 SELECTED PROJECTS")**: i-AWARD류 — 모니터/화면 프레임
  안에 대표 작업물 리스트가 보이는 프리뷰 구조.
- **전체 톤**: DAN25류 — 큰 메시지, 짧은 카피, 과장 없는 테크 브랜드
  안정감.
- 과한 3D, 네온, 우주/행성/궤도, 파티클, AI 로봇/회로 감성 연출은 Hero를
  포함한 모든 섹션에서 예외 없이 금지한다.
- Hero 안에 프로젝트 데이터를 표시할 경우 Projects 섹션과 동일한
  소스(`data/projectsData.js`)를 재사용해 정합성을 유지한다.

## getdesign 레퍼런스 비율

`getdesign.md`는 복제용 자료가 아니라 디자인 원칙 참고용이다. 현재 톤은
아래 비율로 여러 레퍼런스를 섞어 재해석한 것이며, 특정 브랜드의 로고·고유
그래픽·고유 문구·레이아웃을 그대로 복제하지 않는다.

- **Webflow (30%)** — 콘텐츠 중심 섹션 리듬, 카드 여백감, 장면감 있는
  섹션 전환.
- **Raycast (25%)** — 다크 UI의 정밀한 대비, 컴팩트한 라벨/배지, 개인
  도구 느낌.
- **Vercel (15%)** — 타이포그래피, 버튼, 카드의 정밀도.
- **Linear (15%)** — Work Style/Projects 카드, 상태 라벨, 미니멀한 다크
  톤.
- **Resend (10%)** — 담백한 문장 톤, 절제된 CTA.
- **Figma (5%)** — UX/UI 포인트 컬러, Flow Core 주변 라벨. 화면의 5~10%
  비중을 넘지 않는다.

## 이전 변경 이력

관리 규칙: 이 섹션은 최근 3~5개 핵심 결정만 유지한다. 오래된 세부 라운드
기록은 결과 한 줄로 요약하거나 삭제하고, 대화 로그 형태로 계속 늘리지
않는다.

- 초기 톤은 Vercel(45%) / Linear(30%) / Figma(15%) / Mintlify·Claude
  계열(10%) 비율로 시작했으며, 이후 위 "getdesign 레퍼런스 비율"로
  대체되었다.
- 배경 강도(Flow Path/Interface Blueprint 등)를 "강하게 해보고 과하면
  줄이는" 실험형 마감으로 한 차례 25~40% 올린 라운드가 있었다 — 이후
  과하다는 피드백이 오면 이 시점의 수치를 기준으로 낮춘다.
- 카드 chrome 요소(top-border, hover glow, pill, dot)를 프로젝트별
  accentColor 대신 고정 cyan으로 통일한 결정은 이후 라운드에서 확정되어
  현재 "색상 역할" 절에 반영되어 있다.
