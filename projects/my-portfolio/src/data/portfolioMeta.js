/* my-portfolio 공용 정체성/포지셔닝 메타데이터
 * 브라우저(Vite/React, Hero/About 섹션)와 Node(tools/site-audit-kit의 검사용
 * 리뷰 페이지 생성 스크립트) 양쪽에서 동일하게 import해서 쓴다.
 * import.meta.env 등 Vite 전용 API는 쓰지 않는다 (Node에서도 그대로 실행 가능해야 함).
 * 문구를 바꿀 때는 Hero/About 화면과 검사용 리뷰 페이지에 함께 반영되므로
 * 이 파일만 수정하면 된다.
 */

export const NAME = '김도한';

export const HERO_BADGE = `${NAME} | UX/UI · Web Publishing Portfolio`;

/* Phase 4A: 최신 Figma Hero(254:3의 Hero / Eyebrow, 257:4)는 Header에 이미
 * 있는 D2+DOHAN KIM+역할 카피를 Hero 안에서 다시 반복하지 않고, 작은 eyebrow
 * 한 줄만 둔다. Header의 "UX/UI · WEB PUBLISHING" 역할 표기는 Navbar.jsx에
 * 직접 문자열로 있어(이 파일의 상수를 참조하지 않음), 예전에 이 자리에 있던
 * HERO_LABEL/HERO_ROLE_LINE는 실제로는 Hero에서도 Header에서도 참조되지
 * 않는 미사용 export였다 — Phase 4B 정리에서 삭제했다(rg 참조 0건 확인). */
export const HERO_EYEBROW = 'DOHAN KIM / HUMAN SIGNAL';

/* Hero 헤드라인 — Figma Human Signal Hero(254:3, 257:5) 원문 2줄. 최신 Figma는
 * 두 줄 모두 Soft White 단색이라(강조 색 분리 없음) HeroSection.jsx에서도
 * 동일하게 렌더링한다. */
/* 줄 끝 공백은 시각적으로 보이지 않지만(block 줄바꿈 뒤 trailing space),
 * 보조기술이 읽는 DOM textContent에서 "복잡한 일을,이해되는 화면으로."처럼
 * 단어가 붙지 않게 한다(Phase 4B 접근성 재검사에서 발견). */
export const HERO_HEADLINE_LINES = ['복잡한 일을, ', '이해되는 화면으로.'];

/* Hero 설명 문구 — Figma Human Signal Hero(254:3, 257:6) 원문 그대로다.
 * SUB_DESCRIPTION과 별개로 관리한다. SUB_DESCRIPTION은 tools/site-audit-kit의
 * AI 활용 고지 문구로도 재사용되므로 Hero 시각 카피 교체와 분리해서 유지한다. */
export const HERO_DESCRIPTION_LINES = [
  '생산 현장과 구매관리에서 익힌 기준 확인과 누락 방지 습관을 바탕으로,',
  '복잡한 정보를 이해되는 화면으로 바꿉니다.',
];

/* 공개 Hero 승인 문구(HERO_HEADLINE_LINES)와 같은 정체성을 쓰도록 맞췄다.
 * review:build가 생성하는 검토용 HTML/PDF가 이 값을 그대로 노출하므로,
 * 공개 화면과 검토 자료가 서로 다른 포지셔닝을 말하지 않게 한다. */
export const POSITIONING_PREFIX = '복잡한 일을,';
export const POSITIONING_EMPHASIS = '이해되는';
export const POSITIONING_SUFFIX = '화면으로.';
export const POSITIONING_LINE = `${POSITIONING_PREFIX} ${POSITIONING_EMPHASIS} ${POSITIONING_SUFFIX}`;

/* tools/site-audit-kit의 AI 활용 고지 문구로 쓰인다(검사용 리뷰 페이지 전용).
 * Hero 시각 카피는 HERO_DESCRIPTION을 사용한다. */
export const SUB_DESCRIPTION =
  'Figma로 화면 흐름과 정보 구조를 정리하고, React/MUI로 반응형 웹 화면을 구현합니다. AI 도구는 문장 정리, 코드 점검, 개선안 비교에 보조적으로 활용했습니다.';

/* About 섹션 "지원 방향" 배지. 검사용 리뷰 페이지의 "지원 직무" 항목도 동일 데이터를 사용한다. */
export const APPLICATION_FOCUS = ['UX/UI', 'Web Publishing', 'React/MUI', 'Responsive QA'];

/* About 섹션 "사용 도구" 한 줄 */
export const TOOL_LINE = 'Figma · React/MUI · HTML/CSS/JavaScript · GitHub · Supabase · AI Tools';

