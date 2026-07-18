import fs from 'fs';
import path from 'path';
import { SCREENSHOT_DIR, DETAILED_RESULTS_FILE, assertTargetUrl } from './detailed-target';

// 기존 npm run audit 결과물(screenshots)은 지우지 않는다 - 파일명이 겹치지 않으므로 함께 보존한다.
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
