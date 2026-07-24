import fs from 'fs';
import path from 'path';
import { test, expect, type Page } from '@playwright/test';
import { TARGET_URL, assertTargetUrl, SCREENSHOT_DIR, RESULTS_FILE, SECTIONS, MOBILE_MENU_FILE } from './target';

function record(entry: Record<string, unknown>) {
  fs.appendFileSync(RESULTS_FILE, JSON.stringify(entry) + '\n');
}

async function gotoHome(page: Page) {
  const response = await page.goto(assertTargetUrl(), { waitUntil: 'networkidle' });
  await page.waitForTimeout(300);
  return response;
}

// Phase 4D: PROJECTS/상세 CTA/전체 프로젝트 보기는 실제 URL 이동이라 button이 아니라
// link semantics로 바뀌었다(Navbar.jsx, ProjectsSection.jsx) — role='button'만 찾던
// 기존 getNavButton은 이 요소들을 더 이상 찾지 못해 조용히 N/A가 됐다. role='link'
// 기준으로 찾는 대응 helper를 추가한다(모바일 메뉴 fallback은 동일하게 유지).
async function getNavLink(page: Page, nameOrRegex: string | RegExp) {
  const opts = typeof nameOrRegex === 'string' ? { name: nameOrRegex, exact: true } : { name: nameOrRegex };
  const direct = page.getByRole('link', opts).first();
  if ((await direct.count()) > 0 && (await direct.isVisible())) {
    return direct;
  }
  const menuToggle = page.getByRole('button', { name: '메뉴 열기' }).first();
  if ((await menuToggle.count()) > 0) {
    await menuToggle.click();
    await page.waitForTimeout(300);
    const inMenu = page.getByRole('link', opts).first();
    if ((await inMenu.count()) > 0) return inMenu;
  }
  return direct;
}

// 화면에 반드시 있어야 하는 필수 항목(PROJECTS/상세 CTA/전체 프로젝트 보기)을 못 찾으면
// N/A로 조용히 넘기지 않고 FAIL로 기록 + soft assertion으로 남긴다(테스트 자체는 계속
// 진행해 나머지 검사를 마저 수집한다). 모바일의 desktop 전용 nav처럼 "이 viewport에는
// 원래 없는 게 정상"인 항목에는 이 helper를 쓰지 않는다.
function recordRequiredMissing(viewport: string, item: string, note: string) {
  record({ kind: 'functional', viewport, item, result: 'FAIL', note });
  expect.soft(0, `[필수 항목 없음] ${item}: ${note}`).toBeGreaterThan(0);
}

async function linkLocation(page: Page, href: string, text: string) {
  return page.evaluate(
    ([href, text]) => {
      const anchors = Array.from(document.querySelectorAll('a')).filter(
        (a) => a.getAttribute('href') === href && a.textContent?.trim() === text
      );
      const a = anchors[0];
      if (!a) return '알 수 없음';
      if (a.closest('header')) return 'Header';
      if (a.closest('#projects')) return 'Projects';
      if (a.closest('#contact')) return 'Contact/Footer';
      return 'Other';
    },
    [href, text] as [string, string]
  );
}

// 섹션별 모션 정착 대기 시간(ms). 실제 승인된 모션 시간(Hero 1.45s, About 0.45s+delay,
// Featured 0.55s+delay, Contact 0.95s) 기준으로 margin을 둔 값이다 - "300ms 기다렸으니
// final"이라는 가정은 신뢰할 수 없음이 재현 확인됐다(About/Featured/Contact 섹션 crop
// PNG가 실제로 중간 opacity 상태로 저장됨). SECTIONS[].key와 정확히 맞춘다.
const SECTION_SETTLE_MS: Record<string, number> = {
  hero: 1700,
  projects: 900,
  about: 800,
  'contact-footer': 1200,
};

