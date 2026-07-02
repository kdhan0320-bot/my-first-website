const { chromium } = require("playwright");

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1280, height: 800 });

  await page.goto("https://kdhan0320-bot.github.io/my-first-website/my-portfolio/");
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(1500);

  await page.evaluate(() => {
    const el = document.getElementById("projects");
    if (el) el.scrollIntoView({ behavior: "instant" });
  });
  await page.waitForTimeout(800);

  // fullPage로 전체 섹션 캡처
  await page.screenshot({ path: "C:/Users/User/Desktop/pf_minisns_full.png", fullPage: true });

  // Mini SNS 카드 존재 위치 확인
  const miniCard = page.locator('[aria-label="Mini SNS 프로젝트 카드"]');
  const box = await miniCard.boundingBox();
  console.log("MINISNS_CARD_POSITION:", JSON.stringify(box));

  // 모달 상단
  await page.screenshot({ path: "C:/Users/User/Desktop/pf_minisns_02_modal_top.png" });

  await browser.close();
})();
