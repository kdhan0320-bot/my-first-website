const { chromium } = require("playwright");

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1280, height: 900 });

  await page.goto("https://kdhan0320-bot.github.io/my-first-website/my-portfolio/#/projects");
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(2000);

  const aiTab = page.locator("button", { hasText: "AI Vibe Coding" });
  await aiTab.first().click();
  await page.waitForTimeout(1000);
  await page.screenshot({ path: "C:/Users/User/Desktop/ai_order_check.png", fullPage: true });

  // 카드 aria-label로 순서 추출
  const cards = await page.locator('[aria-label*="프로젝트"]').allTextContents();
  console.log("카드 수:", cards.length);

  // 페이지 HTML에서 프로젝트 제목 순서 확인
  const html = await page.content();
  const jobflowIdx = html.indexOf("JobFlow Dashboard");
  const minisnsIdx = html.indexOf("Mini SNS");
  const feedbackIdx = html.indexOf("Portfolio Feedback Hub");
  const ottIdx = html.indexOf("OTT Service");
  console.log("JobFlow index:", jobflowIdx);
  console.log("Mini SNS index:", minisnsIdx);
  console.log("Portfolio Feedback Hub index:", feedbackIdx);
  console.log("OTT Service index:", ottIdx);
  console.log("순서 (index 오름차순):",
    [["JobFlow", jobflowIdx], ["Mini SNS", minisnsIdx], ["Feedback Hub", feedbackIdx], ["OTT", ottIdx]]
    .sort((a, b) => a[1] - b[1])
    .map(x => x[0])
    .join(" → ")
  );

  await browser.close();
})();
