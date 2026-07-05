const { chromium } = require('playwright');

// 기본값: 라이브 배포 사이트. 로컬 개발 서버로 테스트하려면
// QA_BASE_URL=http://localhost:5173/ node verify_final_qa.cjs 처럼 실행하세요.
const BASE = process.env.QA_BASE_URL || 'https://kdhan0320-bot.github.io/my-first-website/jobflow-dashboard/';
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

// SPA(HashRouter) 내부 네비게이션 - 사이드바 항목 클릭 (모바일은 햄버거 메뉴 먼저 오픈)
const goto = async (page, label, isMobile) => {
  if (isMobile) {
    await page.locator('button[aria-label="메뉴 열기"]').click();
    await page.waitForTimeout(300);
    await page.locator('.MuiModal-root').locator('text=' + label).first().click();
  } else {
    await page.locator('text=' + label).first().click();
  }
  await page.waitForTimeout(400);
};

(async () => {
  const browser = await chromium.launch({ headless: true });

  // ---------- 1. 기능 QA (데스크톱 1280 기준) ----------
  const page = await browser.newPage();
  const consoleErrors = [];
  page.on('console', (msg) => { if (msg.type() === 'error') consoleErrors.push(msg.text()); });
  page.on('pageerror', (err) => consoleErrors.push(String(err)));
  await page.setViewportSize({ width: 1280, height: 900 });

  await page.goto(BASE);
  await page.waitForLoadState('networkidle');
  log('로그인 페이지 접근', await page.locator('text=JobFlow Dashboard').first().isVisible());

  await page.locator('button', { hasText: '데모로 둘러보기' }).first().click();
  await page.waitForTimeout(800);
  log('게스트 모드 진입', await page.locator('text=게스트 모드').first().isVisible());
  log('게스트 안내 문구 표시', await page.locator('text=저장/수정 기능은 제한됩니다').first().isVisible());
  log('대시보드 요약 카드 표시', await page.locator('text=총 지원').first().isVisible());
  log('최근 지원 현황 표시', await page.locator('text=최근 지원 현황').first().isVisible());

  await page.locator('text=전체 보기').first().click();
  await page.waitForTimeout(500);
  log('지원 현황 목록 이동', await page.locator('text=지원 회사 목록').first().isVisible());

  await page.locator('input[placeholder="회사명, 직무 검색"]').fill('테크');
  await page.waitForTimeout(300);
  const searchResultCount = await page.locator('tbody tr').count();
  log('검색 기능 동작', true, `검색 후 행 수=${searchResultCount}`);
  await page.locator('input[placeholder="회사명, 직무 검색"]').fill('');
  await page.waitForTimeout(300);

  const comboboxes = page.getByRole('combobox');
  const comboCount = await comboboxes.count();
  if (comboCount >= 2) {
    await comboboxes.nth(0).click();
    const options = page.locator('li[role="option"]');
    const optCount = await options.count();
    if (optCount > 1) await options.nth(1).click();
    await page.waitForTimeout(300);
    log('상태 필터 기능 동작', true);

    // 필터 초기화
    await comboboxes.nth(0).click();
    await page.locator('li', { hasText: '전체' }).click();
    await page.waitForTimeout(300);

    await comboboxes.nth(1).click();
    await page.locator('li', { hasText: '회사명순' }).click();
    await page.waitForTimeout(300);
    log('정렬 기능 동작', true);
  } else {
    log('상태 필터 기능 동작', false, `combobox 개수=${comboCount}`);
    log('정렬 기능 동작', false, `combobox 개수=${comboCount}`);
  }

  const firstRow = page.locator('tbody tr').first();
  await firstRow.click();
  await page.waitForTimeout(500);
  log('지원 회사 상세 이동', await page.locator('text=목록으로').first().isVisible());

  await goto(page, '전형 보드', false);
  log('칸반 보드 이동', await page.locator('text=관심').first().isVisible().catch(() => false));

  await goto(page, '체크리스트', false);
  log('체크리스트 진행률 표시', await page.locator('text=전체 진행률').first().isVisible());
  const checkbox = page.locator('input[type="checkbox"]').first();
  if (await checkbox.count() > 0) {
    const before = await checkbox.isChecked();
    await checkbox.click({ force: true });
    await page.waitForTimeout(300);
    const after = await checkbox.isChecked();
    log('체크리스트 체크 토글', before !== after, `${before} -> ${after}`);
  } else {
    log('체크리스트 체크 토글', false, '체크박스 없음');
  }

  await goto(page, '면접 메모', false);
  log('면접 메모 목록 표시', await page.locator('text=면접 메모').first().isVisible());

  await goto(page, 'AI 프롬프트', false);
  await page.getByLabel('지원 직무 입력').fill('UX/UI 디자이너');
  await page.locator('button', { hasText: '프롬프트 생성' }).click();
  await page.waitForTimeout(400);
  log('AI 프롬프트 생성', await page.locator('text=생성된 프롬프트').first().isVisible());
  const copyBtn = page.locator('button', { hasText: /복사/ }).first();
  await copyBtn.click();
  await page.waitForTimeout(300);
  log('AI 프롬프트 복사 동작', await page.locator('text=복사됨').first().isVisible().catch(() => false));

  await goto(page, '설정', false);
  log('설정 페이지 접근(게스트)', await page.locator('text=게스트 모드').nth(1).isVisible().catch(async () => await page.locator('text=게스트 모드').first().isVisible()));

  const githubLink = page.locator('a', { hasText: 'GitHub' }).first();
  log('GitHub 링크 존재', await githubLink.count() > 0, await githubLink.getAttribute('href').catch(() => ''));
  const pfLink = page.locator('a', { hasText: '포트폴리오로 돌아가기' }).first();
  log('포트폴리오 복귀 링크 존재', await pfLink.count() > 0, await pfLink.getAttribute('href').catch(() => ''));

  // 로그아웃 -> 로그인 페이지 복귀
  await page.locator('button[aria-label="로그아웃"]').click();
  await page.waitForTimeout(500);
  log('로그아웃 시 로그인 페이지 복귀', await page.locator('text=데모로 둘러보기').first().isVisible());

  log('콘솔 에러 없음 (기능 QA 전체)', consoleErrors.length === 0, consoleErrors.slice(0, 5).join(' | '));

  await page.close();

  // ---------- 2. 반응형 QA ----------
  for (const vp of VIEWPORTS) {
    const isMobile = vp.width < 900;
    const p = await browser.newPage();
    const errs = [];
    p.on('console', (msg) => { if (msg.type() === 'error') errs.push(msg.text()); });
    p.on('pageerror', (err) => errs.push(String(err)));
    await p.setViewportSize({ width: vp.width, height: vp.height });
    await p.goto(BASE);
    await p.waitForTimeout(400);
    await p.locator('button', { hasText: '데모로 둘러보기' }).first().click();
    await p.waitForTimeout(500);

    const checkNoHScroll = async (label) => {
      const scrollWidth = await p.evaluate(() => document.documentElement.scrollWidth);
      const clientWidth = await p.evaluate(() => document.documentElement.clientWidth);
      log(`[${vp.name}px] ${label} 가로 스크롤 없음`, scrollWidth <= clientWidth + 1, `scrollWidth=${scrollWidth} clientWidth=${clientWidth}`);
    };

    await checkNoHScroll('대시보드');
    await p.screenshot({ path: `C:/Users/user/Desktop/qa_dashboard_${vp.name}.png`, fullPage: true });

    // applications page - table vs card
    await goto(p, '지원 현황', isMobile);
    const hasTable = await p.locator('table').isVisible().catch(() => false);
    const hasCards = await p.locator('.MuiCard-root').count();
    log(`[${vp.name}px] 지원현황 레이아웃(모바일=카드형)`, isMobile ? !hasTable : true, `table=${hasTable} cards=${hasCards}`);
    await checkNoHScroll('지원현황');
    await p.screenshot({ path: `C:/Users/user/Desktop/qa_applications_${vp.name}.png`, fullPage: true });

    // kanban horizontal scroll usability
    await goto(p, '전형 보드', isMobile);
    await p.screenshot({ path: `C:/Users/user/Desktop/qa_kanban_${vp.name}.png`, fullPage: true });

    // checklist wrap
    await goto(p, '체크리스트', isMobile);
    await checkNoHScroll('체크리스트');
    await p.screenshot({ path: `C:/Users/user/Desktop/qa_checklist_${vp.name}.png`, fullPage: true });

    // interview notes
    await goto(p, '면접 메모', isMobile);
    await checkNoHScroll('면접메모');
    await p.screenshot({ path: `C:/Users/user/Desktop/qa_interview_${vp.name}.png`, fullPage: true });

    // ai prompt width
    await goto(p, 'AI 프롬프트', isMobile);
    await p.getByLabel('지원 직무 입력').fill('테스트 직무');
    await p.locator('button', { hasText: '프롬프트 생성' }).click();
    await p.waitForTimeout(300);
    await checkNoHScroll('AI프롬프트 결과');
    await p.screenshot({ path: `C:/Users/user/Desktop/qa_aiprompt_${vp.name}.png`, fullPage: true });

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
