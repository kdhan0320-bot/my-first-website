const { chromium } = require("playwright");

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1280, height: 800 });

  // 1. 포트폴리오 메인 - Projects 섹션
  await page.goto("https://kdhan0320-bot.github.io/my-first-website/my-portfolio/");
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(1500);

  // Projects 섹션으로 스크롤
  await page.evaluate(() => {
    const el = document.getElementById("projects");
    if (el) el.scrollIntoView({ behavior: "instant" });
  });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: "C:/Users/User/Desktop/pf_01_projects.png", fullPage: false });

  const html = await page.content();
  console.log("HAS_JOBFLOW_CARD:", html.includes("JobFlow Dashboard"));
  console.log("HAS_AI_ASSISTED_DASHBOARD:", html.includes("AI-assisted Dashboard"));
  console.log("HAS_AI_ASSISTED_BADGE:", html.includes("AI-assisted"));
  console.log("HAS_MINI_SNS:", html.includes("겜스타그램") || html.includes("Mini SNS"));

  // 2. JobFlow View Detail 클릭
  const viewDetailBtn = page.locator("button", { hasText: "View Detail" }).first();
  await viewDetailBtn.click();
  await page.waitForTimeout(1000);
  await page.screenshot({ path: "C:/Users/User/Desktop/pf_02_jobflow_detail.png", fullPage: false });

  const modalHtml = await page.content();
  console.log("MODAL_HAS_OVERVIEW:", modalHtml.includes("Project Overview"));
  console.log("MODAL_HAS_AI_CONTRIBUTION:", modalHtml.includes("AI Contribution"));
  console.log("MODAL_HAS_LIMITATION:", modalHtml.includes("Limitation"));
  console.log("MODAL_HAS_UXUI_POINT:", modalHtml.includes("UX/UI Point"));
  console.log("MODAL_HAS_TARGET_USER:", modalHtml.includes("Target User"));
  console.log("MODAL_HAS_LIVE_DEMO_BTN:", modalHtml.includes("Live Demo"));
  console.log("MODAL_HAS_GITHUB_BTN:", modalHtml.includes("GitHub"));

  // 3. 모달 스크롤해서 하단 확인
  const dialog = page.locator('[role="dialog"]');
  await dialog.evaluate(el => el.scrollTop = el.scrollHeight);
  await page.waitForTimeout(500);
  await page.screenshot({ path: "C:/Users/User/Desktop/pf_03_modal_bottom.png", fullPage: false });

  // 4. 모달 닫고 모바일 확인
  await page.keyboard.press("Escape");
  await page.waitForTimeout(500);
  await page.setViewportSize({ width: 375, height: 812 });
  await page.evaluate(() => {
    const el = document.getElementById("projects");
    if (el) el.scrollIntoView({ behavior: "instant" });
  });
  await page.waitForTimeout(800);
  await page.screenshot({ path: "C:/Users/User/Desktop/pf_04_mobile.png", fullPage: false });

  await browser.close();
})();
