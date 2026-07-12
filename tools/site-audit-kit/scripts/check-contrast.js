// 저대비 자동 스캔 + 항목별 크롭 스크린샷 생성 (육안 재확인용)
// 출력: audit-output/contrast-check.json, audit-output/screenshots/contrast-crops/*.png
const fs = require('fs');
const path = require('path');
const { chromium } = require('@playwright/test');

if (!process.env.TARGET_URL) {
  throw new Error('TARGET_URL 환경변수를 설정하세요. 예: $env:TARGET_URL="https://example.com"; node scripts/check-contrast.js');
}
const TARGET_URL = process.env.TARGET_URL;
const OUT_DIR = path.join('audit-output');
const CROP_DIR = path.join(OUT_DIR, 'screenshots', 'contrast-crops');
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

  const contrasts = await page.evaluate(() => {
    function parseColor(str) {
      const m = str.match(/rgba?\(([^)]+)\)/);
      if (!m) return null;
      const parts = m[1].split(',').map((s) => parseFloat(s.trim()));
      return { r: parts[0], g: parts[1], b: parts[2], a: parts[3] ?? 1 };
    }
    function luminance(c) {
      const [r, g, b] = [c.r, c.g, c.b].map((v) => {
        const s = v / 255;
        return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
      });
      return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    }
    function bgColor(el) {
      let node = el;
      while (node) {
        const c = parseColor(getComputedStyle(node).backgroundColor);
        if (c && c.a > 0) return c;
        node = node.parentElement;
      }
      return { r: 255, g: 255, b: 255 };
    }
    const textEls = Array.from(document.querySelectorAll('h1, h2, h3, p, button, a, span')).filter(
      (el) => (el.textContent || '').trim().length > 1 && el.children.length === 0
    );
    const out = [];
    let idx = 0;
    for (const el of textEls) {
      const style = getComputedStyle(el);
      if (style.visibility === 'hidden' || style.display === 'none') continue;
      const fg = parseColor(style.color);
      if (!fg) continue;
      const bg = bgColor(el);
      const l1 = luminance(fg) + 0.05;
      const l2 = luminance(bg) + 0.05;
      const ratio = l1 > l2 ? l1 / l2 : l2 / l1;
      const fontSize = parseFloat(style.fontSize);
      const threshold = fontSize >= 24 ? 3 : 4.5;
      const rect = el.getBoundingClientRect();
      if (ratio < threshold && rect.width > 0 && rect.height > 0) {
        out.push({
          idx: idx++,
          text: (el.textContent || '').trim().slice(0, 60),
          tag: el.tagName,
          ratio: Math.round(ratio * 100) / 100,
          threshold,
          fontSize,
          fgColor: style.color,
          bgColorDetected: `rgb(${Math.round(bg.r)}, ${Math.round(bg.g)}, ${Math.round(bg.b)})`,
          rect: { x: Math.round(rect.x), y: Math.round(rect.y) + window.scrollY, width: Math.round(rect.width), height: Math.round(rect.height) },
        });
      }
    }
    return out;
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
