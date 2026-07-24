import fs from 'fs';
import path from 'path';
import { RESULTS_FILE, assertTargetUrl } from './route-target';

export default async function globalSetup() {
  const targetUrl = assertTargetUrl();
  fs.mkdirSync(path.dirname(RESULTS_FILE), { recursive: true });
  fs.writeFileSync(RESULTS_FILE, '');
  fs.appendFileSync(RESULTS_FILE, JSON.stringify({ kind: 'meta', targetUrl, startedAt: new Date().toISOString() }) + '\n');
}
