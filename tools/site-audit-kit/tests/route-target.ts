// TARGET_URL 검증 패턴은 target.ts/detailed-target.ts와 동일하다(설정 로드 시점에는
// throw하지 않고, 실제 URL이 필요한 지점에서만 assertTargetUrl()로 검증).
export const TARGET_URL = process.env.TARGET_URL;

export function assertTargetUrl(): string {
  const url = process.env.TARGET_URL;
  if (!url) {
    throw new Error('TARGET_URL 환경변수를 설정하세요. 예: $env:TARGET_URL="https://example.com"; npm run audit:routes');
  }
  return url.endsWith('/') ? url : `${url}/`;
}

export const RESULTS_FILE = 'audit-output/route-regression-results.ndjson';
export const REPORT_FILE = 'audit-output/route-regression-report.md';

// Phase 4D 8-5: 6개 route를 390/1440/2560 3개 viewport에서 실제로 연다.
export const ROUTE_VIEWPORTS: Record<string, { width: number; height: number }> = {
  '390': { width: 390, height: 844 },
  '1440': { width: 1440, height: 900 },
  '2560': { width: 2560, height: 1440 },
};

export const ROUTES: {
  path: string;
  label: string;
  isDetail?: boolean;
  expectNotFound?: boolean;
}[] = [
  { path: '', label: 'Home' },
  { path: '#/projects', label: 'Projects list' },
  { path: '#/projects/jobflow', label: 'JobFlow detail', isDetail: true },
  { path: '#/projects/bus-arrival', label: 'Bus Arrival detail', isDetail: true },
  { path: '#/projects/feedback-hub', label: 'Feedback Hub detail', isDetail: true },
  { path: '#/this-route-does-not-exist', label: '404 route', expectNotFound: true },
];