// 화면에 보이는 header(위치 sticky/fixed)의 실제 렌더링 높이를 측정한다. header가 없거나
// 보이지 않으면 0을 반환해 오프셋을 적용하지 않는다.
async function getHeaderOffset(page: Page): Promise<number> {
  return page.evaluate(() => {
    const header = document.querySelector('header');
    if (!header) return 0;
    const style = getComputedStyle(header);
    if (style.display === 'none' || style.visibility === 'hidden') return 0;
    const rect = header.getBoundingClientRect();
    return rect.height > 0 ? Math.round(rect.height) + 16 : 0;
  });
}

// 섹션 id가 없는 사이트에도 대응하기 위한 3단계 fallback: id -> 텍스트 -> 스크롤 비율
async function captureSection(page: Page, section: (typeof SECTIONS)[number], viewport: string) {
  const file = `${viewport}-${section.key}.png`;
  const filePath = path.join(SCREENSHOT_DIR, file);
  let remark = '-';
  const settleMs = SECTION_SETTLE_MS[section.key] ?? 900;
  let headerOffset = 0;
  try {
    let locator = page.locator(`#${section.id}`);
    if ((await locator.count()) === 0) {
      locator = page.getByText(section.textFallback).first();
      remark = 'id 없음 - 텍스트 기반 locator로 대체';
    }
    if ((await locator.count()) === 0) {
      // fallback ratio 캡처에서는 header offset을 적용하지 않는다(요구사항) - 섹션 경계를
      // 정확히 모르는 상태에서 무리하게 보정하지 않는다.
      await page.evaluate((ratio) => window.scrollTo(0, document.body.scrollHeight * ratio), section.scrollRatio);
      remark = 'id/텍스트 모두 없음 - 스크롤 위치 비율로 대체 캡처';
    } else {
      // scrollIntoViewIfNeeded는 섹션을 Header 아래로 안전하게 배치한다는 보장이 없다
      // (mobile-about.png에서 ABOUT label/heading 상단이 Sticky Header에 가려지는 문제로
      // 재현 확인됨). 섹션 시작점을 viewport 상단에 명확히 맞춘 뒤, 실제 header 높이만큼
      // 아래로 보정한다. Hero처럼 이미 문서 맨 위인 섹션은 음수 스크롤이 되지 않도록
      // clamp한다.
      await locator.evaluate((el) => el.scrollIntoView({ block: 'start' }));
      headerOffset = await getHeaderOffset(page);
      if (headerOffset > 0) {
        await page.evaluate((offset) => {
          window.scrollTo(0, Math.max(0, window.scrollY - offset));
        }, headerOffset);
      }
    }
    // 섹션 진입과 React state 반영을 위한 정착 시간을 먼저 지킨 뒤, animations:'disabled'로
    // 혹시 남아있는 진행 중 애니메이션을 최종 프레임으로 고정해서 캡처한다.
    await page.waitForTimeout(settleMs);
    await page.screenshot({ path: filePath, animations: 'disabled', caret: 'hide' });
    const exists = fs.existsSync(filePath) && fs.statSync(filePath).size > 0;
    record({ kind: 'screenshot', viewport, section: section.label, file, ok: exists, remark, settleMs, headerOffset });
  } catch (e) {
    record({ kind: 'screenshot', viewport, section: section.label, file, ok: false, remark: String(e).slice(0, 200), settleMs, headerOffset });
  }
}

