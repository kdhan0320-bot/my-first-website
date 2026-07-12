const fs = require('fs');
const path = require('path');

const OUTPUT_DIR = 'audit-output';
const SCREENSHOT_DIR = path.join(OUTPUT_DIR, 'screenshots');

fs.rmSync(OUTPUT_DIR, { recursive: true, force: true });
fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });

console.log('audit-output/ 전체를 초기화했습니다.');
