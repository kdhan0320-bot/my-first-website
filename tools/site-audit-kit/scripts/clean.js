const fs = require('fs');
const path = require('path');

const SCREENSHOT_DIR = path.join('audit-output', 'screenshots');
const REPORT_FILE = path.join('audit-output', 'report.md');

fs.rmSync(SCREENSHOT_DIR, { recursive: true, force: true });
fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
fs.rmSync(REPORT_FILE, { force: true });

console.log('audit-output/screenshots 와 report.md 를 초기화했습니다.');
