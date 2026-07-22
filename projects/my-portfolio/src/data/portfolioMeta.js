/* my-portfolio 공용 정체성/포지셔닝 메타데이터
 * 브라우저(Vite/React, Hero/About 섹션)와 Node(tools/site-audit-kit의 검사용
 * 리뷰 페이지 생성 스크립트) 양쪽에서 동일하게 import해서 쓴다.
 * import.meta.env 등 Vite 전용 API는 쓰지 않는다 (Node에서도 그대로 실행 가능해야 함).
 * 문구를 바꿀 때는 Hero/About 화면과 검사용 리뷰 페이지에 함께 반영되므로
 * 이 파일만 수정하면 된다.
 */

export const NAME = '김도한';

export const HERO_BADGE = `${NAME} | UX/UI · Web Publishing Portfolio`;

/* Human Signal Phase 3B: 기존 "FIELD → INTERFACE"는 처음 보는 채용 담당자가
 * 해석해야 하는 내부 디자인 용어처럼 읽혀 제거했다(ChatGPT 재검토 확정).
 * 현장 경험→정보 구조 전환이라는 원래 의도는 About 본문에서 문장으로
 * 설명하고, Hero eyebrow는 지원 분야를 바로 알려주는 역할로 바꾼다. */
export const HERO_LABEL = 'UX/UI 설계 · 웹퍼블리싱 · UI 구현';
export const HERO_ROLE_LINE = 'UX/UI · WEB PUBLISHING';

/* Hero 헤드라인 — Figma Human Signal Hero 180:516/180:517 원문 2줄.
 * 둘째 줄만 Bright Orange로 강조한다(HeroSection.jsx에서 처리). */
export const HERO_HEADLINE_LINES = ['복잡한 일을,', '이해되는 화면으로.'];

/* Hero 설명 문구 (Figma Human Signal Hero 180:518 원문) — SUB_DESCRIPTION과
 * 별개로 관리한다. SUB_DESCRIPTION은 tools/site-audit-kit의 AI 활용 고지
 * 문구로도 재사용되므로 Hero 시각 카피 교체와 분리해서 유지한다. */
export const HERO_DESCRIPTION_LINES = [
  '생산 현장과 구매관리에서 배운 기준 확인과 누락 방지 습관을 바탕으로,',
  '복잡한 정보를 구조화하고 반응형 UI로 구현·검증합니다.',
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
