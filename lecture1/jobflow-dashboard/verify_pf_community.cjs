const { chromium } = require("playwright");

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1280, height: 900 });

  await page.goto("https://kdhan0320-bot.github.io/my-first-website/my-portfolio/");
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(1500);

  // Projects 섹션 스크롤
  await page.evaluate(() => {
    const el = document.getElementById("projects");
    if (el) el.scrollIntoView({ behavior: "instant" });
  });
  await page.waitForTimeout(800);

  const html = await page.content();
  console.log("HAS_MY_COMMUNITY:", html.includes("my-community"));
  console.log("HAS_AI_COMMUNITY_BOARD:", html.includes("AI-assisted Community Board"));

  // 전체 프로젝트 AI 필터 순서 확인
  await page.goto("https://kdhan0320-bot.github.io/my-first-website/my-portfolio/#/projects");
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(1500);
  const aiTab = page.locator("button", { hasText: "AI Vibe Coding" });
  await aiTab.first().click();
  await page.waitForTimeout(800);
  await page.screenshot({ path: "C:/Users/User/Desktop/pf_comm_ai_filter.png", fullPage: true });

  const aiHtml = await page.content();
  const jobflowIdx = aiHtml.indexOf("JobFlow Dashboard");
  const minisnsIdx = aiHtml.indexOf("Mini SNS");
  const commIdx = aiHtml.indexOf("my-community");
  const ottIdx = aiHtml.indexOf("OTT Service");
  console.log("AI 필터 순서:", [["JobFlow", jobflowIdx], ["Mini SNS", minisnsIdx], ["my-community", commIdx], ["OTT", ottIdx]].sort((a,b)=>a[1]-b[1]).map(x=>x[0]).join(" → "));

  // my-community 카드 View Detail 클릭
  const commCard = page.locator('[aria-label="my-community 프로젝트"]');
  if (await commCard.count() > 0) {
    await commCard.locator("button", { hasText: "View Detail" }).click();
    await page.waitForTimeout(800);
    await page.screenshot({ path: "C:/Users/User/Desktop/pf_comm_modal.png" });
    const modalHtml = await page.content();
    console.log("MODAL_AI_CONTRIBUTION:", modalHtml.includes("AI Contribution"));
    console.log("MODAL_LIMITATION:", modalHtml.includes("Limitation"));
    console.log("MODAL_LIVE_DEMO:", modalHtml.includes("Live Demo"));
    console.log("MODAL_GITHUB:", modalHtml.includes("GitHub"));
  }

  await browser.close();
})();
