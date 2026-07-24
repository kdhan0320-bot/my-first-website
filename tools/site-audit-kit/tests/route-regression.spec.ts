import fs from 'fs';
import path from 'path';
import { test, expect, type Page } from '@playwright/test';
import { assertTargetUrl, RESULTS_FILE, ROUTES } from './route-target';
import { SCREENSHOT_DIR, DETAILED_VIEWPORTS } from './detailed-target';

function record(entry: Record<string, unknown>) {
  fs.appendFileSync(RESULTS_FILE, JSON.stringify(entry) + '\n');
}

// detailed-audit.spec.ts의 scrollThroughPage()와 같은 방식(단계적 scrollTo + 짧은
// 대기, 끝에 상단 복귀) — Detail 페이지는 Hero 이후 media가 lazy라, 스크롤 없이
// document.images만 보면 아직 뷰포트에 들어오지 않은 이미지가 naturalWidth 0으로
// 잡힌다(스크롤 기반 실제 QA에서는 전부 로드됨을 확인함). 새 helper 파일을 만들지
// 않고 이 spec 안에서만 재사용한다.
async function scrollFullPageAndBack(page: Page) {
  await page.evaluate(async () => {
    const step = 400;
    const height = document.body.scrollHeight;
    for (let y = 0; y < height; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 120));
    }
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(400);
}