/* 라이브 사이트 / 저장소 링크 — projectsFallbackData.js의 다른 프로젝트 github_url과
 * 동일한 규칙(레포 하위 경로)으로 구성했다. */
export const LIVE_SITE_URL = 'https://kdhan0320-bot.github.io/dohan-portfolio/my-portfolio/';
export const PROJECT_GITHUB_URL = 'https://github.com/kdhan0320-bot/dohan-portfolio/tree/main/projects/my-portfolio';

/* Human Signal Phase 5D: Detail READY 프로젝트별 presentation mapping.
 * Figma Detail READY(file 53Ppn2hIgrvs9Jra3eejFs, node 201:2/196:5/377:254/202:2)
 * 구조(Hero → Context → Key Decisions → Main Screens → Responsive & Scope →
 * 조건부 AI → Result & Limit)를 ProjectDetailPage.jsx가 이 데이터로 채운다.
 * media 경로는 public 루트 기준 상대 경로만 저장한다(이 파일은 import.meta.env를
 * 쓰지 않는 Node-safe 파일이라 BASE_URL 접두는 호출부인 projectsData.js/
 * ProjectDetailPage.jsx에서만 붙인다). Phase 5C 증거 ZIP manifest 대조로 확인된
 * 11개 PNG(jobflow 4 · feedback-hub 3 · bus-arrival 4)와 기존
 * bus-arrival-ui-thumbnail.png composite만 사용한다. */
