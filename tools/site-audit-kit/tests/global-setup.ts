import fs from 'fs';
import path from 'path';
import { SCREENSHOT_DIR, RESULTS_FILE, TARGET_URL } from './target';

export default async function globalSetup() {
  fs.rmSync(SCREENSHOT_DIR, { recursive: true, force: true });
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });

  fs.mkdirSync(path.dirname(RESULTS_FILE), { recursive: true });
  fs.writeFileSync(RESULTS_FILE, '');

  fs.appendFileSync(
    RESULTS_FILE,
    JSON.stringify({ kind: 'meta', targetUrl: TARGET_URL, startedAt: new Date().toISOString() }) + '\n'
  );
}
