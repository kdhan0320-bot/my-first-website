const { chromium } = require("playwright");

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1280, height: 800 });

  await page.goto("https://kdhan0320-bot.github.io/my-first-website/my-portfolio/");
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(1500);

  // Projects 섹션으로 스크롤
  await page.evaluate(() => {
    const el = document.getElementById("projects");
    if (el) el.scrollIntoView({ behavior: "instant" });
  });
  await page.waitForTimeout(1000);

  // JobFlow 카드의 View Detail 버튼 클릭 (JobFlow 카드 안에 있는 버튼)
  const jobflowCard = page.locator('[aria-label="JobFlow Dashboard 프로젝트 카드"]');
  await jobflowCard.locator("button", { hasText: "View Detail" }).click();
  await page.waitForTimeout(1000);
  await page.screenshot({ path: "C:/Users/User/Desktop/pf_05_jobflow_modal_top.png", fullPage: false });

  const modalHtml = await page.content();
  console.log("MODAL_TITLE_JOBFLOW:", modalHtml.includes("JobFlow Dashboard"));
  console.log("MODAL_AI_CONTRIBUTION:", modalHtml.includes("AI Contribution"));
  console.log("MODAL_LIMITATION:", modalHtml.includes("Limitation"));
  console.log("MODAL_UXUI_POINT:", modalHtml.includes("UX/UI Point"));
  console.log("MODAL_TARGET_USER:", modalHtml.includes("Target User"));
  console.log("MODAL_OVERVIEW_TEXT:", modalHtml.includes("흩어지기 쉬운"));

  // 모달 다이얼로그 안을 스크롤해서 하단 AI Contribution 확인
  const dialogContent = page.locator('[role="dialog"] [class*="MuiDialogContent"]');
  await dialogContent.evaluate(el => el.scrollTop = el.scrollHeight);
  await page.waitForTimeout(500);
  await page.screenshot({ path: "C:/Users/User/Desktop/pf_06_jobflow_modal_bottom.png", fullPage: false });

  // 모달 닫기
  await page.keyboard.press("Escape");
  await page.waitForTimeout(500);

  // Projects 전체 페이지에서 AI 필터 탭 확인
  await page.goto("https://kdhan0320-bot.github.io/my-first-website/my-portfolio/#/projects");
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(1500);
  await page.screenshot({ path: "C:/Users/User/Desktop/pf_07_projects_all.png", fullPage: true });

  // AI Vibe Coding 필터 클릭
  const aiTab = page.locator("button", { hasText: "AI Vibe Coding" });
  if (await aiTab.count() > 0) {
    await aiTab.first().click();
    await page.waitForTimeout(800);
    await page.screenshot({ path: "C:/Users/User/Desktop/pf_08_ai_filter.png", fullPage: true });
    const aiHtml = await page.content();
    console.log("AI_FILTER_HAS_JOBFLOW:", aiHtml.includes("JobFlow Dashboard"));
    console.log("AI_FILTER_HAS_MINISNS:", aiHtml.includes("겜스타그램"));
    console.log("AI_FILTER_HAS_FEEDBACKHUB:", aiHtml.includes("Portfolio Feedback Hub"));
  } else {
    console.log("AI_TAB_NOT_FOUND: true");
  }

  await browser.close();
})();
