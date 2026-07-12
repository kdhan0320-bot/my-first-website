if (!process.env.TARGET_URL) {
  throw new Error('TARGET_URL 환경변수를 설정하세요. 예: $env:TARGET_URL="https://example.com"; npm run audit');
}
export const TARGET_URL = process.env.TARGET_URL;

export const SCREENSHOT_DIR = 'audit-output/screenshots';
export const RESULTS_FILE = 'audit-output/results.ndjson';
export const REPORT_FILE = 'audit-output/report.md';

export const VIEWPORTS: Record<string, { width: number; height: number; label: string }> = {
  pc: { width: 1440, height: 900, label: 'PC (1440x900)' },
  'pc-fhd': { width: 1920, height: 1080, label: 'PC Full HD (1920x1080)' },
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