// Phase 4D 8-5: 6개 route를 실제로 열어서(scroll-based 같은 페이지 이동이 아니라
// page.goto로 hash route 자체를 직접 이동) console error/failed request/가로
// 스크롤/h1 개수/404 화면/홈 복귀 링크를 기록한다. 9-viewport Home 감사(detailed-
// audit.spec.ts)와는 분리된 별도 spec이다(문서 8-5 "분리해도 된다").
test.describe('Route Regression', () => {
  test('6-route 회귀', async ({ page }, testInfo) => {
    const viewport = testInfo.project.name;
    const base = assertTargetUrl();

    for (const route of ROUTES) {
      const consoleErrors: string[] = [];
      const failedRequests: { url: string; status?: number; reason?: string }[] = [];
      const onConsole: Parameters<typeof page.on<'console'>>[1] = (msg) => {
        if (msg.type() === 'error') consoleErrors.push(msg.text());
      };
      const onResponse: Parameters<typeof page.on<'response'>>[1] = (res) => {
        if (res.status() >= 400) failedRequests.push({ url: res.url(), status: res.status() });
      };
      const onReqFailed: Parameters<typeof page.on<'requestfailed'>>[1] = (req) => {
        failedRequests.push({ url: req.url(), reason: req.failure()?.errorText });
      };
      page.on('console', onConsole);
      page.on('response', onResponse);
      page.on('requestfailed', onReqFailed);

      const url = `${base}${route.path}`;
      let loadOk = true;
      try {
        await page.goto(url, { waitUntil: 'networkidle', timeout: 20_000 });
      } catch {
        loadOk = false;
      }
      await page.waitForTimeout(500);

      const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
      const h1Count = await page.locator('h1').count();
      const homeLinkCount = await page.getByRole('link', { name: /홈으로|home/i }).count();

      let notFoundOk: boolean | null = null;
      if (route.expectNotFound) {
        const text = await page.evaluate(() => document.body.innerText);
        notFoundOk = /404|찾을 수 없|not found/i.test(text);
      }

      let detailChecks: { titlePresent: boolean; imagesLoaded: boolean } | null = null;
      if (route.isDetail) {
        // 1. route/title 확인
        const titlePresent = (await page.locator('h1').count()) > 0;
        // 2. fonts·초기 layout 안정화
        await page.evaluate(() => document.fonts.ready).catch(() => undefined);
        await page.waitForTimeout(200);
        // 3~4. 페이지 하단까지 단계적으로 스크롤한 뒤 상단으로 복귀 — Hero 이후
        // lazy media를 실제로 로드시킨다(scrollFullPageAndBack 참고).
        await scrollFullPageAndBack(page);
        // 5. 전체 image 로드 확인
        const imagesLoaded = await page.evaluate(() =>
          Array.from(document.images).every((img) => img.complete && img.naturalWidth > 0)
        );
        detailChecks = { titlePresent, imagesLoaded };
      }

      page.off('console', onConsole);
      page.off('response', onResponse);
      page.off('requestfailed', onReqFailed);

      const homeLinkPresent = homeLinkCount > 0;
      record({
        kind: 'routeRegression',
        viewport,
        route: route.path || '/',
        label: route.label,
        loadOk,
        consoleErrorCount: consoleErrors.length,
        consoleErrors: consoleErrors.slice(0, 5),
        failedRequestCount: failedRequests.length,
        failedRequests: failedRequests.slice(0, 5),
        horizontalOverflow: overflow,
        h1Count,
        homeLinkPresent,
        notFoundOk,
        detailChecks,
      });

      // Phase 4E: 기록만 하고 통과시키지 않는다 — 18개 조합(6 route x 3 viewport)
      // 중 하나라도 실패하면 expect.soft()가 이 테스트를 FAIL로 남기고, exit code도
      // 성공이 아니게 된다(나머지 route는 이어서 계속 검사한다).
      const label = `${route.label} (${viewport})`;
      expect.soft(loadOk, `${label}: loadOk`).toBe(true);
      expect.soft(consoleErrors.length, `${label}: consoleErrorCount`).toBe(0);
      expect.soft(failedRequests.length, `${label}: failedRequestCount`).toBe(0);
      expect.soft(overflow, `${label}: horizontalOverflow`).toBe(false);
      expect.soft(h1Count, `${label}: h1Count`).toBe(1);
      expect.soft(homeLinkPresent, `${label}: homeLinkPresent`).toBe(true);
      if (route.expectNotFound) {
        expect.soft(notFoundOk, `${label}: notFoundOk`).toBe(true);
      }
      if (route.isDetail) {
        expect.soft(detailChecks?.titlePresent, `${label}: titlePresent`).toBe(true);
        expect.soft(detailChecks?.imagesLoaded, `${label}: imagesLoaded`).toBe(true);
      }
    }
  });

  // Phase 4D 8-6: 실제 브라우저 zoom을 제어할 수 없으므로 "200% 확대"라고 쓰지 않고
  // effective width를 좁혀 reflow 문제를 대신 확인한다("200% equivalent reflow proxy").
  // 3개 viewport 프로젝트 중 하나에서만 1회 실행해 중복을 피한다.
  test('200% equivalent reflow proxy', async ({ page }, testInfo) => {
    if (testInfo.project.name !== '2560') {
      test.skip();
      return;
    }
    const base = assertTargetUrl();
    const widths = [720, 640, 320];
    for (const width of widths) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(base, { waitUntil: 'networkidle' });
      await page.waitForTimeout(400);

      const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
      const headerCoversContent = await page.evaluate(() => {
        const header = document.querySelector('header');
        const h1 = document.querySelector('h1');
        if (!header || !h1) return false;
        const h = header.getBoundingClientRect();
        const c = h1.getBoundingClientRect();
        return c.top < h.bottom;
      });
      const menuAccessible =
        (await page.getByRole('button', { name: '메뉴 열기' }).count()) > 0 ||
        (await page.getByRole('link', { name: 'PROJECTS', exact: true }).count()) > 0;

      record({
        kind: 'reflowProxy',
        title: '200% equivalent reflow proxy',
        effectiveWidth: width,
        horizontalOverflow: overflow,
        headerCoversContent,
        menuAccessible,
      });

      const label = `reflow proxy (${width}px effective)`;
      expect.soft(overflow, `${label}: horizontalOverflow`).toBe(false);
      expect.soft(headerCoversContent, `${label}: headerCoversContent`).toBe(false);
      expect.soft(menuAccessible, `${label}: menuAccessible`).toBe(true);
    }
  });

  // Human Signal Detail Phase 5D-F3: Detail native full-page PNG 4장 — 요구된
  // route×viewport 조합(2560/390/1440/1024)이 이 spec의 project 매트릭스(390/1440/
  // 2560)와 다르므로, project 마다 반복하지 않고 2560 project에서 1회만 실행해
  // page.setViewportSize()로 4장을 개별 캡처한다(위 reflow proxy와 같은 가드 패턴).
  // 기존 detailed-audit.spec.ts가 쓰는 SCREENSHOT_DIR(audit-output/screenshots/
  // detailed)를 그대로 재사용하고, 새 폴더는 만들지 않는다. 같은 파일명이 이미
  // 있으면 page.screenshot()이 그대로 덮어쓴다.
  test('Detail native PNG 캡처 (4장)', async ({ page }, testInfo) => {
    if (testInfo.project.name !== '2560') {
      test.skip();
      return;
    }
    const base = assertTargetUrl();
    fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });

    const shots: { route: string; viewport: { width: number; height: number }; file: string }[] = [
      { route: '#/projects/jobflow', viewport: DETAILED_VIEWPORTS['desktop-2560'], file: 'detail-jobflow-2560.png' },
      { route: '#/projects/jobflow', viewport: DETAILED_VIEWPORTS['mobile-390'], file: 'detail-jobflow-390.png' },
      { route: '#/projects/feedback-hub', viewport: DETAILED_VIEWPORTS['desktop-1440'], file: 'detail-feedback-1440.png' },
      { route: '#/projects/bus-arrival', viewport: DETAILED_VIEWPORTS['tablet-1024'], file: 'detail-bus-1024.png' },
    ];

    for (const shot of shots) {
      await page.setViewportSize({ width: shot.viewport.width, height: shot.viewport.height });
      await page.goto(`${base}${shot.route}`, { waitUntil: 'networkidle', timeout: 20_000 });
      await page.waitForTimeout(500);
      await page.evaluate(() => document.fonts.ready).catch(() => undefined);
      await scrollFullPageAndBack(page);

      const filePath = path.join(SCREENSHOT_DIR, shot.file);
      await page.screenshot({ path: filePath, fullPage: true });
      const exists = fs.existsSync(filePath) && fs.statSync(filePath).size > 0;
      record({ kind: 'detailNativeCapture', route: shot.route, viewport: shot.viewport, file: shot.file, ok: exists });
      expect.soft(exists, `Detail native PNG (${shot.file}): 생성 확인`).toBe(true);
    }
  });
});
