// 저대비 자동 스캔 + 항목별 크롭 스크린샷 생성 (육안 재확인용)
// 출력: audit-output/contrast-check.json, audit-output/screenshots/contrast-crops/*.png
const fs = require('fs');
const path = require('path');
const { chromium } = require('@playwright/test');
const { scanContrastInPage } = require('./contrast-scan');

if (!process.env.TARGET_URL) {
  throw new Error('TARGET_URL 환경변수를 설정하세요. 예: $env:TARGET_URL="https://example.com"; node scripts/check-contrast.js');
}
const TARGET_URL = process.env.TARGET_URL;
const OUT_DIR = path.join('audit-output');
const CROP_DIR = path.join(OUT_DIR, 'screenshots', 'contrast-crops');
// 실행마다 이전 크롭을 지우고 새로 만든다 - 안 지우면 이전 회차에 더 많이 잡혔던
// crop-NN.png가 이번 회차 결과보다 인덱스가 커서 안 덮어써지고 계속 쌓인다.
fs.rmSync(CROP_DIR, { recursive: true, force: true });
fs.mkdirSync(CROP_DIR, { recursive: true });

async function scrollThroughPage(page) {
  await page.evaluate(async () => {
    const step = 400;
    const height = document.body.scrollHeight;
    for (let y = 0; y < height; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 100));
    }
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(300);
}

async function main() {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  await page.goto(TARGET_URL, { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);
  await scrollThroughPage(page);

  const { low: contrasts } = await page.evaluate(scanContrastInPage, {
    selectors: 'h1, h2, h3, p, button, a, span',
    leafOnly: true,
  });

  console.log(`저대비 후보 ${contrasts.length}건 발견 - 항목별 크롭 캡처 중...`);

  const results = [];
  for (const item of contrasts) {
    const padding = 24;
    const clip = {
      x: Math.max(0, item.rect.x - padding),
      y: Math.max(0, item.rect.y - padding),
      width: item.rect.width + padding * 2,
      height: item.rect.height + padding * 2,
    };
    await page.evaluate((y) => window.scrollTo(0, Math.max(0, y - 300)), item.rect.y);
    await page.waitForTimeout(150);
    const cropFile = `crop-${String(item.idx).padStart(2, '0')}.png`;
    try {
      const scrollY = await page.evaluate(() => window.scrollY);
      const viewportClip = { ...clip, y: clip.y - scrollY };
      await page.screenshot({ path: path.join(CROP_DIR, cropFile), clip: viewportClip });
      results.push({ ...item, cropFile, captureOk: true });
    } catch (e) {
      results.push({ ...item, cropFile: null, captureOk: false, captureError: String(e.message || e) });
    }
  }

  fs.writeFileSync(
    path.join(OUT_DIR, 'contrast-check.json'),
    JSON.stringify({ targetUrl: TARGET_URL, checkedAt: new Date().toISOString(), totalFlagged: results.length, items: results }, null, 2),
    'utf-8'
  );
  await browser.close();
  console.log(`완료: audit-output/contrast-check.json (${results.length}건)`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
