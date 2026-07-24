import fs from 'fs';
import path from 'path';
import { SCREENSHOT_DIR, DETAILED_RESULTS_FILE, assertTargetUrl } from './detailed-target';

// 기존 npm run audit 결과물은 지우지 않는다 - screenshots/detailed와 screenshots/sections로
// 폴더 자체가 분리돼 있어(target.ts SCREENSHOT_DIR 주석 참고) 서로의 정리 시점에 영향받지 않는다.
export default async function globalSetup() {
  const targetUrl = assertTargetUrl();

  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
  fs.mkdirSync(path.dirname(DETAILED_RESULTS_FILE), { recursive: true });
  fs.writeFileSync(DETAILED_RESULTS_FILE, '');
  fs.appendFileSync(
    DETAILED_RESULTS_FILE,
    JSON.stringify({ kind: 'meta', targetUrl, startedAt: new Date().toISOString() }) + '\n'
  );
}