export const PROJECT_DETAIL_READY = {
  jobflow: {
    hero: {
      summary: '취업 준비 과정의 지원 현황과 다음 행동을 한 화면에서 관리하도록 설계·구현한 대시보드입니다.',
      media: [
        { src: 'detail/jobflow-dashboard-1440.png', alt: '실제 브라우저 실행 화면 · JobFlow Dashboard · 게스트 sample data', aspectRatio: '1440 / 1077' },
        { src: 'detail/jobflow-dashboard-390.png', alt: '실제 브라우저 실행 화면 · JobFlow Dashboard 390px 1열 reflow · 게스트 sample data', aspectRatio: '390 / 844', objectFit: 'cover', objectPosition: 'top', frameWidth: 200 },
      ],
      mediaLabel: '실제 브라우저 실행 화면 · 게스트 sample data',
    },
    context: {
      problem: '지원 현황·전형 단계·체크리스트가 분산돼 다음 행동의 우선순위를 빠르게 파악하기 어렵습니다.',
      goal: '요약 → 상태 이동 → 준비 항목 확인이 한 흐름으로 이어지도록 화면을 구성합니다.',
    },
    decisions: [
      {
        title: '먼저 판단할 정보를 대시보드에 모았습니다.',
        choice: '지원 요약·상태 현황·체크리스트·할 일을 첫 화면에 배치',
        reason: '현재 상태와 다음 행동을 이동 없이 확인하기 위해',
        verification: '게스트 sample data가 표시된 실제 Dashboard와 390px 1열 reflow 확인',
        media: { src: 'detail/jobflow-dashboard-1440.png', alt: '실제 브라우저 실행 화면 · JobFlow Dashboard · 게스트 sample data' },
      },
      {
        title: '전형 상태를 보드 흐름으로 분리했습니다.',
        choice: '지원 단계를 column 단위 Kanban으로 구분',
        reason: '지원 건별 현재 위치를 빠르게 비교하기 위해',
        verification: '실제 Kanban 실행 화면 확인. 내부 가로 스크롤 구조이며 전체 column이 한 화면에 모두 보인다고 표현하지 않음',
        media: { src: 'detail/jobflow-kanban-1440.png', alt: '실제 브라우저 실행 화면 · JobFlow Kanban · 게스트 sample data' },
      },
      {
        title: '준비 항목을 진행률과 함께 보여줬습니다.',
        choice: '체크리스트 항목과 완료 상태를 한 화면에서 관리',
        reason: '누락을 줄이고 다음 준비 작업을 명확히 하기 위해',
        verification: '실제 Checklist 실행 화면 확인',
        media: { src: 'detail/jobflow-checklist-1440.png', alt: '실제 브라우저 실행 화면 · JobFlow Checklist · 게스트 sample data' },
      },
    ],
    mainScreens: [
      { label: 'Dashboard', media: { src: 'detail/jobflow-dashboard-1440.png', alt: '실제 브라우저 실행 화면 · JobFlow Dashboard · 게스트 sample data' } },
      { label: 'Kanban', media: { src: 'detail/jobflow-kanban-1440.png', alt: '실제 브라우저 실행 화면 · JobFlow Kanban · 게스트 sample data' } },
      { label: 'Checklist', media: { src: 'detail/jobflow-checklist-1440.png', alt: '실제 브라우저 실행 화면 · JobFlow Checklist · 게스트 sample data' } },
    ],
    scope: {
      actual: ['실제 브라우저 실행 Dashboard·Kanban·Checklist'],
      demoStatic: ['게스트 sample data', '게스트 저장·수정 제한'],
      notIncluded: ['고급 통계 리포트', '실시간 알림', '외부 채용 플랫폼 API 연동'],
    },
    resultLimit: {
      done: '지원 현황·상태 흐름·체크리스트를 실제 반응형 화면으로 연결하고 390px과 1440px에서 확인했습니다.',
      limit: '게스트 화면은 sample data이며 실제 사용자 성과나 운영 데이터가 아닙니다. Kanban은 내부 가로 스크롤을 사용합니다.',
    },
  },
  'feedback-hub': {
    hero: {
      summary: '포트폴리오를 탐색하고 피드백을 주고받는 흐름을 목록과 상세 화면으로 구성한 커뮤니티 UI demo입니다.',
      media: [
        { src: 'detail/feedback-list-1440.png', alt: '실제 브라우저 실행 화면 · Post List · static sample fallback', aspectRatio: '1440 / 900', objectFit: 'cover', objectPosition: 'top' },
        { src: 'detail/feedback-detail-1440.png', alt: '실제 브라우저 실행 화면 · Post Detail · static sample fallback', aspectRatio: '1440 / 900' },
      ],
      mediaLabel: '실제 브라우저 실행 화면 · static sample fallback',
    },
    context: {
      problem: '작업 탐색과 의견 확인이 분리되면 관심 주제와 대화 맥락을 이어서 보기 어렵습니다.',
      goal: '검색·카테고리·카드 탐색에서 상세 내용과 참여 안내까지 자연스럽게 연결합니다.',
    },
    decisions: [
      {
        title: '탐색 조건과 콘텐츠 카드를 같은 화면에 배치했습니다.',
        choice: '검색·카테고리 필터·카드 그리드',
        reason: '관심 주제를 빠르게 좁히고 목록을 비교하기 위해',
        verification: '실제 공개 목록 route에서 Supabase 200 빈 배열 후 static fallback 표시 확인',
        media: { src: 'detail/feedback-list-1440.png', alt: '실제 브라우저 실행 화면 · Post List · static sample fallback', aspectRatio: '1440 / 900', objectFit: 'cover', objectPosition: 'top' },
      },
      {
        title: '상세 내용과 참여 조건을 한 화면에서 구분했습니다.',
        choice: '본문·좋아요·댓글 영역과 로그인 안내',
        reason: '읽기는 공개하고 작성·반응은 인증 경계를 명확히 하기 위해',
        verification: '목록의 실제 카드에서 #/posts/sample-7 상세 route로 이동해 확인',
        media: { src: 'detail/feedback-detail-1440.png', alt: '실제 브라우저 실행 화면 · Post Detail · static sample fallback' },
      },
    ],
    // JobFlow/Bus는 첫 화면(Dashboard/Home)이 primary, 나머지가 secondary인
    // 위계 레이아웃을 쓰지만 Feedback Hub는 List/Detail 둘 다 같은 무게로 커야
    // 한다(지시서 6 "Main Screens" 기준) — 이 신호가 없으면 기본값(primary)이
    // 적용돼 1440에서 오른쪽에 큰 빈 공간이 남는다.
    mainScreensLayout: 'equal',
    mainScreens: [
      { label: 'Post List', media: { src: 'detail/feedback-list-1440.png', alt: '실제 브라우저 실행 화면 · Post List · static sample fallback', aspectRatio: '1440 / 900', objectFit: 'cover', objectPosition: 'top' } },
      { label: 'Post Detail', media: { src: 'detail/feedback-detail-1440.png', alt: '실제 브라우저 실행 화면 · Post Detail · static sample fallback' } },
    ],
    // 390×9453 full-page 검증 캡처. 원본을 세로로 늘여 넣지 않고 controlled
    // viewport(top alignment)로 1열 card stack 증거만 보여준다.
    responsiveEvidence: {
      src: 'detail/feedback-list-390.png', alt: '실제 브라우저 실행 화면 · Post List 390px 1열 카드 stack · static sample fallback',
      aspectRatio: '390 / 700', objectFit: 'cover', objectPosition: 'top', frameWidth: 200,
      caption: '390px full-page source의 상단 viewport',
    },
    scope: {
      actual: ['공개 목록·상세 route', '검색·카테고리 UI', 'Supabase posts 조회 요청'],
      demoStatic: ['posts 결과가 빈 배열일 때 SAMPLE_POSTS fallback', '화면의 게시글과 수치는 sample data'],
      notIncluded: ['실제 사용자 게시글·운영 데이터·활성 사용자 지표', '로그인 후 작성·댓글·좋아요는 이번 증거 회차에서 미검증'],
    },
    resultLimit: {
      done: '목록과 상세의 공개 탐색 흐름, 390px 1열 카드 stack을 실제 브라우저에서 확인했습니다.',
      limit: '현재 화면 콘텐츠는 정적 sample fallback이며 운영 커뮤니티 데이터가 아닙니다.',
    },
  },
  'bus-arrival': {
    responsiveNotApplicable: true,
    hero: {
      summary: '홈과 검색, 정류장·노선 상세, 즐겨찾기·알림 설정, 마이페이지와 로딩·오류 상태까지 설계했습니다.',
      media: [
        { src: 'thumbnails/bus-arrival-ui-thumbnail.png', alt: 'Figma prototype screen crop · 4-screen composite · static sample', objectFit: 'contain' },
      ],
      mediaLabel: 'Figma prototype screens · static sample',
    },
    context: {
      problem: '이동 중에는 노선·정류장·도착 정보를 짧은 시간 안에 구분해야 해 정보 우선순위가 중요합니다.',
      goal: '홈 → 검색 → 정류장·노선 상세로 이어지는 모바일 정보 흐름을 설계합니다.',
    },
    // Phase 5D-F3(지시서 3-E): 원본 세로 mobile screenshot 비율(275/500~555,
    // 약 0.5)을 Decision/Main Screens 카드 폭 그대로 쓰면 1024에서 페이지가
    // 8000px대로 늘어난다(전체 section 제거 없이 media stage 비율만 원인).
    // 원본 PNG는 그대로 두고 카드의 controlled stage 비율만 `3 / 2`로 고정한다
    // (objectFit 기본값 contain이라 전체 화면이 letterbox로 잘리지 않고 보인다).
    decisions: [
      {
        title: '자주 확인하는 정류장과 도착 정보를 먼저 배치했습니다.',
        choice: '홈에서 즐겨찾기 정류장과 도착 예정 정보 우선',
        reason: '반복 조회 정보를 첫 화면에서 바로 확인하기 위해',
        verification: 'Figma Home prototype screen crop',
        media: { src: 'detail/bus-arrival-01-home.png', alt: 'Figma prototype screen crop · Home', aspectRatio: '3 / 2' },
      },
      {
        title: '검색과 결과 확인 단계를 분리했습니다.',
        choice: '검색 진입과 결과 화면을 독립 흐름으로 설계',
        reason: '입력과 정보 읽기의 인지 부담을 나누기 위해',
        verification: 'Figma Search prototype screen crop. 원본 Figma에는 Search Empty와 No Result 상태도 존재',
        media: { src: 'detail/bus-arrival-02-search.png', alt: 'Figma prototype screen crop · Search', aspectRatio: '3 / 2' },
      },
      {
        title: '방향과 정류장 순서를 노선 상세에서 구분했습니다.',
        choice: '방향 탭과 정류장 리스트',
        reason: '같은 노선의 방향 혼동을 줄이기 위해',
        verification: 'Figma Route Detail prototype screen crop',
        media: { src: 'detail/bus-arrival-04-route-detail.png', alt: 'Figma prototype screen crop · Route Detail', aspectRatio: '3 / 2' },
      },
    ],
    // Search는 Decision 02 증거로만 쓰고 Main Screens에는 다시 넣지 않는다.
    mainScreens: [
      { label: 'Home', media: { src: 'detail/bus-arrival-01-home.png', alt: 'Figma prototype screen crop · Home', aspectRatio: '3 / 2' } },
      { label: 'Station Detail', media: { src: 'detail/bus-arrival-03-station-detail.png', alt: 'Figma prototype screen crop · Station Detail', aspectRatio: '3 / 2' } },
      { label: 'Route Detail', media: { src: 'detail/bus-arrival-04-route-detail.png', alt: 'Figma prototype screen crop · Route Detail', aspectRatio: '3 / 2' } },
    ],
    scope: {
      actual: ['Figma 정보구조·UI 설계', '11개 top-level screen: product/flow 9개 + Loading/Error state 2개'],
      demoStatic: ['Figma prototype', '정적 예시 정류장·노선·도착 정보'],
      notIncluded: ['실제 버스 도착 API', '실시간 데이터 처리', 'coded web/native app'],
    },
    resultLimit: {
      done: '홈·검색·정류장·노선 상세와 로딩·오류 상태까지 모바일 흐름을 설계했습니다.',
      limit: '실행 앱이 아니라 Figma prototype이며 실제 API와 실시간 데이터는 연결되지 않았습니다.',
    },
  },
};
