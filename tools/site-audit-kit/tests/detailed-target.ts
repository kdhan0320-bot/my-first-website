// TARGET_URL 존재 여부 체크는 여기서 즉시 throw하지 않는다 - 이 파일은 playwright.detailed.config.ts가
// DETAILED_VIEWPORTS를 읽기 위해 항상 import하므로, 여기서 throw하면 TARGET_URL 없이는 설정 로드/테스트
// 목록 조회조차 불가능해진다. 대신 TARGET_URL은 string | undefined로 정직하게 노출하고, 실제로 URL이
// 필요한 지점(detailed-global-setup, page.goto 직전)마다 assertTargetUrl()로 매번 검증한다.
export const TARGET_URL = process.env.TARGET_URL;

export function assertTargetUrl(): string {
  const url = process.env.TARGET_URL;
  if (!url) {
    throw new Error('TARGET_URL 환경변수를 설정하세요. 예: $env:TARGET_URL="https://example.com"; npm run audit:detailed');
  }
  return url;
}

// Phase 4B: target.ts(basic audit)와 분리한 이유는 tests/target.ts의 SCREENSHOT_DIR
// 주석 참고 — basic audit의 global-setup.ts가 스크린샷 폴더 전체를 지우기 때문에
// 같은 폴더를 쓰면 detailed PNG가 사라지는 실제 버그가 있었다.
export const SCREENSHOT_DIR = 'audit-output/screenshots/detailed';
export const DETAILED_RESULTS_FILE = 'audit-output/detailed-results.ndjson';
export const REPORT_FILE = 'audit-output/report.md';
export const MOTION_CHECK_FILE = 'audit-output/motion-check.json';
export const VIDEO_DIR = 'audit-output/videos';

/* Human Signal Phase 3C 2차 재검토: 반응형 확인 폭을
 * 390/430/768/820/1024/1366/1440/1920/2560 9개로 맞췄다(project/my-portfolio
 * docs/design-reference.md의 breakpoint 표 — Mobile 390 / Tablet 768 /
 * Compact 1024 / Desktop 1440 / QHD 2560 — 을 기준으로 확장). 기존
 * DETAILED_VIEWPORTS는 이 목록과 어긋나 있었다(1280/834/375를 쓰고
 * 768/820/1366/1920이 빠짐) — 검사 대상을 실제 디자인 기준 breakpoint와
 * 맞춘다(폭을 줄이는 게 아니라 공식 기준에 맞게 교체하는 것이라 테스트
 * 약화가 아니다).
 *
 * Phase 5A-R: 실제 2560 물리 모니터에서도 OS 배율(100/125/150%)·브라우저
 * chrome·zoom에 따라 CSS viewport(`window.innerWidth`)는 2560보다 작을 수
 * 있다는 사용자 피드백에 따라, 1920~2560 사이 CSS viewport를 흉내 내는 proxy
 * 폭 5개(1707≈2560/150%, 2048=2560/125%, 2133/2304는 중간 폭 회귀 확인용,
 * 2480=QHD_DECORATION_MIN_WIDTH)를 추가한다. 새 config를 만들지 않고 기존
 * DETAILED_VIEWPORTS를 확장한다. */
export const DETAILED_VIEWPORTS: Record<
  string,
  { width: number; height: number; label: string; file: string }
> = {
  'desktop-2560': { width: 2560, height: 1440, label: 'Desktop QHD (2560x1440)', file: 'desktop-2560.png' },
  'desktop-2480': { width: 2480, height: 1395, label: 'QHD decoration threshold (2480x1395)', file: 'desktop-2480.png' },
  'desktop-2304': { width: 2304, height: 1296, label: 'QHD mid-width regression (2304x1296)', file: 'desktop-2304.png' },
  'desktop-2133': { width: 2133, height: 1200, label: 'QHD mid-width regression (2133x1200)', file: 'desktop-2133.png' },
  'desktop-2048': { width: 2048, height: 1152, label: '2560 / 125% scaling proxy (2048x1152)', file: 'desktop-2048.png' },
  'desktop-1920': { width: 1920, height: 1080, label: 'Desktop Full HD (1920x1080)', file: 'desktop-1920.png' },
  'desktop-1707': { width: 1707, height: 960, label: '2560 / 150% scaling proxy (1707x960)', file: 'desktop-1707.png' },
  'desktop-1440': { width: 1440, height: 900, label: 'Desktop (1440x900)', file: 'desktop-1440.png' },
  'desktop-1366': { width: 1366, height: 768, label: 'Desktop Laptop (1366x768)', file: 'desktop-1366.png' },
  'tablet-1024': { width: 1024, height: 768, label: 'Tablet Landscape (1024x768)', file: 'tablet-1024.png' },
  'tablet-820': { width: 820, height: 1180, label: 'Tablet Portrait (820x1180)', file: 'tablet-820.png' },
  'mobile-768': { width: 768, height: 1024, label: 'Tablet Small / Mobile Wide (768x1024)', file: 'mobile-768.png' },
  'mobile-430': { width: 430, height: 932, label: 'Mobile Large (430x932)', file: 'mobile-430.png' },
  'mobile-390': { width: 390, height: 844, label: 'Mobile Medium (390x844)', file: 'mobile-390.png' },
};
