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

export const DETAILED_VIEWPORTS: Record<
  string,
  { width: number; height: number; label: string; file: string }
> = {
  'desktop-1440': { width: 1440, height: 1000, label: 'Desktop Large (1440x1000)', file: 'desktop-1440.png' },
  'desktop-1280': { width: 1280, height: 900, label: 'Desktop Small (1280x900)', file: 'desktop-1280.png' },
  'tablet-1024': { width: 1024, height: 768, label: 'Tablet Landscape (1024x768)', file: 'tablet-1024.png' },
  'tablet-834': { width: 834, height: 1112, label: 'Tablet Portrait (834x1112)', file: 'tablet-834.png' },
  'mobile-430': { width: 430, height: 932, label: 'Mobile Large (430x932)', file: 'mobile-430.png' },
  'mobile-390': { width: 390, height: 844, label: 'Mobile Medium (390x844)', file: 'mobile-390.png' },
  'mobile-375': { width: 375, height: 812, label: 'Mobile Small (375x812)', file: 'mobile-375.png' },
};
