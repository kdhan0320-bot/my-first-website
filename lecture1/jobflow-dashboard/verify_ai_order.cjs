const { chromium } = require("playwright");

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1280, height: 900 });

  await page.goto("https://kdhan0320-bot.github.io/my-first-website/my-portfolio/#/projects");
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(1800);

  const aiTab = page.locator("button", { hasText: "AI Vibe Coding" });
  await aiTab.first().click();
  await page.waitForTimeout(800);
  await page.screenshot({ path: "C:/Users/User/Desktop/ai_order_check.png", fullPage: true });

  // 카드 제목 순서 추출
  const titles = await page.locator('[class*="MuiCard"] [class*="MuiCardContent"] [style*="font-weight: 700"]').allTextContents();
  console.log("AI 필터 카드 순서:", titles.filter(t => t.trim().length > 2));

  await browser.close();
})();
