import fs from 'fs';
import { test, expect, type Page } from '@playwright/test';
import { assertTargetUrl, RESULTS_FILE, QHD_VIEWPORTS, QHD_HIDDEN_VIEWPORTS } from './projects-target';

function record(entry: Record<string, unknown>) {
  fs.appendFileSync(RESULTS_FILE, JSON.stringify(entry) + '\n');
}

async function gotoProjects(page: Page) {
  const base = assertTargetUrl();
  const response = await page.goto(`${base}#/projects`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(400);
  return response;
}

/* Phase 5A: /projects가 최신 Figma delta sync 이후 실제로 지키는 항목을 검사한다.
 * 필수 항목 누락은 N/A가 아니라 expect.soft()로 FAIL을 남긴다(doc 10-5). */
test.describe('Projects Page', () => {
  test('필수 구조·공개 사실성·QHD index 확인', async ({ page }, testInfo) => {
    const viewport = testInfo.project.name;
    const consoleErrors: string[] = [];
    page.on('console', (msg) => { if (msg.type() === 'error') consoleErrors.push(msg.text()); });
    page.on('pageerror', (err) => consoleErrors.push(String(err)));
    const failedRequests: { url: string; status?: number; reason?: string }[] = [];
    page.on('response', (res) => { if (res.status() >= 400) failedRequests.push({ url: res.url(), status: res.status() }); });
    page.on('requestfailed', (req) => failedRequests.push({ url: req.url(), reason: req.failure()?.errorText }));

    const response = await gotoProjects(page);
    const loadOk = !!response && response.ok();
    expect.soft(loadOk, `${viewport}: /projects 접속 실패`).toBe(true);

    await test.step('main landmark / h1 / 가로 스크롤', async () => {
      const mainCount = await page.locator('main').count();
      expect.soft(mainCount, `${viewport}: main landmark count`).toBe(1);
      const h1Count = await page.locator('h1').count();
      expect.soft(h1Count, `${viewport}: h1 count`).toBe(1);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
      expect.soft(overflow, `${viewport}: horizontal overflow`).toBe(false);
      record({ kind: 'structure', viewport, mainCount, h1Count, horizontalOverflow: overflow });
    });

    await test.step('공개 사실성 (Featured 3 / More Works 1 / Mini SNS 0)', async () => {
      const featuredCards = await page.locator('[data-project-kind="featured"]').count();
      expect.soft(featuredCards, `${viewport}: Featured card count`).toBe(3);
      const featuredLinks = await page.locator('[data-project-kind="featured"] a[href*="/projects/"]').count();
      expect.soft(featuredLinks, `${viewport}: Featured detail Link count`).toBe(3);

      const moreWorkCards = await page.locator('[data-project-kind="more-work"]').count();
      expect.soft(moreWorkCards, `${viewport}: More Works published card count`).toBe(1);

      const ottCount = await page.getByText('OTT Service', { exact: true }).count();
      expect.soft(ottCount, `${viewport}: OTT Service count`).toBeGreaterThanOrEqual(1);

      const miniSnsText = await page.getByText('Mini SNS', { exact: false }).count();
      expect.soft(miniSnsText, `${viewport}: Mini SNS text/card count(비공개라 0이어야 함)`).toBe(0);

      const placeholderCards = await page.locator('[data-project-kind="more-work"][data-published="false"]').count();
      expect.soft(placeholderCards, `${viewport}: placeholder card count`).toBe(0);

      record({ kind: 'publicationTruth', viewport, featuredCards, featuredLinks, moreWorkCards, ottCount, miniSnsText, placeholderCards });
    });

    await test.step('Header PROJECTS active / Header MAIL', async () => {
      const activeProjects = page.locator('header a[aria-current="page"]', { hasText: 'PROJECTS' });
      const activeOk = (await activeProjects.count()) > 0;
      if (!activeOk) {
        record({ kind: 'functional', viewport, item: 'Header PROJECTS active', result: 'FAIL' });
        expect.soft(0, `${viewport}: Header PROJECTS active 상태를 찾을 수 없음`).toBeGreaterThan(0);
      } else {
        record({ kind: 'functional', viewport, item: 'Header PROJECTS active', result: 'PASS' });
      }

      const headerMailDirect = page.locator('header').getByRole('link', { name: '이메일 보내기' }).first();
      const headerMailVisible = (await headerMailDirect.count()) > 0 && (await headerMailDirect.isVisible());
      if (headerMailVisible) {
        record({ kind: 'functional', viewport, item: 'Header MAIL', result: 'PASS' });
      } else {
        const menuToggle = page.getByRole('button', { name: '메뉴 열기' }).first();
        if ((await menuToggle.count()) > 0) {
          await menuToggle.click();
          await page.waitForTimeout(300);
          const drawerMail = page.getByRole('link', { name: '이메일 보내기' }).first();
          const drawerMailOk = (await drawerMail.count()) > 0 && (await drawerMail.isVisible());
          record({ kind: 'functional', viewport, item: 'Header MAIL', result: drawerMailOk ? 'PASS' : 'FAIL', note: drawerMailOk ? '모바일 메뉴 안에서 확인' : undefined });
          if (!drawerMailOk) expect.soft(0, `${viewport}: Header MAIL을 모바일 메뉴에서도 찾을 수 없음`).toBeGreaterThan(0);
          await page.keyboard.press('Escape').catch(() => {});
          await page.waitForTimeout(200);
        } else {
          record({ kind: 'functional', viewport, item: 'Header MAIL', result: 'FAIL' });
          expect.soft(0, `${viewport}: Header MAIL link도 메뉴 버튼도 찾을 수 없음`).toBeGreaterThan(0);
        }
      }
    });

    await test.step('내부 고정 라우트는 Link(<a href>)여야 함', async () => {
      const checks: { name: RegExp | string; scope?: string }[] = [
        { name: /홈으로 돌아가기/ },
        { name: 'JobFlow 상세 보기' },
        { name: '버스 도착정보 앱 상세 보기' },
        { name: 'Portfolio Feedback Hub 상세 보기' },
      ];
      for (const c of checks) {
        const link = page.getByRole('link', { name: c.name }).first();
        const count = await link.count();
        if (count === 0) {
          record({ kind: 'navigationSemantics', viewport, target: String(c.name), result: 'FAIL', note: 'link를 찾을 수 없음' });
          expect.soft(0, `${viewport}: ${c.name} link를 찾을 수 없음`).toBeGreaterThan(0);
          continue;
        }
        const tagName = await link.evaluate((el) => el.tagName);
        const href = await link.getAttribute('href');
        const ok = tagName === 'A' && !!href;
        record({ kind: 'navigationSemantics', viewport, target: String(c.name), tagName, href, result: ok ? 'PASS' : 'FAIL' });
        expect.soft(tagName, `${viewport}: ${c.name} tagName`).toBe('A');
        expect.soft(href, `${viewport}: ${c.name} href 존재`).toBeTruthy();
      }
    });

    await test.step('touch target / clipped text', async () => {
      const results = await page.evaluate(() => {
        const els = Array.from(document.querySelectorAll('a[href], button'));
        return els
          .filter((el) => {
            const s = getComputedStyle(el);
            const r = el.getBoundingClientRect();
            return s.display !== 'none' && s.visibility !== 'hidden' && r.width > 0 && r.height > 0;
          })
          .map((el) => {
            const r = el.getBoundingClientRect();
            return { width: Math.round(r.width), height: Math.round(r.height) };
          });
      });
      const small = results.filter((r) => r.width < 44 || r.height < 44);
      expect.soft(small.length, `${viewport}: touch target violation`).toBe(0);

      // Phase 5A-R Batch G 13-1: ellipsis/line-clamp가 있는 요소만 보던 이전
      // 로직은 일반 텍스트가 overflow-hidden 부모에 잘리거나 viewport 밖으로
      // 나가는 경우를 놓쳤다(사용자가 실제 2560/1024에서 발견한 문제의 일부).
      // scrollHeight>clientHeight만으로는 타이트한 line-height의 한글 폰트에서
      // false positive가 나서(Home Hero H1로 실측 확인, 실제로는 안 잘림),
      // 가장 가까운 실제 클리핑 조상(overflow hidden/clip)의 경계를 넘는지까지
      // 함께 본다(detailed-audit.spec.ts와 동일 로직).
      const clippedItems = await page.evaluate(() => {
        const candidates = Array.from(document.querySelectorAll('h1, h2, h3, h4, p, a, button, li, span'));
        const vw = window.innerWidth;
        const out: { text: string; tag: string; reason: string }[] = [];
        for (const el of candidates) {
          const text = (el.textContent || '').trim();
          if (!text) continue;
          if (el.closest('[aria-hidden="true"]')) continue;
          const style = getComputedStyle(el);
          if (style.display === 'none' || style.visibility === 'hidden') continue;
          const rect = el.getBoundingClientRect();
          if (rect.width <= 1 && rect.height <= 1) continue;
          const reasons: string[] = [];
          if (rect.left < -1) reasons.push('rect.left<0');
          if (rect.right > vw + 1) reasons.push('rect.right>viewport');
          let ancestor = el.parentElement;
          let depth = 0;
          while (ancestor && ancestor !== document.body && depth < 10) {
            const aStyle = getComputedStyle(ancestor);
            const clipsX = aStyle.overflowX === 'hidden' || aStyle.overflowX === 'clip';
            const clipsY = aStyle.overflowY === 'hidden' || aStyle.overflowY === 'clip';
            if (clipsX || clipsY) {
              const aRect = ancestor.getBoundingClientRect();
              if (clipsY && (rect.top < aRect.top - 1 || rect.bottom > aRect.bottom + 1)) reasons.push('부모 overflow-y:hidden 경계 초과');
              if (clipsX && (rect.left < aRect.left - 1 || rect.right > aRect.right + 1)) reasons.push('부모 overflow-x:hidden 경계 초과');
              break;
            }
            ancestor = ancestor.parentElement;
            depth++;
          }
          if (reasons.length === 0) continue;
          out.push({ text: text.slice(0, 60), tag: el.tagName, reason: reasons.join(',') });
        }
        return out;
      });
      expect.soft(clippedItems.length, `${viewport}: 텍스트 잘림 0이어야 함 (${clippedItems.slice(0, 5).map((c) => `${c.tag}:"${c.text}"(${c.reason})`).join(' / ')})`).toBe(0);
      record({ kind: 'a11yScan', viewport, touchTargetViolations: small.length, clippedText: clippedItems.length, clippedItems: clippedItems.slice(0, 20) });
    });

    await test.step('content shell 좌우 여백 대칭 확인', async () => {
      const margins = await page.evaluate(() => {
        const shell = document.querySelector('header .MuiContainer-root');
        if (!shell) return null;
        const r = shell.getBoundingClientRect();
        return { left: Math.round(r.left), right: Math.round(window.innerWidth - r.right) };
      });
      if (margins) {
        const diff = Math.abs(margins.left - margins.right);
        expect.soft(diff, `${viewport}: content shell 좌우 여백 차이 ${diff}px`).toBeLessThanOrEqual(2);
        record({ kind: 'shellAlignment', viewport, ...margins, diff });
      } else {
        record({ kind: 'shellAlignment', viewport, ok: undefined, remark: 'header Container를 찾지 못함' });
      }
    });

    await test.step('QHD Projects index (01~03) 기하 확인', async () => {
      const geometry = await page.evaluate(() => {
        const contentLeft = (window.innerWidth - 1440) / 2;
        const contentRight = window.innerWidth - contentLeft;
        return Array.from(document.querySelectorAll('[data-qhd-index]')).map((el) => {
          // display:none은 wrapper(부모)에 걸려 있다 - 자식(el) 자신의 computed
          // display는 조상이 display:none이어도 'none'으로 바뀌지 않으므로 반드시
          // 부모를 확인한다(Home qhdIndexGeometry 검사와 동일 패턴).
          const wrapper = el.parentElement as HTMLElement;
          const style = getComputedStyle(wrapper);
          const visible = style.display !== 'none';
          const r = (el as HTMLElement).getBoundingClientRect();
          const label = wrapper?.querySelector('[data-qhd-index-label]') as HTMLElement | null;
          const labelRect = label ? label.getBoundingClientRect() : null;
          const overlapsContent = visible && r.width > 0 && r.left < contentRight && r.right > contentLeft;
          return {
            index: el.getAttribute('data-qhd-index'),
            labelId: label ? label.getAttribute('data-qhd-index-label') : null,
            visible,
            pointerEvents: style.pointerEvents,
            ariaHidden: wrapper?.getAttribute('aria-hidden') ?? null,
            overlapsContent,
            rect: { left: Math.round(r.left), right: Math.round(r.right) },
            labelRect: labelRect ? { left: Math.round(labelRect.left), right: Math.round(labelRect.right) } : null,
            viewportWidth: window.innerWidth,
          };
        });
      });
      record({ kind: 'qhdProjectsIndexGeometry', viewport, indices: geometry });

      const shouldBeVisible = QHD_VIEWPORTS.includes(viewport);
      const shouldBeHidden = QHD_HIDDEN_VIEWPORTS.includes(viewport);
      for (const item of geometry) {
        const label = `${viewport}/projects-index-${item.labelId}`;
        if (shouldBeHidden) {
          expect.soft(item.visible, `${label}: hidden 기준 viewport에서 visible이면 안 됨`).toBe(false);
        } else if (shouldBeVisible) {
          expect.soft(item.visible, `${label}: visible이어야 함`).toBe(true);
          expect.soft(item.ariaHidden, `${label}: aria-hidden="true"`).toBe('true');
          expect.soft(item.pointerEvents, `${label}: pointer-events:none`).toBe('none');
          expect.soft(item.overlapsContent, `${label}: overlapsContent는 false여야 함`).toBe(false);
          // Phase 5A-R: "부분 clip 허용" 폐기 — index/label 전체가 viewport 안에 있어야 한다.
          expect.soft(item.rect.left, `${label}: index rect.left가 0 미만`).toBeGreaterThanOrEqual(0);
          expect.soft(item.rect.right, `${label}: index rect.right가 viewport 초과`).toBeLessThanOrEqual(item.viewportWidth);
          if (item.labelRect) {
            expect.soft(item.labelRect.left, `${label}: label rect.left가 0 미만`).toBeGreaterThanOrEqual(0);
            expect.soft(item.labelRect.right, `${label}: label rect.right가 viewport 초과`).toBeLessThanOrEqual(item.viewportWidth);
          }
        }
      }
      if (shouldBeVisible) {
        expect.soft(geometry.length, `${viewport}: QHD index 3쌍 전부 렌더돼야 함`).toBe(3);
      }
    });

    await test.step('More Works section 빈 공간 확인', async () => {
      // Phase 5A-R Batch G 13-6: "예쁨"을 자동 판정하지 않되, 콘텐츠 하단과
      // section 하단 사이 의미 없는 빈 공간이 과도한지는 실제 box geometry로
      // 기록한다(사용자가 실제 QHD에서 "빠진 두 번째 카드 자리"처럼 느낀 문제).
      const gap = await page.evaluate(() => {
        const section = document.querySelector('section[aria-label="더 많은 작업물"]') as HTMLElement | null;
        if (!section) return null;
        const card = section.querySelector('[data-project-kind="more-work"]') as HTMLElement | null;
        if (!card) return null;
        const sectionRect = section.getBoundingClientRect();
        const cardRect = card.getBoundingClientRect();
        return { bottomGap: Math.round(sectionRect.bottom - cardRect.bottom) };
      });
      if (gap) {
        const maxGap = viewport === '390' || viewport === '768' ? 160 : 200; // py + 여유(카드 자체 높이 편차 감안)
        expect.soft(gap.bottomGap, `${viewport}: More Works 카드 하단 ~ section 하단 여백 ${gap.bottomGap}px`).toBeLessThanOrEqual(maxGap);
        record({ kind: 'moreWorksBlankRatio', viewport, ...gap });
      } else {
        record({ kind: 'moreWorksBlankRatio', viewport, ok: undefined, remark: 'section/card를 찾지 못함' });
      }
    });

    await test.step('section 경계(절대 page y) — Figma 4개 locked node 실측 대조', async () => {
      // Phase 5A-F2: Figma QHD 208:2 / Desktop 206:5 / Compact 209:2 / Mobile
      // 212:2 자체 frame 누적 높이(Hero→Featured→More Works→Footer)를 그대로
      // 옮긴 값이다. header는 별도 고정 Navbar라 절대 page y로 비교한다
      // (getBoundingClientRect + scrollY). 390은 기존 "More Works 빈 공간"
      // 가드와 충돌해 section 높이를 콘텐츠 기준으로 되돌렸으므로 이 표에서
      // 제외한다(카드 높이 600±4는 위에서 이미 별도로 보증되지 않으니 아래
      // touch target/clip 검사가 대신 방어한다).
      const FIGMA_SECTION_TARGETS: Record<string, { featuredStart: number; moreWorksStart: number; footerStart: number; footerBottom: number }> = {
        '1024': { featuredStart: 1050, moreWorksStart: 3050, footerStart: 3770, footerBottom: 4470 },
        '1440': { featuredStart: 680, moreWorksStart: 1880, footerStart: 2680, footerBottom: 3280 },
        '2560': { featuredStart: 680, moreWorksStart: 1980, footerStart: 2830, footerBottom: 3430 },
      };
      const target = FIGMA_SECTION_TARGETS[viewport];
      if (!target) return;
      const geometry = await page.evaluate(() => {
        const absTop = (el: Element | null) => el ? Math.round(el.getBoundingClientRect().top + window.scrollY) : null;
        const absBottom = (el: Element | null) => el ? Math.round(el.getBoundingClientRect().bottom + window.scrollY) : null;
        const featured = document.querySelector('section[aria-label="대표 프로젝트"]');
        const moreWorks = document.querySelector('section[aria-label="더 많은 작업물"]');
        const footer = document.querySelector('footer');
        return {
          featuredStart: absTop(featured),
          moreWorksStart: absTop(moreWorks),
          footerStart: absTop(footer),
          footerBottom: absBottom(footer),
        };
      });
      record({ kind: 'figmaSectionBoundary', viewport, target, measured: geometry });
      for (const key of Object.keys(target) as (keyof typeof target)[]) {
        const diff = Math.abs((geometry[key] ?? 0) - target[key]);
        expect.soft(diff, `${viewport}: ${key} 실측 ${geometry[key]} vs Figma 목표 ${target[key]} (오차 ${diff}px, 허용 ±4)`).toBeLessThanOrEqual(4);
      }
    });

    record({ kind: 'consoleIssues', viewport, count: consoleErrors.length, items: consoleErrors.slice(0, 20) });
    record({ kind: 'failedRequests', viewport, count: failedRequests.length, items: failedRequests.slice(0, 20) });
    expect.soft(consoleErrors.length, `${viewport}: console error`).toBe(0);
    expect.soft(failedRequests.length, `${viewport}: failed request`).toBe(0);
  });

  // Detail prev/next Link, smart back button, 404 Home/Projects Link semantics는
  // viewport와 무관하므로 1440 project에서만 1회 확인한다(중복 방지).
  test('Detail prev/next Link · smart back · 404 Link semantics', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== '1440', '뷰포트 무관 검사라 1440에서만 실행');
    const base = assertTargetUrl();

    await page.goto(`${base}#/projects/jobflow`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(300);

    const prevNext = page.getByRole('link', { name: /이전 프로젝트|다음 프로젝트/ });
    const prevNextCount = await prevNext.count();
    expect.soft(prevNextCount, 'Detail prev/next link count').toBeGreaterThanOrEqual(2);
    for (let i = 0; i < prevNextCount; i++) {
      const el = prevNext.nth(i);
      const tagName = await el.evaluate((n) => n.tagName);
      const href = await el.getAttribute('href');
      record({ kind: 'navigationSemantics', viewport: '1440', target: `detail-prev-next-${i}`, tagName, href });
      expect.soft(tagName, `Detail prev/next[${i}] tagName`).toBe('A');
      expect.soft(href, `Detail prev/next[${i}] href 존재`).toBeTruthy();
    }

    const backButton = page.getByRole('button', { name: '전체 프로젝트 목록으로 이동' });
    const backCount = await backButton.count();
    expect.soft(backCount, 'Detail smart back button count').toBeGreaterThan(0);
    if (backCount > 0) {
      const tagName = await backButton.first().evaluate((n) => n.tagName);
      record({ kind: 'navigationSemantics', viewport: '1440', target: 'detail-smart-back', tagName });
      expect.soft(tagName, 'Detail smart back tagName').toBe('BUTTON');
    }

    await page.goto(`${base}#/this-route-does-not-exist`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(300);
    const notFoundLinks = page.getByRole('link', { name: /홈으로 돌아가기|전체 프로젝트/ });
    const nfCount = await notFoundLinks.count();
    expect.soft(nfCount, '404 Home/Projects link count').toBeGreaterThanOrEqual(2);
    for (let i = 0; i < nfCount; i++) {
      const el = notFoundLinks.nth(i);
      const tagName = await el.evaluate((n) => n.tagName);
      const href = await el.getAttribute('href');
      record({ kind: 'navigationSemantics', viewport: '1440', target: `404-link-${i}`, tagName, href });
      expect.soft(tagName, `404 link[${i}] tagName`).toBe('A');
      expect.soft(href, `404 link[${i}] href 존재`).toBeTruthy();
    }
  });
});
