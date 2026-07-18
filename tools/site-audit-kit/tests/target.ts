// TARGET_URL 존재 여부 체크는 여기서 즉시 throw하지 않는다 - 이 파일은 playwright.config.ts가
// VIEWPORTS를 읽기 위해 항상 import하므로, 여기서 throw하면 TARGET_URL 없이는 설정 로드/테스트
// 목록 조회조차 불가능해진다 (VSCode Playwright 확장이 이 상태를 에러로 표시함).
// 대신 TARGET_URL은 string | undefined로 정직하게 노출하고, 실제로 URL이 필요한 지점
// (global-setup, page.goto 직전)마다 assertTargetUrl()로 매번 검증한다 - 검증을 깜빡한 새 코드가
// 있어도 undefined가 조용히 새어나가지 않고 바로 에러로 드러난다.
export const TARGET_URL = process.env.TARGET_URL;

export function assertTargetUrl(): string {
  const url = process.env.TARGET_URL;
  if (!url) {
    throw new Error('TARGET_URL 환경변수를 설정하세요. 예: $env:TARGET_URL="https://example.com"; npm run audit');
  }
  return url;
}

export const SCREENSHOT_DIR = 'audit-output/screenshots';
export const RESULTS_FILE = 'audit-output/results.ndjson';
export const REPORT_FILE = 'audit-output/report.md';

export const VIEWPORTS: Record<string, { width: number; height: number; label: string }> = {
  pc: { width: 1440, height: 900, label: 'PC (1440x900)' },
  'pc-fhd': { width: 1920, height: 1080, label: 'PC Full HD (1920x1080)' },
  'pc-qhd': { width: 2560, height: 1440, label: 'PC QHD (2560x1440)' },
  mobile: { width: 390, height: 844, label: 'Mobile (390x844)' },
  tablet: { width: 820, height: 1180, label: 'Tablet (820x1180)' },
};

export const SECTIONS = [
  { key: 'hero', id: 'home', label: 'Hero', textFallback: /Hero|홈|Home/i, scrollRatio: 0 },
  { key: 'projects', id: 'projects', label: 'Projects', textFallback: /Projects?|프로젝트/i, scrollRatio: 0.4 },
  {
    key: 'about-skills',
    id: 'about',
    label: 'About/Skills',
    textFallback: /About|Skills?|소개|스킬|역량/i,
    scrollRatio: 0.2,
  },
  {
    key: 'contact-footer',
    id: 'contact',
    label: 'Contact/Footer',
    textFallback: /Contact|연락처|Footer|Email|문의/i,
    scrollRatio: 0.9,
  },
] as const;

export const MOBILE_MENU_FILE = 'mobile-menu-open.png';