test.describe('Portfolio Audit', () => {
  test('전체 점검', async ({ page, request }, testInfo) => {
    const viewport = testInfo.project.name;
    const consoleErrors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });
    page.on('pageerror', (err) => consoleErrors.push(String(err)));

    // 1. 사이트 접속 성공 여부 + 페이지 로딩 완료 여부
    await test.step('사이트 접속 및 로딩 완료 확인', async () => {
      const response = await gotoHome(page);
      const ok = !!response && response.ok();
      record({ kind: 'connectivity', viewport, ok, status: response?.status() ?? null, url: TARGET_URL });
      expect(ok, `사이트 접속 실패: ${TARGET_URL}`).toBeTruthy();
    });

    // 2. 섹션별 스크린샷 (Hero, Projects, About, Contact/Footer) - fallback 포함
    for (const section of SECTIONS) {
      await test.step(`${section.label} 섹션 캡처`, () => captureSection(page, section, viewport));
    }

    // 모바일 메뉴 열기/닫기 확인 (버튼이 있으면). mobile-menu-open.png는 mobile 뷰포트에서만 저장한다.
    await test.step('메뉴 열기/닫기 확인', async () => {
      await gotoHome(page);
      const menuToggle = page.getByRole('button', { name: '메뉴 열기' }).first();
      if ((await menuToggle.count()) === 0) {
        record({ kind: 'functional', viewport, item: '메뉴 열기/닫기 확인', result: 'N/A', note: '메뉴 버튼을 찾을 수 없음' });
        if (viewport === 'mobile') {
          record({ kind: 'screenshot', viewport, section: 'Mobile Menu', file: MOBILE_MENU_FILE, ok: false, remark: '메뉴 버튼 없음' });
        }
        return;
      }

      await menuToggle.click({ timeout: 5000 }).catch(() => {});
      await page.waitForTimeout(400);
      const menuPanel = page.locator('[role="dialog"], .MuiDrawer-root, .MuiMenu-root').first();
      const opened = await menuPanel
        .waitFor({ state: 'visible', timeout: 3000 })
        .then(() => true)
        .catch(() => false);

      if (viewport === 'mobile') {
        const filePath = path.join(SCREENSHOT_DIR, MOBILE_MENU_FILE);
        await page.waitForTimeout(200);
        await page.screenshot({ path: filePath });
        const exists = fs.existsSync(filePath) && fs.statSync(filePath).size > 0;
        record({ kind: 'screenshot', viewport, section: 'Mobile Menu', file: MOBILE_MENU_FILE, ok: exists && opened });
      }

      // 닫기: Escape를 우선 시도 (배경 오버레이가 토글 버튼 클릭을 가로채는 경우가 있어 재클릭은 fallback으로만 사용, 항상 timeout을 둬서 무한 대기 방지)
      if (opened) {
        await page.keyboard.press('Escape').catch(() => {});
        await page.waitForTimeout(300);
        let stillOpen = await menuPanel.isVisible().catch(() => false);
        if (stillOpen) {
          await menuToggle.click({ timeout: 5000 }).catch(() => {});
          await page.waitForTimeout(300);
          stillOpen = await menuPanel.isVisible().catch(() => false);
        }
        record({
          kind: 'functional',
          viewport,
          item: '메뉴 열기/닫기 확인',
          result: stillOpen ? 'FAIL' : 'PASS',
          note: `열림: ${opened}, 닫힘: ${!stillOpen}`,
        });
      } else {
        record({ kind: 'functional', viewport, item: '메뉴 열기/닫기 확인', result: 'FAIL', note: '메뉴 버튼 클릭 후 열리지 않음' });
      }
    });

    // 외부 링크(실행 화면 보기 / GitHub) 및 이메일 링크는 뷰포트와 무관하므로 pc 프로젝트에서만 점검한다.
    if (viewport === 'pc') {
      await test.step('외부 링크(실행 화면 보기 / GitHub) 새 탭 및 접속 가능 여부 확인', async () => {
        await gotoHome(page);
        const links = await page.evaluate(() => {
          return Array.from(document.querySelectorAll('a[target="_blank"]'))
            .filter((a) => /화면 보기|demo|github/i.test(a.textContent || ''))
            .map((a) => ({ text: (a.textContent || '').trim(), href: a.getAttribute('href') || '' }));
        });

        const seen = new Set<string>();
        for (const link of links) {
          const dedupeKey = `${link.text}|${link.href}`;
          if (seen.has(dedupeKey) || !link.href) continue;
          seen.add(dedupeKey);

          const location = await linkLocation(page, link.href, link.text);
          try {
            const res = await request.get(link.href, { timeout: 15000 });
            const ok = res.ok();
            record({
              kind: 'link',
              name: link.text,
              location,
              url: link.href,
              ok,
              note: `새 탭(target=_blank) 대상, HTTP ${res.status()}`,
            });
          } catch (e) {
            record({
              kind: 'link',
              name: link.text,
              location,
              url: link.href,
              ok: false,
              note: `접속 실패: ${String(e)}`,
            });
          }
        }
      });

      await test.step('이메일 버튼 mailto 형식 확인', async () => {
        const emailHrefs = await page.evaluate(() =>
          Array.from(document.querySelectorAll('a[href^="mailto:"]')).map((a) => a.getAttribute('href') || '')
        );
        const uniqueHrefs = Array.from(new Set(emailHrefs));
        if (uniqueHrefs.length === 0) {
          record({ kind: 'email', href: null, ok: undefined, note: '이메일(mailto) 링크를 찾을 수 없음' });
          return;
        }
        for (const href of uniqueHrefs) {
          const ok = /^mailto:[^\s@]+@[^\s@]+\.[^\s@]+/.test(href);
          record({ kind: 'email', href, ok });
        }
      });
    }

    // Hero CTA 버튼 클릭 테스트 (스크롤 이동 확인)
    await test.step('Hero CTA 버튼 클릭 테스트', async () => {
      await gotoHome(page);
      const cta = page.getByRole('button', { name: /프로젝트 (보기|섹션으로 이동)/ }).first();
      if ((await cta.count()) === 0) {
        record({ kind: 'functional', viewport, item: 'Hero CTA 버튼 클릭', result: 'N/A', note: '버튼을 찾을 수 없음' });
        return;
      }
      const before = await page.evaluate(() => window.scrollY);
      await cta.click();
      await page.waitForTimeout(500);
      const after = await page.evaluate(() => window.scrollY);
      const moved = after !== before;
      record({
        kind: 'functional',
        viewport,
        item: 'Hero CTA 버튼 클릭',
        result: moved ? 'PASS' : 'FAIL',
        note: `scrollY ${before} -> ${after}`,
      });
    });

    // 프로젝트 상세 진입 테스트 — ORDERED SIGNAL 2차 수정으로 Home의 대표 프로젝트
    // "상세보기" 버튼은 모달을 여는 대신 /projects/:slug 상세 페이지로 이동한다.
    // 모달 자체는 /projects의 Archive 항목에만 남아 있고 Home에는 없으므로, 여기서는
    // 라우트 이동 여부를 확인한다.
    await test.step('프로젝트 상세 페이지 이동/캡처 테스트', async () => {
      const urlBefore = page.url();
      await gotoHome(page);
      const detailButton = page.getByRole('link', { name: /과정\s*보기|상세\s*보기|view|detail/i }).first();
      if ((await detailButton.count()) === 0) {
        recordRequiredMissing(viewport, '프로젝트 상세 페이지 이동', '상세 CTA(link)를 찾을 수 없음');
        const file = `${viewport}-project-detail.png`;
        record({ kind: 'screenshot', viewport, section: 'Project Detail', file, ok: false, remark: '상세로 이동하는 link를 찾을 수 없음' });
        return;
      }
      await detailButton.click();
      await page.waitForTimeout(500);
      const navigated = /\/projects\/[^/?#]+/.test(page.url());
      record({
        kind: 'functional',
        viewport,
        item: '프로젝트 상세 페이지 이동',
        result: navigated ? 'PASS' : 'FAIL',
        note: `url ${urlBefore} -> ${page.url()}`,
      });

      const file = `${viewport}-project-detail.png`;
      if (navigated) {
        const filePath = path.join(SCREENSHOT_DIR, file);
        await page.waitForTimeout(300);
        await page.screenshot({ path: filePath });
        const exists = fs.existsSync(filePath) && fs.statSync(filePath).size > 0;
        record({ kind: 'screenshot', viewport, section: 'Project Detail', file, ok: exists });

        // 뒤로가기 정상 동작 확인 (다음 테스트를 위해 Home으로 복귀)
        await page.goBack();
        await page.waitForTimeout(300);
        const backOk = !/\/projects\/[^/?#]+/.test(page.url());
        record({ kind: 'functional', viewport, item: '프로젝트 상세 페이지 뒤로가기', result: backOk ? 'PASS' : 'FAIL' });
      } else {
        record({ kind: 'screenshot', viewport, section: 'Project Detail', file, ok: false, remark: '상세 페이지로 이동하지 않음' });
      }
    });

    // Phase 4F: 예전 "내비게이션 클릭 - 연락처" 검사는 Header에 실제로 없는
    // "연락처" 텍스트 nav 항목을 찾아 모든 viewport에서 항상 N/A만 반복 기록하던
    // 옛 UI 구조 검사였다(ChatGPT가 실제 report.md에서 재현 확인) — 기능 결함이
    // 아니라 검사 자체가 쓸모없는 상태였다. 실제 존재하는 Contact 진입점 4가지
    // (Header MAIL, Contact section 존재/heading, 메일 보내기, GitHub 보기)로
    // 교체한다. 전부 필수 항목이라 못 찾으면 N/A가 아니라 FAIL로 기록한다.
    await test.step('Contact 진입점 확인 (Header MAIL / Contact section / 메일 보내기 / GitHub 보기)', async () => {
      await gotoHome(page);

      // Desktop nav의 MAIL은 <header> 안에 직접 있지만, mobile/tablet은 이 nav
      // 자체가 display:none이고(햄버거로 대체) 실제 mail 진입점은 MUI Drawer(모바일
      // 메뉴) 하단 CTA다 — Drawer는 Modal 기반이라 DOM상 <header> 밖(portal)에
      // 렌더링된다. 데스크톱 전용 UI가 없는 게 정상인 viewport에서 FAIL로 잘못
      // 기록하지 않도록, 안 보이면 모바일 메뉴를 열어 그 안에서 다시 확인한다.
      const headerMail = page.locator('header').getByRole('link', { name: '이메일 보내기' }).first();
      const headerMailVisible = (await headerMail.count()) > 0 && (await headerMail.isVisible());
      if (headerMailVisible) {
        record({ kind: 'functional', viewport, item: 'Header MAIL', result: 'PASS' });
      } else {
        const menuToggle = page.getByRole('button', { name: '메뉴 열기' }).first();
        if ((await menuToggle.count()) === 0) {
          recordRequiredMissing(viewport, 'Header MAIL', 'Header MAIL link도 메뉴 열기 버튼도 찾을 수 없음');
        } else {
          await menuToggle.click();
          await page.waitForTimeout(300);
          const drawerMail = page.getByRole('link', { name: '이메일 보내기' }).first();
          const drawerMailOk = (await drawerMail.count()) > 0 && (await drawerMail.isVisible());
          if (drawerMailOk) {
            record({ kind: 'functional', viewport, item: 'Header MAIL', result: 'PASS', note: '모바일 메뉴 안에서 확인' });
          } else {
            recordRequiredMissing(viewport, 'Header MAIL', '모바일 메뉴를 연 뒤에도 이메일 보내기 link를 찾을 수 없음');
          }
          await page.keyboard.press('Escape').catch(() => {});
          await page.waitForTimeout(200);
        }
      }

      const contactSection = page.locator('#contact');
      const contactExists = (await contactSection.count()) > 0;
      if (!contactExists) {
        recordRequiredMissing(viewport, 'Contact section 존재', '#contact 섹션을 찾을 수 없음');
      } else {
        const heading = await contactSection.locator('h2').first().textContent().catch(() => null);
        const headingOk = Boolean(heading && heading.trim().length > 0);
        record({
          kind: 'functional', viewport, item: 'Contact section heading',
          result: headingOk ? 'PASS' : 'FAIL', note: heading ?? '(heading 없음)',
        });
      }

      const mailCta = contactSection.getByRole('link', { name: '이메일 보내기' }).first();
      if ((await mailCta.count()) === 0) {
        recordRequiredMissing(viewport, 'Contact 메일 보내기', 'Contact section 안에서 이메일 보내기 link를 찾을 수 없음');
      } else {
        record({ kind: 'functional', viewport, item: 'Contact 메일 보내기', result: 'PASS' });
      }

      const githubCta = contactSection.getByRole('link', { name: 'GitHub 프로필 새 탭에서 열기' }).first();
      if ((await githubCta.count()) === 0) {
        recordRequiredMissing(viewport, 'Contact GitHub 보기', 'Contact section 안에서 GitHub 프로필 link를 찾을 수 없음');
      } else {
        record({ kind: 'functional', viewport, item: 'Contact GitHub 보기', result: 'PASS' });
      }
    });

    // 상단 내비게이션 - 프로젝트 (전용 라우트로 이동, 확인 후 홈으로 복귀)
    // ORDERED SIGNAL 리디자인 이후 헤더 라벨이 "프로젝트"에서 Figma 원문 "PROJECTS"로
    // 바뀌었다(42:3 Navigation). 실제 화면에 표시된 라벨 기준으로 찾는다.
    await test.step('상단 내비게이션 클릭 테스트 - 프로젝트', async () => {
      await gotoHome(page);
      const urlBefore = page.url();
      const scrollBefore = await page.evaluate(() => window.scrollY);
      // desktop nav item의 accessible name은 정확히 "PROJECTS"지만, mobile Drawer
      // 항목은 설명 텍스트("전체 작업")가 같은 링크 안에 있어 accessible name이
      // "PROJECTS 전체 작업"처럼 길어진다(숫자 배지는 aria-hidden으로 이미 제외됨).
      // 두 경우를 모두 잡기 위해 정확히 "PROJECTS"로 시작하는지만 확인한다(실제
      // 발견: exact 매칭으로는 mobile/tablet에서 진짜 존재하는 link를 놓쳐 FAIL로
      // 잘못 기록됐었다).
      const nav = await getNavLink(page, /^PROJECTS/);
      if ((await nav.count()) === 0) {
        recordRequiredMissing(viewport, '내비게이션 클릭 - 프로젝트', 'PROJECTS link를 찾을 수 없음');
        return;
      }
      await nav.click();
      await page.waitForTimeout(600);
      const urlAfter = page.url();
      const scrollAfter = await page.evaluate(() => window.scrollY);
      const changed = urlAfter !== urlBefore || scrollAfter !== scrollBefore;
      record({
        kind: 'functional',
        viewport,
        item: '내비게이션 클릭 - 프로젝트',
        result: changed ? 'PASS' : 'FAIL',
        note: `url ${urlBefore} -> ${urlAfter}, scrollY ${scrollBefore} -> ${scrollAfter}`,
      });
    });

    // "모든 프로젝트 보기" 버튼 - URL, 스크롤 위치, DOM 변화 중 하나라도 있는지 확인
    await test.step('"모든 프로젝트 보기" 버튼 테스트', async () => {
      await gotoHome(page);
      const btn = page.getByRole('link', { name: /모든 프로젝트 보기|전체 프로젝트/ }).first();
      if ((await btn.count()) === 0) {
        recordRequiredMissing(viewport, '모든 프로젝트 보기 버튼', '전체 프로젝트 보기 link를 찾을 수 없음');
        return;
      }
      const urlBefore = page.url();
      const scrollBefore = await page.evaluate(() => window.scrollY);
      const domBefore = await page.evaluate(() => document.body.innerHTML.length);
      await btn.click();
      await page.waitForTimeout(600);
      const urlAfter = page.url();
      const scrollAfter = await page.evaluate(() => window.scrollY);
      const domAfter = await page.evaluate(() => document.body.innerHTML.length);
      const changed = urlAfter !== urlBefore || scrollAfter !== scrollBefore || domAfter !== domBefore;
      record({
        kind: 'functional',
        viewport,
        item: '모든 프로젝트 보기 버튼',
        result: changed ? 'PASS' : 'FAIL',
        note: `url ${urlBefore} -> ${urlAfter}`,
      });
    });

    for (const err of consoleErrors) {
      record({ kind: 'consoleError', viewport, message: err });
    }
    record({ kind: 'consoleErrorSummary', viewport, count: consoleErrors.length });
  });
});
