/* Hero/Contact 진입 모션과 prefers-reduced-motion 상태를 실제 시간대별 PNG로 저장한다.
 * 기존 site-audit-kit(Playwright, audit-output 산출물 규칙)을 그대로 따르며 별도의
 * QA 시스템을 만들지 않는다 - 이 스크립트도 TARGET_URL 환경변수와 audit-output 폴더를
 * 그대로 재사용한다.
 *
 * 실행: TARGET_URL="http://localhost:5183/dohan-portfolio/my-portfolio/" node scripts/capture-motion.js
 */
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright-core');

const TARGET_URL = process.env.TARGET_URL;
if (!TARGET_URL) {
  console.error('TARGET_URL 환경변수를 설정하세요.');
  process.exit(1);
}

const CHROME_PATH = process.env.CHROME_PATH; // 선택: 로컬에 캐시된 Chromium 실행 파일 경로 강제 지정
const MOTION_DIR = path.join('audit-output', 'screenshots', 'motion');
const REDUCED_DIR = path.join('audit-output', 'screenshots', 'reduced-motion');
fs.mkdirSync(MOTION_DIR, { recursive: true });
fs.mkdirSync(REDUCED_DIR, { recursive: true });

async function withBrowser(fn) {
  const browser = await chromium.launch(CHROME_PATH ? { executablePath: CHROME_PATH } : {});
  try {
    await fn(browser);
  } finally {
    await browser.close();
  }
}

async function captureHeroTimeline(browser, key, viewport) {
  const times = [0, 700, 1800, 2500];
  for (const t of times) {
    const page = await browser.newPage({ viewport });
    await page.goto(TARGET_URL, { waitUntil: 'domcontentloaded' });
    if (t > 0) await page.waitForTimeout(t);
    const file = path.join(MOTION_DIR, `hero-${key}-${String(t).padStart(3, '0')}ms.png`);
    await page.screenshot({ path: file });
    console.log('saved', file);
    await page.close();
  }
}

async function captureContactTimeline(browser) {
  const viewport = { width: 1440, height: 1000 };

  // before: Contact 섹션이 아직 뷰포트에 들어오기 전
  {
    const page = await browser.newPage({ viewport });
    await page.goto(TARGET_URL, { waitUntil: 'networkidle' });
    const contact = page.locator('#contact');
    const box = await contact.boundingBox();
    if (box) {
      // 섹션 상단 바로 위(진입 직전)로 스크롤
      await page.evaluate((y) => window.scrollTo(0, Math.max(0, y - 400)), box.y);
    }
    await page.waitForTimeout(200);
    await page.screenshot({ path: path.join(MOTION_DIR, 'contact-before.png') });
    await page.close();
  }

  // 400ms / 900ms / final: Contact 섹션을 실제로 스크롤해 뷰포트에 진입시킨 시점부터 측정
  for (const [label, delay] of [['contact-400ms.png', 400], ['contact-900ms.png', 900], ['contact-final.png', 2000]]) {
    const page = await browser.newPage({ viewport });
    await page.goto(TARGET_URL, { waitUntil: 'networkidle' });
    await page.locator('#contact').scrollIntoViewIfNeeded();
    await page.waitForTimeout(delay);
    await page.screenshot({ path: path.join(MOTION_DIR, label) });
    console.log('saved', label);
    await page.close();
  }
}

async function captureReducedMotion(browser) {
  {
    const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce' });
    await page.goto(TARGET_URL, { waitUntil: 'networkidle' });
    await page.waitForTimeout(300);
    await page.screenshot({ path: path.join(REDUCED_DIR, 'home-1440.png'), fullPage: true });
    await page.close();
  }
  {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
    await page.goto(TARGET_URL, { waitUntil: 'networkidle' });
    await page.waitForTimeout(300);
    await page.screenshot({ path: path.join(REDUCED_DIR, 'home-390.png'), fullPage: true });
    await page.close();
  }
  {
    const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce' });
    await page.goto(TARGET_URL, { waitUntil: 'networkidle' });
    await page.locator('#contact').scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    await page.screenshot({ path: path.join(REDUCED_DIR, 'contact-1440.png') });
    await page.close();
  }
}

(async () => {
  await withBrowser(async (browser) => {
    await captureHeroTimeline(browser, 'desktop', { width: 1440, height: 1000 });
    await captureHeroTimeline(browser, 'mobile', { width: 390, height: 844 });
    await captureContactTimeline(browser);
    await captureReducedMotion(browser);
  });
  console.log('모션 캡처 완료');
})();
