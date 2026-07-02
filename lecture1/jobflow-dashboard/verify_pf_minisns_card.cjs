const { chromium } = require("playwright");

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1280, height: 900 });

  await page.goto("https://kdhan0320-bot.github.io/my-first-website/my-portfolio/");
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(1500);

  // Mini SNS 카드로 직접 스크롤
  const miniCard = page.locator('[aria-label="Mini SNS 프로젝트 카드"]');
  await miniCard.scrollIntoViewIfNeeded();
  await page.waitForTimeout(800);
  await page.screenshot({ path: "C:/Users/User/Desktop/pf_minisns_card_view.png" });

  // View Detail 모달
  await miniCard.locator("button", { hasText: "View Detail" }).click();
  await page.waitForTimeout(1000);
  await page.screenshot({ path: "C:/Users/User/Desktop/pf_minisns_modal_top.png" });

  const dialogContent = page.locator('[role="dialog"] [class*="MuiDialogContent"]');
  await dialogContent.evaluate(el => el.scrollTop = el.scrollHeight);
  await page.waitForTimeout(500);
  await page.screenshot({ path: "C:/Users/User/Desktop/pf_minisns_modal_bottom.png" });

  await page.keyboard.press("Escape");
  await page.waitForTimeout(500);

  // AI 필터 전체 확인
  await page.goto("https://kdhan0320-bot.github.io/my-first-website/my-portfolio/#/projects");
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(1500);
  const aiTab = page.locator("button", { hasText: "AI Vibe Coding" });
  if (await aiTab.count() > 0) {
    await aiTab.first().click();
    await page.waitForTimeout(800);
    await page.screenshot({ path: "C:/Users/User/Desktop/pf_minisns_ai_filter.png", fullPage: true });
  }

  await browser.close();
})();
