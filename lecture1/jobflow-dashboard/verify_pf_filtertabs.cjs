const { chromium } = require('playwright');

const BASE = process.env.QA_BASE_URL || 'https://kdhan0320-bot.github.io/my-first-website/my-portfolio/';
const VIEWPORTS = [
  { name: '1440', width: 1440, height: 900 },
  { name: '1280', width: 1280, height: 800 },
  { name: '1024', width: 1024, height: 800 },
  { name: '768', width: 768, height: 1024 },
  { name: '430', width: 430, height: 932 },
  { name: '390', width: 390, height: 844 },
  { name: '375', width: 375, height: 812 },
  { name: '360', width: 360, height: 800 },
];

const results = [];
const log = (label, ok, detail = '') => {
  results.push({ label, ok, detail });
  console.log(`${ok ? 'OK ' : 'FAIL'} - ${label}${detail ? ' :: ' + detail : ''}`);
};

(async () => {
  const browser = await chromium.launch({ headless: true });

  // ---------- 1. 필터 탭 기능 QA (데스크톱 1280) ----------
  const page = await browser.newPage();
  const consoleErrors = [];
  page.on('console', (m) => { if (m.type() === 'error') consoleErrors.push(m.text()); });
  page.on('pageerror', (e) => consoleErrors.push(String(e)));
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto(BASE + '#/projects', { waitUntil: 'networkidle' });
  await page.waitForTimeout(600);

  const tabs = ['전체', '대표 작업', 'AI 도구 활용', '프론트엔드 구현', 'Figma UX/UI', '리디자인'];
  for (const tabLabel of tabs) {
    const tabExists = await page.locator('[role="tab"]', { hasText: tabLabel }).count();
    log(`탭 존재: ${tabLabel}`, tabExists > 0);
    if (tabExists === 0) continue;
    await page.locator('[role="tab"]', { hasText: tabLabel }).click();
    await page.waitForTimeout(400);
    const bodyText = await page.locator('body').innerText();
    const cardCount = await page.locator('.MuiCard-root').count();
    log(`탭 클릭 후 카드 표시: ${tabLabel}`, cardCount > 0, `cards=${cardCount}`);

    if (tabLabel === 'AI 도구 활용') {
      log('AI 탭에 JobFlow 포함', bodyText.includes('JobFlow'));
      log('AI 탭에 Feedback Hub 포함', bodyText.includes('Feedback Hub') || bodyText.includes('feedback'));
      log('AI 탭에 Mini SNS 미포함', !bodyText.includes('Mini SNS'));
      log('AI 탭에 OTT Service 미포함', !bodyText.includes('OTT Service'));
    }
    if (tabLabel === '프론트엔드 구현') {
      log('프론트엔드 탭에 Mini SNS 포함', bodyText.includes('Mini SNS'));
      log('프론트엔드 탭에 OTT Service 포함', bodyText.includes('OTT Service'));
      log('프론트엔드 탭에 JobFlow 미포함', !bodyText.includes('JobFlow'));
      log('프론트엔드 탭에 Feedback Hub 미포함', !bodyText.includes('Feedback Hub'));
    }
  }

  log('필터 탭 QA 전체 콘솔 에러 없음', consoleErrors.length === 0, consoleErrors.slice(0, 5).join(' | '));

  // 링크 확인: 프론트엔드 탭에서 Mini SNS, OTT 링크
  await page.locator('[role="tab"]', { hasText: '프론트엔드 구현' }).click();
  await page.waitForTimeout(400);
  const liveLinks = await page.locator('a', { hasText: '실행 화면 보기' }).evaluateAll((els) => els.map((e) => e.getAttribute('href')));
  log('프론트엔드 탭 실행화면 링크 존재', liveLinks.length >= 2, liveLinks.join(', '));

  await page.close();

  // ---------- 2. 반응형 QA ----------
  for (const vp of VIEWPORTS) {
    const p = await browser.newPage();
    const errs = [];
    p.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
    p.on('pageerror', (e) => errs.push(String(e)));
    await p.setViewportSize({ width: vp.width, height: vp.height });
    await p.goto(BASE + '#/projects', { waitUntil: 'networkidle' });
    await p.waitForTimeout(500);

    const scrollWidth = await p.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await p.evaluate(() => document.documentElement.clientWidth);
    log(`[${vp.name}px] 가로 스크롤 없음`, scrollWidth <= clientWidth + 1, `sw=${scrollWidth} cw=${clientWidth}`);

    const frontendTabVisible = await p.locator('[role="tab"]', { hasText: '프론트엔드 구현' }).count();
    log(`[${vp.name}px] 프론트엔드 구현 탭 존재`, frontendTabVisible > 0);

    if (frontendTabVisible > 0) {
      await p.locator('[role="tab"]', { hasText: '프론트엔드 구현' }).scrollIntoViewIfNeeded();
      await p.locator('[role="tab"]', { hasText: '프론트엔드 구현' }).click();
      await p.waitForTimeout(400);
      const cardCount = await p.locator('.MuiCard-root').count();
      log(`[${vp.name}px] 프론트엔드 탭 클릭 후 카드`, cardCount > 0, `cards=${cardCount}`);
    }

    log(`[${vp.name}px] 콘솔 에러 없음`, errs.length === 0, errs.slice(0, 3).join(' | '));
    await p.close();
  }

  await browser.close();

  const fails = results.filter((r) => !r.ok);
  console.log('\n=== SUMMARY ===');
  console.log(`TOTAL: ${results.length}, PASS: ${results.length - fails.length}, FAIL: ${fails.length}`);
  if (fails.length) {
    console.log('FAILED ITEMS:');
    fails.forEach((f) => console.log(` - ${f.label} :: ${f.detail}`));
  }
})();
