const { chromium } = require("playwright");

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1280, height: 900 });

  // 전체 프로젝트 AI 필터 순서 확인
  await page.goto("https://kdhan0320-bot.github.io/my-first-website/my-portfolio/#/projects");
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(1800);
  const aiTab = page.locator("button", { hasText: "AI Vibe Coding" });
  await aiTab.first().click();
  await page.waitForTimeout(800);
  await page.screenshot({ path: "C:/Users/User/Desktop/pf_ott_filter.png", fullPage: true });

  const aiHtml = await page.content();
  const idxJobflow = aiHtml.indexOf("JobFlow Dashboard");
  const idxMiniSNS = aiHtml.indexOf("Mini SNS");
  const idxComm    = aiHtml.indexOf("my-community");
  const idxOTT     = aiHtml.indexOf("OTT Service");
  const order = [["JobFlow",idxJobflow],["Mini SNS",idxMiniSNS],["my-community",idxComm],["OTT",idxOTT]]
    .sort((a,b)=>a[1]-b[1]).map(x=>x[0]).join(" → ");
  console.log("AI 필터 순서:", order);
  console.log("HAS_VISUAL_WEB_UI:", aiHtml.includes("AI-assisted Visual Web UI"));
  console.log("HAS_AI_BADGE:", aiHtml.includes("AI-assisted"));

  // OTT Service 카드 View Detail
  const ottCard = page.locator('[aria-label="OTT Service 프로젝트"]');
  if (await ottCard.count() > 0) {
    await ottCard.locator("button", { hasText: "View Detail" }).click();
    await page.waitForTimeout(800);
    await page.screenshot({ path: "C:/Users/User/Desktop/pf_ott_modal.png" });
    const modalHtml = await page.content();
    console.log("MODAL_AI_CONTRIBUTION:", modalHtml.includes("AI Contribution"));
    console.log("MODAL_LIMITATION:", modalHtml.includes("Limitation"));
    console.log("MODAL_LIVE_DEMO:", modalHtml.includes("Live Demo"));
    console.log("MODAL_GITHUB:", modalHtml.includes("GitHub"));
    console.log("MODAL_TOOLS_HTML:", modalHtml.includes(">HTML<") || modalHtml.includes("HTML"));
    console.log("MODAL_NO_REACT:", !modalHtml.includes(">React<"));
  }

  await browser.close();
})();
