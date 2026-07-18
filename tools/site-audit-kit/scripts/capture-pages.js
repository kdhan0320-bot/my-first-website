/* Home/ /projects / 대표 프로젝트 상세 3개 / 레거시 /about 리다이렉트 / More Works
 * 공개 상태를 실제로 방문해 PNG로 저장하고 콘솔/네트워크 오류·가로 overflow를
 * 함께 기록한다. 기존 site-audit-kit(Playwright, audit-output, TARGET_URL 규칙)을
 * 그대로 재사용하고 별도 QA 시스템을 만들지 않는다.
 *
 * 실행: TARGET_URL="http://localhost:5183/dohan-portfolio/my-portfolio/" node scripts/capture-pages.js
 */
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright-core');

const TARGET_URL = process.env.TARGET_URL;
if (!TARGET_URL) {
  console.error('TARGET_URL 환경변수를 설정하세요.');
  process.exit(1);
}
const CHROME_PATH = process.env.CHROME_PATH;
const SCREENSHOT_DIR = path.join('audit-output', 'screenshots');
fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });

const PAGES = [
  { name: 'home', route: '#/' },
  { name: 'projects', route: '#/projects' },
  { name: 'jobflow-detail', route: '#/projects/jobflow' },
  { name: 'bus-arrival-detail', route: '#/projects/bus-arrival' },
  { name: 'feedback-hub-detail', route: '#/projects/feedback-hub' },
];
const VIEWPORTS = {
  1440: { width: 1440, height: 1000 },
  1024: { width: 1024, height: 768 },
  390: { width: 390, height: 844 },
};

async function scrollThroughPage(page) {
  await page.evaluate(async () => {
    const step = 400;
    const height = document.body.scrollHeight;
    for (let y = 0; y < height; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 80));
    }
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(300);
}

async function capturePage(browser, name, route, width, vp) {
  const page = await browser.newPage({ viewport: vp });
  const consoleIssues = [];
  const failedRequests = [];
  page.on('console', (msg) => { if (msg.type() === 'error') consoleIssues.push(msg.text()); });
  page.on('pageerror', (err) => consoleIssues.push(String(err)));
  page.on('response', (res) => { if (res.status() >= 400) failedRequests.push(`${res.status()} ${res.url()}`); });
  page.on('requestfailed', (req) => failedRequests.push(`${req.failure()?.errorText ?? 'failed'} ${req.url()}`));

  const url = TARGET_URL.replace(/\/$/, '/') + route;
  await page.goto(url, { waitUntil: 'networkidle' });
  await scrollThroughPage(page);

  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  const file = path.join(SCREENSHOT_DIR, `${name}-${width}.png`);
  await page.screenshot({ path: file, fullPage: true });

  await page.close();
  return { name, width, url, overflow, consoleIssues, failedRequests, file };
}

async function checkLegacyAboutRedirect(browser) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  const url = TARGET_URL.replace(/\/$/, '/') + '#/about';
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);
  const finalUrl = page.url();
  const aboutVisible = await page.locator('#about').isVisible().catch(() => false);
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'legacy-about-redirect.png') });
  await page.close();
  return { finalUrl, aboutVisible };
}

async function checkMoreWorksState(browser) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  await page.goto(TARGET_URL, { waitUntil: 'networkidle' });
  await scrollThroughPage(page);
  const info = await page.evaluate(() => {
    const section = document.querySelector('[aria-label="더 많은 작업물"]');
    if (!section) return { present: false, cardCount: 0 };
    const cards = section.querySelectorAll('h3');
    return { present: true, cardCount: cards.length, titles: Array.from(cards).map((c) => c.textContent) };
  });
  await page.close();
  return info;
}

async function checkDetailRouteRefreshAndBack(browser) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  const url = TARGET_URL.replace(/\/$/, '/') + '#/projects/jobflow';
  await page.goto(url, { waitUntil: 'networkidle' });
  const titleBefore = await page.locator('h1').first().textContent();
  await page.reload({ waitUntil: 'networkidle' });
  const titleAfterReload = await page.locator('h1').first().textContent();
  await page.close();
  return { titleBefore, titleAfterReload, urlWorks: titleBefore === titleAfterReload };
}

(async () => {
  const browser = await chromium.launch(CHROME_PATH ? { executablePath: CHROME_PATH } : {});
  const results = [];
  for (const { name, route } of PAGES) {
    for (const [width, vp] of Object.entries(VIEWPORTS)) {
      // 요청된 파일명 조합만 캡처 (home/projects: 1440/1024/390, 상세 3개: 1440/390)
      if (name.endsWith('-detail') && width === '1024') continue;
      const r = await capturePage(browser, name, route, width, vp);
      results.push(r);
      console.log(`saved ${r.file} (overflow=${r.overflow}, console=${r.consoleIssues.length}, failedReq=${r.failedRequests.length})`);
    }
  }

  const aboutRedirect = await checkLegacyAboutRedirect(browser);
  console.log('legacy /about redirect ->', JSON.stringify(aboutRedirect));

  const moreWorks = await checkMoreWorksState(browser);
  console.log('More Works state ->', JSON.stringify(moreWorks));

  const detailRefresh = await checkDetailRouteRefreshAndBack(browser);
  console.log('detail route refresh ->', JSON.stringify(detailRefresh));

  await browser.close();

  fs.writeFileSync(
    path.join('audit-output', 'pages-check.json'),
    JSON.stringify({ checkedAt: new Date().toISOString(), pages: results, aboutRedirect, moreWorks, detailRefresh }, null, 2)
  );
  console.log('완료: audit-output/pages-check.json');
})();
