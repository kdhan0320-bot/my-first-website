/* my-portfolio 공용 정체성/포지셔닝 메타데이터
 * 브라우저(Vite/React, Hero/About 섹션)와 Node(tools/site-audit-kit의 검사용
 * 리뷰 페이지 생성 스크립트) 양쪽에서 동일하게 import해서 쓴다.
 * import.meta.env 등 Vite 전용 API는 쓰지 않는다 (Node에서도 그대로 실행 가능해야 함).
 * 문구를 바꿀 때는 Hero/About 화면과 검사용 리뷰 페이지에 함께 반영되므로
 * 이 파일만 수정하면 된다.
 */

export const NAME = '김도한';

export const HERO_BADGE = `${NAME} | UX/UI · Web Publishing Portfolio`;

/* Hero 상단 라벨/역할 표기 (Figma Hero 42:14 원문) */
export const HERO_LABEL = 'KIM DOHAN / ORDERED SIGNAL';
export const HERO_ROLE_LINE = 'UX/UI DESIGN · WEB PUBLISHING · FRONT-END IMPLEMENTATION';

/* Hero 헤드라인 — Figma 원문 그대로 4줄 하드 브레이크 (42:19) */
export const HERO_HEADLINE_LINES = ['복잡한 정보를', '정리하고,', '구현 가능한 화면으로', '연결합니다.'];

/* Hero 설명 문구 (Figma 원문, 42:20) — SUB_DESCRIPTION과 별개로 관리한다.
 * SUB_DESCRIPTION은 tools/site-audit-kit의 AI 활용 고지 문구로도 재사용되므로
 * Hero 시각 카피 교체와 분리해서 유지한다. */
export const HERO_DESCRIPTION = '흩어진 정보를 기준에 맞춰 정리하고, 구현 가능한 화면 구조로 연결하는 과정을 보여줍니다.';

export const POSITIONING_PREFIX = '복잡한 정보를 정리하고,';
export const POSITIONING_EMPHASIS = '구현 가능한';
export const POSITIONING_SUFFIX = '화면으로 연결합니다.';
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
