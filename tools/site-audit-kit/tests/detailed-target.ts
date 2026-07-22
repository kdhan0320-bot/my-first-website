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

export const SCREENSHOT_DIR = 'audit-output/screenshots';
export const DETAILED_RESULTS_FILE = 'audit-output/detailed-results.ndjson';
export const REPORT_FILE = 'audit-output/report.md';
export const MOTION_CHECK_FILE = 'audit-output/motion-check.json';
export const VIDEO_DIR = 'audit-output/videos';

/* Human Signal Phase 3C 2차 재검토: projects/my-portfolio/CLAUDE.md의 검증
 * 규칙이 명시하는 반응형 확인 폭은 390/430/768/820/1024/1366/1440/1920/2560
 * 9개다. 기존 DETAILED_VIEWPORTS는 이 목록과 어긋나 있었다(1280/834/375를
 * 쓰고 768/820/1366/1920이 빠짐) — 검사 대상을 프로젝트가 실제로 정한
 * 기준과 맞춘다(폭을 줄이는 게 아니라 공식 기준에 맞게 교체하는 것이라
 * 테스트 약화가 아니다). */
export const DETAILED_VIEWPORTS: Record<
  string,
  { width: number; height: number; label: string; file: string }
> = {
  'desktop-2560': { width: 2560, height: 1440, label: 'Desktop QHD (2560x1440)', file: 'desktop-2560.png' },
  'desktop-1920': { width: 1920, height: 1080, label: 'Desktop Full HD (1920x1080)', file: 'desktop-1920.png' },
  'desktop-1440': { width: 1440, height: 900, label: 'Desktop (1440x900)', file: 'desktop-1440.png' },
  'desktop-1366': { width: 1366, height: 768, label: 'Desktop Laptop (1366x768)', file: 'desktop-1366.png' },
  'tablet-1024': { width: 1024, height: 768, label: 'Tablet Landscape (1024x768)', file: 'tablet-1024.png' },
  'tablet-820': { width: 820, height: 1180, label: 'Tablet Portrait (820x1180)', file: 'tablet-820.png' },
  'mobile-768': { width: 768, height: 1024, label: 'Tablet Small / Mobile Wide (768x1024)', file: 'mobile-768.png' },
  'mobile-430': { width: 430, height: 932, label: 'Mobile Large (430x932)', file: 'mobile-430.png' },
  'mobile-390': { width: 390, height: 844, label: 'Mobile Medium (390x844)', file: 'mobile-390.png' },
};
