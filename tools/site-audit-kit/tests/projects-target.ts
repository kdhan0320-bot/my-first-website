// TARGET_URL 검증 패턴은 target.ts/detailed-target.ts/route-target.ts와 동일하다
// (설정 로드 시점에는 throw하지 않고, 실제 URL이 필요한 지점에서만 검증한다).
export const TARGET_URL = process.env.TARGET_URL;

export function assertTargetUrl(): string {
  const url = process.env.TARGET_URL;
  if (!url) {
    throw new Error('TARGET_URL 환경변수를 설정하세요. 예: $env:TARGET_URL="https://example.com"; npm run audit:projects');
  }
  return url.endsWith('/') ? url : `${url}/`;
}

export const RESULTS_FILE = 'audit-output/projects-results.ndjson';
export const REPORT_FILE = 'audit-output/projects-report.md';

// Phase 5A: /projects 전용 검사 — 기존 route regression(390/1440/2560)과 달리
// QHD index geometry까지 확인해야 해서 1920도 추가하고, 768/1024도 포함해 doc
// 10-2가 요구하는 6개 viewport를 전부 커버한다.
//
// Phase 5A-R: 사용자가 실제 2560 모니터에서 QHD 장식 잘림을 발견해 표시 기준이
// `QHD_DECORATION_MIN_WIDTH`(2480, my-portfolio `theme.js`)로 바뀌었다 — 1920은
// 더 이상 "visible" 기준이 아니다. 1920~2560 사이 OS 배율(100/125/150%) proxy
// 폭도 추가해 이 구간 전체가 잘림 없이 hidden으로 유지되는지 확인한다.
export const PROJECTS_VIEWPORTS: Record<string, { width: number; height: number }> = {
  '390': { width: 390, height: 844 },
  '768': { width: 768, height: 1024 },
  '1024': { width: 1024, height: 768 },
  '1440': { width: 1440, height: 900 },
  '1707': { width: 1707, height: 960 },
  '1920': { width: 1920, height: 1080 },
  '2048': { width: 2048, height: 1152 },
  '2133': { width: 2133, height: 1200 },
  '2304': { width: 2304, height: 1296 },
  '2480': { width: 2480, height: 1395 },
  '2560': { width: 2560, height: 1440 },
};

export const QHD_VIEWPORTS = ['2480', '2560'];
export const QHD_HIDDEN_VIEWPORTS = ['390', '768', '1024', '1440', '1707', '1920', '2048', '2133', '2304'];
