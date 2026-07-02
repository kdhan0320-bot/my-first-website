const { chromium } = require("playwright");

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1280, height: 800 });

  await page.goto("https://kdhan0320-bot.github.io/my-first-website/my-portfolio/");
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(1500);

  // Projects 섹션 스크롤
  await page.evaluate(() => {
    const el = document.getElementById("projects");
    if (el) el.scrollIntoView({ behavior: "instant" });
  });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: "C:/Users/User/Desktop/pf_minisns_01_projects.png" });

  const html = await page.content();
  console.log("HAS_MINISNS_CARD:", html.includes("Mini SNS"));
  console.log("HAS_AI_SOCIAL_APP:", html.includes("AI-assisted Social App"));
  console.log("HAS_AI_BADGE:", html.includes("AI-assisted"));

  // Mini SNS 카드 View Detail 클릭
  const miniSNSCard = page.locator('[aria-label="Mini SNS 프로젝트 카드"]');
  const cardExists = await miniSNSCard.count() > 0;
  console.log("MINISNS_CARD_EXISTS:", cardExists);

  if (cardExists) {
    await miniSNSCard.locator("button", { hasText: "View Detail" }).click();
    await page.waitForTimeout(1000);
    await page.screenshot({ path: "C:/Users/User/Desktop/pf_minisns_02_modal_top.png" });

    const modalHtml = await page.content();
    console.log("MODAL_TITLE:", modalHtml.includes("Mini SNS"));
    console.log("MODAL_OVERVIEW:", modalHtml.includes("여러 사용자 흐름"));
    console.log("MODAL_AI_CONTRIBUTION:", modalHtml.includes("AI Contribution"));
    console.log("MODAL_LIMITATION:", modalHtml.includes("Limitation"));
    console.log("MODAL_TARGET_USER:", modalHtml.includes("Target User"));
    console.log("MODAL_LIVE_DEMO:", modalHtml.includes("Live Demo"));
    console.log("MODAL_GITHUB:", modalHtml.includes("GitHub"));

    // 모달 스크롤 하단
    const dialogContent = page.locator('[role="dialog"] [class*="MuiDialogContent"]');
    await dialogContent.evaluate(el => el.scrollTop = el.scrollHeight);
    await page.waitForTimeout(500);
    await page.screenshot({ path: "C:/Users/User/Desktop/pf_minisns_03_modal_bottom.png" });

    await page.keyboard.press("Escape");
    await page.waitForTimeout(500);
  }

  // 전체 프로젝트 AI 필터에서 순서 확인
  await page.goto("https://kdhan0320-bot.github.io/my-first-website/my-portfolio/#/projects");
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(1500);

  const aiTab = page.locator("button", { hasText: "AI Vibe Coding" });
  if (await aiTab.count() > 0) {
    await aiTab.first().click();
    await page.waitForTimeout(800);
    await page.screenshot({ path: "C:/Users/User/Desktop/pf_minisns_04_ai_filter.png" });
    const aiHtml = await page.content();
    console.log("AI_FILTER_JOBFLOW:", aiHtml.includes("JobFlow Dashboard"));
    console.log("AI_FILTER_MINISNS:", aiHtml.includes("Mini SNS"));
    console.log("AI_FILTER_FEEDBACK:", aiHtml.includes("Portfolio Feedback Hub"));
    console.log("AI_FILTER_OTT:", aiHtml.includes("OTT Service"));
  }

  await browser.close();
})();
